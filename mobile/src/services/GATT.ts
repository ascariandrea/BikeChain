import Axios from 'axios';
import * as xmlJS from 'fast-xml-parser';
import { array, findFirst } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import { ask, Reader } from 'fp-ts/lib/Reader';
import { TaskEither, taskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { sequence } from 'fp-ts/lib/Traversable';
import * as t from 'io-ts';
import * as BLE from 'react-native-ble-plx';
import * as RNFS from 'react-native-fs';
import { requestWriteAccess } from './permissions';

type PropertyValue = 'Mandatory' | 'Excluded';

interface ServiceSchema {
  Service: {
    '@_name': string;
    '@_uuid': string;
    '@_type': string;
    '@_xmlns:xsi': string;
    '@_xsi:noNamespaceSchemaLocation': string;
    Charateristics: {
      Charateristic: Array<{
        '@_name': string;
        '@_type': string;
        Properties: {
          Broadcast: PropertyValue;
          Indicate: PropertyValue;
          Notify: PropertyValue;
          Read: PropertyValue;
          ReliableWrite: PropertyValue;
          SignedWrite: PropertyValue;
          WritableAuxiliaries: PropertyValue;
          Write: PropertyValue;
          WriteWithoutResponse: PropertyValue;
        };
        Requirement: PropertyValue;
      }>;
    };
    Configurations: {
      Configuration: {
        '@_option': string;
        CharacteristicType: string;
        InformativeText: string;
        Target: string;
      };
    };
    InformativeText: {
      Abstract: string;
    };
  };
}

interface CharacteristicSchema {
  Characteristic: {
    '@_approved': 'Yes' | 'No';
    '@_last-modified': string;
    '@_name': string;
    '@_type': string;
    '@_uuid': string;
    '@_xmlns:xsi': string;
    '@_xsi:noNamespaceSchemaLocation': string;

    InformativeText: {
      Abstract: string;
    };
    Value: {
      Field: {
        '@_name': string;
        Enumerations: {
          Reserved: {
            '@_end': string;
            '@_start': string;
          };
        };
      };
      Format: 'uint8';
      Maximum: 100;
      Minimum: 0;
      Requirement: 'Mandatory';
      Unit: string;
    };
  };
}

export const characteristic = t.interface({
  uuid: t.string,
  name: t.string,
  description: t.string,
  value: t.union([t.undefined, t.string])
});

export type Characteristic = t.TypeOf<typeof characteristic>;

export const service = t.interface({
  uuid: t.string,
  name: t.string,
  type: t.string
});

export type Service = t.TypeOf<typeof service>;

const mkDir = (dirPath: string): TaskEither<Error, RNFS.ReadDirItem[]> => {
  return tryCatch(
    () => RNFS.mkdir(dirPath).then(() => RNFS.readDir(dirPath)),
    (reason: unknown) => reason as Error
  );
};

const downloadSchema = (
  filePath: string,
  baseURL: string,
  xmlFileName: string
): TaskEither<Error, string> => {
  const fromURL = `${baseURL}${xmlFileName}`;
  const toFile = `${filePath}/${xmlFileName}`;
  return tryCatch(
    () => {
      return RNFS.exists(toFile).then(exists => {
        if (!exists) {
          // console.log('Downloading from', { fromURL });
          // console.log(`Downloading to: ${toFile}`);
          return Axios.get(fromURL)
            .then(r => RNFS.writeFile(toFile, r.data, 'utf8'))
            .then(() => toFile);
        }
        return Promise.resolve(toFile);
      });
    },
    (reason: unknown) => {
      // console.log({ reason });
      return reason as Error;
    }
  );
};

const loadSchema = (xmlFilePath: string): TaskEither<Error, string> => {
  // console.log('Reading file at', xmlFilePath);
  return tryCatch(
    () => RNFS.readFile(xmlFilePath, { encoding: 'utf8' }),
    (reason: unknown) => reason as Error
  );
};

const parseSchema = <T>(xml: string): TaskEither<Error, T> => {
  return tryCatch(
    () =>
      Promise.resolve(
        xmlJS.parse(xml, {
          attributeNamePrefix: '@_',
          ignoreAttributes: false
        })
      ),
    reason => reason as Error
  );
};

export const GATTServiceParser = (schemas: ServiceSchema[]) => (
  s: BLE.Service
): Option<Service> =>
  findFirst(
    schemas,
    schema => s.uuid.indexOf(`${schema.Service['@_uuid'].toLowerCase()}-`) > 0
  ).map(schema => ({
    uuid: schema.Service['@_uuid'],
    name: schema.Service['@_name'],
    type: schema.Service['@_type'],
    charateristics: undefined
  }));

export const GATTCarateristicParser = (schemas: CharacteristicSchema[]) => (
  c: BLE.Characteristic
): Option<Characteristic> =>
  findFirst(schemas, s => {
    return c.uuid.indexOf(`${s.Characteristic['@_uuid'].toLowerCase()}-`) > 0;
  }).map(schema => ({
    uuid: schema.Characteristic['@_uuid'],
    name: schema.Characteristic['@_name'],
    type: schema.Characteristic['@_type'],
    description: schema.Characteristic.InformativeText.Abstract,
    value: undefined
  }));

export interface GATTParser {
  parseService(s: BLE.Service): Option<Service>;
  parseCharateristic(c: BLE.Characteristic): Option<Characteristic>;
}

interface GATTParserReaderConfig {
  xmlFilesDir: string;
  serviceURL: string;
  services: string[];
  charateristicURL: string;
  charateristics: string[];
}

export const GATTParserReader: Reader<
  GATTParserReaderConfig,
  TaskEither<Error, GATTParser>
> = ask<GATTParserReaderConfig>().map((c: GATTParserReaderConfig) => {
  const servicePath = `${c.xmlFilesDir}/services`;
  const characteristicPath = `${c.xmlFilesDir}/charateristcs`;

  return mkDir(servicePath)
    .chain(() => mkDir(characteristicPath))
    .chain(() => requestWriteAccess())
    .chain(() => {
      return sequence(taskEither, array)([
        ...c.services.map(_ =>
          downloadSchema(servicePath, c.serviceURL, _).chain(xmlFilePath =>
            loadSchema(xmlFilePath).chain(schema =>
              parseSchema<ServiceSchema>(schema)
            )
          )
        )
      ]);
    })
    .chain(serviceSchemas =>
      sequence(taskEither, array)([
        ...c.charateristics.map(_ =>
          downloadSchema(servicePath, c.serviceURL, _).chain(xmlFilePath =>
            loadSchema(xmlFilePath).chain(schema =>
              parseSchema<CharacteristicSchema>(schema)
            )
          )
        )
      ]).map(
        (
          charateristicSchemas: CharacteristicSchema[]
        ): [ServiceSchema[], CharacteristicSchema[]] => [
          serviceSchemas,
          charateristicSchemas
        ]
      )
    )
    .map(
      ([serviceSchemas, charateristicSchemas]): GATTParser => ({
        parseService: GATTServiceParser(serviceSchemas),
        parseCharateristic: GATTCarateristicParser(charateristicSchemas)
      })
    );
});

import { Platform } from 'react-native';
import * as RNFS from 'react-native-fs';
import { BLEManagerReader } from './ble';

export const BLEManager = BLEManagerReader.run({});

import { GATTParserReader } from './GATT';

const servicesXMLs = [
  'org.bluetooth.service.generic_access.xml',
  'org.bluetooth.service.generic_attribute.xml',
  'org.bluetooth.service.device_information.xml',
  'org.bluetooth.service.battery_service.xml'
];
const characteristicXMLs = ['org.bluetooth.characteristic.battery_level.xml'];

export const GATTParser = GATTParserReader.run({
  xmlFilesDir: Platform.select({
    ios: RNFS.DocumentDirectoryPath,
    android: RNFS.ExternalStorageDirectoryPath
  }),
  serviceURL: 'https://www.bluetooth.com/api/gatt/xmlfile?xmlFileName=',
  services: servicesXMLs,
  charateristicURL: 'https://www.bluetooth.com/api/gatt/XmlFile?xmlFileName=',
  charateristics: characteristicXMLs
});

export * from './permissions';

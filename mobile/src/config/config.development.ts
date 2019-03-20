import { Platform } from 'react-native';
import { Config } from './Config';
const config: Config = {
  NODE_ENV: 'dev',
  baseURL: `http://${
    Platform.OS === 'android' ? '192.168.1.254' : '127.0.0.1'
  }:80`,
  email: 'me@bikechain.com',
  password: 'password'
};

export { config };

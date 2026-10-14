import Config from 'react-native-config';

const DEFAULT_API_URL = 'http://10.0.2.2:8080';

export const appConfig = {
  appName: 'SplitEaseMobile',
  apiUrl: (Config.API_URL ?? DEFAULT_API_URL).replace(/\/+$/, ''),
};

export const getApiBaseUrl = (): string => appConfig.apiUrl;

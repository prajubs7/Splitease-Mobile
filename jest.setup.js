// Native modules that have no JS implementation under Jest.
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: { API_URL: 'http://10.0.2.2:8080' },
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(false),
  setGenericPassword: jest.fn().mockResolvedValue({}),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

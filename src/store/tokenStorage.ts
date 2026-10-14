import * as Keychain from 'react-native-keychain';

const SERVICE = 'splitease.accessToken';

// Persists the access token in the platform keychain/keystore (never AsyncStorage).
export const tokenStorage = {
  load: async (): Promise<string | null> => {
    try {
      const creds = await Keychain.getGenericPassword({ service: SERVICE });
      return creds ? creds.password : null;
    } catch {
      return null;
    }
  },
  save: async (token: string): Promise<void> => {
    await Keychain.setGenericPassword('token', token, { service: SERVICE });
  },
  clear: async (): Promise<void> => {
    try {
      await Keychain.resetGenericPassword({ service: SERVICE });
    } catch {
      // nothing stored or keychain unavailable: the session is gone either way
    }
  },
};

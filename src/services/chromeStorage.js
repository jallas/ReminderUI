import {createChromeStorageStateHookLocal} from 'use-chrome-storage';

const SETTINGS_KEY = 'reminder_authentication';

export const useSettingsStore = createChromeStorageStateHookLocal(SETTINGS_KEY, '');
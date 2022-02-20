import {createChromeStorageStateHookLocal} from 'use-chrome-storage';

export async function authenticationStorage(code) {
    createChromeStorageStateHookLocal('authentication',{ auth_code:code });
}
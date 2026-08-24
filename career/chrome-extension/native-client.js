import { NATIVE_HOST } from './contract.js';

export function nativeRequest(action, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, { action, payload }, (response) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }
      if (!response || response.ok !== true) {
        reject(new Error(response?.error?.message ?? 'The native host returned an invalid response.'));
        return;
      }
      resolve(response.data ?? {});
    });
  });
}

import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

export async function launchBrowser() {
  const local = process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1228/chrome-win64/chrome.exe');
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync(chromium.executablePath()) ? undefined : local && existsSync(local) ? local : undefined);
  return chromium.launch({headless:true, ...(executablePath ? {executablePath} : {})});
}

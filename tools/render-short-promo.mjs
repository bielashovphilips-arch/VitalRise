import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'deliverables/vitalrise-launch/vitalrise-teaser-15s.mp4');
// Render the shorter composition directly: bundled FFmpeg lacks xfade/setpts.
const cli=resolve(root,'video/vitalrise-demo/node_modules/@remotion/cli/remotion-cli.js');
const args=[cli,'render','src/index.ts','VitalRise-Teaser-15s',output,'--codec=h264','--crf=18','--pixel-format=yuv420p','--concurrency=2','--gl=angle'];
const browser=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (process.env.LOCALAPPDATA && resolve(process.env.LOCALAPPDATA,'ms-playwright/chromium-1228/chrome-win64/chrome.exe'));
if(browser && existsSync(browser)) args.push('--browser-executable='+browser);
const child=spawn(process.execPath,args,{cwd:resolve(root,'video/vitalrise-demo'),stdio:'inherit',windowsHide:true});
const status=await new Promise((done,reject)=>{child.on('error',reject);child.on('exit',done);});
if(status!==0) process.exit(Number(status)||1);
process.stdout.write('Created the 15-second teaser.\n');

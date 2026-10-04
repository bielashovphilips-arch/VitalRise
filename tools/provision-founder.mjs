// Operator-only key rotation. Never writes credentials into the deploy worktree.
import {randomBytes} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const privateDir = resolve(root, '.vitalrise-access');
const keyFile = resolve(privateDir, 'founder-login-20260911.json');
const instructionsFile = resolve(privateDir, 'Founder-login-20260911.txt');
if (!process.argv.includes('--rotate-approved')) throw Error('Explicit key-rotation confirmation required');
await mkdir(privateDir, {recursive:true});
const existing = await readFile(keyFile, 'utf8').catch(()=>null);
const credentials = existing ? JSON.parse(existing) : {
  url:'https://vitalrise.com.ua/founder-access',
  email:'bielashovphilips@gmail.com',
  secret:randomBytes(32).toString('base64url'),
  createdAt:new Date().toISOString()
};
if (!existing) await writeFile(keyFile, JSON.stringify(credentials, null, 2), {mode:0o600, flag:'wx'});
await writeFile(instructionsFile, '\uFEFF' + [
  'Приватний доступ власника VitalRise',
  '', 'Вхід: '+credentials.url, 'Email: '+credentials.email,
  'Founder secret: '+credentials.secret,
  '', 'Скопіюй email і Founder secret у форму входу.',
  'Після входу всі модулі доступні без оплати й без дати завершення.',
  'На іншому пристрої або після очищення даних браузера увійди повторно.',
  'Збережи ключ у менеджері паролів. Не надсилай цей файл іншим.'
].join('\r\n'), {mode:0o600});
if (process.platform==='win32') {
  const principal=process.env.USERDOMAIN+'\\'+process.env.USERNAME;
  for(const file of [keyFile,instructionsFile]) {
    const acl=spawnSync('icacls.exe',[file,'/inheritance:r','/grant:r',principal+':F','*S-1-5-18:F'],{encoding:'utf8',windowsHide:true});
    if(acl.status!==0)throw Error('Private file permission setup failed');
  }
}
for(const [name,value] of [['FOUNDER_EMAIL',credentials.email],['FOUNDER_ACCESS_SECRET',credentials.secret]]) {
  const result=spawnSync(process.execPath,[resolve(root,'node_modules/wrangler/bin/wrangler.js'),'pages','secret','put',name,'--project-name','vitalrise'],{
    cwd:root,input:value+'\n',encoding:'utf8',windowsHide:true,timeout:120000,
    env:{...process.env,CI:'1',WRANGLER_SEND_METRICS:'false'}
  });
  if(result.status!==0)throw Error(name+' update failed; credentials kept privately for retry');
  console.log(name+' updated securely');
}
console.log('Private login instructions: '+instructionsFile);

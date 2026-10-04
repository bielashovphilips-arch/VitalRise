import {spawn} from 'node:child_process';
import {mkdir,rename} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cli=resolve(root,'video/vitalrise-demo/node_modules/@remotion/cli/remotion-cli.js');
const temporary=resolve(root,'.tmp/promo-finalize');
await mkdir(temporary,{recursive:true});
// The rendering engine adds a silent AAC stream and full-range video.
// Normalize our generated exports for predictable social/mobile playback.
for(const [file,duration] of [['vitalrise-demo-30s.mp4',30],['vitalrise-teaser-15s.mp4',15]]){
  const source=resolve(root,'deliverables/vitalrise-launch',file);
  const target=resolve(temporary,file);
  const args=[cli,'ffmpeg','-hide_banner','-loglevel','error','-y','-i',source,'-map','0:v:0','-an','-vf','scale=in_range=auto:out_range=tv,format=yuv420p','-c:v','libx264','-crf','18','-preset','fast','-threads','2','-color_range','tv','-r','30','-t',String(duration),'-movflags','+faststart',target];
  const child=spawn(process.execPath,args,{cwd:root,windowsHide:true,stdio:'inherit'});
  const status=await new Promise((done,reject)=>{child.on('error',reject);child.on('exit',done);});
  if(status!==0) throw new Error('Final export failed: '+file);
  await rename(target,source);
  process.stdout.write('Finalized '+file+'\n');
}

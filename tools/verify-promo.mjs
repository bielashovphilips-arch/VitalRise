import {spawn} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {launchBrowser} from './browser.mjs';
import {startPreview} from './preview-growth.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const folder=resolve(root,'deliverables/vitalrise-launch');
const cli=resolve(root,'video/vitalrise-demo/node_modules/@remotion/cli/remotion-cli.js');
function run(args){return new Promise((done,reject)=>{
  const child=spawn(process.execPath,[cli,...args],{cwd:root,windowsHide:true});
  let stdout='',stderr='';
  child.stdout.on('data',data=>stdout+=data);
  child.stderr.on('data',data=>stderr+=data);
  child.on('error',reject);
  child.on('exit',code=>code===0?done(stdout):reject(new Error(stderr)));
});}
const masterOnly=process.argv.includes('--master-only');
const files=[['vitalrise-demo-30s.mp4',30,[2,9.333,15.667,22,27.5]],...(!masterOnly?[['vitalrise-teaser-15s.mp4',15,[2,6,12.5]]]:[])];
const report={checkedAt:new Date().toISOString(),videos:[],protectedDesignFiles:0};
for(const [file,duration] of files){
  const metadata=JSON.parse(await run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,nb_frames','-of','json',resolve(folder,file)]));
  assert.equal(metadata.streams.length,1,'Silent export should contain only one stream');
  const stream=metadata.streams[0];
  assert.equal(stream.codec_name,'h264');assert.equal(stream.width,1080);assert.equal(stream.height,1920);
  assert.equal(stream.r_frame_rate,'30/1');assert.equal(stream.pix_fmt,'yuv420p');
  assert.ok(Math.abs(Number(metadata.format.duration)-duration)<0.04);
  // Decode every video frame, not just the container header.
  await run(['ffmpeg','-v','error','-i',resolve(folder,file),'-c:v','rawvideo','-f','null','-']);
  report.videos.push({file,...metadata});
}
for(const [name,time] of [['cover.png',27.5],['demo-frame-280.png',280/30],['story-start.png',22],['story-result.png',470/30],['hook-preview.png',2]]){
  await run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',String(time),'-i',resolve(folder,files[0][0]),'-frames:v','1','-update','1',resolve(folder,name)]);
}
const protectedFiles=JSON.parse(await readFile(resolve(root,'tests/protected-design.json'),'utf8'));
for(const [file,expected] of Object.entries(protectedFiles)){
  assert.equal(createHash('sha256').update(await readFile(resolve(root,file))).digest('hex'),expected,'Protected design changed: '+file);
  report.protectedDesignFiles++;
}
const {server,url}=await startPreview(0);
const browser=await launchBrowser();
try{
  const page=await browser.newPage({viewport:{width:430,height:932}});
  await page.goto(url+'/deliverables/vitalrise-launch/');
  for(let index=0;index<files.length;index++){
    const [file,duration,times]=files[index];
    const video=page.locator('video').nth(index);
    await video.evaluate(async element=>{
      element.preload='auto';element.load();
      await new Promise((done,reject)=>{
        const timeout=setTimeout(()=>reject(new Error('Video load timeout')),20000);
        element.addEventListener('loadeddata',()=>{clearTimeout(timeout);done();},{once:true});
        element.addEventListener('error',()=>{clearTimeout(timeout);reject(new Error('Video playback failed'));},{once:true});
      });
    });
    assert.equal(await video.evaluate(element=>element.duration),duration);
    for(const time of times){
      await video.evaluate((element,seek)=>new Promise((done,reject)=>{
        const timeout=setTimeout(()=>reject(new Error('Video seek timeout')),15000);
        element.addEventListener('seeked',()=>{clearTimeout(timeout);done();},{once:true});
        element.currentTime=seek;
      }),time);
      assert.ok(await video.evaluate(element=>element.readyState>=2 && !element.error));
    }
    await video.evaluate(async element=>{element.muted=true;await element.play();});
    await page.waitForTimeout(250);
    assert.ok(await video.evaluate(element=>!element.paused));
    await video.evaluate(element=>element.pause());
    process.stdout.write('Playback and seeking passed: '+file+'\n');
  }
  report.browserPlayback='passed';
}finally{await browser.close();await new Promise(done=>server.close(done));}
await writeFile(resolve(folder,masterOnly?'verification-master.json':'verification.json'),JSON.stringify(report,null,2)+'\n');
process.stdout.write(JSON.stringify(report,null,2)+'\n');

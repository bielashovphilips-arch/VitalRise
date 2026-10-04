import {AbsoluteFill,CanvasImage,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Frame} from '../Frame';

export const Outro:React.FC=()=>{
  const frame=useCurrentFrame();
  return <Frame label="ПОЧНИ ЗАРАЗ">
    <CanvasImage name="Original athlete backdrop" src={staticFile('athlete-mobile.jpg')} width={1080} height={1920} fit="cover" style={{position:'absolute',inset:0,opacity:.25,scale:interpolate(frame,[0,180],[1.04,1],{extrapolateRight:'clamp'})}} />
    <AbsoluteFill style={{background:'linear-gradient(180deg,#0b0b0f99,#0b0b0f55 45%,#0b0b0f 94%)'}} />
    <Interactive.Div name="Closing headline" style={{position:'absolute',left:90,right:90,top:690,fontSize:94,fontWeight:800,lineHeight:1.12,letterSpacing:-4,opacity:interpolate(frame,[0,20],[0,1],{extrapolateRight:'clamp'})}}>Твій перший<br/>крок —<br/><span style={{color:'#e8c950'}}>безкоштовний.</span></Interactive.Div>
    <Interactive.Div name="Website URL" style={{position:'absolute',left:90,right:90,top:1190,fontSize:58,fontWeight:700,letterSpacing:-1,color:'#f3f4f6'}}>vitalrise.com.ua</Interactive.Div>
    <Interactive.Div name="Original button style call to action" style={{position:'absolute',left:90,right:90,top:1340,padding:'30px 32px',borderRadius:70,background:'linear-gradient(110deg,#d4af37,#ecd474)',color:'#191509',textAlign:'center',fontSize:44,fontWeight:800,opacity:interpolate(frame,[15,30],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>Розрахувати калорії →</Interactive.Div>
    <Interactive.Div name="Link instruction" style={{position:'absolute',left:90,right:90,top:1570,fontSize:44,lineHeight:1.4,fontWeight:500,color:'#b7bcc8'}}>Відкрий сайт.<br/>Почни зі свого орієнтира.</Interactive.Div>
  </Frame>;
};

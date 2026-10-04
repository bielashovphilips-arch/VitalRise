import {AbsoluteFill,CanvasImage,Easing,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Frame} from '../Frame';

export const Hook:React.FC=()=>{
  const frame=useCurrentFrame();
  return <Frame label="ТВІЙ ПЕРШИЙ КРОК">
    <CanvasImage name="Existing athlete photograph" src={staticFile('athlete-mobile.jpg')} width={1080} height={1920} fit="cover" style={{position:'absolute',inset:0,opacity:.78,scale:interpolate(frame,[0,162],[1,1.045],{extrapolateRight:'clamp'})}} />
    <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(5,6,8,.75),rgba(5,6,8,.1) 28%,rgba(5,6,8,.75) 68%,#0b0b0f 95%)'}} />
    <Interactive.Div name="Main promise" style={{position:'absolute',left:90,right:90,top:785,fontSize:94,fontWeight:800,lineHeight:1.12,letterSpacing:-4,opacity:interpolate(frame,[0,18],[0,1],{extrapolateRight:'clamp'}),translate:interpolate(frame,[0,24],['0px 36px','0px 0px'],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}}>
      Харчування.<br/>Тренування.<br/><span style={{color:'#e8c950'}}>Прогрес.</span>
    </Interactive.Div>
    <Interactive.Div name="Free starting point" style={{position:'absolute',left:94,right:100,top:1350,fontSize:46,fontWeight:500,lineHeight:1.45,color:'#d1d4dc',opacity:interpolate(frame,[25,42],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
      Почни з безкоштовного<br/>розрахунку калорій.
    </Interactive.Div>
    <Interactive.Div name="Opening link" style={{position:'absolute',left:94,top:1640,fontSize:36,color:'#d4af37',letterSpacing:1}}>vitalrise.com.ua</Interactive.Div>
  </Frame>;
};

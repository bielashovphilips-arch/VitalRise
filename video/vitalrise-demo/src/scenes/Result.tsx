import {CanvasImage,Easing,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Frame} from '../Frame';

export const Result:React.FC=()=>{
  const frame=useCurrentFrame();
  return <Frame label="02 / ОТРИМАЙ ОРІЄНТИР">
    <Interactive.Div name="Instant estimate" style={{position:'absolute',left:90,right:90,top:272,fontSize:88,fontWeight:800,lineHeight:1.1,letterSpacing:-3,opacity:interpolate(frame,[0,16],[0,1],{extrapolateRight:'clamp'})}}>Результат —<br/><span style={{color:'#e8c950'}}>одразу.</span></Interactive.Div>
    <CanvasImage name="Actual calculator result" src={staticFile('calculator-result.png')} width={820} height={1052} style={{position:'absolute',left:130,top:532,objectFit:'contain',opacity:interpolate(frame,[8,26],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),translate:interpolate(frame,[0,28],['0px 30px','0px 0px'],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}} />
    <Interactive.Div name="Estimate disclaimer" style={{position:'absolute',left:90,right:90,top:1660,fontSize:44,fontWeight:500,lineHeight:1.3,color:'#b7bcc8'}}>Приклад, не персональна<br/>рекомендація.</Interactive.Div>
  </Frame>;
};

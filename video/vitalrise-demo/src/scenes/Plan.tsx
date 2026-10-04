import {CanvasImage,Easing,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Frame} from '../Frame';

export const Plan:React.FC=()=>{
  const frame=useCurrentFrame();
  return <Frame label="03 / ПЕРЕЙДИ ДО ПЛАНУ">
    <Interactive.Div name="Paid plan distinction" style={{position:'absolute',left:90,right:90,top:282,fontSize:88,fontWeight:800,lineHeight:1.1,letterSpacing:-3,opacity:interpolate(frame,[0,16],[0,1],{extrapolateRight:'clamp'})}}>Повний план —<br/><span style={{color:'#e8c950'}}>у Start.</span></Interactive.Div>
    <CanvasImage name="Original Start plan card" src={staticFile('start-plan.png')} width={880} height={926} style={{position:'absolute',left:100,top:610,objectFit:'contain',translate:interpolate(frame,[0,28],['0px 32px','0px 0px'],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}} />
    <Interactive.Div name="Plan access explained" style={{position:'absolute',left:90,right:90,top:1630,fontSize:44,fontWeight:500,lineHeight:1.35,color:'#d1d4dc'}}>Раціон на 7 днів.<br/>30 днів активного доступу.</Interactive.Div>
  </Frame>;
};

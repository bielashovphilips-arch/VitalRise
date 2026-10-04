import {CanvasImage,Easing,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Frame} from '../Frame';

export const Calculator:React.FC=()=>{
  const frame=useCurrentFrame();
  return <Frame label="01 / РОЗРАХУЙ">
    <Interactive.Div name="Calculator headline" style={{position:'absolute',left:90,right:90,top:292,fontSize:88,fontWeight:800,lineHeight:1.1,letterSpacing:-3,opacity:interpolate(frame,[0,16],[0,1],{extrapolateRight:'clamp'})}}>Калорії —<br/><span style={{color:'#e8c950'}}>безкоштовно.</span></Interactive.Div>
    <Interactive.Div name="Original calculator UI" style={{position:'absolute',left:90,top:690,width:900,height:735,translate:interpolate(frame,[0,24],['0px 35px','0px 0px'],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}}>
      <CanvasImage name="Empty form" src={staticFile('calculator-empty.png')} width={900} height={735} style={{objectFit:'contain',position:'absolute',inset:0}} />
      <CanvasImage name="Fictional sample inputs" src={staticFile('calculator-filled.png')} width={900} height={735} style={{objectFit:'contain',position:'absolute',inset:0,opacity:interpolate(frame,[42,56],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}} />
      <Interactive.Div name="Click indicator" style={{position:'absolute',left:650,top:666,width:64,height:64,border:'3px solid #fff',borderRadius:'50%',background:'#ffffff22',opacity:interpolate(frame,[95,110,136,158],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),scale:interpolate(frame,[105,128,156],[.5,1,1.5],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}} />
    </Interactive.Div>
    <Interactive.Div name="No registration required" style={{position:'absolute',top:1540,left:90,right:90,fontSize:46,lineHeight:1.4,fontWeight:500,color:'#d1d4dc'}}>Без реєстрації.<br/>Без оплати.</Interactive.Div>
    <Interactive.Div name="Sample notice" style={{position:'absolute',top:1730,left:90,fontSize:32,color:'#a8afbc'}}>У кадрі — демонстраційні дані.</Interactive.Div>
  </Frame>;
};

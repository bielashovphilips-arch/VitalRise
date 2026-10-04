import {AbsoluteFill, CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily}=loadFont('normal',{weights:['500','700','800'],subsets:['latin','cyrillic']});

export const Frame: React.FC<{children:React.ReactNode; label:string}> = ({children,label}) => {
  const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:'#0b0b0f',color:'#f3f4f6',fontFamily,overflow:'hidden'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 100% 30%,rgba(212,175,55,.09),transparent 65%)'}} />
    {children}
    <Interactive.Div name="Original VitalRise brand" style={{position:'absolute',top:112,left:90,display:'flex',alignItems:'center',gap:22,fontSize:42,fontWeight:800}}>
      <CanvasImage src={staticFile('logo-icon.svg')} width={70} height={70} fit="contain" />VitalRise
    </Interactive.Div>
    <Interactive.Div name="Scene label" style={{position:'absolute',top:127,right:90,fontSize:28,fontWeight:700,letterSpacing:3,color:'#d4af37'}}>{label}</Interactive.Div>
    <Interactive.Div name="Timeline" style={{position:'absolute',bottom:100,left:90,right:90,height:2,background:'#ffffff20'}}>
      <Interactive.Div name="Timeline fill" style={{height:2,background:'#d4af37',width:interpolate(frame,[0,durationInFrames-1],[0,900],{extrapolateRight:'clamp'})}} />
    </Interactive.Div>
  </AbsoluteFill>;
};

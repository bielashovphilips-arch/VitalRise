import "./index.css";
import {Composition,Still} from 'remotion';
import {Demo,Teaser} from './Composition';
import {Outro} from './scenes/Outro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="VitalRise-Demo-30s" component={Demo} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Composition id="VitalRise-Teaser-15s" component={Teaser} durationInFrames={450} fps={30} width={1080} height={1920} />
      <Still id="VitalRise-Cover" component={Outro} width={1080} height={1920} />
    </>
  );
};

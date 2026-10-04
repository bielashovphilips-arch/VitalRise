import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Hook} from './scenes/Hook';
import {Calculator} from './scenes/Calculator';
import {Result} from './scenes/Result';
import {Plan} from './scenes/Plan';
import {Outro} from './scenes/Outro';

export const Demo:React.FC=()=> <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={162} name="Introduce VitalRise"><Hook/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={222} name="Calculate for free"><Calculator/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={192} name="See actual result"><Result/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={192} name="Understand Start"><Plan/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={180} name="Visit the website"><Outro/></TransitionSeries.Sequence>
</TransitionSeries>;

export const Teaser:React.FC=()=> <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={96} name="Hook"><Hook/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={216} name="Free result"><Result/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:12})}/>
  <TransitionSeries.Sequence durationInFrames={162} name="Visit VitalRise"><Outro/></TransitionSeries.Sequence>
</TransitionSeries>;

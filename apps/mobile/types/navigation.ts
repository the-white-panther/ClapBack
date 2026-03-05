import { Tone } from '../constants/config';

export interface ResultsParams {
  chatContext: string;
  tone: Tone;
  customTone?: string;
}

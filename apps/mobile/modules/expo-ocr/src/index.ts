import ExpoOcrModule from './ExpoOcrModule';

export async function recognizeText(imageUri: string): Promise<string> {
  return await ExpoOcrModule.recognizeText(imageUri);
}

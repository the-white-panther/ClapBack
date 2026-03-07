import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoOcrModuleType extends NativeModule {
  recognizeText(imageUri: string): Promise<string>;
}

export default requireNativeModule<ExpoOcrModuleType>('ExpoOcr');

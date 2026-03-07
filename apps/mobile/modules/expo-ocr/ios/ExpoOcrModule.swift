import ExpoModulesCore
import Vision
import UIKit

public class ExpoOcrModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoOcr")

    AsyncFunction("recognizeText") { (imageUri: String, promise: Promise) in
      guard let url = URL(string: imageUri) else {
        promise.reject("ERR_INVALID_URI", "Invalid image URI")
        return
      }

      guard let imageData = try? Data(contentsOf: url),
            let uiImage = UIImage(data: imageData),
            let cgImage = uiImage.cgImage else {
        promise.reject("ERR_IMAGE_LOAD", "Failed to load image from URI")
        return
      }

      let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])

      let request = VNRecognizeTextRequest { request, error in
        if let error = error {
          promise.reject("ERR_RECOGNITION", "Text recognition failed: \(error.localizedDescription)")
          return
        }

        guard let observations = request.results as? [VNRecognizedTextObservation] else {
          promise.resolve("")
          return
        }

        let recognizedText = observations.compactMap { observation in
          observation.topCandidates(1).first?.string
        }.joined(separator: "\n")

        promise.resolve(recognizedText)
      }

      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = true

      DispatchQueue.global(qos: .userInitiated).async {
        do {
          try requestHandler.perform([request])
        } catch {
          promise.reject("ERR_PERFORM", "Failed to perform text recognition: \(error.localizedDescription)")
        }
      }
    }
  }
}

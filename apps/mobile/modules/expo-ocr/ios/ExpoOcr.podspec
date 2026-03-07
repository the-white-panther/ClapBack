require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoOcr'
  s.version        = package['version']
  s.summary        = 'Expo module for on-device OCR using Apple Vision'
  s.description    = 'Expo module for on-device OCR using Apple Vision'
  s.license        = 'MIT'
  s.author         = 'ClapBack'
  s.homepage       = 'https://github.com/the-white-panther/ClapBack'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/the-white-panther/ClapBack.git' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,swift}'
end

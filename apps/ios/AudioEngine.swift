import SwiftUI
import AVFoundation
import CoreAudio
import Accelerate

class AudioEngine: ObservableObject {
    private let engine = AVAudioEngine()
    private let mixer = AVAudioMixerNode()
    private var playerNodes: [AVAudioPlayerNode] = []
    private var effectNodes: [AVAudioUnitEffect] = []
    
    @Published var isPlaying = false
    @Published var currentTime: TimeInterval = 0
    @Published var isRecording = false
    @Published var inputLevel: Float = 0.0
    @Published var outputLevel: Float = 0.0
    
    private var displayLink: CADisplayLink?
    private var audioInputNode: AVAudioInputNode?
    
    init() {
        setupAudioEngine()
    }
    
    private func setupAudioEngine() {
        engine.attach(mixer)
        engine.connect(mixer, to: engine.outputNode, format: nil)
        
        // Setup input monitoring
        audioInputNode = engine.inputNode
        
        do {
            try engine.start()
            startLevelMonitoring()
        } catch {
            print("Audio engine failed to start: \(error)")
        }
    }
    
    func initializeForProduction() {
        // Configure audio engine for production use
        setupOptimalSettings()
        enableBackgroundAudio()
        setupAudioInterruptions()
    }
    
    private func setupOptimalSettings() {
        // Configure for low latency, high quality audio
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setPreferredIOBufferDuration(0.005) // 5ms buffer for ultra-low latency
            try session.setPreferredSampleRate(48000) // Professional sample rate
        } catch {
            print("Failed to configure optimal audio settings: \(error)")
        }
    }
    
    private func enableBackgroundAudio() {
        #if os(iOS)
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playAndRecord, mode: .default, options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
            try session.setActive(true)
        } catch {
            print("Failed to enable background audio: \(error)")
        }
        #endif
    }
    
    private func setupAudioInterruptions() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAudioInterruption),
            name: AVAudioSession.interruptionNotification,
            object: nil
        )
    }
    
    @objc private func handleAudioInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
            return
        }
        
        switch type {
        case .began:
            // Audio interruption began (phone call, etc.)
            pause()
        case .ended:
            // Audio interruption ended
            if let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt {
                let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
                if options.contains(.shouldResume) {
                    // Resume playback if appropriate
                    resume()
                }
            }
        @unknown default:
            break
        }
    }
    
    func loadAudioFile(url: URL) throws -> AVAudioFile {
        return try AVAudioFile(forReading: url)
    }
    
    func playTrack(audioFile: AVAudioFile) {
        let player = AVAudioPlayerNode()
        engine.attach(player)
        engine.connect(player, to: mixer, format: audioFile.processingFormat)
        
        player.scheduleFile(audioFile, at: nil)
        player.play()
        playerNodes.append(player)
        
        DispatchQueue.main.async {
            self.isPlaying = true
        }
    }
    
    func play() {
        for player in playerNodes {
            player.play()
        }
        DispatchQueue.main.async {
            self.isPlaying = true
        }
    }
    
    func pause() {
        for player in playerNodes {
            player.pause()
        }
        DispatchQueue.main.async {
            self.isPlaying = false
        }
    }
    
    func resume() {
        play()
    }
    
    func stop() {
        for player in playerNodes {
            player.stop()
        }
        DispatchQueue.main.async {
            self.isPlaying = false
            self.currentTime = 0
        }
    }
    
    func startRecording() {
        guard let inputNode = audioInputNode else { return }
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { [weak self] buffer, time in
            // Process audio buffer for recording
            self?.processRecordingBuffer(buffer)
        }
        
        DispatchQueue.main.async {
            self.isRecording = true
        }
    }
    
    func stopRecording() {
        audioInputNode?.removeTap(onBus: 0)
        DispatchQueue.main.async {
            self.isRecording = false
        }
    }
    
    private func processRecordingBuffer(_ buffer: AVAudioPCMBuffer) {
        // Process the audio buffer for recording
        // This could include saving to file, real-time effects, etc.
        
        // Calculate input level for UI feedback
        guard let channelData = buffer.floatChannelData else { return }
        let frameLength = Int(buffer.frameLength)
        
        var maxLevel: Float = 0.0
        for frame in 0..<frameLength {
            let sample = abs(channelData[0][frame])
            if sample > maxLevel {
                maxLevel = sample
            }
        }
        
        DispatchQueue.main.async {
            self.inputLevel = maxLevel
        }
    }
    
    func applyRealtimeEffect(_ effect: AVAudioUnitEffect, to player: AVAudioPlayerNode) {
        engine.attach(effect)
        engine.disconnectNodeOutput(player)
        engine.connect(player, to: effect, format: nil)
        engine.connect(effect, to: mixer, format: nil)
        effectNodes.append(effect)
    }
    
    func processWithCoreML(_ audioBuffer: AVAudioPCMBuffer) -> AVAudioPCMBuffer {
        // Convert audio buffer to format suitable for CoreML
        let inputArray = audioBufferToFloatArray(audioBuffer)
        
        // Process with CoreML model (placeholder)
        let processedArray = inputArray // Would use actual CoreML model here
        
        // Convert back to audio buffer
        return floatArrayToAudioBuffer(processedArray, format: audioBuffer.format)
    }
    
    private func startLevelMonitoring() {
        displayLink = CADisplayLink(target: self, selector: #selector(updateLevels))
        displayLink?.add(to: .main, forMode: .default)
    }
    
    @objc private func updateLevels() {
        // Update audio level meters
        // This would typically involve reading from analyzer nodes
        
        // Simulate output level
        if isPlaying {
            outputLevel = Float.random(in: 0.3...0.9)
        } else {
            outputLevel = 0.0
        }
    }
    
    private func audioBufferToFloatArray(_ buffer: AVAudioPCMBuffer) -> [Float] {
        guard let channelData = buffer.floatChannelData else { return [] }
        let frameLength = Int(buffer.frameLength)
        return Array(UnsafeBufferPointer(start: channelData[0], count: frameLength))
    }
    
    private func floatArrayToAudioBuffer(_ array: [Float], format: AVAudioFormat) -> AVAudioPCMBuffer {
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(array.count)) else {
            fatalError("Could not create audio buffer")
        }
        
        buffer.frameLength = AVAudioFrameCount(array.count)
        
        guard let channelData = buffer.floatChannelData else {
            fatalError("Could not access channel data")
        }
        
        for (index, value) in array.enumerated() {
            channelData[0][index] = value
        }
        
        return buffer
    }
    
    deinit {
        displayLink?.invalidate()
        NotificationCenter.default.removeObserver(self)
        engine.stop()
    }
}
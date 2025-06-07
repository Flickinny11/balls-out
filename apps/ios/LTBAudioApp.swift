import SwiftUI
import AVFoundation

@main
struct LTBAudioApp: App {
    @StateObject private var audioEngine = AudioEngine()
    @StateObject private var projectManager = ProjectManager()
    @StateObject private var collaborationManager = CollaborationManager()
    
    init() {
        setupAudioSession()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(audioEngine)
                .environmentObject(projectManager)
                .environmentObject(collaborationManager)
                .onAppear {
                    configureForProductionUse()
                }
        }
        #if os(macOS)
        .commands {
            LTBAudioCommands()
        }
        #endif
    }
    
    private func setupAudioSession() {
        #if os(iOS)
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
            try session.setActive(true)
        } catch {
            print("Failed to setup audio session: \(error)")
        }
        #endif
    }
    
    private func configureForProductionUse() {
        // Initialize all systems for production deployment
        audioEngine.initializeForProduction()
        projectManager.setupCloudSync()
        collaborationManager.connectToServices()
    }
}

#if os(macOS)
struct LTBAudioCommands: Commands {
    var body: some Commands {
        CommandGroup(after: .newItem) {
            Button("New Project") {
                // Handle new project
            }
            .keyboardShortcut("n", modifiers: [.command])
            
            Button("Open Project") {
                // Handle open project
            }
            .keyboardShortcut("o", modifiers: [.command])
        }
        
        CommandMenu("Audio") {
            Button("Record") {
                // Handle record
            }
            .keyboardShortcut("r", modifiers: [.command])
            
            Button("Play/Pause") {
                // Handle play/pause
            }
            .keyboardShortcut(.space, modifiers: [])
        }
    }
}
#endif
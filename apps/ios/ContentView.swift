import SwiftUI

struct ContentView: View {
    @EnvironmentObject var audioEngine: AudioEngine
    @EnvironmentObject var projectManager: ProjectManager
    @State private var selectedTab = 0
    @State private var showingProjectCreation = false
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Projects Tab
            ProjectsView()
                .tabItem {
                    Image(systemName: "folder.fill")
                    Text("Projects")
                }
                .tag(0)
            
            // Studio Tab
            StudioView()
                .tabItem {
                    Image(systemName: "waveform")
                    Text("Studio")
                }
                .tag(1)
            
            // AI Assistant Tab
            AIAssistantView()
                .tabItem {
                    Image(systemName: "brain.head.profile")
                    Text("AI")
                }
                .tag(2)
            
            // Collaboration Tab
            CollaborationView()
                .tabItem {
                    Image(systemName: "person.2.fill")
                    Text("Collab")
                }
                .tag(3)
            
            // Settings Tab
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
                .tag(4)
        }
        .accentColor(.purple)
        .onAppear {
            setupAppearance()
        }
    }
    
    private func setupAppearance() {
        // Configure tab bar appearance
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.systemBackground
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AudioEngine())
            .environmentObject(ProjectManager())
            .environmentObject(CollaborationManager())
    }
}
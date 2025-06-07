import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject var projectManager: ProjectManager
    @State private var showingNewProjectSheet = false
    @State private var searchText = ""
    
    var filteredProjects: [Project] {
        if searchText.isEmpty {
            return projectManager.projects
        } else {
            return projectManager.projects.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                // Search Bar
                SearchBar(text: $searchText)
                
                if projectManager.isLoading {
                    // Loading State
                    VStack {
                        ProgressView()
                            .scaleEffect(1.2)
                        Text("Loading projects...")
                            .foregroundColor(.secondary)
                            .padding(.top)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if filteredProjects.isEmpty {
                    // Empty State
                    VStack(spacing: 20) {
                        Image(systemName: "folder.badge.plus")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        
                        Text("No Projects Yet")
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        Text("Create your first project to get started with music production")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        
                        Button("Create Project") {
                            showingNewProjectSheet = true
                        }
                        .buttonStyle(.borderedProminent)
                        .controlSize(.large)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    // Project Grid
                    ScrollView {
                        LazyVGrid(columns: [
                            GridItem(.adaptive(minimum: 300, maximum: 400), spacing: 16)
                        ], spacing: 16) {
                            ForEach(filteredProjects) { project in
                                ProjectCard(project: project)
                                    .onTapGesture {
                                        projectManager.selectProject(project)
                                    }
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Projects")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingNewProjectSheet = true
                    }) {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .sheet(isPresented: $showingNewProjectSheet) {
            NewProjectView()
        }
        .refreshable {
            projectManager.loadProjects()
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            
            TextField("Search projects...", text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
        .padding(.horizontal)
    }
}

struct ProjectCard: View {
    let project: Project
    @EnvironmentObject var projectManager: ProjectManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(project.name)
                        .font(.headline)
                        .foregroundColor(.primary)
                        .lineLimit(1)
                    
                    Text(project.genre)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Menu {
                    Button("Open") {
                        projectManager.selectProject(project)
                    }
                    
                    Button("Duplicate") {
                        // Duplicate project
                    }
                    
                    Button("Export") {
                        projectManager.exportProject(project, format: .wav)
                    }
                    
                    Divider()
                    
                    Button("Delete", role: .destructive) {
                        // Delete project
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(.secondary)
                }
            }
            
            // Project Info
            HStack {
                InfoPill(icon: "metronome", text: "\(project.tempo) BPM")
                InfoPill(icon: "music.note", text: project.keySignature)
                InfoPill(icon: "waveform", text: "\(project.tracks.count) tracks")
            }
            
            // Track Preview
            if !project.tracks.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Tracks")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        ForEach(project.tracks.prefix(4)) { track in
                            TrackIndicator(track: track)
                        }
                        
                        if project.tracks.count > 4 {
                            Text("+\(project.tracks.count - 4)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                    }
                }
            }
            
            // Footer
            HStack {
                Text(formatDate(project.modifiedAt))
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if project.id == projectManager.currentProject?.id {
                    Text("CURRENT")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.purple)
                        .cornerRadius(4)
                }
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct InfoPill: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption2)
            Text(text)
                .font(.caption2)
        }
        .foregroundColor(.secondary)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color(UIColor.tertiarySystemBackground))
        .cornerRadius(8)
    }
}

struct TrackIndicator: View {
    let track: Track
    
    var body: some View {
        Circle()
            .fill(trackColor)
            .frame(width: 12, height: 12)
            .overlay(
                Circle()
                    .stroke(Color.white, lineWidth: 1)
            )
    }
    
    private var trackColor: Color {
        switch track.type {
        case .audio:
            return .blue
        case .midi:
            return .green
        case .drums:
            return .orange
        case .bass:
            return .red
        case .vocals:
            return .purple
        }
    }
}

struct NewProjectView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var projectManager: ProjectManager
    
    @State private var projectName = ""
    @State private var selectedGenre = "Electronic"
    @State private var tempo = 120
    @State private var keySignature = "C"
    @State private var timeSignature = "4/4"
    
    private let genres = ["Electronic", "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Ambient", "Techno", "House", "Dubstep"]
    private let keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    private let timeSignatures = ["4/4", "3/4", "6/8", "2/4", "5/4", "7/8"]
    
    var body: some View {
        NavigationView {
            Form {
                Section("Project Details") {
                    TextField("Project Name", text: $projectName)
                    
                    Picker("Genre", selection: $selectedGenre) {
                        ForEach(genres, id: \.self) { genre in
                            Text(genre).tag(genre)
                        }
                    }
                }
                
                Section("Musical Settings") {
                    HStack {
                        Text("Tempo")
                        Spacer()
                        Stepper("\(tempo) BPM", value: $tempo, in: 60...200)
                    }
                    
                    Picker("Key Signature", selection: $keySignature) {
                        ForEach(keys, id: \.self) { key in
                            Text(key).tag(key)
                        }
                    }
                    
                    Picker("Time Signature", selection: $timeSignature) {
                        ForEach(timeSignatures, id: \.self) { signature in
                            Text(signature).tag(signature)
                        }
                    }
                }
            }
            .navigationTitle("New Project")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Create") {
                        createProject()
                    }
                    .disabled(projectName.isEmpty)
                }
            }
        }
    }
    
    private func createProject() {
        projectManager.createNewProject(
            name: projectName,
            genre: selectedGenre,
            tempo: tempo
        )
        dismiss()
    }
}

struct AIAssistantView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("AI Assistant")
                    .font(.largeTitle)
                Text("Coming Soon")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("AI Assistant")
        }
    }
}

struct CollaborationView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Collaboration")
                    .font(.largeTitle)
                Text("Coming Soon")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Collaboration")
        }
    }
}

struct SettingsView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Settings")
                    .font(.largeTitle)
                Text("Coming Soon")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Settings")
        }
    }
}

struct RecordingView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Recording")
                    .font(.largeTitle)
                Text("Recording interface coming soon")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Record")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct EffectsPanelView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Effects")
                    .font(.largeTitle)
                Text("Effects panel coming soon")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Effects")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

class CollaborationManager: ObservableObject {
    func connectToServices() {
        // Connect to collaboration services
        print("Connecting to collaboration services...")
    }
}

struct ProjectsView_Previews: PreviewProvider {
    static var previews: some View {
        ProjectsView()
            .environmentObject(ProjectManager())
    }
}
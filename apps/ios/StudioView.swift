import SwiftUI

struct StudioView: View {
    @EnvironmentObject var audioEngine: AudioEngine
    @EnvironmentObject var projectManager: ProjectManager
    @State private var selectedTrack: Track?
    @State private var showingRecordingView = false
    @State private var showingEffectsPanel = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Transport Controls
                TransportControlsView()
                
                // Main Content
                GeometryReader { geometry in
                    HStack(spacing: 0) {
                        // Track List
                        TrackListView(selectedTrack: $selectedTrack)
                            .frame(width: geometry.size.width * 0.3)
                        
                        Divider()
                        
                        // Waveform Editor
                        WaveformEditorView(selectedTrack: $selectedTrack)
                            .frame(width: geometry.size.width * 0.7)
                    }
                }
            }
            .navigationTitle("Studio")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingRecordingView = true
                    }) {
                        Image(systemName: "record.circle")
                            .foregroundColor(.red)
                    }
                    
                    Button(action: {
                        showingEffectsPanel = true
                    }) {
                        Image(systemName: "slider.horizontal.3")
                    }
                }
            }
        }
        .sheet(isPresented: $showingRecordingView) {
            RecordingView()
        }
        .sheet(isPresented: $showingEffectsPanel) {
            EffectsPanelView()
        }
    }
}

struct TransportControlsView: View {
    @EnvironmentObject var audioEngine: AudioEngine
    
    var body: some View {
        HStack {
            // Play/Pause Button
            Button(action: {
                if audioEngine.isPlaying {
                    audioEngine.pause()
                } else {
                    audioEngine.play()
                }
            }) {
                Image(systemName: audioEngine.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.purple)
            }
            
            // Stop Button
            Button(action: {
                audioEngine.stop()
            }) {
                Image(systemName: "stop.circle")
                    .font(.system(size: 40))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            // Time Display
            VStack(alignment: .trailing) {
                Text(formatTime(audioEngine.currentTime))
                    .font(.system(.title2, design: .monospaced))
                    .foregroundColor(.primary)
                
                Text("120 BPM • 4/4")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Record Button
            Button(action: {
                if audioEngine.isRecording {
                    audioEngine.stopRecording()
                } else {
                    audioEngine.startRecording()
                }
            }) {
                Image(systemName: audioEngine.isRecording ? "record.circle.fill" : "record.circle")
                    .font(.system(size: 40))
                    .foregroundColor(audioEngine.isRecording ? .red : .gray)
            }
        }
        .padding()
        .background(Color(UIColor.systemGray6))
    }
    
    private func formatTime(_ seconds: TimeInterval) -> String {
        let minutes = Int(seconds) / 60
        let seconds = Int(seconds) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

struct TrackListView: View {
    @EnvironmentObject var projectManager: ProjectManager
    @Binding var selectedTrack: Track?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Text("Tracks")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Button(action: {
                    projectManager.addNewTrack()
                }) {
                    Image(systemName: "plus.circle.fill")
                        .foregroundColor(.purple)
                }
            }
            .padding()
            
            Divider()
            
            // Track List
            ScrollView {
                LazyVStack(spacing: 1) {
                    ForEach(projectManager.currentProject?.tracks ?? [], id: \.id) { track in
                        TrackRowView(track: track, isSelected: selectedTrack?.id == track.id)
                            .onTapGesture {
                                selectedTrack = track
                            }
                    }
                }
            }
        }
        .background(Color(UIColor.systemBackground))
    }
}

struct TrackRowView: View {
    let track: Track
    let isSelected: Bool
    @EnvironmentObject var projectManager: ProjectManager
    
    var body: some View {
        HStack {
            // Track Color Indicator
            Rectangle()
                .fill(trackColor(for: track.type))
                .frame(width: 4)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(track.name)
                    .font(.system(.body, weight: .medium))
                    .foregroundColor(.primary)
                
                Text(track.type.capitalized)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Track Controls
            HStack(spacing: 8) {
                // Mute Button
                Button(action: {
                    projectManager.toggleMute(for: track)
                }) {
                    Text("M")
                        .font(.system(.caption, weight: .bold))
                        .foregroundColor(track.muted ? .white : .gray)
                        .frame(width: 24, height: 24)
                        .background(track.muted ? Color.red : Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 4)
                                .stroke(Color.gray, lineWidth: 1)
                        )
                }
                
                // Solo Button
                Button(action: {
                    projectManager.toggleSolo(for: track)
                }) {
                    Text("S")
                        .font(.system(.caption, weight: .bold))
                        .foregroundColor(track.soloed ? .black : .gray)
                        .frame(width: 24, height: 24)
                        .background(track.soloed ? Color.yellow : Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 4)
                                .stroke(Color.gray, lineWidth: 1)
                        )
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(isSelected ? Color.purple.opacity(0.1) : Color.clear)
    }
    
    private func trackColor(for type: TrackType) -> Color {
        switch type {
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

struct WaveformEditorView: View {
    @Binding var selectedTrack: Track?
    @EnvironmentObject var audioEngine: AudioEngine
    @State private var waveformData: [Float] = []
    @State private var zoom: CGFloat = 1.0
    @State private var scrollOffset: CGFloat = 0
    
    var body: some View {
        VStack(spacing: 0) {
            // Timeline
            TimelineView()
                .frame(height: 30)
            
            Divider()
            
            // Waveform Display
            GeometryReader { geometry in
                ZStack {
                    // Background
                    Color(UIColor.systemGray6)
                    
                    // Waveform
                    if let track = selectedTrack {
                        WaveformShape(data: waveformData, zoom: zoom, offset: scrollOffset)
                            .stroke(Color.purple, lineWidth: 1.5)
                            .clipped()
                    } else {
                        VStack {
                            Image(systemName: "waveform.path")
                                .font(.system(size: 48))
                                .foregroundColor(.gray)
                            
                            Text("Select a track to edit")
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    // Playhead
                    if audioEngine.isPlaying {
                        Rectangle()
                            .fill(Color.red)
                            .frame(width: 2)
                            .position(x: geometry.size.width * CGFloat(audioEngine.currentTime / 180), y: geometry.size.height / 2)
                    }
                }
                .gesture(
                    MagnificationGesture()
                        .onChanged { value in
                            zoom = max(0.5, min(5.0, value))
                        }
                )
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            scrollOffset = value.translation.x
                        }
                )
            }
        }
        .onAppear {
            generateSampleWaveform()
        }
        .onChange(of: selectedTrack) { _ in
            generateSampleWaveform()
        }
    }
    
    private func generateSampleWaveform() {
        // Generate sample waveform data
        waveformData = (0..<1000).map { i in
            sin(Float(i) * 0.1) * 0.5 + Float.random(in: -0.1...0.1)
        }
    }
}

struct TimelineView: View {
    var body: some View {
        HStack {
            ForEach(0..<12) { i in
                VStack {
                    Text("\(i * 10)s")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    
                    Rectangle()
                        .fill(Color.gray)
                        .frame(width: 1, height: 10)
                }
                
                if i < 11 {
                    Spacer()
                }
            }
        }
        .padding(.horizontal)
        .background(Color(UIColor.systemGray5))
    }
}

struct WaveformShape: Shape {
    let data: [Float]
    let zoom: CGFloat
    let offset: CGFloat
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        guard !data.isEmpty else { return path }
        
        let centerY = rect.height / 2
        let amplitude = rect.height * 0.4
        
        for (index, sample) in data.enumerated() {
            let x = CGFloat(index) / CGFloat(data.count) * rect.width * zoom + offset
            let y = centerY - CGFloat(sample) * amplitude
            
            if x >= 0 && x <= rect.width {
                if index == 0 {
                    path.move(to: CGPoint(x: x, y: y))
                } else {
                    path.addLine(to: CGPoint(x: x, y: y))
                }
            }
        }
        
        return path
    }
}

struct StudioView_Previews: PreviewProvider {
    static var previews: some View {
        StudioView()
            .environmentObject(AudioEngine())
            .environmentObject(ProjectManager())
    }
}
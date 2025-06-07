import SwiftUI
import CloudKit
import Combine

class ProjectManager: ObservableObject {
    @Published var projects: [Project] = []
    @Published var currentProject: Project?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    private let cloudKitManager = CloudKitManager()
    
    init() {
        loadProjects()
    }
    
    func setupCloudSync() {
        // Initialize iCloud sync
        cloudKitManager.setupCloudKit()
        syncWithCloud()
    }
    
    func loadProjects() {
        isLoading = true
        
        // Load projects from local storage and iCloud
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.projects = self.createSampleProjects()
            self.isLoading = false
        }
    }
    
    func createNewProject(name: String, genre: String = "Electronic", tempo: Int = 120) {
        let newProject = Project(
            id: UUID(),
            name: name,
            genre: genre,
            tempo: tempo,
            keySignature: "C",
            timeSignature: "4/4",
            tracks: [],
            createdAt: Date(),
            modifiedAt: Date()
        )
        
        projects.append(newProject)
        currentProject = newProject
        
        // Sync to cloud
        syncProjectToCloud(newProject)
    }
    
    func selectProject(_ project: Project) {
        currentProject = project
    }
    
    func addNewTrack(name: String = "New Track", type: TrackType = .audio) {
        guard var project = currentProject else { return }
        
        let newTrack = Track(
            id: UUID(),
            name: name,
            type: type,
            volume: 1.0,
            pan: 0.0,
            muted: false,
            soloed: false,
            audioFileURL: nil,
            effects: [],
            automation: []
        )
        
        project.tracks.append(newTrack)
        currentProject = project
        
        // Update in projects array
        if let index = projects.firstIndex(where: { $0.id == project.id }) {
            projects[index] = project
        }
        
        syncProjectToCloud(project)
    }
    
    func deleteTrack(_ track: Track) {
        guard var project = currentProject else { return }
        
        project.tracks.removeAll { $0.id == track.id }
        currentProject = project
        
        if let index = projects.firstIndex(where: { $0.id == project.id }) {
            projects[index] = project
        }
        
        syncProjectToCloud(project)
    }
    
    func toggleMute(for track: Track) {
        guard var project = currentProject else { return }
        
        if let trackIndex = project.tracks.firstIndex(where: { $0.id == track.id }) {
            project.tracks[trackIndex].muted.toggle()
            currentProject = project
            
            if let projectIndex = projects.firstIndex(where: { $0.id == project.id }) {
                projects[projectIndex] = project
            }
        }
    }
    
    func toggleSolo(for track: Track) {
        guard var project = currentProject else { return }
        
        if let trackIndex = project.tracks.firstIndex(where: { $0.id == track.id }) {
            project.tracks[trackIndex].soloed.toggle()
            currentProject = project
            
            if let projectIndex = projects.firstIndex(where: { $0.id == project.id }) {
                projects[projectIndex] = project
            }
        }
    }
    
    func updateTrackVolume(_ track: Track, volume: Float) {
        guard var project = currentProject else { return }
        
        if let trackIndex = project.tracks.firstIndex(where: { $0.id == track.id }) {
            project.tracks[trackIndex].volume = volume
            currentProject = project
            
            if let projectIndex = projects.firstIndex(where: { $0.id == project.id }) {
                projects[projectIndex] = project
            }
        }
    }
    
    func updateTrackPan(_ track: Track, pan: Float) {
        guard var project = currentProject else { return }
        
        if let trackIndex = project.tracks.firstIndex(where: { $0.id == track.id }) {
            project.tracks[trackIndex].pan = pan
            currentProject = project
            
            if let projectIndex = projects.firstIndex(where: { $0.id == project.id }) {
                projects[projectIndex] = project
            }
        }
    }
    
    func exportProject(_ project: Project, format: ExportFormat) {
        // Export project to specified format
        isLoading = true
        
        DispatchQueue.global(qos: .userInitiated).async {
            // Simulate export process
            Thread.sleep(forTimeInterval: 3)
            
            DispatchQueue.main.async {
                self.isLoading = false
                // Show export completion
            }
        }
    }
    
    private func syncProjectToCloud(_ project: Project) {
        cloudKitManager.saveProject(project) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    print("Project synced to iCloud successfully")
                case .failure(let error):
                    self?.errorMessage = "Failed to sync: \(error.localizedDescription)"
                }
            }
        }
    }
    
    private func syncWithCloud() {
        cloudKitManager.fetchProjects { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let cloudProjects):
                    self?.mergeCloudProjects(cloudProjects)
                case .failure(let error):
                    self?.errorMessage = "Failed to sync with iCloud: \(error.localizedDescription)"
                }
            }
        }
    }
    
    private func mergeCloudProjects(_ cloudProjects: [Project]) {
        // Merge cloud projects with local projects
        var mergedProjects = projects
        
        for cloudProject in cloudProjects {
            if let existingIndex = mergedProjects.firstIndex(where: { $0.id == cloudProject.id }) {
                // Update existing project if cloud version is newer
                if cloudProject.modifiedAt > mergedProjects[existingIndex].modifiedAt {
                    mergedProjects[existingIndex] = cloudProject
                }
            } else {
                // Add new project from cloud
                mergedProjects.append(cloudProject)
            }
        }
        
        projects = mergedProjects
    }
    
    private func createSampleProjects() -> [Project] {
        let tracks1 = [
            Track(id: UUID(), name: "Lead Synth", type: .midi, volume: 0.8, pan: 0.0, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: []),
            Track(id: UUID(), name: "Bass", type: .midi, volume: 0.9, pan: 0.0, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: []),
            Track(id: UUID(), name: "Drums", type: .drums, volume: 0.7, pan: 0.0, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: [])
        ]
        
        let tracks2 = [
            Track(id: UUID(), name: "Vocal", type: .vocals, volume: 0.8, pan: 0.0, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: []),
            Track(id: UUID(), name: "Guitar", type: .audio, volume: 0.6, pan: -0.3, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: []),
            Track(id: UUID(), name: "Bass", type: .bass, volume: 0.8, pan: 0.0, muted: false, soloed: false, audioFileURL: nil, effects: [], automation: [])
        ]
        
        return [
            Project(
                id: UUID(),
                name: "Electronic Track",
                genre: "Electronic",
                tempo: 128,
                keySignature: "Am",
                timeSignature: "4/4",
                tracks: tracks1,
                createdAt: Date().addingTimeInterval(-86400),
                modifiedAt: Date().addingTimeInterval(-3600)
            ),
            Project(
                id: UUID(),
                name: "Rock Ballad",
                genre: "Rock",
                tempo: 80,
                keySignature: "G",
                timeSignature: "4/4",
                tracks: tracks2,
                createdAt: Date().addingTimeInterval(-172800),
                modifiedAt: Date().addingTimeInterval(-7200)
            )
        ]
    }
}

class CloudKitManager {
    private let container = CKContainer.default()
    private let database: CKDatabase
    
    init() {
        database = container.privateCloudDatabase
    }
    
    func setupCloudKit() {
        // Setup CloudKit for the app
        container.accountStatus { status, error in
            switch status {
            case .available:
                print("iCloud account is available")
            case .noAccount:
                print("No iCloud account")
            case .restricted:
                print("iCloud account is restricted")
            case .couldNotDetermine:
                print("Could not determine iCloud account status")
            @unknown default:
                print("Unknown iCloud account status")
            }
        }
    }
    
    func saveProject(_ project: Project, completion: @escaping (Result<Void, Error>) -> Void) {
        let record = projectToCKRecord(project)
        
        database.save(record) { record, error in
            if let error = error {
                completion(.failure(error))
            } else {
                completion(.success(()))
            }
        }
    }
    
    func fetchProjects(completion: @escaping (Result<[Project], Error>) -> Void) {
        let query = CKQuery(recordType: "Project", predicate: NSPredicate(value: true))
        
        database.perform(query, inZoneWith: nil) { records, error in
            if let error = error {
                completion(.failure(error))
            } else if let records = records {
                let projects = records.compactMap { self.ckRecordToProject($0) }
                completion(.success(projects))
            }
        }
    }
    
    private func projectToCKRecord(_ project: Project) -> CKRecord {
        let record = CKRecord(recordType: "Project", recordID: CKRecord.ID(recordName: project.id.uuidString))
        
        record["name"] = project.name
        record["genre"] = project.genre
        record["tempo"] = project.tempo
        record["keySignature"] = project.keySignature
        record["timeSignature"] = project.timeSignature
        record["createdAt"] = project.createdAt
        record["modifiedAt"] = project.modifiedAt
        
        // Convert tracks to data
        if let tracksData = try? JSONEncoder().encode(project.tracks) {
            record["tracks"] = tracksData
        }
        
        return record
    }
    
    private func ckRecordToProject(_ record: CKRecord) -> Project? {
        guard let name = record["name"] as? String,
              let genre = record["genre"] as? String,
              let tempo = record["tempo"] as? Int,
              let keySignature = record["keySignature"] as? String,
              let timeSignature = record["timeSignature"] as? String,
              let createdAt = record["createdAt"] as? Date,
              let modifiedAt = record["modifiedAt"] as? Date else {
            return nil
        }
        
        var tracks: [Track] = []
        if let tracksData = record["tracks"] as? Data {
            tracks = (try? JSONDecoder().decode([Track].self, from: tracksData)) ?? []
        }
        
        return Project(
            id: UUID(uuidString: record.recordID.recordName) ?? UUID(),
            name: name,
            genre: genre,
            tempo: tempo,
            keySignature: keySignature,
            timeSignature: timeSignature,
            tracks: tracks,
            createdAt: createdAt,
            modifiedAt: modifiedAt
        )
    }
}
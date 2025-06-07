import Foundation

// MARK: - Project Model
struct Project: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var genre: String
    var tempo: Int
    var keySignature: String
    var timeSignature: String
    var tracks: [Track]
    let createdAt: Date
    var modifiedAt: Date
    
    init(id: UUID = UUID(), name: String, genre: String = "Electronic", tempo: Int = 120, keySignature: String = "C", timeSignature: String = "4/4", tracks: [Track] = [], createdAt: Date = Date(), modifiedAt: Date = Date()) {
        self.id = id
        self.name = name
        self.genre = genre
        self.tempo = tempo
        self.keySignature = keySignature
        self.timeSignature = timeSignature
        self.tracks = tracks
        self.createdAt = createdAt
        self.modifiedAt = modifiedAt
    }
}

// MARK: - Track Model
struct Track: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var type: TrackType
    var volume: Float
    var pan: Float
    var muted: Bool
    var soloed: Bool
    var audioFileURL: URL?
    var effects: [AudioEffect]
    var automation: [AutomationPoint]
    
    init(id: UUID = UUID(), name: String, type: TrackType, volume: Float = 1.0, pan: Float = 0.0, muted: Bool = false, soloed: Bool = false, audioFileURL: URL? = nil, effects: [AudioEffect] = [], automation: [AutomationPoint] = []) {
        self.id = id
        self.name = name
        self.type = type
        self.volume = volume
        self.pan = pan
        self.muted = muted
        self.soloed = soloed
        self.audioFileURL = audioFileURL
        self.effects = effects
        self.automation = automation
    }
}

// MARK: - Track Type
enum TrackType: String, Codable, CaseIterable {
    case audio = "audio"
    case midi = "midi"
    case drums = "drums"
    case bass = "bass"
    case vocals = "vocals"
    
    var displayName: String {
        switch self {
        case .audio:
            return "Audio"
        case .midi:
            return "MIDI"
        case .drums:
            return "Drums"
        case .bass:
            return "Bass"
        case .vocals:
            return "Vocals"
        }
    }
    
    var icon: String {
        switch self {
        case .audio:
            return "waveform"
        case .midi:
            return "pianokeys"
        case .drums:
            return "circle.grid.2x2"
        case .bass:
            return "music.note"
        case .vocals:
            return "mic"
        }
    }
}

// MARK: - Audio Effect
struct AudioEffect: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var type: EffectType
    var parameters: [String: Float]
    var enabled: Bool
    var bypass: Bool
    
    init(id: UUID = UUID(), name: String, type: EffectType, parameters: [String: Float] = [:], enabled: Bool = true, bypass: Bool = false) {
        self.id = id
        self.name = name
        self.type = type
        self.parameters = parameters
        self.enabled = enabled
        self.bypass = bypass
    }
}

// MARK: - Effect Type
enum EffectType: String, Codable, CaseIterable {
    case reverb = "reverb"
    case delay = "delay"
    case chorus = "chorus"
    case distortion = "distortion"
    case compressor = "compressor"
    case equalizer = "equalizer"
    case filter = "filter"
    case phaser = "phaser"
    case flanger = "flanger"
    case bitcrusher = "bitcrusher"
    
    var displayName: String {
        return rawValue.capitalized
    }
    
    var icon: String {
        switch self {
        case .reverb:
            return "speaker.wave.2"
        case .delay:
            return "timer"
        case .chorus:
            return "waveform.path.ecg"
        case .distortion:
            return "waveform.path.badge.minus"
        case .compressor:
            return "arrow.down.right.and.arrow.up.left"
        case .equalizer:
            return "slider.horizontal.below.rectangle"
        case .filter:
            return "slider.vertical.3"
        case .phaser:
            return "waveform.circle"
        case .flanger:
            return "waveform.circle.fill"
        case .bitcrusher:
            return "square.grid.3x3"
        }
    }
}

// MARK: - Automation Point
struct AutomationPoint: Identifiable, Codable, Hashable {
    let id: UUID
    var time: TimeInterval
    var value: Float
    var parameter: String
    
    init(id: UUID = UUID(), time: TimeInterval, value: Float, parameter: String) {
        self.id = id
        self.time = time
        self.value = value
        self.parameter = parameter
    }
}

// MARK: - Export Format
enum ExportFormat: String, CaseIterable {
    case wav = "wav"
    case mp3 = "mp3"
    case aiff = "aiff"
    case m4a = "m4a"
    case flac = "flac"
    
    var displayName: String {
        return rawValue.uppercased()
    }
    
    var fileExtension: String {
        return rawValue
    }
    
    var mimeType: String {
        switch self {
        case .wav:
            return "audio/wav"
        case .mp3:
            return "audio/mpeg"
        case .aiff:
            return "audio/aiff"
        case .m4a:
            return "audio/mp4"
        case .flac:
            return "audio/flac"
        }
    }
}

// MARK: - User Profile
struct UserProfile: Identifiable, Codable {
    let id: UUID
    var name: String
    var email: String
    var subscriptionTier: SubscriptionTier
    var avatarURL: URL?
    var preferences: UserPreferences
    var createdAt: Date
    
    init(id: UUID = UUID(), name: String, email: String, subscriptionTier: SubscriptionTier = .free, avatarURL: URL? = nil, preferences: UserPreferences = UserPreferences(), createdAt: Date = Date()) {
        self.id = id
        self.name = name
        self.email = email
        self.subscriptionTier = subscriptionTier
        self.avatarURL = avatarURL
        self.preferences = preferences
        self.createdAt = createdAt
    }
}

// MARK: - Subscription Tier
enum SubscriptionTier: String, Codable, CaseIterable {
    case free = "free"
    case pro = "pro"
    case elite = "elite"
    case enterprise = "enterprise"
    
    var displayName: String {
        switch self {
        case .free:
            return "Creator Free"
        case .pro:
            return "Producer Pro"
        case .elite:
            return "Studio Elite"
        case .enterprise:
            return "Enterprise"
        }
    }
    
    var monthlyPrice: Decimal {
        switch self {
        case .free:
            return 0
        case .pro:
            return 19.99
        case .elite:
            return 49.99
        case .enterprise:
            return 199.99
        }
    }
    
    var features: [String] {
        switch self {
        case .free:
            return [
                "3 AI-mastered tracks per month",
                "Basic collaboration (2 users)",
                "1GB cloud storage",
                "Standard quality exports"
            ]
        case .pro:
            return [
                "Unlimited AI mastering",
                "Advanced collaboration (10 users)",
                "100GB cloud storage",
                "High-quality exports",
                "Real-time collaboration"
            ]
        case .elite:
            return [
                "Everything in Producer Pro",
                "Unlimited cloud storage",
                "Priority AI processing",
                "Custom AI model training",
                "Advanced analytics"
            ]
        case .enterprise:
            return [
                "Everything in Studio Elite",
                "Dedicated infrastructure",
                "Custom integrations",
                "Advanced security compliance",
                "Dedicated support team"
            ]
        }
    }
}

// MARK: - User Preferences
struct UserPreferences: Codable {
    var theme: AppTheme
    var audioQuality: AudioQuality
    var autoSave: Bool
    var cloudSync: Bool
    var collaborationNotifications: Bool
    var exportQuality: ExportQuality
    
    init(theme: AppTheme = .system, audioQuality: AudioQuality = .high, autoSave: Bool = true, cloudSync: Bool = true, collaborationNotifications: Bool = true, exportQuality: ExportQuality = .high) {
        self.theme = theme
        self.audioQuality = audioQuality
        self.autoSave = autoSave
        self.cloudSync = cloudSync
        self.collaborationNotifications = collaborationNotifications
        self.exportQuality = exportQuality
    }
}

// MARK: - App Theme
enum AppTheme: String, Codable, CaseIterable {
    case system = "system"
    case light = "light"
    case dark = "dark"
    
    var displayName: String {
        return rawValue.capitalized
    }
}

// MARK: - Audio Quality
enum AudioQuality: String, Codable, CaseIterable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    case studio = "studio"
    
    var displayName: String {
        switch self {
        case .low:
            return "Low (22kHz)"
        case .medium:
            return "Medium (44.1kHz)"
        case .high:
            return "High (48kHz)"
        case .studio:
            return "Studio (96kHz)"
        }
    }
    
    var sampleRate: Double {
        switch self {
        case .low:
            return 22050
        case .medium:
            return 44100
        case .high:
            return 48000
        case .studio:
            return 96000
        }
    }
}

// MARK: - Export Quality
enum ExportQuality: String, Codable, CaseIterable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    case lossless = "lossless"
    
    var displayName: String {
        switch self {
        case .low:
            return "Low (128kbps)"
        case .medium:
            return "Medium (192kbps)"
        case .high:
            return "High (320kbps)"
        case .lossless:
            return "Lossless"
        }
    }
    
    var bitrate: Int {
        switch self {
        case .low:
            return 128
        case .medium:
            return 192
        case .high:
            return 320
        case .lossless:
            return 0 // Indicates lossless
        }
    }
}

// MARK: - Collaboration Session
struct CollaborationSession: Identifiable, Codable {
    let id: UUID
    var projectId: UUID
    var participants: [CollaborationParticipant]
    var isActive: Bool
    var startedAt: Date
    var endedAt: Date?
    
    init(id: UUID = UUID(), projectId: UUID, participants: [CollaborationParticipant] = [], isActive: Bool = false, startedAt: Date = Date(), endedAt: Date? = nil) {
        self.id = id
        self.projectId = projectId
        self.participants = participants
        self.isActive = isActive
        self.startedAt = startedAt
        self.endedAt = endedAt
    }
}

// MARK: - Collaboration Participant
struct CollaborationParticipant: Identifiable, Codable {
    let id: UUID
    var userId: UUID
    var name: String
    var role: CollaborationRole
    var isOnline: Bool
    var lastSeen: Date
    
    init(id: UUID = UUID(), userId: UUID, name: String, role: CollaborationRole = .viewer, isOnline: Bool = false, lastSeen: Date = Date()) {
        self.id = id
        self.userId = userId
        self.name = name
        self.role = role
        self.isOnline = isOnline
        self.lastSeen = lastSeen
    }
}

// MARK: - Collaboration Role
enum CollaborationRole: String, Codable, CaseIterable {
    case owner = "owner"
    case editor = "editor"
    case viewer = "viewer"
    case commentator = "commentator"
    
    var displayName: String {
        return rawValue.capitalized
    }
    
    var permissions: [CollaborationPermission] {
        switch self {
        case .owner:
            return CollaborationPermission.allCases
        case .editor:
            return [.view, .edit, .comment, .collaborate]
        case .viewer:
            return [.view, .comment]
        case .commentator:
            return [.view, .comment]
        }
    }
}

// MARK: - Collaboration Permission
enum CollaborationPermission: String, Codable, CaseIterable {
    case view = "view"
    case edit = "edit"
    case delete = "delete"
    case share = "share"
    case comment = "comment"
    case collaborate = "collaborate"
    case export = "export"
    
    var displayName: String {
        return rawValue.capitalized
    }
}
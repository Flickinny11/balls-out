export interface ProjectData {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  genre?: string;
  key_signature?: string;
  tempo?: number;
  time_signature?: string;
  duration_seconds?: number;
  metadata?: any;
  audio_settings?: any;
  created_at?: Date;
  updated_at?: Date;
}

export interface TrackData {
  id?: string;
  project_id: string;
  name: string;
  track_number: number;
  instrument_type?: string;
  audio_file_url?: string;
  waveform_data?: any;
  effects_chain?: any[];
  automation_data?: any;
  volume?: number;
  pan?: number;
  muted?: boolean;
  soloed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class Project {
  static async create(projectData: Omit<ProjectData, 'id'>): Promise<ProjectData> {
    const project: ProjectData = {
      id: this.generateId(),
      ...projectData,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('Project created:', project.name);
    return project;
  }

  static async findById(id: string): Promise<ProjectData | null> {
    console.log('Looking for project:', id);
    
    // Simulate project data
    return {
      id,
      user_id: 'user_123',
      name: 'My Project',
      description: 'A sample project',
      genre: 'electronic',
      tempo: 120,
      key_signature: 'C',
      time_signature: '4/4',
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  static async findByUserId(userId: string): Promise<ProjectData[]> {
    console.log('Looking for projects by user:', userId);
    
    // Simulate user projects
    return [
      {
        id: 'project_1',
        user_id: userId,
        name: 'Electronic Track',
        description: 'My first electronic composition',
        genre: 'electronic',
        tempo: 128,
        key_signature: 'Am',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'project_2',
        user_id: userId,
        name: 'Ambient Soundscape',
        description: 'Relaxing ambient music',
        genre: 'ambient',
        tempo: 80,
        key_signature: 'C',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  static async update(id: string, updates: Partial<ProjectData>): Promise<ProjectData> {
    const project: ProjectData = {
      id,
      user_id: 'user_123',
      name: updates.name || 'Updated Project',
      description: updates.description,
      genre: updates.genre,
      tempo: updates.tempo,
      key_signature: updates.key_signature,
      updated_at: new Date()
    };

    console.log('Project updated:', id);
    return project;
  }

  static async delete(id: string): Promise<void> {
    console.log('Project deleted:', id);
  }

  static async getTracks(projectId: string): Promise<TrackData[]> {
    console.log('Getting tracks for project:', projectId);
    
    // Simulate project tracks
    return [
      {
        id: 'track_1',
        project_id: projectId,
        name: 'Lead Synth',
        track_number: 1,
        instrument_type: 'synthesizer',
        volume: 0.8,
        pan: 0.0,
        muted: false,
        soloed: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'track_2',
        project_id: projectId,
        name: 'Bass',
        track_number: 2,
        instrument_type: 'bass',
        volume: 0.9,
        pan: 0.0,
        muted: false,
        soloed: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'track_3',
        project_id: projectId,
        name: 'Drums',
        track_number: 3,
        instrument_type: 'drums',
        volume: 0.7,
        pan: 0.0,
        muted: false,
        soloed: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  static async addTrack(trackData: Omit<TrackData, 'id'>): Promise<TrackData> {
    const track: TrackData = {
      id: this.generateTrackId(),
      ...trackData,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('Track added to project:', track.project_id);
    return track;
  }

  static async updateTrack(trackId: string, updates: Partial<TrackData>): Promise<TrackData> {
    const track: TrackData = {
      id: trackId,
      project_id: 'project_123',
      name: updates.name || 'Updated Track',
      track_number: updates.track_number || 1,
      volume: updates.volume,
      pan: updates.pan,
      muted: updates.muted,
      soloed: updates.soloed,
      updated_at: new Date()
    };

    console.log('Track updated:', trackId);
    return track;
  }

  static async deleteTrack(trackId: string): Promise<void> {
    console.log('Track deleted:', trackId);
  }

  private static generateId(): string {
    return 'project_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private static generateTrackId(): string {
    return 'track_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
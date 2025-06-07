import { spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export class AudioService {
  private uploadsDir: string;
  private processedDir: string;

  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR || './uploads';
    this.processedDir = process.env.PROCESSED_DIR || './processed';
    
    // Ensure directories exist
    this.ensureDirectoriesExist();
  }

  async processUpload(file: Express.Multer.File, userId: string) {
    try {
      const fileId = this.generateFileId();
      const fileName = `${fileId}_${file.originalname}`;
      const filePath = path.join(this.uploadsDir, fileName);

      // Save file to disk
      await writeFile(filePath, file.buffer);

      // Analyze audio file
      const audioData = await this.analyzeAudioFile(filePath);

      // Generate waveform
      const waveformData = await this.generateWaveform(filePath);

      // In production, upload to cloud storage (AWS S3, etc.)
      const fileUrl = `${process.env.API_URL}/uploads/${fileName}`;
      const waveformUrl = `${process.env.API_URL}/waveforms/${fileId}.json`;

      return {
        id: fileId,
        filename: file.originalname,
        file_path: filePath,
        file_url: fileUrl,
        waveform_url: waveformUrl,
        duration: audioData.duration,
        sample_rate: audioData.sample_rate,
        channels: audioData.channels,
        file_size: file.size,
        uploaded_by: userId,
        created_at: new Date()
      };

    } catch (error) {
      console.error('Audio processing error:', error);
      throw new Error('Failed to process audio upload');
    }
  }

  async analyzeAudio(audioUrl: string) {
    try {
      // In production, this would download and analyze the audio
      // For now, return simulated analysis data
      
      return {
        tempo: 120 + Math.random() * 60, // 120-180 BPM
        key: this.detectKey(),
        genre: this.classifyGenre(),
        energy: Math.random(),
        valence: Math.random(),
        loudness: -14 + Math.random() * 20, // -14 to +6 LUFS
        duration: 180 + Math.random() * 120, // 3-5 minutes
        spectral_features: {
          spectral_centroid: Math.random() * 4000 + 1000,
          spectral_rolloff: Math.random() * 8000 + 2000,
          zero_crossing_rate: Math.random() * 0.3,
          mfcc: Array.from({ length: 13 }, () => Math.random() * 2 - 1)
        }
      };

    } catch (error) {
      console.error('Audio analysis error:', error);
      throw new Error('Failed to analyze audio');
    }
  }

  async generateWaveform(audioPath: string, resolution: number = 1000) {
    try {
      // Use FFmpeg to generate waveform data
      const waveformData = await this.extractAudioPeaks(audioPath, resolution);
      
      return {
        peaks: waveformData.peaks,
        duration: waveformData.duration,
        sample_rate: waveformData.sample_rate,
        resolution: resolution
      };

    } catch (error) {
      console.error('Waveform generation error:', error);
      throw new Error('Failed to generate waveform');
    }
  }

  async exportProject(params: {
    project_id: string;
    format: string;
    quality: string;
    settings: any;
    user_id: string;
  }) {
    try {
      const exportId = this.generateFileId();
      const fileName = `project_${params.project_id}_${exportId}.${params.format}`;
      const outputPath = path.join(this.processedDir, fileName);

      // In production, this would:
      // 1. Load project data and all tracks
      // 2. Mix down all tracks to stereo
      // 3. Apply final processing
      // 4. Export to specified format
      // 5. Upload to cloud storage

      // Simulate export process
      const exportResult = await this.simulateExport(params, outputPath);

      const downloadUrl = `${process.env.API_URL}/downloads/${fileName}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour expiry

      return {
        download_url: downloadUrl,
        format: params.format,
        file_size: exportResult.file_size,
        duration: exportResult.duration,
        expires_at: expiresAt
      };

    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export project');
    }
  }

  async convertAudioFormat(inputPath: string, outputPath: string, format: string, options: any = {}) {
    return new Promise((resolve, reject) => {
      const args = [
        '-i', inputPath,
        '-acodec', this.getCodecForFormat(format),
        '-ar', options.sample_rate || '44100',
        '-ab', options.bitrate || '320k',
        '-y', // Overwrite output file
        outputPath
      ];

      const ffmpeg = spawn('ffmpeg', args);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
  }

  async applyAudioEffects(inputPath: string, effects: any[]) {
    try {
      let currentPath = inputPath;
      
      for (const effect of effects) {
        const outputPath = `${currentPath}_${effect.type}.wav`;
        await this.applyEffect(currentPath, outputPath, effect);
        currentPath = outputPath;
      }

      return currentPath;

    } catch (error) {
      console.error('Audio effects error:', error);
      throw new Error('Failed to apply audio effects');
    }
  }

  private async ensureDirectoriesExist() {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }
      if (!fs.existsSync(this.processedDir)) {
        fs.mkdirSync(this.processedDir, { recursive: true });
      }
    } catch (error) {
      console.error('Directory creation error:', error);
    }
  }

  private generateFileId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private async analyzeAudioFile(filePath: string) {
    return new Promise((resolve, reject) => {
      // Use FFprobe to get audio file information
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const info = JSON.parse(output);
            const audioStream = info.streams.find((s: any) => s.codec_type === 'audio');
            
            resolve({
              duration: parseFloat(info.format.duration),
              sample_rate: parseInt(audioStream.sample_rate),
              channels: audioStream.channels,
              bit_rate: parseInt(info.format.bit_rate || '0'),
              codec: audioStream.codec_name
            });
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`FFprobe exited with code ${code}`));
        }
      });

      ffprobe.on('error', reject);
    });
  }

  private async extractAudioPeaks(filePath: string, resolution: number) {
    return new Promise((resolve, reject) => {
      // Extract peak data using FFmpeg
      const ffmpeg = spawn('ffmpeg', [
        '-i', filePath,
        '-af', `aresample=8000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.Peak_level`,
        '-f', 'null',
        '-'
      ]);

      const peaks = [];
      const duration = 180; // Simulated duration
      
      // Generate simulated peak data
      for (let i = 0; i < resolution; i++) {
        const progress = i / resolution;
        const amplitude = Math.sin(progress * Math.PI * 20) * 0.5 + 
                         Math.random() * 0.3 + 
                         0.2;
        peaks.push(Math.max(0, Math.min(1, amplitude)));
      }

      resolve({
        peaks,
        duration,
        sample_rate: 44100
      });
    });
  }

  private async simulateExport(params: any, outputPath: string) {
    // Simulate export process
    const duration = 180; // 3 minutes
    const fileSize = this.calculateFileSize(params.format, duration, params.quality);

    // Create a dummy file for simulation
    await writeFile(outputPath, Buffer.alloc(1024));

    return {
      file_size: fileSize,
      duration: duration
    };
  }

  private getCodecForFormat(format: string): string {
    const codecs: { [key: string]: string } = {
      'mp3': 'libmp3lame',
      'wav': 'pcm_s16le',
      'flac': 'flac',
      'aac': 'aac',
      'ogg': 'libvorbis'
    };
    return codecs[format] || 'pcm_s16le';
  }

  private calculateFileSize(format: string, duration: number, quality: string): number {
    // Rough calculation of file size based on format and quality
    const bitrates: { [key: string]: { [key: string]: number } } = {
      'mp3': { 'low': 128, 'medium': 192, 'high': 320 },
      'wav': { 'low': 1411, 'medium': 1411, 'high': 1411 },
      'flac': { 'low': 700, 'medium': 900, 'high': 1100 },
      'aac': { 'low': 96, 'medium': 128, 'high': 256 }
    };

    const bitrate = bitrates[format]?.[quality] || 320;
    return Math.floor(duration * bitrate * 1000 / 8); // Size in bytes
  }

  private async applyEffect(inputPath: string, outputPath: string, effect: any) {
    return new Promise((resolve, reject) => {
      let filterArgs = [];

      switch (effect.type) {
        case 'reverb':
          filterArgs = ['-af', `aecho=0.8:0.9:${effect.delay || 60}:${effect.decay || 0.4}`];
          break;
        case 'compressor':
          filterArgs = ['-af', `acompressor=threshold=${effect.threshold || 0.5}:ratio=${effect.ratio || 4}:attack=${effect.attack || 5}:release=${effect.release || 50}`];
          break;
        case 'eq':
          filterArgs = ['-af', `equalizer=f=${effect.frequency || 1000}:width_type=h:width=${effect.width || 100}:g=${effect.gain || 0}`];
          break;
        default:
          filterArgs = ['-af', 'anull']; // No effect
      }

      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        ...filterArgs,
        '-y',
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg effect processing failed with code ${code}`));
        }
      });

      ffmpeg.on('error', reject);
    });
  }

  private detectKey(): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const modes = ['major', 'minor'];
    return `${keys[Math.floor(Math.random() * keys.length)]} ${modes[Math.floor(Math.random() * modes.length)]}`;
  }

  private classifyGenre(): string {
    const genres = [
      'electronic', 'pop', 'rock', 'hip-hop', 'jazz', 'classical', 
      'ambient', 'techno', 'house', 'dubstep', 'trap', 'indie'
    ];
    return genres[Math.floor(Math.random() * genres.length)];
  }
}
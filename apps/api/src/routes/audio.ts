import { Router, Request, Response } from 'express';
import multer from 'multer';
import { AudioService } from '../services/AudioService';
import { AIService } from '../services/AIService';

const router = Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Upload audio file
router.post('/upload', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please provide an audio file to upload'
      });
    }

    // Process and store the audio file
    const audioService = new AudioService();
    const audioData = await audioService.processUpload(file, user.id);

    res.json({
      message: 'Audio file uploaded successfully',
      audio: {
        id: audioData.id,
        filename: audioData.filename,
        duration: audioData.duration,
        sample_rate: audioData.sample_rate,
        channels: audioData.channels,
        file_url: audioData.file_url,
        waveform_url: audioData.waveform_url
      }
    });

  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to upload audio file'
    });
  }
});

// AI-powered audio mastering
router.post('/master', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { audio_url, style, settings } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL to master'
      });
    }

    // Check user credits
    if (user.credits < 1.0) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need at least 1 credit to use AI mastering'
      });
    }

    const aiService = new AIService();
    const masteringResult = await aiService.masterAudio({
      audio_url,
      style: style || 'balanced',
      settings: settings || {},
      user_id: user.id
    });

    res.json({
      message: 'Audio mastered successfully',
      result: {
        mastered_url: masteringResult.mastered_url,
        settings_applied: masteringResult.settings_applied,
        processing_time: masteringResult.processing_time,
        credits_used: masteringResult.credits_used
      }
    });

  } catch (error) {
    console.error('Audio mastering error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to master audio'
    });
  }
});

// Stem separation
router.post('/separate-stems', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { audio_url, stem_types } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL for stem separation'
      });
    }

    // Check user credits (stem separation costs 2 credits)
    if (user.credits < 2.0) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need at least 2 credits for stem separation'
      });
    }

    const aiService = new AIService();
    const separationResult = await aiService.separateStems({
      audio_url,
      stem_types: stem_types || ['vocals', 'drums', 'bass', 'other'],
      user_id: user.id
    });

    res.json({
      message: 'Stems separated successfully',
      result: {
        stems: separationResult.stems,
        processing_time: separationResult.processing_time,
        credits_used: separationResult.credits_used
      }
    });

  } catch (error) {
    console.error('Stem separation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to separate stems'
    });
  }
});

// Audio analysis
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { audio_url } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL to analyze'
      });
    }

    const audioService = new AudioService();
    const analysisResult = await audioService.analyzeAudio(audio_url);

    res.json({
      message: 'Audio analyzed successfully',
      analysis: {
        tempo: analysisResult.tempo,
        key: analysisResult.key,
        genre: analysisResult.genre,
        energy: analysisResult.energy,
        valence: analysisResult.valence,
        loudness: analysisResult.loudness,
        duration: analysisResult.duration,
        spectral_features: analysisResult.spectral_features
      }
    });

  } catch (error) {
    console.error('Audio analysis error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze audio'
    });
  }
});

// Export project to audio formats
router.post('/export', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { project_id, format, quality, settings } = req.body;

    if (!project_id) {
      return res.status(400).json({
        error: 'Missing project ID',
        message: 'Please provide a project ID to export'
      });
    }

    const audioService = new AudioService();
    const exportResult = await audioService.exportProject({
      project_id,
      format: format || 'wav',
      quality: quality || 'high',
      settings: settings || {},
      user_id: user.id
    });

    res.json({
      message: 'Project exported successfully',
      export: {
        download_url: exportResult.download_url,
        format: exportResult.format,
        file_size: exportResult.file_size,
        duration: exportResult.duration,
        expires_at: exportResult.expires_at
      }
    });

  } catch (error) {
    console.error('Audio export error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export project'
    });
  }
});

// Generate waveform data
router.post('/waveform', async (req: Request, res: Response) => {
  try {
    const { audio_url, resolution } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL to generate waveform'
      });
    }

    const audioService = new AudioService();
    const waveformData = await audioService.generateWaveform(
      audio_url, 
      resolution || 1000
    );

    res.json({
      message: 'Waveform generated successfully',
      waveform: {
        data: waveformData.peaks,
        duration: waveformData.duration,
        sample_rate: waveformData.sample_rate,
        resolution: waveformData.resolution
      }
    });

  } catch (error) {
    console.error('Waveform generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate waveform'
    });
  }
});

export default router;
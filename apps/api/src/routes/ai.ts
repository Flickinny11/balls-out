import { Router, Request, Response } from 'express';
import { AIService } from '../services/AIService';

const router = Router();

// Generate melody using AI
router.post('/generate-melody', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { prompt, style, key, tempo, length } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Missing prompt',
        message: 'Please provide a prompt for melody generation'
      });
    }

    // Check user credits
    if (user.credits < 0.5) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need at least 0.5 credits to generate melodies'
      });
    }

    const aiService = new AIService();
    const melodyResult = await aiService.generateMelody({
      prompt,
      style: style || 'electronic',
      key: key || 'C',
      tempo: tempo || 120,
      length: length || 8,
      user_id: user.id
    });

    res.json({
      message: 'Melody generated successfully',
      result: {
        midi_data: melodyResult.midi_data,
        audio_preview: melodyResult.audio_preview,
        notes: melodyResult.notes,
        credits_used: melodyResult.credits_used
      }
    });

  } catch (error) {
    console.error('Melody generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate melody'
    });
  }
});

// Suggest chord progressions
router.post('/suggest-chords', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { genre, key, mood, length } = req.body;

    const aiService = new AIService();
    const chordsResult = await aiService.suggestChords({
      genre: genre || 'pop',
      key: key || 'C',
      mood: mood || 'happy',
      length: length || 4,
      user_id: user.id
    });

    res.json({
      message: 'Chord suggestions generated successfully',
      result: {
        progressions: chordsResult.progressions,
        midi_data: chordsResult.midi_data,
        chord_names: chordsResult.chord_names
      }
    });

  } catch (error) {
    console.error('Chord suggestion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to suggest chords'
    });
  }
});

// Generate drum patterns
router.post('/generate-drums', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { style, tempo, complexity, length } = req.body;

    if (user.credits < 0.3) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need at least 0.3 credits to generate drum patterns'
      });
    }

    const aiService = new AIService();
    const drumResult = await aiService.generateDrumPattern({
      style: style || 'electronic',
      tempo: tempo || 120,
      complexity: complexity || 'medium',
      length: length || 8,
      user_id: user.id
    });

    res.json({
      message: 'Drum pattern generated successfully',
      result: {
        midi_data: drumResult.midi_data,
        audio_preview: drumResult.audio_preview,
        pattern: drumResult.pattern,
        credits_used: drumResult.credits_used
      }
    });

  } catch (error) {
    console.error('Drum generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate drum pattern'
    });
  }
});

// Analyze song structure
router.post('/analyze-structure', async (req: Request, res: Response) => {
  try {
    const { audio_url } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL to analyze'
      });
    }

    const aiService = new AIService();
    const structureResult = await aiService.analyzeStructure(audio_url);

    res.json({
      message: 'Song structure analyzed successfully',
      result: {
        sections: structureResult.sections,
        tempo_changes: structureResult.tempo_changes,
        key_changes: structureResult.key_changes,
        energy_curve: structureResult.energy_curve,
        recommendations: structureResult.recommendations
      }
    });

  } catch (error) {
    console.error('Structure analysis error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze song structure'
    });
  }
});

// Smart mixing suggestions
router.post('/mixing-suggestions', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { tracks, genre, reference_track } = req.body;

    if (!tracks || !Array.isArray(tracks)) {
      return res.status(400).json({
        error: 'Missing tracks',
        message: 'Please provide an array of tracks to analyze'
      });
    }

    const aiService = new AIService();
    const mixingResult = await aiService.generateMixingSuggestions({
      tracks,
      genre: genre || 'electronic',
      reference_track,
      user_id: user.id
    });

    res.json({
      message: 'Mixing suggestions generated successfully',
      result: {
        eq_suggestions: mixingResult.eq_suggestions,
        compression_settings: mixingResult.compression_settings,
        reverb_settings: mixingResult.reverb_settings,
        panning_suggestions: mixingResult.panning_suggestions,
        level_suggestions: mixingResult.level_suggestions,
        processing_chain: mixingResult.processing_chain
      }
    });

  } catch (error) {
    console.error('Mixing suggestions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate mixing suggestions'
    });
  }
});

// Generate variations of existing audio
router.post('/generate-variations', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { audio_url, variation_type, intensity } = req.body;

    if (!audio_url) {
      return res.status(400).json({
        error: 'Missing audio URL',
        message: 'Please provide an audio URL to create variations'
      });
    }

    if (user.credits < 1.0) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need at least 1 credit to generate variations'
      });
    }

    const aiService = new AIService();
    const variationResult = await aiService.generateVariations({
      audio_url,
      variation_type: variation_type || 'remix',
      intensity: intensity || 'medium',
      user_id: user.id
    });

    res.json({
      message: 'Variations generated successfully',
      result: {
        variations: variationResult.variations,
        original_analysis: variationResult.original_analysis,
        credits_used: variationResult.credits_used
      }
    });

  } catch (error) {
    console.error('Variation generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate variations'
    });
  }
});

// Get AI model status and capabilities
router.get('/models', async (req: Request, res: Response) => {
  try {
    const aiService = new AIService();
    const models = await aiService.getAvailableModels();

    res.json({
      models: models.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        capabilities: model.capabilities,
        cost_per_use: model.cost_per_use,
        status: model.status
      }))
    });

  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch available models'
    });
  }
});

export default router;
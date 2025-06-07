import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';

const router = Router();

// Get all projects for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const projects = await Project.findByUserId(user.id);

    res.json({
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        genre: project.genre,
        tempo: project.tempo,
        key_signature: project.key_signature,
        duration_seconds: project.duration_seconds,
        created_at: project.created_at,
        updated_at: project.updated_at
      }))
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch projects'
    });
  }
});

// Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, description, genre, tempo, key_signature } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Project name is required'
      });
    }

    const project = await Project.create({
      user_id: user.id,
      name,
      description: description || '',
      genre: genre || 'electronic',
      tempo: tempo || 120,
      key_signature: key_signature || 'C',
      time_signature: '4/4',
      metadata: {},
      audio_settings: {
        sample_rate: 44100,
        bit_depth: 24,
        channels: 2
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        genre: project.genre,
        tempo: project.tempo,
        key_signature: project.key_signature,
        created_at: project.created_at
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create project'
    });
  }
});

// Get a specific project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The requested project does not exist'
      });
    }

    // Check if user owns the project or has collaboration access
    if (project.user_id !== user.id) {
      // TODO: Check collaboration permissions
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this project'
      });
    }

    // Get project tracks
    const tracks = await Project.getTracks(projectId);

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        genre: project.genre,
        tempo: project.tempo,
        key_signature: project.key_signature,
        time_signature: project.time_signature,
        duration_seconds: project.duration_seconds,
        metadata: project.metadata,
        audio_settings: project.audio_settings,
        created_at: project.created_at,
        updated_at: project.updated_at,
        tracks: tracks
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch project'
    });
  }
});

// Update a project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const projectId = req.params.id;
    const updates = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The requested project does not exist'
      });
    }

    if (project.user_id !== user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to modify this project'
      });
    }

    const updatedProject = await Project.update(projectId, updates);

    res.json({
      message: 'Project updated successfully',
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
        genre: updatedProject.genre,
        tempo: updatedProject.tempo,
        key_signature: updatedProject.key_signature,
        updated_at: updatedProject.updated_at
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update project'
    });
  }
});

// Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The requested project does not exist'
      });
    }

    if (project.user_id !== user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this project'
      });
    }

    await Project.delete(projectId);

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete project'
    });
  }
});

export default router;
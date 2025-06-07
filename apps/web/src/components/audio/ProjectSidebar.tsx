'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  description?: string
  genre?: string
  tempo?: number
  tracks?: Track[]
}

interface Track {
  id: string
  name: string
  type: string
  volume: number
  pan: number
  muted: boolean
  soloed: boolean
}

interface ProjectSidebarProps {
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  onTrackSelect: (track: Track) => void
}

export function ProjectSidebar({ 
  currentProject, 
  onProjectSelect, 
  onTrackSelect 
}: ProjectSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  // Simulate loading projects
  useEffect(() => {
    setProjects([
      {
        id: '1',
        name: 'Electronic Track',
        description: 'My first electronic composition',
        genre: 'electronic',
        tempo: 128,
        tracks: [
          { id: 't1', name: 'Lead Synth', type: 'synth', volume: 0.8, pan: 0, muted: false, soloed: false },
          { id: 't2', name: 'Bass', type: 'bass', volume: 0.9, pan: 0, muted: false, soloed: false },
          { id: 't3', name: 'Drums', type: 'drums', volume: 0.7, pan: 0, muted: false, soloed: false }
        ]
      },
      {
        id: '2',
        name: 'Ambient Soundscape',
        description: 'Relaxing ambient music',
        genre: 'ambient',
        tempo: 80,
        tracks: [
          { id: 't4', name: 'Pad', type: 'pad', volume: 0.6, pan: 0, muted: false, soloed: false },
          { id: 't5', name: 'Texture', type: 'texture', volume: 0.4, pan: -0.3, muted: false, soloed: false }
        ]
      }
    ])
  }, [])

  const createProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        genre: 'electronic',
        tempo: 120,
        tracks: []
      }
      setProjects([...projects, newProject])
      setNewProjectName('')
      setIsCreatingProject(false)
      onProjectSelect(newProject)
    }
  }

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <button 
            className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm hover:bg-primary-600 transition-colors"
            onClick={() => setIsCreatingProject(true)}
          >
            +
          </button>
        </div>

        {isCreatingProject && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && createProject()}
              autoFocus
            />
            <div className="flex space-x-2">
              <button 
                className="btn-primary text-sm px-3 py-1"
                onClick={createProject}
              >
                Create
              </button>
              <button 
                className="btn-secondary text-sm px-3 py-1"
                onClick={() => {
                  setIsCreatingProject(false)
                  setNewProjectName('')
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentProject?.id === project.id 
                ? 'bg-primary-500/20 border border-primary-500' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            onClick={() => onProjectSelect(project)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-medium text-white">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-gray-400 mt-1">{project.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              {project.genre && <span>{project.genre}</span>}
              {project.tempo && <span>{project.tempo} BPM</span>}
              {project.tracks && <span>{project.tracks.length} tracks</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Project Tracks */}
      {currentProject && currentProject.tracks && (
        <div className="border-t border-slate-700 p-4">
          <h3 className="text-sm font-medium text-white mb-3">Tracks</h3>
          <div className="space-y-2">
            {currentProject.tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-2 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    track.type === 'synth' ? 'bg-blue-500' :
                    track.type === 'bass' ? 'bg-red-500' :
                    track.type === 'drums' ? 'bg-yellow-500' :
                    track.type === 'pad' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`} />
                  <span className="text-sm text-white">{track.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {track.muted && (
                    <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center text-xs text-white">
                      M
                    </div>
                  )}
                  {track.soloed && (
                    <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center text-xs text-white">
                      S
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-3 py-2 bg-slate-600 rounded-lg text-sm text-white hover:bg-slate-500 transition-colors">
            + Add Track
          </button>
        </div>
      )}
    </div>
  )
}
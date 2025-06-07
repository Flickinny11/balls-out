'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AudioWorkstation } from '@/components/audio/AudioWorkstation'
import { ProjectSidebar } from '@/components/audio/ProjectSidebar'
import { TrackEditor } from '@/components/audio/TrackEditor'
import { MixingConsole } from '@/components/audio/MixingConsole'

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

export default function StudioPage() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <div className="h-screen bg-slate-900 flex">
      {/* Project Sidebar */}
      <div className="w-80 border-r border-slate-700">
        <ProjectSidebar 
          currentProject={currentProject}
          onProjectSelect={setCurrentProject}
          onTrackSelect={setSelectedTrack}
        />
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6">
          <div className="flex items-center space-x-4">
            <button 
              className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
              ⏹️
            </button>
            <button className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
              ⏮️
            </button>
            <button className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-600 transition-colors">
              ⏭️
            </button>
          </div>

          <div className="flex-1 mx-8">
            <div className="text-sm text-gray-400">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">120 BPM</div>
            <div className="text-sm text-gray-400">4/4</div>
            <div className="text-sm text-gray-400">C Major</div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex">
          {/* Track Editor - Main Center Area */}
          <div className="flex-1">
            <TrackEditor 
              project={currentProject}
              selectedTrack={selectedTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
            />
          </div>

          {/* Mixing Console - Right Side */}
          <div className="w-96 border-l border-slate-700">
            <MixingConsole 
              project={currentProject}
              onTrackUpdate={(trackId, updates) => {
                console.log('Track updated:', trackId, updates)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
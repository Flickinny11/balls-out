'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Track {
  id: string
  name: string
  type: string
  volume: number
  pan: number
  muted: boolean
  soloed: boolean
  waveform?: number[]
}

interface Project {
  id: string
  name: string
  tracks?: Track[]
}

interface TrackEditorProps {
  project: Project | null
  selectedTrack: Track | null
  isPlaying: boolean
  currentTime: number
  onTimeUpdate: (time: number) => void
}

export function TrackEditor({ 
  project, 
  selectedTrack, 
  isPlaying, 
  currentTime, 
  onTimeUpdate 
}: TrackEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Generate sample waveform data for demonstration
  const generateWaveform = (length: number = 1000) => {
    return Array.from({ length }, (_, i) => {
      const frequency1 = Math.sin(i * 0.01) * 0.5
      const frequency2 = Math.sin(i * 0.005) * 0.3
      const noise = (Math.random() - 0.5) * 0.1
      return Math.max(-1, Math.min(1, frequency1 + frequency2 + noise))
    })
  }

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !project || !project.tracks) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Draw track backgrounds
    const trackHeight = height / Math.max(project.tracks.length, 1)
    
    project.tracks.forEach((track, index) => {
      const y = index * trackHeight
      
      // Track background
      ctx.fillStyle = track === selectedTrack ? 'rgba(139, 92, 246, 0.1)' : 'rgba(30, 41, 59, 0.5)'
      ctx.fillRect(0, y, width, trackHeight - 1)
      
      // Track separator
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y + trackHeight)
      ctx.lineTo(width, y + trackHeight)
      ctx.stroke()

      // Draw waveform if track has audio
      if (track.waveform || track.type) {
        const waveform = track.waveform || generateWaveform(width / 2)
        const centerY = y + trackHeight / 2
        const amplitude = (trackHeight - 20) / 2

        ctx.strokeStyle = track === selectedTrack ? 'rgb(139, 92, 246)' : 'rgb(34, 197, 94)'
        ctx.lineWidth = 1.5
        ctx.beginPath()

        waveform.forEach((sample, i) => {
          const x = (i / waveform.length) * width * zoom - scrollPosition
          const waveY = centerY + sample * amplitude * (track.muted ? 0.3 : 1)
          
          if (x >= 0 && x <= width) {
            if (i === 0) {
              ctx.moveTo(x, waveY)
            } else {
              ctx.lineTo(x, waveY)
            }
          }
        })
        ctx.stroke()

        // Track name
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '12px system-ui'
        ctx.fillText(track.name, 10, y + 20)
      }
    })

    // Draw playhead
    const playheadX = (currentTime / 180) * width * zoom - scrollPosition // Assuming 3 minute max length
    if (playheadX >= 0 && playheadX <= width) {
      ctx.strokeStyle = 'rgb(239, 68, 68)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(playheadX, 0)
      ctx.lineTo(playheadX, height)
      ctx.stroke()
    }

  }, [project, selectedTrack, currentTime, zoom, scrollPosition])

  // Handle canvas click for seeking
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newTime = ((x + scrollPosition) / (canvas.width * zoom)) * 180 // 3 minutes max
    onTimeUpdate(Math.max(0, Math.min(180, newTime)))
  }

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Timeline Header */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">Timeline</div>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button 
              className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm hover:bg-slate-600 transition-colors"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            >
              -
            </button>
            <span className="text-sm text-gray-400 w-12 text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button 
              className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm hover:bg-slate-600 transition-colors"
              onClick={() => setZoom(Math.min(5, zoom + 0.1))}
            >
              +
            </button>
          </div>

          {/* Time Markers */}
          <div className="flex items-center space-x-4 ml-8 text-xs text-gray-500">
            <span>0:00</span>
            <span>0:30</span>
            <span>1:00</span>
            <span>1:30</span>
            <span>2:00</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
        />

        {/* Track Controls Overlay */}
        {project && project.tracks && (
          <div className="absolute left-0 top-0 w-48 h-full bg-slate-800/90 border-r border-slate-700">
            {project.tracks.map((track, index) => {
              const trackHeight = 400 / project.tracks!.length
              return (
                <div
                  key={track.id}
                  className="flex items-center p-2 border-b border-slate-700"
                  style={{ height: trackHeight }}
                >
                  <div className="flex items-center space-x-2">
                    <button
                      className={`w-6 h-6 rounded text-xs font-semibold ${
                        track.muted 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                      }`}
                      onClick={() => {
                        // Handle mute toggle
                        console.log('Toggle mute for', track.id)
                      }}
                    >
                      M
                    </button>
                    <button
                      className={`w-6 h-6 rounded text-xs font-semibold ${
                        track.soloed 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                      }`}
                      onClick={() => {
                        // Handle solo toggle
                        console.log('Toggle solo for', track.id)
                      }}
                    >
                      S
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selection and Edit Tools */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="w-10 h-10 bg-slate-700/90 rounded-lg flex items-center justify-center text-white hover:bg-slate-600/90 transition-colors">
            ✂️
          </button>
          <button className="w-10 h-10 bg-slate-700/90 rounded-lg flex items-center justify-center text-white hover:bg-slate-600/90 transition-colors">
            📋
          </button>
          <button className="w-10 h-10 bg-slate-700/90 rounded-lg flex items-center justify-center text-white hover:bg-slate-600/90 transition-colors">
            🔧
          </button>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-slate-800 border-t border-slate-700 flex items-center px-4 text-xs text-gray-400">
        <span>Ready</span>
        {selectedTrack && (
          <span className="ml-4">Selected: {selectedTrack.name}</span>
        )}
        <div className="ml-auto">
          Sample Rate: 44.1kHz | Bit Depth: 24-bit
        </div>
      </div>
    </div>
  )
}
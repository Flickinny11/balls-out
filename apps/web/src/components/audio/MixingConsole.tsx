'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Track {
  id: string
  name: string
  type: string
  volume: number
  pan: number
  muted: boolean
  soloed: boolean
}

interface Project {
  id: string
  name: string
  tracks?: Track[]
}

interface MixingConsoleProps {
  project: Project | null
  onTrackUpdate: (trackId: string, updates: Partial<Track>) => void
}

interface ChannelStripProps {
  track: Track
  onUpdate: (updates: Partial<Track>) => void
}

function ChannelStrip({ track, onUpdate }: ChannelStripProps) {
  const [showEQ, setShowEQ] = useState(false)
  const [eqLow, setEqLow] = useState(0)
  const [eqMid, setEqMid] = useState(0)
  const [eqHigh, setEqHigh] = useState(0)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    onUpdate({ volume })
  }

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pan = parseFloat(e.target.value)
    onUpdate({ pan })
  }

  const toggleMute = () => {
    onUpdate({ muted: !track.muted })
  }

  const toggleSolo = () => {
    onUpdate({ soloed: !track.soloed })
  }

  return (
    <div className="w-20 bg-slate-800 border-r border-slate-700 p-2 flex flex-col items-center">
      {/* Track Name */}
      <div className="text-xs text-white text-center mb-4 truncate w-full">
        {track.name}
      </div>

      {/* Track Type Indicator */}
      <div className={`w-4 h-4 rounded-full mb-4 ${
        track.type === 'synth' ? 'bg-blue-500' :
        track.type === 'bass' ? 'bg-red-500' :
        track.type === 'drums' ? 'bg-yellow-500' :
        track.type === 'pad' ? 'bg-purple-500' :
        'bg-green-500'
      }`} />

      {/* EQ Section */}
      <div className="mb-4">
        <button 
          className={`text-xs px-2 py-1 rounded ${showEQ ? 'bg-primary-500 text-white' : 'bg-slate-600 text-gray-300'}`}
          onClick={() => setShowEQ(!showEQ)}
        >
          EQ
        </button>
        
        {showEQ && (
          <motion.div 
            className="mt-2 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {/* High EQ */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">H</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={eqHigh}
                onChange={(e) => setEqHigh(parseFloat(e.target.value))}
                className="w-12 h-1 bg-slate-700 rounded-lg appearance-none slider"
                style={{ writingMode: 'vertical-lr' as any }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {eqHigh > 0 ? '+' : ''}{eqHigh.toFixed(1)}
              </span>
            </div>
            
            {/* Mid EQ */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">M</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={eqMid}
                onChange={(e) => setEqMid(parseFloat(e.target.value))}
                className="w-12 h-1 bg-slate-700 rounded-lg appearance-none slider"
              />
              <span className="text-xs text-gray-500 mt-1">
                {eqMid > 0 ? '+' : ''}{eqMid.toFixed(1)}
              </span>
            </div>
            
            {/* Low EQ */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">L</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={eqLow}
                onChange={(e) => setEqLow(parseFloat(e.target.value))}
                className="w-12 h-1 bg-slate-700 rounded-lg appearance-none slider"
              />
              <span className="text-xs text-gray-500 mt-1">
                {eqLow > 0 ? '+' : ''}{eqLow.toFixed(1)}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Pan Control */}
      <div className="mb-4 flex flex-col items-center">
        <label className="text-xs text-gray-400 mb-2">Pan</label>
        <div className="relative">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={track.pan}
            onChange={handlePanChange}
            className="w-12 h-1 bg-slate-700 rounded-lg appearance-none slider"
          />
          <div className="text-xs text-gray-500 mt-1 text-center">
            {track.pan === 0 ? 'C' : 
             track.pan > 0 ? `R${Math.round(track.pan * 100)}` : 
             `L${Math.round(Math.abs(track.pan) * 100)}`}
          </div>
        </div>
      </div>

      {/* Volume Fader */}
      <div className="flex-1 flex flex-col items-center justify-end mb-4">
        <label className="text-xs text-gray-400 mb-2">Vol</label>
        <div className="relative h-32">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={handleVolumeChange}
            className="fader"
            style={{
              writingMode: 'vertical-lr' as any,
              appearance: 'slider-vertical' as any,
              width: '4px',
              height: '128px'
            }}
          />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            {Math.round(track.volume * 100)}
          </div>
        </div>
      </div>

      {/* Mute and Solo Buttons */}
      <div className="space-y-2">
        <button
          className={`w-8 h-6 rounded text-xs font-semibold transition-colors ${
            track.muted 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          onClick={toggleMute}
        >
          M
        </button>
        <button
          className={`w-8 h-6 rounded text-xs font-semibold transition-colors ${
            track.soloed 
              ? 'bg-yellow-500 text-white' 
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          onClick={toggleSolo}
        >
          S
        </button>
      </div>

      {/* Level Meter */}
      <div className="mt-4 w-2 h-16 bg-slate-700 rounded-full relative overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
          style={{ 
            height: `${track.muted ? 0 : (track.volume * 80 + Math.random() * 20)}%` 
          }}
        />
      </div>
    </div>
  )
}

export function MixingConsole({ project, onTrackUpdate }: MixingConsoleProps) {
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [showCompressor, setShowCompressor] = useState(false)
  const [showReverb, setShowReverb] = useState(false)

  if (!project || !project.tracks) {
    return (
      <div className="h-full bg-slate-800 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-4">🎛️</div>
          <div>Select a project to view mixing console</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">Mixing Console</h3>
        <div className="text-sm text-gray-400">{project.name}</div>
      </div>

      {/* Track Channels */}
      <div className="flex-1 flex overflow-x-auto">
        {project.tracks.map((track) => (
          <ChannelStrip
            key={track.id}
            track={track}
            onUpdate={(updates) => onTrackUpdate(track.id, updates)}
          />
        ))}
        
        {/* Master Channel */}
        <div className="w-24 bg-slate-900 border-l-2 border-primary-500 p-2 flex flex-col items-center">
          <div className="text-xs text-white text-center mb-4 font-semibold">
            MASTER
          </div>

          {/* Master Effects */}
          <div className="mb-4 space-y-2">
            <button 
              className={`text-xs px-2 py-1 rounded w-full ${showCompressor ? 'bg-primary-500 text-white' : 'bg-slate-600 text-gray-300'}`}
              onClick={() => setShowCompressor(!showCompressor)}
            >
              COMP
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded w-full ${showReverb ? 'bg-primary-500 text-white' : 'bg-slate-600 text-gray-300'}`}
              onClick={() => setShowReverb(!showReverb)}
            >
              REVERB
            </button>
          </div>

          {/* Master Volume Fader */}
          <div className="flex-1 flex flex-col items-center justify-end mb-4">
            <label className="text-xs text-gray-400 mb-2">Master</label>
            <div className="relative h-32">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="fader"
                style={{
                  writingMode: 'vertical-lr' as any,
                  appearance: 'slider-vertical' as any,
                  width: '6px',
                  height: '128px'
                }}
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                {Math.round(masterVolume * 100)}
              </div>
            </div>
          </div>

          {/* Master Level Meter */}
          <div className="flex space-x-1">
            <div className="w-3 h-20 bg-slate-700 rounded-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                style={{ height: `${masterVolume * 85 + Math.random() * 15}%` }}
              />
            </div>
            <div className="w-3 h-20 bg-slate-700 rounded-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                style={{ height: `${masterVolume * 80 + Math.random() * 20}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="text-sm font-medium text-white mb-2">🤖 AI Assistant</div>
        <div className="space-y-2">
          <button className="w-full py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
            Auto-Mix
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-600 transition-colors">
              Balance
            </button>
            <button className="py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-600 transition-colors">
              EQ Suggest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
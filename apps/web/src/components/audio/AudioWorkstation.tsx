'use client'

import { useRef, useEffect, useState } from 'react'

interface AudioWorkstationProps {
  onAudioLoad?: (audioContext: AudioContext) => void
  onTimeUpdate?: (currentTime: number) => void
}

export function AudioWorkstation({ onAudioLoad, onTimeUpdate }: AudioWorkstationProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Web Audio API
    const initializeAudio = async () => {
      try {
        // Create AudioContext
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Request microphone access for recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log('Audio initialized with microphone access')
        
        setIsInitialized(true)
        
        if (onAudioLoad) {
          onAudioLoad(audioContextRef.current)
        }
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }

    // Initialize on user interaction (required by browsers)
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio()
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [onAudioLoad, isInitialized])

  const loadAudioFile = async (file: File): Promise<AudioBuffer> => {
    if (!audioContextRef.current) {
      throw new Error('Audio context not initialized')
    }

    const arrayBuffer = await file.arrayBuffer()
    return await audioContextRef.current.decodeAudioData(arrayBuffer)
  }

  const playAudioBuffer = (audioBuffer: AudioBuffer, startTime: number = 0) => {
    if (!audioContextRef.current) {
      throw new Error('Audio context not initialized')
    }

    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContextRef.current.destination)
    source.start(0, startTime)

    return source
  }

  const createGainNode = (): GainNode => {
    if (!audioContextRef.current) {
      throw new Error('Audio context not initialized')
    }
    return audioContextRef.current.createGain()
  }

  const createAnalyser = (): AnalyserNode => {
    if (!audioContextRef.current) {
      throw new Error('Audio context not initialized')
    }
    return audioContextRef.current.createAnalyser()
  }

  return (
    <div className="hidden">
      {/* This component manages audio context in the background */}
      {isInitialized ? (
        <div className="text-green-500 text-xs">Audio Ready</div>
      ) : (
        <div className="text-yellow-500 text-xs">Click anywhere to enable audio</div>
      )}
    </div>
  )
}

// Audio utilities
export class AudioEngine {
  private audioContext: AudioContext
  private masterGain: GainNode
  private tracks: Map<string, AudioTrack> = new Map()

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext
    this.masterGain = audioContext.createGain()
    this.masterGain.connect(audioContext.destination)
  }

  createTrack(id: string): AudioTrack {
    const track = new AudioTrack(this.audioContext, this.masterGain)
    this.tracks.set(id, track)
    return track
  }

  getTrack(id: string): AudioTrack | undefined {
    return this.tracks.get(id)
  }

  removeTrack(id: string): void {
    const track = this.tracks.get(id)
    if (track) {
      track.disconnect()
      this.tracks.delete(id)
    }
  }

  setMasterVolume(volume: number): void {
    this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
  }

  getMasterVolume(): number {
    return this.masterGain.gain.value
  }
}

export class AudioTrack {
  private audioContext: AudioContext
  private destination: AudioNode
  private gainNode: GainNode
  private panNode: StereoPannerNode
  private source: AudioBufferSourceNode | null = null
  private analyser: AnalyserNode
  
  public muted: boolean = false
  public soloed: boolean = false

  constructor(audioContext: AudioContext, destination: AudioNode) {
    this.audioContext = audioContext
    this.destination = destination
    
    // Create audio nodes
    this.gainNode = audioContext.createGain()
    this.panNode = audioContext.createStereoPanner()
    this.analyser = audioContext.createAnalyser()
    
    // Connect the audio chain
    this.gainNode.connect(this.panNode)
    this.panNode.connect(this.analyser)
    this.analyser.connect(destination)
  }

  loadBuffer(audioBuffer: AudioBuffer): void {
    if (this.source) {
      this.source.disconnect()
    }
    
    this.source = this.audioContext.createBufferSource()
    this.source.buffer = audioBuffer
    this.source.connect(this.gainNode)
  }

  play(startTime: number = 0): void {
    if (this.source && !this.muted) {
      this.source.start(0, startTime)
    }
  }

  stop(): void {
    if (this.source) {
      this.source.stop()
    }
  }

  setVolume(volume: number): void {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
  }

  getVolume(): number {
    return this.gainNode.gain.value
  }

  setPan(pan: number): void {
    this.panNode.pan.setValueAtTime(pan, this.audioContext.currentTime)
  }

  getPan(): number {
    return this.panNode.pan.value
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    this.gainNode.gain.setValueAtTime(muted ? 0 : this.getVolume(), this.audioContext.currentTime)
  }

  setSoloed(soloed: boolean): void {
    this.soloed = soloed
    // Solo logic would need to be handled at the engine level
  }

  getFrequencyData(): Uint8Array {
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(dataArray)
    return dataArray
  }

  getTimeDomainData(): Uint8Array {
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteTimeDomainData(dataArray)
    return dataArray
  }

  disconnect(): void {
    if (this.source) {
      this.source.disconnect()
    }
    this.gainNode.disconnect()
    this.panNode.disconnect()
    this.analyser.disconnect()
  }
}
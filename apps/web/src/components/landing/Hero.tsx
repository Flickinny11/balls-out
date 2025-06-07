'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { WaveformVisualization } from '../audio/WaveformVisualization'
import Link from 'next/link'

export function Hero() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-hero-gradient opacity-30" />
      <div className="absolute inset-0">
        <Canvas>
          <WaveformVisualization />
        </Canvas>
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center max-w-5xl mx-auto px-4"
        style={{ y, opacity }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="gradient-text">Superior Music</span>
          <br />
          <span className="text-white">Production</span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          The future of music creation is here. Professional audio editing, AI-powered mastering, 
          and real-time collaboration that surpasses everything you've experienced.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <Link href="/studio" className="btn-primary text-lg px-8 py-4">
            🎵 Start Creating
          </Link>
          <button className="btn-secondary text-lg px-8 py-4">
            ▶️ Watch Demo
          </button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <FeatureCard 
            icon="🤖"
            title="AI-Powered Mastering"
            description="Advanced machine learning that understands your music"
          />
          <FeatureCard 
            icon="🌍"
            title="Real-time Collaboration"
            description="Work together with musicians around the world"
          />
          <FeatureCard 
            icon="🍎"
            title="Apple Integration"
            description="Deep integration with GarageBand and iOS devices"
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <motion.div 
      className="card text-center"
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 50px rgba(139, 92, 246, 0.2)"
      }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  )
}
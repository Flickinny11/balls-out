'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function Demo() {
  const [activeDemo, setActiveDemo] = useState(0)

  const demos = [
    {
      title: "AI Mastering in Action",
      description: "Watch our AI analyze and master a track in real-time",
      thumbnail: "/demo-mastering.jpg"
    },
    {
      title: "Real-time Collaboration",
      description: "See multiple users editing the same project simultaneously",
      thumbnail: "/demo-collaboration.jpg"
    },
    {
      title: "Apple Integration",
      description: "Seamless workflow between GarageBand and LTB Audio",
      thumbnail: "/demo-apple.jpg"
    }
  ]

  return (
    <section id="demo" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">See It</span>
            <br />
            <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of LTB Audio through interactive demos and real-world examples.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Player */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder for video player */}
              <div className="w-full h-full flex items-center justify-center">
                <motion.button 
                  className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ▶️
                </motion.button>
              </div>
            </div>
            
            {/* Demo controls */}
            <div className="mt-6 space-y-3">
              {demos.map((demo, index) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    activeDemo === index 
                      ? 'glass bg-primary-500/20 border-primary-500' 
                      : 'glass hover:bg-white/10'
                  }`}
                  onClick={() => setActiveDemo(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold text-white">{demo.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{demo.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Interactive Studio Preview */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-4">Try the Studio</h3>
              <p className="text-gray-300 mb-6">
                Get hands-on experience with our powerful audio editing tools.
              </p>
              
              {/* Mini studio preview */}
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400">LTB Audio Studio</span>
                </div>
                
                {/* Simulated waveform */}
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-16 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded opacity-75" />
                      <div className="flex-1 h-2 bg-slate-700 rounded">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full">
                Launch Studio Beta
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text">10M+</div>
                <div className="text-sm text-gray-400">Samples Available</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text">&lt;10ms</div>
                <div className="text-sm text-gray-400">Audio Latency</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'

export function Features() {
  const features = [
    {
      title: "AI-Powered Mastering Engine",
      description: "Advanced machine learning algorithms that understand your music and apply professional mastering techniques automatically.",
      icon: "🤖",
      details: [
        "Multi-modal AI analysis",
        "Real-time processing",
        "Style transfer capabilities",
        "Custom model training"
      ]
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with musicians around the world in real-time. See changes as they happen with live cursors and instant sync.",
      icon: "🌍",
      details: [
        "Live audio streaming",
        "Operational transform",
        "Version control",
        "Multi-user editing"
      ]
    },
    {
      title: "Apple Ecosystem Integration",
      description: "Deep integration with GarageBand, Logic Pro, and all Apple devices. Native apps with CoreML and Metal acceleration.",
      icon: "🍎",
      details: [
        "GarageBand project import",
        "CoreML on-device processing",
        "Metal GPU acceleration",
        "iCloud sync"
      ]
    },
    {
      title: "Professional Audio Engine",
      description: "Industry-standard audio processing with unlimited tracks, advanced effects, and spatial audio support.",
      icon: "🎛️",
      details: [
        "Unlimited tracks",
        "Advanced MIDI editing",
        "Comprehensive automation",
        "VST3/AU plugin support"
      ]
    },
    {
      title: "Sample Library",
      description: "Access millions of royalty-free samples with AI-powered recommendations and smart search capabilities.",
      icon: "📚",
      details: [
        "10+ million samples",
        "AI-generated content",
        "Smart recommendations",
        "Clear licensing"
      ]
    },
    {
      title: "Advanced Audio Processing",
      description: "Cutting-edge audio algorithms including stem separation, restoration, and spatial audio creation.",
      icon: "⚡",
      details: [
        "AI stem separation",
        "Audio restoration",
        "Pitch correction",
        "Spatial audio support"
      ]
    }
  ]

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Revolutionary</span>
            <br />
            <span className="text-white">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create professional music, powered by cutting-edge AI and designed for the modern creator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card group hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:gradient-text transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="btn-primary text-lg px-8 py-4">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  )
}
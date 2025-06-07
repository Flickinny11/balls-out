'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Creator Free",
      description: "Perfect for getting started",
      price: 0,
      annualPrice: 0,
      features: [
        "3 AI-mastered tracks per month",
        "Basic collaboration (2 users)",
        "1GB cloud storage",
        "Standard quality exports (44.1kHz/16-bit)",
        "Basic sample library access",
        "Community support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Producer Pro",
      description: "For serious music creators",
      price: 19.99,
      annualPrice: 15.99,
      features: [
        "Unlimited AI mastering with advanced models",
        "Advanced collaboration (10 users)",
        "100GB cloud storage",
        "High-quality exports (96kHz/24-bit)",
        "GarageBand Pro integration",
        "Real-time collaboration features",
        "Premium sample library",
        "Priority support"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Studio Elite",
      description: "For professional studios",
      price: 49.99,
      annualPrice: 39.99,
      features: [
        "Everything in Producer Pro",
        "Unlimited cloud storage",
        "Priority AI processing",
        "Custom AI model training",
        "Advanced analytics and insights",
        "API access for integrations",
        "White-label options",
        "Dedicated support team"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="gradient-text">Creative Plan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include access to our core features with increasing limits and advanced capabilities.
          </p>

          {/* Billing toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <motion.button
              className="relative w-12 h-6 bg-slate-700 rounded-full p-1"
              onClick={() => setIsAnnual(!isAnnual)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-primary-500 rounded-full"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1 text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative card ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    ${isAnnual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {plan.price === 0 ? 'forever' : '/month'}
                  </span>
                  {isAnnual && plan.price > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      ${plan.price}/month
                    </div>
                  )}
                </div>

                <motion.button 
                  className={`w-full mb-8 ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.cta}
                </motion.button>

                <ul className="space-y-4 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="card max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-3xl font-bold text-white mb-4">Enterprise</h3>
                <p className="text-gray-300 mb-6">
                  Custom solutions for large organizations, record labels, and enterprise clients. 
                  Get dedicated infrastructure, advanced security, and tailored integrations.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Dedicated infrastructure</li>
                  <li>• Advanced security compliance</li>
                  <li>• Custom integrations</li>
                  <li>• 24/7 dedicated support</li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold gradient-text mb-4">Custom</div>
                <button className="btn-primary">Contact Sales</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
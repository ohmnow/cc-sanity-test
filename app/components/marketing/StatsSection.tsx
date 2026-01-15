import {useEffect, useRef, useState} from 'react'

const stats = [
  {
    value: 50,
    prefix: '$',
    suffix: 'M+',
    label: 'Transaction Volume',
  },
  {
    value: 150,
    prefix: '',
    suffix: '+',
    label: 'Projects Completed',
  },
  {
    value: 98,
    prefix: '',
    suffix: '%',
    label: 'Client Satisfaction',
  },
  {
    value: 15,
    prefix: '',
    suffix: '+',
    label: 'Years Experience',
  },
]

function AnimatedNumber({
  value,
  prefix,
  suffix,
  isVisible,
}: {
  value: number
  prefix: string
  suffix: string
  isVisible: boolean
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, isVisible])

  return (
    <span className="stat-number">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {threshold: 0.3}
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#c9a961] text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Our Track Record
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white">
            Numbers That Speak
            <br />
            <span className="text-[#c9a961]">For Themselves</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease ${index * 0.1}s`,
              }}
            >
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-2">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

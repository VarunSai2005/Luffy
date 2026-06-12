import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'
import Navbar from './Navbar'

const Hero = () => {
  const heroRef   = useRef(null)
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const smoothRef = useRef({ x: -9999, y: -9999 })
  const trailRef  = useRef([])

  useEffect(() => {
    const hero   = heroRef.current
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const TRAIL_LENGTH = 60
    const HEAD_RADIUS  = 180

    const bottom = new Image()
    const top    = new Image()
    bottom.src = '/images/one.png'
    top.src    = '/images/two.png'

    const resize = () => {
      canvas.width  = hero.offsetWidth
      canvas.height = hero.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    hero.addEventListener('mousemove', onMove)

    let rafId

    const draw = () => {
      const { width, height } = canvas

      const s = smoothRef.current
      const m = mouseRef.current
      s.x += (m.x - s.x) * 0.13
      s.y += (m.y - s.y) * 0.13

      trailRef.current.unshift({ x: s.x, y: s.y })
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.length = TRAIL_LENGTH
      }

      const trail = trailRef.current
      ctx.clearRect(0, 0, width, height)

      ctx.drawImage(bottom, 0, 0, width, height)

      const offscreen = document.createElement('canvas')
      offscreen.width  = width
      offscreen.height = height
      const off = offscreen.getContext('2d')

      for (let i = 0; i < trail.length; i++) {
        const t     = 1 - i / trail.length
        const r     = HEAD_RADIUS * (0.25 + 0.75 * t)
        const alpha = Math.pow(t, 1.5)
        off.beginPath()
        off.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2)
        off.fillStyle = `rgba(0,0,0,${alpha})`
        off.fill()
      }

      off.globalCompositeOperation = 'source-in'
      const shift = 27
      off.drawImage(top, shift, 20, width, height)

      ctx.drawImage(offscreen, 0, 0)

      // cursor head glow — electric blue web-shooter tint
      if (trail.length > 0) {
        const head = trail[0]
        const glow = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, HEAD_RADIUS * 1.4
        )
        glow.addColorStop(0,   'rgba(30, 144, 255, 0.28)')
        glow.addColorStop(0.5, 'rgba(30, 144, 255, 0.12)')
        glow.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(head.x, head.y, HEAD_RADIUS * 1.4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }

    let loaded = 0
    const onLoad = () => { if (++loaded === 2) draw() }
    bottom.onload = onLoad
    top.onload    = onLoad

    return () => {
      hero.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  }

  const item = {
    hidden:  { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 12 } },
  }

  const navbarVariant = {
    hidden:  { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } },
  }

  return (
    <div className="hero" ref={heroRef}>

      <canvas ref={canvasRef} className="hero-canvas" />

      <motion.div variants={navbarVariant} initial="hidden" animate="visible">
        <Navbar />
      </motion.div>

      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT */}
        <motion.div className="left" variants={item}>
          <motion.span className="st-eyebrow" variants={item}>
          </motion.span>
          <h1 className="st-title">
            Sun God<br />Nika
          </h1>
          <motion.p className="st-desc" variants={item}>
            From dreaming beneath the rising sun to awakening as the Sun God Nika.<br />
            From a reckless boy who couldn't save his brother to a warrior who brings freedom wherever he goes.<br />
            From losing everything at Marineford to shaking the very foundations of the world as an Emperor of the Sea.<br />
            And his story is still far from over.
          </motion.p>
          <motion.button className="st-btn" variants={item}>
            Let's go to the Raftel !
          </motion.button>
        </motion.div>

        {/* RIGHT */}
        <motion.div className="right" variants={item}>
          <motion.span className="st-eyebrow right-eyebrow" variants={item}>
            A BOY CARRYING THE WILL OF A GOD.
          </motion.span>
          <h1 className="st-title">
            Monkey D. Luffy<br />
          </h1>
          <motion.p className="st-text" variants={item}>
            If you think Luffy is stupidity incarnate,
             remember that he once liberated an entire country overnight
              simply because a little girl gave him a bowl of rice 
              when she barely had enough for herself.
          </motion.p>
        </motion.div>
      </motion.div>

    </div>
  )
}

export default Hero
import { useEffect, useRef, useState } from 'react'
import './DepthCarousel.css'

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function wrapOffset(index, active, total, loop) {
  let d = index - active
  if (!loop || total < 2) return d
  while (d > total / 2) d -= total
  while (d < -total / 2) d += total
  return d
}

export default function DepthCarousel({
  items,
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = false,
  loop = false,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  duration = 700,
  autoplayDelay = 3200,
  showControls = false,
  showIndicators = false
}) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(1)
  const fromRef = useRef(0)
  const toRef = useRef(0)
  const rootRef = useRef(null)
  const dragRef = useRef(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = (dir) => {
    const total = items.length
    if (!total) return
    setIndex(current => {
      const nextRaw = current + dir
      const next = loop ? (nextRaw + total) % total : Math.max(0, Math.min(total - 1, nextRaw))
      if (next === current && !loop) return current
      fromRef.current = current
      toRef.current = loop ? current + dir : next
      return next
    })
    setProgress(reduced ? 1 : 0)
  }

  useEffect(() => {
    if (reduced) return undefined
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [index, duration, reduced])

  useEffect(() => {
    if (!autoplay || reduced || items.length < 2) return undefined
    const id = setInterval(() => go(1), autoplayDelay)
    return () => clearInterval(id)
  }, [autoplay, autoplayDelay, items.length, reduced, index])

  const onPointerDown = (event) => {
    if (event.target.closest('.depth-carousel__arrow, .depth-carousel__dot')) return
    dragRef.current = { x: event.clientX, id: event.pointerId }
  }
  const onPointerUp = (event) => {
    if (!dragRef.current) return
    const dx = event.clientX - dragRef.current.x
    dragRef.current = null
    if (dx > 48) go(tiltDirection === 'left' ? 1 : -1)
    else if (dx < -48) go(tiltDirection === 'left' ? -1 : 1)
  }

  const sign = tiltDirection === 'left' ? -1 : 1
  const visualActive = fromRef.current + (toRef.current - fromRef.current) * (progress || 1)

  return (
    <div
      className="depth-carousel"
      style={{ '--dc-perspective': `${perspective}px` }}
      tabIndex={0}
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
      aria-roledescription="carousel"
      aria-label="Featured sweets and mixtures"
    >
      <div className="depth-carousel__stage">
        {items.map((item, i) => {
          const offset = wrapOffset(i, visualActive, items.length, loop)
          if (Math.abs(offset) >= visibleCards) return null
          const x = offset * spread * sign
          const z = -Math.abs(offset) * depth
          const rot = -offset * tilt * 0.45 * sign
          const scale = Math.max(0.55, 1 - Math.abs(offset) * falloff)
          const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.22)
          const filter = `blur(${Math.abs(offset) * blur}px)`
          return (
            <button
              key={item.alt || i}
              type="button"
              className="depth-carousel__card"
              style={{
                width: cardWidth,
                height: cardHeight,
                borderRadius: radius,
                opacity,
                filter,
                zIndex: 2000 - Math.round(Math.abs(offset) * 10),
                transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${scale})`
              }}
              onClick={() => {
                const delta = Math.round(offset)
                if (delta !== 0) go(delta > 0 ? 1 : -1)
              }}
            >
              <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable="false" />
              <span className="depth-carousel__tint" style={{ background: tint, opacity: Math.min(0.7, Math.abs(offset) * 0.24) }} />
            </button>
          )
        })}
      </div>

      {showControls && (
        <>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="Previous" onClick={() => go(-1)}>‹</button>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="Next" onClick={() => go(1)}>›</button>
        </>
      )}

      {showIndicators && (
        <div className="depth-carousel__dots">
          {items.map((item, i) => (
            <button
              key={item.alt || i}
              type="button"
              className={`depth-carousel__dot${i === index ? ' is-active' : ''}`}
              aria-label={`Show ${item.alt || i + 1}`}
              onClick={() => {
                fromRef.current = index
                toRef.current = i
                setIndex(i)
                setProgress(reduced ? 1 : 0)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'

const CONFETTI_COLORS = ['#f59e0b', '#14b8a6', '#ec4899', '#8b5cf6', '#22c55e', '#3b82f6']

function ConfettiPiece({ delay }) {
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
  const left = Math.random() * 100
  const size = 6 + Math.random() * 8
  const duration = 1.5 + Math.random() * 1.5

  return (
    <div
      className="absolute top-0 rounded-sm"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        backgroundColor: color,
        animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
        opacity: 0,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  )
}

export default function ConfettiOverlay({ show, onDone }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (show) {
      setPieces(Array.from({ length: 40 }, (_, i) => i))
      const timer = setTimeout(() => {
        setPieces([])
        onDone?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show || pieces.length === 0) return null

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(-20px) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {pieces.map(i => (
          <ConfettiPiece key={i} delay={Math.random() * 0.5} />
        ))}
      </div>
    </>
  )
}

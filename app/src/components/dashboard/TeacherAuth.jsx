import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { verifyPin, ensureDefaultPin } from '../../utils/pinSecurity'

export default function TeacherAuth({ onAuthenticated }) {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinLocked, setPinLocked] = useState(false)
  const [lockCountdown, setLockCountdown] = useState(0)
  const [pinLoading, setPinLoading] = useState(false)

  // Initialize default PIN hash on mount
  useEffect(() => { ensureDefaultPin() }, [])

  // Lockout countdown timer
  useEffect(() => {
    if (lockCountdown <= 0) { setPinLocked(false); return }
    const t = setInterval(() => setLockCountdown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [lockCountdown])

  const handlePin = useCallback(async () => {
    if (pinLoading || pinLocked) return
    setPinLoading(true)
    setPinError('')
    try {
      const result = await verifyPin(pin)
      if (result.success) {
        onAuthenticated(true)
      } else if (result.locked) {
        setPinLocked(true)
        setLockCountdown(result.remainingSeconds)
        setPinError(`⏳ تجاوزت الحد الأقصى — انتظر ${result.remainingSeconds} ثانية`)
      } else {
        setPinError(`❌ رمز خاطئ — ${result.attemptsLeft} محاولات متبقية`)
      }
    } catch (e) {
      setPinError('خطأ في التحقق')
    }
    setPinLoading(false)
  }, [pin, pinLoading, pinLocked, onAuthenticated])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] card-shadow p-10 border border-slate-100 dark:border-slate-700 text-center">
        <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock className="h-10 w-10 text-brand-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">فضاء المعلمة</h2>
        <p className="text-slate-500 font-medium mb-8 uppercase text-xs tracking-widest">فضاء محمي بتشفير SHA-256</p>
        
        <div className="space-y-4 text-left" dir="ltr">
          <label className="text-xs font-bold text-slate-400 ml-1">الرمز السري</label>
          <input
            type="password" value={pin} onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePin()}
            placeholder="••••" autoFocus
            disabled={pinLocked}
            className={`w-full p-5 rounded-2xl border-2 focus:border-brand-400 focus:ring-4 focus:ring-brand-50 outline-none font-black text-center text-4xl tracking-[0.5em] bg-slate-50 dark:bg-slate-900 transition-all ${pinLocked ? 'border-rose-300 opacity-60' : 'border-slate-50'}`}
          />
          {pinError && (
            <p className={`text-center text-sm font-bold ${pinLocked ? 'text-rose-500' : 'text-amber-500'}`}>{pinError}</p>
          )}
          {pinLocked && lockCountdown > 0 && (
            <div className="text-center">
              <span className="inline-block bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-black text-lg">
                ⏳ {lockCountdown}s
              </span>
            </div>
          )}
          <button onClick={handlePin} disabled={pinLocked || pinLoading || !pin.trim()} className="w-full p-5 rounded-2xl bg-brand-600 text-white font-black text-lg hover:bg-brand-700 shadow-lg shadow-brand-100 transition-all active:scale-95 disabled:opacity-50">
            {pinLoading ? '...' : 'فتح القفل'}
          </button>
          <p className="text-center text-xs text-slate-300 mt-4 italic">رمز الدخول مطلوب لحماية بيانات التلاميذ.</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 font-bold text-sm mt-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> العودة للقائمة
        </Link>
      </motion.div>
    </div>
  )
}

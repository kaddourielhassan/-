import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProfileStore, CHILD_AVATARS } from '../store/useProfileStore'
import { useGameStore } from '../store/useGameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Lock, Download, Trash2, Star, BarChart3, 
  Volume2, Play, Users, CheckCircle2, AlertCircle, 
  Settings, ChevronRight, Search, FileText, Menu, X, Loader2, Trophy, Activity
} from 'lucide-react'
import { alphabet } from '../data/alphabet'
import { phonemes } from '../data/phonemes'
import { conversations } from '../data/conversations'
import { categories } from '../data/vocabulaire'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { AuditingMetrics } from '../utils/auditingMetrics'

const DEFAULT_PIN = '2026'
const PIN_STORAGE_KEY = 'hurufi-teacher-pin'

// --- PDF GENERATION HELPERS ---

const generateDiploma = (student, stats) => {
  const doc = new jsPDF({ orientation: 'landscape' })
  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  // --- DESIGN PREMIUM ---
  
  // Fond Dégradé léger (Simulation)
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, width, height, 'F')
  
  // Cadre double
  doc.setDrawColor(20, 184, 166) // Teal-500
  doc.setLineWidth(3)
  doc.rect(5, 5, width - 10, height - 10)
  
  doc.setDrawColor(245, 158, 11) // Amber-500
  doc.setLineWidth(1)
  doc.rect(8, 8, width - 16, height - 16)

  // Filigrane / Rosace
  doc.setDrawColor(241, 245, 249)
  doc.setLineWidth(0.5)
  for (let i = 0; i < 360; i += 15) {
    doc.line(width/2, height/2, width/2 + Math.cos(i) * 50, height/2 + Math.sin(i) * 50)
  }

  // Header
  doc.setTextColor(13, 148, 136)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('PROGRAMME D\'EXCELLENCE HURÛFÎ', width / 2, 20, { align: 'center' })
  
  doc.setFontSize(48)
  doc.text('DIPLÔME DE RÉUSSITE', width / 2, 55, { align: 'center' })
  
  // Badge doré
  doc.setFillColor(245, 158, 11)
  doc.circle(width - 40, height - 40, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text('CERTIFIÉ', width - 40, height - 42, { align: 'center' })
  doc.text('2026', width - 40, height - 35, { align: 'center' })

  // Corps
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(22)
  doc.text('Ce titre honorifique est décerné à', width / 2, 85, { align: 'center' })
  
  doc.setFontSize(54)
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.text(student.prenom.toUpperCase(), width / 2, 115, { align: 'center' })
  
  doc.setDrawColor(226, 232, 240)
  doc.line(width / 2 - 60, 120, width / 2 + 60, 120)

  doc.setFontSize(18)
  doc.setTextColor(71, 85, 105)
  doc.setFont('helvetica', 'normal')
  doc.text(`Pour son assiduité et ses progrès exceptionnels au Niveau ${student.niveau}`, width / 2, 140, { align: 'center' })

  // Footer / Scores
  doc.setFontSize(12)
  doc.setTextColor(148, 163, 184)
  doc.text(`Score Global : ${student.pointsTotal} points étoiles ⭐`, width / 2, 165, { align: 'center' })

  const date = new Date().toLocaleDateString('fr-FR')
  doc.setFontSize(11)
  doc.text(`Délivré le ${date}`, 30, height - 30)
  
  doc.setFontSize(14)
  doc.setTextColor(13, 148, 136)
  doc.text('LA MAÎTRESSE', width - 70, height - 70)
  doc.setDrawColor(13, 148, 136)
  doc.line(width - 90, height - 65, width - 50, height - 65)
  
  doc.save(`Diplome_Hurufi_${student.prenom}.pdf`)
}

const generateClassReport = (profiles, getStats) => {
  const doc = new jsPDF()
  
  // Header Style
  doc.setFillColor(13, 148, 136)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('RAPPORT DE CLASSE HURÛFÎ', 105, 25, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('fr-FR')
  doc.text(`Généré le ${date} | Total Élèves : ${profiles.length}`, 105, 33, { align: 'center' })

  const tableData = profiles.map(p => {
    const s = getStats(p.id)
    return [
      p.prenom.toUpperCase(),
      `Niveau ${p.niveau}`,
      `${p.pointsTotal} pts`,
      s.totalSessions,
      `${Math.round(((s.ecoute?.correct || 0) / 20) * 100)}%`,
      `${Math.round(((s.phonemes?.correct || 0) / 6) * 100)}%`,
      s.streak > 0 ? `🔥 ${s.streak}` : '-'
    ]
  })

  doc.autoTable({
    startY: 50,
    head: [['Nom de l\'Élève', 'Niveau', 'Étoiles', 'Sessions', 'Reconnaissance', 'Phonèmes', 'Série']],
    body: tableData,
    headStyles: { 
      fillColor: [20, 184, 166], 
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 50 },
    styles: { fontSize: 9, cellPadding: 5 }
  })

  doc.save(`Rapport_Classe_Hurufi_${date.replace(/\//g, '-')}.pdf`)
}

const VALIDATION_THRESHOLD = 0.6 // 60%

const MODULE_CONFIG = [
  { key: 'ecoute',   name: 'Ecoute & Reconnaissance', max: 20, valueKey: 'correct',   emoji: 'Ecoute' },
  { key: 'memory',   name: 'Jeu de Memoire',          max: 10, valueKey: 'completed', emoji: 'Memoire' },
  { key: 'phonemes', name: 'Distinction Phonemes',     max: 6,  valueKey: 'correct',   emoji: 'Phonemes' },
  { key: 'tracage',  name: 'Tracage des Lettres',      max: 12, valueKey: 'completed', emoji: 'Trace' },
  { key: 'flashcards', name: 'Flashcards Vocabulaire', max: 50, valueKey: 'vus',       emoji: 'Flash' },
]

const generateStudentReport = (student, stats, profileSummary) => {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  // ===== HEADER =====
  doc.setFillColor(13, 148, 136) // Teal-600
  doc.rect(0, 0, w, 48, 'F')
  
  // Decorative line
  doc.setFillColor(245, 158, 11) // Amber
  doc.rect(0, 48, w, 2, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('RAPPORT DE PROGRESSION', w / 2, 20, { align: 'center' })
  
  doc.setFontSize(36)
  doc.text(student.prenom.toUpperCase(), w / 2, 38, { align: 'center' })

  // Sub-header bar
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 50, w, 16, 'F')
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Date : ${date}`, 15, 60)
  doc.text(`Niveau : ${student.niveau}`, 80, 60)
  doc.text(`Programme : HURUFI 2026`, w - 15, 60, { align: 'right' })

  // ===== SECTION 1 : RESUME GLOBAL =====
  let y = 76
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('1. RESUME GLOBAL', 15, y)
  
  y += 4
  doc.setDrawColor(20, 184, 166)
  doc.setLineWidth(1)
  doc.line(15, y, 60, y)

  // Compute global metrics
  const moduleResults = MODULE_CONFIG.map(mod => {
    const value = stats[mod.key]?.[mod.valueKey] || 0
    const pct = Math.min(100, Math.round((value / mod.max) * 100))
    const validated = pct >= VALIDATION_THRESHOLD * 100
    return { ...mod, value, pct, validated }
  })
  
  const modulesAttempted = moduleResults.filter(m => m.value > 0)
  const modulesValidated = moduleResults.filter(m => m.validated && m.value > 0)
  const globalSuccessRate = modulesAttempted.length > 0
    ? Math.round(modulesAttempted.reduce((s, m) => s + m.pct, 0) / modulesAttempted.length)
    : 0

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)

  // KPI boxes
  const kpis = [
    { label: 'Points Etoiles', value: `${student.pointsTotal}`, color: [245, 158, 11] },
    { label: 'Sessions', value: `${stats.totalSessions}`, color: [59, 130, 246] },
    { label: 'Serie Active', value: `${stats.streak} jours`, color: [239, 68, 68] },
    { label: 'Taux Global', value: `${globalSuccessRate}%`, color: globalSuccessRate >= 60 ? [16, 185, 129] : [239, 68, 68] },
  ]

  const boxW = (w - 40) / 4
  kpis.forEach((kpi, i) => {
    const bx = 15 + i * (boxW + 4)
    // Box bg
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(bx, y, boxW, 22, 3, 3, 'F')
    // Label
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.setFont('helvetica', 'bold')
    doc.text(kpi.label.toUpperCase(), bx + boxW / 2, y + 7, { align: 'center' })
    // Value
    doc.setFontSize(14)
    doc.setTextColor(...kpi.color)
    doc.text(kpi.value, bx + boxW / 2, y + 18, { align: 'center' })
  })

  // ===== SECTION 2 : DETAIL PAR MODULE =====
  y += 36
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('2. DETAIL PAR MODULE', 15, y)
  
  y += 4
  doc.setDrawColor(20, 184, 166)
  doc.line(15, y, 60, y)
  y += 4

  // Validation legend
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('Seuil de validation : 60% de reussite minimum | Au moins 1 exercice tente', 15, y + 4)

  const tableBody = moduleResults.map(m => {
    const status = m.value === 0 ? 'Non tente' : m.validated ? 'VALIDE' : 'En cours'
    return [
      m.name,
      `${m.value} / ${m.max}`,
      `${m.pct}%`,
      status
    ]
  })

  doc.autoTable({
    startY: y + 8,
    head: [['Module', 'Exercices', 'Taux (%)', 'Statut']],
    body: tableBody,
    headStyles: { 
      fillColor: [15, 23, 42], 
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      cellPadding: 4
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw
        if (val === 'VALIDE') {
          data.cell.styles.textColor = [16, 185, 129]
        } else if (val === 'En cours') {
          data.cell.styles.textColor = [245, 158, 11]
        } else {
          data.cell.styles.textColor = [148, 163, 184]
        }
      }
      // Color the percentage
      if (data.section === 'body' && data.column.index === 2) {
        const pct = parseInt(data.cell.raw)
        if (pct >= 60) data.cell.styles.textColor = [16, 185, 129]
        else if (pct > 0) data.cell.styles.textColor = [245, 158, 11]
      }
    },
    margin: { left: 15, right: 15 },
  })

  // ===== SECTION 3 : METRIQUES COMPORTEMENTALES =====
  y = doc.lastAutoTable.finalY + 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('3. METRIQUES COMPORTEMENTALES', 15, y)
  
  y += 4
  doc.setDrawColor(20, 184, 166)
  doc.line(15, y, 75, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)

  if (profileSummary) {
    const lines = [
      `Temps de reponse moyen : ${profileSummary.avgResponseTime ? (profileSummary.avgResponseTime / 1000).toFixed(1) + 's' : 'Non disponible'}`,
      `Module favori : ${profileSummary.favoriteModule || 'Aucun'}`,
      `Total evenements traces : ${profileSummary.totalEvents}`,
      `Reponses correctes : ${profileSummary.correctEvents} | Erreurs : ${profileSummary.errorEvents}`,
      `Premiere activite : ${profileSummary.firstActivity ? new Date(profileSummary.firstActivity).toLocaleDateString('fr-FR') : '-'}`,
      `Derniere activite : ${profileSummary.lastActivity ? new Date(profileSummary.lastActivity).toLocaleDateString('fr-FR') : '-'}`,
    ]
    if (profileSummary.confidenceDist) {
      const cd = profileSummary.confidenceDist
      const total = cd.high + cd.medium + cd.low
      if (total > 0) {
        lines.push(`Confiance : Haute ${cd.high} | Moyenne ${cd.medium} | Basse ${cd.low}`)
      }
    }
    lines.forEach((line, i) => {
      doc.text(`• ${line}`, 20, y + i * 6)
    })
    y += lines.length * 6 + 6
  } else {
    doc.text('Aucune donnee comportementale disponible pour cet eleve.', 20, y)
    y += 10
  }

  // ===== SECTION 4 : RECOMMANDATIONS =====
  y += 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('4. RECOMMANDATIONS', 15, y)
  
  y += 4
  doc.setDrawColor(20, 184, 166)
  doc.line(15, y, 60, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)

  const weakModules = moduleResults.filter(m => m.value > 0 && !m.validated)
  const notAttempted = moduleResults.filter(m => m.value === 0)

  if (weakModules.length === 0 && notAttempted.length === 0) {
    doc.setTextColor(16, 185, 129)
    doc.text('Excellent ! Tous les modules tentes sont valides. Continuer ainsi !', 20, y)
    y += 8
  } else {
    if (weakModules.length > 0) {
      doc.setTextColor(245, 158, 11)
      doc.text('Modules a renforcer (taux < 60%) :', 20, y)
      y += 6
      doc.setTextColor(71, 85, 105)
      weakModules.forEach(m => {
        doc.text(`  - ${m.name} : ${m.pct}% (objectif : 60%)`, 25, y)
        y += 5
      })
      y += 3
    }
    if (notAttempted.length > 0) {
      doc.setTextColor(148, 163, 184)
      doc.text('Modules non encore explores :', 20, y)
      y += 6
      notAttempted.forEach(m => {
        doc.text(`  - ${m.name}`, 25, y)
        y += 5
      })
    }
  }

  // ===== VALIDATION STAMP =====
  const validated = modulesValidated.length
  const total = modulesAttempted.length

  y += 10
  if (total > 0 && validated === total) {
    doc.setFillColor(16, 185, 129)
    doc.roundedRect(w / 2 - 45, y, 90, 18, 4, 4, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('TOUS LES MODULES VALIDES', w / 2, y + 12, { align: 'center' })
  } else if (total > 0) {
    doc.setFillColor(245, 158, 11)
    doc.roundedRect(w / 2 - 45, y, 90, 18, 4, 4, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${validated}/${total} MODULES VALIDES`, w / 2, y + 12, { align: 'center' })
  }

  // ===== FOOTER =====
  const pageH = doc.internal.pageSize.getHeight()
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.5)
  doc.line(15, pageH - 22, w - 15, pageH - 22)
  
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text(`Rapport genere automatiquement par HURUFI Pro | ${date}`, 15, pageH - 15)
  doc.text('Document confidentiel - Usage pedagogique exclusif', w - 15, pageH - 15, { align: 'right' })

  doc.save(`Rapport_${student.prenom}_${new Date().toISOString().slice(0, 10)}.pdf`)
}



function ResourceStatus({ url, type }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!url) { setStatus('missing'); return }
    const check = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        setStatus(res.ok ? 'ok' : 'missing')
      } catch {
        setStatus('missing')
      }
    }
    check()
  }, [url])

  if (status === 'loading') return <div className="h-2 w-12 bg-slate-100 animate-pulse rounded-full" />

  if (type === 'image') {
    return (
      <div className="flex items-center justify-center">
        {status === 'ok' ? (
          <div className="relative group">
            <img 
              src={url} alt="" 
              className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white shadow-sm transition-all group-hover:scale-[2.5] group-hover:z-50 group-hover:shadow-2xl" 
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
      status === 'ok' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
    }`}>
      {status === 'ok' ? (
        <><CheckCircle2 className="h-3 w-3" /> OK</>
      ) : (
        <><X className="h-3 w-3" /> Absent</>
      )}
    </div>
  )
}

function ProgressCard({ label, value, max = 20, colorClass, bgClass, toolTip }) {
  const percentage = Math.round((value / max) * 100)
  return (
    <div className={`${bgClass} rounded-2xl p-3 border border-white/50 shadow-sm relative group`} title={toolTip}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`text-xs font-black ${colorClass}`}>{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass.replace('text-', 'bg-')} rounded-full transition-all duration-1000`} 
             style={{ width: `${Math.min(100, percentage)}%` }} />
      </div>
      {/* Mini Tooltip simple */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {value} réussis sur {max}
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---

export default function DashboardMaitresse() {
  const profiles = useProfileStore(s => s.profiles)
  const deleteAllProfiles = useProfileStore(s => s.deleteAllProfiles)
  const getStats = useGameStore(s => s.getStats)
  const resetProfile = useGameStore(s => s.resetProfile)
  const getResultsForExport = useGameStore(s => s.getResultsForExport)

  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('students') 
  const [playingId, setPlayingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)

  const savedPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN

  const handlePin = () => { if (pin === savedPin) setAuthenticated(true) }

  const playPreview = (url, id) => {
    if (audioLoading) return
    setAudioLoading(true)
    setPlayingId(id)
    const audio = new Audio(url)
    audio.oncanplaythrough = () => {
      setAudioLoading(false)
      audio.play().catch(e => console.error('Audio error:', e))
    }
    audio.onerror = () => {
      setAudioLoading(false)
      setPlayingId(null)
    }
    audio.onended = () => {
      setPlayingId(null)
      setAudioLoading(false)
    }
  }

  // Recherche optimisée (Debounce simulé par useMemo)
  const filteredProfiles = useMemo(() => {
    if (!debouncedSearch) return profiles
    return profiles.filter(p => 
      p.prenom.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [profiles, debouncedSearch])

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-md bg-white rounded-[2.5rem] card-shadow p-10 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="h-10 w-10 text-brand-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">فضاء المعلمة</h2>
          <p className="text-slate-500 font-medium mb-8 uppercase text-xs tracking-widest">فضاء محمي</p>
          
          <div className="space-y-4 text-left" dir="ltr">
            <label className="text-xs font-bold text-slate-400 ml-1">الرمز السري</label>
            <input
              type="password" value={pin} onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePin()}
              placeholder="••••" autoFocus
              className="w-full p-5 rounded-2xl border-2 border-slate-50 focus:border-brand-400 focus:ring-4 focus:ring-brand-50 outline-none font-black text-center text-4xl tracking-[0.5em] bg-slate-50 transition-all"
            />
            <button onClick={handlePin} className="w-full p-5 rounded-2xl bg-brand-600 text-white font-black text-lg hover:bg-brand-700 shadow-lg shadow-brand-100 transition-all active:scale-95">
              فتح القفل
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

  const menuItems = [
    { id: 'students', label: 'متابعة التلاميذ', icon: Users, color: 'text-blue-500' },
    { id: 'analytics', label: 'التحليلات', icon: Activity, color: 'text-amber-500' },
    { id: 'audio', label: 'تدقيق الأصوات', icon: Volume2, color: 'text-purple-500' },
    { id: 'assets', label: 'حالة الوسائط', icon: FileText, color: 'text-emerald-500' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'text-slate-500' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[90vh] gap-6">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <h1 className="font-black text-slate-800 text-lg">Hurûfî Pro</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 rounded-xl">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-0 z-50 md:relative md:block md:w-64 flex-shrink-0 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="bg-white h-full md:h-auto rounded-[2rem] card-shadow p-4 sticky top-6 border border-slate-100">
          <div className="px-4 py-6 mb-4 hidden md:block">
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs">H</div>
              Hurûfî Pro
            </h1>
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-brand-600 font-bold text-sm transition-colors">
              <ArrowLeft className="h-4 w-4" /> خروج
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8">
        {/* Hero Metrics Top */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Tableau de bord Pro</h2>
            <p className="text-slate-400 font-medium">Contrôle pédagogique avancé et certification</p>
          </div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-blue-400 uppercase">Élèves</span>
              <span className="text-xl font-black text-blue-700">{profiles.length}</span>
            </div>
            <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-emerald-400 uppercase">Médias OK</span>
              <span className="text-xl font-black text-emerald-700">{alphabet.length + categories.reduce((acc, c) => acc + c.mots.length, 0)}</span>
            </div>
            <div className="bg-purple-50 px-5 py-3 rounded-2xl border border-purple-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-purple-400 uppercase">Stats</span>
              <span className="text-xl font-black text-purple-700">Live</span>
            </div>
            <div className="bg-pink-50 px-5 py-3 rounded-2xl border border-pink-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-pink-400 uppercase">Actif</span>
              <span className="text-xl font-black text-pink-700">Oui</span>
            </div>
          </div>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-700 uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => generateClassReport(profiles, getStats)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Download className="h-4 w-4" /> تصدير التقرير PDF
            </button>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" placeholder="ابحث عن اسم..." 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3.5 rounded-2xl bg-white border border-slate-100 card-shadow outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 w-full sm:w-64 font-bold text-sm transition-all"
                aria-label="البحث عن تلميذ"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="pb-10"
          >
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredProfiles.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold">لم يُعثر على تلميذ.</p>
                      <button onClick={() => setSearchTerm('')} className="text-brand-600 font-black text-xs mt-2 uppercase tracking-tighter hover:underline">عرض الكل</button>
                    </div>
                  ) : (
                    filteredProfiles.map((p) => {
                      const stats = getStats(p.id)
                      return (
                        <div key={p.id} className="bg-white rounded-[2.5rem] card-shadow p-7 border border-slate-50 group hover:border-brand-200 transition-all hover:shadow-xl">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner ${p.avatarColor || 'bg-slate-100'}`}>
                                {p.avatar && (p.avatar.includes('http') || p.avatar.includes('assets')) ? (
                                   <img src={p.avatar} alt="" className="w-16 h-16 object-contain" />
                                ) : (
                                  CHILD_AVATARS.find(a => a.img === p.avatar)?.emoji || '👤'
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{p.prenom}</h3>
                                  <button 
                                    onClick={() => generateStudentReport(p, stats, AuditingMetrics.getProfileSummary(p.id))}
                                    title="Exporter le rapport de progression"
                                    className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase">تقرير</span>
                                  </button>
                                  <button 
                                    onClick={() => generateDiploma(p, stats)}
                                    title="Générer un diplôme"
                                    className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                                  >
                                    <Trophy className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase">شهادة</span>
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 rounded-lg bg-gold-500 text-white font-black text-[9px] uppercase shadow-sm">المستوى {p.niveau}</span>
                                  <span className="text-slate-400 font-bold text-xs">⭐ {p.pointsTotal} نقطة</span>
                                </div>
                              </div>
                            </div>
                            <button onClick={() => { if(confirm(`هل تريد إعادة تعيين ${p.prenom} ؟`)) resetProfile(p.id) }} 
                              aria-label={`إعادة تعيين ${p.prenom}`}
                              className="p-3 rounded-xl text-slate-300 hover:text-coral-500 hover:bg-coral-50 transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            <ProgressCard label="استماع" value={stats.ecoute?.correct || 0} colorClass="text-blue-600" bgClass="bg-blue-50" toolTip="التعرف على الحروف" />
                            <ProgressCard label="ذاكرة" value={stats.memory?.completed || 0} max={10} colorClass="text-purple-600" bgClass="bg-purple-50" toolTip="لعبة الذاكرة" />
                            <ProgressCard label="أصوات" value={stats.phonemes?.correct || 0} max={6} colorClass="text-emerald-600" bgClass="bg-emerald-50" toolTip="تمييز الأصوات" />
                            <ProgressCard label="تتبع" value={stats.tracage?.completed || 0} max={12} colorClass="text-orange-600" bgClass="bg-orange-50" toolTip="كتابة الحروف" />
                            <ProgressCard label="كلمات" value={stats.flashcards?.vus || 0} max={50} colorClass="text-pink-600" bgClass="bg-pink-50" toolTip="المفردات" />
                            <div className="bg-brand-50 rounded-2xl p-3 flex flex-col justify-center items-center text-center border border-brand-100">
                              <span className="text-[10px] font-black text-brand-400 uppercase">سلسلة</span>
                              <span className="text-xl font-black text-brand-700">🔥 {stats.streak}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] font-black text-slate-400 border-t border-slate-50 pt-5">
                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> نشط</span>
                            <span className="uppercase tracking-widest">الجلسات: {stats.totalSessions}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-8">
                <section className="bg-white rounded-[2.5rem] card-shadow p-8 border border-slate-50">
                  <header className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-xl font-black text-slate-800">تدقيق صوتي: الحروف</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">فحص وضوح النطق</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter">28 ملف</span>
                  </header>
                  <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-3">
                    {alphabet.map(l => {
                      const isActive = playingId === `lettre-${l.id}`
                      return (
                        <button 
                          key={l.id} onClick={() => playPreview(l.audio, `lettre-${l.id}`)}
                          aria-label={`Écouter la lettre ${l.lettre}`}
                          className={`group relative h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                            isActive ? 'bg-brand-600 border-brand-600 text-white shadow-xl scale-110 z-10' : 'bg-white border-slate-50 hover:border-brand-200 text-slate-700 hover:shadow-lg'
                          }`}
                        >
                          <span className="font-arabic text-2xl">{l.lettre}</span>
                          <div className={`absolute bottom-2 right-2 transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-50 group-hover:scale-100'}`}>
                            {audioLoading && isActive ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-2 w-2" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section className="bg-white rounded-[2.5rem] card-shadow p-8 border border-slate-50">
                  <header className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800">الأصوات والمفردات</h3>
                    <div className="flex gap-2">
                       <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">Contrastes</span>
                       <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase">Capital Image</span>
                    </div>
                  </header>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {phonemes.map(p => (
                       <button 
                        key={p.id} onClick={() => playPreview(p.audio, `phoneme-${p.id}`)}
                        aria-label={`Écouter le contraste ${p.lettre1.caractere} contre ${p.lettre2.caractere}`}
                        className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${
                          playingId === `phoneme-${p.id}` ? 'bg-brand-600 border-brand-600 text-white shadow-xl' : 'bg-slate-50 border-transparent hover:border-slate-200'
                        }`}
                       >
                         <span className="font-arabic text-xl" dir="rtl">{p.lettre1.caractere} / {p.lettre2.caractere}</span>
                         <div className="flex items-center gap-2">
                            {audioLoading && playingId === `phoneme-${p.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4 opacity-50" />}
                         </div>
                       </button>
                     ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="bg-white rounded-[2.5rem] card-shadow overflow-hidden border border-slate-100">
<div className="p-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex gap-4">
                      <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black">MÉDIA OK</div>
                      <div className="bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-black">MANQUANT</div>
                   </div>
                   <div className="text-right">
                      <h3 className="text-2xl font-black text-slate-800 mb-1">بيان حالة الوسائط</h3>
                      <p className="text-slate-400 text-sm font-bold">فحص سلامة ملفات الوسائط.</p>
                   </div>
                </div>
<div className="overflow-x-auto">
                   <table className="w-full text-right" dir="rtl">
                     <thead className="bg-white">
                       <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                         <th className="p-8">المادة (Item)</th>
                         <th className="p-8 text-center">الصوت (Audio)</th>
                         <th className="p-8 text-center">الصورة (Image)</th>
                         <th className="p-8 text-center">الإجراءات (Actions)</th>
                         <th className="p-8">المسار (Path)</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       <tr className="bg-brand-50/50"><td colSpan="5" className="p-4 font-black text-brand-700 text-xs uppercase tracking-widest px-8">قسم الحروف</td></tr>
                       {alphabet.slice(0, 28).map(l => (
                         <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="p-6 px-8">
                             <span className="font-arabic font-black text-2xl text-slate-800 ml-3">{l.lettre}</span> 
                             <span className="text-xs text-slate-400 font-bold">({l.translit})</span>
                           </td>
                           <td className="p-6 text-center"><ResourceStatus url={l.audio} type="audio" /></td>
                           <td className="p-6 text-center"><ResourceStatus url={`resources/images/lettres/lettre_${l.translit.toLowerCase()}.png`} type="image" /></td>
                           <td className="p-6 text-center">
                             <button 
                               onClick={() => playPreview(l.audio, `alpha-${l.id}`)}
                               className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all"
                               aria-label={`Tester ${l.lettre}`}
                             >
                               {playingId === `alpha-${l.id}` && audioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                             </button>
                           </td>
                           <td className="p-6 text-[10px] text-slate-300 font-mono group-hover:text-slate-500 transition-colors">{l.audio}</td>
                         </tr>
                       ))}

                       {categories.map(cat => (
                         <React.Fragment key={cat.id}>
                           <tr className="bg-slate-50/50">
                             <td colSpan="5" className="p-4 font-black text-brand-700 text-xs uppercase tracking-widest px-8">{cat.emoji} {cat.nomAr}</td>
                           </tr>
                           {cat.mots.map((m, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="p-6 px-8 flex items-center gap-3">
                                 {cat.id === 'nombres' && (
                                   <span className="bg-slate-100 px-2 py-1 rounded text-xs font-black text-slate-400 border border-slate-200">{m.fr}</span>
                                 )}
                                 <span className="font-arabic font-black text-xl text-slate-800">{m.ar}</span> 
                                 <span className="text-[10px] text-slate-400 font-bold">({m.fr})</span>
                               </td>
                               <td className="p-6 text-center"><ResourceStatus url={m.audio} type="audio" /></td>
                               <td className="p-6 text-center"><ResourceStatus url={m.image} type="image" /></td>
                               <td className="p-6 text-center">
                                 <button 
                                   onClick={() => playPreview(m.audio, `mot-${cat.id}-${idx}`)}
                                   className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all"
                                   aria-label={`Tester ${m.fr}`}
                                 >
                                   {playingId === `mot-${cat.id}-${idx}` && audioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                 </button>
                               </td>
                               <td className="p-6 text-[10px] text-slate-300 font-mono group-hover:text-brand-600 transition-colors">
                                 <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100 break-all inline-block max-w-[250px]">
                                   {m.image}
                                 </span>
                               </td>
                             </tr>
                           ))}
                         </React.Fragment>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}

            {activeTab === 'analytics' && (() => {
              const modulePerf = AuditingMetrics.getModulePerformance()
              const classSummary = AuditingMetrics.getClassSummary()
              const struggling = AuditingMetrics.getStrugglingProfiles()

              const MODULE_LABELS = {
                ecoute: { name: 'استماع', emoji: '🎧' },
                memory: { name: 'ذاكرة', emoji: '🧠' },
                phonemes: { name: 'أصوات', emoji: '👂' },
                tracage: { name: 'تتبع', emoji: '✏️' },
                flashcards: { name: 'كلمات', emoji: '📷' },
                conversation: { name: 'محادثة', emoji: '💬' },
              }

              const formatMs = (ms) => ms ? `${(ms / 1000).toFixed(1)}s` : '—'

              return (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 card-shadow text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجمالي الأحداث</p>
                      <p className="text-3xl font-black text-slate-800">{classSummary.totalEvents}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 card-shadow text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Profils Actifs</p>
                      <p className="text-3xl font-black text-blue-600">{classSummary.totalProfiles}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 card-shadow text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">متوسط الوقت</p>
                      <p className="text-3xl font-black text-amber-600">{formatMs(classSummary.avgResponseTime)}</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 card-shadow text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">تنبيهات</p>
                      <p className={`text-3xl font-black ${struggling.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {struggling.length > 0 ? `⚠️ ${struggling.length}` : '✅ 0'}
                      </p>
                    </div>
                  </div>

                  {/* Struggling Students Alert */}
                  {struggling.length > 0 && (
                    <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-200">
                      <h3 className="text-lg font-black text-rose-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> Élèves en difficulté
                      </h3>
                      <p className="text-sm text-rose-600 font-medium mb-4">هؤلاء التلاميذ لديهم نسبة نجاح أقل من 40% :</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {struggling.map(p => (
                          <div key={p.profileId} className="bg-white rounded-2xl p-4 border border-rose-100 flex items-center justify-between">
                            <div>
                              <p className="font-black text-slate-800">{p.profileName || p.profileId}</p>
                              <p className="text-xs text-slate-400">{p.correctEvents + p.errorEvents} interactions</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-rose-500">{p.successRate}%</p>
                              <p className="text-[10px] text-rose-400 font-bold uppercase">Réussite</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Module Performance Table */}
                  <div className="bg-white rounded-[2rem] card-shadow border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                      <h3 className="text-lg font-black text-slate-800">Performance par Module</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="text-left px-6 py-3 font-black text-slate-500 uppercase text-xs">Module</th>
                            <th className="text-center px-4 py-3 font-black text-slate-500 uppercase text-xs">تفاعلات</th>
                            <th className="text-center px-4 py-3 font-black text-emerald-500 uppercase text-xs">✅ صحيح</th>
                            <th className="text-center px-4 py-3 font-black text-rose-500 uppercase text-xs">❌ أخطاء</th>
                            <th className="text-center px-4 py-3 font-black text-blue-500 uppercase text-xs">النسبة</th>
                            <th className="text-center px-4 py-3 font-black text-amber-500 uppercase text-xs">⏱ م. الوقت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(modulePerf).map(([mod, data]) => (
                            <tr key={mod} className="border-t border-slate-50 hover:bg-slate-25">
                              <td className="px-6 py-4 font-bold text-slate-700">
                                <span className="mr-2">{MODULE_LABELS[mod]?.emoji}</span>
                                {MODULE_LABELS[mod]?.name || mod}
                              </td>
                              <td className="px-4 py-4 text-center font-medium text-slate-600">{data.totalInteractions}</td>
                              <td className="px-4 py-4 text-center font-bold text-emerald-600">{data.correct}</td>
                              <td className="px-4 py-4 text-center font-bold text-rose-500">{data.errors}</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                                  data.successRate >= 70 ? 'bg-emerald-50 text-emerald-600' :
                                  data.successRate >= 40 ? 'bg-amber-50 text-amber-600' :
                                  data.totalInteractions === 0 ? 'bg-slate-50 text-slate-400' :
                                  'bg-rose-50 text-rose-600'
                                }`}>
                                  {data.totalInteractions > 0 ? `${data.successRate}%` : '—'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center font-medium text-amber-600">{formatMs(data.avgResponseTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Per-Student Performance */}
                  {classSummary.profiles.length > 0 && (
                    <div className="bg-white rounded-[2rem] card-shadow border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-50">
                        <h3 className="text-lg font-black text-slate-800">Performance par Élève</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="text-left px-6 py-3 font-black text-slate-500 uppercase text-xs">Élève</th>
                              <th className="text-center px-4 py-3 font-black text-slate-500 uppercase text-xs">Events</th>
                              <th className="text-center px-4 py-3 font-black text-blue-500 uppercase text-xs">النسبة</th>
                              <th className="text-center px-4 py-3 font-black text-amber-500 uppercase text-xs">⏱ م. الوقت</th>
                              <th className="text-center px-4 py-3 font-black text-purple-500 uppercase text-xs">Module Favori</th>
                              <th className="text-center px-4 py-3 font-black text-slate-500 uppercase text-xs">Dernière Activité</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classSummary.profiles.map(p => (
                              <tr key={p.profileId} className="border-t border-slate-50 hover:bg-slate-25">
                                <td className="px-6 py-4 font-bold text-slate-700">{p.profileName || p.profileId}</td>
                                <td className="px-4 py-4 text-center font-medium text-slate-600">{p.totalEvents}</td>
                                <td className="px-4 py-4 text-center">
                                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                                    p.successRate >= 70 ? 'bg-emerald-50 text-emerald-600' :
                                    p.successRate >= 40 ? 'bg-amber-50 text-amber-600' :
                                    'bg-rose-50 text-rose-600'
                                  }`}>
                                    {p.successRate}%
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-center font-medium text-amber-600">{formatMs(p.avgResponseTime)}</td>
                                <td className="px-4 py-4 text-center">
                                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                                    {MODULE_LABELS[p.favoriteModule]?.emoji} {MODULE_LABELS[p.favoriteModule]?.name || p.favoriteModule || '—'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-center text-xs text-slate-400 font-medium">
                                  {p.lastActivity ? new Date(p.lastActivity).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Export */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        const data = AuditingMetrics.exportJSON()
                        const blob = new Blob([data], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `hurufi-analytics-${new Date().toISOString().slice(0, 10)}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all"
                    >
                      <Download className="h-4 w-4" /> تصدير JSON
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('مسح جميع البيانات التحليلية ؟')) {
                          AuditingMetrics.clear()
                          location.reload()
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 transition-all"
                    >
                      <Trash2 className="h-4 w-4" /> إعادة تعيين
                    </button>
                  </div>
                </div>
              )
            })()}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6 pt-10 text-center">
                <div className="bg-white rounded-[3rem] card-shadow p-12 border border-slate-50">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Trash2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-3">منطقة الصيانة</h3>
                  <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">تنبيه: حذف البيانات لا رجعة فيه ويشمل جميع ملفات التلاميذ.</p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { if(confirm('حذف جميع الملفات الشخصية ؟')) deleteAllProfiles() }}
                      className="w-full p-6 rounded-2xl bg-rose-500 text-white font-black text-lg hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all active:scale-95"
                    >
                      حذف جميع ملفات التلاميذ
                    </button>
                    <button className="w-full p-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-sm hover:bg-slate-200 transition-all">
                      حفظ النتائج (نسخة احتياطية)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}



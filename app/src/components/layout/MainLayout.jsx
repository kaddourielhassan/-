import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Shield, LogOut, BookOpen, BarChart3 } from 'lucide-react'
import { useProfileStore } from '../../store/useProfileStore'

export default function MainLayout() {
  const activeProfile = useProfileStore((s) => s.getActiveProfile())
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)
  const navigate = useNavigate()

  const handleLogout = () => {
    setActiveProfile(null)
    navigate('/')
  }

  const renderConnectedHeader = () => (
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/modules" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-2 rounded-xl text-lg font-arabic font-bold">
          حـ
        </div>
        <span className="font-black text-lg text-slate-800 hidden sm:inline">حروفي</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link to="/dashboard-enfant" className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-xl font-bold text-sm hover:bg-brand-100 transition-colors">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">تقدمي</span>
        </Link>

        <Link to="/maitresse" className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">فضاء المعلمة</span>
        </Link>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-2">
              {activeProfile.prenom}
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
                {activeProfile.avatar?.startsWith('/') ? (
                  <img src={activeProfile.avatar} alt={activeProfile.prenom} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg flex items-center justify-center h-full">{activeProfile.avatar}</span>
                )}
              </div>
            </p>
            <p className="text-xs font-semibold text-brand-600">
              المستوى {activeProfile.niveau} • {activeProfile.pointsTotal} ⭐
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-coral-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderDisconnectedHeader = () => (
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-2 rounded-xl text-lg font-arabic font-bold">
          حـ
        </div>
        <span className="font-black text-lg text-slate-800">حروفي</span>
      </Link>
      <Link to="/maitresse" className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors">
        <BookOpen className="h-4 w-4" />
        فضاء المعلمة
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-100">
        {activeProfile ? renderConnectedHeader() : renderDisconnectedHeader()}
      </header>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="py-6 mt-auto text-center border-t border-slate-200/50">
        <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5" /> يعمل دون اتصال 100% • تصميم الأستاذ EL KADDOURI — 2026
        </p>
      </footer>
    </div>
  )
}

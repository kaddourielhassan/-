import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Shield, LogOut, BookOpen, BarChart3, Moon, Sun } from 'lucide-react'
import { useProfileStore } from '../../store/useProfileStore'
import { useAppStore } from '../../store/useAppStore'

export default function MainLayout() {
  const activeProfile = useProfileStore((s) => s.getActiveProfile())
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
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
        <span className="font-black text-lg text-slate-800 dark:text-white hidden sm:inline">حروفي</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link to="/dashboard-enfant" className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1.5 rounded-xl font-bold text-sm hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">تقدمي</span>
        </Link>

        <Link to="/maitresse" className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">فضاء المعلمة</span>
        </Link>

        <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:text-brand-500 transition-colors" title="Thème sombre">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight flex items-center gap-2">
              {activeProfile.prenom}
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 flex-shrink-0">
                {activeProfile.avatar?.startsWith('/') ? (
                  <img src={activeProfile.avatar} alt={activeProfile.prenom} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg flex items-center justify-center h-full">{activeProfile.avatar}</span>
                )}
              </div>
            </div>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
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
        <span className="font-black text-lg text-slate-800 dark:text-white">حروفي</span>
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:text-brand-500 transition-colors" title="Thème sombre">
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <Link to="/maitresse" className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors">
          <BookOpen className="h-4 w-4" />
          فضاء المعلمة
        </Link>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-100 dark:border-slate-800/50">
        {activeProfile ? renderConnectedHeader() : renderDisconnectedHeader()}
      </header>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="py-6 mt-auto text-center border-t border-slate-200/50 dark:border-slate-800/50">
        <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="h-3.5 w-3.5" /> يعمل دون اتصال 100% • تصميم الأستاذ EL KADDOURI — 2026
        </p>
      </footer>
    </div>
  )
}

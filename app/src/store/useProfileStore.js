import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Avatars personnages — Garçons & Filles
const BASE = import.meta.env.BASE_URL || '/'
const CHILD_AVATARS = [
  // أولاد
  { name: 'سندباد', img: `${BASE}assets/avatars/sindbad.png`, color: 'bg-blue-100 text-blue-600', gender: 'garcon' },
  { name: 'علاء الدين', img: `${BASE}assets/avatars/aladin.png`, color: 'bg-purple-100 text-purple-600', gender: 'garcon' },
  { name: 'الأسد', img: `${BASE}assets/avatars/lion_boy.png`, color: 'bg-amber-100 text-amber-600', gender: 'garcon' },
  { name: 'البحّار', img: `${BASE}assets/avatars/sea_boy.png`, color: 'bg-orange-100 text-orange-600', gender: 'garcon' },
  { name: 'البرق', img: `${BASE}assets/avatars/lightning_boy.png`, color: 'bg-yellow-100 text-yellow-600', gender: 'garcon' },
  { name: 'السريع', img: `${BASE}assets/avatars/speed_boy.png`, color: 'bg-sky-100 text-sky-600', gender: 'garcon' },
  // بنات
  { name: 'ياسمين', img: `${BASE}assets/avatars/jasmine.png`, color: 'bg-teal-100 text-teal-600', gender: 'fille' },
  { name: 'الثلج', img: `${BASE}assets/avatars/ice_girl.png`, color: 'bg-cyan-100 text-cyan-600', gender: 'fille' },
  { name: 'المحيط', img: `${BASE}assets/avatars/ocean_girl.png`, color: 'bg-blue-100 text-blue-600', gender: 'fille' },
  { name: 'الفراشة', img: `${BASE}assets/avatars/butterfly_girl.png`, color: 'bg-emerald-100 text-emerald-600', gender: 'fille' },
  { name: 'الأميرة', img: `${BASE}assets/avatars/long_hair_girl.png`, color: 'bg-pink-100 text-pink-600', gender: 'fille' },
  { name: 'المحاربة', img: `${BASE}assets/avatars/warrior_girl.png`, color: 'bg-rose-100 text-rose-600', gender: 'fille' },
]

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId) || null
      },

      createProfile: (data) => {
        const avatarObj = data.avatar || CHILD_AVATARS[Math.floor(Math.random() * CHILD_AVATARS.length)]
        const newProfile = {
          id: crypto.randomUUID(),
          prenom: data.prenom,
          avatar: avatarObj.img || avatarObj.emoji || avatarObj,
          avatarName: avatarObj.name || '',
          avatarColor: avatarObj.color || 'bg-brand-50 text-brand-600',
          dateCreation: new Date().toISOString(),
          pointsTotal: 0,
          niveau: 1,
        }
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }))
        return newProfile.id
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      updateProfile: (id, data) => set((state) => ({
        profiles: state.profiles.map(p => p.id === id ? { ...p, ...data } : p)
      })),

      addPoints: (points) => set((state) => {
        const profile = state.profiles.find(p => p.id === state.activeProfileId)
        if (!profile) return state
        const newTotal = profile.pointsTotal + points
        const newNiveau = Math.max(1, Math.floor(newTotal / 200) + 1)
        return {
          profiles: state.profiles.map(p =>
            p.id === state.activeProfileId
              ? { ...p, pointsTotal: newTotal, niveau: newNiveau }
              : p
          )
        }
      }),

      deleteProfile: (id) => set((state) => ({
        profiles: state.profiles.filter(p => p.id !== id),
        activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
      })),

      deleteAllProfiles: () => set({ profiles: [], activeProfileId: null }),
    }),
    { name: 'hurufi-profiles' }
  )
)

export { CHILD_AVATARS }

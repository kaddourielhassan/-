import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { badges } from '../data/badges'

const DAILY_QUEST_TARGET = 3

// Initialisation et migration des statistiques agrégées (pour éviter la saturation du localStorage)
function migrateAndAggregate(profileResults) {
  const stats = {
    ecoute: { total: 0, correct: 0 },
    memory: { total: 0, completed: 0 },
    phonemes: { total: 0, correct: 0 },
    tracage: { total: 0, completed: 0 },
    flashcards: { total: 0, vus: 0 },
    totalSessions: 0
  }
  if (profileResults && profileResults.length > 0) {
    stats.totalSessions = profileResults.length
    profileResults.forEach(r => {
      if (stats[r.type]) {
        stats[r.type].total += 1
        if (r.correct) stats[r.type].correct += 1
        if (r.completed) stats[r.type].completed += 1
        if (r.type === 'flashcards') stats[r.type].vus += 1
      }
    })
  }
  return stats
}

function buildStats(aggregatedStatsByProfile, streaksByProfile, unlockedBadgesByProfile, profileId, legacyResults = {}) {
  let profileStats = aggregatedStatsByProfile[profileId]
  // Migration silencieuse si nécessaire
  if (!profileStats) {
    profileStats = migrateAndAggregate(legacyResults[profileId] || [])
  }
  
  const streak = streaksByProfile[profileId] || { count: 0 }
  const profileBadges = unlockedBadgesByProfile[profileId] || []
  
  return {
    ...profileStats,
    streak: streak.count,
    badges: profileBadges,
  }
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      // Legacy : conservé uniquement pour la rétrocompatibilité lors de la première migration
      results: {},
      
      // NOUVEAU : On stocke uniquement les scores agrégés pour préserver les performances et le cache
      aggregatedStats: {},
      
      // { profileId: ['badge_id', ...] }
      unlockedBadges: {},
      // { profileId: { lastDate: 'YYYY-MM-DD', count: N } }
      streaks: {},
      // { profileId: { date: 'YYYY-MM-DD', count: N, completed: bool } }
      dailyQuests: {},

      addResult: (profileId, result) => set((state) => {
        // --- 1. Agrégation des statistiques ---
        let currentStats = state.aggregatedStats[profileId]
        if (!currentStats) {
          currentStats = migrateAndAggregate(state.results[profileId] || [])
        } else {
          currentStats = JSON.parse(JSON.stringify(currentStats)) // Deep clone
        }

        currentStats.totalSessions += 1
        if (currentStats[result.type]) {
          currentStats[result.type].total += 1
          if (result.correct) currentStats[result.type].correct += 1
          if (result.completed) currentStats[result.type].completed += 1
          if (result.type === 'flashcards') currentStats[result.type].vus += 1
        }

        const nextAggregatedStats = { ...state.aggregatedStats, [profileId]: currentStats }

        // --- 2. Mise à jour de la série (Streak) ---
        const today = new Date().toISOString().split('T')[0]
        const streak = state.streaks[profileId] || { lastDate: null, count: 0 }
        let newStreak = { ...streak }
        if (streak.lastDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
          if (streak.lastDate === yesterday) {
            newStreak = { lastDate: today, count: streak.count + 1 }
          } else {
            newStreak = { lastDate: today, count: 1 }
          }
        }
        const nextStreaks = { ...state.streaks, [profileId]: newStreak }

        // --- 3. Quêtes journalières ---
        const todayQuest = state.dailyQuests[profileId] || { date: today, count: 0, completed: false }
        const questCount = todayQuest.date === today ? todayQuest.count + 1 : 1
        const nextDailyQuest = {
          date: today,
          count: questCount,
          completed: questCount >= DAILY_QUEST_TARGET,
        }
        const nextDailyQuests = { ...state.dailyQuests, [profileId]: nextDailyQuest }

        // --- 4. Badges ---
        const unlocked = state.unlockedBadges[profileId] || []
        const nextUnlocked = [...unlocked]
        const nextStats = buildStats(nextAggregatedStats, nextStreaks, state.unlockedBadges, profileId)
        
        badges.forEach((badge) => {
          if (!nextUnlocked.includes(badge.id) && badge.condition(nextStats)) {
            nextUnlocked.push(badge.id)
          }
        })
        const nextUnlockedBadges = { ...state.unlockedBadges, [profileId]: nextUnlocked }

        // Vider l'historique legacy pour ce profil pour économiser le cache
        const nextLegacyResults = { ...state.results }
        if (nextLegacyResults[profileId]) {
          delete nextLegacyResults[profileId]
        }

        return {
          results: nextLegacyResults, // On vide progressivement l'ancien format
          aggregatedStats: nextAggregatedStats,
          streaks: nextStreaks,
          dailyQuests: nextDailyQuests,
          unlockedBadges: nextUnlockedBadges,
        }
      }),

      unlockBadge: (profileId, badgeId) => set((state) => {
        const badges = state.unlockedBadges[profileId] || []
        if (badges.includes(badgeId)) return state
        return {
          unlockedBadges: { ...state.unlockedBadges, [profileId]: [...badges, badgeId] },
        }
      }),

      getStats: (profileId) => {
        const { aggregatedStats, streaks, unlockedBadges, results } = get()
        return buildStats(aggregatedStats, streaks, unlockedBadges, profileId, results)
      },

      getDailyQuest: (profileId) => {
        const today = new Date().toISOString().split('T')[0]
        const { dailyQuests } = get()
        const quest = dailyQuests[profileId]
        if (!quest || quest.date !== today) {
          return { count: 0, target: DAILY_QUEST_TARGET, completed: false }
        }
        return { count: quest.count, target: DAILY_QUEST_TARGET, completed: quest.completed }
      },

      getResultsForExport: () => {
        // Retourne un tableau vide car on n'exporte plus les logs bruts
        return {}
      },

      resetProfile: (profileId) => set((state) => {
        const nextResults = { ...state.results }
        delete nextResults[profileId]
        
        return {
          results: nextResults,
          aggregatedStats: { ...state.aggregatedStats, [profileId]: migrateAndAggregate([]) },
          unlockedBadges: { ...state.unlockedBadges, [profileId]: [] },
          streaks: { ...state.streaks, [profileId]: { lastDate: null, count: 0 } },
          dailyQuests: { ...state.dailyQuests, [profileId]: { date: null, count: 0, completed: false } },
        }
      }),
    }),
    { name: 'hurufi-game' }
  )
)

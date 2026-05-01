import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { badges } from '../data/badges'

const DAILY_QUEST_TARGET = 3

function buildStats(resultsByProfile, streaksByProfile, unlockedBadgesByProfile, profileId) {
  const profileResults = resultsByProfile[profileId] || []
  const streak = streaksByProfile[profileId] || { count: 0 }
  const profileBadges = unlockedBadgesByProfile[profileId] || []
  const byType = (type) => profileResults.filter((r) => r.type === type)
  const correctByType = (type) => byType(type).filter((r) => r.correct).length
  return {
    ecoute: { total: byType('ecoute').length, correct: correctByType('ecoute') },
    memory: { total: byType('memory').length, completed: byType('memory').filter((r) => r.completed).length },
    phonemes: { total: byType('phonemes').length, correct: correctByType('phonemes') },
    tracage: { total: byType('tracage').length, completed: byType('tracage').filter((r) => r.completed).length },
    flashcards: { total: byType('flashcards').length, vus: byType('flashcards').length },
    streak: streak.count,
    badges: profileBadges,
    totalSessions: profileResults.length,
  }
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      // { profileId: [{ type, score, date, temps, details }] }
      results: {},
      // { profileId: ['badge_id', ...] }
      unlockedBadges: {},
      // { profileId: { lastDate: 'YYYY-MM-DD', count: N } }
      streaks: {},
      // { profileId: { date: 'YYYY-MM-DD', count: N, completed: bool } }
      dailyQuests: {},

      addResult: (profileId, result) => set((state) => {
        const profileResults = state.results[profileId] || []
        const newResult = {
          ...result,
          date: new Date().toISOString(),
          id: crypto.randomUUID(),
        }
        // Update streak
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
        const nextResults = { ...state.results, [profileId]: [...profileResults, newResult] }
        const nextStreaks = { ...state.streaks, [profileId]: newStreak }

        const todayQuest = state.dailyQuests[profileId] || { date: today, count: 0, completed: false }
        const questCount = todayQuest.date === today ? todayQuest.count + 1 : 1
        const nextDailyQuest = {
          date: today,
          count: questCount,
          completed: questCount >= DAILY_QUEST_TARGET,
        }
        const nextDailyQuests = { ...state.dailyQuests, [profileId]: nextDailyQuest }

        const unlocked = state.unlockedBadges[profileId] || []
        const nextUnlocked = [...unlocked]
        const nextStats = buildStats(nextResults, nextStreaks, state.unlockedBadges, profileId)
        badges.forEach((badge) => {
          if (!nextUnlocked.includes(badge.id) && badge.condition(nextStats)) {
            nextUnlocked.push(badge.id)
          }
        })
        const nextUnlockedBadges = { ...state.unlockedBadges, [profileId]: nextUnlocked }

        return {
          results: nextResults,
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
        const { results, streaks, unlockedBadges } = get()
        return buildStats(results, streaks, unlockedBadges, profileId)
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
        const { results } = get()
        return results
      },

      resetProfile: (profileId) => set((state) => ({
        results: { ...state.results, [profileId]: [] },
        unlockedBadges: { ...state.unlockedBadges, [profileId]: [] },
        streaks: { ...state.streaks, [profileId]: { lastDate: null, count: 0 } },
        dailyQuests: { ...state.dailyQuests, [profileId]: { date: null, count: 0, completed: false } },
      })),
    }),
    { name: 'hurufi-game' }
  )
)

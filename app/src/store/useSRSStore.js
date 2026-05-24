import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSRSItem, processAnswer } from '../utils/srsAlgorithm'

export const useSRSStore = create(
  persist(
    (set, get) => ({
      // { profileId: { 'letter_1': srsItem, 'phoneme_2': srsItem, ... } }
      items: {},
      // { profileId: sessionCount }
      sessionCounts: {},

      getProfileItems: (profileId) => {
        return get().items[profileId] || {}
      },

      getItem: (profileId, itemId, itemType) => {
        const key = `${itemType}_${itemId}`
        const profileItems = get().items[profileId] || {}
        return profileItems[key] || null
      },

      recordAnswer: (profileId, itemId, itemType, isCorrect) => set(state => {
        const key = `${itemType}_${itemId}`
        const profileItems = { ...(state.items[profileId] || {}) }
        const currentItem = profileItems[key] || createSRSItem(itemId, itemType)
        const sessionCount = state.sessionCounts[profileId] || 0

        profileItems[key] = processAnswer(currentItem, isCorrect, sessionCount)

        return {
          items: { ...state.items, [profileId]: profileItems }
        }
      }),

      incrementSession: (profileId) => set(state => ({
        sessionCounts: {
          ...state.sessionCounts,
          [profileId]: (state.sessionCounts[profileId] || 0) + 1,
        }
      })),

      getSessionCount: (profileId) => {
        return get().sessionCounts[profileId] || 0
      },

      resetProfile: (profileId) => set(state => {
        const newItems = { ...state.items }
        delete newItems[profileId]
        const newCounts = { ...state.sessionCounts }
        delete newCounts[profileId]
        return { items: newItems, sessionCounts: newCounts }
      }),
    }),
    { name: 'hurufi-srs' }
  )
)

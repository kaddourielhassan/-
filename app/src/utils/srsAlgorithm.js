/**
 * Système de Répétition Espacée (SRS) — Algorithme Leitner
 * Boîte 1 : Revoir chaque session
 * Boîte 2 : Revoir toutes les 2 sessions
 * Boîte 3 : Revoir toutes les 5 sessions
 * Boîte 4 : Maîtrisé — revoir toutes les 10 sessions
 */

const BOX_INTERVALS = { 1: 1, 2: 2, 3: 5, 4: 10 }

export function createSRSItem(itemId, itemType) {
  return {
    itemId,
    itemType, // 'letter' | 'phoneme'
    box: 1,
    lastReviewed: null,
    lastSessionReviewed: 0,
    reviewCount: 0,
    correctCount: 0,
    errorCount: 0,
  }
}

export function processAnswer(item, isCorrect, sessionCount) {
  const updated = { ...item }
  updated.reviewCount += 1
  updated.lastReviewed = Date.now()
  updated.lastSessionReviewed = sessionCount

  if (isCorrect) {
    updated.correctCount += 1
    updated.box = Math.min(4, item.box + 1)
  } else {
    updated.errorCount += 1
    updated.box = 1
  }
  return updated
}

export function getReviewPriority(item, sessionCount) {
  if (!item.lastReviewed) return 100
  const interval = BOX_INTERVALS[item.box] || 1
  const sessionsSince = sessionCount - (item.lastSessionReviewed || 0)
  const overdue = sessionsSince / interval
  const errorRate = item.errorCount / Math.max(1, item.reviewCount)
  return overdue * 10 + errorRate * 20 + (5 - item.box) * 5
}

export function selectItemsForReview(allItemIds, srsItems, count, sessionCount) {
  const scored = allItemIds.map(id => {
    const item = srsItems[id] || createSRSItem(id, 'letter')
    return { id, priority: getReviewPriority(item, sessionCount) }
  })
  scored.sort((a, b) => b.priority - a.priority)
  const selected = scored.slice(0, count).map(s => s.id)
  // Shuffle for variety
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]]
  }
  return selected
}

export function getMasteryLevel(item) {
  if (!item || item.reviewCount === 0) return 'unseen'
  if (item.box >= 4) return 'mastered'
  if (item.box >= 3) return 'learned'
  if (item.box >= 2) return 'learning'
  return 'new'
}

export function getMasteryColor(level) {
  const colors = {
    mastered: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
    learned:  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    learning: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    new:      { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
    unseen:   { bg: 'bg-slate-100', text: 'text-slate-400', border: 'border-slate-200' },
  }
  return colors[level] || colors.unseen
}

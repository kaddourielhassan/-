/**
 * Waypoints de traçage pour les 12 lettres prioritaires
 * Chaque lettre a 3-4 zones rectangulaires que le tracé doit traverser
 * Coordonnées sur un canvas 400×400
 */

export const letterWaypoints = {
  // ا (Alif) — Trait vertical de haut en bas
  1: {
    zones: [
      { x: 175, y: 40, w: 50, h: 50, order: 1, label: 'أعلى' },
      { x: 175, y: 170, w: 50, h: 50, order: 2, label: 'وسط' },
      { x: 175, y: 300, w: 50, h: 50, order: 3, label: 'أسفل' },
    ],
    minZonesRequired: 3,
  },
  // ح (Haa) — Courbe ouverte de droite vers gauche
  2: {
    zones: [
      { x: 290, y: 140, w: 55, h: 50, order: 1, label: 'بداية' },
      { x: 190, y: 270, w: 55, h: 50, order: 2, label: 'قعر' },
      { x: 90, y: 190, w: 55, h: 50, order: 3, label: 'صعود' },
    ],
    minZonesRequired: 3,
  },
  // د (Daal) — Petit arc de droite
  3: {
    zones: [
      { x: 270, y: 150, w: 55, h: 50, order: 1, label: 'بداية' },
      { x: 190, y: 250, w: 55, h: 50, order: 2, label: 'انحناء' },
      { x: 110, y: 170, w: 55, h: 50, order: 3, label: 'نهاية' },
    ],
    minZonesRequired: 3,
  },
  // ر (Raa) — Petit crochet descendant
  4: {
    zones: [
      { x: 210, y: 140, w: 55, h: 50, order: 1, label: 'بداية' },
      { x: 190, y: 230, w: 55, h: 50, order: 2, label: 'انحدار' },
      { x: 150, y: 310, w: 55, h: 50, order: 3, label: 'نهاية' },
    ],
    minZonesRequired: 3,
  },
  // س (Siin) — Vagues avec 3 dents
  5: {
    zones: [
      { x: 290, y: 210, w: 50, h: 50, order: 1, label: 'بداية' },
      { x: 220, y: 170, w: 50, h: 50, order: 2, label: 'سنّ' },
      { x: 150, y: 210, w: 50, h: 50, order: 3, label: 'سنّ ٢' },
      { x: 70, y: 250, w: 55, h: 50, order: 4, label: 'نهاية' },
    ],
    minZonesRequired: 3,
  },
  // ص (Saad) — Forme arrondie avec queue
  6: {
    zones: [
      { x: 270, y: 170, w: 55, h: 50, order: 1, label: 'بداية' },
      { x: 210, y: 260, w: 55, h: 50, order: 2, label: 'حلقة' },
      { x: 100, y: 200, w: 55, h: 50, order: 3, label: 'ذيل' },
    ],
    minZonesRequired: 3,
  },
  // ط (Taa) — Boucle avec trait vertical
  7: {
    zones: [
      { x: 190, y: 70, w: 55, h: 50, order: 1, label: 'عمود' },
      { x: 240, y: 210, w: 55, h: 50, order: 2, label: 'حلقة' },
      { x: 150, y: 280, w: 55, h: 50, order: 3, label: 'قعر' },
    ],
    minZonesRequired: 3,
  },
  // ع (Ayn) — Courbe en S complexe
  8: {
    zones: [
      { x: 250, y: 110, w: 55, h: 50, order: 1, label: 'رأس' },
      { x: 190, y: 200, w: 55, h: 50, order: 2, label: 'وسط' },
      { x: 150, y: 300, w: 55, h: 50, order: 3, label: 'ذيل' },
    ],
    minZonesRequired: 3,
  },
  // ل (Laam) — Vertical avec crochet gauche
  9: {
    zones: [
      { x: 190, y: 50, w: 50, h: 50, order: 1, label: 'أعلى' },
      { x: 190, y: 190, w: 50, h: 50, order: 2, label: 'وسط' },
      { x: 140, y: 300, w: 55, h: 50, order: 3, label: 'انعطاف' },
    ],
    minZonesRequired: 3,
  },
  // م (Miim) — Boucle puis queue
  10: {
    zones: [
      { x: 250, y: 170, w: 55, h: 50, order: 1, label: 'بداية' },
      { x: 210, y: 260, w: 55, h: 50, order: 2, label: 'حلقة' },
      { x: 150, y: 320, w: 55, h: 50, order: 3, label: 'ذيل' },
    ],
    minZonesRequired: 3,
  },
  // و (Waaw) — Petit cercle avec queue
  11: {
    zones: [
      { x: 210, y: 130, w: 55, h: 50, order: 1, label: 'رأس' },
      { x: 230, y: 220, w: 55, h: 50, order: 2, label: 'حلقة' },
      { x: 190, y: 310, w: 55, h: 50, order: 3, label: 'ذيل' },
    ],
    minZonesRequired: 3,
  },
  // ه (Ha) — Forme ovale/circulaire
  12: {
    zones: [
      { x: 245, y: 170, w: 55, h: 50, order: 1, label: 'يمين' },
      { x: 190, y: 270, w: 55, h: 50, order: 2, label: 'أسفل' },
      { x: 120, y: 170, w: 55, h: 50, order: 3, label: 'يسار' },
    ],
    minZonesRequired: 3,
  },
}

/** Check if a point is inside a zone */
function isInZone(x, y, zone) {
  return x >= zone.x && x <= zone.x + zone.w &&
         y >= zone.y && y <= zone.y + zone.h
}

/**
 * Validate a drawing trace against letter waypoints
 * @param {number} letterId - ID of the letter
 * @param {Array<{x: number, y: number}>} tracePoints - Points recorded during drawing
 * @returns {{ valid: boolean, score: number, hitCount: number, totalZones: number, zones: Array }}
 */
export function validateTrace(letterId, tracePoints) {
  const config = letterWaypoints[letterId]
  if (!config) return { valid: true, score: 1, hitCount: 0, totalZones: 0, zones: [] }

  const zones = config.zones.map(z => ({ ...z, hit: false }))
  let lastHitOrder = 0

  for (const point of tracePoints) {
    for (const zone of zones) {
      if (!zone.hit && isInZone(point.x, point.y, zone)) {
        if (zone.order >= lastHitOrder) {
          zone.hit = true
          lastHitOrder = zone.order
        }
      }
    }
  }

  const hitCount = zones.filter(z => z.hit).length
  const required = config.minZonesRequired || zones.length
  const score = hitCount / zones.length

  return { valid: hitCount >= required, score, hitCount, totalZones: zones.length, zones }
}

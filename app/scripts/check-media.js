import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { categories } from '../src/data/vocabulaire.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')

const imageRoot = path.join(appRoot, 'public', 'resources', 'images', 'vocabulaire')
const audioRoot = path.join(appRoot, 'public', 'resources', 'audio', 'vocabulaire')

function relToAbsolute(publicPath) {
  const clean = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath
  return path.join(appRoot, 'public', clean.replaceAll('/', path.sep))
}

function scan() {
  const missingImages = []
  const missingAudios = []
  let expectedPairs = 0

  categories.forEach((cat) => {
    cat.mots.forEach((mot, index) => {
      expectedPairs += 1
      const expectedImage = mot.image || `/resources/images/vocabulaire/${cat.id}-${index + 1}.webp`
      const expectedAudio = mot.audio || `/resources/audio/vocabulaire/${cat.id}-${index + 1}.mp3`

      const imageAbs = relToAbsolute(expectedImage)
      const audioAbs = relToAbsolute(expectedAudio)

      if (!fs.existsSync(imageAbs)) {
        missingImages.push({ cat: cat.id, idx: index + 1, file: expectedImage })
      }
      if (!fs.existsSync(audioAbs)) {
        missingAudios.push({ cat: cat.id, idx: index + 1, file: expectedAudio })
      }
    })
  })

  return { expectedPairs, missingImages, missingAudios }
}

function printList(title, items) {
  console.log(`\n${title}: ${items.length}`)
  if (items.length === 0) return
  items.forEach((item) => {
    console.log(`- ${item.cat} #${item.idx}: ${item.file}`)
  })
}

if (!fs.existsSync(imageRoot)) {
  console.log(`Missing folder: ${imageRoot}`)
}
if (!fs.existsSync(audioRoot)) {
  console.log(`Missing folder: ${audioRoot}`)
}

const { expectedPairs, missingImages, missingAudios } = scan()
const imageReady = expectedPairs - missingImages.length
const audioReady = expectedPairs - missingAudios.length

console.log('=== Hurufi Media Check ===')
console.log(`Expected media pairs: ${expectedPairs}`)
console.log(`Images ready: ${imageReady}/${expectedPairs}`)
console.log(`Audios ready: ${audioReady}/${expectedPairs}`)

printList('Missing images', missingImages)
printList('Missing audios', missingAudios)

if (missingImages.length === 0 && missingAudios.length === 0) {
  console.log('\nStatus: OK (all media present)')
  process.exit(0)
}

console.log('\nStatus: INCOMPLETE (missing media files)')
process.exit(1)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { categories } from '../src/data/vocabulaire.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const sourceArgIndex = args.findIndex((a) => a === '--source')
const sourceArg = sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : null

const sourceDir = sourceArg
  ? path.resolve(appRoot, sourceArg)
  : path.join(appRoot, 'public', 'resources', 'images', 'incoming')

const targetDir = path.join(appRoot, 'public', 'resources', 'images', 'vocabulaire')

const allowedExt = new Set(['.webp', '.png', '.jpg', '.jpeg'])

function expectedNames() {
  const out = []
  categories.forEach((cat) => {
    cat.mots.forEach((_, idx) => {
      out.push(`${cat.id}-${idx + 1}.webp`)
    })
  })
  return out
}

function listSourceImages(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true, sensitivity: 'base' }))
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const expected = expectedNames()
const sourceFiles = listSourceImages(sourceDir)

console.log('=== Hurufi Bulk Image Renamer ===')
console.log(`Source: ${sourceDir}`)
console.log(`Target: ${targetDir}`)
console.log(`Expected images: ${expected.length}`)
console.log(`Found source images: ${sourceFiles.length}`)

if (sourceFiles.length === 0) {
  console.log('\nNo source images found.')
  console.log('Tip: put your files in public/resources/images/incoming/ or pass --source <relative-path>.')
  process.exit(1)
}

if (sourceFiles.length < expected.length) {
  console.log(`\nWarning: only ${sourceFiles.length}/${expected.length} images available. Missing items will remain unchanged.`)
}
if (sourceFiles.length > expected.length) {
  console.log(`\nWarning: ${sourceFiles.length - expected.length} extra images will be ignored.`)
}

const plan = expected
  .map((targetName, idx) => {
    const src = sourceFiles[idx]
    if (!src) return null
    return {
      from: path.join(sourceDir, src),
      to: path.join(targetDir, targetName),
      sourceName: src,
      targetName,
    }
  })
  .filter(Boolean)

console.log('\nRename plan preview (first 15):')
plan.slice(0, 15).forEach((item) => {
  console.log(`- ${item.sourceName} -> ${item.targetName}`)
})
if (plan.length > 15) {
  console.log(`... and ${plan.length - 15} more`)
}

if (!apply) {
  console.log('\nDry run only. Use --apply to perform renaming.')
  process.exit(0)
}

ensureDir(targetDir)
let done = 0
plan.forEach((item) => {
  fs.copyFileSync(item.from, item.to)
  done += 1
})

console.log(`\nDone: ${done} files copied/renamed into vocabulaire.`)

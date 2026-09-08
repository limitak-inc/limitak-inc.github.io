import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { spawnSync } from 'node:child_process'

const dir = 'public/images'
const exts = new Set(['.jpg', '.jpeg', '.png'])
const cwebp = spawnSync('cwebp', ['-version'], { encoding: 'utf8' })
const hasCwebp = cwebp.status === 0

if (!hasCwebp) {
  console.log('webp: skip (cwebp not installed)')
  process.exit(0)
}

const files = await readdir(dir)
for (const file of files) {
  if (!exts.has(extname(file).toLowerCase())) continue
  const input = join(dir, file)
  const output = input.replace(/\.(jpe?g|png)$/i, '.webp')
  const inputStat = await stat(input)
  const outputStat = await stat(output).catch(() => null)
  if (outputStat && outputStat.mtimeMs >= inputStat.mtimeMs) continue
  const result = spawnSync('cwebp', ['-q', '82', input, '-o', output], { stdio: 'inherit' })
  if (result.status === 0) console.log(`webp: ${file}`)
}

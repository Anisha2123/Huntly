import fs from 'node:fs'
import path from 'node:path'

const FRONTEND_DIR = process.cwd()

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

const FILES = []
for (const sub of ['app', 'components']) {
  const p = path.join(FRONTEND_DIR, sub)
  if (fs.existsSync(p)) FILES.push(...walk(p))
}

const CORMANT_RE = /Cormorant_Garamond\s*\(\s*\{/g
const DM_RE = /DM_Sans\s*\(\s*\{/g

function extractNear(content, idx) {
  const windowSize = 900
  const snippet = content.slice(idx, idx + windowSize)

  const variable = (snippet.match(/variable\s*:\s*['"]([^'"]+)['"]/i) || [])[1] || null
  const weightBlock = (snippet.match(/weight\s*:\s*\[([\s\S]*?)\]/i) || [])[1] || ''
  const styleBlock = (snippet.match(/style\s*:\s*\[([\s\S]*?)\]/i) || [])[1] || ''

  const weights = Array.from(weightBlock.matchAll(/['"]([^'"]+)['"]/g)).map(m => m[1])
  const styles = Array.from(styleBlock.matchAll(/['"]([^'"]+)['"]/g)).map(m => m[1])

  return { variable, weights, styles }
}

let cormorantOccurrences = 0
let dmOccurrences = 0
const cormorantVars = new Set()
const dmVars = new Set()
const byFile = {}

async function headCheck(url, timeoutMs = 3000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal })
    return { ok: res.ok, status: res.status }
  } catch (e) {
    return { ok: false, error: e?.name || 'Error' }
  } finally {
    clearTimeout(t)
  }
}

const networkCheckUrl = 'https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2'
const fontsNetwork = await headCheck(networkCheckUrl)

for (const file of FILES) {
  if (!/\.(ts|tsx)$/.test(file)) continue
  const content = fs.readFileSync(file, 'utf8')

  const cMatches = [...content.matchAll(CORMANT_RE)]
  const dMatches = [...content.matchAll(DM_RE)]
  if (cMatches.length === 0 && dMatches.length === 0) continue

  const rec = byFile[file] || { cormorant: [], dm: [] }
  for (const m of cMatches) {
    cormorantOccurrences++
    const info = extractNear(content, m.index)
    if (info.variable) cormorantVars.add(info.variable)
    rec.cormorant.push(info)
  }
  for (const m of dMatches) {
    dmOccurrences++
    const info = extractNear(content, m.index)
    if (info.variable) dmVars.add(info.variable)
    rec.dm.push(info)
  }
  byFile[file] = rec
}

// #region agent log
fetch('http://127.0.0.1:7818/ingest/79eadf2d-6526-4b8d-8d92-35a6141866de', {method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'de2cc6'},body:JSON.stringify({sessionId:'de2cc6',location:'frontend/scripts/debug-fonts.mjs',message:'Font definition counts + network check',data:{runId:'pre-fix',cormorantOccurrences,dmOccurrences,cormorantVariables:[...cormorantVars],dmVariables:[...dmVars],fontsNetwork,byFile},timestamp:Date.now()})}).catch(()=>{});
// #endregion


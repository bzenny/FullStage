// Compare Svelte diagnostic identities, not aggregate totals or line numbers.
// Input: raw human-format svelte-check output captured on the same OS/Node setup.
// Usage: node scripts/ci/compare-svelte-baseline.mjs baseline.log candidate.log
import fs from "node:fs"
const [baselinePath, candidatePath] = process.argv.slice(2)
if (!baselinePath || !candidatePath) throw new Error("Provide baseline and candidate logs")

function parse(file) {
  const text = fs.readFileSync(file, "utf8").replace(/\x1b\[[0-9;]*m/g, "")
  const lines = text.split(/\r?\n/)
  const diagnostics = []
  for (let i = 0; i < lines.length - 1; i++) {
    // Human svelte-check emits '/.../src/foo.svelte:line:column' followed by 'Error: ...'.
    const match = lines[i].match(/(?:^|\s)([^\s]+\.(?:svelte|ts|js)):(\d+):(\d+)\s*$/)
    if (!match) continue
    const next = lines[i + 1].trim()
    const error = next.match(/^Error:\s*(.+)$/)
    if (!error) continue
    const name = match[1].replaceAll("\\", "/")
    const relative = name.includes("/src/") ? "src/" + name.split("/src/").slice(-1)[0] :
      name.includes("/config/") ? "config/" + name.split("/config/").slice(-1)[0] : name
    diagnostics.push({ path: relative, message: error[1].trim() })
  }
  const count = text.match(/svelte-check found\s+(\d+)\s+errors?/)
  if (!count) throw new Error("No completed svelte-check summary in " + file)
  if (Number(count[1]) !== diagnostics.length)
    throw new Error(`Diagnostic parser incomplete: ${file}: reported ${count[1]}, parsed ${diagnostics.length}`)
  return diagnostics
}
const baseline = parse(baselinePath), candidate = parse(candidatePath)
const key = d => d.path + "\t" + d.message
const old = new Map()
for (const d of baseline) old.set(key(d), (old.get(key(d)) || 0) + 1)
const regressions = []
for (const d of candidate) {
  const k = key(d), count = old.get(k) || 0
  if (count) old.set(k, count - 1)
  else regressions.push(d)
}
console.log(JSON.stringify({ baselineErrors: baseline.length, candidateErrors: candidate.length,
  newErrors: regressions.length, regressions }, null, 2))
if (regressions.length) process.exitCode = 1

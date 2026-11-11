import { supabase } from './supabase'

export async function selectAll(table, build) {
  const page = 1000
  let from = 0
  const all = []
  for (;;) {
    let q = supabase.from(table).select('*').range(from, from + page - 1)
    if (build) q = build(q)
    const { data, error } = await q
    if (error) throw error
    all.push(...(data || []))
    if (!data || data.length < page) break
    from += page
  }
  return all
}

export async function selectIn(table, column, ids) {
  if (!ids.length) return []
  const all = []
  for (let i = 0; i < ids.length; i += 150) {
    const chunk = ids.slice(i, i + 150)
    const rows = await selectAll(table, (q) => q.in(column, chunk))
    all.push(...rows)
  }
  return all
}

export function mapSettings(rows) {
  const out = {}
  for (const r of rows || []) out[r.setting_key] = r.value ?? ''
  return out
}

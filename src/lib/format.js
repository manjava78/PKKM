export function fmt(n, d = 1) {
  if (n === null || n === undefined || n === '' || Number.isNaN(Number(n))) return '–'
  return Number(n).toFixed(d).replace('.', ',')
}

export function sebutClass(s) {
  if (s === 'Amat Baik' || s === 'Baik') return 'pill'
  if (s === 'Cukup') return 'pill a'
  if (s === 'Sedang') return 'pill b'
  if (s === 'Kurang') return 'pill r'
  return 'pill g'
}

export function isi(text, S) {
  return String(text || '').replaceAll('{madrasah}', S?.madrasah_nama || '')
}

export function numOrBlank(n) {
  const x = Number(n)
  if (!Number.isFinite(x)) return ''
  return Number.isInteger(x) ? String(x) : String(x)
}

import PKG from '../data/pkg_instrumen.json' with { type: 'json' }
import PKKM from '../data/pkkm_instrumen.json' with { type: 'json' }
import PKB_MAP from '../data/pkb_map.json' with { type: 'json' }
import REF from '../data/ref.json' with { type: 'json' }

export { PKG, PKKM, PKB_MAP, REF }

export const UTAMA = ['GMP', 'BK', 'TIK']
export const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
export const GOL = [
  'Penata Muda, III/a', 'Penata Muda Tk. I, III/b', 'Penata, III/c', 'Penata Tk. I, III/d',
  'Pembina, IV/a', 'Pembina Tk. I, IV/b', 'Pembina Utama Muda, IV/c',
  'Pembina Utama Madya, IV/d', 'Pembina Utama, IV/e',
]
export const AK_MIN = {
  'Penata Muda, III/a': 50, 'Penata Muda Tk. I, III/b': 50, 'Penata, III/c': 100,
  'Penata Tk. I, III/d': 100, 'Pembina, IV/a': 150, 'Pembina Tk. I, IV/b': 150,
  'Pembina Utama Muda, IV/c': 150, 'Pembina Utama Madya, IV/d': 200, 'Pembina Utama, IV/e': 200,
}
export const AK_DIRI = {
  'Penata Muda, III/a': 3, 'Penata Muda Tk. I, III/b': 3, 'Penata, III/c': 3,
  'Penata Tk. I, III/d': 4, 'Pembina, IV/a': 4, 'Pembina Tk. I, IV/b': 4,
  'Pembina Utama Muda, IV/c': 5, 'Pembina Utama Madya, IV/d': 5, 'Pembina Utama, IV/e': 5,
}
export const AK_PUB = {
  'Penata Muda, III/a': 0, 'Penata Muda Tk. I, III/b': 4, 'Penata, III/c': 6,
  'Penata Tk. I, III/d': 8, 'Pembina, IV/a': 12, 'Pembina Tk. I, IV/b': 12,
  'Pembina Utama Muda, IV/c': 14, 'Pembina Utama Madya, IV/d': 14, 'Pembina Utama, IV/e': 14,
}
export const AK_PENUNJANG = {
  'Penata Muda, III/a': 5, 'Penata Muda Tk. I, III/b': 5, 'Penata, III/c': 10,
  'Penata Tk. I, III/d': 15, 'Pembina, IV/a': 15, 'Pembina Tk. I, IV/b': 15,
  'Pembina Utama Muda, IV/c': 20, 'Pembina Utama Madya, IV/d': 20, 'Pembina Utama, IV/e': 20,
}
export const JENIS_GURU = ['Guru Mata Pelajaran', 'Guru Kelas', 'Guru Bimbingan dan Konseling', 'Guru TIK']
export const STATUS = ['PNS', 'PPPK', 'GTY', 'GTT']
export const TAHAP = ['Formatif', 'Sumatif', 'Kemajuan']
export const TUGAS_ROLE = {
  'Waka Kurikulum': 'WKUR',
  'Waka Kesiswaan': 'WSIS',
  'Waka Sarpras': 'WSAR',
  'Waka Humas': 'WHUM',
  'Kepala Perpustakaan': 'PUS',
}
export const PKB_JENIS = {
  '1. Pengembangan Diri': [
    '1.1 Diklat fungsional',
    '1.2 Kegiatan lokakarya atau kegiatan kelompok guru',
    '1.3 Pembahas atau peserta pada seminar, koloqium, atau diskusi pannel',
    '1.4 Kegiatan kolektif guru (MGMP/MGBK/KKG)',
  ],
  '2. Publikasi Ilmiah': [
    '2.1 Presentasi pada forum ilmiah',
    '2.2 Publikasi ilmiah hasil penelitian/gagasan',
    '2.3 Publikasi buku teks/buku pengayaan/pedoman guru',
  ],
  '3. Karya Inovatif': [
    '3.1 Penemuan teknologi tepat guna',
    '3.2 Penemuan/peciptaan atau pengembangan karya seni',
    '3.3 Pembuatan/modifikasi alat pelajaran/peraga/praktikum',
    '3.4 Penyusunan standar, pedoman, soal, dan sejenisnya',
  ],
}
export const ROLE_LABEL = Object.fromEntries(
  Object.entries(PKG).map(([k, v]) => [k, v.label || k]),
)
export const JAM_TUGAS = {
  'Kepala Madrasah': 24,
  'Wali Kelas': 6,
  'Pembina Ekstrakurikuler': 6,
  'Guru Piket': 1,
}
for (const t of REF.tugas || []) {
  if (JAM_TUGAS[t] == null) JAM_TUGAS[t] = 12
}

export const GURU_FIELDS = [
  'nama', 'nip', 'no_karpeg', 'nrg', 'nuptk', 'jk', 'tempat_lahir', 'tgl_lahir', 'pendidikan', 'status',
  'pangkat', 'tmt_golongan', 'tmt_guru', 'jenis_guru', 'instrumen', 'mapel', 'jam_mengajar', 'tugas1',
  'tugas2', 'tugas3', 'tmt_tugas', 'lembaga_lain', 'jam_lembaga_lain', 'penilai_nama', 'penilai_nip',
  'penilai_pangkat', 'periode_awal', 'periode_akhir', 'tgl_penilaian', 'tgl_laporan', 'tahap',
]

export function tugasRole(t) {
  if (t == null || t === '' || t === '-') return null
  if (String(t).startsWith('Kepala Lab')) return 'LAB'
  return TUGAS_ROLE[t] ?? null
}

export function instrumenDefault(jenisGuru, mapel) {
  const j = String(jenisGuru || '').toLowerCase()
  if (j.includes('bimbingan') || j.includes('konseling')) return 'BK'
  const parts = j.split(/\s+/)
  if (parts.includes('tik') || String(mapel || '').trim().toUpperCase() === 'TIK') return 'TIK'
  return 'GMP'
}

export function level(n) {
  if (n < 1) return 0
  if (n < 26) return 1
  if (n < 51) return 2
  if (n < 76) return 3
  return n <= 100 ? 4 : 0
}

export function sebutan(x) {
  if (x === null || x === undefined || x === '' || Number.isNaN(Number(x))) return '-'
  const n = Number(x)
  if (n <= 50) return 'Kurang'
  if (n <= 60) return 'Sedang'
  if (n <= 75) return 'Cukup'
  if (n <= 90) return 'Baik'
  if (n <= 100) return 'Amat Baik'
  return '-'
}

export function npk(x) {
  if (x === null || x === undefined || x === '' || Number.isNaN(Number(x))) return ['-', 0]
  const n = Number(x)
  const rows = [[50, '25%', 0.25], [60, '50%', 0.5], [75, '75%', 0.75], [90, '100%', 1], [100, '125%', 1.25]]
  for (const row of rows) {
    if (n <= row[0]) return [row[1], row[2]]
  }
  return ['-', 0]
}

function ymd(y, mo, d) {
  const dt = new Date(y, mo - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null
  dt.setHours(0, 0, 0, 0)
  return dt
}

export function parseDate(s) {
  if (!s) return null
  const str = String(s).trim()
  let m = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return ymd(+m[1], +m[2], +m[3])
  m = str.match(/^(\d{4})\/(\d{2})\/(\d{2})/)
  if (m) return ymd(+m[1], +m[2], +m[3])
  m = str.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (m) return ymd(+m[3], +m[2], +m[1])
  return null
}

export function tglIndo(s) {
  const d = parseDate(s)
  if (!d) return ''
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

export function masaKerja(awal, akhir) {
  const a = parseDate(awal)
  const b = parseDate(akhir) || (() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  })()
  if (!a || b < a) return ''
  const months = (b.getFullYear() - a.getFullYear()) * 12
    + (b.getMonth() - a.getMonth())
    - (b.getDate() < a.getDate() ? 1 : 0)
  return `${Math.floor(months / 12)} Tahun ${months % 12} Bulan`
}

function scoreGet(scores, k, i) {
  if (!scores) return null
  const key = `${k},${i}`
  if (Object.prototype.hasOwnProperty.call(scores, key)) {
    const v = scores[key]
    return v === null || v === '' ? null : Number(v)
  }
  if (scores[k] && Object.prototype.hasOwnProperty.call(scores[k], i)) {
    const v = scores[k][i]
    return v === null || v === '' ? null : Number(v)
  }
  return null
}

function pkkmScoreGet(scores, sec, u, i) {
  if (!scores) return null
  const keys = [`${sec},${u},${i}`, `${sec}|${u}|${i}`]
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(scores, key)) {
      const v = scores[key]
      return v === null || v === '' ? null : Number(v)
    }
  }
  if (scores[sec]?.[u] && Object.prototype.hasOwnProperty.call(scores[sec][u], i)) {
    const v = scores[sec][u][i]
    return v === null || v === '' ? null : Number(v)
  }
  return null
}

export function hitungRole(role, scores) {
  const def = PKG[role]
  if (!def) {
    return {
      role, label: ROLE_LABEL[role] || role, comps: [], terisi: 0, total_ind: 0, lengkap: true,
      jml_level: 0, maks_level: 0, nilai100: 0,
    }
  }
  const comps = []
  let terisi = 0
  let totalInd = 0
  def.kompetensi.forEach((c, k) => {
    const n = c.indikator.length
    const vals = []
    for (let i = 0; i < n; i++) vals.push(scoreGet(scores, k, i))
    let ans = 0
    let tot = 0
    for (const v of vals) {
      if (v !== null && !Number.isNaN(v)) {
        ans++
        tot += v
      }
    }
    const nilai = n ? (tot / (n * 2) * 100) : 0
    comps.push({
      k, judul: c.judul, n, terisi: ans, total: tot, maks: n * 2,
      nilai, level: level(nilai), vals, indikator: c.indikator,
    })
    terisi += ans
    totalInd += n
  })
  const jmlLevel = comps.reduce((s, c) => s + c.level, 0)
  const maksLevel = 4 * comps.length
  const nilai100 = terisi ? (jmlLevel / maksLevel * 100) : 0
  return {
    role, label: ROLE_LABEL[role] || role, comps, terisi, total_ind: totalInd,
    lengkap: terisi === totalInd, jml_level: jmlLevel, maks_level: maksLevel, nilai100,
  }
}

export function hitungHadir(rows) {
  const tabel = []
  let sl = 0
  let sp = 0
  let st = 0
  for (let b = 1; b <= 12; b++) {
    const row = rows?.[b] || [0, 0, 0]
    const tl = Number(row[0] ?? row.terlambat ?? 0) || 0
    const pc = Number(row[1] ?? row.pulang_cepat ?? 0) || 0
    const tk = Number(row[2] ?? row.tk ?? 0) || 0
    const menit = tl + pc
    const konv = menit / 450
    const jml = konv + tk
    tabel.push({
      bulan: BULAN[b - 1], no: b, terlambat: tl, pulang_cepat: pc, menit, konversi: konv,
      tk, jumlah: jml, tdk_hadir: jml / 46 * 100, hadir: 100 - jml / 46 * 100,
    })
    sl += tl
    sp += pc
    st += tk
  }
  const menit = sl + sp
  const jml = menit / 450 + st
  return {
    tabel, terlambat: sl, pulang_cepat: sp, menit, konversi: menit / 450, tk: st, jumlah: jml,
    persen_hadir: Math.max(0, 100 - jml / 46 * 100),
  }
}

export function faktorHadir(tkHari) {
  return Math.max(0, 100 - (Number(tkHari) / 46) * 100)
}

export function rolesGuru(g) {
  const out = [{ key: g.instrumen || 'GMP', utama: true }]
  const seen = {}
  for (const t of [g.tugas1, g.tugas2, g.tugas3]) {
    const r = tugasRole(t)
    if (r && !seen[r]) {
      seen[r] = true
      out.push({ key: r, utama: false, tugas: t })
    }
  }
  return out.map((o) => ({ ...o, label: ROLE_LABEL[o.key] || o.key }))
}

export function jamTotal(g) {
  let tambahan = 0
  for (const t of [g.tugas1, g.tugas2, g.tugas3]) {
    if (t && t !== '-') tambahan += JAM_TUGAS[t] || 0
  }
  const jt = (Number(g.jam_mengajar) || 0) + (Number(g.jam_lembaga_lain) || 0) + tambahan
  return [jt, tambahan]
}

export function hitungGuru(g, scoresByRole, hadirRows) {
  const roles = rolesGuru(g)
  const hasil = {}
  for (const r of roles) {
    const h = hitungRole(r.key, scoresByRole?.[r.key] || {})
    h.utama = r.utama
    h.tugas = r.tugas || null
    hasil[r.key] = h
  }
  const kh = hitungHadir(hadirRows)
  const fh = faktorHadir(kh.tk)
  const utama = hasil[roles[0].key]
  const nilaiAkhir = utama.nilai100 * fh / 100
  utama.nilai_akhir = nilaiAkhir
  utama.sebutan = sebutan(nilaiAkhir)
  const np = npk(nilaiAkhir)
  utama.npk = np[0]
  utama.npk_f = np[1]
  hasil[roles[0].key] = utama

  for (const k of Object.keys(hasil)) {
    const h = hasil[k]
    if (h.utama) continue
    h.nilai_akhir = h.nilai100
    h.sebutan = sebutan(h.nilai100)
    const n2 = npk(h.nilai100)
    h.npk = n2[0]
    h.npk_f = n2[1]
    hasil[k] = h
  }

  const gol = g.pangkat || ''
  const akk = AK_MIN[gol] ?? 0
  const diri = AK_DIRI[gol] ?? 0
  const pub = AK_PUB[gol] ?? 0
  const penj = AK_PENUNJANG[gol] ?? 0
  const dasar = akk - (diri + pub) - penj
  const akUtama = utama.nilai_akhir ? (dasar * utama.npk_f / 4) : 0
  const tambah = []
  for (const h of Object.values(hasil)) {
    if (h.utama || !h.nilai100) continue
    tambah.push({
      role: h.role, label: h.label,
      ak_utama_50: 0.5 * akUtama,
      ak_tugas: dasar * h.npk_f / 4 * 0.5,
    })
  }
  const jumlahAk = tambah.length
    ? (0.5 * akUtama * tambah.length + tambah.reduce((s, t) => s + t.ak_tugas, 0))
    : akUtama
  const idx = GOL.indexOf(gol)
  let golLanjut = ''
  if (idx >= 0 && idx < GOL.length - 1) {
    const parts = GOL[idx + 1].split(', ')
    golLanjut = parts[parts.length - 1] || ''
  }
  const [jt, jtt] = jamTotal(g)
  return {
    roles, hasil, utama: hasil[roles[0].key], hadir: kh, faktor_hadir: fh,
    ak: {
      golongan: gol, akk, diri, publikasi: pub, penunjang: penj, dasar,
      ak_utama: akUtama, tambahan: tambah, jumlah: jumlahAk, gol_lanjut: golLanjut,
    },
    jam_total: jt, jam_tambahan: jtt,
    masa_kerja: masaKerja(g.tmt_guru, g.tgl_penilaian),
  }
}

export function prioritasPkb(h, maks = 5) {
  const items = []
  for (const c of h.comps || []) {
    c.vals.forEach((v, i) => {
      if (v !== null && v < 2) items.push([v, c.k, i, c.indikator[i], c.judul])
    })
  }
  items.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  const map = PKB_MAP.GMP || []
  return items.slice(0, maks).map((it, n) => {
    const m = map[n % Math.max(1, map.length)] || { unsur: '', jenis: '' }
    const teks = it[3] || ''
    const teks2 = teks ? teks.charAt(0).toLocaleLowerCase('id-ID') + teks.slice(1) : ''
    return {
      no: n + 1, kompetensi: it[4], indikator: teks, skor: it[0],
      unsur: m.unsur || '', jenis: m.jenis || '',
      kegiatan: `${m.jenis || ''} tentang ${teks2}`.trim(),
    }
  })
}

export function hitungPkkmBagian(secs, scores) {
  const out = []
  for (const s of secs) {
    let tot = 0
    let ter = 0
    let app = 0
    let nAll = 0
    const unsurOut = []
    s.unsur.forEach((un, u) => {
      let ut = 0
      let ua = 0
      un.indikator.forEach((ind, i) => {
        nAll++
        const v = pkkmScoreGet(scores, s.kode, u, i)
        if (v !== null) ter++
        if (v === 0 && ind.opsional) return
        app++
        ut += v ?? 0
        ua++
      })
      unsurOut.push({
        no: un.no, judul: un.judul, total: ut,
        nilai: ua ? (ut / (4 * ua) * 100) : 0,
      })
      tot += ut
    })
    out.push({
      kode: s.kode, judul: s.judul, total: tot, maks: 4 * app,
      terisi: ter, n: nAll, nilai: app ? (tot / (4 * app) * 100) : 0, unsur: unsurOut,
    })
  }
  return out
}

export function pkkmSecs(tahun) {
  const secs = [...(PKKM.tahun1_3 || [])]
  if (Number(tahun) === 4) secs.push(...(PKKM.tahun4_tambahan || []))
  return secs
}

export function rekapPkkmTahun(tahun, scoresByPenilai) {
  const secs = PKKM.tahun1_3 || []
  const p = {
    1: hitungPkkmBagian(secs, scoresByPenilai?.[1] || {}),
    2: hitungPkkmBagian(secs, scoresByPenilai?.[2] || {}),
  }
  const baris = secs.map((s, idx) => {
    const a = p[1][idx].nilai
    const b = p[2][idx].nilai
    const ada = []
    if (p[1][idx].terisi) ada.push(a)
    if (p[2][idx].terisi) ada.push(b)
    return {
      kode: s.kode, judul: s.judul, p1: a, p2: b,
      rerata: ada.length ? ada.reduce((x, y) => x + y, 0) / ada.length : 0,
    }
  })
  const avg = (key) => (baris.length ? baris.reduce((s, r) => s + r[key], 0) / baris.length : 0)
  let extra = null
  if (Number(tahun) === 4 && PKKM.tahun4_tambahan?.length) {
    const e = PKKM.tahun4_tambahan
    const ev = {
      1: hitungPkkmBagian(e, scoresByPenilai?.[1] || {})[0],
      2: hitungPkkmBagian(e, scoresByPenilai?.[2] || {})[0],
    }
    const ada = []
    if (ev[1]?.terisi) ada.push(ev[1].nilai)
    if (ev[2]?.terisi) ada.push(ev[2].nilai)
    extra = {
      judul: e[0].judul,
      p1: ev[1]?.nilai || 0,
      p2: ev[2]?.nilai || 0,
      rerata: ada.length ? ada.reduce((x, y) => x + y, 0) / ada.length : 0,
    }
  }
  const jr = avg('rerata')
  return {
    tahun: Number(tahun),
    baris,
    p1: avg('p1'),
    p2: avg('p2'),
    rerata: jr,
    predikat: sebutan(jr),
    extra,
    detail: p,
    terisi: {
      1: p[1].reduce((s, x) => s + x.terisi, 0),
      2: p[2].reduce((s, x) => s + x.terisi, 0),
    },
  }
}

export function scoresByRole(rows) {
  const out = {}
  for (const r of rows || []) {
    if (!out[r.role]) out[r.role] = {}
    out[r.role][`${r.k},${r.i}`] = r.skor
  }
  return out
}

export function hadirMap(rows) {
  const out = {}
  for (const r of rows || []) {
    out[r.bulan] = [Number(r.terlambat) || 0, Number(r.pulang_cepat) || 0, Number(r.tk) || 0]
  }
  return out
}

export function pkkmByPenilai(rows) {
  const out = { 1: {}, 2: {} }
  for (const r of rows || []) {
    const pn = Number(r.penilai)
    if (!out[pn]) out[pn] = {}
    out[pn][`${r.sec},${r.u},${r.i}`] = r.skor
  }
  return out
}

export function formGuru(f) {
  const d = {}
  for (const k of GURU_FIELDS) d[k] = String(f?.[k] ?? '').trim()
  for (const k of ['jam_mengajar', 'jam_lembaga_lain']) {
    d[k] = Math.max(0, Math.min(80, Math.round(Number(d[k] || 0))))
  }
  if (!TAHAP.includes(d.tahap)) d.tahap = 'Formatif'
  if (!UTAMA.includes(d.instrumen)) d.instrumen = instrumenDefault(d.jenis_guru, d.mapel)
  if (!d.tugas1) d.tugas1 = '-'
  if (!d.tugas2) d.tugas2 = '-'
  if (!d.tugas3) d.tugas3 = '-'
  if (!STATUS.includes(d.status)) d.status = 'GTY'
  return d
}

export function blankGuru() {
  return {
    ...formGuru({}),
    jk: '',
    jenis_guru: '',
    instrumen: 'GMP',
    status: 'GTY',
    tahap: 'Formatif',
  }
}

export function validTahun(ta) {
  return /^\d{4}\/\d{4}$/.test(ta) && Number(ta.slice(5)) === Number(ta.slice(0, 4)) + 1
}

export function tugasTeks(g) {
  const list = [g.tugas1, g.tugas2, g.tugas3].filter((t) => t && t !== '-')
  return list.length ? list.join(', ') : '-'
}

export function pkbFinal(rows, hasil) {
  const saved = (rows || [])
    .slice()
    .sort((a, b) => a.no - b.no)
    .filter((x) => x.kegiatan || x.indikator)
    .map((x) => ({
      no: x.no, indikator: x.indikator || '', skor: null,
      unsur: x.unsur || '', jenis: x.jenis || '', kegiatan: x.kegiatan || '',
    }))
  if (saved.length) return { items: saved, manual: true }
  return { items: prioritasPkb(hasil.utama), manual: false }
}

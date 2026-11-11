import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { mapSettings, selectAll, selectIn } from '@/lib/db'
import {
  blankGuru,
  formGuru,
  hadirMap,
  hitungGuru,
  pkbFinal,
  pkkmByPenilai,
  rekapPkkmTahun,
  scoresByRole,
  validTahun,
} from '@/lib/engine'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_EMAIL = 'admin@pkkm.app'

function group(rows, key) {
  const out = {}
  for (const r of rows || []) {
    const id = r[key]
    if (!out[id]) out[id] = []
    out[id].push(r)
  }
  return out
}

export const useSimad = defineStore('simad', {
  state: () => ({
    booted: false,
    loading: false,
    user: null,
    profile: null,
    settings: {},
    tahun: [],
    guru: [],
    nilai: [],
    hadir: [],
    pkb: [],
    pkkm: [],
    flash: null,
    dbError: '',
  }),
  getters: {
    S: (s) => s.settings,
    tahunAktif(s) {
      return s.tahun.find((t) => t.is_aktif) || s.tahun[0] || null
    },
    items(s) {
      const nilaiBy = group(s.nilai, 'guru_id')
      const hadirBy = group(s.hadir, 'guru_id')
      return s.guru.map((g) => ({
        guru: g,
        hasil: hitungGuru(g, scoresByRole(nilaiBy[g.id] || []), hadirMap(hadirBy[g.id] || [])),
      }))
    },
    opsiPenilai(s) {
      const out = []
      const seen = new Set()
      if (s.settings.kepala_nama) {
        const key = s.settings.kepala_nama.trim().toLowerCase()
        out.push({
          nama: s.settings.kepala_nama,
          nip: s.settings.kepala_nip || '',
          pangkat: s.settings.kepala_pangkat || '',
          ket: 'Kepala Madrasah',
        })
        seen.add(key)
      }
      for (const g of s.guru) {
        const nama = String(g.nama || '').trim()
        if (!nama) continue
        const key = nama.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        const tugas = [g.tugas1, g.tugas2, g.tugas3]
        out.push({
          nama,
          nip: g.nip || '',
          pangkat: g.pangkat || '',
          ket: tugas.includes('Kepala Madrasah') ? 'Kepala Madrasah' : 'Guru',
        })
      }
      return out
    },
  },
  actions: {
    setFlash(type, text) {
      this.flash = text ? { type, text } : null
    },
    guruById(id) {
      return this.guru.find((g) => Number(g.id) === Number(id)) || null
    },
    hasilGuru(id) {
      return this.items.find((it) => Number(it.guru.id) === Number(id)) || null
    },
    pkbGuru(id) {
      const item = this.hasilGuru(id)
      if (!item) return { items: [], manual: false }
      const rows = this.pkb.filter((r) => Number(r.guru_id) === Number(id))
      return pkbFinal(rows, item.hasil)
    },
    rekapPkkm(tahun) {
      const rows = this.pkkm.filter((r) => Number(r.tahun) === Number(tahun))
      return rekapPkkmTahun(tahun, pkkmByPenilai(rows))
    },
    async boot() {
      if (this.booted) return
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user ?? null
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null
      })
      if (this.user) await this.loadAll()
      this.booted = true
    },
    async login(username, password) {
      const name = String(username || '').trim()
      const sandi = String(password || '')
      const isAdmin = name.toLowerCase() === ADMIN_USERNAME
      if (isAdmin && sandi !== ADMIN_PASSWORD) {
        throw new Error('Nama pengguna atau kata sandi salah.')
      }
      const email = isAdmin ? ADMIN_EMAIL : name
      let result = await supabase.auth.signInWithPassword({ email, password: sandi })
      if (result.error && isAdmin) {
        const made = await supabase.auth.signUp({
          email,
          password: sandi,
          options: { data: { nama: 'Administrator' } },
        })
        if (made.data?.session) {
          result = made
        } else if (made.error && /rate limit/i.test(made.error.message)) {
          throw new Error('Terlalu banyak percobaan. Tunggu sebentar, lalu masuk lagi dengan admin / admin123.')
        } else {
          result = await supabase.auth.signInWithPassword({ email, password: sandi })
          if (result.error) {
            throw new Error('Akun admin belum bisa masuk. Di Supabase buka Authentication, Providers, Email, lalu matikan Confirm email. Setelah itu masuk lagi dengan admin / admin123.')
          }
        }
      } else if (result.error) {
        throw new Error('Nama pengguna atau kata sandi salah.')
      }
      this.user = result.data.user
      await this.loadAll()
    },
    async daftar(email, password, nama) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nama } },
      })
      if (error) throw error
      if (!data.session) {
        return { perluKonfirmasi: true }
      }
      this.user = data.user
      await this.loadAll()
      return { perluKonfirmasi: false }
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      this.guru = []
      this.nilai = []
      this.hadir = []
      this.pkb = []
      this.pkkm = []
    },
    async loadAll() {
      this.loading = true
      this.dbError = ''
      try {
        const [settings, tahun, profileRes] = await Promise.all([
          selectAll('settings'),
          selectAll('tahun_ajaran'),
          supabase.from('profiles').select('*').eq('id', this.user.id).maybeSingle(),
        ])
        this.settings = mapSettings(settings)
        this.tahun = tahun.sort((a, b) => String(b.nama).localeCompare(String(a.nama)) || String(a.semester).localeCompare(String(b.semester)))
        if (profileRes.error) throw profileRes.error
        this.profile = profileRes.data
        if (!this.profile) {
          const nama = this.user.user_metadata?.nama || this.user.email || 'Administrator'
          const made = await supabase.from('profiles').insert({ id: this.user.id, nama }).select().single()
          if (!made.error) this.profile = made.data
        }
        await this.loadTahunData()
      } catch (e) {
        this.dbError = e.message || String(e)
      } finally {
        this.loading = false
      }
    },
    async loadTahunData() {
      const id = this.tahunAktif?.id
      if (!id) {
        this.guru = []
        this.nilai = []
        this.hadir = []
        this.pkb = []
      } else {
        this.guru = await selectAll('guru', (q) => q.eq('tahun_ajaran_id', id).order('nama'))
        const ids = this.guru.map((g) => g.id)
        this.nilai = await selectIn('pkg_nilai', 'guru_id', ids)
        this.hadir = await selectIn('pkg_hadir', 'guru_id', ids)
        this.pkb = await selectIn('pkb', 'guru_id', ids)
      }
      this.pkkm = await selectAll('pkkm_nilai')
    },
    async saveSettings(patch) {
      const rows = Object.entries(patch).map(([setting_key, value]) => ({
        setting_key,
        value: value == null ? '' : String(value),
      }))
      const { error } = await supabase.from('settings').upsert(rows)
      if (error) throw error
      this.settings = { ...this.settings, ...Object.fromEntries(rows.map((r) => [r.setting_key, r.value])) }
    },
    async setTahunAktif(id) {
      const row = this.tahun.find((t) => Number(t.id) === Number(id))
      if (!row) return
      const off = await supabase.from('tahun_ajaran').update({ is_aktif: false }).neq('id', row.id)
      if (off.error) throw off.error
      const on = await supabase.from('tahun_ajaran').update({ is_aktif: true }).eq('id', row.id)
      if (on.error) throw on.error
      await this.saveSettings({ tahun_ajaran: row.nama, semester: row.semester })
      await this.loadAll()
      this.setFlash('ok', `Tahun ajaran ${row.nama} (${row.semester}) aktif.`)
    },
    async tambahTahun(nama, semester) {
      nama = String(nama || '').trim()
      semester = semester === 'Genap' ? 'Genap' : 'Ganjil'
      if (!validTahun(nama)) throw new Error('Format tahun ajaran harus seperti 2026/2027.')
      if (this.tahun.some((t) => t.nama === nama && t.semester === semester)) {
        throw new Error(`Tahun ajaran ${nama} (${semester}) sudah ada.`)
      }
      const lama = this.guru.map((g) => ({ ...g }))
      const off = await supabase.from('tahun_ajaran').update({ is_aktif: false }).gte('id', 0)
      if (off.error) throw off.error
      const ins = await supabase.from('tahun_ajaran').insert({ nama, semester, is_aktif: true }).select().single()
      if (ins.error) throw ins.error
      if (lama.length) {
        const copy = lama.map((g) => {
          const { id, ...rest } = g
          return { ...rest, tahun_ajaran_id: ins.data.id, created_at: new Date().toISOString() }
        })
        const g = await supabase.from('guru').insert(copy)
        if (g.error) throw g.error
      }
      await this.saveSettings({ tahun_ajaran: nama, semester })
      await this.loadAll()
      this.setFlash('ok', `Tahun ajaran ${nama} (${semester}) ditambahkan. Nilai PKG dikosongkan.`)
    },
    async saveGuru(payload, id) {
      if (!this.tahunAktif) throw new Error('Belum ada tahun ajaran aktif.')
      const row = formGuru(payload)
      row.tahun_ajaran_id = this.tahunAktif.id
      if (id) {
        const { error } = await supabase.from('guru').update(row).eq('id', id)
        if (error) throw error
      } else {
        row.created_at = new Date().toISOString()
        const { error } = await supabase.from('guru').insert(row)
        if (error) throw error
      }
      await this.loadTahunData()
    },
    async importGuru(list) {
      if (!this.tahunAktif) throw new Error('Belum ada tahun ajaran aktif.')
      const rows = list.map((f) => ({
        ...formGuru(f),
        tahun_ajaran_id: this.tahunAktif.id,
        created_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('guru').insert(rows)
      if (error) throw error
      await this.loadTahunData()
    },
    async deleteGuru(ids) {
      const list = (Array.isArray(ids) ? ids : [ids]).map(Number)
      const { error } = await supabase.from('guru').delete().in('id', list)
      if (error) throw error
      await this.loadTahunData()
    },
    async saveNilai(guruId, role, pairs) {
      const del = await supabase.from('pkg_nilai').delete().eq('guru_id', guruId).eq('role', role)
      if (del.error) throw del.error
      if (pairs.length) {
        const rows = pairs.map(([k, i, skor]) => ({ guru_id: guruId, role, k, i, skor }))
        const ins = await supabase.from('pkg_nilai').insert(rows)
        if (ins.error) throw ins.error
      }
      await this.loadTahunData()
    },
    async salinNilai(srcId, role, targetIds) {
      const src = this.nilai.filter((r) => Number(r.guru_id) === Number(srcId) && r.role === role)
      if (!src.length) throw new Error('Sumber belum memiliki skor pada instrumen ini.')
      for (const id of targetIds) {
        const del = await supabase.from('pkg_nilai').delete().eq('guru_id', id).eq('role', role)
        if (del.error) throw del.error
        const rows = src.map((r) => ({ guru_id: id, role, k: r.k, i: r.i, skor: r.skor }))
        const ins = await supabase.from('pkg_nilai').insert(rows)
        if (ins.error) throw ins.error
      }
      await this.loadTahunData()
    },
    async saveHadir(guruId, rows) {
      const payload = rows.map((r) => ({
        guru_id: guruId,
        bulan: r.bulan,
        terlambat: Number(r.terlambat) || 0,
        pulang_cepat: Number(r.pulang_cepat) || 0,
        tk: Number(r.tk) || 0,
      }))
      const { error } = await supabase.from('pkg_hadir').upsert(payload)
      if (error) throw error
      await this.loadTahunData()
    },
    async savePkb(guruId, items) {
      const del = await supabase.from('pkb').delete().eq('guru_id', guruId)
      if (del.error) throw del.error
      const rows = items
        .map((x, idx) => ({
          guru_id: guruId,
          no: idx + 1,
          indikator: x.indikator || '',
          unsur: x.unsur || '',
          jenis: x.jenis || '',
          kegiatan: x.kegiatan || '',
        }))
        .filter((x) => x.indikator || x.kegiatan)
      if (rows.length) {
        const ins = await supabase.from('pkb').insert(rows)
        if (ins.error) throw ins.error
      }
      await this.loadTahunData()
    },
    async savePkkm(tahun, penilai, pairs) {
      const del = await supabase.from('pkkm_nilai').delete().eq('tahun', tahun).eq('penilai', penilai)
      if (del.error) throw del.error
      if (pairs.length) {
        const rows = pairs.map(([sec, u, i, skor]) => ({ tahun, penilai, sec, u, i, skor }))
        const ins = await supabase.from('pkkm_nilai').insert(rows)
        if (ins.error) throw ins.error
      }
      this.pkkm = await selectAll('pkkm_nilai')
    },
    async ubahSandi(password) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    },
    async ubahProfilAkun(nama) {
      const { error } = await supabase.from('profiles').update({ nama }).eq('id', this.user.id)
      if (error) throw error
      this.profile = { ...(this.profile || {}), nama }
    },
    async exportSemua() {
      const [settings, tahun, guru, nilai, hadir, pkb, pkkm] = await Promise.all([
        selectAll('settings'),
        selectAll('tahun_ajaran'),
        selectAll('guru'),
        selectAll('pkg_nilai'),
        selectAll('pkg_hadir'),
        selectAll('pkb'),
        selectAll('pkkm_nilai'),
      ])
      return {
        versi: 1,
        diekspor: new Date().toISOString(),
        settings: mapSettings(settings),
        tahun_ajaran: tahun,
        guru,
        pkg_nilai: nilai,
        pkg_hadir: hadir,
        pkb,
        pkkm_nilai: pkkm,
      }
    },
    async pulihkan(data) {
      if (!data || data.versi !== 1) throw new Error('Berkas cadangan tidak dikenali.')
      const wipes = [
        ['pkg_nilai', 'guru_id'],
        ['pkg_hadir', 'guru_id'],
        ['pkb', 'guru_id'],
        ['pkkm_nilai', 'tahun'],
        ['guru', 'id'],
        ['tahun_ajaran', 'id'],
      ]
      for (const [table, column] of wipes) {
        const res = await supabase.from(table).delete().gte(column, 0)
        if (res.error) throw res.error
      }
      const settings = Object.entries(data.settings || {}).map(([setting_key, value]) => ({
        setting_key,
        value: value == null ? '' : String(value),
      }))
      if (settings.length) {
        const s = await supabase.from('settings').upsert(settings)
        if (s.error) throw s.error
      }
      if (data.tahun_ajaran?.length) {
        const rows = data.tahun_ajaran.map((t) => ({
          id: t.id, nama: t.nama, semester: t.semester, is_aktif: !!t.is_aktif, created_at: t.created_at,
        }))
        const ins = await supabase.from('tahun_ajaran').insert(rows)
        if (ins.error) throw ins.error
      }
      if (data.guru?.length) {
        const ins = await supabase.from('guru').insert(data.guru)
        if (ins.error) throw ins.error
      }
      for (const [table, rows] of [['pkg_nilai', data.pkg_nilai], ['pkg_hadir', data.pkg_hadir], ['pkb', data.pkb], ['pkkm_nilai', data.pkkm_nilai]]) {
        if (rows?.length) {
          const ins = await supabase.from(table).insert(rows)
          if (ins.error) throw ins.error
        }
      }
      await supabase.rpc('resync_ids')
      await this.loadAll()
    },
    blankGuru,
  },
})

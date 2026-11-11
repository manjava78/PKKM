<template>
  <div class="login">
    <div class="box" style="max-width:560px">
      <h1>Sambungkan Supabase</h1>
      <p class="s">Project PKKM memakai Vue.js di komputer ini dan database Supabase di awan.</p>
      <ol style="padding-left:18px;line-height:1.6;color:#334155">
        <li>Buat project di <a class="link" href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>.</li>
        <li>Buka SQL Editor, tempel isi berkas <b>supabase/schema.sql</b>, lalu jalankan.</li>
        <li>Di Authentication, matikan konfirmasi email untuk percobaan, lalu buat pengguna (email + sandi).</li>
        <li>Salin Project URL dan anon key ke berkas <b>.env</b> (contoh ada di <b>.env.example</b>).</li>
        <li>Jalankan <b>npm install</b> lalu <b>npm run dev</b>, kemudian muat ulang halaman ini.</li>
      </ol>
    </div>
  </div>
</template>

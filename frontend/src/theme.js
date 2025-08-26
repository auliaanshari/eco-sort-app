// src/theme.js

import { createTheme } from '@mui/material/styles';

// Ini adalah tempat kita mendefinisikan palet warna kustom kita
const theme = createTheme({
  palette: {
    // Mode bisa 'light' atau 'dark'
    mode: 'light',

    // Warna utama aplikasi (misal: tombol, link, header)
    primary: {
      main: '#2E7D32', // Warna hijau yang natural dan sejuk
      light: '#4CAF50',
      dark: '#1B5E20',
    },

    // Warna sekunder untuk aksen atau tombol alternatif
    secondary: {
      main: '#0288D1', // Warna biru langit yang bersih
    },

    // Warna latar belakang halaman
    background: {
      default: '#E8F5E9', // Bukan putih bersih, tapi sedikit off-white agar lebih lembut di mata
      paper: '#FFFFFF', // Warna untuk komponen "kertas" seperti Card
    },
  },
  typography: {
    // Kita juga bisa mengatur jenis font di sini jika mau
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700, // Membuat judul lebih tebal
    },
  },
  shape: {
    // Membuat sudut komponen lebih tumpul (modern)
    borderRadius: 12,
  },
});

export default theme;

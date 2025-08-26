import { useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // MUI menyediakan ikon siap pakai

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [confidence, setConfidence] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult('');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Silakan pilih gambar terlebih dahulu!');
      return;
    }
    setIsLoading(true);
    setResult('');
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${API_URL}/api/classify`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Gagal mendapatkan respons dari server.'
        );
      }
      const data = await response.json();
      setResult(data.classification);
      setConfidence(data.confidence);
    } catch (err) {
      setError(
        'Gagal melakukan klasifikasi. Pastikan server backend sudah berjalan.'
      );
      console.error('Terjadi error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline /> {/* Mereset CSS default browser agar konsisten */}
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}
      >
        <Card sx={{ p: 4, width: '100%', borderRadius: 4, boxShadow: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ textAlign: 'center' }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Eco-Sort AI
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Unggah gambar sampah untuk klasifikasi
            </Typography>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'grey.400',
                borderRadius: 2,
                p: 3,
                mb: 3,
                bgcolor: 'grey.50',
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '200px', borderRadius: '8px' }}
                />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.500' }} />
              )}
            </Box>

            <Button
              variant="contained"
              component="label" // Membuat tombol ini berfungsi sebagai label untuk input file
              color="primary"
              fullWidth
            >
              Pilih Gambar
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
              />
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading || !file}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Klasifikasi Sekarang'
              )}
            </Button>

            {result && (
              <Alert
                severity="success"
                sx={{ mt: 3, justifyContent: 'center' }}
              >
                <Typography variant="h6">{result}</Typography>
                {confidence && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Tingkat Kepercayaan:{' '}
                    <strong>{(confidence * 100).toFixed(2)}%</strong>
                  </Typography>
                )}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default App;

# Tahap 1: Pilih base image Python yang ringan dan spesifik
FROM python:3.11-slim

# Tahap 2: Atur direktori kerja di dalam container
WORKDIR /app

# Tahap 3: Salin file requirements dan install semua library
# Ini dilakukan terpisah agar Docker bisa menggunakan cache jika library tidak berubah
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tahap 4: Salin sisa file proyekmu (kode, model, label)
COPY . .

# Tahap 5: Perintah untuk menjalankan aplikasi saat container启动
# Gunicorn akan berjalan di port 7860, port default untuk Hugging Face Spaces
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]
# 📖 Split Bill App - User Guide

## Pengenalan

**Split Bill App** membantu Anda membagi tagihan makanan online secara adil. Aplikasi ini menghitung berapa yang harus dibayar setiap orang dengan mempertimbangkan:
- Item yang mereka beli
- Diskon keseluruhan
- Service charge
- Pajak (tax)

## 🎮 Tutorial Dasar

### 1. Membuka Aplikasi

Jalankan aplikasi dengan:
```bash
npm run dev
```

Akses di browser: `http://localhost:5173`

### 2. Menambah Peserta

**Langkah:**
1. Cari bagian "📋 Setup Your Bill" → "Add People"
2. Ketik nama peserta di kolom "Person name"
3. Tekan Enter atau klik tombol "Add Person"
4. Peserta akan muncul sebagai tag berwarna biru

**Contoh:**
```
Alice
Bob
Charlie
```

### 3. Menambah Item/Pesanan

**Langkah:**
1. Scroll ke bawah ke section "🍽️ Items"
2. Klik tombol "Add Item" (biru)
3. Isi form:
   - **Item name**: "Nasi Goreng Spesial"
   - **Price (Rp)**: 50000
   - **Quantity**: 2
   - **Assigned Person**: Pilih "Alice"
4. Klik "Add Item"

**Tips:**
- Total sudah dihitung otomatis di bagian bawah form
- Quantity bisa lebih dari 1 untuk item yang sama
- Assigned Person wajib dipilih

### 4. Mengedit Item

**Langkah:**
1. Di tabel items, cari item yang ingin diedit
2. Klik ikon pensil (Edit) di kolom Actions
3. Modal akan terbuka dengan data item yang sudah terisi
4. Ubah data yang diperlukan
5. Klik "Update Item"

### 5. Menghapus Item

**Langkah:**
1. Di tabel items, cari item yang ingin dihapus
2. Klik ikon tempat sampah (Delete) di kolom Actions
3. Item akan langsung dihapus

### 6. Mengatur Diskon, Service Charge, dan Pajak

**Langkah:**
1. Scroll ke bagian "⚙️ Discount & Additional Charges"
2. Masukkan nominal (bukan persen):
   - **Discount (Rp)**: Contoh: 20000 (diskon Rp 20 ribu)
   - **Service Charge (Rp)**: Contoh: 10000 (service charge Rp 10 ribu)
   - **Tax (Rp)**: Contoh: 5000 (pajak Rp 5 ribu)
3. Nilai akan langsung diterapkan ke perhitungan

**Contoh Input:**
```
Subtotal: Rp 100,000
Discount: Rp 10,000
Service Charge: Rp 9,000
Tax: Rp 9,000
Grand Total: Rp 108,000
```

### 7. Melihat Hasil Split

**Di section "💰 Split Results":**
- **Grand Total Breakdown**: Perincian dari subtotal hingga grand total
- **Amount Each Person Should Pay**: Tabel yang menunjukkan berapa yang harus dibayar setiap orang

**Tabel menampilkan:**
- Person: Nama peserta
- Items: Total harga items mereka
- Discount: Diskon yang mereka terima (proporsional)
- Charges: Service charge + tax yang mereka bayar (proporsional)
- Amount to Pay: Total yang harus dibayar

**Contoh Hasil:**
```
Alice (Rp 50,000 items):
  Items Total: Rp 50,000
  Discount: -Rp 5,000
  Charges: Rp 9,000
  Amount to Pay: Rp 54,000

Bob (Rp 30,000 items):
  Items Total: Rp 30,000
  Discount: -Rp 3,000
  Charges: Rp 5,400
  Amount to Pay: Rp 32,400

Charlie (Rp 20,000 items):
  Items Total: Rp 20,000
  Discount: -Rp 2,000
  Charges: Rp 3,600
  Amount to Pay: Rp 21,600
```

### 8. Copy Hasil Split

**Langkah:**
1. Di section "💰 Split Results", klik tombol "Copy Results"
2. Hasil dalam format teks akan dicopy ke clipboard:
   ```
   Alice: Rp 54,000
   Bob: Rp 32,400
   Charlie: Rp 21,600
   ```
3. Paste ke chat/notes untuk dibagikan

## 💾 Import/Export JSON

### Kapan Menggunakan?

**Gunakan Import/Export jika:**
- Pesanan sudah terdata dalam format terstruktur
- Ingin share pesanan dengan orang lain
- Pesanan sangat banyak dan mau cepat

### Export (Simpan Pesanan)

**Langkah:**
1. Klik tombol "Import JSON" di section "Setup Your Bill"
2. Pilih tab "Export"
3. Klik "Copy Export"
4. Data akan dicopy dalam format JSON

**Contoh Output:**
```json
{
  "persons": [
    {"name": "Alice"},
    {"name": "Bob"}
  ],
  "items": [
    {
      "name": "Nasi Goreng",
      "price": 50000,
      "quantity": 1,
      "assignedPerson": "Alice"
    }
  ],
  "serviceCharge": 10000,
  "tax": 5000,
  "discount": 0
}
```

### Import (Load Pesanan)

**Langkah:**
1. Klik tombol "Import JSON"
2. Pilih tab "Import"
3. Paste JSON ke kolom text
4. Klik "Import Bill"

**Tips:**
- Jika error, pastikan format JSON benar
- Nama person di items harus sama dengan di persons
- Gunakan "Template Tab" untuk referensi

### Template

**Langkah:**
1. Klik tombol "Import JSON"
2. Pilih tab "Template"
3. Klik "Copy Template"
4. Modify template sesuai kebutuhan

**Template Standard:**
```json
{
  "persons": [
    {"name": "Alice"},
    {"name": "Bob"},
    {"name": "Charlie"}
  ],
  "items": [
    {
      "name": "Nasi Goreng Spesial",
      "price": 35000,
      "quantity": 1,
      "assignedPerson": "Alice"
    },
    {
      "name": "Mie Ayam",
      "price": 25000,
      "quantity": 2,
      "assignedPerson": "Bob"
    },
    {
      "name": "Es Cendol",
      "price": 8000,
      "quantity": 3,
      "assignedPerson": "Charlie"
    }
  ],
  "serviceCharge": 5000,
  "tax": 10000,
  "discount": 0
}
```

## 🔄 Mengubah Data

### Clear All (Hapus Semua)

**Langkah:**
1. Klik tombol "Clear All" di section "Setup Your Bill"
2. Konfirmasi dengan klik "Clear All" di dialog
3. Semua data akan dihapus dan starting fresh

**⚠️ Perhatian:** Aksi ini tidak bisa dibatalkan!

## 📱 Fitur di Mobile

Aplikasi fully responsive, artinya:
- ✅ Nyaman digunakan di smartphone
- ✅ Tombol-tombol cukup besar untuk diklik
- ✅ Layout otomatis menyesuaikan ukuran layar
- ✅ Input field mudah diisi

## ⚙️ Algoritma Split Bill

### Cara Distribusi

Aplikasi menggunakan **fair distribution system**:

1. **Hitung Subtotal**: Total semua items
   ```
   Subtotal = Rp 100,000
   ```

2. **Kurangi Diskon Global**: Diskon diterapkan ke total
   ```
   Subtotal After Discount = Rp 100,000 - Rp 10,000 = Rp 90,000
   ```

3. **Hitung Service Charge & Tax**: Dari subtotal after discount
   ```
   Service Charge = Rp 90,000 × 10% = Rp 9,000
   Tax = Rp 90,000 × 10% = Rp 9,000
   Grand Total = Rp 90,000 + Rp 9,000 + Rp 9,000 = Rp 108,000
   ```

4. **Distribusi Per Person**: Berdasarkan proporsi items
   ```
   Person A items: Rp 50,000 (50% dari total)
   Person A share of discount: Rp 10,000 × 50% = Rp 5,000
   Person A share of charges: (Rp 9,000 + Rp 9,000) × 50% = Rp 9,000
   Person A final amount: Rp 50,000 - Rp 5,000 + Rp 9,000 = Rp 54,000
   ```

### Kenapa Distribusi Seperti Ini?

- **Adil**: Setiap orang membayar sesuai dengan yang mereka beli
- **Proporsional**: Diskon dan charges dibagi sesuai proporsi items
- **Transparan**: Bisa lihat detail breakdown

## ❓ FAQ

### Q: Bagaimana jika ada item yang dibeli bersama?
A: Masukkan item tersebut ke salah satu person. Atau jika ingin dibagi, input sebagai item terpisah dengan quantity yang berbeda untuk person yang berbeda.

### Q: Nominal atau persen?
A: **Nominal (Rupiah)**, bukan persen. Contoh: ketik 10000 untuk diskon Rp 10 ribu.

### Q: Apakah data tersimpan otomatis?
A: Tidak, data hanya tersimpan di memory. Refresh halaman akan menghapus data. Gunakan Export JSON untuk menyimpan.

### Q: Bisa digunakan offline?
A: Ya, aplikasi bisa digunakan offline setelah loading pertama kali.

### Q: Bagaimana jika salah input?
A: Edit item dengan klik ikon pensil, atau hapus dan tambah ulang.

### Q: Format JSON tidak sesuai, apa yang salah?
A: Pastikan:
- Nama person di items cocok dengan persons list
- Semua field price, quantity, serviceCharge, tax adalah angka
- Tidak ada typo dalam JSON

## 🚀 Tips & Tricks

1. **Cepat Input**: Gunakan Import JSON jika pesanan sudah terdata
2. **Verifikasi**: Selalu check grand total di Split Results
3. **Share**: Copy hasil split ke chat untuk dibagikan
4. **Archive**: Export JSON untuk riwayat pesanan

## 🐛 Troubleshooting

### Item tidak muncul
- Pastikan sudah pilih Assigned Person
- Cek apakah button "Add Item" sudah diklik

### Hasil split tidak update
- Scroll ke bawah split results
- Coba refresh halaman (data akan hilang, use Export JSON dulu)

### Edit modal kosong
- Klik edit ulang, atau hapus dan tambah ulang

### Import JSON error
- Copy template dari "Template Tab"
- Paste dan modify sesuai data Anda
- Pastikan JSON syntax benar

---

**Semoga Split Bill App membantu Anda membagi tagihan dengan adil! 🎉**

Jika ada pertanyaan atau saran, silakan buat issue atau hubungi developer.

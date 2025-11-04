# 💰 Split Bill App

**Split Bill App** adalah aplikasi web modern untuk membagi tagihan secara adil ketika membeli makanan online bersama. Aplikasi ini dirancang untuk mendistribusikan biaya dan diskon secara proporsional kepada setiap orang.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-latest-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-latest-purple)

## 🎯 Fitur Utama

- ✅ **Input Pesanan Manual** - Tambahkan item, harga, jumlah, dan pilih siapa yang membayar
- ✅ **Import/Export JSON** - Cepat input data dengan format JSON untuk pesanan yang kompleks
- ✅ **Perhitungan Fair Split** - Distribusi biaya, diskon, service charge, dan tax secara proporsional
- ✅ **Kelola Pesanan** - Edit, hapus, dan kelola item dengan mudah
- ✅ **Diskon Global** - Terapkan diskon untuk seluruh tagihan
- ✅ **Service Charge & Tax** - Input nominal service charge dan pajak
- ✅ **Responsive Design** - Tampil sempurna di mobile, tablet, dan desktop
- ✅ **Material Design** - UI modern dengan Material-UI
- ✅ **State Management** - Redux Toolkit untuk state management yang reliable

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 16+ dan npm/yarn

### Installation

```bash
# Clone atau download repository
cd "Split Bill"

# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

Development server akan berjalan di `http://localhost:5173`

## 📖 Cara Menggunakan

### 1. Tambah Peserta (People)
- Masukkan nama peserta di field "Person name"
- Klik tombol "Add Person" atau tekan Enter
- Peserta akan ditampilkan sebagai tag di bawahnya

### 2. Tambah Item/Pesanan
- Klik tombol "Add Item"
- Isi detail item:
  - **Item name**: Nama makanan/minuman
  - **Price (Rp)**: Harga satuan
  - **Quantity**: Jumlah item
  - **Assigned Person**: Pilih siapa yang membeli
- Klik "Add Item" untuk menyimpan

### 3. Atur Diskon, Service Charge & Tax
- Scroll ke bawah section Items
- Masukkan nominal (bukan persen):
  - **Discount (Rp)**: Diskon keseluruhan
  - **Service Charge (Rp)**: Biaya pelayanan
  - **Tax (Rp)**: Pajak

### 4. Lihat Hasil Split
- Section "Split Results" akan menampilkan:
  - Grand Total breakdown
  - Jumlah yang harus dibayar setiap orang
  - Detail per person (items, discount, charges)

### 5. Import/Export JSON
- Klik tombol "Import JSON" untuk membuka dialog
- **Export Tab**: Copy data pesanan ke clipboard dalam format JSON
- **Import Tab**: Paste JSON yang sudah disediakan untuk quick input
- **Template Tab**: Lihat contoh format JSON yang benar

## 📋 Format JSON

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
    }
  ],
  "serviceCharge": 5000,
  "tax": 10000,
  "discount": 20000
}
```

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Styling**: Material-UI + Emotion

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Layout.tsx       # Main layout
│   ├── InputSection.tsx # Add people section
│   ├── ItemsList.tsx    # Items management
│   ├── AddItemDialog.tsx# Add/Edit item modal
│   ├── SplitResultSection.tsx # Results display
│   └── JsonImportDialog.tsx # JSON import/export
├── store/               # Redux store
│   ├── index.ts        # Store configuration
│   └── billSlice.ts    # Bill reducer & actions
├── types/               # TypeScript types
│   └── index.ts        # Type definitions
├── utils/               # Utility functions
│   ├── helpers.ts      # Helper functions
│   └── hooks.ts        # Custom Redux hooks
├── App.tsx             # App component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 💡 Cara Kerja Split Bill

Aplikasi ini menggunakan algoritma fair distribution:

1. **Subtotal**: Jumlah total semua items
2. **Discount**: Diskon global dikurangi dari subtotal
3. **Subtotal After Discount**: Subtotal - Discount
4. **Service Charge & Tax**: Dihitung dari subtotal after discount
5. **Per Person Amount**: Setiap orang membayar berdasarkan proporsi items mereka + share dari diskon, service charge, dan tax

Contoh:
```
Items:
- Alice: Rp 50,000 (Nasi Goreng)
- Bob: Rp 30,000 (Mie Ayam)
- Charlie: Rp 20,000 (Es Cendol)

Subtotal: Rp 100,000
Discount: Rp 10,000 (subtotal after = Rp 90,000)
Service Charge: Rp 9,000
Tax: Rp 9,000
Grand Total: Rp 108,000

Distribusi:
- Alice: Rp 50,000 × (90,000/100,000) + (50% × Rp 18,000) = Rp 45,000 + Rp 9,000 = Rp 54,000
- Bob: Rp 30,000 × (90,000/100,000) + (30% × Rp 18,000) = Rp 27,000 + Rp 5,400 = Rp 32,400
- Charlie: Rp 20,000 × (90,000/100,000) + (20% × Rp 18,000) = Rp 18,000 + Rp 3,600 = Rp 21,600
```

## 🎨 Responsive Design

Aplikasi ini fully responsive:
- **Mobile (320px+)**: Optimal untuk smartphone
- **Tablet (600px+)**: Layout yang nyaman untuk tablet
- **Desktop (900px+)**: Full-featured interface

## 🐛 Troubleshooting

### Edit modal tidak menampilkan detail
- Pastikan item yang diedit sudah dipilih dengan benar
- Coba refresh halaman jika masalah persisten

### Import JSON gagal
- Pastikan format JSON sesuai dengan template
- Nama person di items harus match dengan list persons
- Gunakan "Template Tab" untuk referensi format yang benar

## 📝 Catatan

- Semua nominal dalam **Rupiah (Rp)**
- Diskon, service charge, dan tax adalah **nominal bukan persen**
- Data hanya tersimpan di memory, akan hilang saat refresh (bisa ditambahkan localStorage di masa depan)

## 🔮 Fitur yang Bisa Ditambahkan

- [ ] LocalStorage untuk persist data
- [ ] Export ke PDF/Excel
- [ ] Payment history
- [ ] Multiple bills/sessions
- [ ] Split dengan weighted percentage
- [ ] QR code untuk share bill

## 📄 License

MIT

---

Built with ❤️ using React, TypeScript, and Material-UI

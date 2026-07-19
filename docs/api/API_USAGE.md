# 📖 API Usage Guide — Dramabox API

Panduan lengkap cara pakai semua endpoint Dramabox API, dari request paling simpel sampai yang butuh beberapa parameter. Semua endpoint bersifat `GET`, jadi bisa langsung dibuka lewat browser, `curl`, Postman, atau di-fetch dari aplikasi kamu.

> Developer: **Yun** — [t.me/q_sra](https://t.me/q_sra)

---

## 🔗 Base URL

```
http://localhost:3000        # saat development / lokal
https://domain-kamu.com      # saat sudah di-deploy
```

Semua contoh di bawah pakai `{baseUrl}` sebagai placeholder — ganti dengan URL server kamu.

---

## 📦 Format Response

Setiap response selalu JSON, dan selalu punya bentuk dasar yang sama:

**Response sukses:**
```json
{
  "developer": "t.me/q_sra - yun",
  "success": true,
  "data": { },
  "meta": {
    "timestamp": "2026-07-20T04:00:00.000Z"
  }
}
```

**Response sukses dengan pagination** (endpoint seperti `/api/search`, `/api/home`, `/api/category/:id`):
```json
{
  "developer": "t.me/q_sra - yun",
  "success": true,
  "data": [ ],
  "meta": {
    "timestamp": "2026-07-20T04:00:00.000Z",
    "pagination": {
      "page": 1,
      "size": 10,
      "hasMore": true
    }
  }
}
```

**Response gagal:**
```json
{
  "developer": "t.me/q_sra - yun",
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "keyword wajib diisi"
  },
  "meta": {
    "timestamp": "2026-07-20T04:00:00.000Z"
  }
}
```

**Cara paling aman baca response di kode kamu:** selalu cek `success` dulu sebelum ambil `data`.

```js
const res = await fetch(`${baseUrl}/api/home`);
const json = await res.json();

if (json.success) {
  console.log(json.data);
} else {
  console.error(json.error.message);
}
```

---

## 🌐 Parameter `lang` (Subtitle / Dubbing)

Hampir semua endpoint mendukung parameter query `lang` untuk menentukan bahasa konten (termasuk preferensi Subtitle/Dubbing yang tersedia dari sisi Dramabox).

| Value | Bahasa |
|-------|--------|
| `in` *(default)* | Indonesia |
| `en` | Inggris |

```
GET {baseUrl}/api/home?lang=in
GET {baseUrl}/api/search?keyword=boss&lang=en
```

Kalau parameter `lang` tidak dikirim, server otomatis pakai `in`.

---

## 📚 Daftar Endpoint

### 1. Cari Drama
```
GET /api/search
```
| Param | Wajib | Tipe | Default | Keterangan |
|-------|-------|------|---------|------------|
| `keyword` | ✅ | string | — | Kata kunci pencarian |
| `page` | ❌ | number | `1` | Halaman |
| `size` | ❌ | number | `20` | Jumlah hasil per halaman |
| `lang` | ❌ | string | `in` | Bahasa konten |

```
GET {baseUrl}/api/search?keyword=ceo&page=1&size=20
```

---

### 2. Drama Terbaru (Home)
```
GET /api/home
```
| Param | Wajib | Tipe | Default |
|-------|-------|------|---------|
| `page` | ❌ | number | `1` |
| `size` | ❌ | number | `10` |
| `lang` | ❌ | string | `in` |

```
GET {baseUrl}/api/home?page=1&size=10
```

---

### 3. VIP / Theater Channel
```
GET /api/vip
```
Tidak butuh parameter selain `lang` (opsional).

```
GET {baseUrl}/api/vip
```

---

### 4. Detail Drama
```
GET /api/detail/:bookId/v2
```
| Param | Wajib | Tipe | Keterangan |
|-------|-------|------|------------|
| `bookId` | ✅ | string/number | ID drama (path param) |
| `lang` | ❌ | string | Bahasa konten |

```
GET {baseUrl}/api/detail/41000122558/v2
```

---

### 5. Daftar Chapter/Episode
```
GET /api/chapters/:bookId
```
| Param | Wajib | Tipe |
|-------|-------|------|
| `bookId` | ✅ | string/number |
| `lang` | ❌ | string |

```
GET {baseUrl}/api/chapters/41000122558
```

---

### 6. Stream URL
```
GET /api/stream
```
| Param | Wajib | Tipe | Keterangan |
|-------|-------|------|------------|
| `bookId` | ✅ | string/number | ID drama |
| `episode` | ✅ | number | Nomor episode |
| `lang` | ❌ | string | Bahasa/dubbing |

```
GET {baseUrl}/api/stream?bookId=41000122558&episode=1
```
Mengembalikan link video (m3u8/mp4) — cocok dipakai langsung sebagai `src` di video player.

---

### 7. Download Semua Chapter (Batch)
```
GET /download/:bookId
```
| Param | Wajib | Tipe |
|-------|-------|------|
| `bookId` | ✅ | string/number |

```
GET {baseUrl}/download/41000122558
```

⚠️ **Operasi berat** — endpoint ini punya rate limit lebih ketat (`downloadLimiter`) dibanding endpoint lain karena harus menarik seluruh episode sekaligus. Jangan dipanggil berulang-ulang dalam waktu singkat.

---

### 8. Daftar Kategori
```
GET /api/categories
```
```
GET {baseUrl}/api/categories
```

---

### 9. Drama per Kategori
```
GET /api/category/:id
```
| Param | Wajib | Tipe | Default |
|-------|-------|------|---------|
| `id` | ✅ | number | — (path param, ID kategori) |
| `page` | ❌ | number | `1` |
| `size` | ❌ | number | `10` |
| `lang` | ❌ | string | `in` |

```
GET {baseUrl}/api/category/449?page=1&size=10
```

---

### 10. Rekomendasi
```
GET /api/recommend
```
```
GET {baseUrl}/api/recommend
```

---

## ⚠️ Error Code yang Umum Muncul

| Code | Arti | Kapan biasanya muncul |
|------|------|------------------------|
| `VALIDATION_ERROR` | Parameter wajib kosong/salah format | `keyword` kosong, `bookId` bukan angka, dll |
| `NOT_FOUND` | Endpoint atau path tidak ditemukan | Salah ketik URL |
| `REQUEST_TIMEOUT` | Request ke server sumber timeout | Koneksi lambat / server sumber lelet |
| `UPSTREAM_RATE_LIMIT` | Server sumber Dramabox lagi membatasi request | Terlalu banyak request beruntun |
| `INTERNAL_ERROR` | Error tak terduga di server | Cek log server jika sering muncul |

Semua error selalu punya `error.code` dan `error.message` — enak dipakai untuk `switch/case` di aplikasi kamu.

---

## 💡 Tips Pemakaian

- **Selalu cek `success` dulu** sebelum mengakses `data`, jangan asumsikan request selalu berhasil.
- **Gunakan `page` & `size`** pada endpoint yang mendukung pagination supaya response tidak kebesaran.
- **Jangan spam `/download/:bookId`** — endpoint ini paling berat, cukup panggil sekali per drama yang dibutuhkan.
- **Simpan `bookId`** dari hasil `/api/search` atau `/api/home`, karena hampir semua endpoint detail (`detail`, `chapters`, `stream`, `download`) butuh `bookId` ini.
- Untuk uji coba cepat tanpa nulis kode, buka halaman dokumentasi interaktif di `{baseUrl}/` — semua endpoint bisa langsung di-test dari sana (live request + hasil JSON langsung tampil).
- Ada juga Postman Collection siap-pakai: `docs/api/Dramabox-API.postman_collection.json`.

---

## 🧪 Contoh Alur Lengkap

Alur umum: cari drama → ambil detail → ambil daftar episode → ambil link stream episode 1.

```js
const baseUrl = "https://domain-kamu.com";

// 1. Cari drama
const search = await fetch(`${baseUrl}/api/search?keyword=ceo`).then(r => r.json());
const bookId = search.data[0].bookId;

// 2. Ambil detail
const detail = await fetch(`${baseUrl}/api/detail/${bookId}/v2`).then(r => r.json());

// 3. Ambil daftar chapter
const chapters = await fetch(`${baseUrl}/api/chapters/${bookId}`).then(r => r.json());

// 4. Ambil link stream episode 1
const stream = await fetch(`${baseUrl}/api/stream?bookId=${bookId}&episode=1`).then(r => r.json());

console.log(stream.data);
```

---

Ada pertanyaan atau nemu bug? Hubungi developer di [t.me/q_sra](https://t.me/q_sra).

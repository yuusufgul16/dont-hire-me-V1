# Netlify ile API Anahtarını Gizleme Rehberi

## 📁 Dosya Yapısı
```
dont-hire-me/
├── netlify/
│   └── functions/
│       └── gemini.js       ← Backend (API key burada)
├── netlify.toml            ← Netlify konfigürasyon
├── script.js              ← Frontend (API key YOK artık)
└── index.html
```

## 🚀 Deployment Adımları

### 1. GitHub'a Push
```bash
git add .
git commit -m "API key güvenliği: Netlify functions eklendi"
git push origin main
```

### 2. Netlify'da Proje Oluştur
1. [netlify.com](https://netlify.com) → Sign up/Login
2. "Add new site" → "Import an existing project"
3. GitHub repository seç: `dont-hire-me`
4. Deploy settings:
   - Build command: (boş bırak)
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. "Deploy" butonuna tıkla

### 3. Environment Variable Ekle (ÖNEMLİ!)
1. Netlify Dashboard → Site Settings → Environment Variables
2. "Add a variable" tıkla:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyAWQfplFA-iEqNIYOCdbdK06Rrm_XOEY-E`
3. "Create variable"
4. Site'ı yeniden deploy et: Deploys → Trigger deploy → Deploy site

---

## ✅ Test Et
Deploy tamamlandıktan sonra:
1. Site URL'ini aç: `https://senin-site.netlify.app`
2. Digital Twin'i aç
3. Bir soru sor

### Hata Alırsan:
- **Browser Console** (F12) kontrol et
- **Netlify Functions Logs** kontrol et (Netlify Dashboard → Functions → gemini → Logs)

---

## 🔒 Güvenlik İyileştirmeleri (Opsiyonel)

### A. Domain Kısıtlaması Ekle
`netlify/functions/gemini.js` içinde:
```javascript
// Sadece kendi domain'inden gelen istekleri kabul et
const allowedOrigins = ['https://yusufgul.netlify.app', 'http://localhost:3000'];
const origin = event.headers.origin;

if (!allowedOrigins.includes(origin)) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' })
  };
}
```

### B. Rate Limiting
Her kullanıcı başına max 10 istek/saat gibi limitler ekle.

---

## 💡 Nasıl Çalışıyor?

**Eski Yöntem (Güvensiz):**
```
Browser → [API KEY GÖRÜNÜR] → Gemini API
```

**Yeni Yöntem (Güvenli):**
```
Browser → Netlify Function → [API KEY GİZLİ] → Gemini API
```

API anahtarın artık **hiçbir zaman** kullanıcıya gözükmüyor! 🎉

# 🚫 BENİ İŞE ALMAYIN | Don't Hire Me

> Ters psikoloji ile tasarlanmış, interaktif ve sıra dışı bir kişisel tanıtım web sitesi.

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-red)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📖 Hakkında

Bu proje, geleneksel CV formatlarından sıkılan ve kendini farklı bir şekilde tanıtmak isteyen yazılımcılar için tasarlanmış interaktif bir web sitesidir. "Beni işe almayın" teması ile ters psikoloji kullanarak, ziyaretçilerin dikkatini çeker ve gerçek yetenekleri eğlenceli bir şekilde sunar.

## ✨ Özellikler

- � **Çoklu Dil Desteği (TR/EN)** - Tüm site ve Dijital İkiz artık her iki dilde de aktif.
- 🌓 **Tema Desteği** - Modern Dark ve Sleek Light mod seçeneği.
- 🤖 **Dijital İkiz (AI Chatbot)** - Google Gemini API ile desteklenen, Yusuf hakkında soruları yanıtlayan yapay zeka.
- �🎠 **Coverflow Kart Galerisi** - 3D perspektifli, çevrilebilir interaktif kartlar.
- 📄 **Sade CV Modu** - Hızlı ve okunabilir, tek sayfalık minimalist CV görünümü.
- ⚡ **Skeleton Loading** - İçerik yüklenirken modern ve akıcı bir kullanıcı deneyimi.
- 📱 **Tam Responsive** - Mobil, tablet ve masaüstü cihazlarla %100 uyumlu.
- 📊 **Google Analytics 4** - Detaylı etkinlik takibi ve kullanıcı analitiği.

## 🌐 Canlı Demo

👉 **[Live Demo](https://yuusufgul16.github.io/dont-hire-me/)**

## 📸 Ekran Görüntüleri

### Ana Sayfa
![Ana Sayfa](screenshots/homepage.png)

### Coverflow Kartları
![Kartlar](screenshots/cards.png)

### Dijital İkiz (AI Chatbot)
![Chatbot](screenshots/chatbot.png)

## 📁 Proje Yapısı

```
dont-hire-me/
├── index.html          # Ana HTML yapısı
├── style.css           # Modern CSS3 tasarımları ve animasyonlar
├── script.js           # Core JavaScript mantığı ve API entegrasyonu
├── avatar512-1.png     # Yusuf Gül (Dijital İkiz) Avatarı
├── LICENSE             # CC BY-NC 4.0 Lisansı
└── README.md           # Proje dökümantasyonu
```

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: Vanilla JS, HTML5, CSS3 (Custom Variables, Animations, Grid, Flexbox)
- **AI/ML**: Google Gemini 1.5 Flash
- **Backend**: Cloudflare Workers (API Proxy & Security)
- **Analytics**: Google Analytics 4 (GA4)
- **Deployment**: Custom / GitHub Pages / Vercel

## 📝 Geliştirme Süreci

### Aşama 1: Temel Yapı & Konsept
- "Beni İşe Almayın" konsepti ve ters psikoloji teması belirlendi.
- Glitch efektli başlık ve temel sayfa düzeni tasarlandı.

### Aşama 2: 3D Coverflow & Etkileşim
- 3D perspektifli kart galerisi ve çevrilebilir kart mekaniği geliştirildi.
- Klavye ve dokunmatik ekran desteği entegre edildi.

### Aşama 3: Dijital İkiz & Yapay Zeka
- Google Gemini API entegrasyonu Cloudflare Workers üzerinden güvenli hale getirildi.
- Yusuf'un bilgi kütüphanesi (knowledgeBase) oluşturuldu ve AI yanıtları kişiselleştirildi.

### Aşama 4: Dil ve Tema Desteği
- TR/EN dil anahtarı ve Dark/Light mode özellikleri eklendi.
- Kullanıcı tercihleri LocalStorage ile kalıcı hale getirildi.

### Aşama 5: Optimizasyon & Performans
- Skeleton loading ve GA4 etkinlik takibi eklendi.
- Sade CV modu ile erişilebilirlik artırıldı.

## 📄 Lisans

Bu proje [CC BY-NC 4.0](LICENSE) lisansı altındadır. Kişisel kullanım serbesttir, ticari satış yasaktır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

## 👨‍💻 Yazar

**Yusuf Gül**

[![Email](https://img.shields.io/badge/Email-zyusuf__16%40hotmail.com-red?style=flat-square&logo=microsoft-outlook)](mailto:zyusuf_16@hotmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yusufgul-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/yusufgul/)
[![GitHub](https://img.shields.io/badge/GitHub-yuusufgul16-black?style=flat-square&logo=github)](https://github.com/yuusufgul16)

## 🗺️ Roadmap

- [x] Coverflow kart galerisi
- [x] Dijital İkiz (AI chatbot)
- [x] Çoklu dil desteği (EN/TR)
- [x] Tema değiştirme (Dark/Light)
- [x] Sade CV görünümü
- [x] Google Analytics entegrasyonu
- [ ] PWA (Progressive Web App) desteği
- [ ] Daha fazla interaktif easter egg

## ❓ Sık Sorulan Sorular

<details>
<summary><strong>Bu projeyi kendi CV'im için kullanabilir miyim?</strong></summary>

Evet! CC BY-NC 4.0 lisansı altında açık kaynak. Fork'layıp kendi bilgilerinle düzenleyebilirsin (ticari satış hariç).
</details>

<details>
<summary><strong>Dijital İkiz nasıl çalışıyor?</strong></summary>

Google Gemini API kullanarak gerçek zamanlı AI yanıtları üretir. Cloudflare Workers ile serverless olarak çalışır.
</details>

<details>
<summary><strong>Neden "Beni İşe Almayın" teması?</strong></summary>

Ters psikoloji! Geleneksel CV'lerden sıkılan işverenler için dikkat çekici ve akılda kalıcı bir deneyim sunuyor.
</details>

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

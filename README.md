# 🚫 BENİ İŞE ALMAYIN | Don't Hire Me

> Ters psikoloji ile tasarlanmış, interaktif ve sıra dışı bir kişisel tanıtım web sitesi.

![License](https://img.shields.io/badge/license-MIT-red)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📖 Hakkında

Bu proje, geleneksel CV formatlarından sıkılan ve kendini farklı bir şekilde tanıtmak isteyen yazılımcılar için tasarlanmış interaktif bir web sitesidir. "Beni işe almayın" teması ile ters psikoloji kullanarak, ziyaretçilerin dikkatini çeker ve gerçek yetenekleri eğlenceli bir şekilde sunar.

## ✨ Özellikler

- 🎠 **Coverflow Kart Galerisi** - 3D perspektifli, çevrilebilir kartlar
- 🎯 **Ters Psikoloji Teması** - "Olumsuz" özellikler, çevrildiğinde gerçek yeteneklere dönüşür
- 📱 **Tam Responsive** - Mobil, tablet ve masaüstü uyumlu
- ✨ **Glitch Efektleri** - Modern ve dikkat çekici animasyonlar
- 🎮 **Easter Eggs** - Konami kodu ve gizli başarımlar
- 🎉 **Confetti Efekti** - İletişime geçme kutlaması
- ⌨️ **Klavye Navigasyonu** - Ok tuşları ile gezinme
- 👆 **Touch/Swipe Desteği** - Mobilde parmakla kaydırma

## 🚀 Kurulum

### Yerel Ortamda Çalıştırma

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/dont-hire-me.git
```

2. Proje klasörüne gidin:
```bash
cd dont-hire-me
```

3. `index.html` dosyasını tarayıcınızda açın veya bir local server başlatın:
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve
```

### GitHub Pages ile Yayınlama

1. Repository ayarlarına gidin
2. **Pages** sekmesini açın
3. Source olarak **main branch** seçin
4. Siteniz `https://kullaniciadi.github.io/dont-hire-me` adresinde yayınlanacak

## 📁 Proje Yapısı

```
dont-hire-me/
├── index.html      # Ana HTML dosyası
├── style.css       # Tüm stiller ve animasyonlar
├── script.js       # JavaScript işlevselliği
├── README.md       # Bu dosya
└── LICENSE         # MIT Lisansı
```

## 🎨 Özelleştirme

### Kartları Düzenleme

`index.html` dosyasında `.coverflow-card` elementlerini bulun ve içerikleri değiştirin:

```html
<div class="coverflow-card">
    <div class="card-inner">
        <div class="card-front">
            <div class="card-icon">🔍</div>
            <h3>Olumsuz Özellik</h3>
        </div>
        <div class="card-back">
            <div class="card-icon">✨</div>
            <h3>Gerçek Yetenek</h3>
            <p>Açıklama</p>
        </div>
    </div>
</div>
```

### Renk Şeması

`style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --bg-primary: #0a0a0a;
    --accent-red: #ff0033;
    --text-primary: #ffffff;
}
```

### İletişim Bilgileri

`index.html` dosyasında `.contact-links` bölümünü güncelleyin.

## 🎮 Gizli Özellikler

- **Konami Kodu**: ↑↑↓↓←→←→BA tuşlarını sırayla basın
- **Cesur Keşifçi Rozeti**: Tüm kartları çevirin

## 📱 Responsive Breakpoints

| Ekran | Boyut |
|-------|-------|
| Masaüstü | > 1024px |
| Tablet | 768px - 1024px |
| Mobil | 480px - 768px |
| Küçük Mobil | < 480px |

## 🛠️ Kullanılan Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Animasyonlar, Flexbox, CSS Grid, CSS Variables
- **Vanilla JavaScript** - Framework bağımsız, saf JS
- **Google Fonts** - Bebas Neue, Inter

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

## 📬 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

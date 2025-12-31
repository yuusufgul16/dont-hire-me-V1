// ===== DOM Elements =====
const elements = {
    coverflowCards: document.getElementById('coverflow-cards'),
    cards: document.querySelectorAll('.coverflow-card'),
    prevBtn: document.getElementById('coverflow-prev'),
    nextBtn: document.getElementById('coverflow-next'),
    dotsContainer: document.getElementById('coverflow-dots'),
    cardsFlipped: document.getElementById('cards-flipped'),
    progressFill: document.getElementById('progress-fill'),
    btnYes: document.getElementById('btn-yes'),
    btnNo: document.getElementById('btn-no'),
    contactReveal: document.getElementById('contact-reveal'),
    escapeNumber: document.getElementById('escape-number'),

    projectCards: document.querySelectorAll('.project-card'),
    warningBanner: document.getElementById('warning-banner'),

    // Proof tabs
    proofTabs: document.querySelectorAll('.proof-tab'),
    proofContents: document.querySelectorAll('.proof-content')
};

// ===== State =====
let currentIndex = 0;
let flippedCount = 0;
let flippedCards = new Set();
let escapeCount = parseInt(localStorage.getItem('escapeCount') || '47');

const totalCards = elements.cards.length;

// ===== Initialize =====
function init() {
    // Sayfa yüklendiğinde hash'i temizle ve en üste scroll yap
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
        window.scrollTo(0, 0);
    }

    elements.escapeNumber.textContent = escapeCount;

    // Create dots
    createDots();

    // Set initial positions
    updateCoverflow();

    // Card click handlers
    elements.cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === currentIndex) {
                flipCard(card, index);
            } else {
                goToCard(index);
            }
        });
    });

    // Navigation
    elements.prevBtn.addEventListener('click', () => navigate(-1));
    elements.nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Touch/Swipe support
    initSwipe();

    // CTA button handlers
    elements.btnYes.addEventListener('click', handleYesClick);
    elements.btnNo.addEventListener('click', handleNoClick);



    // Scroll animations for projects
    observeElements();

    // Project Accordion
    elements.projectCards.forEach(card => {
        card.addEventListener('click', () => toggleProjectCard(card));
    });

    // Konami code
    initKonamiCode();

    // Resize handler for responsive coverflow
    window.addEventListener('resize', () => {
        updateCoverflow();
    });

    // Proof tabs
    elements.proofTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchProofTab(targetTab);
        });
    });
}

// ===== Create Dots =====
function createDots() {
    elements.dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = 'coverflow-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToCard(i));
        elements.dotsContainer.appendChild(dot);
    }
}

// ===== Update Coverflow Positions =====
function updateCoverflow() {
    const isMobile = window.innerWidth <= 768;

    // Adjust values for mobile
    const positions = {
        center: { x: 0, z: 50, r: 0, s: 1 },
        left1: { x: isMobile ? -140 : -200, z: -100, r: 25, s: isMobile ? 0.6 : 0.7 },
        right1: { x: isMobile ? 140 : 200, z: -100, r: -25, s: isMobile ? 0.6 : 0.7 },
        left2: { x: isMobile ? -220 : -350, z: -200, r: 35, s: isMobile ? 0.4 : 0.5 },
        right2: { x: isMobile ? 220 : 350, z: -200, r: -35, s: isMobile ? 0.4 : 0.5 },
        hidden: { x: isMobile ? 300 : 500, z: -300, r: 45, s: 0.3 }
    };

    elements.cards.forEach((card, index) => {
        const offset = index - currentIndex;

        let translateX = 0;
        let translateZ = 0;
        let rotateY = 0;
        let scale = 1;
        let opacity = 1;
        let zIndex = 0;

        if (offset === 0) {
            translateX = positions.center.x;
            translateZ = positions.center.z;
            rotateY = positions.center.r;
            scale = positions.center.s;
            opacity = 1;
            zIndex = 10;
            card.classList.add('active');
        } else if (offset === -1) {
            translateX = positions.left1.x;
            translateZ = positions.left1.z;
            rotateY = positions.left1.r;
            scale = positions.left1.s;
            opacity = 0.7;
            zIndex = 5;
            card.classList.remove('active');
        } else if (offset === 1) {
            translateX = positions.right1.x;
            translateZ = positions.right1.z;
            rotateY = positions.right1.r;
            scale = positions.right1.s;
            opacity = 0.7;
            zIndex = 5;
            card.classList.remove('active');
        } else if (offset === -2) {
            translateX = positions.left2.x;
            translateZ = positions.left2.z;
            rotateY = positions.left2.r;
            scale = positions.left2.s;
            opacity = isMobile ? 0 : 0.4;
            zIndex = 2;
            card.classList.remove('active');
        } else if (offset === 2) {
            translateX = positions.right2.x;
            translateZ = positions.right2.z;
            rotateY = positions.right2.r;
            scale = positions.right2.s;
            opacity = isMobile ? 0 : 0.4;
            zIndex = 2;
            card.classList.remove('active');
        } else {
            translateX = offset < 0 ? -positions.hidden.x : positions.hidden.x;
            translateZ = positions.hidden.z;
            rotateY = offset < 0 ? positions.hidden.r : -positions.hidden.r;
            scale = positions.hidden.s;
            opacity = 0;
            zIndex = 0;
            card.classList.remove('active');
        }

        // Apply position transform to the card wrapper
        card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
    });

    // Update dots
    const dots = elements.dotsContainer.querySelectorAll('.coverflow-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// ===== Navigate =====
function navigate(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = totalCards - 1;
    if (currentIndex >= totalCards) currentIndex = 0;

    updateCoverflow();
}

function goToCard(index) {
    currentIndex = index;
    updateCoverflow();
}

// ===== Keyboard Navigation =====
function handleKeyboard(e) {
    // Input veya textarea'daysa klavye kısayollarını devre dışı bırak
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return; // Input alanındaysa hiçbir şey yapma
    }

    if (e.key === 'ArrowLeft') {
        navigate(-1);
    } else if (e.key === 'ArrowRight') {
        navigate(1);
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const currentCard = elements.cards[currentIndex];
        if (currentCard && !currentCard.classList.contains('flipped')) {
            flipCard(currentCard, currentIndex);
        }
    }
}

// ===== Touch/Swipe Support =====
function initSwipe() {
    let startX = 0;
    const wrapper = document.querySelector('.coverflow-wrapper');

    if (!wrapper) return;

    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigate(1);
            } else {
                navigate(-1);
            }
        }
    }, { passive: true });
}

// ===== Card Flip =====
function flipCard(card, index) {
    if (card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.add(index);
    flippedCount = flippedCards.size;

    // Update progress
    elements.cardsFlipped.textContent = flippedCount;
    elements.progressFill.style.width = `${(flippedCount / totalCards) * 100}%`;

    // Update dot
    const dots = elements.dotsContainer.querySelectorAll('.coverflow-dot');
    if (dots[index]) {
        dots[index].classList.add('flipped');
    }


}

// ===== CTA Handlers =====
function handleYesClick() {
    elements.contactReveal.classList.add('visible');
    elements.btnYes.style.display = 'none';
    elements.btnNo.style.display = 'none';
    createConfetti();
}

function handleNoClick() {
    escapeCount++;
    localStorage.setItem('escapeCount', escapeCount);
    elements.escapeNumber.textContent = escapeCount;

    elements.btnNo.style.animation = 'shake 0.5s ease';

    const noTexts = [
        "Emin misiniz?",
        "Son şansınız!",
        "Pişman olacaksınız...",
        "Tamam, kaçın 😢",
        "👋 Görüşürüz"
    ];

    const clickCount = parseInt(elements.btnNo.dataset.clickCount || 0);
    const currentTextIndex = Math.min(clickCount, noTexts.length - 1);

    elements.btnNo.querySelector('span').textContent = noTexts[currentTextIndex];
    elements.btnNo.dataset.clickCount = clickCount + 1;

    if (currentTextIndex >= noTexts.length - 1) {
        setTimeout(() => {
            elements.btnNo.style.opacity = '0.3';
            elements.btnNo.style.pointerEvents = 'none';
        }, 500);
    }

    if (!document.getElementById('shake-styles')) {
        const style = document.createElement('style');
        style.id = 'shake-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        elements.btnNo.style.animation = '';
    }, 500);
}

// ===== Confetti Effect =====
function createConfetti() {
    const colors = ['#ff0033', '#ffffff', '#ff3366', '#ff6699'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: ${Math.random() * 0.5 + 0.5};
            pointer-events: none;
            z-index: 10000;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }

    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                to { top: 100vh; transform: rotate(720deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Project Accordion =====
function toggleProjectCard(targetCard) {
    const isActive = targetCard.classList.contains('active');

    // Close all cards
    elements.projectCards.forEach(card => {
        card.classList.remove('active');
    });

    // Toggle target card
    if (!isActive) {
        targetCard.classList.add('active');
    }
}

// ===== Scroll Animations =====
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== Konami Code =====
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.filter = 'hue-rotate(180deg)';
                const msg = document.createElement('div');
                msg.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #000; border: 2px solid #0ff; padding: 40px; border-radius: 20px;
                    z-index: 100000; text-align: center; box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
                `;
                msg.innerHTML = `
                    <h2 style="color: #0ff; margin-bottom: 15px;">🎮 KONAMI KODU AÇILDI!</h2>
                    <p style="color: #fff;">Gerçek bir gamer olduğunuz kanıtlandı.</p>
                    <button onclick="this.parentElement.remove(); document.body.style.filter = '';" 
                            style="margin-top: 20px; padding: 10px 30px; background: #0ff; border: none; 
                                   border-radius: 25px; cursor: pointer; font-weight: bold;">Kapat</button>
                `;
                document.body.appendChild(msg);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// ===== Switch Proof Tab =====
function switchProofTab(tabName) {
    // Remove active class from all tabs
    elements.proofTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all contents
    elements.proofContents.forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to clicked tab
    const activeTab = document.querySelector(`.proof-tab[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Show corresponding content
    const activeContent = document.getElementById(`${tabName}-content`);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // Close all project cards when switching tabs
    elements.projectCards.forEach(card => {
        card.classList.remove('active');
    });
}

// ===== Digital Twin Initialization =====
function initDigitalTwin() {
    const twinBubble = document.getElementById('twin-bubble');
    const twinModal = document.getElementById('twin-modal');
    const closeTwin = document.getElementById('close-twin');
    const twinChat = document.getElementById('twin-chat');
    const twinOptions = document.getElementById('twin-options');
    const twinNotification = document.getElementById('twin-notification');
    const twinInput = document.getElementById('twin-input');
    const twinSend = document.getElementById('twin-send');

    // ===== Bilgi Kütüphanesi (Knowledge Base) =====
    const knowledgeBase = {
        personalInfo: {
            name: "Yusuf Gül",
            title: "Yazılım Geliştirici & Veri Analisti",
            location: "Türkiye",
            email: "zyusuf_16@hotmail.com",
            linkedin: "https://www.linkedin.com/in/yusufgul/",
            github: "https://github.com/yuusufgul16"
        },
        education: {
            university: "Bilecik Şeyh Edebali Üniversitesi",
            department: "Yönetim Bilişim Sistemleri",
            graduationYear: "2024"
        },
        military: {
            status: "Tamamlandı",
            unit: "1'inci Ordu Tatbikat Kontrol Merkezi Komutanlığı",
            location: "Pınarhisar",
            rank: "Onbaşı"
        },
        languages: {
            turkish: "Ana dil",
            english: "A2 Seviye - Temel düzey, aktif olarak geliştiriyorum. Teknik dokümantasyonu okuyabiliyorum."
        },
        skills: {
            programming: ["Python", "JavaScript", "SQL", "HTML/CSS", "R"],
            tools: ["Git", "VS Code", "Jupyter", "OpenCV", "ggplot2", "wordcloud", "tidytext"],
            dataScience: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Metin Madenciliği", "Duygu Analizi"],
            gameDesign: ["Aseprite", "Pixel Art", "Oyun Tasarımı", "Ses Tasarımı"],
            soft: ["Problem Çözme", "Takım Çalışması", "Hızlı Öğrenme", "Analitik Düşünme", "Liderlik"]
        },
        experience: [
            {
                company: "LOOP",
                role: "Kurucu",
                duration: "Ekim 2025 - Halen",
                type: "Kendi İşim",
                description: "Kendi girişimim üzerinde hobi olarak çalışıyorum. Girişimcilik ve liderlik deneyimi kazanıyorum."
            },
            {
                company: "Yaşam Ağacı",
                role: "Oyun Tasarımcısı",
                duration: "Ocak 2024 - Aralık 2024 (1 yıl)",
                location: "Bilecik, Türkiye",
                description: "BM Sürdürülebilir Kalkınma Hedefleri temalı mobil eğitim oyunu 'Kurtuluş'un senaryo, tasarım ve test süreçlerinde görev aldım. Teknofest yarı finaline çıktık."
            },
            {
                company: "Endüstri 4.0 ve Siber Güvenlik Kulübü",
                role: "Yönetim Kurulu Üyesi & Sosyal Medya Koordinatörü",
                duration: "Aralık 2023 - Temmuz 2024 (8 ay)",
                location: "Bilecik, Türkiye",
                description: "Kulüp yönetimi ve sosyal medya içerik üretimi."
            },
            {
                company: "LC Waikiki",
                role: "Lojistik Operasyon Elemanı",
                duration: "Temmuz 2023 - Ağustos 2023 (2 ay)",
                location: "Yalova",
                description: "Depo yönetimi ve lojistik operasyon süreçleri."
            },
            {
                company: "Global AI Hub",
                role: "Mentor",
                duration: "Ağustos 2022 - Ekim 2022 (3 ay)",
                description: "Yapay zeka ve Python eğitimlerinde katılımcılara rehberlik ettim."
            },
            {
                company: "ORMO Group",
                role: "Bilgi İşlem Stajyeri",
                duration: "Temmuz 2018 (1 ay)",
                location: "Orhangazi, Bursa",
                description: "IT support ve ağ yönetimi."
            },
            {
                company: "Orhangazi Belediyesi",
                role: "Bilgi İşlem Stajyeri",
                duration: "Temmuz 2017 (1 ay)",
                location: "Orhangazi, Bursa",
                description: "Kamu bilgi işlem ve teknik destek."
            }
        ],
        projects: [
            {
                name: "Kurtuluş Oyunu",
                description: "BM Sürdürülebilir Kalkınma Hedefleri temalı mobil eğitim oyunu. Teknofest yarı finaline çıktık!",
                role: "Oyun içi görsel ve ses tasarımı, sunum, sosyal medya yönetimi",
                tech: ["Gamification", "SDG", "Aseprite", "Pixel Art"]
            },
            {
                name: "Endemika",
                description: "Bilecik'in endemik bitkilerini tanıtan web platformu. QR kodlu saha erişimi ve AI ile bitki görsellerini videoya çevirdik.",
                role: "Araştırma, logo tasarımı, tanıtım videosu",
                tech: ["Web Geliştirme", "QR Kod", "AI Video", "Proje Yönetimi"]
            },
            {
                name: "YouTube Metin Madenciliği",
                description: "YouTube API ile 57.000 yorum topladım, R dili ile metin madenciliği ve duygu analizi yaptım.",
                tech: ["R", "ggplot2", "wordcloud", "tidytext", "Sentiment Analysis", "Text Mining"]
            },
            {
                name: "Crystal Miner",
                description: "Eratosthenes Kalburu algoritmasını oyunlaştıran eğitici asal sayı bulma oyunu.",
                tech: ["HTML", "CSS", "JavaScript", "Gamification", "Math Game"]
            },
            {
                name: "E-Ticaret Projesi (Hermione Candle)",
                description: "Mum markası için logo tasarımı, sosyal medya yönetimi, SWOT analizi ve Shopier satış takibi.",
                tech: ["E-Commerce", "Social Media", "Logo Design", "SWOT Analysis"]
            },
            {
                name: "RGB Color Extraction",
                description: "Python ve OpenCV ile görsellerden baskın renkleri tespit eden uygulama.",
                tech: ["Python", "OpenCV", "Color Analysis"]
            },
            {
                name: "Instagram Data Extraction",
                description: "Python ile Instagram hesaplarından veri çeken analiz aracı.",
                tech: ["Python", "Data Mining", "Social Media Analytics"]
            },
            {
                name: "YZ Geleceği Araştırma Projesi",
                description: "Alan Turing'den Endüstri 4.0'a yapay zekanın tarihsel gelişimi ve gelecekteki etkileri raporu.",
                tech: ["Araştırma", "Yapay Zeka", "Endüstri 4.0"]
            },
            {
                name: "Find It (Card Game)",
                description: "HTML, CSS ve JavaScript ile hafıza kart oyunu. Zamanlayıcı, skor tablosu ve responsive tasarım.",
                tech: ["HTML", "CSS", "JavaScript", "Game Design"]
            }
        ],
        certifications: [
            {
                name: "Bilgisayar İşletmenliği (Operatörlüğü)",
                issuer: "T.C. Milli Eğitim Bakanlığı",
                date: "Ekim 2024"
            },
            {
                name: "Python Bootcamp",
                issuer: "Global AI Hub",
                date: "Eylül 2022"
            },
            {
                name: "Big Data And Machine Learning on Google Cloud",
                issuer: "Google",
                date: "Temmuz 2022"
            },
            {
                name: "Veri Analizi",
                issuer: "Global AI Hub",
                date: "Temmuz 2022"
            },
            {
                name: "Python for Machine Learning",
                issuer: "Global AI Hub",
                date: "Haziran 2022"
            },
            {
                name: "Dijital Ortamda Bilgi",
                issuer: "BTK - ICT",
                date: "Mart 2021"
            }
        ],
        personality: {
            workStyle: "Detaycı, problem çözücü, sürekli öğrenen",
            strengths: ["Hızlı adaptasyon", "Analitik düşünme", "Takım çalışması", "Liderlik"],
            passion: "Veri bilimi, oyun tasarımı ve web teknolojilerini birleştirerek yaratıcı projeler üretmek",
            motivation: "Karmaşık problemleri basit, elegant çözümlerle aşmak ve insanlara fayda sağlamak"
        },
        preferences: {
            availability: "Görüşmeye açığım",
            interests: ["Veri Bilimi", "Oyun Tasarımı", "Web Geliştirme", "Yapay Zeka", "Girişimcilik"]
        }
    };

    // ===== Cloudflare Worker URL =====
    // API key artık Cloudflare Worker'da güvenli şekilde saklanıyor
    const API_URL = "https://donthireme.zyusuf-16.workers.dev";

    // ===== Hazır Cevaplar (Gemini yoksa fallback) =====
    const answers = {
        neden: "Çünkü ben sadece kod yazmıyorum, projeye bir ruh katıyorum. Sorunları henüz ortaya çıkmadan fark edip çözüm üretiyorum. Sıradan bir çalışan değil, projenin başarısı için en az senin kadar heyecan duyan bir takım arkadaşı arıyorsan doğru yerdesin.",
        stack: "Öncelikle Modern JavaScript (ES6+), React ve Node.js ekosistemine çok hakimim. Tasarım tarafında CSS/SCSS ile harikalar yaratabilirim. Ayrıca Python ve Veri Analizi konularında da kendimi geliştirmeye devam ediyorum. Her zaman yeni teknolojileri öğrenmeye açığım!",
        remote: "Evet, kesinlikle! Uzun süredir uzaktan çalışma disiplinine sahibim. Asenkron iletişim araçlarını (Slack, Jira, GitHub vb.) ustalıkla kullanıyorum. Dünyanın neresinde olursan ol, aynı ofisteymişiz gibi verimli çalışabiliriz.",
        hedef: "Kısa vadede, global projelerde yer alarak teknik yetkinliklerimi en üst seviyeye çıkarmak istiyorum. Uzun vadede ise, teknoloji dünyasında iz bırakacak kendi girişimimi hayata geçirmek ve genç geliştiricilere mentorluk yapmak en büyük hayalim."
    };

    // ===== Özel Sorular için Custom FAQ Kütüphanesi =====
    const customFAQ = {
        // Kişisel Bilgiler
        "yaş": "Bu kişisel bir bilgi, ama profesyonel deneyimim hakkında konuşabiliriz! 😊",
        "evli": "Özel hayatımı paylaşmayı tercih etmiyorum, ama iş hayatımda çok disiplinli ve odaklıyım! 💼",
        "çocuk": "Kişisel durumum iş performansımı etkilemiyor, %100 profesyonel odağım var! 💪",

        // Dil Becerileri
        "ingilizce": "İngilizce A2 seviyesindeyim. Temel düzeyde iletişim kurabiliyorum ve aktif olarak geliştiriyorum. Teknik dokümantasyonu okuyabiliyorum! 📚",
        "english": "İngilizce A2 seviyesindeyim. Temel düzeyde iletişim kurabiliyorum ve aktif olarak geliştiriyorum. Teknik dokümantasyonu okuyabiliyorum! 📚",
        "dil": "Türkçe ana dilim. İngilizce A2 seviyesinde - temel düzeyde iletişim kurabiliyorum ve aktif olarak geliştiriyorum. Teknik dokümantasyonu okuyabiliyorum! 🌍",
        "yabancı": "Türkçe ana dilim. İngilizce A2 seviyesinde - temel düzeyde iletişim kurabiliyorum ve aktif olarak geliştiriyorum! 🌍",

        // Kendini Tanıtma
        "tanıt": "Ben Yusuf Gül, Bilecik Şeyh Edebali Üniversitesi Yönetim Bilişim Sistemleri mezunuyum. Yazılım geliştirme, veri analizi ve oyun tasarımı alanlarında projeler yürütüyorum. Şu an LOOP adlı kendi girişimim üzerinde hobi olarak çalışıyorum. 🚀",
        "yusuf": "Ben Yusuf Gül! BŞEÜ YBS mezunuyum. Python, JavaScript, R ile projeler geliştiriyorum. Kurtuluş oyunu ile Teknofest yarı finaline çıktım! 🎯",
        "kimsin": "Ben Yusuf Gül, Bilecik Şeyh Edebali Üniversitesi Yönetim Bilişim Sistemleri mezunuyum. Yazılım geliştirme, veri analizi ve oyun tasarımı alanlarında projeler yürütüyorum. Şu an LOOP adlı kendi girişimim üzerinde hobi olarak çalışıyorum. 🚀",
        "hakkında": "Ben Yusuf Gül, BŞEÜ YBS mezunuyum. Python, JavaScript, R ve SQL ile çalışıyorum. Veri bilimi ve web teknolojilerini birleştirmeyi seviyorum! 💡",
        "anlat": "Ben Yusuf! Yazılım, veri analizi ve oyun tasarımı ile ilgileniyorum. Kurtuluş oyunu ile Teknofest yarı finaline çıktım. LOOP adlı kendi girişimimi kurdum. Detaylar için Projeler sekmesine göz at! 🎯",
        "bilgi ver": "Ben Yusuf Gül, YBS mezunu bir yazılımcıyım. Python, JavaScript, SQL ve R ile projeler geliştiriyorum. Global AI Hub'da mentorluk yaptım. Sayfadaki Projeler ve Deneyim sekmelerinden daha fazla bilgi alabilirsin! 📊",

        // Projeler
        "proje": "Kurtuluş oyunu (Teknofest yarı finalist), Endemika web platformu, YouTube Metin Madenciliği, Crystal Miner oyunu, E-Ticaret projesi ve daha fazlası var! Projeler sekmesine göz at. 🎮",
        "kurtuluş": "Kurtuluş, BM Sürdürülebilir Kalkınma Hedefleri temalı mobil eğitim oyunu. Teknofest yarı finaline çıktık! Oyun tasarımı, ses ve görsel tasarımını ben yaptım. 🎯",
        "endemika": "Endemika, Bilecik'in endemik bitkilerini tanıtan web platformu. QR kodlu saha erişimi, AI ile bitki görsellerini videoya çevirdik. Logo tasarımını da ben yaptım! 🌿",
        "metin": "YouTube API ile 57.000 yorum topladım, R dili ile metin madenciliği ve duygu analizi yaptım. ggplot2 ve wordcloud ile görselleştirdim. 📊",
        "crystal": "Crystal Miner, Eratosthenes Kalburu algoritmasını oyunlaştıran eğitici bir asal sayı oyunu. HTML/CSS/JS ile geliştirdim. �",
        "e-ticaret": "Hermione Candle markası için e-ticaret projesi yürüttüm. Logo tasarımı, sosyal medya yönetimi, SWOT analizi ve Shopier satış takibi yaptım. �️",
        "opencv": "Python ve OpenCV ile görsellerden baskın renkleri tespit eden uygulama geliştirdim. Otomatik renk paletleri oluşturuyor. 🎨",
        "instagram": "Python ile Instagram hesaplarından veri çeken bir analiz aracı geliştirdim. Takipçi ve gönderi istatistiklerini analiz ediyor. �",
        "bootcamp": "Global AI Hub Python Bootcamp'te veri analizi ve görselleştirme projeleri geliştirdim. Sonra mentor oldum! �",
        "yapay zeka": "YZ ve Geleceği adlı araştırma raporumda, Turing'den Endüstri 4.0'a yapay zekanın gelişimini inceledim. 🤖",

        // Deneyim
        "deneyim": "LOOP kurucusu olarak girişimcilik yapıyorum. Yaşam Ağacı'nda oyun tasarımcısı, Endüstri 4.0 Kulübü'nde yönetim kurulu üyesi, Global AI Hub'da mentor, LC Waikiki'de lojistik operasyon deneyimim var! 💼",
        "loop": "LOOP benim kendi girişimim! Ekim 2025'ten beri üzerinde çalışıyorum. Girişimcilik, startup ve liderlik deneyimi kazanıyorum. 🚀",
        "yaşam ağacı": "Yaşam Ağacı'nda 1 yıl boyunca oyun tasarımcısı olarak çalıştım. Kurtuluş oyununun senaryo, tasarım ve test süreçlerinde görev aldım. 🎮",
        "mentor": "Global AI Hub'da 3 ay mentor olarak çalıştım. Yapay zeka ve Python eğitimlerinde katılımcılara rehberlik ettim. 👨‍🏫",
        "kulüp": "Endüstri 4.0 ve Siber Güvenlik Kulübü'nde Yönetim Kurulu Üyesi ve Sosyal Medya Koordinatörü olarak görev aldım. 🛡️",
        "staj": "ORMO Group ve Orhangazi Belediyesi'nde bilgi işlem stajı yaptım. IT support ve ağ yönetimi deneyimi kazandım. 💻",
        "lc waikiki": "LC Waikiki Yalova deposun'da 2 ay lojistik operasyon elemanı olarak çalıştım. Depo yönetimi ve operasyon süreçlerini öğrendim. 📦",
        "askerlik": "Askerlik görevimi 1'inci Ordu Tatbikat Kontrol Merkezi Komutanlığı Kırklareli/Pınarhisar'da Onbaşı olarak tamamladım. 🎖️",
        "asker": "Askerlik görevimi 1'inci Ordu Tatbikat Kontrol Merkezi Komutanlığı Kırklareli/Pınarhisar'da Onbaşı olarak tamamladım. 🎖️",

        // Sertifikalar
        "sertifika": "MEB Bilgisayar İşletmenliği, Global AI Hub Python Bootcamp, Google Big Data & ML, Veri Analizi, Python for ML ve BTK Dijital Ortamda Bilgi sertifikalarım var! 📜",
        "meb": "T.C. Milli Eğitim Bakanlığı'ndan Bilgisayar İşletmenliği (Operatörlüğü) sertifikam var. Ekim 2024'te aldım. 🎓",
        "google": "Google'dan Big Data And Machine Learning on Google Cloud sertifikam var. Temmuz 2022'de aldım. ☁️",
        "btk": "BTK - ICT'den Dijital Ortamda Bilgi sertifikam var. Mart 2021'de aldım. 🔒",
        "global ai": "Global AI Hub'dan Python Bootcamp, Veri Analizi ve Python for Machine Learning olmak üzere 3 sertifikam var! �",

        // Eğitim
        "üniversite": "Bilecik Şeyh Edebali Üniversitesi Yönetim Bilişim Sistemleri bölümünden mezunum. 🎓",
        "okul": "BŞEÜ Yönetim Bilişim Sistemleri mezunuyum. Yazılım, veri analizi ve iş yönetimi konularında eğitim aldım. 📚",
        "mezun": "Bilecik Şeyh Edebali Üniversitesi YBS mezunuyum. 🎓",
        "bşeü": "Bilecik Şeyh Edebali Üniversitesi YBS bölümü mezunuyum. 2024 yılında mezun oldum. 🎓",

        // Beceriler
        "python": "Python'da veri analizi, metin madenciliği, makine öğrenmesi ve otomasyon projeleri geliştirdim. Global AI Hub'da mentor oldum! 🐍",
        "javascript": "JavaScript ile web uygulamaları ve oyunlar geliştiriyorum. Bu siteyi de JS ile yaptım! 💻",
        "r": "R dili ile metin madenciliği, duygu analizi ve veri görselleştirme projeleri yaptım. ggplot2 ve tidytext kullanıyorum. �",
        "sql": "SQL ile veritabanı yönetimi ve veri analizi yapıyorum. 💾",
        "veri": "Veri analizi, metin madenciliği ve görselleştirme konularında projeler geliştirdim. Python ve R kullanıyorum. 📈",

        // Diğer
        "güçlü": "Hızlı öğrenme, problem çözme, takım çalışması ve analitik düşünme en güçlü yönlerim! 💡",
        "zayıf": "Bazen aşırı mükemmeliyetçi olabiliyorum. Ama 'done is better than perfect' prensibini öğrendim! �",
        "maaş": "Piyasa standartlarına uygun beklentim var. Projenin vizyonu ve gelişim fırsatları en az maaş kadar önemli! �",
        "ücret": "Piyasa standartlarına uygun beklentim var. Projenin vizyonu ve gelişim fırsatları en az maaş kadar önemli! 💰",
        "takım": "Yaptığım stajlarda ve çalıştıgım diğer işlerde-projelerde takım oyuncusuyum! Yaşam Ağacı'nda ve diğer projelerde takımla çalışma, Kulüp'te yönetim deneyimim var! 🤝",
        "hobi": "Bilgisayar oyunları🎮, bisiklet sürmek, futbol oynamak ve izlemek, elektronik müzik yapmak hobilerim arasında.",
        "motivasyon": "Karmaşık problemleri çözmek ve projelerimle insanlara fayda sağlamak beni motive eder! 🎯",
        "teknofest": "Kurtuluş oyunu ile Teknofest yarı finaline çıktık! BM Sürdürülebilir Kalkınma Hedefleri temalı mobil eğitim oyunuydu. 🏆",
        "github": "github.com/yuusufgul16 - Projelerim ve açık kaynak katkılarım burada! 🐙",
        "linkedin": "linkedin.com/in/yusufgul - İş deneyimlerim ve bağlantılarım burada! 💼",
        "iletişim": "Email: zyusuf_16@hotmail.com | LinkedIn: linkedin.com/in/yusufgul | GitHub: github.com/yuusufgul16 📧",
        "email": "zyusuf_16@hotmail.com adresinden bana ulaşabilirsin! �"
    };


    twinBubble.addEventListener('click', () => {
        twinModal.classList.toggle('hidden');
        // Toggle animation based on modal visibility
        if (twinModal.classList.contains('hidden')) {
            twinBubble.classList.remove('pausing');
        } else {
            twinBubble.classList.add('pausing');
        }

        if (twinNotification) {
            twinNotification.style.display = 'none';
        }
    });

    closeTwin.addEventListener('click', () => {
        twinModal.classList.add('hidden');
        twinBubble.classList.remove('pausing'); // Resume animation when closed
    });

    twinOptions.addEventListener('click', (e) => {
        const btn = e.target.closest('.twin-opt');
        if (!btn) return;

        const question = btn.textContent;
        const qKey = btn.dataset.q;

        // Add user message
        addMessage(question, 'user-message');

        // Hide options while twin is "typing"
        const originalOptions = twinOptions.innerHTML;
        twinOptions.style.pointerEvents = 'none';
        twinOptions.style.opacity = '0.5';

        // Add thinking indicator
        const typingId = addTypingIndicator();

        // Scroll to bottom
        twinChat.scrollTop = twinChat.scrollHeight;

        // Simulate thinking time
        setTimeout(() => {
            removeTypingIndicator(typingId);
            typeMessage(answers[qKey]);
            twinOptions.style.pointerEvents = 'all';
            twinOptions.style.opacity = '1';
        }, 1500);
    });

    // ===== Input Event Listeners =====
    twinSend.addEventListener('click', () => {
        sendUserMessage();
    });

    twinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // ===== Gemini API ile Mesaj Gönderme =====
    async function sendUserMessage() {
        const userMessage = twinInput.value.trim();
        if (!userMessage) return;

        // Mesajı ekle
        addMessage(userMessage, 'user-message');
        twinInput.value = '';

        // Disable input while processing
        twinInput.disabled = true;
        twinSend.disabled = true;

        // Typing indicator
        const typingId = addTypingIndicator();

        // ===== ÖNCELİKLE CUSTOM FAQ KONTROL ET =====
        const customAnswer = checkCustomFAQ(userMessage);
        if (customAnswer) {
            // FAQ'de bulundu, direkt cevabı ver
            setTimeout(() => {
                removeTypingIndicator(typingId);
                typeMessage(customAnswer);
                twinInput.disabled = false;
                twinSend.disabled = false;
                twinInput.focus();
            }, 800); // Kısa gecikme
            return;
        }

        try {
            // System prompt oluştur
            const systemPrompt = `Sen Yusuf Gül olarak cevap veriyorsun (1. tekil şahıs). 
Aşağıdaki bilgi kütüphanesini kullanarak, karakterine ve tarzına uygun, samimi ve profesyonel cevaplar ver.
İşe alım sürecinde bir HR yetkilisi veya potansiyel işverenle konuşuyorsun.

${JSON.stringify(knowledgeBase, null, 2)}

KRİTİK KURALLAR: 
- ASLA selamlaşma yapma (Merhaba, Selam vb. KULLANMA)
- Direkt soruya cevap ver
- ÇOK kısa ve öz yaz (maksimum 2-3 cümle)
- SADECE 1. tekil şahıs kullan ("Ben", "Benim", kendinden bahsederken ASLA "Yusuf" deme)
- Türkçe cevap ver
- Samimi ama profesyonel ol
- Emoji çok az kullan (sadece cümle sonunda 1 tane)

SINIRLAR:
- SADECE yukarıdaki bilgi kütüphanesindeki bilgileri kullan
- Kütüphanede olmayan bilgileri ASLA uydurma
- Eğer sorunun cevabı kütüphanede yoksa: "Bu konuda bilgim yok, benimle direkt görüşebilirsin."
- Profesyonel ve iş ile ilgili sorulara odaklan`;

            // Cloudflare Worker'a istek at
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: systemPrompt + "\n\nKullanıcı Sorusu: " + userMessage
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            // Candidate ve finish_reason kontrolü
            const candidate = data.candidates[0];
            const aiResponse = candidate.content.parts[0].text;
            const finishReason = candidate.finishReason;

            removeTypingIndicator(typingId);
            typeMessage(aiResponse);

            // Eğer cevap erken kesildiyse kullanıcıyı bilgilendir
            if (finishReason === 'MAX_TOKENS') {
                setTimeout(() => {
                    addMessage('(Cevap çok uzun olduğu için kısaltıldı. Daha fazla bilgi için Yusuf ile direkt iletişime geçebilirsin!) 💬', 'twin-message');
                }, 500);
            } else if (finishReason === 'SAFETY') {
                setTimeout(() => {
                    addMessage('(Bu konu hassas olabilir, daha detaylı görüşmek için Yusuf ile iletişime geçebilirsin!) ⚠️', 'twin-message');
                }, 500);
            }

        } catch (error) {
            console.error('Gemini API Error:', error);

            // Fallback: Basit anahtar kelime eşleştirme
            removeTypingIndicator(typingId);
            const fallbackResponse = getFallbackResponse(userMessage);
            typeMessage(fallbackResponse);
        } finally {
            // Re-enable input
            twinInput.disabled = false;
            twinSend.disabled = false;
            twinInput.focus();
        }
    }

    // ===== Custom FAQ Kontrol Fonksiyonu =====
    function checkCustomFAQ(message) {
        const lowerMsg = message.toLowerCase();

        // FAQ kütüphanesindeki tüm anahtarları kontrol et
        for (const [keyword, answer] of Object.entries(customFAQ)) {
            if (lowerMsg.includes(keyword.toLowerCase())) {
                return answer;
            }
        }

        return null; // Eşleşme yoksa null dön
    }

    // ===== Fallback Response System =====
    function getFallbackResponse(message) {
        const lowerMsg = message.toLowerCase();

        // Anahtar kelime eşleştirmeleri
        if (lowerMsg.includes('neden') || lowerMsg.includes('işe al') || lowerMsg.includes('hire')) {
            return answers.neden;
        }
        if (lowerMsg.includes('teknoloji') || lowerMsg.includes('skill') || lowerMsg.includes('yetenk') || lowerMsg.includes('stack')) {
            return answers.stack;
        }
        if (lowerMsg.includes('remote') || lowerMsg.includes('uzaktan') || lowerMsg.includes('çalış')) {
            return answers.remote;
        }
        if (lowerMsg.includes('hedef') || lowerMsg.includes('gelecek') || lowerMsg.includes('plan')) {
            return answers.hedef;
        }
        if (lowerMsg.includes('maaş') || lowerMsg.includes('ücret') || lowerMsg.includes('salary')) {
            return "Maaş beklentim deneyim ve pozisyona göre değişmekle birlikte, piyasa standartlarına uygun bir teklifi değerlendirebiliriz. En önemli faktör benim için projenin vizyonu ve gelişim fırsatları! 💼";
        }
        if (lowerMsg.includes('proje') || lowerMsg.includes('project')) {
            return "E-ticaret dashboard'u, AI chatbot ve sosyal medya analiz aracı gibi çeşitli projelerde çalıştım. Her projede farklı teknolojiler kullanarak hem teknik hem de problem çözme becerilerimi geliştirdim. Portfolio'mu GitHub'dan inceleyebilirsin! 🚀";
        }
        if (lowerMsg.includes('deneyim') || lowerMsg.includes('tecrübe') || lowerMsg.includes('experience')) {
            return "DigitalStack'te Frontend Developer ve DataInk Analytics'te Data Analyst olarak çalışıyorum. Ayrıca ByteWorks'te full-stack geliştirme deneyimim de var. Toplamda 1+ yıllık profesyonel tecrübem mevcut. 💪";
        }
        if (lowerMsg.includes('eğitim') || lowerMsg.includes('okul') || lowerMsg.includes('üniversite')) {
            return "Yıldız Teknik Üniversitesi Matematik Mühendisliği'nden 2024'te mezun oldum. Matematik alt yapım sayesinde algoritma ve veri bilimi konularında sağlam bir temele sahibim. 🎓";
        }

        // Varsayılan cevap
        return "Bu konuda bilgim yok, benimle direkt görüşebilirsin. 😊";
    }


    function addMessage(text, className) {
        const msg = document.createElement('div');
        msg.className = `message ${className}`;
        msg.textContent = text;
        twinChat.appendChild(msg);
        twinChat.scrollTop = twinChat.scrollHeight;
        return msg;
    }

    function addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message twin-message typing';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        twinChat.appendChild(indicator);
        twinChat.scrollTop = twinChat.scrollHeight;
        return 'typing-indicator';
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function typeMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message twin-message';
        twinChat.appendChild(msg);

        let i = 0;
        const speed = 30; // ms per character

        function type() {
            if (i < text.length) {
                msg.textContent += text.charAt(i);
                i++;
                twinChat.scrollTop = twinChat.scrollHeight;
                setTimeout(type, speed);
            } else {
                // Sadece "benimle direkt görüşebilirsin" içeren mesajlarda sosyal butonları göster
                if (text.includes('benimle direkt görüşebilirsin')) {
                    addSocialButtons(msg);
                }
            }
        }

        type();
    }

    // ===== Sosyal Medya Butonlarını Ekle =====
    function addSocialButtons(messageElement) {
        const socialContainer = document.createElement('div');
        socialContainer.className = 'twin-social-buttons';
        socialContainer.innerHTML = `
            <div class="twin-social-divider">
                <span>Benimle iletişime geç</span>
            </div>
            <div class="twin-social-links">
                <a href="mailto:zyusuf_16@hotmail.com" class="twin-social-btn" title="E-posta" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </a>
                <a href="https://www.linkedin.com/in/yusufgul/" class="twin-social-btn" title="LinkedIn" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                </a>
                <a href="https://github.com/yuusufgul16" class="twin-social-btn" title="GitHub" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </a>
                <a href="https://www.instagram.com/yyusufgull/?hl=tr" class="twin-social-btn" title="Instagram" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
            </div>
        `;
        messageElement.appendChild(socialContainer);
        twinChat.scrollTop = twinChat.scrollHeight;
    }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    init();
    initDigitalTwin();
});

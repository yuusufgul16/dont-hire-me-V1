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
    proofContents: document.querySelectorAll('.proof-content'),

    // Reasons Background
    reasonsBg: document.getElementById('reasons-bg'),

    // Intro Video
    introOverlay: document.getElementById('intro-overlay'),
    introVideo: document.getElementById('intro-video'),
    skipIntroBtn: document.getElementById('skip-intro'),
    muteIntroBtn: document.getElementById('mute-intro'),
    introStartOverlay: document.getElementById('intro-start-overlay'),
    startVideoBtn: document.getElementById('start-video-btn'),
    introControls: document.querySelector('.intro-controls'),
    whiteFlash: document.getElementById('white-flash'),

    // Language Toggle
    langToggle: document.getElementById('lang-toggle')
};

// ===== State =====
let currentIndex = 0;
let flippedCount = 0;
let flippedCards = new Set();
let escapeCount = parseInt(localStorage.getItem('contactCount') || '128');
let currentLang = localStorage.getItem('preferredLang') || 'tr';

const totalCards = elements.cards.length;

// ===== Initialize =====
function init() {
    // Intro video başlat
    initIntroVideo();

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

    // Language Toggle
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', switchLanguage);
        updateTranslations(); // Initial translation
    }
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
    escapeCount++;
    localStorage.setItem('contactCount', escapeCount);
    elements.escapeNumber.textContent = escapeCount;
    elements.contactReveal.classList.add('visible');
    elements.btnYes.style.display = 'none';
    elements.btnNo.style.display = 'none';
    createConfetti();

    // Google Analytics Event
    if (typeof gtag === 'function') {
        gtag('event', 'contact_click', {
            'event_category': 'Engagement',
            'event_label': 'Yes Button'
        });
    }
}

function handleNoClick() {
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

// ===== Language Switching =====
function switchLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('preferredLang', currentLang);
    updateTranslations();

    // Google Analytics Event
    if (typeof gtag === 'function') {
        gtag('event', 'language_switch', {
            'language': currentLang
        });
    }
}

function updateTranslations() {
    // Update button text
    const langBtnText = elements.langToggle.querySelector('.lang-text');
    if (langBtnText) {
        langBtnText.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update all elements with data-tr and data-en
    document.querySelectorAll('[data-tr]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            // Handle placeholders if it's an input
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else if (el.classList.contains('glitch-text')) {
                el.textContent = text;
                el.setAttribute('data-text', text);
            } else {
                el.innerHTML = text; // Use innerHTML to support <br> in some translations
            }
        }
    });

    // Update Digital Twin welcome message if open
    updateTwinLanguage();
}

function updateTwinLanguage() {
    const twinInput = document.getElementById('twin-input');
    if (twinInput) {
        twinInput.placeholder = currentLang === 'tr' ? "Yusuf'a bir soru sor..." : "Ask Yusuf a question...";
    }

    const twinNotification = document.getElementById('twin-notification');
    if (twinNotification) {
        twinNotification.textContent = currentLang === 'tr' ? "Merhaba! Ben Yusuf. Merak ettiğin bir şeyi sormak ister misin?" : "Hi! I'm Yusuf. Would you like to ask me anything?";
    }

    // Update initial message in chat if no messages except welcome
    const twinChat = document.getElementById('twin-chat');
    if (twinChat && twinChat.children.length === 1 && twinChat.children[0].classList.contains('twin-message')) {
        twinChat.children[0].textContent = currentLang === 'tr' ? "Merhaba! Ben Yusuf. Merak ettiğin bir şeyi sormak ister misin?" : "Hi! I'm Yusuf. Would you like to ask me anything?";
    }

    // Update social divider in twin chat if exists
    const socialDivider = document.querySelector('.twin-social-divider span');
    if (socialDivider) {
        socialDivider.textContent = currentLang === 'tr' ? "Benimle iletişime geç" : "Contact me";
    }
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
            github: "https://github.com/yuusufgul16",
            dijitalBio: "https://dijital.bio/yusufgul"
        },
        education: {
            university: "Bilecik Şeyh Edebali Üniversitesi",
            department: "Yönetim Bilişim Sistemleri",
            universityYears: "2020 - 2024",
            gpa: "3.42",
            activities: "Endüstri 4.0 ve Siber Güvenlik Kulübü",
            highSchool: "Orhangazi Mesleki ve Teknik Anadolu Lisesi",
            highSchoolDepartment: "Bilişim Teknolojileri / Web Tasarım ve Programlama",
            highSchoolYears: "2015 - 2019",
            highSchoolGrade: "88.82",
            highSchoolNote: "Okul Birincisi"
        },
        honors: [
            {
                title: "Onur Belgesi",
                issuer: "Bilecik Şeyh Edebali Üniversitesi",
                year: "2022-2023 Eğitim Öğretim Yılı",
                date: "Haziran 2023"
            },
            {
                title: "Yüksek Onur Belgesi",
                issuer: "Bilecik Şeyh Edebali Üniversitesi",
                year: "2020-2021 Eğitim Öğretim Yılı",
                date: "Haziran 2021"
            },
            {
                title: "Okul Birinciliği",
                issuer: "Orhangazi Mesleki ve Teknik Anadolu Lisesi",
                year: "Anadolu Teknik Programı",
                date: "Lise Mezuniyeti"
            }
        ],
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
        tr: {
            neden: "Çünkü ben sadece kod yazmıyorum, projeye bir ruh katıyorum. Sorunları henüz ortaya çıkmadan fark edip çözüm üretiyorum. Sıradan bir çalışan değil, projenin başarısı için en az senin kadar heyecan duyan bir takım arkadaşı arıyorsan doğru yerdesin. 🚀",
            stack: "Öncelikle Modern JavaScript (ES6+), React ve Node.js ekosistemine çok hakimim. Tasarım tarafında CSS/SCSS ile harikalar yaratabilirim. Ayrıca Python ve Veri Analizi konularında da kendimi geliştirmeye devam ediyorum. Her zaman yeni teknolojileri öğrenmeye açığım! 🛠️",
            remote: "Evet, kesinlikle! Uzun süredir uzaktan çalışma disiplinine sahibim. Asenkron iletişim araçlarını (Slack, Jira, GitHub vb.) ustalıkla kullanıyorum. Dünyanın neresinde olursan ol, aynı ofisteymişiz gibi verimli çalışabiliriz. 🏠",
            hedef: "Kısa vadede, global projelerde yer alarak teknik yetkinliklerimi en üst seviyeye çıkarmak istiyorum. Uzun vadede ise, teknoloji dünyasında iz bırakacak kendi girişimimi hayata geçirmek ve genç geliştiricilere mentorluk yapmak en büyük hayalim. 🎯"
        },
        en: {
            neden: "Because I don't just write code; I add soul to the project. I identify problems before they arise and create solutions. If you're looking for a teammate who's as excited about the project's success as you are, you're in the right place. 🚀",
            stack: "I'm highly proficient in the Modern JavaScript (ES6+), React, and Node.js ecosystem. I can work wonders with CSS/SCSS on the design side. I'm also continuing to develop myself in Python and Data Analysis. I'm always open to learning new technologies! 🛠️",
            remote: "Yes, absolutely! I've had a remote work discipline for a long time. I use asynchronous communication tools (Slack, Jira, GitHub, etc.) expertly. No matter where you are in the world, we can work as efficiently as if we were in the same office. 🏠",
            hedef: "In the short term, I want to reach the highest level of technical competence by participating in global projects. In the long term, my biggest dream is to launch my own startup that will leave a mark in the tech world and mentor young developers. 🎯"
        }
    };

    // ===== CACHE SİSTEMİ =====
    const CACHE_KEY = 'digital_twin_cache';
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 saat

    function getCache() {
        try {
            const cache = localStorage.getItem(CACHE_KEY);
            if (!cache) return {};
            const parsed = JSON.parse(cache);
            // Süresi geçmiş cache'i temizle
            if (parsed.expiry && Date.now() > parsed.expiry) {
                localStorage.removeItem(CACHE_KEY);
                return {};
            }
            return parsed.data || {};
        } catch (e) {
            return {};
        }
    }

    function setCache(key, value) {
        try {
            const cache = getCache();
            cache[key] = value;
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: cache,
                expiry: Date.now() + CACHE_EXPIRY
            }));
        } catch (e) {
            console.warn('Cache yazılamadı:', e);
        }
    }

    function normalizeQuestion(text) {
        return text.toLowerCase()
            .replace(/[?!.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function findCachedResponse(question) {
        const cache = getCache();
        const normalized = normalizeQuestion(question);

        // Tam eşleşme
        if (cache[normalized]) return cache[normalized];

        // Benzer soru arama (kelime bazlı)
        const words = normalized.split(' ').filter(w => w.length > 2);
        for (const [key, value] of Object.entries(cache)) {
            const keyWords = key.split(' ').filter(w => w.length > 2);
            const matchCount = words.filter(w => keyWords.includes(w)).length;
            if (matchCount >= Math.min(2, words.length * 0.6)) {
                return value;
            }
        }
        return null;
    }

    // ===== GENİŞLETİLMİŞ CUSTOM FAQ =====
    const customFAQ = {
        tr: {
            // === Hassas/Kişisel Bilgiler ===
            "yaş": "Bu kişisel bir bilgi, ama profesyonel deneyimim hakkında konuşabiliriz! 😊",
            "kaç yaşında": "Bu kişisel bir bilgi, ama profesyonel deneyimim hakkında konuşabiliriz! 😊",
            "evli": "Özel hayatımı paylaşmayı tercih etmiyorum, ama iş hayatımda çok disiplinli ve odaklıyım! 💼",
            "çocuk": "Kişisel durumum iş performansımı etkilemiyor, %100 profesyonel odağım var! 🎯",
            "maaş": "Piyasa standartlarına uygun beklentim var. Projenin vizyonu ve gelişim fırsatları en az maaş kadar önemli! 💰",
            "ücret": "Piyasa standartlarına uygun beklentim var. Projenin vizyonu ve gelişim fırsatları en az maaş kadar önemli! 💰",
            "salary": "Piyasa standartlarına uygun beklentim var. Projenin vizyonu ve gelişim fırsatları en az maaş kadar önemli! 💰",

            // === Kişisel Bilgiler ===
            "adın ne": "Ben Yusuf Gül, Yazılım Geliştirici ve Veri Analistiyim! 👋",
            "ismin ne": "Ben Yusuf Gül, Yazılım Geliştirici ve Veri Analistiyim! 👋",
            "kimsin": "Ben Yusuf Gül, Yazılım Geliştirici ve Veri Analistiyim! Veri bilimi, oyun tasarımı ve web teknolojileriyle yaratıcı projeler üretiyorum 🚀",

            // === Geniş Tanıtım Soruları ===
            "kendini tanıt": "Ben Yusuf Gül! 2024 Bilecik Şeyh Edebali Üniversitesi YBS mezunuyum. Python, JavaScript, SQL ve R biliyorum. Veri analizi, web geliştirme ve kendi çapımda oyun tasarımı yapabiliyorum. Teknofest yarı finaline çıkan 'Kurtuluş' oyununda görev aldım. Şu an LOOP adlı kendi girişimim üzerinde hobi olarak çalışıyorum. Global AI Hub'da mentorluk yaptım. Askerliğimi tamamladım. Uzaktan, hibrit veya yerinde çalışmaya açığım! 🚀",
            "kendinden bahset": "Ben Yusuf Gül! 2024 Bilecik Şeyh Edebali Üniversitesi YBS mezunuyum. Python, JavaScript, SQL ve R biliyorum. Veri analizi, web geliştirme ve kendi çapımda oyun tasarımı yapabiliyorum. Teknofest yarı finaline çıkan 'Kurtuluş' oyununda görev aldım. Şu an LOOP adlı kendi girişimim üzerinde hobi olarak çalışıyorum. Global AI Hub'da mentorluk yaptım. Askerliğimi tamamladım. Uzaktan, hibrit veya yerinde çalışmaya açığım! 🚀",
            "hakkında bilgi": "Ben Yusuf Gül! 2024 Bilecik Şeyh Edebali Üniversitesi YBS mezunuyum. Python, JavaScript, SQL ve R biliyorum. Veri analizi, web geliştirme ve kendi çapımda oyun tasarımı yapabiliyorum. Teknofest yarı finaline çıkan 'Kurtuluş' oyununda görev aldım. Şu an LOOP adlı kendi girişimim üzerinde hobi olarak çalışıyorum. Global AI Hub'da mentorluk yaptım. Askerliğimi tamamladım. Uzaktan, hibrit veya yerinde çalışmaya açığım! 🚀",
            "özet": "Yazılım Geliştirici & Veri Analisti. YBS mezunu. Python, JS, SQL, R. Teknofest yarı finalisti (Kurtuluş Oyunu). LOOP kurucusu. Global AI Hub mentoru. Askerlik tamamlandı. Uzaktan, hibrit veya yerinde çalışmaya açığım! 💼",
            "cv": "Yazılım Geliştirici & Veri Analisti. 2024 YBS mezunu. Python, JavaScript, SQL, R, HTML/CSS. Projeler: Kurtuluş (Teknofest yarı finali), Endemika, YouTube Metin Madenciliği, Crystal Miner. Deneyim: LOOP Kurucu, Yaşam Ağacı Oyun Tasarımcısı, Global AI Hub Mentor. Sertifikalar: Python Bootcamp, Google Cloud ML 📄",
            "resume": "Yazılım Geliştirici & Veri Analisti. 2024 YBS mezunu. Python, JavaScript, SQL, R, HTML/CSS. Projeler: Kurtuluş (Teknofest yarı finali), Endemika, YouTube Metin Madenciliği, Crystal Miner. Deneyim: LOOP Kurucu, Yaşam Ağacı Oyun Tasarımcısı, Global AI Hub Mentor. Sertifikalar: Python Bootcamp, Google Cloud ML 📄",
            "anlat": "Ben Yusuf Gül! Yazılım geliştirici ve veri analistiyim. Bilecik Şeyh Edebali Üniversitesi YBS 2024 mezunuyum. Python, JavaScript, SQL biliyorum. Teknofest yarı finaline çıkan Kurtuluş oyununda çalıştım. Şu an LOOP girişimimin kurucusuyum. Veri bilimi, oyun tasarımı ve web geliştirme alanlarında projeler üretiyorum 🎯",
            "özetle": "Yazılım Geliştirici & Veri Analisti. YBS mezunu. Python, JS, SQL, R. Teknofest yarı finalisti. LOOP kurucusu. Askerlik tamam. Uzaktan, hibrit veya yerinde çalışmaya açığım! 💼",
            "bana kendini tanıt": "Ben Yusuf Gül! 2024 Bilecik Şeyh Edebali Üniversitesi YBS mezunuyum. Python, JavaScript, SQL ve R biliyorum. Veri analizi, web geliştirme ve oyun tasarımı yapabiliyorum. Teknofest yarı finaline çıkan 'Kurtuluş' oyununda görev aldım. Şu an LOOP adlı kendi girişimim üzerinde çalışıyorum. Global AI Hub'da mentorluk yaptım. Askerliğimi tamamladım. Uzaktan, hibrit veya yerinde çalışmaya açığım! 🚀",
            "tanıt": "Ben Yusuf Gül! Yazılım geliştirici ve veri analistiyim. Bilecik Şeyh Edebali Üniversitesi YBS 2024 mezunuyum. Python, JavaScript, SQL biliyorum. Teknofest yarı finaline çıkan Kurtuluş oyununda çalıştım. LOOP kurucusuyum 🏆",

            // === Eğitim ===
            "eğitim": "Bilecik Şeyh Edebali Üniversitesi'nde Yönetim Bilişim Sistemleri okudum, 2024'te mezun oldum 🎓",
            "üniversite": "Bilecik Şeyh Edebali Üniversitesi'nde Yönetim Bilişim Sistemleri okudum, 2024'te mezun oldum 🎓",
            "okul": "Bilecik Şeyh Edebali Üniversitesi'nde Yönetim Bilişim Sistemleri okudum, 2024'te mezun oldum 🎓",
            "mezun": "2024'te Bilecik Şeyh Edebali Üniversitesi Yönetim Bilişim Sistemleri bölümünden mezun oldum 🎓",

            // === Askerlik ===
            "askerlik": "Askerliğimi tamamladım! 1'inci Ordu Tatbikat Kontrol Merkezi Komutanlığı'nda Onbaşı olarak görev yaptım ⭐",
            "asker": "Askerliğimi tamamladım! Pınarhisar'da Onbaşı olarak görev yaptım ⭐",

            // === Dil Becerileri ===
            "ingilizce": "A2 seviyesindeyim, aktif olarak geliştiriyorum. Teknik dokümantasyonu rahatlıkla okuyabiliyorum 📚",
            "english": "A2 seviyesindeyim, aktif olarak geliştiriyorum. Teknik dokümantasyonu rahatlıkla okuyabiliyorum 📚",
            "dil": "Türkçe ana dilim, İngilizce A2 seviyesinde ve aktif olarak geliştiriyorum 🌍",

            // === Teknik Beceriler ===
            "python": "Python benim ana dillerimden biri! Pandas, NumPy, Matplotlib, OpenCV ile çalışıyorum. Veri analizi ve otomasyon projelerinde kullanıyorum 🐍",
            "javascript": "Modern JavaScript (ES6+) ile frontend geliştirme yapıyorum. HTML/CSS ile birlikte dinamik web uygulamaları oluşturuyorum 💻",
            "sql": "SQL ile veri tabanı sorguları yazabiliyorum. Veri analizi projelerimde sıkça kullanıyorum 🗄️",
            "teknoloji": "Python, JavaScript, SQL, HTML/CSS, R biliyorum. Git, VS Code, Jupyter kullanıyorum. Veri bilimi ve web geliştirme odaklıyım 🛠️",
            "skill": "Python, JavaScript, SQL, HTML/CSS, R biliyorum. Pandas, NumPy, OpenCV gibi kütüphanelerde tecrübeliyim 💪",
            "yetenek": "Python, JavaScript, SQL, HTML/CSS, R biliyorum. Veri analizi, web geliştirme ve oyun tasarımı yapabiliyorum 🚀",
            "stack": "Frontend: JavaScript, HTML/CSS. Backend: Python. Veri: SQL, Pandas, NumPy. Araçlar: Git, VS Code, Jupyter 🛠️",
            "ne biliyorsun": "Python, JavaScript, SQL, R, HTML/CSS biliyorum. Veri analizi, metin madenciliği, web geliştirme ve oyun tasarımı yapabiliyorum! 💻",

            // === İş Deneyimi ===
            "deneyim": "LOOP'un kurucusuyum, Yaşam Ağacı'nda oyun tasarımı yaptım (Teknofest yarı finali!), Global AI Hub'da mentor oldum. LC Waikiki ve ORMO'da staj deneyimim var 💼",
            "tecrübe": "LOOP'un kurucusuyum, Yaşam Ağacı'nda oyun tasarımı yaptım (Teknofest yarı finali!), Global AI Hub'da mentor oldum. LC Waikiki ve ORMO'da staj deneyimim var 💼",
            "experience": "LOOP'un kurucusuyum, Yaşam Ağacı'nda oyun tasarımı yaptım (Teknofest yarı finali!), Global AI Hub'da mentor oldum 💼",
            "nerede çalıştın": "LOOP (Kurucu), Yaşam Ağacı (Oyun Tasarımcısı), Global AI Hub (Mentor), LC Waikiki (Lojistik), ORMO Group ve Orhangazi Belediyesi'nde staj yaptım 🏢",
            "iş": "LOOP'un kurucusuyum, kendi girişimim üzerinde çalışıyorum. Daha önce Yaşam Ağacı'nda oyun tasarımı, Global AI Hub'da mentorluk yaptım 💼",

            // === Projeler ===
            "proje": "Kurtuluş Oyunu (Teknofest yarı finali!), Endemika, YouTube Metin Madenciliği, Crystal Miner gibi projelerim var. GitHub'dan inceleyebilirsin! 🎮",
            "project": "Kurtuluş Oyunu (Teknofest yarı finali!), Endemika, YouTube Metin Madenciliği, Crystal Miner gibi projelerim var! 🎮",
            "kurtuluş": "Kurtuluş, BM Sürdürülebilir Kalkınma Hedefleri temalı mobil eğitim oyunu. Senaryo, tasarım ve test süreçlerinde görev aldım. Teknofest yarı finaline çıktık! 🏆",
            "endemika": "Endemika, Bilecik'in endemik bitkilerini tanıtan web platformu. QR kodlu saha erişimi ve AI ile bitki görsellerini videoya çevirdik 🌿",
            "crystal miner": "Crystal Miner, Eratosthenes Kalburu algoritmasını oyunlaştıran eğitici bir asal sayı bulma oyunu 💎",
            "github": "GitHub: github.com/yuusufgul16 - Projelerimi buradan inceleyebilirsin! 🔗",

            // === Sertifikalar ===
            "sertifika": "Python Bootcamp, Big Data & ML on Google Cloud, Veri Analizi, Python for ML sertifikalarım var. Milli Eğitim'den Bilgisayar İşletmenliği belgem de mevcut 📜",
            "certificate": "Python Bootcamp, Big Data & ML on Google Cloud, Veri Analizi sertifikalarım var 📜",

            // === Çalışma Tercihleri ===
            "remote": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Asenkron iletişim araçlarını verimli kullanabilirim 🏠",
            "uzaktan": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Slack, GitHub gibi araçlarla etkili iletişim kurabilirim 🏠",
            "hibrit": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Esneklik benim için önemli 🔄",
            "yerinde": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Her modele adapte olabilirim 🏢",
            "ofis": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Her modele adapte olabilirim 🏢",
            "çalışma şekli": "Uzaktan, hibrit veya yerinde çalışmaya açığım! Esneklik ve adaptasyon konusunda güçlüyüm 💪",

            // === Hedefler ===
            "hedef": "Kısa vadede global projelerde yer alarak teknik yetkinliklerimi geliştirmek, uzun vadede kendi tech startup'ımı kurmak istiyorum 🎯",
            "gelecek": "Teknoloji dünyasında iz bırakacak projeler üretmek ve genç geliştiricilere mentorluk yapmak en büyük hayalim 🌟",
            "plan": "Veri bilimi ve yapay zeka alanında uzmanlaşırken, kendi girişimimi büyütmeye devam etmek istiyorum 📈",
            "kariyer": "Veri bilimi, oyun tasarımı ve web teknolojilerini birleştirerek yaratıcı projeler üretmek istiyorum. Girişimcilik de hedeflerim arasında 🚀",

            // === Kişilik ===
            "güçlü yön": "Hızlı adaptasyon, analitik düşünme, takım çalışması ve liderlik güçlü yönlerim 💪",
            "zayıf yön": "Bazen aşırı detaycı olabiliyorum, ama bu projelerin kalitesini artırıyor 😅",
            "nasıl çalışırsın": "Detaycı, problem çözücü ve sürekli öğrenen bir yaklaşımım var. Karmaşık problemleri basit çözümlerle aşmayı seviyorum 🧠",

            // === İletişim ===
            "iletişim": "Email: zyusuf_16@hotmail.com | LinkedIn: linkedin.com/in/yusufgul | GitHub: github.com/yuusufgul16 📧",
            "email": "Email adresim: zyusuf_16@hotmail.com 📧",
            "linkedin": "LinkedIn: linkedin.com/in/yusufgul 🔗",
            "contact": "Email: zyusuf_16@hotmail.com | LinkedIn: linkedin.com/in/yusufgul 📧",

            // === Selamlaşma ===
            "merhaba": "Merhaba! Ben Yusuf'un dijital ikizi. Bana her şeyi sorabilirsin! 👋",
            "selam": "Selam! Yusuf hakkında ne öğrenmek istersin? 👋",
            "hello": "Hello! I'm Yusuf's digital twin. Feel free to ask anything! 👋",
            "nasılsın": "İyiyim, teşekkürler! Sana nasıl yardımcı olabilirim? 😊",

            // === Neden İşe Almalıyım ===
            "neden": "Çünkü sadece kod yazmıyorum, projeye ruh katıyorum. Sorunları ortaya çıkmadan fark edip çözüm üretiyorum. Takım arkadaşı arıyorsan doğru yerdesin! 🚀",
            "neden işe alayım": "Problem çözme odaklıyım, hızlı öğreniyorum ve projenin başarısı için gerçekten heyecan duyuyorum. Teknofest yarı finaline çıkan projede çalıştım! 🏆",
            "işe al": "Veri analizi, web geliştirme ve oyun tasarımı yapabiliyorum. Multidisipliner bakış açısı sunuyorum. Görüşmeye hazırım! 💼"
        },
        en: {
            "age": "That's personal information, but we can talk about my professional experience! 😊",
            "how old": "That's personal information, but we can talk about my professional experience! 😊",
            "married": "I prefer not to share my private life, but I am very disciplined and focused in my work life! 💼",
            "children": "My personal status does not affect my work performance; I have a 100% professional focus! 🎯",
            "salary": "I have expectations in line with market standards. The project's vision and growth opportunities are at least as important as the salary! 💰",
            "wage": "I have expectations in line with market standards. The project's vision and growth opportunities are at least as important as the salary! 💰",
            "name": "I'm Yusuf Gül, a Software Developer and Data Analyst! 👋",
            "who are you": "I'm Yusuf Gül, a Software Developer and Data Analyst! I create creative projects with data science, game design, and web technologies 🚀",
            "introduce yourself": "I'm Yusuf Gül! I graduated from Bilecik Seyh Edebali University in MIS in 2024. I know Python, JavaScript, SQL, and R. I can do data analysis, web development, and game design. I worked on the 'Kurtulus' game, which reached the Teknofest semi-finals. Currently, I'm working on my own startup called LOOP. I mentored at Global AI Hub. I've finished my military service. I'm open to remote, hybrid, or on-site work! 🚀",
            "hello": "Hello! I'm Yusuf's digital twin. You can ask me anything! 👋",
            "hi": "Hi! What would you like to learn about Yusuf? 👋",
            "how are you": "I'm fine, thanks! How can I help you? 😊",

            // === Education ===
            "education": "I studied Management Information Systems at Bilecik Seyh Edebali University and graduated in 2024 🎓",
            "university": "I studied Management Information Systems at Bilecik Seyh Edebali University and graduated in 2024 🎓",
            "school": "I studied Management Information Systems at Bilecik Seyh Edebali University and graduated in 2024 🎓",
            "graduate": "I graduated from Bilecik Seyh Edebali University, Department of Management Information Systems in 2024 🎓",

            // === Military Service ===
            "military service": "I have completed my military service! I served as a Corporal at the 1st Army Exercise Control Center Command ⭐",
            "military": "I have completed my military service! I served as a Corporal in Pınarhisar ⭐",

            // === Language Skills ===
            "english level": "I am at A2 level, actively improving. I can comfortably read technical documentation 📚",
            "language": "Turkish is my native language, English is at A2 level and I am actively improving it 🌍",

            // === Technical Skills ===
            "python": "Python is one of my main languages! I work with Pandas, NumPy, Matplotlib, OpenCV. I use it in data analysis and automation projects 🐍",
            "javascript": "I do frontend development with Modern JavaScript (ES6+). I create dynamic web applications with HTML/CSS 💻",
            "sql": "I can write database queries with SQL. I frequently use it in my data analysis projects 🗄️",
            "technology": "I know Python, JavaScript, SQL, HTML/CSS, R. I use Git, VS Code, Jupyter. I focus on data science and web development 🛠️",
            "skill": "I know Python, JavaScript, SQL, HTML/CSS, R. I have experience with libraries like Pandas, NumPy, OpenCV 💪",
            "abilities": "I can do data analysis, web development, and game design with Python, JavaScript, SQL, HTML/CSS, R 🚀",
            "stack": "Frontend: JavaScript, HTML/CSS. Backend: Python. Data: SQL, Pandas, NumPy. Tools: Git, VS Code, Jupyter 🛠️",
            "what do you know": "I know Python, JavaScript, SQL, R, HTML/CSS. I can do data analysis, text mining, web development, and game design! 💻",

            // === Work Experience ===
            "experience": "I am the founder of LOOP, I did game design at Yaşam Ağacı (Teknofest semi-finals!), I mentored at Global AI Hub. I have internship experience at LC Waikiki and ORMO 💼",
            "work experience": "I am the founder of LOOP, I did game design at Yaşam Ağacı (Teknofest semi-finals!), I mentored at Global AI Hub. I have internship experience at LC Waikiki and ORMO 💼",
            "where did you work": "I worked at LOOP (Founder), Yaşam Ağacı (Game Designer), Global AI Hub (Mentor), LC Waikiki (Logistics), and interned at ORMO Group and Orhangazi Municipality 🏢",
            "job": "I am the founder of LOOP, working on my own startup. Previously, I did game design at Yaşam Ağacı and mentored at Global AI Hub 💼",

            // === Projects ===
            "project": "I have projects like Kurtuluş Game (Teknofest semi-finals!), Endemika, YouTube Text Mining, Crystal Miner. You can check them on GitHub! 🎮",
            "kurtulus": "Kurtuluş is a mobile educational game themed on UN Sustainable Development Goals. I took part in scenario, design, and testing processes. We reached the Teknofest semi-finals! 🏆",
            "endemika": "Endemika is a web platform introducing Bilecik's endemic plants. We used QR code field access and AI to convert plant images into videos 🌿",
            "crystal miner": "Crystal Miner is an educational prime number finding game that gamifies the Sieve of Eratosthenes algorithm 💎",
            "github": "GitHub: github.com/yuusufgul16 - You can check my projects here! 🔗",

            // === Certifications ===
            "certification": "I have Python Bootcamp, Big Data & ML on Google Cloud, Data Analysis, Python for ML certifications. I also have a Computer Operator certificate from the Ministry of National Education 📜",

            // === Work Preferences ===
            "remote work": "I am open to remote, hybrid, or on-site work! I can efficiently use asynchronous communication tools 🏠",
            "remote": "I am open to remote, hybrid, or on-site work! I can communicate effectively with tools like Slack, GitHub 🏠",
            "hybrid": "I am open to remote, hybrid, or on-site work! Flexibility is important to me 🔄",
            "on-site": "I am open to remote, hybrid, or on-site work! I can adapt to any model 🏢",
            "office": "I am open to remote, hybrid, or on-site work! I can adapt to any model 🏢",
            "work style": "I am open to remote, hybrid, or on-site work! I am strong in flexibility and adaptation 💪",

            // === Goals ===
            "goal": "In the short term, I want to improve my technical competencies by participating in global projects, and in the long term, I want to establish my own tech startup 🎯",
            "future": "My biggest dream is to produce projects that will leave a mark in the technology world and mentor young developers 🌟",
            "plan": "While specializing in data science and artificial intelligence, I want to continue growing my own startup 📈",
            "career": "I want to create creative projects by combining data science, game design, and web technologies. Entrepreneurship is also among my goals 🚀",

            // === Personality ===
            "strengths": "Fast adaptation, analytical thinking, teamwork, and leadership are my strengths 💪",
            "weaknesses": "Sometimes I can be overly detail-oriented, but this improves the quality of projects 😅",
            "how do you work": "I have a detailed, problem-solving, and continuously learning approach. I like to overcome complex problems with simple solutions 🧠",

            // === Contact ===
            "contact": "Email: zyusuf_16@hotmail.com | LinkedIn: linkedin.com/in/yusufgul | GitHub: github.com/yuusufgul16 📧",
            "email": "My email address: zyusuf_16@hotmail.com 📧",
            "linkedin": "LinkedIn: linkedin.com/in/yusufgul 🔗",

            // === Why Hire Me ===
            "why": "Because I don't just write code; I add soul to the project. I identify problems before they arise and create solutions. If you're looking for a teammate, you're in the right place! 🚀",
            "why should i hire you": "I am problem-solving oriented, a fast learner, and genuinely excited about the success of the project. I worked on a project that reached the Teknofest semi-finals! 🏆",
            "hire me": "I can do data analysis, web development, and game design. I offer a multidisciplinary perspective. I am ready for an interview! 💼"
        }
    };


    twinBubble.addEventListener('click', () => {
        const blurOverlay = document.getElementById('twin-blur-overlay');
        twinModal.classList.toggle('hidden');

        // Toggle animation and blur overlay based on modal visibility
        if (twinModal.classList.contains('hidden')) {
            twinBubble.classList.remove('pausing');
            if (blurOverlay) blurOverlay.classList.remove('active');
        } else {
            twinBubble.classList.add('pausing');
            if (blurOverlay) blurOverlay.classList.add('active');
        }

        if (twinNotification) {
            twinNotification.style.display = 'none';
        }
    });

    closeTwin.addEventListener('click', () => {
        const blurOverlay = document.getElementById('twin-blur-overlay');
        twinModal.classList.add('hidden');
        twinBubble.classList.remove('pausing');
        if (blurOverlay) blurOverlay.classList.remove('active');
    });

    // Close modal when clicking on blur overlay
    document.getElementById('twin-blur-overlay')?.addEventListener('click', () => {
        const blurOverlay = document.getElementById('twin-blur-overlay');
        twinModal.classList.add('hidden');
        twinBubble.classList.remove('pausing');
        if (blurOverlay) blurOverlay.classList.remove('active');
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
            typeMessage(answers[currentLang][qKey]);
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

        // ===== 1. ÖNCELİKLE CUSTOM FAQ KONTROL ET =====
        const customAnswer = checkCustomFAQ(userMessage);
        if (customAnswer) {
            setTimeout(() => {
                removeTypingIndicator(typingId);
                typeMessage(customAnswer);
                twinInput.disabled = false;
                twinSend.disabled = false;
                twinInput.focus();
            }, 800);
            return;
        }

        // ===== 2. CACHE KONTROL ET =====
        const cachedResponse = findCachedResponse(userMessage);
        if (cachedResponse) {
            console.log('Cache hit:', userMessage);
            setTimeout(() => {
                removeTypingIndicator(typingId);
                typeMessage(cachedResponse);
                twinInput.disabled = false;
                twinSend.disabled = false;
                twinInput.focus();
            }, 600);
            return;
        }

        try {
            // System prompt oluştur
            const systemPrompt = `You are replying as Yusuf Gül (1st person). 
Use the knowledge base below to provide sincere and professional answers that fit your character and style.
You are talking to an HR representative or a potential employer during the hiring process.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

RESPONSE RULES:
- NEVER use greetings (Hello, Hi etc. DO NOT USE)
- Answer the question directly
- Keep it short and concise (max 2-3 sentences)
- Use ONLY 1st person ("I", "My", NEVER say "Yusuf" when talking about yourself)
- IMPORTANT: Reply in ${currentLang === 'tr' ? 'Turkish' : 'English'}
- Be sincere but professional
- You can use 1 emoji at the end of the sentence

IMPORTANT:
- Carefully examine ALL fields in the knowledge base above
- Find the answer in the library and reply accordingly
- Blend information to produce natural answers
- ONLY for topics NOT in the library at all: "${currentLang === 'tr' ? 'Bu konuda bilgim yok, benimle direkt görüşebilirsin.' : 'I don\'t have information on this subject, you can contact me directly.'}"`;

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

            // Debug: API response'u logla
            console.log('Gemini API Response:', data);

            // API response kontrolü
            if (!data.candidates || !data.candidates[0]) {
                console.error('API Response format error:', data);
                throw new Error('API yanıt formatı beklenenden farklı');
            }

            // Candidate ve finish_reason kontrolü
            const candidate = data.candidates[0];
            const aiResponse = candidate.content.parts[0].text;
            const finishReason = candidate.finishReason;

            // Başarılı yanıtı cache'e kaydet
            setCache(normalizeQuestion(userMessage), aiResponse);
            console.log('Response cached:', userMessage);

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
        const langFAQ = customFAQ[currentLang];

        // FAQ kütüphanesindeki tüm anahtarları kontrol et
        for (const [keyword, answer] of Object.entries(langFAQ)) {
            if (lowerMsg.includes(keyword.toLowerCase())) {
                return answer;
            }
        }

        return null; // Eşleşme yoksa null dön
    }

    // ===== Fallback Response System =====
    function getFallbackResponse(message) {
        const lowerMsg = message.toLowerCase();
        const activeAnswers = answers[currentLang];

        // Anahtar kelime eşleştirmeleri
        if (lowerMsg.includes('neden') || lowerMsg.includes('işe al') || lowerMsg.includes('hire') || lowerMsg.includes('why')) {
            return activeAnswers.neden;
        }
        if (lowerMsg.includes('teknoloji') || lowerMsg.includes('skill') || lowerMsg.includes('yeten') || lowerMsg.includes('stack') || lowerMsg.includes('tech')) {
            return activeAnswers.stack;
        }
        if (lowerMsg.includes('remote') || lowerMsg.includes('uzaktan') || lowerMsg.includes('çalış') || lowerMsg.includes('work')) {
            return activeAnswers.remote;
        }
        if (lowerMsg.includes('hedef') || lowerMsg.includes('gelecek') || lowerMsg.includes('plan') || lowerMsg.includes('goal') || lowerMsg.includes('future')) {
            return activeAnswers.hedef;
        }

        // Varsayılan cevap
        return currentLang === 'tr' ? "Bu konuda bilgim yok, benimle direkt görüşebilirsin. 😊" : "I don't have information on this subject, you can contact me directly. 😊";
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
                <a href="https://dijital.bio/yusufgul" class="twin-social-btn" title="Dijital Bio" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
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

// ===== Mobile Twin Visibility Control =====
function initMobileTwinVisibility() {
    const twinContainer = document.getElementById('twin-container');
    if (!twinContainer) return;

    function checkTwinVisibility() {
        // Sadece mobilde çalışsın
        if (window.innerWidth > 768) {
            twinContainer.style.display = '';
            twinContainer.style.opacity = '1';
            return;
        }

        const heroSection = document.getElementById('hero');
        const finalSection = document.getElementById('final');

        if (!heroSection || !finalSection) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const finalTop = finalSection.offsetTop;

        // Hero section'da veya final section'da ise göster
        const isInHero = scrollY < heroBottom - (windowHeight * 0.3);
        const isInFinal = scrollY + windowHeight > finalTop + (windowHeight * 0.3);

        if (isInHero || isInFinal) {
            twinContainer.style.display = '';
            twinContainer.style.opacity = '1';
            twinContainer.style.pointerEvents = 'auto';
        } else {
            twinContainer.style.opacity = '0';
            twinContainer.style.pointerEvents = 'none';
        }
    }

    // İlk kontrol
    checkTwinVisibility();

    // Scroll event
    window.addEventListener('scroll', checkTwinVisibility, { passive: true });

    // Resize event
    window.addEventListener('resize', checkTwinVisibility);
}

// ===== Intro Video Control =====
function initIntroVideo() {
    const { introOverlay, introVideo, skipIntroBtn, muteIntroBtn, introStartOverlay, startVideoBtn, introControls, whiteFlash } = elements;

    if (!introOverlay || !introVideo || !startVideoBtn) return;

    // Scroll kilitle
    document.body.classList.add('intro-active');

    let introFinished = false;

    const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;

        whiteFlash.classList.add('active');


        setTimeout(() => {
            introOverlay.classList.add('hidden');
            document.body.classList.remove('intro-active');
            introVideo.pause();

            // Skeleton loading'i aktif et
            const skeletonContainer = document.getElementById('skeleton-container');
            if (skeletonContainer) {
                skeletonContainer.classList.add('active');

                // 1.5 saniye sonra skeleton'ı kaldır
                setTimeout(() => {
                    skeletonContainer.classList.remove('active');
                    skeletonContainer.classList.add('hidden');

                    // DOM'dan temizle
                    setTimeout(() => {
                        skeletonContainer.remove();
                    }, 600);
                }, 1500);
            }

            setTimeout(() => {
                introOverlay.remove();
            }, 1000);
        }, 400);
    };

    // Video'yu Başlat (Kullanıcı Tıklamasıyla)
    startVideoBtn.addEventListener('click', () => {
        // Overlay'i kaldır
        introStartOverlay.classList.add('hidden');

        // Video oynuyor sınıfı ekle (filigran için)
        introOverlay.classList.add('video-playing');

        // Kontrolleri göster
        if (introControls) introControls.classList.remove('hidden');

        // Sesli olarak başlat ve ses düzeyini ayarla
        introVideo.muted = false;
        introVideo.volume = 0.1; // Ses seviyesini %10'a indirir
        introVideo.play().catch(error => {
            console.error("Video oynatılamadı:", error);
            // Hata olursa yine de devam etmeyi dene
            finishIntro();
        });
    });

    // Ses Aç/Kapat Butonu
    if (muteIntroBtn) {
        muteIntroBtn.addEventListener('click', () => {
            introVideo.muted = !introVideo.muted;
            const span = muteIntroBtn.querySelector('span');
            const svg = muteIntroBtn.querySelector('svg');

            if (introVideo.muted) {
                span.textContent = currentLang === 'tr' ? 'SESİ AÇ' : 'UNMUTE';
                svg.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
            } else {
                span.textContent = currentLang === 'tr' ? 'SESİ KAPAT' : 'MUTE';
                svg.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
            }
        });
    }

    // Video bitince bitir
    introVideo.addEventListener('ended', finishIntro);

    // Atla butonu ile bitir
    skipIntroBtn.addEventListener('click', finishIntro);
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.dataset.theme = savedTheme;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.dataset.theme;
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.dataset.theme = newTheme === 'dark' ? '' : newTheme;
            localStorage.setItem('theme', newTheme === 'dark' ? '' : newTheme);
        });
    }
}

// ===== Skeleton Loading Control =====
function initSkeletonLoading() {
    const skeletonContainer = document.getElementById('skeleton-container');
    const introOverlay = document.getElementById('intro-overlay');

    // Eğer intro video yoksa, skeleton'ı direkt göster ve kaldır
    if (!introOverlay && skeletonContainer) {
        skeletonContainer.classList.add('active');

        setTimeout(() => {
            skeletonContainer.classList.remove('active');
            skeletonContainer.classList.add('hidden');

            setTimeout(() => {
                skeletonContainer.remove();
            }, 600);
        }, 1500);
    }
    // Eğer intro video varsa, skeleton video bitişinde tetiklenecek (initIntroVideo içinde)
}

// ===== CV Mode Initialization =====
function initCVMode() {
    const cvToggle = document.getElementById('cv-toggle');
    const cvOverlay = document.getElementById('cv-overlay');
    const cvClose = document.getElementById('cv-close');
    const cvPrint = document.getElementById('cv-print');

    if (!cvToggle || !cvOverlay) return;

    // Open CV Mode
    cvToggle.addEventListener('click', () => {
        cvOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Google Analytics Event
        if (typeof gtag === 'function') {
            gtag('event', 'view_cv', {
                'event_category': 'Engagement',
                'event_label': 'CV Toggle'
            });
        }
    });

    // Close CV Mode
    cvClose?.addEventListener('click', () => {
        cvOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cvOverlay.classList.contains('hidden')) {
            cvOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Print CV
    cvPrint?.addEventListener('click', () => {
        window.print();
    });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    initSkeletonLoading();
    init();
    initDigitalTwin();
    initMobileTwinVisibility();
    initThemeToggle();
    initCVMode();
});

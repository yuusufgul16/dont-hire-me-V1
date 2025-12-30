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
            title: "Software Developer & Data Analyst",
            location: "Türkiye",
            email: "zyusuf_16@hotmail.com",
            linkedin: "https://www.linkedin.com/in/yusufgul/",
            github: "https://github.com/yuusufgul16"
        },
        education: {
            university: "Yıldız Teknik Üniversitesi",
            department: "Matematik Mühendisliği",
            graduationYear: "2024",
            gpa: "3.12"
        },
        skills: {
            programming: ["Python", "JavaScript", "SQL", "HTML/CSS", "R"],
            frameworks: ["React", "Node.js", "Flask", "Django"],
            tools: ["Git", "Docker", "VS Code", "Jupyter", "Tableau", "Power BI"],
            databases: ["MySQL", "PostgreSQL", "MongoDB"],
            dataScience: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Matplotlib", "Seaborn"],
            soft: ["Problem Solving", "Team Collaboration", "Fast Learning", "Analytical Thinking"]
        },
        experience: [
            {
                company: "DigitalStack",
                role: "Frontend Developer",
                duration: "Kasım 2024 - Devam Ediyor",
                description: "Modern web uygulamaları geliştirme, React ile component-based mimari kurma"
            },
            {
                company: "DataInk Analytics",
                role: "Data Analyst (Part-Time)",
                duration: "Eylül 2024 - Devam Ediyor",
                description: "Veri analizi ve görselleştirme, iş zekası raporları oluşturma"
            },
            {
                company: "ByteWorks",
                role: "Full Stack Developer Intern",
                duration: "Haziran 2024 - Ağustos 2024",
                description: "E-ticaret platformu geliştirme, API tasarımı"
            }
        ],
        projects: [
            {
                name: "E-Commerce Dashboard",
                description: "Gerçek zamanlı veri görselleştirme ve stok yönetim sistemi",
                tech: ["React", "Python", "PostgreSQL", "Chart.js"]
            },
            {
                name: "AI Customer Support Bot",
                description: "Doğal dil işleme ile müşteri destek asistanı",
                tech: ["Python", "TensorFlow", "Flask", "API Integration"]
            },
            {
                name: "Social Media Analytics Tool",
                description: "Twitter verilerini analiz eden sentiment analysis aracı",
                tech: ["Python", "Pandas", "Twitter API", "Matplotlib"]
            }
        ],
        personality: {
            workStyle: "Detaycı, problem çözücü, sürekli öğrenen",
            strengths: ["Hızlı adaptasyon", "Analitik düşünme", "Takım çalışması"],
            passion: "Veri bilimi ile web teknolojilerini birleştirerek kullanıcı deneyimini iyileştirmek",
            motivation: "Karmaşık problemleri basit, elegant çözümlerle aşmak"
        },
        preferences: {
            workModel: "Hibrit veya Remote (6 aydır remote çalışıyorum)",
            availability: "Hemen başlayabilirim",
            interests: ["Web3", "AI/ML", "Data Visualization", "Open Source"]
        }
    };

    // ===== Gemini API Configuration =====
    const GEMINI_API_KEY = "API_KEY_REMOVED";
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    // ===== Hazır Cevaplar (Gemini yoksa fallback) =====
    const answers = {
        neden: "Çünkü ben sadece kod yazmıyorum, projeye bir ruh katıyorum. Sorunları henüz ortaya çıkmadan fark edip çözüm üretiyorum. Sıradan bir çalışan değil, projenin başarısı için en az senin kadar heyecan duyan bir takım arkadaşı arıyorsan doğru yerdesin.",
        stack: "Öncelikle Modern JavaScript (ES6+), React ve Node.js ekosistemine çok hakimim. Tasarım tarafında CSS/SCSS ile harikalar yaratabilirim. Ayrıca Python ve Veri Analizi konularında da kendimi geliştirmeye devam ediyorum. Her zaman yeni teknolojileri öğrenmeye açığım!",
        remote: "Evet, kesinlikle! Uzun süredir uzaktan çalışma disiplinine sahibim. Asenkron iletişim araçlarını (Slack, Jira, GitHub vb.) ustalıkla kullanıyorum. Dünyanın neresinde olursan ol, aynı ofisteymişiz gibi verimli çalışabiliriz.",
        hedef: "Kısa vadede, global projelerde yer alarak teknik yetkinliklerimi en üst seviyeye çıkarmak istiyorum. Uzun vadede ise, teknoloji dünyasında iz bırakacak kendi girişimimi hayata geçirmek ve genç geliştiricilere mentorluk yapmak en büyük hayalim."
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

        try {
            // API key kontrolü
            if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
                throw new Error("API Key not configured");
            }

            // System prompt oluştur
            const systemPrompt = `Sen Yusuf Gül'ün dijital ikizi (digital twin) olarak görev yapan bir asistansın. 
Aşağıda Yusuf hakkında detaylı bilgiler var. Bu bilgileri kullanarak, Yusuf'un karakterine ve tarzına uygun, samimi ve profesyonel cevaplar ver.
İşe alım sürecinde bir HR yetkilisi veya potansiyel işverenle konuşuyormuş gibi davran.

${JSON.stringify(knowledgeBase, null, 2)}

Önemli: 
- Türkçe cevap ver
- Samimi ama profesyonel ol
- Kısa ve öz yaz (maksimum 3-4 cümle)
- İlk şahıs olarak konuş ("Ben...")
- Emoji kullanabilirsin ama abartma`;

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nKullanıcı Sorusu: ${userMessage}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            removeTypingIndicator(typingId);
            typeMessage(aiResponse);

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
        return "Bu soruyu henüz tam olarak yanıtlayamıyorum, ama Yusuf ile doğrudan iletişime geçerek daha detaylı bilgi alabilirsin! Ayrıca Gemini API key'i eklenirse daha akıllı cevaplar verebileceğim. 😊";
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
            }
        }

        type();
    }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    init();
    initDigitalTwin();
});

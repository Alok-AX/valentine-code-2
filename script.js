// Particle Animation
const particleCanvas = document.getElementById('particles');
const ctx = particleCanvas.getContext('2d');

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsla(${Math.random() * 60 + 300}, 100%, 70%, 0.8)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > particleCanvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > particleCanvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(255, 64, 129, ${1 - dist / 120})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// Global Variables
let userName = '';
let selectedVibe = '';
let quizAnswers = [];
let dateChoices = { location: '', activity: '', mood: '' };
let messageWords = ['', '', ''];
let memoryCount = 0;
let currentQuizQuestion = 0;

// Music Control
let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');

function toggleMusic() {
    if (!musicPlaying) {
        bgMusic.play().catch(e => console.log('Audio play failed'));
        musicPlaying = true;
    }
}

// Screen Navigation
function goToScreen(screenNum) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen${screenNum}`).classList.add('active');
    window.scrollTo(0, 0);
    toggleMusic();
}

// Screen 1: Start Journey
function startJourney() {
    console.log('Starting journey...');
    goToScreen(2);
}

// Screen 2: Save Name
function saveName() {
    const nameInput = document.getElementById('userName');
    userName = nameInput.value.trim();
    
    if (userName) {
        document.getElementById('displayName').textContent = userName;
        document.getElementById('name1').value = userName;
        goToScreen(3);
    } else {
        alert('Please enter your name, my love! 💕');
    }
}

// Allow Enter key to submit name
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('userName');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveName();
            }
        });
    }
});

// Screen 3: Select Vibe
function selectVibe(vibe, element) {
    console.log('Vibe selected:', vibe);
    document.querySelectorAll('.vibe-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    selectedVibe = vibe;
    document.getElementById('vibeNext').classList.remove('hidden');
}

// Screen 4: Quiz
const quizQuestions = [
    {
        q: "What makes our relationship special?",
        options: [
            "The way we understand each other without words 💭",
            "Our crazy adventures together 🎢",
            "How we can be silly and serious 🎭",
            "Everything! We're perfect together 💕"
        ],
        response: "Yes! That's what makes us so special! Our connection is truly one of a kind! 💖"
    },
    {
        q: "What's your favorite thing I do for you?",
        options: [
            "Surprise me with little things 🎁",
            "Make me laugh when I'm down 😂",
            "Listen to me and understand 👂",
            "All of the above and more! ✨"
        ],
        response: "I love doing everything for you! Your happiness is my happiness! 🥰"
    },
    {
        q: "If our love was a color, it would be...?",
        options: [
            "Passionate Red ❤️",
            "Dreamy Purple 💜",
            "Vibrant Pink 💖",
            "Rainbow - all colors! 🌈"
        ],
        response: "Our love is every color of the rainbow and more! So vibrant and beautiful! 🌟"
    },
    {
        q: "What's our couple superpower?",
        options: [
            "Making each other smile always 😊",
            "Supporting each other no matter what 🤝",
            "Creating amazing memories 📸",
            "Being each other's everything 💝"
        ],
        response: "Together we are unstoppable! We have all the superpowers when we're together! 💪"
    },
    {
        q: "Our future together will be...?",
        options: [
            "Full of adventure and excitement 🚀",
            "Peaceful and full of love 🕊️",
            "Better than any fairy tale 👑",
            "Absolutely perfect! ✨"
        ],
        response: "Our future is going to be AMAZING! I can't wait to spend forever with you! 💕"
    }
];

function loadQuiz() {
    currentQuizQuestion = 0;
    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuizQuestion >= quizQuestions.length) {
        setTimeout(() => goToScreen(5), 1000);
        return;
    }

    const question = quizQuestions[currentQuizQuestion];
    const progress = ((currentQuizQuestion + 1) / quizQuestions.length) * 100;

    document.getElementById('quizProgress').style.width = progress + '%';
    document.getElementById('currentQ').textContent = currentQuizQuestion + 1;
    document.getElementById('quizQuestion').textContent = question.q;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectQuizOption(optionDiv, question.response);
        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('quizResult').classList.add('hidden');
    document.querySelector('.quiz-box').style.display = 'block';
}

function selectQuizOption(element, response) {
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    setTimeout(() => {
        document.querySelector('.quiz-box').style.display = 'none';
        document.getElementById('quizResult').classList.remove('hidden');
        document.getElementById('resultMessage').textContent = response;
    }, 500);
}

function nextQuestion() {
    currentQuizQuestion++;
    showQuizQuestion();
}

// Initialize quiz when screen 4 becomes active
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'screen4' && mutation.target.classList.contains('active')) {
            loadQuiz();
        }
        if (mutation.target.id === 'screen11' && mutation.target.classList.contains('active')) {
            generateLetter();
        }
        if (mutation.target.id === 'screen12' && mutation.target.classList.contains('active')) {
            startFinale();
        }
    });
});

document.querySelectorAll('.screen').forEach(screen => {
    observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
});

// Screen 5: Heart Collector Game
let gameScore = 0;
let gameTime = 20;
let gameLevel = 1;
let gameActive = false;
let gameInterval;
let spawnInterval;
let basketPosition = 50;

function startGame() {
    if (gameActive) return;
    
    gameScore = 0;
    gameTime = 20;
    gameLevel = 1;
    gameActive = true;
    basketPosition = 50;

    document.getElementById('heartCount').textContent = gameScore;
    document.getElementById('gameTime').textContent = gameTime;
    document.getElementById('gameLevel').textContent = gameLevel;

    const basket = document.getElementById('basket');
    basket.style.left = '50%';

    // Clear any existing falling items
    document.querySelectorAll('.falling-item').forEach(item => item.remove());

    // Game timer
    gameInterval = setInterval(() => {
        gameTime--;
        document.getElementById('gameTime').textContent = gameTime;

        if (gameTime <= 0) {
            endGame();
        }

        // Level up every 5 seconds
        if (gameTime % 5 === 0 && gameTime > 0) {
            gameLevel++;
            document.getElementById('gameLevel').textContent = gameLevel;
        }
    }, 1000);

    // Spawn hearts
    spawnInterval = setInterval(spawnHeart, 1000);

    // Controls
    setupGameControls();
}

function setupGameControls() {
    const gameArea = document.getElementById('gameArea');
    const basket = document.getElementById('basket');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    // Mouse/Touch control
    gameArea.addEventListener('mousemove', (e) => {
        if (!gameActive) return;
        const rect = gameArea.getBoundingClientRect();
        basketPosition = ((e.clientX - rect.left) / rect.width) * 100;
        basketPosition = Math.max(10, Math.min(90, basketPosition));
        basket.style.left = basketPosition + '%';
    });

    gameArea.addEventListener('touchmove', (e) => {
        if (!gameActive) return;
        e.preventDefault();
        const rect = gameArea.getBoundingClientRect();
        const touch = e.touches[0];
        basketPosition = ((touch.clientX - rect.left) / rect.width) * 100;
        basketPosition = Math.max(10, Math.min(90, basketPosition));
        basket.style.left = basketPosition + '%';
    });

    // Button controls
    leftBtn.addEventListener('touchstart', () => moveBasket(-5));
    rightBtn.addEventListener('touchstart', () => moveBasket(5));
    leftBtn.addEventListener('mousedown', () => moveBasket(-5));
    rightBtn.addEventListener('mousedown', () => moveBasket(5));
}

function moveBasket(direction) {
    if (!gameActive) return;
    basketPosition += direction;
    basketPosition = Math.max(10, Math.min(90, basketPosition));
    document.getElementById('basket').style.left = basketPosition + '%';
}

function spawnHeart() {
    if (!gameActive) return;

    const gameArea = document.getElementById('gameArea');
    const heart = document.createElement('div');
    const hearts = ['💕', '❤️', '💖', '💝', '💗', '💘'];

    heart.className = 'falling-item';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 90 + 5 + '%';
    heart.style.top = '-40px';

    const duration = Math.max(2000 - (gameLevel * 100), 1000);
    heart.style.animationDuration = duration + 'ms';

    gameArea.appendChild(heart);

    const fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            heart.remove();
            return;
        }

        const heartRect = heart.getBoundingClientRect();
        const basketRect = document.getElementById('basket').getBoundingClientRect();

        // Check collision
        if (
            heartRect.bottom >= basketRect.top &&
            heartRect.top <= basketRect.bottom &&
            heartRect.right >= basketRect.left &&
            heartRect.left <= basketRect.right
        ) {
            gameScore += 10;
            document.getElementById('heartCount').textContent = gameScore;
            heart.remove();
            clearInterval(fallInterval);
            
            // Visual feedback
            const basket = document.getElementById('basket');
            basket.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                basket.style.transform = 'translateX(-50%) scale(1)';
            }, 100);
        }

        if (heartRect.top > gameArea.offsetHeight) {
            heart.remove();
            clearInterval(fallInterval);
        }
    }, 50);

    setTimeout(() => {
        heart.remove();
        clearInterval(fallInterval);
    }, duration);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    document.querySelectorAll('.falling-item').forEach(item => item.remove());

    setTimeout(() => {
        alert(`Amazing! You collected ${gameScore} hearts! 💕`);
        goToScreen(6);
    }, 500);
}

// Screen 6: Date Builder
function selectChoice(type, choice, element) {
    const cards = element.parentElement.querySelectorAll('.choice-card');
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    dateChoices[type] = choice;

    if (dateChoices.location && dateChoices.activity && dateChoices.mood) {
        document.getElementById('dateNext').classList.remove('hidden');
    }
}

// When going to screen 7, generate date result
document.addEventListener('DOMContentLoaded', () => {
    const screen7Observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'screen7' && mutation.target.classList.contains('active')) {
                generateDateResult();
            }
        });
    });

    const screen7 = document.getElementById('screen7');
    if (screen7) {
        screen7Observer.observe(screen7, { attributes: true, attributeFilter: ['class'] });
    }
});

function generateDateResult() {
    const locations = {
        beach: '🏖️ romantic beach with sunset views',
        mountain: '⛰️ peaceful mountain top with stunning views',
        city: '🌃 beautiful city with sparkling lights',
        home: '🏡 cozy home with warm ambiance'
    };

    const activities = {
        dinner: '🍽️ candlelit dinner with your favorite food',
        dance: '💃 dancing under the stars',
        movie: '🎬 movie marathon with cuddles',
        adventure: '🎢 thrilling adventure together'
    };

    const moods = {
        romantic: '🌹 filled with romance and love',
        fun: '🎊 full of laughter and joy',
        chill: '😌 relaxed and peaceful',
        exciting: '⚡ exciting and unforgettable'
    };

    const resultHTML = `
        <div style="font-size: 1.2em; line-height: 2;">
            <p>🌟 <strong>Our Perfect Date:</strong></p>
            <p>We'll go to a ${locations[dateChoices.location]},</p>
            <p>enjoying ${activities[dateChoices.activity]},</p>
            <p>and it will be ${moods[dateChoices.mood]}!</p>
            <p style="margin-top: 30px; font-size: 1.3em; color: var(--primary);">
                Can't wait to make this happen with you! 💕
            </p>
        </div>
    `;

    document.getElementById('dateResult').innerHTML = resultHTML;
}

// Screen 8: Message Builder
function selectWord(index, word, element) {
    const buttons = element.parentElement.querySelectorAll('.word-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    messageWords[index] = word;

    updateMessagePreview();

    if (messageWords[0] && messageWords[1] && messageWords[2]) {
        document.getElementById('messageNext').classList.remove('hidden');
    }
}

function updateMessagePreview() {
    const preview = document.getElementById('messagePreview');
    
    if (messageWords[0] && messageWords[1] && messageWords[2]) {
        preview.innerHTML = `
            <p style="font-size: 1.3em; line-height: 2;">
                Our love is <strong style="color: var(--primary);">${messageWords[0]}</strong>.<br>
                You make me feel <strong style="color: var(--secondary);">${messageWords[1]}</strong>.<br>
                Together we are <strong style="color: var(--accent);">${messageWords[2]}</strong>! 💕
            </p>
        `;
    }
}

// Screen 9: Memory Lane
function revealMemory(element, index) {
    if (element.classList.contains('revealed')) return;
    
    element.classList.add('revealed');
    memoryCount++;
    document.getElementById('memoryCount').textContent = memoryCount;

    if (memoryCount === 6) {
        setTimeout(() => {
            document.getElementById('memoryNext').classList.remove('hidden');
        }, 500);
    }
}

// Screen 10: Love Calculator
function calculateLove() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();

    if (!name1 || !name2) {
        alert('Please enter both names! 💕');
        return;
    }

    document.getElementById('calcResult').classList.remove('hidden');

    // Animate percentage
    let percentage = 0;
    const targetPercentage = 100;
    const interval = setInterval(() => {
        percentage += 2;
        if (percentage >= targetPercentage) {
            percentage = targetPercentage;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('calcNext').classList.remove('hidden');
            }, 1000);
        }

        document.getElementById('percentageText').textContent = percentage + '%';
        
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;
        document.getElementById('ringFill').style.strokeDashoffset = offset;
    }, 30);

    document.getElementById('calcVerdict').textContent = '💖 Perfect Match! 💖';
    document.getElementById('calcMessage').textContent = `${name1} and ${name2} are made for each other! Your love compatibility is off the charts! 🌟`;

    // Add SVG gradient
    const svg = document.querySelector('.percentage-ring svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.innerHTML = `
            <stop offset="0%" stop-color="#ff1744"/>
            <stop offset="100%" stop-color="#ff4081"/>
        `;
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
}

// Screen 11: Love Letter
function generateLetter() {
    const letterContent = `
        <h3>To My Beautiful ${userName || 'Queen'},</h3>
        <p>Every moment with you feels like a dream come true. You are the light of my life, the beat of my heart, and the reason I smile every day.</p>
        <p>Our love is ${messageWords[0] || 'amazing'}, you make me feel ${messageWords[1] || 'complete'}, and together we are ${messageWords[2] || 'perfect'}!</p>
        <p>Thank you for being you - for your kindness, your beauty (inside and out), your laughter, and for choosing to be with me.</p>
        <p>This Valentine's Day, I want you to know that you mean the world to me. You're not just my girlfriend, you're my best friend, my partner, and my forever.</p>
        <p>I love you more than words can say, and I can't wait to create a lifetime of memories with you! 💕</p>
        <p class="letter-signature">Forever and always,<br>Alok ❤️</p>
    `;

    document.getElementById('letterContent').innerHTML = letterContent;
}

function openLetter() {
    const envelope = document.getElementById('envelope');
    envelope.classList.add('opened');
    
    setTimeout(() => {
        document.getElementById('finalBtn').classList.remove('hidden');
    }, 2000);
}

// Screen 12: Grand Finale
function startFinale() {
    document.getElementById('finaleSubtitle').textContent = `${userName || 'My Love'}, You Are My Universe! 💖`;
    
    // Animate stats
    animateStat();
    
    // Create fireworks
    createFireworks();
    setInterval(createFireworks, 2000);
}

function animateStat() {
    let count = 0;
    const interval = setInterval(() => {
        count += 10;
        document.getElementById('stat1').textContent = count;
        if (count >= 365) {
            clearInterval(interval);
            document.getElementById('stat1').textContent = '∞';
        }
    }, 50);
}

function createFireworks() {
    const container = document.getElementById('fireworksContainer');
    const colors = ['#ff1744', '#ff4081', '#ff80ab', '#ffd700', '#00fff9'];
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);

    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = Math.random() * 100 + 50;

        firework.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
        firework.style.setProperty('--y', Math.sin(angle) * velocity + 'px');

        container.appendChild(firework);

        setTimeout(() => firework.remove(), 1500);
    }
}

function shareThis() {
    const shareText = `My boyfriend made me the most AMAZING Valentine's Day experience! 💕✨ Check out how romantic and creative he is! 😍 #ValentinesDay #BestBoyfriendEver #LoveGoals`;
    
    if (navigator.share) {
        navigator.share({
            title: "Valentine's Day Love Experience",
            text: shareText,
            url: window.location.href
        }).then(() => {
            alert('Thanks for sharing our love! 💕');
        }).catch(err => {
            copyToClipboard();
        });
    } else {
        copyToClipboard();
    }
}

function copyToClipboard() {
    const shareText = `My boyfriend made me the most AMAZING Valentine's Day experience! 💕✨ ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
        alert('Link copied! Now share it and flex! 💅💕');
    }).catch(() => {
        alert('Share this link with your friends: ' + window.location.href);
    });
}

function takeScreenshot() {
    alert('Take a screenshot now and share it on your Instagram story! 📸💕\n\nMake all your friends jealous! 😎✨');
}

function restartExperience() {
    location.reload();
}

console.log('Valentine Game Loaded! 💕');

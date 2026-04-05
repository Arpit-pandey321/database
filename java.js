// ========== LOADER ==========
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const fill = document.querySelector('.loader-fill');

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        fill.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initHero();
                }, 800);
            }, 500);
        }
    }, 200);
});



// ========== MUSIC CONTROLLER ==========
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

// Attempt autoplay on first interaction anywhere
document.body.addEventListener('click', function initMusic() {
    if (!isMusicPlaying) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicIcon.textContent = '🔊';
        }).catch(err => console.log("Autoplay prevented:", err));
    }
    document.body.removeEventListener('click', initMusic);
}, { once: true });

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering body click
    if (bgMusic.paused) {
        bgMusic.play();
        isMusicPlaying = true;
        musicIcon.textContent = '🔊';
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        musicIcon.textContent = '🔇';
    }
});

// ========== TYPEWRITER EFFECT (Hero) ==========
function initHero() {
    const greetingEl = document.getElementById('hero-greeting');
    // ✏️ EDIT: Change the greeting text if you want
    const text = "Hello Beautiful,";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            greetingEl.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
    createConfetti();
}

// ========== FLOATING HEARTS SYSTEM ==========
const heartsContainer = document.getElementById('hearts-container');
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    // Randomize appearance
    const hearts = ['❤️', '💕', '💖', '🌸', '✨'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    // Randomize size and duration
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}
// Create a heart every 3500ms
setInterval(createHeart, 3500);

// ========== CANVAS SPARKLES ==========
const sCanvas = document.getElementById('sparkle-canvas');
const sCtx = sCanvas.getContext('2d');
sCanvas.width = window.innerWidth;
sCanvas.height = window.innerHeight;

let particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * sCanvas.width;
        this.y = Math.random() * sCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = 'rgba(255, 182, 193, ' + Math.random() + ')';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.01;
        if (this.x < 0 || this.x > sCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > sCanvas.height) this.speedY *= -1;
    }
    draw() {
        sCtx.fillStyle = this.color;
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sCtx.fill();
    }
}
function initSparkles() {
    for (let i = 0; i < 15; i++) {
        particlesArray.push(new Particle());
    }
}
function handleSparkles() {
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(handleSparkles);
}
initSparkles();
handleSparkles();

// Interactive Sparkles on Touch
document.addEventListener('touchmove', (e) => {
    for (let i = 0; i < 3; i++) {
        const p = new Particle();
        p.x = e.touches[0].clientX + (Math.random() * 20 - 10);
        p.y = e.touches[0].clientY + (Math.random() * 20 - 10);
        p.size = Math.random() * 5 + 3;
        p.color = '#ff91a4';
        particlesArray.push(p);
    }
});

// ========== HERO CONFETTI ==========
function createConfetti() {
    const cCanvas = document.getElementById('confetti-canvas');
    const cCtx = cCanvas.getContext('2d');
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;

    // Only run confetti for a short time
    let confettis = [];
    const colors = ['#ff6b8a', '#ffd700', '#ffb6c1', '#fff'];

    for (let i = 0; i < 25; i++) {
        confettis.push({
            x: Math.random() * cCanvas.width,
            y: Math.random() * cCanvas.height - cCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            rotSpeed: Math.random() * 5 - 2
        });
    }

    function animate() {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        let active = false;
        confettis.forEach(c => {
            c.y += c.speed;
            c.angle += c.rotSpeed;
            if (c.y < cCanvas.height) active = true;

            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate(c.angle * Math.PI / 180);
            cCtx.fillStyle = c.color;
            cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            cCtx.restore();
        });
        if (active) requestAnimationFrame(animate);
    }
    animate();
}

// ========== ENVELOPE INTERACTION ==========
const envelope = document.getElementById('envelope-el');
const envLetter = document.getElementById('env-letter');
const envOpenBtn = document.getElementById('env-open-btn');
const envCloseBtn = document.getElementById('env-close-btn');

envOpenBtn.addEventListener('click', function () {
    envelope.classList.add('is-open');
    envOpenBtn.classList.add('hidden');
    envCloseBtn.classList.remove('hidden');

    // Spawn 3-4 hearts on open
    const rect = envelope.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.textContent = ['❤️', '💕', '💖'][Math.floor(Math.random() * 3)];
            h.style.position = 'fixed'; // to float over everything relative to viewport
            h.style.fontSize = (Math.random() * 20 + 20) + 'px';
            h.style.left = (rect.x + rect.width / 2) + 'px';
            h.style.top = (rect.y + rect.height / 2) + 'px';
            h.style.transform = `translate(-50%, -50%) translate(${Math.random() * 60 - 30}px, 0)`;
            h.style.animation = 'floatUp 2.5s forwards ease-out';
            h.style.pointerEvents = 'none';
            h.style.zIndex = '9999';
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 2500);
        }, i * 200);
    }
});

envCloseBtn.addEventListener('click', function () {
    envelope.classList.remove('is-open');
    envCloseBtn.classList.add('hidden');
    envOpenBtn.classList.remove('hidden');
});

// ========== GSAP SCROLL ANIMATIONS ==========
gsap.registerPlugin(ScrollTrigger);

// Reasons Cards
gsap.utils.toArray('.reason-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
    });
});

// Gallery Parallax
gsap.utils.toArray('.memory-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            scrub: 1
        },
        y: 100,
        opacity: 0,
        rotation: card.classList.contains('left') ? 10 : -10
    });
});

// ========== GROWING FLOWER ==========
const flowerStem = document.getElementById('flower-stem');
const grassBase = document.getElementById('grass-base');
const leafLeft = document.getElementById('leaf-left');
const leafRight = document.getElementById('leaf-right');
const leafLeft2 = document.getElementById('leaf-left-2');
const leafRight2 = document.getElementById('leaf-right-2');
const flowerHead = document.getElementById('flower-head');

ScrollTrigger.create({
    trigger: "#flower-section",
    start: "top 60%",
    onEnter: () => {
        // Show grass mound
        if (grassBase) { grassBase.style.opacity = '1'; grassBase.style.transform = 'translateY(0)'; }

        // Grow stem
        if (flowerStem) flowerStem.style.strokeDashoffset = '0';

        // Show leaves after stem starts sequentially
        setTimeout(() => {
            if (leafRight2) { leafRight2.style.opacity = '1'; leafRight2.style.transform = 'scale(1)'; }
        }, 500);
        setTimeout(() => {
            if (leafLeft) { leafLeft.style.opacity = '1'; leafLeft.style.transform = 'scale(1)'; }
        }, 800);
        setTimeout(() => {
            if (leafRight) { leafRight.style.opacity = '1'; leafRight.style.transform = 'scale(1)'; }
        }, 1100);
        setTimeout(() => {
            if (leafLeft2) { leafLeft2.style.opacity = '1'; leafLeft2.style.transform = 'scale(1)'; }
        }, 1400);

        // Pop flower head
        setTimeout(() => {
            if (flowerHead) { flowerHead.style.opacity = '1'; flowerHead.style.transform = 'scale(1)'; }
        }, 2000); // delayed perfectly to fit extra leaves
    },
    once: true // ensure it stays bloomed perfectly
});

// ========== CAKE INTERACTION ==========
const cakeStage = document.getElementById('cake-stage');
const flames = document.querySelectorAll('.flame');
const cakeHint = document.getElementById('cake-hint');
const cakeMsg = document.getElementById('cake-msg');
let candlesBlown = 0;

cakeStage.addEventListener('click', () => {
    if (candlesBlown >= flames.length) return;

    // Blow out one candle per tap, or all at once? Let's do a sequence
    if (candlesBlown === 0) {
        cakeHint.style.display = 'none';

        flames.forEach((flame, i) => {
            setTimeout(() => {
                flame.classList.add('off');
                candlesBlown++;

                // When last candle blows out
                if (candlesBlown === flames.length) {
                    cakeMsg.classList.remove('hidden');
                    createConfetti(); // reuse confetti function

                    // Sparkle burst around cake
                    for (let j = 0; j < 20; j++) {
                        const p = new Particle();
                        p.x = window.innerWidth / 2; p.y = window.innerHeight / 2;
                        p.speedX = (Math.random() - 0.5) * 10;
                        p.speedY = (Math.random() - 0.5) * 10;
                        p.size = Math.random() * 8 + 4;
                        p.color = '#ffd700';
                        particlesArray.push(p);
                    }
                }
            }, i * 300); // 300ms delay between each candle
        });
    }
});
// ========== SCRATCH REVEAL ==========
const scratchCanvas = document.getElementById('scratch-card');
if (scratchCanvas) {
    const sctx = scratchCanvas.getContext('2d');

    // Using a fixed size matching the CSS to avoid blurriness
    scratchCanvas.width = 320;
    scratchCanvas.height = 180;

    // Fill the canvas with a solid romantic gradient
    const grad = sctx.createLinearGradient(0, 0, 320, 180);
    grad.addColorStop(0, '#ff4778');
    grad.addColorStop(1, '#ff8fa3');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 320, 180);

    // Add instruction text
    sctx.fillStyle = '#ffffff';
    sctx.font = '24px "Playfair Display", serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('Scratch Here!', 160, 90);

    let isScratching = false;

    function getScratchPos(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        // Handle both touch and mouse safely
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Scale appropriately if canvas is visually resized
        const scaleX = scratchCanvas.width / rect.width;
        const scaleY = scratchCanvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function startScratch(e) {
        isScratching = true;
        doScratch(e);
    }

    function endScratch(e) {
        isScratching = false;
    }

    function doScratch(e) {
        if (!isScratching) return;
        e.preventDefault(); // prevent pinch zoom/scrolling while scratching
        const pos = getScratchPos(e);

        sctx.globalCompositeOperation = 'destination-out';
        sctx.beginPath();
        sctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2); // 25 is brush size
        sctx.fill();
    }

    // Mouse events
    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('mousemove', doScratch);
    scratchCanvas.addEventListener('mouseup', endScratch);
    scratchCanvas.addEventListener('mouseleave', endScratch);

    // Touch events for mobile
    scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });
    scratchCanvas.addEventListener('touchmove', doScratch, { passive: false });
    scratchCanvas.addEventListener('touchend', endScratch);
}



// ========== FINALE TYPEWRITER ==========
ScrollTrigger.create({
    trigger: "#finale-section",
    start: "top 60%",
    onEnter: () => {
        const finaleText = "Thank you for being the most amazing person in my life. I promise to love you, cherish you, and make you smile today, tomorrow, and for all the days to come. Happy Birthday. ❤️";
        const tyEl = document.getElementById('typewriter');
        let j = 0;

        // Clear text before typing
        tyEl.textContent = "";

        function finaleTypeWriter() {
            if (j < finaleText.length) {
                tyEl.innerHTML += finaleText.charAt(j);
                j++;
                setTimeout(finaleTypeWriter, 50);
            } else {
                gsap.to('.finale-sign', { opacity: 1, duration: 2 });
            }
        }
        finaleTypeWriter();
    },
    once: true
});

// ========== SURPRISE FEATURE ==========
const surpriseBtn = document.getElementById('surprise-btn');
const surpriseOverlay = document.getElementById('surprise-overlay');
const closeSurprise = document.getElementById('close-surprise');
const balloonsContainer = document.getElementById('balloons-container');
let surpriseIntervals = [];

surpriseBtn.addEventListener('click', () => {
    surpriseOverlay.classList.remove('hidden');
    // Allow for display:block to render before transitioning opacity
    setTimeout(() => {
        surpriseOverlay.classList.add('show');
    }, 20);

    // Create multiple bursts of confetti
    createConfetti();
    let confInt1 = setInterval(createConfetti, 1200);
    let confInt2 = setInterval(createConfetti, 1800);
    surpriseIntervals.push(confInt1, confInt2);

    // Spawn realistic balloons continuously
    spawnPartyBalloons(15); // initial burst
    let balInt = setInterval(() => spawnPartyBalloons(3), 800);
    surpriseIntervals.push(balInt);
});

closeSurprise.addEventListener('click', () => {
    surpriseOverlay.classList.remove('show');
    surpriseIntervals.forEach(clearInterval);
    surpriseIntervals = [];
    setTimeout(() => {
        surpriseOverlay.classList.add('hidden');
        balloonsContainer.innerHTML = ''; // clear out old balloons
    }, 500);
});

function spawnPartyBalloons(count) {
    const colors = ['#ff4778', '#ff8fa3', '#ffd700', '#00e5ff', '#b388ff', '#00e676'];
    for (let i = 0; i < count; i++) {
        const b = document.createElement('div');
        b.classList.add('party-balloon');
        const c = colors[Math.floor(Math.random() * colors.length)];
        b.style.setProperty('--b-color', c);
        b.style.left = (Math.random() * 90 + 5) + 'vw';
        b.style.setProperty('--duration', (Math.random() * 3 + 4) + 's');
        balloonsContainer.appendChild(b);
        // clean up balloons after they float off screen
        setTimeout(() => b.remove(), 7000);
    }
}

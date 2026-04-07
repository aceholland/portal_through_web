document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // STATE & DOM ELEMENTS
    // =========================================================================
    const state = {
        currentAct: 1,
        selectedYear: 1991,
        birthYear: null,
        mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        particles: [],
        eraIndex: 0
    };

    const eras = [
        { year: 1991, max: 1994, class: 'era-1991', title: 'Welcome to the World Wide Web', desc: 'The web is a way of organizing information.', btn: 'Index', footer: '© CERN' },
        { year: 1995, max: 1999, class: 'era-1995', title: 'Welcome 2 My Homepage', desc: 'Under Construction!', btn: 'Sign Guestbook', footer: 'Best viewed in Netscape Navigator' },
        { year: 2000, max: 2004, class: 'era-2000', title: 'LOADING EXPERIENCE', desc: 'Please wait...', btn: 'SKIP INTRO', footer: 'Optimized for Flash Player 5' },
        { year: 2005, max: 2009, class: 'era-2005', title: 'Connect & Share', desc: 'Beta', btn: 'Sign Up Free!', footer: 'Web 2.0 Revolution' },
        { year: 2010, max: 2014, class: 'era-2010', title: 'A better way to work.', desc: 'Simple, flat, and beautiful.', btn: 'Get Started', footer: 'Terms | Privacy' },
        { year: 2015, max: 2019, class: 'era-2015', title: 'Trusted by 10,000+ teams', desc: 'The ultimate product solution.', btn: 'View Pricing', footer: 'Made with ♥' },
        { year: 2020, max: 2025, class: 'era-2020', title: 'You are here.', desc: 'The web is waking up.', btn: 'Enter Void', footer: 'Singularity' }
    ];

    const acts = {
        1: document.getElementById('act1-void'),
        2: document.getElementById('act2-input'),
        3: document.getElementById('act3-portal'),
        4: document.getElementById('act4-eras'),
        5: document.getElementById('act5-mirror')
    };

    // =========================================================================
    // CUSTOM CURSOR
    // =========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let ringPos = { x: state.mouse.x, y: state.mouse.y };

    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        cursorDot.style.left = `${state.mouse.x}px`;
        cursorDot.style.top = `${state.mouse.y}px`;
    });

    document.querySelectorAll('a, button, input, .cal-day').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });

    function renderCursor() {
        // Lag effect for ring
        ringPos.x += (state.mouse.x - ringPos.x) * 0.15;
        ringPos.y += (state.mouse.y - ringPos.y) * 0.15;
        cursorRing.style.left = `${ringPos.x}px`;
        cursorRing.style.top = `${ringPos.y}px`;
        
        if (state.currentAct === 4 && state.selectedYear >= 2020) updateAntigravity();
        if (state.currentAct === 4 && state.selectedYear >= 2020) renderParticles();

        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // =========================================================================
    // ACT 1: THE VOID (Typing)
    // =========================================================================
    const lines = [
        "The web has existed for every year of your life.",
        "But you've never seen it the way it began.",
        "Tell us when you arrived."
    ];
    let typeLineIdx = 0;
    
    function typeText(lineStr, elId, callback) {
        const el = document.getElementById(elId);
        el.classList.add('typing');
        let charIdx = 0;
        const interval = setInterval(() => {
            el.innerHTML += lineStr.charAt(charIdx);
            charIdx++;
            if (charIdx >= lineStr.length) {
                clearInterval(interval);
                el.classList.remove('typing');
                setTimeout(callback, 800);
            }
        }, 50); // fast retro typing
    }

    function startAct1() {
        setTimeout(() => {
            typeText(lines[0], 'void-text-1', () => {
                typeText(lines[1], 'void-text-2', () => {
                    typeText(lines[2], 'void-text-3', () => {
                        // Move to Act 2
                        setTimeout(startAct2, 1000);
                    });
                });
            });
        }, 1000);
    }
    startAct1();

    // =========================================================================
    // ACT 2: INPUT RITUAL (Dial & Calendar)
    // =========================================================================
    function startAct2() {
        acts[1].classList.remove('active');
        acts[2].classList.add('active');
        setTimeout(() => {
            document.querySelector('.ritual-container').classList.add('visible');
        }, 100);
    }

    // Dial Setup
    const dial = document.getElementById('dial');
    const minYear = 1991, maxYear = 2025;
    const totalYears = maxYear - minYear + 1;
    const degPerYear = 360 / totalYears;
    
    for (let y = minYear; y <= maxYear; y++) {
        const tick = document.createElement('div');
        tick.className = `dial-tick ${y % 5 === 0 ? 'major' : ''}`;
        if (y === minYear) tick.classList.add('active');
        const deg = (y - minYear) * degPerYear;
        tick.style.transform = `rotate(${deg}deg)`;
        tick.innerHTML = `<span>${y}</span>`;
        dial.appendChild(tick);
    }

    // Dial Physics
    const dialState = {
        isDragging: false,
        startAngle: 0,
        currentRotation: 0,
        velocity: 0,
        lastTime: 0,
        lastAngle: 0
    };

    function getAngle(x, y) {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
    }

    dial.addEventListener('mousedown', (e) => {
        dialState.isDragging = true;
        dialState.startAngle = getAngle(e.clientX, e.clientY) - dialState.currentRotation;
        dialState.velocity = 0;
    });

    window.addEventListener('mousemove', (e) => {
        if (!dialState.isDragging) return;
        const currentA = getAngle(e.clientX, e.clientY);
        const newRotation = currentA - dialState.startAngle;
        
        const now = Date.now();
        const dt = now - dialState.lastTime;
        if (dt > 0) {
            let deltaA = newRotation - dialState.lastAngle;
            // Handle wrap around
            if (deltaA > 180) deltaA -= 360;
            if (deltaA < -180) deltaA += 360;
            dialState.velocity = deltaA / dt;
            dialState.lastTime = now;
            dialState.lastAngle = newRotation;
        }

        dialState.currentRotation = newRotation;
        applyDialRotation();
    });

    window.addEventListener('mouseup', () => {
        dialState.isDragging = false;
        requestAnimationFrame(updateDialPhysics);
    });

    function applyDialRotation() {
        // Enforce bounds (with slight bounce)
        const minRot = -(totalYears - 1) * degPerYear;
        const maxRot = 0; // 1991 is at 0
        
        let rot = dialState.currentRotation;
        dial.style.transform = `rotate(${rot}deg)`;

        // Calculate selected year
        let normalizedRot = -rot;
        while(normalizedRot < 0) normalizedRot += 360;
        let p = Math.round(normalizedRot / degPerYear);
        if (p < 0) p = 0;
        if (p > totalYears - 1) p = totalYears - 1;
        
        const newYear = minYear + p;
        if (newYear !== state.selectedYear) {
            state.selectedYear = newYear;
            updateCalendarText();
            // Pulse sound simulated via CSS
            document.querySelectorAll('.dial-tick').forEach((t, i) => {
                t.classList.toggle('active', i === p);
            });
        }
    }

    function updateDialPhysics() {
        if (dialState.isDragging) return;

        // Friction
        dialState.velocity *= 0.95;
        
        const minRot = -(totalYears - 1) * degPerYear;
        const maxRot = 0;
        
        // Snap to grid
        if (Math.abs(dialState.velocity) < 0.1) {
            let normalizedRot = -dialState.currentRotation;
            let targetRot = -Math.round(normalizedRot / degPerYear) * degPerYear;
            
            // Bounds
            if (targetRot > maxRot) targetRot = maxRot;
            if (targetRot < minRot) targetRot = minRot;

            dialState.currentRotation += (targetRot - dialState.currentRotation) * 0.1;
            
            if (Math.abs(targetRot - dialState.currentRotation) < 0.5) {
                dialState.currentRotation = targetRot;
                dialState.velocity = 0;
            }
        } else {
            dialState.currentRotation += dialState.velocity * 16; // 16ms approx
        }

        applyDialRotation();
        if (Math.abs(dialState.velocity) > 0 || Math.abs(dialState.currentRotation - Math.round(dialState.currentRotation)) > 0.5) {
            requestAnimationFrame(updateDialPhysics);
        }
    }

    // Calendar
    const calYear = document.getElementById('cal-year');
    const calMonth = document.getElementById('cal-month');
    const calPages = document.querySelector('.calendar-pages');
    const calendar = document.getElementById('calendar');

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let currentMonthIdx = 0;

    function renderCalPages() {
        calPages.innerHTML = '';
        for(let i=1; i<=31; i++) {
            const div = document.createElement('div');
            div.className = 'cal-day';
            div.textContent = i;
            div.addEventListener('click', stampCalendar);
            calPages.appendChild(div);
        }
    }
    renderCalPages();

    function updateCalendarText() {
        calYear.textContent = state.selectedYear;
    }

    function flipCalendar(dir) {
        calendar.classList.add('flipping');
        setTimeout(() => {
            currentMonthIdx = (currentMonthIdx + dir + 12) % 12;
            calMonth.textContent = months[currentMonthIdx];
            calendar.classList.remove('flipping');
        }, 300);
    }

    document.getElementById('cal-prev').addEventListener('click', () => flipCalendar(-1));
    document.getElementById('cal-next').addEventListener('click', () => flipCalendar(1));

    function stampCalendar() {
        calendar.classList.add('stamped');
        setTimeout(() => {
            checkReadyState();
        }, 500);
    }

    // Birth Year Input
    const birthInput = document.getElementById('birth-year-input');
    const btnPortal = document.getElementById('btn-open-portal');

    birthInput.addEventListener('input', () => {
        state.birthYear = parseInt(birthInput.value);
        checkReadyState();
    });

    function checkReadyState() {
        const birthOk = !birthInput.value || (state.birthYear >= 1900 && state.birthYear <= 2025);
        if (calendar.classList.contains('stamped') && birthOk) {
            btnPortal.classList.remove('disabled');
        } else {
            btnPortal.classList.add('disabled');
        }
    }

    btnPortal.addEventListener('click', () => {
        if (!btnPortal.classList.contains('disabled')) {
            startAct3();
        }
    });

    // =========================================================================
    // ACT 3: THE PORTAL
    // =========================================================================
    function startAct3() {
        acts[2].classList.remove('active');
        acts[3].classList.add('active');
        
        const msgEl = document.getElementById('portal-message');
        let msg = "";
        
        if (state.selectedYear === state.birthYear) {
            msg = "This is what the internet looked like the day you were born.";
        } else if (state.selectedYear > state.birthYear) {
            let age = state.selectedYear - state.birthYear;
            msg = `You were ${age} years old. This was your internet.`;
        } else if (state.selectedYear < state.birthYear) {
            msg = "You weren't here yet. But the web was already alive.";
        }
        
        if (state.selectedYear === 2025) { // Assuming 2025 as current
            msg = "You are already here. You never left.";
        }

        msgEl.textContent = msg;

        const tearOverlay = document.querySelector('.portal-tear-overlay');
        tearOverlay.classList.add('pulsing'); // wait 1.5s
        
        setTimeout(() => {
            tearOverlay.classList.remove('pulsing');
            tearOverlay.classList.add('exploding');
            
            // Show Message
            msgEl.style.opacity = 1;

            setTimeout(() => {
                msgEl.style.opacity = 0;
                setTimeout(() => {
                    startAct4();
                }, 2000);
            }, 3000);

        }, 1500);
    }

    // =========================================================================
    // ACT 4: THE ERAS
    // =========================================================================
    const wrapper = document.getElementById('era-wrapper');
    const progressFill = document.getElementById('era-progress');
    const eraIndicator = document.getElementById('era-indicator');
    
    function startAct4() {
        state.currentAct = 4;
        acts[3].classList.remove('active');
        acts[4].classList.add('active');
        
        // Find which era applies
        let eIdx = 0;
        for (let i=0; i<eras.length; i++) {
            if (state.selectedYear >= eras[i].year && state.selectedYear <= eras[i].max) {
                eIdx = i;
                break;
            }
        }
        console.log(`[First Click] Selected year: ${state.selectedYear} → Era index: ${eIdx} (${eras[eIdx].class})`);
        state.eraIndex = eIdx;
        loadEra(eIdx);

        // Auto progress to Act 5 after some time
        progressFill.style.transition = 'width 10s linear';
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 100);

        setTimeout(() => {
            startAct5();
        }, 10000); // 10 seconds in era
    }

    function loadEra(index) {
        const era = eras[index];
        // Clean all era classes
        eras.forEach(item => wrapper.classList.remove(item.class));
        wrapper.classList.add(era.class);
        
        document.getElementById('era-title').textContent = era.title;
        document.getElementById('era-card-title').textContent = era.title;
        document.getElementById('era-card-desc').textContent = era.desc;
        document.querySelector('.era-btn').textContent = era.btn;
        document.getElementById('era-footer-text').textContent = era.footer;
        
        eraIndicator.textContent = `${state.selectedYear} · ERA ${index+1}/7`;
        console.log(`[First Click] Loaded era class: ${era.class}`);

        if (era.class === 'era-2020') {
            initParticles();
        }
    }

    // Antigravity Logic
    function updateAntigravity() {
        const els = document.querySelectorAll('.antigrav-el');
        els.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width/2;
            const cy = rect.top + rect.height/2;
            const dx = state.mouse.x - cx;
            const dy = state.mouse.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            const maxDist = 300;
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                const pushX = -(dx/dist) * force * 50;
                const pushY = -(dy/dist) * force * 50;
                el.style.transform = `translate(${pushX}px, ${pushY}px)`;
            } else {
                el.style.transform = `translate(0px, 0px)`;
            }
        });
    }

    // Canvas Particles
    const canvas = document.getElementById('era-canvas');
    const ctx = canvas.getContext('2d');
    
    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        state.particles = [];
        for(let i=0; i<150; i++) {
            state.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#bd00ff' : '#00ffcc'
            });
        }
    }

    function renderParticles() {
        if (!acts[4].classList.contains('active') || state.selectedYear < 2020) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Mouse Repel
            const dx = state.mouse.x - p.x;
            const dy = state.mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                p.x -= (dx/dist) * 2;
                p.y -= (dy/dist) * 2;
            }

            // Bounds
            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    window.addEventListener('resize', () => {
        if (state.currentAct === 4 && state.selectedYear >= 2020) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

    // =========================================================================
    // ACT 5: THE MIRROR
    // =========================================================================
    function startAct5() {
        state.currentAct = 5;
        acts[4].classList.remove('active');
        acts[5].classList.add('active');

        // Sequencing text fades
        const texts = [
            document.getElementById('mt-1'),
            document.getElementById('mt-2'),
            document.getElementById('mt-3'),
            document.getElementById('mt-4')
        ];

        let delay = 1000;
        texts.forEach((t, i) => {
            setTimeout(() => {
                t.style.opacity = 1;
            }, delay);
            delay += 2500;
        });

        // Zoom into tab
        setTimeout(() => {
            document.getElementById('browser-mockup').classList.add('zoom-in');
            
            setTimeout(() => {
                document.querySelector('.mirror-outro').classList.add('visible');
            }, 3000);
        }, delay + 1000);
    }

    document.getElementById('btn-restart').addEventListener('click', () => {
        // Simple reload for true "re-birth"
        window.location.reload();
    });
});

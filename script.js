// --- 🎵 MOTOR DE AUDIO (SINTETIZADOR NATIVO) 🎵 ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Desbloquear el audio en el primer toque de la pantalla (requerido por los navegadores)
        document.body.addEventListener('click', () => { if (audioCtx.state === 'suspended') audioCtx.resume(); }, { once: true });

        function playTone(freq, type, duration, vol, startTimeDelay) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTimeDelay);
            
            gain.gain.setValueAtTime(vol, audioCtx.currentTime + startTimeDelay);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTimeDelay + duration);
            
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + startTimeDelay);
            osc.stop(audioCtx.currentTime + startTimeDelay + duration);
        }

        // 🔘 SONIDO DE INTERACCIÓN (CLIC/POP)
        function soundClick() {
            playTone(600, 'sine', 0.05, 0.05, 0); // Sonido cortito y suave
        }

        // DETECTOR GLOBAL DE CLICS (Para que suene en botones y tarjetas)
        document.addEventListener('click', (e) => {
            // Verifica si lo que tocamos es un botón, una tarjeta o un menú
            const isClickable = e.target.closest('button') || e.target.closest('.routine-card') || e.target.closest('.daily-mission-card') || e.target.closest('.nav-item-mob');
            const isBell = e.target.closest('.bell-btn'); // Excluimos la campana
            
            if (isClickable && !isBell) {
                soundClick();
            }
        });

        function soundToggleOn() {
            playTone(659.25, 'sine', 0.15, 0.1, 0);   
            playTone(880.00, 'sine', 0.3, 0.1, 0.1);  
        }

        function soundToggleOff() {
            playTone(440.00, 'sine', 0.15, 0.1, 0);   
            playTone(329.63, 'sine', 0.3, 0.1, 0.1);  
        }

        function soundVictory() {
            playTone(523.25, 'sine', 0.3, 0.2, 0);    
            playTone(659.25, 'sine', 0.3, 0.2, 0.15); 
            playTone(783.99, 'sine', 0.3, 0.2, 0.3);  
            playTone(1046.50, 'sine', 0.6, 0.2, 0.45);
        }

        function soundAlert() {
            playTone(800, 'square', 0.2, 0.05, 0);
            playTone(800, 'square', 0.2, 0.05, 0.3);
        }

        // --- BASE DE DATOS Y ESTADO ---
        const routines = [
            { id: 1, title: "Respiración Profunda 🌬️", desc: "Inhalar, retener, exhalar.", duration: 120, icon: "fa-wind", color: "#38bdf8" },
            { id: 2, title: "Estiramiento Ninja 🥷", desc: "Cuello y brazos al cielo.", duration: 180, icon: "fa-child-reaching", color: "#a78bfa" },
            { id: 3, title: "Descanso Visual 👁️", desc: "Mirar a lo lejos para relajar.", duration: 60, icon: "fa-eye", color: "#f472b6" },
            { id: 4, title: "Manos Mágicas ✨", desc: "Soltar tensión en las muñecas.", duration: 120, icon: "fa-hands-clapping", color: "#fbbf24" },
            { id: 5, title: "Terremoto 🕺", desc: "¡Sacudir todo el cuerpo de pie!", duration: 240, icon: "fa-person-running", color: "#34d399" }
        ];

        const quotes = {
            morning: ["«¡La energía de la mañana es tu mejor herramienta! ☀️»", "«Un inicio activo garantiza una clase atenta. 🚀»", "«El mejor momento para inspirar es ahora. 🌅»"],
            afternoon: ["«Se vale estar cansado, ¡pero una pausa lo arregla todo! ⚡»", "«Mueve el cuerpo y la mente despertará. 🧠»", "«Un respiro profundo cambia el rumbo de la tarde. 🍃»"],
            night: ["«El último esfuerzo del día. ¡Tú puedes, profe! 🦉»", "«La noche trae conocimiento y paciencia. 🌙»", "«Cierra el día con broche de oro y buena actitud. 🌟»"]
        };

        let timeLeft = 0, timerInterval = null, isRunning = false, currentRoutine = null;
        let historyData = JSON.parse(localStorage.getItem('pausasHistory')) || [];
        
        let streak = parseInt(localStorage.getItem('pausaStreak')) || 0;
        let lastDate = localStorage.getItem('pausaLastDate');
        let dailyMissionId = parseInt(localStorage.getItem('pausaDailyId'));
        let missionCompleted = localStorage.getItem('pausaMissionDone') === 'true';
        let lostStreakFlag = false; 

        document.addEventListener('DOMContentLoaded', () => {
            loadProfilePic();
            checkStreakAndMission();
            checkTimeAndShowModal(); 
            updateStreakUI();
            renderLibrary(); 
            renderHistory();
        });

        // --- SISTEMA TOAST (Mensajes en pantalla) ---
        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // --- LÓGICA DE RACHAS ---
        function checkStreakAndMission() {
            const todayDate = new Date().toDateString();
            
            if (lastDate !== todayDate) {
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastDate !== yesterday.toDateString() && lastDate != null) {
                    streak = 0;
                    lostStreakFlag = true;
                }

                dailyMissionId = routines[Math.floor(Math.random() * routines.length)].id;
                missionCompleted = false;
                lastDate = todayDate;
                saveStreakData();
            }
        }

        function saveStreakData() {
            localStorage.setItem('pausaStreak', streak);
            localStorage.setItem('pausaLastDate', lastDate);
            localStorage.setItem('pausaDailyId', dailyMissionId);
            localStorage.setItem('pausaMissionDone', missionCompleted);
            updateStreakUI();
        }

        function updateStreakUI() { document.getElementById('streak-counter').innerText = `🔥 ${streak}`; }
        function closeModal(id) { document.getElementById(id).classList.remove('show'); }

        // --- HORARIO Y MODAL DE INICIO ---
        function checkTimeAndShowModal() {
            const hour = new Date().getHours();
            const body = document.body;
            const status = document.getElementById('time-status');
            const modalGreeting = document.getElementById('modal-greeting');
            const quoteText = document.getElementById('quote-text');
            const modalIcon = document.getElementById('modal-icon');

            let period = "";

            if (hour >= 5 && hour < 12) {
                body.className = "theme-morning"; status.innerText = "Modo Mañana ☀️"; modalGreeting.innerText = "¡Buenos días, Profe!"; modalIcon.innerText = "🌅"; period = "morning";
            } else if (hour >= 12 && hour < 19) {
                body.className = "theme-afternoon"; status.innerText = "Modo Tarde 🌤️"; modalGreeting.innerText = "¡Buenas tardes, Profe!"; modalIcon.innerText = "⚡"; period = "afternoon";
            } else {
                body.className = "theme-night"; status.innerText = "Modo Noche 🌙"; modalGreeting.innerText = "¡Buenas noches, Profe!"; modalIcon.innerText = "🦉"; period = "night";
            }

            const randomQuote = quotes[period][Math.floor(Math.random() * quotes[period].length)];
            quoteText.innerText = randomQuote;

            setTimeout(() => { 
                if (lostStreakFlag) document.getElementById('modal-punishment').classList.add('show');
                else document.getElementById('modal-quote').classList.add('show');
            }, 500);
        }

        // --- SISTEMA FOTOS COMPRIMIDAS ---
        function uploadProfilePic(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 200;
                    let width = img.width, height = img.height;
                    if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
                    else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
                    
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedUrl = canvas.toDataURL('image/jpeg', 0.8);
                    
                    document.getElementById('profile-img').src = compressedUrl;
                    try { localStorage.setItem('profilePic', compressedUrl); } 
                    catch (err) { alert("Error guardando foto."); }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function loadProfilePic() {
            const savedPic = localStorage.getItem('profilePic');
            if (savedPic) document.getElementById('profile-img').src = savedPic;
        }

        // --- 🔔 NOTIFICACIONES ---
        let remindersActive = false, reminderTimer = null;
        function toggleNotifications() {
            const btn = document.getElementById('bell-btn');
            
            if (!("Notification" in window)) { 
                showToast("Tu navegador no soporta notificaciones."); 
                return; 
            }
            
            if (Notification.permission === "granted") {
                remindersActive = !remindersActive;
                if (remindersActive) {
                    btn.classList.add('active');
                    soundToggleOn(); 
                    showToast("🔔 Recordatorio en 45 min");
                    
                    reminderTimer = setInterval(() => { 
                        soundAlert(); 
                        new Notification("¡Pausa Activa!", { body: "Profe, mueve a tus estudiantes un rato.", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }); 
                    }, 2700000); 
                    
                } else {
                    btn.classList.remove('active'); 
                    clearInterval(reminderTimer); 
                    soundToggleOff(); 
                    showToast("🔕 Alarmas apagadas");
                }
            } else {
                Notification.requestPermission().then(p => { if(p==="granted") toggleNotifications(); });
            }
        }

        function switchView(view) {
            if(view !== 'timer' && isRunning) pauseTimer();
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${view}`).classList.add('active');
            ['lib', 'hist'].forEach(v => { document.getElementById(`btn-pc-${v}`).classList.remove('active'); document.getElementById(`btn-mob-${v}`).classList.remove('active'); });
            if(view === 'library') { document.getElementById('btn-pc-lib').classList.add('active'); document.getElementById('btn-mob-lib').classList.add('active'); renderLibrary(); } 
            else if (view === 'history') { document.getElementById('btn-pc-hist').classList.add('active'); document.getElementById('btn-mob-hist').classList.add('active'); renderHistory(); }
        }

        function renderLibrary() {
            const missionContainer = document.getElementById('daily-mission-container');
            const list = document.getElementById('routines-list');
            const missionRoutine = routines.find(r => r.id === dailyMissionId);
            
            if (missionRoutine) {
                const missionStatus = missionCompleted ? "¡Completado! ✅" : "Misión del Día 🎯";
                const completedClass = missionCompleted ? "completed" : "";
                missionContainer.innerHTML = `
                    <div class="daily-mission-card ${completedClass}" onclick="openRoutine(${missionRoutine.id})">
                        <div class="mission-badge">${missionStatus}</div>
                        <div class="mission-icon"><i class="fas ${missionRoutine.icon}"></i></div>
                        <div>
                            <h3 style="font-size: 1.2rem; font-weight: 900; margin-bottom: 2px;">${missionRoutine.title}</h3>
                            <p style="font-size: 0.9rem; opacity: 0.9; line-height: 1.2;">Gana +1 a tu racha de fuego.</p>
                        </div>
                    </div>
                `;
            }

            list.innerHTML = routines.filter(r => r.id !== dailyMissionId).map(r => `
                <div class="routine-card" onclick="openRoutine(${r.id})">
                    <div class="routine-icon" style="color: ${r.color}; box-shadow: 0 5px 15px ${r.color}55;"><i class="fas ${r.icon}"></i></div>
                    <div>
                        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 2px;">${r.title}</h3>
                        <p style="font-size: 0.85rem; opacity: 0.8; line-height: 1.2;">${Math.floor(r.duration/60)} min • ${r.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        function openRoutine(id) {
            currentRoutine = routines.find(r => r.id === id);
            timeLeft = currentRoutine.duration;
            document.getElementById('timer-title').innerText = currentRoutine.title;
            document.getElementById('timer-desc').innerText = currentRoutine.desc;
            updateDisplay(); switchView('timer');
        }

        function updateDisplay() {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            document.getElementById('time-display').innerText = `${m}:${s}`;
        }

        function startTimer() {
            if (isRunning) return;
            if (audioCtx.state === 'suspended') audioCtx.resume(); 
            
            isRunning = true;
            document.getElementById('btn-play').style.display = 'none';
            document.getElementById('btn-pause').style.display = 'flex';
            document.getElementById('timer-ui').classList.add('running');
            
            timerInterval = setInterval(() => {
                timeLeft--; updateDisplay();
                if (timeLeft <= 0) finishRoutine();
            }, 1000);
        }

        function pauseTimer() {
            isRunning = false; clearInterval(timerInterval);
            document.getElementById('btn-play').style.display = 'flex';
            document.getElementById('btn-pause').style.display = 'none';
            document.getElementById('timer-ui').classList.remove('running');
        }

        function stopTimer() { pauseTimer(); switchView('library'); }

        function finishRoutine() {
            pauseTimer();
            historyData.push({ title: currentRoutine.title, xp: Math.floor(currentRoutine.duration / 60), date: new Date().toISOString() });
            localStorage.setItem('pausasHistory', JSON.stringify(historyData));
            
            soundVictory();

            if (currentRoutine.id === dailyMissionId && !missionCompleted) {
                missionCompleted = true;
                streak++;
                saveStreakData();
                setTimeout(()=> document.getElementById('modal-reward').classList.add('show'), 1500);
            }

            const duration = 3000; const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#10B981'] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#38bdf8', '#f472b6'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
            
            setTimeout(() => { switchView('history'); }, 3500);
        }

        function renderHistory() {
            const list = document.getElementById('history-list');
            if (!historyData.length) { list.innerHTML = `<p style="text-align:center; opacity:0.6; margin-top: 40px; font-size:1.1rem;">Aún no tienes XP. ¡Inicia una dinámica!</p>`; return; }
            list.innerHTML = [...historyData].reverse().map(item => `
                <div style="background: rgba(0,0,0,0.3); border-left: 4px solid #10B981; padding: 15px; border-radius: 15px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; color: white;">
                    <div>
                        <h4 style="font-size: 1rem;">${item.title}</h4>
                        <span style="font-size: 0.75rem; opacity: 0.7;">Hoy a las ${new Date(item.date).toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div style="font-weight: 900; color: #10B981; font-size: 1.1rem;">+${item.xp} XP</div>
                </div>
            `).join('');
        }
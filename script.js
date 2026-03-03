<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Pausas Activas Profe</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    
    <style>
        /* --- ESTILOS BASE --- */
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Nunito', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        body { 
            display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; height: 100dvh; overflow: hidden; 
            transition: background 1s ease; margin: 0; background-color: #1a1a1a;
        }

        body.theme-morning { background: linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%); }
        body.theme-afternoon { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }
        body.theme-night { background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); }

        #app-container {
            width: 100%; height: 100%; display: flex; flex-direction: column;
            background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        }

        /* --- ENCABEZADO Y PERFIL --- */
        #sidebar {
            flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;
            padding: 15px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .desktop-nav { display: none; }

        .profile-section { display: flex; align-items: center; gap: 15px; color: white; }
        .profile-pic-wrapper { 
            width: 50px; height: 50px; border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.6); position: relative; overflow: hidden;
            cursor: pointer; flex-shrink: 0; display: block;
        }
        .profile-pic { width: 100%; height: 100%; object-fit: cover; background: #fff; }
        #file-input { display: none; }
        
        .profile-info { display: flex; flex-direction: column; }
        .profile-name { font-size: 1.1rem; font-weight: 900; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px;}
        
        .streak-badge { background: #ff4757; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 900; box-shadow: 0 2px 5px rgba(255,71,87,0.4); animation: pulse-streak 2s infinite; }
        @keyframes pulse-streak { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .profile-status { font-size: 0.75rem; font-weight: 600; opacity: 0.9; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px; display: inline-block; margin-top: 3px; width: fit-content; }

        .bell-btn { background: rgba(255,255,255,0.2); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: center; align-items: center; flex-shrink: 0; transition: 0.3s; }
        .bell-btn.active { background: #FFD700; color: #000; animation: shake 0.5s; }
        @keyframes shake { 0%, 100% {transform: translateX(0);} 25% {transform: translateX(-3px) rotate(-5deg);} 75% {transform: translateX(3px) rotate(5deg);} }

        /* --- CONTENIDO PRINCIPAL --- */
        #main-content { flex-grow: 1; overflow: hidden; position: relative; }
        .view { display: none; width: 100%; height: 100%; overflow-y: auto; padding: 20px; animation: fadeIn 0.3s ease; }
        .view.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .view-header { margin-bottom: 20px; color: white; }
        .view-header h2 { font-size: 1.5rem; font-weight: 900; text-shadow: 0 2px 5px rgba(0,0,0,0.3); }

        /* 🎯 Tarjeta de Misión Diaria 🎯 */
        .daily-mission-card { background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%); border-radius: 20px; padding: 15px; margin-bottom: 20px; color: #000; box-shadow: 0 10px 20px rgba(255,140,0,0.3); display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; }
        .daily-mission-card:active { transform: scale(0.96); }
        .daily-mission-card.completed { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; pointer-events: none; }
        .mission-icon { width: 50px; height: 50px; background: rgba(255,255,255,0.3); border-radius: 15px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; flex-shrink: 0; }
        .mission-badge { position: absolute; top: 0; right: 0; background: #000; color: #FFD700; font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-bottom-left-radius: 15px; }
        .daily-mission-card.completed .mission-badge { background: #fff; color: #10B981; }

        /* Grid de Rutinas */
        .routines-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .routine-card { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 15px; cursor: pointer; transition: all 0.2s; color: white; display: flex; align-items: center; }
        .routine-card:active { transform: scale(0.96); background: rgba(0,0,0,0.4); }
        .routine-icon { width: 50px; height: 50px; background: white; border-radius: 15px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; margin-right: 15px; flex-shrink: 0; }
        
        /* Temporizador */
        .timer-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; color: white; text-align: center; }
        .timer-circle { width: 65vw; max-width: 280px; height: 65vw; max-height: 280px; border-radius: 50%; background: rgba(0,0,0,0.3); border: 6px solid rgba(255,255,255,0.3); display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px 0 30px; transition: all 0.3s; }
        .timer-circle.running { border-color: #10B981; box-shadow: 0 0 30px rgba(16,185,129,0.4); animation: pulse 1s infinite alternate; }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.05); } }
        .time-display { font-size: 4.5rem; font-weight: 900; line-height: 1; text-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        
        .controls { display: flex; gap: 20px; margin-bottom: 20px; }
        .btn-action { border: none; width: 65px; height: 65px; border-radius: 50%; font-size: 1.8rem; cursor: pointer; color: white; box-shadow: 0 8px 15px rgba(0,0,0,0.3); transition: 0.2s; display: flex; justify-content: center; align-items: center; }
        .btn-play { background: #10B981; } .btn-pause { background: #F59E0B; } .btn-stop { background: #EF4444; }

        /* --- NAVEGACIÓN INFERIOR --- */
        #bottom-nav {
            flex-shrink: 0; background: rgba(0,0,0,0.5); border-top: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-around; padding: 12px 0; z-index: 50; padding-bottom: calc(12px + env(safe-area-inset-bottom));
        }
        .nav-item-mob { display: flex; flex-direction: column; align-items: center; color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .nav-item-mob i { font-size: 1.4rem; margin-bottom: 4px; }
        .nav-item-mob.active { color: #10B981; transform: translateY(-3px); text-shadow: 0 2px 10px rgba(16,185,129,0.5); }

        /* --- DISEÑO COMPUTADORA --- */
        @media (min-width: 768px) {
            #app-container { flex-direction: row; width: 95%; max-width: 1200px; height: 90vh; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3); }
            #sidebar { width: 320px; flex-direction: column; justify-content: flex-start; padding: 40px 25px; border-bottom: none; border-right: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.15); }
            .profile-section { flex-direction: column; text-align: center; width: 100%; gap: 10px; }
            .profile-pic-wrapper { width: 130px; height: 130px; border-width: 4px; margin: 0 auto; }
            .profile-info { align-items: center; margin-bottom: 20px; }
            .profile-name { font-size: 1.6rem; flex-direction: column; gap: 5px;}
            .profile-status { font-size: 0.9rem; padding: 5px 15px; border-radius: 20px; }
            .desktop-nav { display: flex; flex-direction: column; width: 100%; gap: 15px; margin-top: 20px; }
            .nav-btn { background: rgba(255,255,255,0.1); border: none; padding: 15px 20px; border-radius: 15px; color: white; font-size: 1.1rem; font-weight: 800; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 15px; transition: all 0.3s; }
            .nav-btn.active { background: linear-gradient(90deg, #10B981, #059669); }
            #bottom-nav { display: none !important; }
            #main-content { border-radius: 0 30px 30px 0; }
        }

        /* --- MODALES --- */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: 0.4s; backdrop-filter: blur(5px); padding: 20px; }
        .modal-overlay.show { opacity: 1; pointer-events: auto; }
        .modal-box { background: white; width: 100%; max-width: 400px; padding: 35px 25px; border-radius: 30px; text-align: center; transform: translateY(50px); transition: 0.4s; }
        .modal-overlay.show .modal-box { transform: translateY(0); }
        .modal-box h3 { font-size: 1.6rem; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
        .modal-box p { font-size: 1.1rem; color: #475569; margin-bottom: 25px; }
        .btn-modal { color: white; border: none; padding: 15px; border-radius: 15px; font-size: 1.1rem; font-weight: 800; cursor: pointer; width: 100%; }
        .btn-green { background: #10B981; box-shadow: 0 8px 15px rgba(16,185,129,0.3); }
        .btn-red { background: #EF4444; box-shadow: 0 8px 15px rgba(239,68,68,0.3); }

        /* Toast UI (Alertas) */
        #toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: #1e293b; color: white; padding: 15px 25px; border-radius: 20px; font-size: 1rem; font-weight: 800; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 2000; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    </style>
</head>
<body>

    <div id="toast">🔔 Alarma configurada</div>

    <div id="modal-quote" class="modal-overlay">
        <div class="modal-box">
            <div id="modal-icon" style="font-size: 3.5rem; margin-bottom: 10px;">☀️</div>
            <h3 id="modal-greeting">¡Buen día!</h3>
            <p id="quote-text" style="font-style: italic;">"La educación es el arma más poderosa..."</p>
            <button class="btn-modal btn-green" onclick="closeModal('modal-quote')">¡A dar clase! 🚀</button>
        </div>
    </div>

    <div id="modal-punishment" class="modal-overlay">
        <div class="modal-box">
            <div style="font-size: 4rem; margin-bottom: 10px;">📉</div>
            <h3>¡Uy, Profe! Reprobado</h3>
            <p>Dejaste a tus alumnos sin pausa activa ayer y perdiste tu racha de fuego. ¡Hoy toca recuperar esos puntos!</p>
            <button class="btn-modal btn-red" onclick="closeModal('modal-punishment')">Aceptar el regaño 😞</button>
        </div>
    </div>

    <div id="modal-reward" class="modal-overlay">
        <div class="modal-box">
            <div style="font-size: 4rem; margin-bottom: 10px;">🔥</div>
            <h3>¡Misión Cumplida!</h3>
            <p>Completaste la pausa diaria. ¡Tu racha ha aumentado! Sigue así, profe estrella.</p>
            <button class="btn-modal btn-green" onclick="closeModal('modal-reward')">¡Excelente! 🚀</button>
        </div>
    </div>

    <div id="app-container">
        <aside id="sidebar">
            <div class="profile-section">
                <label for="file-input" class="profile-pic-wrapper">
                    <img id="profile-img" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Perfil" class="profile-pic">
                </label>
                <input type="file" id="file-input" accept="image/*" onchange="uploadProfilePic(event)">
                
                <div class="profile-info">
                    <h2 class="profile-name">
                        Profe 
                        <span class="streak-badge" id="streak-counter">🔥 0</span>
                    </h2>
                    <span class="profile-status" id="time-status">Modo Mañana</span>
                </div>
            </div>
            <button class="bell-btn" id="bell-btn" onclick="toggleNotifications()"><i class="fas fa-bell"></i></button>
            
            <nav class="desktop-nav">
                <button class="nav-btn active" onclick="switchView('library')" id="btn-pc-lib"><i class="fas fa-bolt"></i> Dinámicas</button>
                <button class="nav-btn" onclick="switchView('history')" id="btn-pc-hist"><i class="fas fa-trophy"></i> Mis Logros</button>
            </nav>
        </aside>

        <main id="main-content">
            <div id="view-library" class="view active">
                <div class="view-header"><h2><i class="fas fa-gamepad"></i> Dinámicas</h2></div>
                <div id="daily-mission-container"></div>
                <h3 style="color: white; font-size: 1.1rem; margin-bottom: 15px; opacity: 0.8;">Otras rutinas:</h3>
                <div class="routines-grid" id="routines-list"></div>
            </div>

            <div id="view-timer" class="view">
                <button onclick="switchView('library')" style="background: rgba(255,255,255,0.2); border:none; padding: 10px 20px; border-radius: 12px; color: white; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div class="timer-wrapper">
                    <h2 style="font-size: 2rem; font-weight: 900; margin-bottom: 5px;" id="timer-title">Actividad</h2>
                    <p style="font-size: 1rem; opacity: 0.9;" id="timer-desc">¡Motiva a tus alumnos!</p>
                    <div class="timer-circle" id="timer-ui"><div class="time-display" id="time-display">00:00</div></div>
                    <div class="controls">
                        <button class="btn-action btn-play" id="btn-play" onclick="startTimer()"><i class="fas fa-play"></i></button>
                        <button class="btn-action btn-pause" id="btn-pause" onclick="pauseTimer()" style="display: none;"><i class="fas fa-pause"></i></button>
                        <button class="btn-action btn-stop" onclick="stopTimer()"><i class="fas fa-square"></i></button>
                    </div>
                </div>
            </div>

            <div id="view-history" class="view">
                <div class="view-header"><h2><i class="fas fa-medal"></i> Historial de XP</h2></div>
                <div id="history-list"></div>
            </div>
        </main>

        <nav id="bottom-nav">
            <div class="nav-item-mob active" onclick="switchView('library')" id="btn-mob-lib"><i class="fas fa-bolt"></i><span>Dinámicas</span></div>
            <div class="nav-item-mob" onclick="switchView('history')" id="btn-mob-hist"><i class="fas fa-trophy"></i><span>Logros</span></div>
        </nav>
    </div>

    <script>
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
    </script>
</body>
</html>

// 1. CSS Styles ටික dynamic ව සයිට් එකට එකතු කිරීම (Safe Method)
const style = document.createElement('style');
style.textContent = `
    /* Background Animation Container */
    .cinema-bg-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -2; /* අනිත් Content වලට යටින්ම තියන්න */
        background-color: #0a0a0a;
        background: radial-gradient(circle at top right, #3d141d 0%, #080808 80%); 
        overflow: hidden;
        pointer-events: none;
    }

    /* Podi cinematic glow effect ekak */
    .bg-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 60%);
        animation: pulseGlow 8s infinite alternate;
    }

    /* Film Strip eke design eka */
    .film-strip {
        position: absolute;
        width: 250vw;
        height: 140px;
        background: rgba(0, 0, 0, 0.6);
        border-top: 2px solid rgba(255, 255, 255, 0.05);
        border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        opacity: 0.2;
        pointer-events: none;
    }

    /* Film strip holes */
    .film-strip::before, .film-strip::after {
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 15px,
            rgba(255, 255, 255, 0.15) 15px,
            rgba(255, 255, 255, 0.2) 25px
        );
    }

    .film-strip::before { top: 6px; }
    .film-strip::after { bottom: 6px; }

    /* Strip positions & animations */
    .strip-1 {
        top: 20%;
        left: -50vw;
        transform: rotate(-12deg);
        animation: moveStripRight 80s linear infinite;
    }

    .strip-2 {
        bottom: 20%;
        left: -100vw;
        transform: rotate(8deg);
        animation: moveStripLeft 90s linear infinite;
    }

    @keyframes moveStripRight {
        0% { transform: rotate(-12deg) translateX(0); }
        100% { transform: rotate(-12deg) translateX(-50vw); }
    }

    @keyframes moveStripLeft {
        0% { transform: rotate(8deg) translateX(0); }
        100% { transform: rotate(8deg) translateX(50vw); }
    }

    @keyframes pulseGlow {
        0% { opacity: 0.4; transform: scale(1); }
        100% { opacity: 0.8; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// 2. HTML Elements ටික Page එක Load වෙද්දීම ආරක්ෂිතව පසුබිමට එකතු කිරීම
document.addEventListener('DOMContentLoaded', () => {
    // දැනටමත් සයිට් එකේ background එකක් හැදිලා නැත්නම් විතරක් අලුත් එක හදන්න
    if (!document.querySelector('.cinema-bg-animation')) {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'cinema-bg-animation';

        bgContainer.innerHTML = `
            <div class="bg-glow"></div>
            <div class="film-strip strip-1"></div>
            <div class="film-strip strip-2"></div>
        `;

        // Body එක පටන් ගන්න තැනටම (යටින්ම) මේක ඇතුල් කරනවා
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
});
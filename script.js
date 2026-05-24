document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. ЛОГИКА КОНВЕРТА ===
    const envelopeBox = document.getElementById('envelope-box');
    const letter = document.getElementById('letter');
    let isOpened = false;

    if (envelopeBox) {
        envelopeBox.addEventListener('click', (e) => {
            if (e.target.closest('.letter')) return;
            if (!isOpened) {
                envelopeBox.classList.add('open');
                isOpened = true;
            }
        });
    }

    if (letter) {
        letter.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextSection = document.getElementById('grandpa');
            if (nextSection) {
                nextSection.scrollIntoView({ block: 'start' }); 
            }
        });
    }

    // === 2. ТАЙМЕР ===
    const targetDate = new Date('2026-06-13T14:00:00').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // === 3. ФОРМА АНКЕТЫ — НАТИВНАЯ ОТПРАВКА ===
    const rsvpForm = document.getElementById('rsvpForm');
    const thankYouBlock = document.getElementById('thankyou');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', () => {
            const btn = rsvpForm.querySelector('.submit-button');
            btn.textContent = 'Отправляем...';
            btn.disabled = true;
            // Форма отправится сама благодаря action и method="POST"
        });
    }

    // === ПОКАЗ БЛОКА "СПАСИБО" ПОСЛЕ ВОЗВРАТА ===
    window.addEventListener('load', () => {
        if (window.location.hash === '#thankyou' && thankYouBlock && rsvpForm) {
            thankYouBlock.style.display = 'block';
            thankYouBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Через 3 секунды плавно вернём внимание к форме (опционально)
            setTimeout(() => {
                rsvpForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 3000);
        }
    });

    // === 4. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});

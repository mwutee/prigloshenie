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
            // Мгновенный переход к приглашению
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

    // === 3. ФОРМА АНКЕТЫ (FormSubmit) ===
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = rsvpForm.querySelector('.submit-button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправляем...';
            btn.disabled = true;

            try {
                const response = await fetch(rsvpForm.action, {
                    method: 'POST',
                    body: new FormData(rsvpForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const msg = document.createElement('div');
                    msg.className = 'success-message show';
                    msg.style.cssText = `
                        text-align: center; padding: 30px; background: #f0f8e8; 
                        border-radius: 10px; margin-top: 20px; color: #2e7d32; 
                        border: 2px solid #a5d6a7; animation: fadeIn 0.5s;
                    `;
                    msg.innerHTML = `
                        <h3 style="margin:0 0 10px 0; font-size:1.8em;">✓ Спасибо!</h3>
                        <p style="margin:0; font-size:1.1em;">Ваш ответ отправлен.<br>Мы ждём вас на празднике!</p>
                    `;
                    
                    rsvpForm.style.display = 'none';
                    rsvpForm.parentNode.appendChild(msg);
                    // Плавный скролл к сообщению оставим, чтобы пользователь увидел результат
                    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert('Не удалось отправить. Попробуйте ещё раз.');
                }
            } catch (err) {
                alert('Ошибка сети. Проверьте подключение к интернету.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

        // === АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Если элемент появился на экране
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                // Если хочешь, чтобы анимация повторялась при скролле вверх - убери комментарии ниже:
                // entry.target.classList.remove('show'); 
            }
        });
    });

    // Находим все скрытые элементы
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});

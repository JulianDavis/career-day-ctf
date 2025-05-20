document.addEventListener('DOMContentLoaded', () => {
    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];

    const hints = getHints(6);

    for (let i = 0; i < hints.length; i++) {
        if (hintElements[i]) {
            hintElements[i].textContent = hints[i];
        }
    }

    const clockPositions = [
        { hour: 6, minute: 0 },
        { hour: 1, minute: 0 },
        { hour: 2, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 5, minute: 0 },
        { hour: 4, minute: 0 }
    ];

    function createClockNumbers(clockId) {
        const clockFace = document.getElementById(`clock-face-${clockId}`);
        for (let i = 1; i <= 12; i++) {
            const number = document.createElement('div');
            number.className = 'clock-number';
            number.textContent = i;

            const angle = (i * 30) - 90;
            const radians = angle * (Math.PI / 180);
            const radius = 60;

            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            number.style.left = `calc(50% + ${x}px - 8px)`;
            number.style.top = `calc(50% + ${y}px - 8px)`;

            clockFace.appendChild(number);
        }
    }

    function updateClock(clockId, position) {
        const hourHand = document.getElementById(`hour-hand-${clockId}`);
        const minuteHand = document.getElementById(`minute-hand-${clockId}`);

        const hourAngle = (clockPositions[position].hour % 12) * 30;
        const minuteAngle = clockPositions[position].minute * 6;

        hourHand.style.transform = `rotate(${hourAngle}deg)`;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    }

    for (let i = 1; i <= 6; i++) {
        createClockNumbers(i);
        updateClock(i, i - 1);
    }

    window.validatePassword = function() {
        const password = document.getElementById('flag').value.trim().toUpperCase();
        const errorMessage = document.getElementById('error-message');

        if (password === atob("RkFCTEVE")) {
            completeChallenge(6);
        } else {
            errorMessage.textContent = 'Incorrect flag. Try again!';
        }
    };
});
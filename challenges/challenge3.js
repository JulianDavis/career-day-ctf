document.addEventListener('DOMContentLoaded', () => {
    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];
    
    const hints = getHints(3);
    
    for (let i = 0; i < hints.length; i++) {
        if (hintElements[i]) {
            hintElements[i].textContent = hints[i];
        }
    }
    
    window.validatePassword = function() {
        const password = document.getElementById('flag').value.trim().toUpperCase();
        const errorMessage = document.getElementById('error-message');
        
        if (password === atob("UkVGTEVDVA==")) {
            completeChallenge(3);
        } else {
            errorMessage.textContent = 'Incorrect flag. Try again!';
        }
    };
});
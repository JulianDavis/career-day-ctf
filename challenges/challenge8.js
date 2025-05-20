document.addEventListener('DOMContentLoaded', () => {
    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];

    const hints = getHints(8);

    // Apply original hint 1, enhanced hints 2-4
    if (hintElements[0]) {
        hintElements[0].textContent = hints[0];
    }

    // Enhanced hint 2: Simple instruction
    if (hintElements[1]) {
        hintElements[1].innerHTML = `
            <p>Look for the JavaScript code that validates the flag. It's checking specific positions in your answer.</p>
            <p>The validation function contains conditions that check each character position for exact values.</p>
        `;
    }

    // Enhanced hint 3: Zero-based indexing explanation
    if (hintElements[2]) {
        hintElements[2].innerHTML = `
            <p>In programming, we start counting from 0, not 1! So position [0] is the first character, position [1] is the second character, and so on.</p>
        `;
    }

    // Enhanced hint 4: Simple requirements list
    if (hintElements[3]) {
        hintElements[3].innerHTML = `
            <p>According to the code, you need:</p>
            <div class="requirements-simple">
                <div>Position [0] = 'B'</div>
                <div>Position [1] = '4'</div>
                <div>Position [2] = 'N'</div>
                <div>Position [3] = '4'</div>
                <div>Position [4] = 'N'</div>
                <div>Position [5] = '4'</div>
            </div>
        `;
    }

    window.validatePassword = function() {
        const password = document.getElementById('flag').value;
        const errorMessage = document.getElementById('error-message');

        if (password.length === 6 &&
            password[1] === '4' &&
            password[3] === '4' &&
            password[5] === '4' &&
            password[0] === 'B' &&
            password[2] === 'N' &&
            password[4] === 'N') {

            completeChallenge(8);
        } else {
            errorMessage.textContent = 'Invalid flag! Hint: Check positions 0-5 of your input carefully.';
        }
    };
});
document.addEventListener('DOMContentLoaded', function() {
    console.log("Challenge 9 logic loaded");

    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];

    const hints = getHints(9);

    for (let i = 0; i < hints.length; i++) {
        if (hintElements[i]) {
            hintElements[i].textContent = hints[i];
        }
    }

    const fileSystem = {
        '/': {
            'notes.txt': 'Remember to clean up the hidden directories!',
            'readme.txt': 'Welcome to the Secret Terminal!\n\nThis is a secure system with basic Unix-like commands.\n\nTo learn how to use commands, try typing a command followed by --help or -h.\nFor example: ls --help or ls -h\n\nHappy exploring!',
            '.secret': {
                'password.txt': 'My super secret flag is: COMMAND'
            }
        }
    };

    setTimeout(function() {
        if (typeof window.initTerminal === 'function') {
            window.initTerminal(fileSystem, 9);
        } else {
            console.error("initTerminal function not found! Make sure terminal.js is loaded before challenge9.js");
        }
    }, 200);

    window.validatePassword = function() {
        const password = document.getElementById('flag').value.trim().toUpperCase();
        const errorMessage = document.getElementById('error-message');

        if (password === atob("Q09NTUFORA==")) {
            completeChallenge(9);
        } else {
            errorMessage.textContent = 'Incorrect flag. Try again!';
        }
    };
});

console.log("Challenge 9 script fully loaded");
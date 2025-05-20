document.addEventListener('DOMContentLoaded', () => {
    setupHintButtons();
    setupSolutionButton();
    setupPasswordValidation();
    handleURLParameters();
});

function setupHintButtons() {
    if (window.hintsInitialized) return;
    
    const hintButtons = document.querySelectorAll('.hint-button');
    
    hintButtons.forEach(button => {
        const hintNumber = button.id.replace('hint', '').replace('-button', '');
        const hintContent = document.getElementById(`hint${hintNumber}`);
        
        button.addEventListener('click', function() {
            const isVisible = hintContent.style.display === 'block';
            
            if (isVisible) {
                hintContent.style.display = 'none';
            } else {
                hintContent.style.display = 'block';
            }
        });
    });
}

function setupSolutionButton() {
    const solutionButton = document.getElementById('solution-button');
    if (!solutionButton) return;
    
    const solutionContent = document.getElementById('solution-content');
    if (!solutionContent) return;
    
    const challengeMeta = document.querySelector('meta[name="challenge-number"]');
    if (!challengeMeta) return;
    
    const challengeNumber = parseInt(challengeMeta.getAttribute('content'));
    
    solutionButton.disabled = false;
    solutionButton.title = "Click to see the solution";
    
    solutionButton.addEventListener('click', function() {
        const isVisible = solutionContent.style.display === 'block';
        
        if (isVisible) {
            solutionContent.style.display = 'none';
        } else {
            solutionContent.style.display = 'block';
            
            const solution = getSolution(challengeNumber);
            
            const stepsElement = document.getElementById('solution-steps');
            
            if (stepsElement && solution.steps) {
                const formattedSteps = solution.steps.map(step => {
                    if (challengeNumber === 7 && step.includes('yoursite.com/page.html?parameter=value')) {
                        return step.replace(
                            'yoursite.com/page.html?parameter=value',
                            '<div class="url-example"><code>yoursite.com/page.html<span class="highlight-param">?parameter=value</span></code></div>'
                        );
                    }
                    return step;
                });
                stepsElement.innerHTML = formattedSteps.map(step => `<p>${step}</p>`).join('');
            }
        }
    });
}

function setupPasswordValidation() {
    const loginButton = document.getElementById('login-button');
    const passwordInput = document.getElementById('flag');
    
    if (loginButton && passwordInput) {
        loginButton.addEventListener('click', function() {
            // This ensures that when the button is clicked,
            // it calls whatever function is *currently*
            // assigned to window.validatePassword.
            if (typeof window.validatePassword === 'function') {
                window.validatePassword();
            } else {
                console.error("validatePassword function is not defined on window object");
            }
        });
        
        passwordInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                if (typeof window.validatePassword === 'function') {
                    window.validatePassword();
                } else {
                    console.error("validatePassword function is not defined on window object for Enter key");
                }
            }
        });
    }
}

function validatePassword() {
    // This is a placeholder that will be overridden by challenge-specific code
    console.log('Flag validation not implemented for this challenge');
}

function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level'));
    
    const challengeMeta = document.querySelector('meta[name="challenge-number"]');
    if (!challengeMeta) return;
    
    const currentChallenge = parseInt(challengeMeta.getAttribute('content'));
    const currentFile = window.location.pathname.split('/').pop();
    
    if (level && level !== currentChallenge) {
        if (currentChallenge < 7) {
            alert("Good intuition! You're thinking like a hacker, but we're not quite there yet... keep going through the challenges!");
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('level', currentChallenge);
            window.history.replaceState({}, '', currentUrl);
            return;
        } else if (currentChallenge > 7) {
            alert("Nice try, but URL manipulation is no longer available for these advanced challenges!");
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('level', currentChallenge);
            window.history.replaceState({}, '', currentUrl);
            return;
        }
    }
    
    if (currentFile === 'challenge7.html') {
        if (level === 7) {
            document.body.innerHTML = `
                <div id="app">
                    <div class="challenge-container">
                        <div class="challenge-header">
                            <h1 class="challenge-title">URL Manipulation Success!</h1>
                            <p class="challenge-number">Challenge 7/9</p>
                        </div>
                        <p>Great job! You found the flag by changing the URL parameter.</p>
                        <p>The flag is: <strong>URL PARAMETER</strong></p>
                        <div style="text-align: center; margin-top: 30px;">
                            <button class="next-button" onclick="completeChallenge(7)">Complete Challenge</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (!level || level !== 6) {
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('level', '6');
            window.history.replaceState({}, '', currentUrl);
        }
    } else {
        if (!level) {
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('level', currentChallenge);
            window.history.replaceState({}, '', currentUrl);
        }
    }
}

function completeChallenge(challengeNumber) {
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    if (!completedChallenges.includes(challengeNumber)) {
        completedChallenges.push(challengeNumber);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    }
    
    const app = document.getElementById('app');
    
    if (challengeNumber === 10) {
        app.innerHTML = `
            <div class="success-page">
                <h1 class="success-title">Congratulations!</h1>
                <p>You've completed all the challenges! You're now a web hacking expert!</p>
                <p>You've learned about:</p>
                <ul style="text-align: left; margin: 20px auto; max-width: 400px;">
                    <li>Finding hidden content</li>
                    <li>Inspecting page source</li>
                    <li>Simple encryption</li>
                    <li>URL parameters</li>
                    <li>Understanding code</li>
                    <li>Command line basics</li>
                    <li>Decoding data</li>
                </ul>
                <p>These are real skills that cybersecurity professionals use every day!</p>
                <button class="next-button" onclick="window.location.href='../index.html'">Start Over</button>
            </div>
        `;
    } else {
        const nextChallenge = challengeNumber + 1;
        let nextUrl;
        
        if (challengeNumber === 5) {
            nextUrl = `challenge6.html?level=6`;
        } else if (challengeNumber === 6) {
            nextUrl = `challenge7.html?level=6`;
        } else {
            nextUrl = `challenge${nextChallenge}.html?level=${nextChallenge}`;
        }
        
        app.innerHTML = `
            <div class="success-page">
                <h1 class="success-title">Great job!</h1>
                <p>You've completed Challenge ${challengeNumber}!</p>
                <p>Click below to continue to the next challenge.</p>
                <button class="next-button" onclick="window.location.href='${nextUrl}'">Next Challenge</button>
            </div>
        `;
    }
}

// Debug function to skip levels - can be called from developer console
function skip(levelNumber) {
    // Get current challenge number from the meta tag
    const challengeMeta = document.querySelector('meta[name="challenge-number"]');
    if (!challengeMeta) {
        console.error("Could not find challenge-number meta tag");
        return false;
    }
    
    const currentChallenge = parseInt(challengeMeta.getAttribute('content'));
    
    // Option 1: Skip to a specific level
    if (levelNumber && levelNumber >= 1 && levelNumber <= 9) {
        console.log(`Skipping to level ${levelNumber}`);
        window.location.href = `challenge${levelNumber}.html?level=${levelNumber}`;
        return true;
    }
    
    // Option 2: Complete current challenge
    console.log(`Completing current challenge ${currentChallenge}`);
    completeChallenge(currentChallenge);
    return true;
}
window.skip = skip;

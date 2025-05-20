document.addEventListener('DOMContentLoaded', () => {
    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];

    const hints = getHints(7);

    for (let i = 0; i < hints.length; i++) {
        if (hintElements[i]) {
            hintElements[i].textContent = hints[i];
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level'));

    if (level === 7) {
        completeChallenge(7);
    } else {
        setupSolutionEnhancement();
    }
});

function setupSolutionEnhancement() {
    const solutionButton = document.getElementById('solution-button');
    const solutionContent = document.getElementById('solution-content');
    
    if (!solutionButton || !solutionContent) return;
    
    solutionButton.addEventListener('click', function() {
        setTimeout(() => {
            if (solutionContent.style.display === 'block') {
                addURLIndicator();
            } else {
                removeURLIndicator();
            }
        }, 100);
    });
}

function addURLIndicator() {
    if (document.getElementById('url-indicator')) {
        return;
    }
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = 'url-indicator';
    indicatorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            animation: bounce 2s infinite;
            cursor: pointer;
        ">
            👆 Look at the URL above! Try changing level=6 to level=7
        </div>
        <style>
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
                40% { transform: translateX(-50%) translateY(-10px); }
                60% { transform: translateX(-50%) translateY(-5px); }
            }
        </style>
    `;
    
    document.body.appendChild(indicatorDiv);
    
    indicatorDiv.addEventListener('click', () => {
        indicatorDiv.remove();
    });
    
    setTimeout(() => {
        removeURLIndicator();
    }, 15000);
}

function removeURLIndicator() {
    const indicator = document.getElementById('url-indicator');
    if (indicator) {
        indicator.remove();
    }
}
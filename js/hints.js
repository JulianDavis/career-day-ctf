// This file contains hints for the challenges
// Solutions are encoded to protect them from casual viewing

// Get hints for a specific challenge
function getHints(challengeNumber) {
    return challengeHints[challengeNumber] || [];
}

// Get solution information for a specific challenge
function getSolution(challengeNumber) {
    const encodedSolution = challengeSolutions[challengeNumber] || null;
    if (!encodedSolution) {
        return { 
            answer: "Unknown", 
            steps: ["No solution information available"], 
            explanation: "" 
        };
    }
    
    return {
        answer: atob(encodedSolution.answer),
        steps: encodedSolution.steps.map(step => atob(step)),
        explanation: ""
    };
}

// Track which hints have been viewed in localStorage
function trackHintView(challengeNumber, hintNumber) {
    const storageKey = `challenge${challengeNumber}_hints`;
    let viewedHints = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (!viewedHints.includes(hintNumber)) {
        viewedHints.push(hintNumber);
        localStorage.setItem(storageKey, JSON.stringify(viewedHints));
    }
    
    return viewedHints;
}

// Check if all hints for a challenge have been viewed
function haveAllHintsBeenViewed(challengeNumber) {
    const storageKey = `challenge${challengeNumber}_hints`;
    const viewedHints = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const totalHints = (challengeHints[challengeNumber] || []).length;
    
    return viewedHints.length >= totalHints && totalHints > 0;
}

const challengeHints = {
    // Challenge 1: Hidden Text
    1: [
        "Look carefully at the whole page. Not everything you see is all that's there!",
        "Have you tried selecting text on this page? Click and drag your mouse across different areas.",
        "Web designers can hide text by making it the same color as the background. When you select text, it changes color and can become visible.",
        "Try selecting ALL text on the page at once using Ctrl+A (or Command+A on Mac)."
    ],
    
    // Challenge 2: Inspecting HTML Source
    2: [
        "The flag isn't visible on the page itself. It's hiding somewhere else!",
        "Every webpage is made with code called HTML. This code can be seen if you know where to look!",
        "Developers use 'comments' in HTML to leave notes for themselves that don't show on the page. These look like <!-- comment text -->.",
        "To view the page's source code, right-click anywhere on the page and select 'View Page Source' or press Ctrl+U (Command+Option+U on Mac)."
    ],
    
    // Challenge 3: Obfuscation
    3: [
        "Check the page source again, but something seems strange about the text...",
        "Sometimes messages are disguised by changing how they're written. This is called 'obfuscation'.",
        "One simple way to hide a message is to write it backward. Our brains aren't used to reading text from right to left.",
        "Try reading the comment in the source code backward, starting from the last character and going to the first."
    ],
    
    // Challenge 4: Alphabet Position Cipher
    4: [
        "Look at those numbers carefully. They seem intentional - not random.",
        "These numbers are all between 1 and 26. What else has exactly 26 items?",
        "Think about the alphabet. If you were to assign each letter a number...",
        "Each number corresponds to a letter's position: A=1, B=2, C=3, etc. Try converting the numbers!"
    ],
    
    // Challenge 5: Caesar Cipher
    5: [
        "There's a message encrypted with a 'Caesar cipher', named after Julius Caesar who used it 2000 years ago!",
        "A Caesar cipher works by shifting each letter a fixed number of positions in the alphabet. Maybe there's a clue for how many positions to shift...",
        "To decode a Caesar cipher, you shift each letter backward in the alphabet. For a shift of 3: D→A, E→B, F→C, etc.",
        "Apply the shift to each letter in 'GHFRGH' to reveal the flag."
    ],
    
    // Challenge 6: Analog Clock Message
    6: [
        "The clock faces seem to be trying to tell us something. What could the different positions mean?",
        "Clocks divide a circle into 12 positions. What if each position represented a letter?",
        "Try matching each hour position to its corresponding letter: 1=A, 2=B, 3=C, all the way to 12=L.",
        "Look at where the hour hand points in each clock and write down the matching letter."
    ],
    
    // Challenge 7: URL Parameter
    7: [
        "The flag is hiding in plain sight, but not on the page itself.",
        "Take a look at the top of your browser. That's the address or URL of this page.",
        "URLs can contain extra information called 'parameters' after a question mark (?). Notice this URL ends with '?level=6'.",
        "Try changing the number in the URL from '6' to '7' and press Enter to load the new address."
    ],
    
    // Challenge 8: Code Reading
    8: [
        "The page is checking your flag in a special way. Try looking at the page source to see how.",
        "Look for the JavaScript code that validates the flag. It's checking specific positions in your answer.",
        "In programming, we start counting from 0, not 1! So position 0 means the first character, position 1 means the second character, and so on.",
        "According to the code: position 0 must be 'B', position 1 must be '4', position 2 must be 'N', and so on."
    ],
    
    // Challenge 9: Terminal with Hidden File
    9: [
        "You're looking at a command-line terminal. These are powerful tools that computer experts use. Try typing 'help'.",
        "In UNIX-based systems (like Mac and Linux), files and folders that start with a dot (.) are hidden by default.",
        "To see hidden files, use the 'ls -a' command ('ls' means 'list' and '-a' means 'all', including hidden items).",
        "To navigate to a folder, use 'cd foldername'. To read a file, use 'cat filename'."
    ],
    
    // Challenge 10: Terminal with Encoded File
    10: [
        "There's another secret in this terminal, but the text in the file doesn't make sense.",
        "The text 'RklOQUxF' is encoded using Base64, which converts binary data to text characters.",
        "Base64 is used to safely transmit data that might otherwise be corrupted during transfer.",
        "You can decode Base64 text using the 'decode' command. Try 'decode RklOQUxF'."
    ]
};

const challengeSolutions = {
    1: {
        answer: "SElEREVO",
        steps: [
            "U2VsZWN0IGFsbCB0ZXh0IG9uIHRoZSBwYWdlIChDdHJsK0EpIHRvIHJldmVhbCB0aGUgaGlkZGVuIGZsYWc6IEhJRERFTg=="
        ]
    },
    2: {
        answer: "U09VUkNF",
        steps: [
            "VmlldyBwYWdlIHNvdXJjZSAoQ3RybCtVKSBhbmQgbG9vayBmb3IgYSBjb21tZW50IGNvbnRhaW5pbmcgdGhlIGZsYWc6IFNPVVJDRQ=="
        ]
    },
    3: {
        answer: "UkVGTEVDVA==",
        steps: [
            "VmlldyBwYWdlIHNvdXJjZSBhbmQgcmVhZCB0aGUgY29tbWVudCBiYWNrd2FyZCB0byBnZXQ6IFJFRkxFQ1Q="
        ]
    },
    4: {
        answer: "UFVaWkxF",
        steps: [
            "Q29udmVydCBlYWNoIG51bWJlciB0byBpdHMgY29ycmVzcG9uZGluZyBsZXR0ZXIgKDE2PVAsIDIxPVUsIDI2PVosIDI2PVosIDEyPUwsIDU9RSkgdG8gZ2V0OiBQVVpaTEU="
        ]
    },
    5: {
        answer: "REVDT0RF",
        steps: [
            "RGVjcnlwdCB0aGUgQ2Flc2FyIGNpcGhlciAnR0hGUkdIJyBieSBzaGlmdGluZyBlYWNoIGxldHRlciBiYWNrIDMgcG9zaXRpb25zIHRvIGdldDogREVDT0RF"
        ]
    },
    6: {
        answer: "RkFCTEVE",
        steps: [
            "TWF0Y2ggZWFjaCBjbG9jayBob3VyIHBvc2l0aW9uIHRvIGl0cyBsZXR0ZXIgKDY9RiwgMT1BLCAyPUIsIDEyPUwsIDU9RSwgND1EKSB0byBnZXQ6IEZBQkxFRA=="
        ]
    },
    7: {
        answer: "VVJMIFBBUkFNRVRFUg==",
        steps: [
            "Q2hhbmdlIHRoZSBVUkwgcGFyYW1ldGVyIGZyb20gJz9sZXZlbD02JyB0byAnP2xldmVsPTcnIHRvIHByb2NlZWQgdG8gdGhlIG5leHQgY2hhbGxlbmdlCgpFeGFtcGxlIFVSTCBzdHJ1Y3R1cmU6IHlvdXJzaXRlLmNvbS9wYWdlLmh0bWw/cGFyYW1ldGVyPXZhbHVl"
        ]
    },
    8: {
        answer: "QjRONE40",
        steps: [
            "RXhhbWluZSB0aGUgdmFsaWRhdGlvbiBjb2RlIGluIHBhZ2Ugc291cmNlIC0gaXQgcmVxdWlyZXMgc3BlY2lmaWMgY2hhcmFjdGVycyBhdCBlYWNoIHBvc2l0aW9uOiBCNE40TjQ="
        ]
    },
    9: {
        answer: "Q09NTUFORA==",
        steps: [
            "VXNlICdscyAtYScsICdjZCAuc2VjcmV0JywgJ2NhdCBwYXNzd29yZC50eHQnIHRvIGZpbmQgdGhlIGZsYWc6IENPTU1BTkQ="
        ]
    },
    10: {
        answer: "RklOQUxF",
        steps: [
            "VXNlICdscyAtYScsICdjYXQgLnNlY3JldC9maW5hbC50eHQnLCB0aGVuICdkZWNvZGUgUmtsT1FVeEYnIHRvIGdldCB0aGUgZmxhZzogRklOQUxF"
        ]
    }
};
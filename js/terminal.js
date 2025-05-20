function initTerminal(fileSystem, challenge) {
    console.log("Initializing terminal...");
    console.log("File system structure:", fileSystem);
    
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalContainer = document.getElementById('terminal-container');
    
    if (!terminalInput || !terminalOutput || !terminalPrompt || !terminalContainer) {
        console.error("Terminal elements not found!");
        return;
    }
    
    const terminalState = {
        currentPath: '/',
        history: [],
        historyIndex: -1
    };
    
    console.log("Terminal state initialized:", terminalState);
    
    // Function to initialize the terminal with output message
    function initializeTerminalOutput() {
        terminalOutput.innerHTML = '<div>====== Secret Terminal ======</div><div>Welcome! Type \'help\' to see what commands you can use.</div><div>This is a terminal where you can explore files and solve challenges!</div>';
    }
    
    function getItemFromPath(path) {
        // Handle absolute and relative paths
        let current = fileSystem['/'];
        
        const parts = path.split('/').filter(Boolean);
        
        // Empty path or / means root
        if (parts.length === 0) {
            return current;
        }
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (current[part] !== undefined) {
                current = current[part];
            } else {
                // Path component not found
                return null;
            }
        }
        
        return current;
    }
    
    function getDirFromPath(path) {
        // Handle special case for root
        if (path === '/' || path === '') {
            return fileSystem['/'];
        }
        
        const lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) {
            // No slashes, so it's in the current directory
            return getCurrentDirectory();
        } else if (lastSlash === 0) {
            // Starts with slash but no other slashes
            return fileSystem['/'];
        } else {
            // Get the directory path
            const dirPath = path.substring(0, lastSlash);
            return getItemFromPath(dirPath);
        }
    }
    
    function getFilenameFromPath(path) {
        const lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) {
            // No slashes, so the whole thing is the filename
            return path;
        } else {
            // Extract the part after the last slash
            return path.substring(lastSlash + 1);
        }
    }

    // Function to resolve a path to an absolute path
    function resolvePath(path) {
        // If it's an absolute path, start from root
        if (path.startsWith('/')) {
            return path;
        }
        
        // For relative paths, combine with current path
        let basePath = terminalState.currentPath;
        if (basePath !== '/') {
            basePath += '/';
        }
        
        // Join the paths and handle ./ and ../
        const fullPath = basePath + path;
        const parts = fullPath.split('/').filter(Boolean);
        const resultParts = [];
        
        for (const part of parts) {
            if (part === '.') {
                // Skip current directory markers
                continue;
            } else if (part === '..') {
                // Go up one directory
                if (resultParts.length > 0) {
                    resultParts.pop();
                }
            } else {
                resultParts.push(part);
            }
        }
        
        return '/' + resultParts.join('/');
    }
    
    function getCurrentDirectory() {
        return getItemFromPath(terminalState.currentPath);
    }
    
    function updatePrompt() {
        let displayPath = terminalState.currentPath === '/' ? '~' : '~' + terminalState.currentPath;
        terminalPrompt.textContent = `root@terminal:${displayPath}#`;
    }
    
    // Function to decode Base64 text
    function decodeBase64(text) {
        try {
            return 'Decoded text: ' + atob(text);
        } catch (e) {
            return 'Error: The text is not valid Base64 encoded data.';
        }
    }
    
    function isDirectory(item) {
        return typeof item === 'object';
    }
    
    function getFileSize(item) {
        if (isDirectory(item)) {
            // For directories, count entries
            return Object.keys(item).length + ' items';
        } else {
            // For files, estimate size by text length (simplified for educational purposes)
            const length = item.length;
            if (length < 1024) {
                return length + ' B';
            } else {
                return Math.round(length / 1024) + ' KB';
            }
        }
    }
    
    function formatLsEntry(name, item, isHidden) {
        const isDir = isDirectory(item);
        const size = getFileSize(item);
        
        // Create formatted entry with appropriate CSS classes
        const entryEl = document.createElement('div');
        entryEl.className = 'ls-entry';
        
        // Type indicator
        const typeSpan = document.createElement('span');
        typeSpan.className = isDir ? 'ls-dir-indicator' : 'ls-file-indicator';
        typeSpan.textContent = isDir ? '[DIR] ' : '[FILE]';
        
        // Name with appropriate color
        const nameSpan = document.createElement('span');
        if (isHidden) {
            nameSpan.className = 'ls-hidden';
        } else if (isDir) {
            nameSpan.className = 'ls-dir';
        } else {
            nameSpan.className = 'ls-file';
        }
        nameSpan.textContent = name;
        
        // Size indicator
        const sizeSpan = document.createElement('span');
        sizeSpan.className = 'ls-size';
        sizeSpan.textContent = size;
        
        // Format columns with proper spacing
        entryEl.appendChild(typeSpan);
        entryEl.appendChild(document.createTextNode(' '));
        entryEl.appendChild(sizeSpan);
        entryEl.appendChild(document.createTextNode(' '));
        entryEl.appendChild(nameSpan);
        
        return entryEl;
    }
    
    // Command handler functions
    function handleHelpCommand(args) {
        if (args.length > 1) {
            const helpCmd = args[1].toLowerCase();
            const command = commands[helpCmd];
            if (command && command.availableInChallenge.includes(challenge)) {
                return command.usage;
            } else {
                return `No help available for '${args[1]}'`;
            }
        }
        
        const availableCommands = getAvailableCommands();
        const commandsList = formatCommandsList(availableCommands);
        
        return `Available commands:

${commandsList}

For more information on a command, type 'help <command>'
Example: help ls`;
    }
    
    function handleLsCommand(args) {
        const showHidden = args.includes('-a') || args.includes('--all');
        
        let targetPath = '.';
        let targetDir;
        
        // Check if path argument was provided
        if (args.length > 1 && !args[1].startsWith('-')) {
            targetPath = args[1];
        }
        
        // Handle absolute or relative path
        if (targetPath.startsWith('/')) {
            targetDir = getItemFromPath(targetPath);
        } else {
            const absPath = resolvePath(targetPath);
            targetDir = getItemFromPath(absPath);
        }
        
        if (!targetDir) {
            return `ls: cannot access '${targetPath}': No such file or directory`;
        }
        
        if (!isDirectory(targetDir)) {
            // If it's a file, just show the file info
            const fileName = getFilenameFromPath(targetPath);
            const outputDiv = document.createElement('div');
            outputDiv.className = 'ls-output';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'ls-header';
            headerDiv.innerHTML = '<span class="ls-type-header">TYPE</span> <span class="ls-size-header">SIZE</span> <span class="ls-name-header">NAME</span>';
            outputDiv.appendChild(headerDiv);
            
            outputDiv.appendChild(formatLsEntry(
                fileName,
                targetDir,
                fileName.startsWith('.')
            ));
            
            return outputDiv.outerHTML;
        }
        
        // Create a container for the styled output
        const outputDiv = document.createElement('div');
        outputDiv.className = 'ls-output';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'ls-header';
        headerDiv.innerHTML = '<span class="ls-type-header">TYPE</span> <span class="ls-size-header">SIZE</span> <span class="ls-name-header">NAME</span>';
        outputDiv.appendChild(headerDiv);
        
        let visibleItemCount = 0;
        
        // Add . and .. entries only if showing hidden files
        if (showHidden) {
            outputDiv.appendChild(formatLsEntry('.', { '.': targetDir }, true));
            outputDiv.appendChild(formatLsEntry('..', { '..': targetDir }, true));
            visibleItemCount += 2;
        }
        
        const items = Object.keys(targetDir);
        items.sort((a, b) => {
            // Sort directories first, then by name
            const aIsDir = isDirectory(targetDir[a]);
            const bIsDir = isDirectory(targetDir[b]);
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.localeCompare(b);
        });
        
        for (const item of items) {
            // Skip hidden files unless -a is specified
            if (item.startsWith('.') && !showHidden) {
                continue;
            }
            
            outputDiv.appendChild(formatLsEntry(
                item, 
                targetDir[item], 
                item.startsWith('.')
            ));
            visibleItemCount++;
        }
        
        // If directory is empty (no visible items)
        if (visibleItemCount === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.textContent = "(empty directory)";
            outputDiv.appendChild(emptyDiv);
        }
        
        return outputDiv.outerHTML;
    }
    
    function handleCdCommand(args) {
        if (args.length < 2) {
            terminalState.currentPath = '/';
            updatePrompt();
            return '';
        }
        
        const dirPath = args[1];
        let newPath;
        
        // Handle special cases
        if (dirPath === '.') {
            // Current directory - do nothing
            return '';
        } else if (dirPath === '..') {
            // Parent directory
            if (terminalState.currentPath === '/') {
                return ''; // Already at root
            }
            
            // Remove the last directory from the path
            const pathParts = terminalState.currentPath.split('/').filter(Boolean);
            pathParts.pop();
            newPath = '/' + pathParts.join('/');
            
            // If the path is empty now, set it to root
            if (newPath === '') {
                newPath = '/';
            }
        } else if (dirPath === '/') {
            newPath = '/';
        } else {
            newPath = dirPath.startsWith('/') ? dirPath : resolvePath(dirPath);
            
            // Check if the path exists and is a directory
            const newDir = getItemFromPath(newPath);
            if (!newDir) {
                return `cd: ${dirPath}: No such file or directory`;
            }
            
            if (!isDirectory(newDir)) {
                return `cd: ${dirPath}: Not a directory`;
            }
        }
        
        terminalState.currentPath = newPath;
        updatePrompt();
        return '';
    }
    
    function handleCatCommand(args) {
        if (args.length < 2) {
            return 'Usage: cat <file>';
        }
        
        const filePath = args[1];
        let item;
        
        if (filePath.startsWith('/')) {
            item = getItemFromPath(filePath);
        } else {
            const absPath = resolvePath(filePath);
            item = getItemFromPath(absPath);
        }
        
        if (!item) {
            return `cat: ${filePath}: No such file or directory`;
        }
        
        if (isDirectory(item)) {
            return `cat: ${filePath}: Is a directory`;
        }
        
        return item;
    }
    
    function handleDecodeCommand(args) {
        if (args.length < 2) {
            return 'Usage: decode [text] - Decodes Base64 encoded text';
        }
        
        return decodeBase64(args[1]);
    }
    
    function handleClearCommand() {
        initializeTerminalOutput();
        return '';
    }
    
    // Utility functions for command management
    function getAvailableCommands() {
        return Object.values(commands)
            .filter(cmd => cmd.availableInChallenge.includes(challenge))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    
    function formatCommandsList(commandsList) {
        return commandsList.map(cmd => 
            `${cmd.name.padEnd(10)} - ${cmd.description}`
        ).join('\n');
    }
    
    // Command definitions with metadata
    const commands = {
        help: {
            name: "help",
            handler: handleHelpCommand,
            usage: `Usage: help [command]

Shows information about commands.
Type 'help' to see all commands.
Type 'help ls' to learn about the ls command.

Options:
  -h, --help      Show this message`,
            description: "Display help for commands",
            availableInChallenge: [8, 9]
        },
        ls: {
            name: "ls",
            handler: handleLsCommand,
            usage: `Usage: ls [OPTION]

List information about files in the current directory.

Options:
  -a, --all       Show hidden files (ones that start with a dot)
  -h, --help      Display this help message`,
            description: "List directory contents",
            availableInChallenge: [8, 9]
        },
        cd: {
            name: "cd",
            handler: handleCdCommand,
            usage: `Usage: cd [directory]

Change to a different directory.

Special paths:
  ..             Go back to the previous directory
  .              Stay in the current directory
  /              Go to the main directory
  [folder name]  Go to the named folder

Options:
  -h, --help     Show this help message`,
            description: "Change directory",
            availableInChallenge: [8, 9]
        },
        cat: {
            name: "cat",
            handler: handleCatCommand,
            usage: `Usage: cat [FILE]

Display the contents of a file.
Example: cat myfile.txt

Options:
  -h, --help     Show this help message`,
            description: "Display file contents",
            availableInChallenge: [8, 9]
        },
        clear: {
            name: "clear",
            handler: handleClearCommand,
            usage: `Usage: clear

Clear the terminal screen to start fresh.

Options:
  -h, --help     Show this help message`,
            description: "Clear the terminal screen",
            availableInChallenge: [8, 9]
        },
        decode: {
            name: "decode",
            handler: handleDecodeCommand,
            usage: `Usage: decode [TEXT]

Decode secret text that's written in Base64.
Example: decode SGVsbG8=

Options:
  -h, --help     Show this help message`,
            description: "Decode Base64 encoded text",
            availableInChallenge: [9]
        }
    };
    
    // Handle help flags consistently across all commands
    function processHelpFlag(cmd) {
        const command = commands[cmd];
        if (command && command.availableInChallenge.includes(challenge)) {
            return command.usage;
        }
        return `No help available for '${cmd}'. Try 'help' for a list of available commands.`;
    }
    
    function handleCommand(command, isPiped = false) {
        if (!command.trim()) {
            return '';
        }
        
        console.log("Handling command:", command);
        
        // Check for pipe (only in challenge 9) - But don't process pipes within pipes
        if (challenge === 9 && command.includes('|') && !isPiped) {
            const parts = command.split('|').map(part => part.trim());
            const firstOutput = handleCommand(parts[0], true);
            
            // For simplicity, we only handle single pipes and only cat | decode
            if (parts[1].startsWith('decode')) {
                return decodeBase64(firstOutput);
            } else {
                return `Pipe to '${parts[1].split(' ')[0]}' is not supported.`;
            }
        }
        
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();
        
        // Handle help flags
        if (args.length > 1 && (args[1] === '--help' || args[1] === '-h')) {
            return processHelpFlag(cmd);
        }
        
        // Execute the command handler if it exists
        if (commands[cmd]) {
            // Check if command is available in current challenge
            if (!commands[cmd].availableInChallenge.includes(challenge)) {
                return `${cmd}: command not found`;
            }
            return commands[cmd].handler(args);
        }
        
        return `${cmd}: command not found`;
    }
    
    // Add command output to the terminal (includes prompt)
    function addCommandOutput(command, output) {
        // Create elements with explicit control over line breaks and spacing
        const entry = document.createElement('div');
        entry.className = 'terminal-entry';
        
        // Command line - avoid any extra whitespace
        const commandLine = document.createElement('div');
        
        // Create the prompt span
        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = terminalPrompt.textContent;
        
        // Add prompt and command text directly to avoid any whitespace from innerHTML
        commandLine.appendChild(promptSpan);
        if (command.trim()) {
            commandLine.appendChild(document.createTextNode(' ' + command));
        }
        
        // Add command line to entry
        entry.appendChild(commandLine);
        
        // Add output (if any) with careful control of whitespace
        if (output.trim()) {
            // Check if output is HTML (from ls command)
            if (output.startsWith('<div')) {
                // Parse HTML and add the element directly
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = output;
                entry.appendChild(tempDiv.firstChild);
            } else {
                // Add text output with line breaks
                const outputLines = output.split('\n');
                for (const line of outputLines) {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'terminal-output-line'; // Add a class for styling
                    outputLine.textContent = line;
                    entry.appendChild(outputLine);
                }
            }
        }
        
        // Add the complete entry to the terminal
        terminalOutput.appendChild(entry);
        
        // Ensure terminal scrolls to the latest content
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }
    
    // Add event handler for input
    terminalInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            console.log("Enter key pressed");
            const command = terminalInput.value;
            
            // Add to history only if not empty
            if (command.trim()) {
                terminalState.history.unshift(command);
                terminalState.historyIndex = -1;
            }
            
            // Process command and show output (even if empty)
            const output = handleCommand(command);
            addCommandOutput(command, output);
            
            // Clear input
            terminalInput.value = '';
            
            // Prevent default
            event.preventDefault();
        }
    });
    
    // Add Tab key handler for autocompletion
    terminalInput.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            handleTabCompletion();
        } else if (event.key === 'ArrowUp') {
            if (terminalState.historyIndex < terminalState.history.length - 1) {
                terminalState.historyIndex++;
                terminalInput.value = terminalState.history[terminalState.historyIndex];
            }
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            if (terminalState.historyIndex > 0) {
                terminalState.historyIndex--;
                terminalInput.value = terminalState.history[terminalState.historyIndex];
            } else if (terminalState.historyIndex === 0) {
                terminalState.historyIndex = -1;
                terminalInput.value = '';
            }
            event.preventDefault();
        }
    });
    
    // Function to handle tab completion
    function handleTabCompletion() {
        const input = terminalInput.value;
        const parts = input.split(' ').filter(Boolean);
        
        // Command completion (first word)
        if (parts.length === 1 && !input.endsWith(' ')) {
            const partialCommand = parts[0].toLowerCase();
            const availableCommandNames = getAvailableCommands().map(cmd => cmd.name);
            
            const matches = availableCommandNames.filter(cmd => cmd.startsWith(partialCommand));
            
            if (matches.length === 1) {
                // Single match, auto-complete
                terminalInput.value = matches[0] + ' ';
            } else if (matches.length > 0) {
                // Find longest common prefix
                const longestPrefix = findLongestCommonPrefix(matches);
                if (longestPrefix.length > partialCommand.length) {
                    terminalInput.value = longestPrefix;
                }
            }
            return;
        }
        
        // File/directory completion (second word or later)
        if (parts.length >= 1) {
            const command = parts[0].toLowerCase();
            
            // Only attempt file completion for commands that take file arguments
            if (['ls', 'cd', 'cat'].includes(command)) {
                let path = '';
                
                // If there's a second part that doesn't end with space, use it as partial path
                if (parts.length > 1 && !input.endsWith(' ')) {
                    path = parts[parts.length - 1];
                }
                
                // No path to complete
                if (!path) return;
                
                // Handle path with directory components
                const lastSlash = path.lastIndexOf('/');
                let dirPath = '';
                let partial = path;
                
                if (lastSlash !== -1) {
                    dirPath = path.substring(0, lastSlash + 1); // Include the trailing slash
                    partial = path.substring(lastSlash + 1);
                }
                
                // Get directory for completion
                let dir;
                if (dirPath.startsWith('/')) {
                    // Absolute path
                    const targetDirPath = dirPath.length > 1 ? dirPath.substring(0, dirPath.length - 1) : '/';
                    dir = getItemFromPath(targetDirPath);
                } else if (dirPath) {
                    // Relative path with directory component
                    const targetDirPath = resolvePath(dirPath.substring(0, dirPath.length - 1));
                    dir = getItemFromPath(targetDirPath);
                } else {
                    // Current directory
                    dir = getCurrentDirectory();
                }
                
                if (!dir || !isDirectory(dir)) {
                    // Invalid directory path
                    return;
                }
                
                // Get directory entries - ONLY NON-HIDDEN unless path starts with dot
                const entries = Object.keys(dir).filter(entry => {
                    // Only include hidden files if user is explicitly typing a dot prefix
                    return !entry.startsWith('.') || partial.startsWith('.');
                });
                
                // Filter entries that match the partial
                const matches = entries.filter(entry => entry.startsWith(partial));
                
                if (matches.length === 1) {
                    // Single match, auto-complete
                    const matchEntry = matches[0];
                    
                    // Replace the partial with the match
                    const completion = dirPath + matchEntry;
                    
                    // If it's a directory, add a trailing slash
                    if (isDirectory(dir[matchEntry])) {
                        parts[parts.length - 1] = completion + '/';
                    } else {
                        parts[parts.length - 1] = completion;
                    }
                    
                    terminalInput.value = parts.join(' ');
                } else if (matches.length > 0) {
                    // Find longest common prefix for partial completion
                    const longestPrefix = findLongestCommonPrefix(matches);
                    if (longestPrefix.length > partial.length) {
                        parts[parts.length - 1] = dirPath + longestPrefix;
                        terminalInput.value = parts.join(' ');
                    }
                }
            }
        }
    }
    
    // Helper function to find the longest common prefix among strings
    function findLongestCommonPrefix(strings) {
        if (strings.length === 0) return '';
        if (strings.length === 1) return strings[0];
        
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    }
    
    // Focus terminal input when terminal container is clicked
    terminalContainer.addEventListener('click', function() {
        terminalInput.focus();
    });
    
    // Initial focus
    terminalInput.focus();
    
    // Initial prompt update
    updatePrompt();
    
    // Initialize terminal output with welcome message
    initializeTerminalOutput();
    
    console.log("Terminal initialized successfully");
    
    // Mark that this terminal has been initialized
    window.terminalInitialized = true;
    
    return true;
}

// Make initTerminal global by attaching to window
window.initTerminal = initTerminal;

// Log that terminal.js has loaded
console.log("Terminal.js loaded successfully, initTerminal function is available globally");
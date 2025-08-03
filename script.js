document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element Selection ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const htmlEl = document.documentElement;
    const allPromptCards = document.querySelectorAll('#prompt-cards-grid .glass-card');
    const displayArea = document.getElementById('prompt-display-area');
    const placeholderArea = document.getElementById('placeholder-area');
    const promptTextContainer = document.getElementById('prompt-text-container');
    const subjectInputContainer = document.getElementById('subject-input-container');
    const subjectInput = document.getElementById('subject-input');
    const copyButton = document.getElementById('copy-button');
    const copyFeedback = document.getElementById('copy-feedback');

    // --- Prompt Data ---
    const prompts = {
        roadmap: {
            text: `You are a coding tutor for Mohit. Mohit is currently trying to learn Python. He has no prior programming experience.\n\nSo, guide him on his journey and give him a roadmap with a realistic timeframe. Begin with the basics and gradually progress to advanced concepts.\n\nKeep recommending external resources that Mohit can Google search or visit anytime.`
        },
        deepdive: {
            text: `Tell me everything about Lists in Python that I can learn and practice in 1 hour.\n\nGive me exercises that I can solve and challenge me with tricky questions and push my limits.`
        },
        'pareto-py': {
            text: `You are an expert teacher who simplifies complex concepts.\n\nTeach me about Python <Subject> using the Pareto Principle, focusing on the 20% of key ideas, concepts or methods that will help me understand and achieve 80% of the results.\n\nProvide practical examples, step-by-step guidance, and actionable tips to apply this knowledge effectively.`,
            needsInput: true,
            placeholder: 'Lists'
        },
        'pareto-js': {
            text: `You are an expert teacher in JavaScript.\n\nTeach me about JavaScript <Subject> using the Pareto Principle.\n\nFocus on the 20% of core concepts and techniques that will help me understand and achieve 80% of the results in real-world projects.\n\nProvide examples, explain key methods, and suggest practical ways to practice and apply this knowledge.`,
            needsInput: true,
            placeholder: 'Promises'
        },
        debug: {
            text: `Here is my Python code. It has a bug. Please analyze the code, identify the bug, and suggest a fix.\n\nIf possible, explain the issue in simple terms for me to understand.\n\n[PASTE YOUR CODE HERE]`
        },
        optimize: {
            text: `This is my function. Can you optimize it for better performance?\n\nSuggest any improvements in readability, efficiency, or code structure.\n\n[PASTE YOUR CODE HERE]`
        },
        solve: {
            text: `Give me a step-by-step solution to this problem statement and then challenge me with a harder version of the problem.\n\n[PASTE YOUR PROBLEM STATEMENT HERE]`
        },
        explain: {
            text: `Explain the concept of <Subject> in simple terms. Then show me a real world example where this is used.`,
            needsInput: true,
            placeholder: 'Recursion'
        },
        project: {
            text: `Help me brainstorm project ideas in <Subject>.\n\nSuggest features and tools to implement these ideas.`,
            needsInput: true,
            placeholder: 'AI for Driving cars'
        }
    };

    let currentPromptKey = null;

    // --- Functions ---

    /**
     * Updates the text in the prompt display area based on the current selection and user input.
     */
    function updatePromptText() {
        if (!currentPromptKey) return;

        const promptData = prompts[currentPromptKey];
        let text = promptData.text;

        if (promptData.needsInput) {
            const subject = subjectInput.value.trim() || promptData.placeholder;
            text = text.replace(/<Subject>/g, subject);
        }
        promptTextContainer.textContent = text;
    }
    
    /**
     * Displays the selected prompt and configures the input field if needed.
     * @param {string} key - The key for the selected prompt in the `prompts` object.
     */
    function displayPrompt(key) {
        currentPromptKey = key;
        const promptData = prompts[key];
        
        placeholderArea.classList.add('hidden');
        displayArea.classList.remove('hidden');

        // Scroll to the prompt display area for better visibility
        displayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (promptData.needsInput) {
            subjectInputContainer.classList.remove('hidden');
            subjectInput.value = '';
            subjectInput.placeholder = `e.g., ${promptData.placeholder}`;
            subjectInput.focus();
        } else {
            subjectInputContainer.classList.add('hidden');
        }
        
        updatePromptText();
    }

    /**
     * Toggles the display of theme icons based on the current mode.
     * @param {boolean} isDark - True if dark mode is active, false otherwise.
     */
    function updateThemeIcons(isDark) {
        themeIconLight.classList.toggle('hidden', isDark);
        themeIconDark.classList.toggle('hidden', !isDark);
    }

    /**
     * Sets the initial theme based on localStorage or system preference.
     */
    function setInitialTheme() {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
        updateThemeIcons(isDark);
    }

    // --- Event Listeners ---

    // Theme toggling
    themeToggle.addEventListener('click', () => {
        const isDark = htmlEl.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        updateThemeIcons(isDark);
    });

    // Mouse-follow glow effect for all glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Clicks on each prompt card
    allPromptCards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract key from ID like "prompt-card-roadmap" -> "roadmap"
            const key = card.id.replace('prompt-card-', '');
            displayPrompt(key);
        });
    });

    // Update prompt text on input
    subjectInput.addEventListener('input', updatePromptText);

    // Copy to clipboard
    copyButton.addEventListener('click', () => {
        const textToCopy = promptTextContainer.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Success
            copyFeedback.classList.remove('hidden');
            copyButton.textContent = 'Copied!';

            setTimeout(() => {
                copyFeedback.classList.add('hidden');
                copyButton.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            // Fallback for older browsers
            console.error('Failed to copy with navigator.clipboard:', err);
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            try {
                document.execCommand('copy');
                copyFeedback.classList.remove('hidden');
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyFeedback.classList.add('hidden');
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (execErr) {
                console.error('Fallback copy failed:', execErr);
                copyButton.textContent = 'Error';
                 setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }
            document.body.removeChild(tempTextArea);
        });
    });

    // --- Initial Setup ---
    setInitialTheme();
});

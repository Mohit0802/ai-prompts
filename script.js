document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element Selection ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const htmlEl = document.documentElement;
    
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    const allPromptCards = document.querySelectorAll('#prompt-cards-grid .glass-card');
    const displayArea = document.getElementById('prompt-display-area');
    const placeholderArea = document.getElementById('placeholder-area');
    const promptTextContainer = document.getElementById('prompt-text-container');
    
    // Input containers and fields
    const inputsContainer = document.getElementById('inputs-container');
    const subjectInputContainer = document.getElementById('subject-input-container');
    const subjectInput = document.getElementById('subject-input');
    const languageInputContainer = document.getElementById('language-input-container');
    const languageInput = document.getElementById('language-input');

    const copyButton = document.getElementById('copy-button');
    const copyFeedback = document.getElementById('copy-feedback');

    // --- Dynamic Prompt Generation ---
    const prompts = {
        roadmap: {
            generate: () => {
                const intros = [
                    "You are a friendly and encouraging coding tutor for Mohit, a complete beginner.",
                    "Act as an expert Python instructor creating a personalized learning plan for Mohit, who has no prior programming experience.",
                    "Imagine you are Mohit's personal AI mentor. Your goal is to create a clear and realistic Python learning roadmap for an absolute beginner."
                ];
                const outros = [
                    "Make sure the plan is broken down into weekly goals.",
                    "Include suggestions for small, fun projects at each stage to keep him motivated.",
                    "Recommend key external resources (like websites, books, or YouTube channels) that are great for beginners."
                ];
                return `${intros[Math.floor(Math.random() * intros.length)]}\n\nCreate a comprehensive roadmap that starts with the absolute basics and progressively moves to more advanced topics. ${outros[Math.floor(Math.random() * outros.length)]}`;
            }
        },
        deepdive: {
            generate: () => `I want to do a 1-hour deep-dive session on Python lists.\n\nBreak down the topic into a 60-minute learning plan. Cover everything from the basics (creation, indexing, slicing) to more advanced concepts (list comprehensions, methods like .sort(), .append(), .pop()).\n\nProvide practical exercises and challenge me with tricky questions to solidify my understanding.`,
            needsInput: false
        },
        'pareto-py': {
            generate: () => `You are an expert teacher who simplifies complex concepts.\n\nTeach me about Python <Subject> using the Pareto Principle. Focus on the 20% of the topic that will give me 80% of the practical results.\n\nProvide clear explanations, practical code examples, and actionable tips.`,
            needsInput: true,
            placeholder: 'Functions'
        },
        'pareto-js': {
            generate: () => `You are an expert JavaScript teacher.\n\nI want to learn about JavaScript <Subject> using the 80/20 rule. What are the core 20% of concepts and methods that I need to know to be effective in real-world projects?\n\nExplain with practical examples and suggest how to apply this knowledge.`,
            needsInput: true,
            placeholder: 'Promises'
        },
        debug: {
            generate: () => `Act as an expert Python debugger.\n\nHere is a piece of my code. It's not working as expected. Please analyze it, identify the bug, explain the root cause in simple terms, and provide the corrected code.`
        },
        optimize: {
            generate: () => `Please act as a senior software developer and review my code for optimization.\n\nAnalyze the following function and suggest improvements for performance, readability, and efficiency. Explain the "why" behind your suggestions.`
        },
        solve: {
            generate: () => `I have a coding problem I need to solve.\n\nFirst, provide a clear, step-by-step explanation of one possible solution. Then, challenge me with a slightly harder version of the same problem to test my understanding.`
        },
        explain: {
            generate: () => `Explain the concept of <Subject> in <Language> as if I were a complete beginner.\n\nUse a real-world analogy to help me understand the core idea. Then, show me a simple code example in <Language> that demonstrates how it works in practice.`,
            needsInput: true,
            placeholder: 'Recursion',
            needsLanguage: true, // Flag to show the language input
            languagePlaceholder: 'Python'
        },
        project: {
            generate: () => `I want to build a project related to <Subject>.\n\nHelp me brainstorm 3-5 project ideas, ranging from simple to complex. For each idea, suggest a few key features and the technologies or libraries I might need to build it.`,
            needsInput: true,
            placeholder: 'Data Visualization'
        }
    };

    let currentPromptKey = null;

    // --- Functions ---
    
    function generateSearchPrompt(topic) {
        const templates = [
            `I need to learn about "${topic}". Explain it to me like I'm 15 years old. Cover the key ideas, provide a simple example, and give me a real-world analogy.`,
            `Create a mini-tutorial on "${topic}". Start with a simple definition, show a practical code example, and then explain a common use case for it.`,
            `You are my personal tutor. Teach me the fundamentals of "${topic}". What are the most important things I need to know to get started?`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    function updatePromptText() {
        if (!currentPromptKey) return;

        const promptData = prompts[currentPromptKey];
        let text = promptData.generate();

        if (promptData.needsInput) {
            const subject = subjectInput.value.trim() || promptData.placeholder;
            text = text.replace(/<Subject>/g, subject);
        }
        
        if (promptData.needsLanguage) {
            const language = languageInput.value.trim() || promptData.languagePlaceholder;
            text = text.replace(/<Language>/g, language);
        }
        promptTextContainer.textContent = text;
    }
    
    function displayPrompt(key) {
        currentPromptKey = key;
        const promptData = prompts[key];
        
        placeholderArea.classList.add('hidden');
        displayArea.classList.remove('hidden');

        // Show the main inputs container if any input is needed
        if (promptData.needsInput || promptData.needsLanguage) {
            inputsContainer.classList.remove('hidden');
        } else {
            inputsContainer.classList.add('hidden');
        }

        // Handle subject/topic input
        if (promptData.needsInput) {
            subjectInputContainer.classList.remove('hidden');
            subjectInput.value = '';
            subjectInput.placeholder = `e.g., ${promptData.placeholder}`;
            subjectInput.focus();
        } else {
            subjectInputContainer.classList.add('hidden');
        }
        
        // Handle language input specifically
        if (promptData.needsLanguage) {
            languageInputContainer.classList.remove('hidden');
            languageInput.value = '';
            languageInput.placeholder = `e.g., ${promptData.languagePlaceholder}`;
        } else {
            languageInputContainer.classList.add('hidden');
        }
        
        updatePromptText();
        displayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function displayCustomPrompt(text) {
        currentPromptKey = null;
        placeholderArea.classList.add('hidden');
        displayArea.classList.remove('hidden');
        inputsContainer.classList.add('hidden'); // Hide all inputs for search

        promptTextContainer.textContent = text;
        displayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateThemeIcons(isDark) {
        themeIconLight.classList.toggle('hidden', isDark);
        themeIconDark.classList.toggle('hidden', !isDark);
    }

    function setInitialTheme() {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        htmlEl.classList.toggle('dark', isDark);
        updateThemeIcons(isDark);
    }

    // --- Event Listeners ---

    themeToggle.addEventListener('click', () => {
        const isDark = htmlEl.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        updateThemeIcons(isDark);
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const promptText = generateSearchPrompt(query);
            displayCustomPrompt(promptText);
            searchInput.value = '';
        }
    });

    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    allPromptCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.id.replace('prompt-card-', '');
            displayPrompt(key);
        });
    });

    // Add event listener for the new language input
    subjectInput.addEventListener('input', updatePromptText);
    languageInput.addEventListener('input', updatePromptText);

    copyButton.addEventListener('click', () => {
        const textToCopy = promptTextContainer.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyFeedback.classList.remove('hidden');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyFeedback.classList.add('hidden');
                copyButton.textContent = 'Copy';
            }, 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    });

    // --- Initial Setup ---
    setInitialTheme();
});

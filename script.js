                    document.addEventListener('DOMContentLoaded', () => {
                    document.getElementById('wordsMode').addEventListener('click', () => setMode('words'));
                    document.getElementById('lettersMode').addEventListener('click', () => setMode('letters'));
                    document.getElementById('numbersMode').addEventListener('click', () => setMode('numbers')); // Numbers mode event listener
                    document.getElementById('colorThemeSelector').addEventListener('change', (event) => {changeTheme(event.target.value);});
                    document.getElementById('textColorSelector').addEventListener('change', (event) => {changeTextColor(event.target.value);});
                    

                    // DOM elements
                    const exerciseTextElement = document.getElementById('exerciseText');
                    const userInput = document.getElementById('userInput');
                    const results = document.getElementById('results');
                    const restartButton = document.getElementById('restartButton');
                    const attemptDetailsElement = document.getElementById('attemptDetails');
                    const colorThemeSelector = document.getElementById('colorThemeSelector'); // Color theme selector

                    let currentMistakeCounter = {}; // Object to track mistakes for the current attempt
                    let mode = 'words'; // Set default mode to 'words'
                    

                    // Variables
                    let startTime, endTime;
                    let originalExerciseText = '';
                    let wordsArray = [
                        "hello", "world", "computer", "programming", "learning", 
                        "typing", "exercise", "challenge", "success", "achievement", "goal", 
                        "education", "knowledge", "understanding", "communication", "efficiency", 
                        "accuracy", "speed", "performance", "skill", "development", "progress", 
                        "focus", "dedication", "motivation", "inspiration", "creativity", "innovation", 
                        "solution", "strategy", "method", "technique", "tool", "resource", "guide", 
                        "tutorial", "lesson", "practice", "experience", "expertise", "proficiency", 
                        "mastery", "competence", "capability", "potential", "opportunity", "challenge", 
                        "adventure", "journey", "discovery", "exploration", "perspective", "insight", 
                        "imagination", "thought", "wisdom", "philosophy", "science", "technology", 
                        "history", "culture", "art", "literature", "poetry", "music", "harmony", 
                        "rhythm", "melody", "symphony", "orchestra", "guitar", "piano", "violin", 
                        "trumpet", "flute", "saxophone", "drum", "dance", "theatre", "cinema", 
                        "photography", "painting", "sculpture", "architecture", "design", "fashion", 
                        "style", "elegance", "beauty", "nature", "environment", "ecology", "sustainability", 
                        "conservation", "biodiversity", "wildlife", "flora", "fauna", "landscape", "phone", "coffee", "master"
                    ];
                    

                    let mistakeCounter = {}; // Object to track mistakes for each letter
                    let attemptCount = 0; // Count the number of attempts
                
                    function setMode(newMode) {
                        mode = newMode;
                        startExercise(); // Restart exercise with new mode
                    }
                    
                    function completeExercise() {
                        endTime = new Date();
                        const deltaTime = (endTime - startTime) / 1000;

                        const charCount = originalExerciseText.length; // Count the number of characters
                        const wpm = calculateWPM(charCount, deltaTime);
                        results.textContent = `Your speed: ${wpm} WPM.`;

                        const letterToPractice = analyzeMistakes();
                        results.innerHTML += `<br><br>Focus on improving: '${letterToPractice}'`;

                        updateAttemptDetails(attemptCount, currentMistakeCounter, mistakeCounter, wpm, deltaTime);
                    };
                         
                    
                    function analyzeMistakes() {
                        let maxMistakes = 0;
                        let letterToPractice = '';
                        for (let letter in mistakeCounter) {
                            if (mistakeCounter[letter] > maxMistakes) {
                                maxMistakes = mistakeCounter[letter];
                                letterToPractice = letter;
                            }
                        }
                        return letterToPractice;
                    }

                    function changeTextColor(colorClassName) {
                        // Remove previous text color classes
                        document.body.classList.remove('twhite', 'tgreen', 'tred', 'tblue', 'tyellow'); // Include all text color classes here
                    
                        // Add the new text color class
                        document.body.classList.add(colorClassName);
                    }

                    function updateProgressBar() {
                        const typedTextLength = userInput.value.length;
                        const totalTextLength = originalExerciseText.length;
                        const progressPercentage = (typedTextLength / totalTextLength) * 100;
                        document.getElementById('progressBar').style.width = progressPercentage + '%';
                    }
                    
                    
                    

                    function getRandomContent(numWords) {
                        switch (mode) {
                            case 'letters':
                                return getRandomLetters(numWords);
                            case 'numbers':
                                return getRandomNumbers(numWords); // Numbers mode function for generating numbers
                            default:
                                return getRandomWords(numWords);
                        }
                    }
                    function getRandomLetters(numWords) {
                        let lettersArray = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Array of all letters
                        let letterCombinations = [];
                    
                        for (let i = 0; i < numWords; i++) {
                            let word = '';
                            for (let j = 0; j < 5; j++) { // Assuming each "word" is 5 letters long
                                word += lettersArray[Math.floor(Math.random() * lettersArray.length)];
                            }
                            letterCombinations.push(word);
                    
                            // Add a space after each word except the last one
                            if (i < numWords - 1) {
                                letterCombinations.push(' ');
                            }
                        }
                    
                        // Ensure the first character is not a space
                        if (letterCombinations.length > 0 && letterCombinations[0] === ' ') {
                            letterCombinations.shift();
                        }
                    
                        return letterCombinations.join('');
                    }
                    
                    function getRandomNumbers(numWords) {
                        let numberString = '';
                        for (let i = 0; i < numWords * 5; i++) { // Assuming each "word" length is 5
                            numberString += Math.floor(Math.random() * 10).toString(); // Random digit from 0 to 9
                            if (i % 5 === 4 && i < numWords * 5 - 1) {
                                numberString += ' '; // Add space every 5 digits, except at the end
                            }
                        }
                        return numberString;
                    }
                    
                
                    function getRandomWords(numWords) {
                        let shuffled = wordsArray.sort(() => 0.5 - Math.random());
                        return shuffled.slice(0, numWords).join(' ');
                    }

                    function updateAttemptDetails(attempt, currentMistakes, cumulativeMistakes, wpm, deltaTime) {
                        let table = document.getElementById('attemptDetailsTable');
                        if (!table) {
                            table = document.createElement('table');
                            table.id = 'attemptDetailsTable';
                            table.innerHTML = `<tr><th>Attempt</th><th>Speed (WPM)</th><th>Time (s)</th><th>Mistakes Attempt</th><th>Summary</th></tr>`;
                            attemptDetailsElement.appendChild(table);
                        }
                        let row = table.insertRow(-1);
                        let currentMistakesDisplay = Object.entries(currentMistakes).map(([letter, count]) => `${letter}(${count})`).join(', ');
                        let cumulativeMistakesDisplay = Object.entries(cumulativeMistakes).map(([letter, count]) => `${letter}(${count})`).join(', ');
                        row.innerHTML = `<td>${attempt}</td><td>${wpm}</td><td>${deltaTime.toFixed(2)}</td><td>${currentMistakesDisplay}</td><td>${cumulativeMistakesDisplay}</td>`;
                    }

                    function provideDetailedFeedback(typedText, correctText) {
                        let feedback = '';
                        for (let i = 0; i < typedText.length; i++) {
                            if (typedText[i] !== correctText[i]) {
                                feedback += `<span class="mistake-highlight">Expected: "${correctText[i]}", Typed: "${typedText[i]}"</span><br/>`;
                            }
                        }
                        document.getElementById('detailedFeedback').innerHTML = feedback;
                    }
                
                    function startExercise() {
                        attemptCount++;
                        startTime = new Date(); // Initialize start time
                        endTime = null;

                        originalExerciseText = getRandomContent(10);

                        exerciseTextElement.textContent = originalExerciseText;
                        userInput.value = '';
                        currentMistakeCounter = {};
                        userInput.disabled = false;
                        userInput.classList.remove('error');
                        userInput.focus();
                    
                        // Clear the previous results and detailed feedback
                        results.textContent = '';
                        document.getElementById('detailedFeedback').innerHTML = '';
                        document.getElementById('progressBar').style.width = '0%'; // Reset progress bar

                    }
                    
                    
                    restartButton.addEventListener('click', startExercise);

                    colorThemeSelector.addEventListener('change', (event) => {
                        changeTheme(event.target.value);
                    });
                    
                    
                    // Event listener for user input
                    userInput.addEventListener('input', () => {
                    const typedText = userInput.value;
                    let remainingText = originalExerciseText.substring(typedText.length);

                    if (originalExerciseText.startsWith(typedText)) {
                        userInput.classList.remove('error-bg'); // Remove error background
                        exerciseTextElement.textContent = remainingText;

                        if (typedText.length === originalExerciseText.length) {
                            completeExercise(); // Call this when the exercise is completed
                            userInput.disabled = true;
                            // Do not show detailed feedback after completion
                        } else {
                            // While typing, show detailed feedback
                            provideDetailedFeedback(typedText, originalExerciseText);
                        }
                    } else {
                        // Mistake made
                        let mistakeLetter = typedText[typedText.length - 1];
                        mistakeCounter[mistakeLetter] = (mistakeCounter[mistakeLetter] || 0) + 1;
                        currentMistakeCounter[mistakeLetter] = (currentMistakeCounter[mistakeLetter] || 0) + 1;
                        userInput.classList.add('error-bg');
                        userInput.value = typedText.slice(0, -1); // Remove the last character
                        setTimeout(() => { userInput.classList.remove('error-bg'); }, 500);
                        // Show detailed feedback for the mistake
                        provideDetailedFeedback(typedText, originalExerciseText);
                    }
                    updateProgressBar(); 
                });

        // Event listener for color theme selector
                    startExercise();
                });

                function changeTheme(themeColor) {
                    // Define a mapping between the value and the corresponding class name
                    const themeClassMap = {
                        'grey': 'grey',
                        'black': 'black',
                        // Add other color mappings here
                    };
                
                    // Remove all theme classes
                    document.body.classList.remove('grey', 'black'); // List all theme classes here
                
                    // Add the selected theme class
                    if (themeClassMap[themeColor]) {
                        document.body.classList.add(themeClassMap[themeColor]);
                    }
                }
                
                
                function calculateWPM(charCount, timeSeconds) {
                    const words = charCount / 5; // A word is typically five characters long
                    return ((words / timeSeconds) * 60).toFixed(2);
                }
                
                
        
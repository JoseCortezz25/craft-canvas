export const mockHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Demo App</title>
    <!-- We will inject CSS via style tag in the preview -->
</head>
<body>
    <div class="container">
        <header>
            <h1>Interactive Demo App</h1>
            <p class="subtitle">Created with Artefacto Canvas</p>
        </header>

        <main>
            <section class="demo-section">
                <h2>Interactive Counter</h2>
                <div class="counter-container">
                    <button id="decrementBtn" class="counter-btn" aria-label="Decrement count">-</button>
                    <span id="counterValue" class="counter-value" aria-live="polite">0</span>
                    <button id="incrementBtn" class="counter-btn" aria-label="Increment count">+</button>
                </div>
            </section>

            <section class="demo-section">
                <h2>Color Changer</h2>
                <div class="color-container">
                    <div id="colorBox" class="color-box" aria-live="polite"></div>
                    <div class="color-buttons">
                        <button id="redBtn" class="color-btn red" aria-label="Change color to red">Red</button>
                        <button id="greenBtn" class="color-btn green" aria-label="Change color to green">Green</button>
                        <button id="blueBtn" class="color-btn blue" aria-label="Change color to blue">Blue</button>
                    </div>
                </div>
            </section>

            <!-- Add Todo List section if needed -->
        </main>
    </div>
    <!-- We will inject JS via script tag in the preview -->
</body>
</html>
`;

export const mockCss = `
body {
    font-family: sans-serif;
    margin: 0;
    background-color: #f4f4f4;
    color: #333;
}

.container {
    max-width: 800px;
    margin: 20px auto;
    background: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

header {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
    color: #333;
}

.subtitle {
    color: #666;
    font-size: 0.9em;
}

.demo-section {
    margin-bottom: 30px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fafafa;
}

.demo-section h2 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 15px;
    color: #555;
}

.counter-container, .color-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.counter-container {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    align-items: center;
}

.counter-value {
    font-size: 1.5em;
    font-weight: bold;
    min-width: 40px;
    text-align: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
}

.counter-btn, .color-btn {
    padding: 8px 15px;
    font-size: 1em;
    cursor: pointer;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.counter-btn:hover, .color-btn:hover {
    background-color: #e0e0e0;
}

.color-box {
    width: 100px;
    height: 100px;
    border: 1px solid #555;
    margin-bottom: 15px;
    background-color: #eee; /* Default color */
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.color-buttons {
    display: flex;
    gap: 10px;
}

.color-btn.red { border-color: #e57373; color: #c62828; }
.color-btn.green { border-color: #81c784; color: #2e7d32; }
.color-btn.blue { border-color: #64b5f6; color: #1565c0; }

.color-btn.red:hover { background-color: #ef9a9a; }
.color-btn.green:hover { background-color: #a5d6a7; }
.color-btn.blue:hover { background-color: #90caf9; }
`;

export const mockJs = `
document.addEventListener('DOMContentLoaded', () => {
    // Counter Logic
    const decrementBtn = document.getElementById('decrementBtn');
    const incrementBtn = document.getElementById('incrementBtn');
    const counterValueSpan = document.getElementById('counterValue');
    let counterValue = 0;

    function updateCounterDisplay() {
        if (counterValueSpan) {
            counterValueSpan.textContent = counterValue.toString();
        }
    }

    if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
            counterValue--;
            updateCounterDisplay();
        });
    }

    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            counterValue++;
            updateCounterDisplay();
        });
    }

    // Color Changer Logic
    const colorBox = document.getElementById('colorBox');
    const redBtn = document.getElementById('redBtn');
    const greenBtn = document.getElementById('greenBtn');
    const blueBtn = document.getElementById('blueBtn');

    if (redBtn && colorBox) {
        redBtn.addEventListener('click', () => {
            colorBox.style.backgroundColor = '#e57373'; // Softer red
        });
    }

    if (greenBtn && colorBox) {
        greenBtn.addEventListener('click', () => {
            colorBox.style.backgroundColor = '#81c784'; // Softer green
        });
    }

    if (blueBtn && colorBox) {
        blueBtn.addEventListener('click', () => {
            colorBox.style.backgroundColor = '#64b5f6'; // Softer blue
        });
    }

    // Initial setup
    updateCounterDisplay();
});
`;

const wpmElement = document.querySelector(".words-per-minute");
const accuracyElement = document.querySelector(".accuracy");
const timeElement = document.querySelector(".time");
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");
const goAgainBtn = document.querySelector(".result-page button");
const resultPage = document.querySelector(".result-page");
const passageContainer = document.querySelector(".passage-container");
const personalBestSpan = document.querySelector(".personal-best");

const easyBtn = document.querySelector(".toggle-easy");
const mediumBtn = document.querySelector(".toggle-medium");
const hardBtn = document.querySelector(".toggle-hard");
const timedBtn = document.querySelector(".toggle-timed");
const passageBtn = document.querySelector(".toggle-passage");

let passageData = null;
let currentDifficulty = "hard";
let currentMode = "timed";
let currentPassage = "";
let currentInput = "";
let testActive = false;
let testCompleted = false;
let timer = null;
let timeLeft = 60;
let startTime = null;
let personalBest = 0;
let currentCharIndex = 0;
let totalCharacters = 0;
let correctCharacters = 0;

const typingArea = document.querySelector(".typing-area");

const referenceTextDiv = document.createElement("div");
referenceTextDiv.className = "reference-text";

const userInput = document.createElement("textarea");
userInput.className = "user-input";
userInput.placeholder = "Start typing here...";
userInput.disabled = true;
userInput.rows = 4;

typingArea.appendChild(referenceTextDiv);
typingArea.appendChild(userInput);

function loadPersonalBest() {
  const saved = localStorage.getItem("typingPersonalBest");
  if (saved && !isNaN(parseInt(saved))) {
    personalBest = parseInt(saved);
    personalBestSpan.textContent = `Personal Best: ${personalBest}`;
  } else {
    personalBestSpan.textContent = "Personal Best: 0";
  }
}

function savePersonalBest(wpm) {
  if (wpm > personalBest) {
    personalBest = wpm;
    localStorage.setItem("typingPersonalBest", personalBest);
    personalBestSpan.textContent = `Personal Best: ${personalBest}`;
  }
}

async function loadPassageData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    passageData = await response.json();
    console.log("Passage data loaded successfully");
    selectRandomPassage();
    return true;
  } catch (error) {
    console.error("Error loading passage data:", error);
    referenceTextDiv.innerHTML =
      '<span style="color: #ef4444;">❌ Failed to load passages. Please refresh the page.</span>';
    return false;
  }
}

// Select random passage based on difficulty
function selectRandomPassage() {
  if (!passageData || !passageData[currentDifficulty]) {
    return;
  }
  const passages = passageData[currentDifficulty];
  const randomIndex = Math.floor(Math.random() * passages.length);
  currentPassage = passages[randomIndex].text;
  renderReferenceText();
}

function renderReferenceText() {
  let html = "";
  for (let i = 0; i < currentPassage.length; i++) {
    let char = currentPassage[i];
    let className = "";

    if (i < currentInput.length) {
      if (currentInput[i] === char) {
        className = "correct";
      } else {
        className = "incorrect";
      }
    }

    if (i === currentInput.length && testActive && !testCompleted) {
      className += " current";
    }

    html += `<span class="${className}">${escapeHtml(char)}</span>`;
  }

  if (currentInput.length > currentPassage.length) {
    for (let i = currentPassage.length; i < currentInput.length; i++) {
      html += `<span class="incorrect">${escapeHtml(currentInput[i])}</span>`;
    }
  }

  referenceTextDiv.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

// Calculate accuracy
function calculateAccuracy() {
  if (currentInput.length === 0) return 100;

  let correct = 0;
  const minLength = Math.min(currentInput.length, currentPassage.length);

  for (let i = 0; i < minLength; i++) {
    if (currentInput[i] === currentPassage[i]) {
      correct++;
    }
  }

  return Math.floor((correct / currentInput.length) * 100);
}

function calculateWPM() {
  if (!startTime) return 0;

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const elapsedMinutes = elapsedSeconds / 60;

  if (elapsedMinutes === 0) return 0;

  let correct = 0;
  const minLength = Math.min(currentInput.length, currentPassage.length);
  for (let i = 0; i < minLength; i++) {
    if (currentInput[i] === currentPassage[i]) {
      correct++;
    }
  }

  const wordsTyped = correct / 5;
  const wpm = Math.floor(wordsTyped / elapsedMinutes);
  return wpm;
}

function updateStats() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  wpmElement.textContent = wpm;
  accuracyElement.textContent = `${accuracy}%`;

  if (currentMode === "timed") {
    timeElement.textContent = timeLeft;
  } else {
    const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    timeElement.textContent = elapsedSeconds.toFixed(1);
  }
}

function finishTest() {
  if (testCompleted) return;

  testActive = false;
  testCompleted = true;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  userInput.disabled = true;

  const finalWPM = calculateWPM();
  const finalAccuracy = calculateAccuracy();
  const charsTyped = currentInput.length;

  savePersonalBest(finalWPM);

  const resultSpans = resultPage.querySelectorAll("span");
  if (resultSpans.length >= 3) {
    resultSpans[0].textContent = `WPM: ${finalWPM}`;
    resultSpans[1].textContent = `Accuracy: ${finalAccuracy}%`;
    resultSpans[2].textContent = `Characters: ${charsTyped}`;
  }

  passageContainer.style.display = "none";
  typingArea.style.display = "none";
  restartBtn.style.display = "none";
  resultPage.style.display = "flex";
}

function startTimedMode() {
  timer = setInterval(() => {
    if (!testActive) return;

    if (timeLeft <= 1) {
      clearInterval(timer);
      timer = null;
      finishTest();
    } else {
      timeLeft--;
      updateStats();
    }
  }, 1000);
}

function handleUserInput(e) {
  if (!testActive || testCompleted) return;

  currentInput = userInput.value;
  renderReferenceText();
  updateStats();

  if (
    currentMode === "passage" &&
    currentInput.length >= currentPassage.length
  ) {
    let isComplete = true;
    for (let i = 0; i < currentPassage.length; i++) {
      if (currentInput[i] !== currentPassage[i]) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      finishTest();
    }
  }
}

function startTest() {
  if (testActive) return;

  // Reset state
  testActive = true;
  testCompleted = false;
  currentInput = "";
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
  startTime = Date.now();

  if (currentMode === "timed") {
    timeLeft = 60;
    startTimedMode();
  } else {
    timeLeft = null;
    timeElement.textContent = "0.0";
  }

  document.querySelector(".start-test").style.display = "none";
  typingArea.style.display = "block";
  resultPage.style.display = "none";
  restartBtn.style.display = "flex";
  typingArea.style.filter = "none";
  userInput.focus();
  renderReferenceText();
  updateStats();
}

function restartTest() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  testActive = false;
  testCompleted = false;
  currentInput = "";
  userInput.value = "";
  userInput.disabled = true;
  startTime = null;

  if (currentMode === "timed") {
    timeLeft = 60;
    timeElement.textContent = "60";
  } else {
    timeElement.textContent = "0.0";
  }

  selectRandomPassage();

  document.querySelector(".start-test").style.display = "flex";
  resultPage.style.display = "none";
  typingArea.style.filter = "blur(4px)";
  wpmElement.textContent = "0";
  accuracyElement.textContent = "100%";
}

function setDifficulty(difficulty) {
  if (testActive) return;
  currentDifficulty = difficulty;
  selectRandomPassage();

  [easyBtn, mediumBtn, hardBtn].forEach((btn) => {
    btn.classList.remove("active");
  });
  if (difficulty === "easy") easyBtn.classList.add("active");
  if (difficulty === "medium") mediumBtn.classList.add("active");
  if (difficulty === "hard") hardBtn.classList.add("active");
}

function setMode(mode) {
  if (testActive) return;
  currentMode = mode;

  [timedBtn, passageBtn].forEach((btn) => {
    btn.classList.remove("active");
  });
  if (mode === "timed") {
    timedBtn.classList.add("active");
    timeElement.textContent = "60";
  } else {
    passageBtn.classList.add("active");
    timeElement.textContent = "0.0";
  }
}

async function init() {
  loadPersonalBest();
  passageContainer.style.display = "flex";
  const loaded = await loadPassageData();
  if (!loaded) return;

  startBtn.addEventListener("click", startTest);
  restartBtn.addEventListener("click", restartTest);
  goAgainBtn.addEventListener("click", () => {
    restartTest();
    startTest();
  });
  userInput.addEventListener("input", handleUserInput);
  referenceTextDiv.addEventListener("click", () => {
    if (testActive && !testCompleted) {
      userInput.focus();
    }
  });
  passageContainer.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" && testActive && !testCompleted) {
      userInput.focus();
    }
  });

  easyBtn.addEventListener("click", () => setDifficulty("easy"));
  mediumBtn.addEventListener("click", () => setDifficulty("medium"));
  hardBtn.addEventListener("click", () => setDifficulty("hard"));
  timedBtn.addEventListener("click", () => setMode("timed"));
  passageBtn.addEventListener("click", () => setMode("passage"));

  hardBtn.classList.add("active");
  timedBtn.classList.add("active");
}
init();

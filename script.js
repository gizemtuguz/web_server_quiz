let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  const res = await fetch("quiz_questions.json");
  questions = await res.json();

  const urlParams = new URLSearchParams(window.location.search);
  const qParam = parseInt(urlParams.get("q"));
  if (!isNaN(qParam) && qParam >= 1 && qParam <= questions.length) {
    currentQuestionIndex = qParam - 1;
  }

  showQuestion();
}

function updateURL() {
  const newUrl = `${window.location.pathname}?q=${currentQuestionIndex + 1}`;
  window.history.pushState({}, "", newUrl);
}

function showQuestion() {
  updateURL();

  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = ` ${question.question}`;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  for (const key in question.options) {
    const btn = document.createElement("button");
    btn.textContent = `${key}) ${question.options[key]}`;
    btn.onclick = () => selectAnswer(btn, key === question.correctAnswer);
    optionsContainer.appendChild(btn);
  }

  document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
  document.getElementById("next-btn").disabled = currentQuestionIndex === questions.length - 1;
}

function selectAnswer(button, isCorrect) {
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    buttons.forEach(btn => {
      if (btn.textContent.startsWith(questions[currentQuestionIndex].correctAnswer)) {
        btn.classList.add("correct");
      }
    });
  }
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

document.getElementById("shuffle-btn").addEventListener("click", () => {
  shuffleArray(questions);
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
});

function showResult() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-text").textContent =
    `You got ${score} out of ${questions.length} questions correct.`;
}

loadQuestions();

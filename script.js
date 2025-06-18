let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startQuiz(filename) {
  document.getElementById("quiz-select-box").classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");

  fetch(filename)
    .then(res => res.json())
    .then(data => {
      questions = data;
      const urlParams = new URLSearchParams(window.location.search);
      const qParam = parseInt(urlParams.get("q"));
      currentQuestionIndex = (!isNaN(qParam) && qParam >= 1 && qParam <= questions.length)
        ? qParam - 1
        : 0;
      score = 0;
      showQuestion();
    });
}

function updateURL() {
  const newUrl = `${window.location.pathname}?q=${currentQuestionIndex + 1}`;
  window.history.pushState({}, "", newUrl);
}

function showQuestion() {
  updateURL();

  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = `${currentQuestionIndex + 1}. ${question.question}`;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  for (const key in question.options) {
    const btn = document.createElement("button");
    btn.textContent = `${key}) ${question.options[key]}`;
    btn.onclick = () => selectAnswer(btn, key);
    optionsContainer.appendChild(btn);
  }

  document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
  document.getElementById("next-btn").disabled = currentQuestionIndex === questions.length - 1;
}

function selectAnswer(button, selectedKey) {
  const question = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => btn.disabled = true);

  if (selectedKey === question.correctAnswer) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    buttons.forEach(btn => {
      if (btn.textContent.startsWith(question.correctAnswer)) {
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

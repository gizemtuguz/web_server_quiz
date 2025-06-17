let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadQuestions() {
  try {
    const res = await fetch("quiz_questions.json");
    questions = await res.json();
    showQuestion();
  } catch (err) {
    console.error("Failed to load questions:", err);
    document.getElementById("quiz-box").innerHTML = "<p>Could not load quiz questions.</p>";
  }
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = `${question.id}. ${question.question}`;
  
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  for (const key in question.options) {
    const btn = document.createElement("button");
    btn.textContent = `${key}) ${question.options[key]}`;
    btn.onclick = () => selectAnswer(btn, key === question.correctAnswer);
    optionsContainer.appendChild(btn);
  }
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

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000); // 1 saniye bekleyip geç
}

function showResult() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score-text").textContent =
    `You got ${score} out of ${questions.length} correct.`;
}

loadQuestions();

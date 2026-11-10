"use strict";

(() => {
  const homeScreen = document.querySelector("#home-screen");
  const quizScreen = document.querySelector("#quiz-screen");
  const resultScreen = document.querySelector("#result-screen");
  const countButtons = [...document.querySelectorAll(".count-option")];
  const answerList = document.querySelector("#answer-list");
  const questionText = document.querySelector("#question-text");
  const questionCategory = document.querySelector("#question-category");
  const questionDots = document.querySelector("#question-dots");
  const progressTrack = document.querySelector(".progress-track");

  let selectedCount = 300;
  let testQuestions = [];
  let answers = [];
  let currentIndex = 0;
  let reviewVisible = false;

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function showScreen(screen) {
    homeScreen.hidden = screen !== homeScreen;
    quizScreen.hidden = screen !== quizScreen;
    resultScreen.hidden = screen !== resultScreen;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTest() {
    if (!Array.isArray(window.questionBank) || window.questionBank.length !== 300) {
      window.alert("Der Fragenkatalog konnte nicht geladen werden. Bitte lade die Seite neu.");
      return;
    }
    testQuestions = shuffle(window.questionBank)
      .slice(0, selectedCount)
      .map((question) => ({ ...question, options: shuffle(question.options) }));
    answers = Array(testQuestions.length).fill(null);
    currentIndex = 0;
    reviewVisible = false;
    renderQuestion();
    showScreen(quizScreen);
    questionText.focus({ preventScroll: true });
  }

  function renderQuestion() {
    const question = testQuestions[currentIndex];
    const selected = answers[currentIndex];
    const letters = ["A", "B", "C", "D"];

    questionCategory.textContent = question.category.toLocaleUpperCase("de");
    questionText.textContent = question.question;
    document.querySelector("#quiz-count").innerHTML =
      `FRAGE <strong>${String(currentIndex + 1).padStart(2, "0")}</strong> / ${testQuestions.length}`;
    document.querySelector("#answered-count").textContent =
      `${answers.filter((answer) => answer !== null).length} beantwortet`;
    document.querySelector("#previous-button").disabled = currentIndex === 0;
    document.querySelector("#previous-button").style.opacity = currentIndex === 0 ? ".45" : "1";
    document.querySelector("#next-button").innerHTML =
      currentIndex === testQuestions.length - 1
        ? "Test auswerten <span aria-hidden=\"true\">✓</span>"
        : "Nächste Frage <span aria-hidden=\"true\">→</span>";
    document.querySelector("#progress-fill").style.width =
      `${((currentIndex + 1) / testQuestions.length) * 100}%`;
    progressTrack.setAttribute(
      "aria-valuenow",
      String(Math.round(((currentIndex + 1) / testQuestions.length) * 100))
    );

    answerList.replaceChildren();
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      const letter = document.createElement("span");
      const label = document.createElement("span");
      button.type = "button";
      button.className = `answer-option${selected === option ? " selected" : ""}`;
      button.setAttribute("aria-pressed", String(selected === option));
      letter.className = "answer-letter";
      letter.textContent = letters[index];
      label.textContent = option;
      button.append(letter, label);
      button.addEventListener("click", () => {
        answers[currentIndex] = option;
        renderQuestion();
      });
      answerList.append(button);
    });

    questionDots.replaceChildren();
    testQuestions.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `question-dot${answers[index] !== null ? " answered" : ""}${index === currentIndex ? " current" : ""}`;
      dot.setAttribute("aria-label", `Zu Frage ${index + 1}${answers[index] !== null ? ", beantwortet" : ""}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        renderQuestion();
        questionText.focus({ preventScroll: true });
      });
      questionDots.append(dot);
    });
  }

  function showResults() {
    const correct = testQuestions.reduce(
      (total, question, index) => total + Number(answers[index] === question.correct),
      0
    );
    const wrong = answers.reduce(
      (total, answer, index) =>
        total + Number(answer !== null && answer !== testQuestions[index].correct),
      0
    );
    const skipped = answers.filter((answer) => answer === null).length;
    const percent = Math.round((correct / testQuestions.length) * 100);

    document.querySelector("#score-percent").textContent = `${percent}%`;
    document.querySelector("#correct-total").textContent = String(correct);
    document.querySelector("#wrong-total").textContent = String(wrong);
    document.querySelector("#skipped-total").textContent = String(skipped);
    document.querySelector("#total-count").textContent = String(testQuestions.length);
    document.querySelector(".score-ring").style.background =
      `conic-gradient(var(--green) ${percent}%, #d8e2d7 ${percent}% 100%)`;
    document.querySelector("#result-title").textContent =
      percent >= 80
        ? "Richtig stark gemacht."
        : percent >= 50
          ? "Du bist auf einem guten Weg."
          : "Du hast den Anfang gemacht.";
    document.querySelector("#result-message").textContent =
      percent >= 80
        ? "Dein Wissen kann sich sehen lassen. Bleib dran!"
        : percent >= 50
          ? "Mit jeder Runde wird dein Wissen sicherer."
          : "Weiter üben lohnt sich — du bist auf dem Weg.";
    document.querySelector("#review-panel").hidden = true;
    document.querySelector("#review-button").textContent = "Antworten ansehen";
    reviewVisible = false;
    showScreen(resultScreen);
  }

  function renderReview() {
    const reviewList = document.querySelector("#review-list");
    reviewList.replaceChildren();
    testQuestions.forEach((question, index) => {
      const item = document.createElement("article");
      const heading = document.createElement("h3");
      const number = document.createElement("span");
      const chosen = document.createElement("p");
      const correct = document.createElement("p");
      const isCorrect = answers[index] === question.correct;

      item.className = "review-item";
      number.className = "review-number";
      number.textContent = String(index + 1).padStart(2, "0");
      heading.append(number, document.createTextNode(question.question));
      chosen.textContent = answers[index] === null ? "Nicht beantwortet" : `Deine Antwort: ${answers[index]}`;
      chosen.className = isCorrect ? "review-correct" : "review-wrong";
      correct.textContent = `Richtige Antwort: ${question.correct}`;
      correct.className = "review-correct";
      item.append(heading, chosen, correct);
      reviewList.append(item);
    });
  }

  countButtons.forEach((button) => {
    const isSelected = Number(button.dataset.count) === selectedCount;
    button.setAttribute("aria-pressed", String(isSelected));
    button.addEventListener("click", () => {
      selectedCount = Number(button.dataset.count);
      countButtons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle("selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  document.querySelector("#start-button").addEventListener("click", startTest);
  document.querySelector("#retry-button").addEventListener("click", () => showScreen(homeScreen));
  document.querySelector("#exit-button").addEventListener("click", () => {
    if (window.confirm("Möchtest du den Test wirklich beenden? Dein aktueller Fortschritt geht verloren.")) {
      showScreen(homeScreen);
    }
  });
  document.querySelector("#previous-button").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
      questionText.focus({ preventScroll: true });
    }
  });
  document.querySelector("#next-button").addEventListener("click", () => {
    if (currentIndex < testQuestions.length - 1) {
      currentIndex += 1;
      renderQuestion();
      questionText.focus({ preventScroll: true });
    } else {
      showResults();
    }
  });
  document.querySelector("#review-button").addEventListener("click", (event) => {
    const panel = document.querySelector("#review-panel");
    reviewVisible = !reviewVisible;
    if (reviewVisible) renderReview();
    panel.hidden = !reviewVisible;
    event.currentTarget.textContent = reviewVisible ? "Antworten ausblenden" : "Antworten ansehen";
    if (reviewVisible) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

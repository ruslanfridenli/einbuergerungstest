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
  const modeButtons = [...document.querySelectorAll(".mode-option")];
  const knowledgeSetup = document.querySelector("#knowledge-setup");

  const reflectionQuestions = [
    {
      category: "CHECK-IN",
      question: "Wie fühlt sich dein Tempo gerade an?",
      options: ["Eher ruhig", "Ziemlich voll", "Wechselnd", "Möchte ich überspringen"]
    },
    {
      category: "CHECK-IN",
      question: "Was würde dir für die nächste Stunde guttun?",
      options: ["Eine kleine Pause", "Ein überschaubarer nächster Schritt", "Kontakt zu jemandem", "Das weiß ich gerade nicht"]
    },
    {
      category: "CHECK-IN",
      question: "Wie leicht fällt es dir heute, deine eigenen Bedürfnisse wahrzunehmen?",
      options: ["Eher leicht", "Mit etwas Ruhe", "Gerade schwierig", "Möchte ich überspringen"]
    },
    {
      category: "CHECK-IN",
      question: "Welche Art von Unterstützung wäre im Moment passend?",
      options: ["Ruhe und Zeit", "Ein Gespräch", "Praktische Hilfe", "Im Moment keine bestimmte"]
    },
    {
      category: "CHECK-IN",
      question: "Was möchtest du aus diesem Moment für dich mitnehmen?",
      options: ["Einen Gedanken", "Einen nächsten kleinen Schritt", "Die Erlaubnis, später weiterzudenken", "Nichts Bestimmtes"]
    }
  ];

  let selectedCount = 30;
  let selectedMode = "all";
  let isReflection = false;
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

  function getModeQuestions(mode) {
    const bank = window.questionBank;
    if (mode === "all") return bank;
    const categories = {
      politics: ["Staat & Demokratie"],
      history: ["Geschichte"],
      community: ["Geografie & Bundesländer", "Gesellschaft & Zusammenleben", "Zusammenleben & Europa"]
    };
    return bank.filter((question) => categories[mode]?.includes(question.category));
  }

  function updateCountOptions() {
    if (selectedMode === "reflection") return;
    const availableCount = getModeQuestions(selectedMode).length;
    countButtons.forEach((button) => {
      const count = Number(button.dataset.count);
      button.disabled = count > availableCount;
      button.classList.toggle("unavailable", button.disabled);
      const selected = count === selectedCount;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (selectedCount > availableCount) {
      const available = countButtons
        .map((button) => Number(button.dataset.count))
        .filter((count) => count <= availableCount);
      selectedCount = Math.max(...available);
      countButtons.forEach((button) => {
        const selected = Number(button.dataset.count) === selectedCount;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }
  }

  function startTest() {
    if (!Array.isArray(window.questionBank) || window.questionBank.length !== 300) {
      window.alert("Der Fragenkatalog konnte nicht geladen werden. Bitte lade die Seite neu.");
      return;
    }
    isReflection = selectedMode === "reflection";
    testQuestions = isReflection
      ? reflectionQuestions.map((question) => ({ ...question }))
      : shuffle(getModeQuestions(selectedMode))
        .slice(0, selectedCount)
        .map((question) => ({ ...question, options: shuffle(question.options) }));
    answers = Array(testQuestions.length).fill(null);
    currentIndex = 0;
    reviewVisible = false;
    document.querySelector("#quiz-mode-label").textContent = isReflection ? "SELBSTREFLEXION" : "WISSENSÜBUNG";
    document.querySelector("#quiz-instructions").textContent = isReflection
      ? "Es gibt keine richtigen Antworten. Du kannst jede Frage überspringen oder deine Auswahl ändern."
      : "Lies die Frage in Ruhe und wähle die Antwort, die du für richtig hältst.";
    document.querySelector(".quiz-aside h2").innerHTML = isReflection
      ? "Kurz innehalten.<br><em>Ohne Bewertung.</em>"
      : "Frage für Frage.<br><em>In deinem Tempo.</em>";
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
    document.querySelector("#quiz-count").setAttribute(
      "aria-label",
      `Frage ${currentIndex + 1} von ${testQuestions.length}`
    );
    document.querySelector("#quiz-count").innerHTML =
      `FRAGE <strong>${String(currentIndex + 1).padStart(2, "0")}</strong> / ${testQuestions.length}`;
    document.querySelector("#answered-count").textContent =
      `${answers.filter((answer) => answer !== null).length} beantwortet`;
    document.querySelector("#previous-button").disabled = currentIndex === 0;
    document.querySelector("#previous-button").style.opacity = currentIndex === 0 ? ".45" : "1";
    document.querySelector("#next-button").innerHTML =
      currentIndex === testQuestions.length - 1
        ? `${isReflection ? "Check-in beenden" : "Test auswerten"} <span aria-hidden="true">✓</span>`
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
    if (isReflection) {
      document.querySelector("#score-panel").hidden = true;
      document.querySelector("#result-stats").hidden = true;
      document.querySelector("#reflection-result").hidden = false;
      document.querySelector("#result-title").textContent = "Danke, dass du innegehalten hast.";
      document.querySelector("#result-heading-copy").textContent =
        "Nimm aus deinen Antworten nur mit, was sich für dich stimmig anfühlt.";
      document.querySelector("#result-step-label").textContent = "DEIN CHECK-IN";
      document.querySelector("#result-note").textContent =
        "Selbstreflexion — keine psychologische Auswertung.";
      document.querySelector("#review-panel").hidden = true;
      reviewVisible = false;
      showScreen(resultScreen);
      return;
    }

    document.querySelector("#score-panel").hidden = false;
    document.querySelector("#result-stats").hidden = false;
    document.querySelector("#reflection-result").hidden = true;
    document.querySelector("#result-title").textContent = "Du hast es geschafft.";
    document.querySelector("#result-heading-copy").textContent =
      "Jede Frage war ein Schritt nach vorn. Schau dir an, wie du abgeschnitten hast.";
    document.querySelector("#result-step-label").textContent = "DEIN ERGEBNIS";
    document.querySelector("#result-note").textContent =
      "Übungsergebnis — kein amtliches Prüfungsergebnis.";
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
      chosen.className = isReflection || isCorrect ? "review-correct" : "review-wrong";
      if (!isReflection) {
        correct.textContent = `Richtige Antwort: ${question.correct}`;
        correct.className = "review-correct";
        item.append(heading, chosen, correct);
      } else {
        item.append(heading, chosen);
      }
      reviewList.append(item);
    });
  }

  countButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      selectedCount = Number(button.dataset.count);
      countButtons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle("selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMode = button.dataset.mode;
      modeButtons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle("selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      knowledgeSetup.hidden = selectedMode === "reflection";
      document.querySelector("#start-button").innerHTML =
        `${selectedMode === "reflection" ? "Check-in starten" : "Übung starten"} <span aria-hidden="true">→</span>`;
      updateCountOptions();
    });
  });

  document.querySelector("#start-button").addEventListener("click", startTest);
  document.querySelector("#retry-button").addEventListener("click", () => showScreen(homeScreen));
  document.querySelector("#retry-button-reflection").addEventListener("click", () => {
    answers = [];
    testQuestions = [];
    showScreen(homeScreen);
  });
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
  document.querySelector("#review-button-reflection").addEventListener("click", (event) => {
    const panel = document.querySelector("#review-panel");
    reviewVisible = !reviewVisible;
    if (reviewVisible) renderReview();
    panel.hidden = !reviewVisible;
    event.currentTarget.textContent = reviewVisible ? "Antworten ausblenden" : "Meine Antworten ansehen";
    if (reviewVisible) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateCountOptions();
})();

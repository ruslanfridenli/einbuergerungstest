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
  const stateSetup = document.querySelector("#state-setup");
  const stateSelect = document.querySelector("#state-select");
  const timerPanel = document.querySelector("#simulation-timer");
  const timerValue = document.querySelector("#timer-value");
  const questionFeedback = document.querySelector("#question-feedback");
  const progressToggle = document.querySelector("#save-progress-toggle");
  const progressStatus = document.querySelector("#progress-status");
  const savedProgress = document.querySelector("#saved-progress");
  const learningModule = document.querySelector("#learning-module");
  const learningLevel = document.querySelector("#learning-level");
  const supportCopyStatus = document.querySelector("#support-copy-status");
  const progressKey = "einbuergerungstest-lernfortschritt-v1";

  document.querySelectorAll(".copy-address").forEach((button) => {
    button.addEventListener("click", async () => {
      const address = document.querySelector(`#${button.dataset.copyTarget}`);
      try {
        await navigator.clipboard.writeText(address.textContent.trim());
        supportCopyStatus.textContent = "Adresse kopiert.";
      } catch {
        supportCopyStatus.textContent = "Kopieren nicht möglich. Bitte markiere die Adresse und kopiere sie manuell.";
      }
    });
  });

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
  let isSimulation = false;
  let remainingSeconds = 0;
  let timerDeadline = 0;
  let timerInterval = null;
  let printErrorsOnly = false;

  const states = {
    "Baden-Württemberg": { capital: "Stuttgart", parliament: "Landtag", place: "in Baden-Württemberg" },
    Bayern: { capital: "München", parliament: "Landtag", place: "in Bayern" },
    Berlin: { capital: "Berlin", parliament: "Abgeordnetenhaus", place: "in Berlin" },
    Brandenburg: { capital: "Potsdam", parliament: "Landtag", place: "in Brandenburg" },
    Bremen: { capital: "Bremen", parliament: "Bürgerschaft", place: "in Bremen" },
    Hamburg: { capital: "Hamburg", parliament: "Bürgerschaft", place: "in Hamburg" },
    Hessen: { capital: "Wiesbaden", parliament: "Landtag", place: "in Hessen" },
    "Mecklenburg-Vorpommern": { capital: "Schwerin", parliament: "Landtag", place: "in Mecklenburg-Vorpommern" },
    Niedersachsen: { capital: "Hannover", parliament: "Landtag", place: "in Niedersachsen" },
    "Nordrhein-Westfalen": { capital: "Düsseldorf", parliament: "Landtag", place: "in Nordrhein-Westfalen" },
    "Rheinland-Pfalz": { capital: "Mainz", parliament: "Landtag", place: "in Rheinland-Pfalz" },
    Saarland: { capital: "Saarbrücken", parliament: "Landtag", place: "im Saarland" },
    Sachsen: { capital: "Dresden", parliament: "Landtag", place: "in Sachsen" },
    "Sachsen-Anhalt": { capital: "Magdeburg", parliament: "Landtag", place: "in Sachsen-Anhalt" },
    "Schleswig-Holstein": { capital: "Kiel", parliament: "Landtag", place: "in Schleswig-Holstein" },
    Thüringen: { capital: "Erfurt", parliament: "Landtag", place: "in Thüringen" }
  };

  const learningModules = {
    A1: {
      title: "Ankommen und vorstellen",
      contextTitle: "Bei einem ersten Termin",
      context: "Guten Tag. Ich heiße Samira. Ich habe einen Termin um zehn Uhr. Können Sie mir bitte helfen?",
      contextNote: "Eine höfliche Begrüßung und eine klare Bitte helfen in vielen Alltagssituationen.",
      vocabulary: [["der Termin", "eine vereinbarte Zeit"], ["die Adresse", "Straße und Wohnort"], ["bitte", "höfliches Wort für eine Bitte"], ["helfen", "jemandem Unterstützung geben"], ["heute", "am aktuellen Tag"]],
      grammar: { prompt: "Welche Form passt? „Ich ___ einen Termin.“", options: ["habe", "hat", "haben"], correct: 0, explanation: "Bei „ich“ heißt es „habe“: ich habe, du hast, er oder sie hat." },
      dictation: "Guten Tag. Ich habe einen Termin."
    },
    A2: {
      title: "Termine und vergangene Erlebnisse",
      contextTitle: "Einen Termin verschieben",
      context: "Guten Tag, ich kann morgen leider nicht kommen. Können wir den Termin auf Freitag verschieben?",
      contextNote: "Ein kurzer Grund und ein konkreter Alternativtermin machen eine Nachricht verständlich.",
      vocabulary: [["verschieben", "einen Termin auf später legen"], ["leider", "höflicher Ausdruck für etwas Bedauerliches"], ["morgen", "am nächsten Tag"], ["die Möglichkeit", "eine Option"], ["vereinbaren", "gemeinsam festlegen"]],
      grammar: { prompt: "Welche Form ist richtig? „Gestern ___ ich einen Brief geschrieben.“", options: ["habe", "bin", "hat"], correct: 0, explanation: "Das Perfekt von „schreiben“ bildet man mit „haben“: ich habe geschrieben." },
      dictation: "Können wir den Termin auf Freitag verschieben?"
    },
    B1: {
      title: "Wohnen und Hilfe finden",
      contextTitle: "Eine Frage an die Hausverwaltung",
      context: "Seit gestern funktioniert die Heizung nicht. Könnten Sie bitte prüfen, wann sie repariert werden kann?",
      contextNote: "Beschreibe das Problem und bitte um einen nächsten Schritt. Bei Mietfragen können Beratungsstellen weiterhelfen.",
      vocabulary: [["die Heizung", "Gerät, das Räume warm macht"], ["die Hausverwaltung", "Stelle, die ein Gebäude betreut"], ["prüfen", "genau ansehen und kontrollieren"], ["die Reparatur", "das Beheben eines Schadens"], ["zuständig", "für eine Aufgabe verantwortlich"]],
      grammar: { prompt: "Wähle die passende Verbindung: „Ich rufe an, ___ die Heizung nicht funktioniert.“", options: ["weil", "obwohl", "damit"], correct: 0, explanation: "Nach „weil“ steht das Verb im Nebensatz am Ende: weil die Heizung nicht funktioniert." },
      dictation: "Seit gestern funktioniert die Heizung nicht."
    },
    B2: {
      title: "Arbeit und klare Kommunikation",
      contextTitle: "Eine Rückfrage im Team",
      context: "Damit ich die Aufgabe rechtzeitig abschließen kann, brauche ich noch die aktuellen Zahlen. Könnten Sie sie mir bis morgen schicken?",
      contextNote: "Eine sachliche Bitte nennt den Grund und macht den gewünschten Zeitpunkt deutlich.",
      vocabulary: [["rechtzeitig", "früh genug, nicht zu spät"], ["abschließen", "eine Aufgabe beenden"], ["die Rückmeldung", "eine Antwort oder Reaktion"], ["die Voraussetzung", "etwas, das vorher nötig ist"], ["berücksichtigen", "bei einer Entscheidung beachten"]],
      grammar: { prompt: "Welcher Satz steht im Konjunktiv II und klingt besonders höflich?", options: ["Könnten Sie mir die Zahlen schicken?", "Sie schicken mir die Zahlen.", "Sie haben die Zahlen geschickt."], correct: 0, explanation: "„Könnten Sie …?“ ist eine höfliche Bitte im Konjunktiv II." },
      dictation: "Damit ich die Aufgabe abschließen kann, brauche ich die aktuellen Zahlen."
    },
    C1: {
      title: "Informationen einordnen und begründen",
      contextTitle: "Eine begründete Stellungnahme",
      context: "Obwohl digitale Angebote vieles erleichtern, sollte der Zugang zu persönlicher Beratung erhalten bleiben. Beide Wege können sich sinnvoll ergänzen.",
      contextNote: "Eine ausgewogene Stellungnahme nennt unterschiedliche Seiten und erklärt, wie sie zusammenpassen.",
      vocabulary: [["die Stellungnahme", "eine begründete eigene Position"], ["obwohl", "leitet einen Gegensatz ein"], ["erhalten bleiben", "weiter bestehen"], ["ergänzen", "zusammen etwas vollständiger machen"], ["abwägen", "Argumente sorgfältig vergleichen"]],
      grammar: { prompt: "Welche Formulierung drückt einen Gegensatz aus?", options: ["Obwohl digitale Angebote helfen, bleibt Beratung wichtig.", "Weil digitale Angebote helfen, bleibt Beratung wichtig.", "Damit digitale Angebote helfen, bleibt Beratung wichtig."], correct: 0, explanation: "„Obwohl“ leitet einen Nebensatz mit einem Gegensatz zur Hauptaussage ein." },
      dictation: "Beide Wege können sich sinnvoll ergänzen."
    }
  };

  const plainTerms = {
    "Grundgesetz": "Das Grundgesetz ist das wichtigste Regelwerk für den Staat. Es schützt Grundrechte und legt politische Regeln fest.",
    "Bundestag": "Der Bundestag ist das vom Volk gewählte Parlament auf Bundesebene. Dort werden Gesetze beraten und beschlossen.",
    "Bundesrat": "Im Bundesrat wirken die Regierungen der Bundesländer an Entscheidungen des Bundes mit.",
    "Bundespräsident": "Der Bundespräsident oder die Bundespräsidentin ist das Staatsoberhaupt Deutschlands und hat vor allem repräsentative Aufgaben.",
    "Gewaltenteilung": "Die Aufgaben des Staates sind auf Parlament, Regierung und Gerichte verteilt. So wird Macht begrenzt und kontrolliert.",
    "Rechtsstaat": "Auch staatliche Stellen müssen sich an Gesetze halten. Unabhängige Gerichte können staatliche Entscheidungen prüfen.",
    "Opposition": "Das sind Parteien im Parlament, die nicht zur Regierung gehören. Sie prüfen die Regierung und schlagen andere Wege vor.",
    "Aufenthaltstitel": "Ein Aufenthaltstitel ist ein amtliches Dokument, das festlegt, ob und unter welchen Bedingungen jemand in Deutschland leben darf.",
    "Bundesstaat": "Deutschland besteht aus 16 Bundesländern. Bund und Länder teilen sich staatliche Aufgaben.",
    Landtag: "Der Landtag ist das Parlament eines Bundeslandes. Er beschließt Landesgesetze und kontrolliert die Landesregierung.",
    Bürgerschaft: "Bürgerschaft heißt das Landesparlament in Bremen und Hamburg.",
    Abgeordnetenhaus: "Das Abgeordnetenhaus ist das Landesparlament von Berlin."
  };

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function getQuestionExplanation(question) {
    if (question.explanation) return question.explanation;
    const term = Object.keys(plainTerms).find((word) =>
      question.question.includes(word) || question.correct.includes(word)
    );
    if (term) return plainTerms[term];
    const explanations = {
      "Staat & Demokratie": "Demokratische Regeln verteilen Verantwortung und schützen die Rechte der Menschen. Die richtige Antwort hilft, die Aufgaben des Staates besser einzuordnen.",
      Geschichte: "Die richtige Antwort ordnet ein wichtiges Ereignis der deutschen Geschichte ein. Jahreszahlen und Ereignisse helfen, die Entwicklung bis heute zu verstehen.",
      "Geografie & Bundesländer": "Deutschland ist ein Bundesstaat mit 16 Ländern. Städte, Länder und ihre Aufgaben gehören zur politischen Orientierung.",
      "Gesellschaft & Zusammenleben": "Die richtige Antwort beschreibt eine wichtige Regel oder Anlaufstelle für ein faires Zusammenleben.",
      "Zusammenleben & Europa": "Die richtige Antwort zeigt, wie Menschen, Behörden oder demokratische Einrichtungen im Alltag zusammenwirken."
    };
    return explanations[question.category] || "Lies die Frage noch einmal und merke dir die richtige Antwort für die nächste Übungsrunde.";
  }

  function createRegionalQuestions(stateName) {
    const state = states[stateName];
    const otherCapitals = [...new Set(Object.values(states).map(({ capital }) => capital))]
      .filter((capital) => capital !== state.capital);
    return [
      {
        id: `state-${stateName}-capital`,
        category: `Dein Bundesland · ${stateName}`,
        question: `Welche Stadt ist die Landeshauptstadt von ${stateName}?`,
        correct: state.capital,
        options: shuffle([state.capital, ...shuffle(otherCapitals).slice(0, 3)]),
        explanation: `${state.capital} ist die Landeshauptstadt von ${stateName}.`
      },
      {
        id: `state-${stateName}-parliament`,
        category: `Dein Bundesland · ${stateName}`,
        question: `Wie heißt das Landesparlament ${state.place}?`,
        correct: state.parliament,
        options: shuffle([state.parliament, "Der Bundesrat", "Der Bundestag", "Das Bundesverfassungsgericht"]),
        explanation: state.parliament === "Landtag"
          ? `Das Landesparlament ${state.place} heißt Landtag.`
          : `Das Landesparlament ${state.place} heißt ${state.parliament}.`
      },
      {
        id: `state-${stateName}-bundesrat`,
        category: `Dein Bundesland · ${stateName}`,
        question: `Über welches Organ wirkt ${stateName} bei Entscheidungen des Bundes mit?`,
        correct: "Über den Bundesrat",
        options: shuffle(["Über den Bundesrat", "Über das Bundesverfassungsgericht", "Über die Bundesversammlung", "Über den Bundestagspräsidenten"]),
        explanation: "Im Bundesrat wirken die Regierungen der Bundesländer an Entscheidungen des Bundes mit."
      }
    ];
  }

  function stopTimer() {
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderTimer() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerPanel.classList.toggle("timer-low", remainingSeconds <= 300);
  }

  function startTimer() {
    stopTimer();
    timerDeadline = Date.now() + 60 * 60 * 1000;
    remainingSeconds = 60 * 60;
    renderTimer();
    timerInterval = window.setInterval(() => {
      remainingSeconds = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
      renderTimer();
      if (remainingSeconds <= 0) {
        stopTimer();
        showResults();
      }
    }, 1000);
  }

  function speakText(text, feedbackTarget = questionFeedback) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      feedbackTarget.hidden = false;
      feedbackTarget.textContent = "Vorlesen wird von diesem Browser leider nicht unterstützt.";
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    window.speechSynthesis.speak(utterance);
  }

  function setProgressStatus(message) {
    progressStatus.textContent = message;
  }

  function readProgress() {
    try {
      const progress = JSON.parse(window.localStorage.getItem(progressKey) || "{}");
      if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
        setProgressStatus("Der gespeicherte Lernstand hat ein ungültiges Format. Lösche ihn und beginne neu.");
        return null;
      }
      const valid = Object.values(progress).every((item) =>
        item && Number.isInteger(item.attempts) && item.attempts >= 0
        && Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= item.attempts
      );
      if (!valid) {
        setProgressStatus("Der gespeicherte Lernstand ist beschädigt. Lösche ihn und beginne neu.");
        return null;
      }
      return progress;
    } catch {
      setProgressStatus("Der gespeicherte Lernstand konnte nicht gelesen werden. Lösche ihn oder prüfe die Browser-Einstellungen.");
      return null;
    }
  }

  function updateProgressDisplay() {
    if (!progressToggle.checked) {
      savedProgress.hidden = true;
      return;
    }
    const progress = readProgress();
    if (!progress) {
      document.querySelector("#saved-progress-total").textContent = "0";
      savedProgress.hidden = false;
      return;
    }
    const total = Object.values(progress).reduce((sum, item) => sum + Number(item.attempts || 0), 0);
    document.querySelector("#saved-progress-total").textContent = String(total);
    savedProgress.hidden = false;
    setProgressStatus("Nur ein Lernzähler wird in diesem Browser gespeichert, keine Antworten.");
  }

  function saveProgress() {
    if (!progressToggle.checked) return;
    const progress = readProgress();
    if (!progress) return;
    testQuestions.forEach((question, index) => {
      if (answers[index] === null) return;
      const record = progress[question.id] || { attempts: 0, correct: 0 };
      record.attempts += 1;
      record.correct += Number(answers[index] === question.correct);
      progress[question.id] = record;
    });
    try {
      window.localStorage.setItem(progressKey, JSON.stringify(progress));
      updateProgressDisplay();
    } catch {
      setProgressStatus("Der Browser konnte den Lernzähler nicht speichern. Prüfe den verfügbaren Speicherplatz.");
    }
  }

  function createLearningCard(title, className = "") {
    const card = document.createElement("article");
    const heading = document.createElement("h3");
    card.className = `learning-card${className ? ` ${className}` : ""}`;
    heading.textContent = title;
    card.append(heading);
    return card;
  }

  function renderLearningModule() {
    const module = learningModules[learningLevel.value];
    learningModule.replaceChildren();

    const vocabularyCard = createLearningCard("Wichtige Wörter");
    const vocabularyList = document.createElement("ul");
    vocabularyList.className = "vocab-list";
    module.vocabulary.forEach(([word, meaning]) => {
      const item = document.createElement("li");
      const term = document.createElement("strong");
      term.textContent = word;
      item.append(term, document.createTextNode(meaning));
      vocabularyList.append(item);
    });
    vocabularyCard.append(vocabularyList);

    const contextCard = createLearningCard(`${learningLevel.value} · ${module.title}`, "context-card");
    const context = document.createElement("p");
    const contextNote = document.createElement("p");
    context.textContent = `„${module.context}“`;
    contextNote.textContent = module.contextNote;
    contextCard.append(context, contextNote);

    const grammarCard = createLearningCard("Grammatik zum Ausprobieren");
    const grammarPrompt = document.createElement("p");
    const grammarOptions = document.createElement("div");
    const grammarFeedback = document.createElement("p");
    grammarPrompt.textContent = module.grammar.prompt;
    grammarOptions.className = "grammar-options";
    grammarFeedback.className = "grammar-feedback";
    grammarFeedback.setAttribute("aria-live", "polite");
    module.grammar.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "grammar-answer";
      button.textContent = option;
      button.addEventListener("click", () => {
        grammarFeedback.textContent = index === module.grammar.correct
          ? `Richtig. ${module.grammar.explanation}`
          : `Noch nicht. ${module.grammar.explanation}`;
      });
      grammarOptions.append(button);
    });
    grammarCard.append(grammarPrompt, grammarOptions, grammarFeedback);

    const listeningCard = createLearningCard("Hören und diktieren");
    const listeningNote = document.createElement("p");
    const dictationInput = document.createElement("textarea");
    const tools = document.createElement("div");
    const listenButton = document.createElement("button");
    const checkButton = document.createElement("button");
    const dictationFeedback = document.createElement("p");
    listeningNote.textContent = "Höre den Satz an und schreibe ihn danach auf. Das Vorlesen nutzt die Sprachfunktion deines Browsers.";
    dictationInput.className = "dictation-input";
    dictationInput.setAttribute("aria-label", "Diktierten Satz aufschreiben");
    dictationInput.placeholder = "Schreibe den gehörten Satz hier auf …";
    tools.className = "dictation-tools";
    listenButton.type = "button";
    listenButton.className = "button button-secondary";
    listenButton.textContent = "Satz vorlesen";
    listenButton.addEventListener("click", () => speakText(module.dictation, dictationFeedback));
    checkButton.type = "button";
    checkButton.className = "button button-primary";
    checkButton.textContent = "Vergleichen";
    checkButton.addEventListener("click", () => {
      const normalize = (value) => value.toLocaleLowerCase("de")
        .replace(/[.,!?;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const matches = normalize(dictationInput.value) === normalize(module.dictation);
      dictationFeedback.textContent = matches
        ? "Sehr gut, dein Satz stimmt."
        : `Vergleiche deine Schreibweise mit dem Satz: „${module.dictation}“`;
    });
    dictationFeedback.className = "grammar-feedback";
    dictationFeedback.setAttribute("aria-live", "polite");
    tools.append(listenButton, checkButton);
    listeningCard.append(listeningNote, dictationInput, tools, dictationFeedback);

    learningModule.append(vocabularyCard, contextCard, grammarCard, listeningCard);
  }

  function getScrollBehavior() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  function showScreen(screen) {
    if (screen !== quizScreen) stopTimer();
    homeScreen.hidden = screen !== homeScreen;
    quizScreen.hidden = screen !== quizScreen;
    resultScreen.hidden = screen !== resultScreen;
    if (screen === homeScreen) document.querySelector("#setup-title").focus({ preventScroll: true });
    if (screen === resultScreen) document.querySelector("#result-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
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
    if (["reflection", "simulation", "learning"].includes(selectedMode)) return;
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
    if (selectedMode === "learning") {
      learningModule.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
      learningLevel.focus({ preventScroll: true });
      return;
    }
    if (!Array.isArray(window.questionBank) || window.questionBank.length < 300) {
      window.alert("Der Fragenkatalog konnte nicht geladen werden. Bitte lade die Seite neu.");
      return;
    }
    isReflection = selectedMode === "reflection";
    isSimulation = selectedMode === "simulation";
    if (isSimulation && !states[stateSelect.value]) {
      setProgressStatus("Bitte wähle zuerst dein Bundesland für die drei passenden Übungsfragen aus.");
      stateSelect.focus();
      return;
    }
    const withShuffledOptions = (question) => ({
      ...question,
      options: shuffle(question.options),
      explanation: getQuestionExplanation(question)
    });
    if (isReflection) {
      testQuestions = reflectionQuestions.map((question) => ({ ...question }));
    } else if (isSimulation) {
      const generalQuestions = window.questionBank.filter((question) =>
        !(question.category === "Geografie & Bundesländer" && /hauptstadt|landeshauptstadt/i.test(question.question))
      );
      testQuestions = shuffle([
        ...shuffle(generalQuestions).slice(0, 30).map(withShuffledOptions),
        ...createRegionalQuestions(stateSelect.value).map(withShuffledOptions)
      ]);
    } else {
      testQuestions = shuffle(getModeQuestions(selectedMode))
        .slice(0, selectedCount)
        .map(withShuffledOptions);
    }
    answers = Array(testQuestions.length).fill(null);
    currentIndex = 0;
    reviewVisible = false;
    timerPanel.hidden = !isSimulation;
    document.querySelector("#quiz-mode-label").textContent = isReflection
      ? "SELBSTREFLEXION"
      : isSimulation
        ? "PRÜFUNGSSIMULATION"
        : "WISSENSÜBUNG";
    document.querySelector("#quiz-instructions").textContent = isReflection
      ? "Es gibt keine richtigen Antworten. Du kannst jede Frage überspringen oder deine Auswahl ändern."
      : isSimulation
        ? "Du hast 60 Minuten für 33 Fragen. Die Auswertung zeigt das Simulationsergebnis erst am Ende."
        : "Lies die Frage in Ruhe und wähle die Antwort, die du für richtig hältst.";
    document.querySelector(".quiz-aside h2").innerHTML = isReflection
      ? "Kurz innehalten.<br><em>Ohne Bewertung.</em>"
      : isSimulation
        ? "Dein Wissen.<br><em>Im Prüfungsformat.</em>"
        : "Frage für Frage.<br><em>In deinem Tempo.</em>";
    renderQuestion();
    showScreen(quizScreen);
    if (isSimulation) startTimer();
    questionText.focus({ preventScroll: true });
  }

  function startWrongReview() {
    const missedQuestions = testQuestions.filter((question, index) =>
      answers[index] === null || answers[index] !== question.correct
    );
    if (!missedQuestions.length) return;
    isSimulation = false;
    isReflection = false;
    testQuestions = missedQuestions.map((question) => ({
      ...question,
      options: shuffle(question.options)
    }));
    answers = Array(testQuestions.length).fill(null);
    currentIndex = 0;
    reviewVisible = false;
    timerPanel.hidden = true;
    document.querySelector("#quiz-mode-label").textContent = "FEHLER WIEDERHOLEN";
    document.querySelector("#quiz-instructions").textContent =
      "Übe die falschen und offenen Fragen noch einmal. Die Erklärungen helfen dir beim Merken.";
    document.querySelector(".quiz-aside h2").innerHTML =
      "Noch einmal üben.<br><em>Schritt für Schritt.</em>";
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
    const tooltipTerm = Object.keys(plainTerms).find((term) => question.question.includes(term));
    questionText.title = tooltipTerm ? `${tooltipTerm}: ${plainTerms[tooltipTerm]}` : "";
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
      const selectedCorrect = selected !== null && selected === question.correct;
      const isFeedbackVisible = !isSimulation && !isReflection && selected !== null;
      button.className = `answer-option${selected === option ? " selected" : ""}${isFeedbackVisible && option === question.correct ? " is-correct" : ""}${isFeedbackVisible && selected === option && !selectedCorrect ? " is-wrong" : ""}`;
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
    questionFeedback.hidden = true;
    questionFeedback.className = "question-feedback";
    if (!isReflection && selected !== null && !isSimulation) {
      const isCorrect = selected === question.correct;
      questionFeedback.hidden = false;
      questionFeedback.classList.add(isCorrect ? "feedback-correct" : "feedback-wrong");
      questionFeedback.textContent = `${isCorrect ? "Richtig." : `Noch nicht. Richtig ist: ${question.correct}.`} ${question.explanation || getQuestionExplanation(question)}`;
    }
    const reportBody = `Ich möchte einen Tippfehler in einer Übungsfrage melden:\n\n${question.question}\n\nBitte prüfe die Formulierung. Es werden keine meiner Antworten mitgeschickt.`;
    document.querySelector("#report-question").href =
      `mailto:ruslanfridenli@proton.me?subject=${encodeURIComponent("Hinweis zu einer Übungsfrage")}&body=${encodeURIComponent(reportBody)}`;
    document.querySelector("#report-question").setAttribute(
      "aria-label",
      `Tippfehler in dieser Frage melden: ${question.question}`
    );

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
    stopTimer();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    timerPanel.hidden = true;
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
    document.querySelector("#result-step-label").textContent = "DEIN ERGEBNIS";
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
      `conic-gradient(var(--green) ${percent}%, var(--score-track) ${percent}% 100%)`;
    document.querySelector("#result-title").textContent = isSimulation
      ? correct >= 17 ? "Simulation bestanden." : "Übung macht sicherer."
      : percent >= 80
        ? "Richtig stark gemacht."
        : percent >= 50
          ? "Du bist auf einem guten Weg."
          : "Du hast den Anfang gemacht.";
    document.querySelector("#result-message").textContent =
      isSimulation
        ? "Die Simulation übt das Prüfungsformat, ist aber keine amtliche Prüfung."
        : percent >= 80
        ? "Dein Wissen kann sich sehen lassen. Bleib dran!"
        : percent >= 50
          ? "Mit jeder Runde wird dein Wissen sicherer."
          : "Weiter üben lohnt sich — du bist auf dem Weg.";
    document.querySelector("#result-heading-copy").textContent = isSimulation
      ? `Deine Simulation mit 33 Fragen im Bundesland ${stateSelect.value} ist ausgewertet.`
      : "Jede Frage war ein Schritt nach vorn. Schau dir an, wie du abgeschnitten hast.";
    const passStatus = document.querySelector("#pass-status");
    passStatus.hidden = !isSimulation;
    passStatus.className = `pass-status ${correct >= 17 ? "pass" : "fail"}`;
    passStatus.textContent = isSimulation
      ? correct >= 17
        ? `${correct} von 33 richtig · In dieser Simulation bestanden (ab 17 richtigen Antworten).`
        : `${correct} von 33 richtig · Noch nicht bestanden (Ziel: mindestens 17).`
      : "";
    document.querySelector("#retry-wrong-button").hidden =
      !testQuestions.some((question, index) => answers[index] === null || answers[index] !== question.correct);
    document.querySelector("#print-errors-button").disabled =
      !testQuestions.some((question, index) => answers[index] === null || answers[index] !== question.correct);
    document.querySelector("#review-panel").hidden = true;
    document.querySelector("#review-button").textContent = "Antworten ansehen";
    document.querySelector("#review-title").textContent = "Das hast du geantwortet";
    document.querySelector("#result-note").textContent = isSimulation
      ? "Unabhängige Übungssimulation — kein amtliches Prüfungsergebnis."
      : "Übungsergebnis — kein amtliches Prüfungsergebnis.";
    reviewVisible = false;
    saveProgress();
    showScreen(resultScreen);
  }

  function renderReview() {
    const reviewList = document.querySelector("#review-list");
    reviewList.replaceChildren();
    testQuestions.forEach((question, index) => {
      if (printErrorsOnly && answers[index] === question.correct) return;
      const item = document.createElement("article");
      const heading = document.createElement("h3");
      const number = document.createElement("span");
      const chosen = document.createElement("p");
      const correct = document.createElement("p");
      const explanation = document.createElement("p");
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
        explanation.textContent = `Einfach erklärt: ${question.explanation || getQuestionExplanation(question)}`;
        explanation.className = "review-explanation";
        item.append(heading, chosen, correct, explanation);
      } else {
        item.append(heading, chosen);
      }
      reviewList.append(item);
    });
    document.querySelector("#review-title").textContent = printErrorsOnly
      ? "Falsche und offene Fragen"
      : "Das hast du geantwortet";
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
      knowledgeSetup.hidden = ["reflection", "simulation", "learning"].includes(selectedMode);
      stateSetup.hidden = selectedMode !== "simulation";
      const startLabel = selectedMode === "reflection"
        ? "Check-in starten"
        : selectedMode === "simulation"
          ? "Simulation starten"
          : selectedMode === "learning"
            ? "Zum Lernbereich"
            : "Übung starten";
      document.querySelector("#start-button").innerHTML =
        `${startLabel} <span aria-hidden="true">→</span>`;
      updateCountOptions();
    });
  });

  document.querySelector("#start-button").addEventListener("click", startTest);
  document.querySelector("#theme-toggle").addEventListener("click", (event) => {
    const dark = document.body.classList.toggle("dark-theme");
    const label = dark ? "Helles Design einschalten" : "Dunkles Design einschalten";
    event.currentTarget.setAttribute("aria-label", label);
    event.currentTarget.title = label;
    document.querySelector('meta[name="theme-color"]').content = dark ? "#120d1f" : "#f7f3fc";
  });
  learningLevel.addEventListener("change", renderLearningModule);
  progressToggle.addEventListener("change", () => {
    if (progressToggle.checked) {
      updateProgressDisplay();
    } else {
      savedProgress.hidden = true;
      setProgressStatus("Das Speichern ist aus. Bereits gespeicherte Zähler bleiben, bis du sie löschst.");
    }
  });
  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (!progressToggle.checked) return;
    try {
      window.localStorage.removeItem(progressKey);
      updateProgressDisplay();
      setProgressStatus("Der gespeicherte Lernzähler wurde gelöscht.");
    } catch {
      setProgressStatus("Der Lernzähler konnte nicht gelöscht werden. Prüfe die Browser-Einstellungen.");
    }
  });
  document.querySelector("#speak-question").addEventListener("click", () => {
    const question = testQuestions[currentIndex];
    speakText(`${question.question}. ${question.options.map((option, index) => `${index + 1}. ${option}`).join(". ")}`);
  });
  document.querySelector("#retry-wrong-button").addEventListener("click", startWrongReview);
  document.querySelector("#print-errors-button").addEventListener("click", () => {
    printErrorsOnly = true;
    renderReview();
    document.querySelector("#review-panel").hidden = false;
    document.body.classList.add("printing-errors");
    window.print();
  });
  window.addEventListener("afterprint", () => {
    printErrorsOnly = false;
    document.body.classList.remove("printing-errors");
    document.querySelector("#review-panel").hidden = !reviewVisible;
  });
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
    printErrorsOnly = false;
    if (reviewVisible) renderReview();
    panel.hidden = !reviewVisible;
    event.currentTarget.textContent = reviewVisible ? "Antworten ausblenden" : "Antworten ansehen";
    if (reviewVisible) panel.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  });
  document.querySelector("#review-button-reflection").addEventListener("click", (event) => {
    const panel = document.querySelector("#review-panel");
    reviewVisible = !reviewVisible;
    if (reviewVisible) renderReview();
    panel.hidden = !reviewVisible;
    event.currentTarget.textContent = reviewVisible ? "Antworten ausblenden" : "Meine Antworten ansehen";
    if (reviewVisible) panel.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  });

  window.addEventListener("keydown", (event) => {
    if (quizScreen.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    const activeElement = document.activeElement;
    if (activeElement.matches("input, textarea, select, [contenteditable=true]")) return;
    if (/^[1-4]$/.test(event.key)) {
      const answerButton = answerList.querySelectorAll(".answer-option")[Number(event.key) - 1];
      if (answerButton) {
        event.preventDefault();
        answerButton.click();
      }
      return;
    }
    if (event.key === "Enter" && !activeElement.closest("button, a")) {
      event.preventDefault();
      document.querySelector("#next-button").click();
    }
  });

  renderLearningModule();
  updateCountOptions();

  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        setProgressStatus("Offline-Nutzung konnte nicht eingerichtet werden. Die Website funktioniert weiterhin online.");
      });
    });
  }
})();

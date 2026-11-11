"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const context = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, "questions.js"), "utf8"), context);
const questions = context.window.questionBank;

test("the bank contains 300 uniquely identified question variants", () => {
  assert.equal(questions.length, 300);
  assert.equal(new Set(questions.map(({ id }) => id)).size, questions.length);
  assert.deepEqual([...questions.map(({ id }) => id)].sort((a, b) => a - b), Array.from({ length: 300 }, (_, i) => i + 1));
});

test("each question has a category, prompt, four unique answers and a correct answer", () => {
  for (const question of questions) {
    assert.ok(question.category.length > 0);
    assert.ok(question.question.length > 0);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.correct));
  }
});

test("the question bank covers all four learning modes", () => {
  const categories = new Set(questions.map(({ category }) => category));
  for (const category of [
    "Staat & Demokratie",
    "Geschichte",
    "Geografie & Bundesländer",
    "Gesellschaft & Zusammenleben",
    "Zusammenleben & Europa"
  ]) {
    assert.ok(categories.has(category), `Missing category: ${category}`);
  }
});

test("the page distinguishes independent practice from official BAMF material", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /keine amtlichen Originalfragen/);
  assert.match(html, /weder vom BAMF erstellt noch bestätigt/);
  assert.match(html, /https:\/\/www\.bamf\.de\/DE\/Themen\/Integration\/ZugewanderteTeilnehmende\/Einbuergerung\/einbuergerung-node\.html/);
});

test("the self-reflection activity is explicitly non-clinical and unscored", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(html, /ohne Punktzahl/);
  assert.match(html, /ohne Punktzahl, Diagnose/);
  assert.match(app, /const reflectionQuestions = \[/);
  assert.match(app, /if \(isReflection\)/);
});

test("email contact is voluntary and never includes quiz answers", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(html, /mailto:ruslanfridenli@proton\.me/);
  assert.match(html, /Antworten aus den Übungen werden weder angehängt noch automatisch verschickt/);
  assert.match(html, /id="report-question"/);
  assert.match(app, /const reportBody = .*question\.question/);
  assert.doesNotMatch(app, /sendBeacon|XMLHttpRequest|fetch\s*\(/);
});

test("the project support section shows the exact donation addresses and GitHub link", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  const readme = readFileSync(path.join(root, "README.md"), "utf8");
  const addresses = [
    "zQpgZ6nGigww7vYpz3Qqxb1BT44kqS567vFaLTeHagS",
    "0x9c4fE1B2e9a1A9c22312c8296BB088Ca0e8F1B4e",
    "bc1p2jltk9ya9kyzv35d8kxn7mmg9jqkx66cqtgzqwe75zlr4v9jk4hsv468q7"
  ];

  assert.match(html, /aria-labelledby="support-title"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /class="copy-address"/);
  assert.match(html, /https:\/\/github\.com\/ruslanfridenli\/einbuergerungstest/);
  assert.match(app, /navigator\.clipboard\.writeText/);
  assert.match(app, /Adresse kopiert/);
  for (const address of addresses) {
    assert.ok(html.includes(address), `Missing website address: ${address}`);
    assert.ok(readme.includes(address), `Missing README address: ${address}`);
  }
});

test("the simulation has 33 practice questions, a 60-minute timer and state-specific questions", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(html, /data-mode="simulation"/);
  assert.match(html, /id="state-select"/);
  assert.match(html, /id="simulation-timer"/);
  assert.match(app, /slice\(0, 30\)/);
  assert.match(app, /createRegionalQuestions\(stateSelect\.value\)/);
  assert.match(app, /remainingSeconds = 60 \* 60/);
  assert.match(app, /correct >= 17/);
});

test("the German learning modules and keyboard controls are available", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  for (const level of ["A1", "A2", "B1", "B2", "C1"]) {
    assert.match(app, new RegExp(`${level}:\\s*\\{`));
  }
  assert.match(html, /id="learning-section"/);
  assert.match(app, /\^\[1-4\]\$/);
  assert.match(app, /event\.key === "Enter"/);
});

test("the page can be installed and its static app shell cached offline", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
  const serviceWorker = readFileSync(path.join(root, "sw.js"), "utf8");
  assert.equal(manifest.lang, "de");
  assert.equal(manifest.display, "standalone");
  for (const file of ["index.html", "styles.css", "app.js", "questions.js"]) {
    assert.ok(serviceWorker.includes(`"./${file}"`), `Missing offline cache entry: ${file}`);
  }
});

test("progress storage is opt-in and only keeps question counters", () => {
  const html = readFileSync(path.join(root, "index.html"), "utf8");
  const app = readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(html, /id="save-progress-toggle" type="checkbox"/);
  assert.match(app, /record\.attempts \+= 1/);
  assert.match(app, /record\.correct \+= Number\(answers\[index\] === question\.correct\)/);
  assert.match(app, /localStorage\.removeItem\(progressKey\)/);
  assert.doesNotMatch(app, /localStorage\.setItem\(progressKey,\s*JSON\.stringify\(answers/);
});

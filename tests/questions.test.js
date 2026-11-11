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
  assert.doesNotMatch(app, /mailto:|sendBeacon|XMLHttpRequest|fetch\s*\(/);
});

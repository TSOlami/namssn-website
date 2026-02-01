/**
 * Heuristic parser: extract multiple-choice questions from raw text
 * (e.g. from PDF). Handles common patterns:
 * - "1. Question text\nA. opt1\nB. opt2\nAnswer: B"
 * - "1) Question\n(a) opt1 (b) opt2\nAnswer: (a)"
 * - "QUESTION 1\n...\nA) opt1\nB) opt2\nCorrect: A"
 */

const QUESTION_START = /^\s*(?:\d+[.)]\s*|QUESTION\s+\d+\s*[:.)]?\s*)/i;
const OPTION_LETTER = /^\s*([A-Fa-f]|[(\[]?[a-fA-F][)\]]?)\s*[.)]\s*(.+)$/;
const OPTION_NUMBER = /^\s*(\d+)\s*[.)]\s*(.+)$/;
const ANSWER_LINE = /^\s*(?:Answer|Correct|Key)\s*[:.]?\s*([A-Da-d0-9]|[(\[]?[a-dA-D][)\]]?)\s*\.?$/i;

function normalizeWhitespace(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function letterToIndex(letter) {
  if (!letter) return 0;
  const c = String(letter).replace(/[(\[\])]/g, '').trim().toUpperCase();
  if (/^[A-F]$/.test(c)) return c.charCodeAt(0) - 65;
  if (/^[1-6]$/.test(c)) return parseInt(c, 10) - 1;
  return 0;
}

/**
 * @param {string} rawText - Full text extracted from PDF
 * @returns {{ questions: Array<{ text: string, options: string[], correctIndex: number, explanation?: string }>, errors: string[] }}
 */
export function extractQuestionsFromText(rawText) {
  const errors = [];
  const questions = [];
  if (!rawText || typeof rawText !== 'string') {
    return { questions: [], errors: ['No text to parse'] };
  }

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!QUESTION_START.test(line)) {
      i++;
      continue;
    }

    const questionTextParts = [line.replace(QUESTION_START, '').trim()];
    i++;
    const options = [];
    let correctIndex = -1;
    let explanation = '';

    while (i < lines.length) {
      const current = lines[i];
      if (QUESTION_START.test(current)) break;

      const answerMatch = current.match(ANSWER_LINE);
      if (answerMatch) {
        correctIndex = letterToIndex(answerMatch[1]);
        i++;
        continue;
      }

      const optLetter = current.match(OPTION_LETTER);
      const optNumber = current.match(OPTION_NUMBER);
      if (optLetter) {
        options.push(normalizeWhitespace(optLetter[2]));
        i++;
        continue;
      }
      if (optNumber && options.length > 0) {
        options.push(normalizeWhitespace(optNumber[2]));
        i++;
        continue;
      }

      if (options.length > 0 && correctIndex >= 0) {
        explanation = current;
        i++;
        break;
      }

      questionTextParts.push(current);
      i++;
    }

    const text = normalizeWhitespace(questionTextParts.join(' '));
    if (!text) {
      i++;
      continue;
    }
    if (options.length < 2) {
      errors.push(`Question "${text.slice(0, 50)}..." has fewer than 2 options; skipping.`);
      continue;
    }
    const safeCorrectIndex = Math.min(Math.max(0, correctIndex), options.length - 1);
    questions.push({
      text,
      options,
      correctIndex: safeCorrectIndex,
      ...(explanation ? { explanation } : {}),
    });
  }

  return { questions, errors };
}

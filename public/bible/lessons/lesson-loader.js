const LESSON_DATA_BASE = "/data/bible_lessons/";

export async function loadLessonIndex() {
  const response = await fetch(`${LESSON_DATA_BASE}index.json`);
  if (!response.ok) {
    throw new Error(`Could not load Bible lesson index: ${response.status}`);
  }

  return response.json();
}

export async function loadLesson(file) {
  const response = await fetch(`${LESSON_DATA_BASE}${file}`);
  if (!response.ok) {
    throw new Error(`Could not load Bible lesson: ${response.status}`);
  }

  return response.json();
}

export { LESSON_DATA_BASE };

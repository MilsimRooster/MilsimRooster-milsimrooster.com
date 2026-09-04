const STUDY_DATA_BASE = "/data/bible_studies/";

async function loadJson(path, label) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${label}: ${response.status}`);
  return response.json();
}

export function loadStudyIndex() {
  return loadJson(`${STUDY_DATA_BASE}index.json`, "the adult study index");
}

export function loadStudy(file) {
  return loadJson(`${STUDY_DATA_BASE}${file}`, "the selected adult study");
}

export { STUDY_DATA_BASE };

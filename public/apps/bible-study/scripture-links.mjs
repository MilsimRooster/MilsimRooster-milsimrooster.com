export const BIBLE_VERSIONS = [
  {
    id: "NIV",
    label: "NIV"
  },
  {
    id: "KJV",
    label: "KJV"
  }
];

export function buildScriptureUrl(reference, versionId) {
  const search = encodeURIComponent(String(reference).trim());
  const version = encodeURIComponent(String(versionId).trim().toUpperCase());
  return `https://www.biblegateway.com/passage/?search=${search}&version=${version}`;
}

export function buildScriptureLinks(reference) {
  return BIBLE_VERSIONS.map((version) => ({
    ...version,
    href: buildScriptureUrl(reference, version.id)
  }));
}

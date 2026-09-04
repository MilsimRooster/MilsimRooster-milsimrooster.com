import assert from "node:assert/strict";
import {
  buildScriptureReaderHref,
  validateScriptureReference,
} from "../scripts/lib/scripture-reference.mjs";

function verses(...numbers) {
  return numbers.map((number) => ({ number, text: `Fixture verse ${number}` }));
}

const fixtureBible = {
  translation: "Scripture Reference Test Bible",
  abbreviation: "KJV",
  books: [
    {
      name: "1 Corinthians",
      slug: "1-corinthians",
      chapters: [
        { number: 13, verses: verses(1, 2, 3, 4) },
      ],
    },
    {
      name: "Song of Solomon",
      slug: "song-of-solomon",
      chapters: [
        { number: 1, verses: verses(1, 2, 3) },
        { number: 2, verses: verses(1, 2, 3) },
      ],
    },
    {
      name: "Numbers",
      slug: "numbers",
      chapters: [
        { number: 1, verses: verses(1, 3) },
      ],
    },
    {
      name: "Genesis",
      slug: "genesis",
      chapters: [
        { number: 1, verses: verses(1, 2) },
        { number: 3, verses: verses(1, 2) },
      ],
    },
  ],
};

const numberedBookSingle = {
  book: "1 Corinthians",
  book_slug: "1-corinthians",
  start: { chapter: 13, verse: 4 },
  label: "Love is patient",
  role: "memory",
};
const normalizedSingle = validateScriptureReference(numberedBookSingle, fixtureBible);
assert.deepEqual(normalizedSingle.start, { chapter: 13, verse: 4 });
assert.deepEqual(normalizedSingle.end, normalizedSingle.start, "a single verse should default end to start");
assert.equal(normalizedSingle.label, numberedBookSingle.label, "validation should preserve optional labels");
assert.equal(normalizedSingle.role, numberedBookSingle.role, "validation should preserve optional roles");
assert.ok(!Object.hasOwn(numberedBookSingle, "end"), "validation should not mutate the source reference");

const sameChapterRange = {
  book: "1 Corinthians",
  book_slug: "1-corinthians",
  start: { chapter: 13, verse: 1 },
  end: { chapter: 13, verse: 4 },
};
assert.deepEqual(
  validateScriptureReference(sameChapterRange, fixtureBible).end,
  { chapter: 13, verse: 4 },
  "a same-chapter range should validate both endpoints and included verses",
);

const multiwordCrossChapterRange = {
  book: "Song of Solomon",
  book_slug: "song-of-solomon",
  start: { chapter: 1, verse: 2 },
  end: { chapter: 2, verse: 2 },
};
assert.equal(
  validateScriptureReference(multiwordCrossChapterRange, fixtureBible).book,
  "Song of Solomon",
  "multiword books and cross-chapter ranges should validate",
);

assert.equal(
  buildScriptureReaderHref(numberedBookSingle, fixtureBible),
  "/bible/#kjv.1-corinthians.13.4",
  "reader links should use the validated start endpoint and translation abbreviation",
);
assert.equal(
  buildScriptureReaderHref(multiwordCrossChapterRange, fixtureBible, {
    translationId: "bsb",
    basePath: "/scripture/",
  }),
  "/scripture/#bsb.song-of-solomon.1.2",
  "reader links should allow explicit translation and base-path options",
);

assert.throws(
  () => validateScriptureReference({
    ...numberedBookSingle,
    book_slug: "song-of-solomon",
  }, fixtureBible),
  /book and book_slug identify different books/,
  "a canonical book name and slug must identify the same book",
);

assert.throws(
  () => validateScriptureReference({
    ...numberedBookSingle,
    book_slug: "first-corinthians",
  }, fixtureBible),
  /book_slug does not exist/,
  "an unknown book slug should fail",
);

assert.throws(
  () => validateScriptureReference({
    ...numberedBookSingle,
    start: { chapter: 13, verse: 5 },
  }, fixtureBible),
  /start endpoint does not exist: 1 Corinthians 13:5/,
  "a missing start endpoint should fail",
);

assert.throws(
  () => validateScriptureReference({
    ...sameChapterRange,
    end: { chapter: 13, verse: 5 },
  }, fixtureBible),
  /end endpoint does not exist: 1 Corinthians 13:5/,
  "a missing end endpoint should fail",
);

assert.throws(
  () => validateScriptureReference({
    book: "Numbers",
    book_slug: "numbers",
    start: { chapter: 1, verse: 1 },
    end: { chapter: 1, verse: 3 },
  }, fixtureBible),
  /range is missing Numbers 1:2/,
  "a missing verse inside an otherwise valid range should fail",
);

assert.throws(
  () => validateScriptureReference({
    book: "Genesis",
    book_slug: "genesis",
    start: { chapter: 1, verse: 2 },
    end: { chapter: 3, verse: 1 },
  }, fixtureBible),
  /range chapter does not exist: Genesis 2/,
  "a missing intermediate chapter should fail",
);

assert.throws(
  () => validateScriptureReference({
    ...sameChapterRange,
    start: { chapter: 13, verse: 4 },
    end: { chapter: 13, verse: 1 },
  }, fixtureBible),
  /range is reversed/,
  "a reversed same-chapter range should fail",
);

assert.throws(
  () => validateScriptureReference({
    ...multiwordCrossChapterRange,
    start: { chapter: 2, verse: 1 },
    end: { chapter: 1, verse: 3 },
  }, fixtureBible),
  /range is reversed/,
  "a reversed cross-chapter range should fail",
);

assert.throws(
  () => validateScriptureReference({
    ...numberedBookSingle,
    start: { chapter: "13", verse: 4 },
  }, fixtureBible),
  /start chapter must be a positive integer/,
  "numeric strings should not silently pass structured-reference validation",
);

assert.throws(
  () => buildScriptureReaderHref(numberedBookSingle, fixtureBible, { basePath: "/bible/#old" }),
  /basePath must not include a URL fragment/,
  "reader link construction should reject an ambiguous base fragment",
);

console.log("Scripture reference validation passed.");

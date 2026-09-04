const DEFAULT_READER_PATH = "/bible/";

/**
 * Validate and normalize one structured Scripture reference against a Bible
 * translation object such as public/bible/kjv.json.
 *
 * Reference shape:
 * {
 *   book: "1 Corinthians",
 *   book_slug: "1-corinthians",
 *   start: { chapter: 13, verse: 4 },
 *   end: { chapter: 13, verse: 7 }, // optional; defaults to start
 *   label?: string,
 *   role?: string,
 * }
 *
 * Validation is intentionally strict. Both the canonical book name and slug
 * must identify the same translation book, and every verse included in the
 * requested range must exist exactly once.
 */
export function validateScriptureReference(reference, translation) {
  assertRecord(reference, "Scripture reference");
  assertTranslation(translation);

  const bookName = requireNonEmptyString(reference.book, "Scripture reference book");
  const bookSlug = requireNonEmptyString(reference.book_slug, "Scripture reference book_slug");
  const book = resolveBook(translation.books, bookName, bookSlug);
  const start = validateEndpoint(reference.start, "start");
  const end = Object.hasOwn(reference, "end")
    ? validateEndpoint(reference.end, "end")
    : { ...start };

  if (compareEndpoints(start, end) > 0) {
    throw new Error(
      `Scripture reference range is reversed: ${formatPoint(book.name, start)} comes after ${formatPoint(book.name, end)}`,
    );
  }

  // Validate the two explicit boundaries before walking the inclusive range so
  // malformed endpoints produce direct, actionable errors.
  requireVerse(book, start, "start endpoint");
  requireVerse(book, end, "end endpoint");
  validateInclusiveRange(book, start, end);

  return {
    ...reference,
    book: book.name,
    book_slug: book.slug,
    start,
    end,
  };
}

/**
 * Build a Digital Bible deep link to the first verse in a structured range.
 * Full reference validation is performed before the URL is returned.
 */
export function buildScriptureReaderHref(reference, translation, options = {}) {
  const normalized = validateScriptureReference(reference, translation);
  const translationId = requireNonEmptyString(
    options.translationId ?? translation.abbreviation?.toLowerCase(),
    "Reader translationId",
  );
  const basePath = requireNonEmptyString(options.basePath ?? DEFAULT_READER_PATH, "Reader basePath");

  if (basePath.includes("#")) {
    throw new Error("Reader basePath must not include a URL fragment");
  }

  const fragment = [
    translationId,
    normalized.book_slug,
    normalized.start.chapter,
    normalized.start.verse,
  ].map((part) => encodeURIComponent(String(part))).join(".");

  return `${basePath}#${fragment}`;
}

function assertTranslation(translation) {
  assertRecord(translation, "Bible translation");
  if (!Array.isArray(translation.books) || translation.books.length === 0) {
    throw new TypeError("Bible translation books must be a non-empty array");
  }
}

function resolveBook(books, bookName, bookSlug) {
  const booksByName = books.filter((book) => book?.name === bookName);
  const booksBySlug = books.filter((book) => book?.slug === bookSlug);

  if (booksByName.length === 0) {
    throw new Error(`Scripture reference book does not exist in the translation: ${bookName}`);
  }
  if (booksByName.length > 1) {
    throw new Error(`Bible translation has duplicate book name: ${bookName}`);
  }
  if (booksBySlug.length === 0) {
    throw new Error(`Scripture reference book_slug does not exist in the translation: ${bookSlug}`);
  }
  if (booksBySlug.length > 1) {
    throw new Error(`Bible translation has duplicate book_slug: ${bookSlug}`);
  }
  if (booksByName[0] !== booksBySlug[0]) {
    throw new Error(
      `Scripture reference book and book_slug identify different books: ${bookName} / ${bookSlug}`,
    );
  }
  if (!Array.isArray(booksByName[0].chapters)) {
    throw new TypeError(`Bible translation book chapters must be an array: ${bookName}`);
  }

  return booksByName[0];
}

function validateEndpoint(endpoint, endpointName) {
  assertRecord(endpoint, `Scripture reference ${endpointName}`);
  const chapter = requirePositiveInteger(endpoint.chapter, `${endpointName} chapter`);
  const verse = requirePositiveInteger(endpoint.verse, `${endpointName} verse`);
  return { chapter, verse };
}

function compareEndpoints(left, right) {
  if (left.chapter !== right.chapter) return left.chapter - right.chapter;
  return left.verse - right.verse;
}

function validateInclusiveRange(book, start, end) {
  for (let chapterNumber = start.chapter; chapterNumber <= end.chapter; chapterNumber += 1) {
    const chapter = requireChapter(book, chapterNumber, "range");
    const verseNumbers = validateChapterVerseNumbers(book, chapter);
    const firstVerse = chapterNumber === start.chapter ? start.verse : 1;
    const lastVerse = chapterNumber === end.chapter
      ? end.verse
      : Math.max(...verseNumbers);

    for (let verseNumber = firstVerse; verseNumber <= lastVerse; verseNumber += 1) {
      const matches = verseNumbers.filter((number) => number === verseNumber).length;
      if (matches === 0) {
        throw new Error(`Scripture reference range is missing ${book.name} ${chapterNumber}:${verseNumber}`);
      }
      if (matches > 1) {
        throw new Error(`Bible translation contains duplicate verse ${book.name} ${chapterNumber}:${verseNumber}`);
      }
    }
  }
}

function requireVerse(book, endpoint, endpointLabel) {
  const chapter = requireChapter(book, endpoint.chapter, endpointLabel);
  const verseNumbers = validateChapterVerseNumbers(book, chapter);
  const matches = verseNumbers.filter((number) => number === endpoint.verse).length;

  if (matches === 0) {
    throw new Error(
      `Scripture reference ${endpointLabel} does not exist: ${formatPoint(book.name, endpoint)}`,
    );
  }
  if (matches > 1) {
    throw new Error(
      `Bible translation contains duplicate ${endpointLabel}: ${formatPoint(book.name, endpoint)}`,
    );
  }
}

function requireChapter(book, chapterNumber, context) {
  const matches = book.chapters.filter((chapter) => chapter?.number === chapterNumber);
  if (matches.length === 0) {
    throw new Error(`Scripture reference ${context} chapter does not exist: ${book.name} ${chapterNumber}`);
  }
  if (matches.length > 1) {
    throw new Error(`Bible translation contains duplicate chapter: ${book.name} ${chapterNumber}`);
  }
  if (!Array.isArray(matches[0].verses) || matches[0].verses.length === 0) {
    throw new Error(`Bible translation chapter has no verses: ${book.name} ${chapterNumber}`);
  }
  return matches[0];
}

function validateChapterVerseNumbers(book, chapter) {
  return chapter.verses.map((verse, index) => requirePositiveInteger(
    verse?.number,
    `${book.name} ${chapter.number} verse number at index ${index}`,
  ));
}

function formatPoint(bookName, endpoint) {
  return `${bookName} ${endpoint.chapter}:${endpoint.verse}`;
}

function requirePositiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${label} must be a positive integer`);
  }
  return value;
}

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value;
}

function assertRecord(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const defaultSourcePath = join(
  "C:",
  "Users",
  "KDLEA",
  "Documents",
  "Codex",
  "2026-06-21",
  "okay",
  "hidden-shelf",
  "source",
  "books",
  "txt",
  "gutenberg-10-the-king-james-version-of-the-bible.txt",
);
const sourcePath = process.env.HIDDEN_SHELF_BIBLE_PATH || defaultSourcePath;
const kjvOutputPath = join(root, "public", "bible", "kjv.json");
const bsbOutputPath = join(root, "public", "bible", "bsb.json");
const bsbSourceUrl = "https://bereanbible.com/bsb.txt";
const bsbSourcePath = process.env.BSB_SOURCE_PATH;

const books = [
  ["Genesis", "genesis", "Old Testament", "The First Book of Moses: Called Genesis"],
  ["Exodus", "exodus", "Old Testament", "The Second Book of Moses: Called Exodus"],
  ["Leviticus", "leviticus", "Old Testament", "The Third Book of Moses: Called Leviticus"],
  ["Numbers", "numbers", "Old Testament", "The Fourth Book of Moses: Called Numbers"],
  ["Deuteronomy", "deuteronomy", "Old Testament", "The Fifth Book of Moses: Called Deuteronomy"],
  ["Joshua", "joshua", "Old Testament", "The Book of Joshua"],
  ["Judges", "judges", "Old Testament", "The Book of Judges"],
  ["Ruth", "ruth", "Old Testament", "The Book of Ruth"],
  ["1 Samuel", "1-samuel", "Old Testament", "The First Book of Samuel"],
  ["2 Samuel", "2-samuel", "Old Testament", "The Second Book of Samuel"],
  ["1 Kings", "1-kings", "Old Testament", "The First Book of the Kings"],
  ["2 Kings", "2-kings", "Old Testament", "The Second Book of the Kings"],
  ["1 Chronicles", "1-chronicles", "Old Testament", "The First Book of the Chronicles"],
  ["2 Chronicles", "2-chronicles", "Old Testament", "The Second Book of the Chronicles"],
  ["Ezra", "ezra", "Old Testament", "Ezra"],
  ["Nehemiah", "nehemiah", "Old Testament", "The Book of Nehemiah"],
  ["Esther", "esther", "Old Testament", "The Book of Esther"],
  ["Job", "job", "Old Testament", "The Book of Job"],
  ["Psalms", "psalms", "Old Testament", "The Book of Psalms"],
  ["Proverbs", "proverbs", "Old Testament", "The Proverbs"],
  ["Ecclesiastes", "ecclesiastes", "Old Testament", "Ecclesiastes"],
  ["Song of Solomon", "song-of-solomon", "Old Testament", "The Song of Solomon"],
  ["Isaiah", "isaiah", "Old Testament", "The Book of the Prophet Isaiah"],
  ["Jeremiah", "jeremiah", "Old Testament", "The Book of the Prophet Jeremiah"],
  ["Lamentations", "lamentations", "Old Testament", "The Lamentations of Jeremiah"],
  ["Ezekiel", "ezekiel", "Old Testament", "The Book of the Prophet Ezekiel"],
  ["Daniel", "daniel", "Old Testament", "The Book of Daniel"],
  ["Hosea", "hosea", "Old Testament", "Hosea"],
  ["Joel", "joel", "Old Testament", "Joel"],
  ["Amos", "amos", "Old Testament", "Amos"],
  ["Obadiah", "obadiah", "Old Testament", "Obadiah"],
  ["Jonah", "jonah", "Old Testament", "Jonah"],
  ["Micah", "micah", "Old Testament", "Micah"],
  ["Nahum", "nahum", "Old Testament", "Nahum"],
  ["Habakkuk", "habakkuk", "Old Testament", "Habakkuk"],
  ["Zephaniah", "zephaniah", "Old Testament", "Zephaniah"],
  ["Haggai", "haggai", "Old Testament", "Haggai"],
  ["Zechariah", "zechariah", "Old Testament", "Zechariah"],
  ["Malachi", "malachi", "Old Testament", "Malachi"],
  ["Matthew", "matthew", "New Testament", "The Gospel According to Saint Matthew"],
  ["Mark", "mark", "New Testament", "The Gospel According to Saint Mark"],
  ["Luke", "luke", "New Testament", "The Gospel According to Saint Luke"],
  ["John", "john", "New Testament", "The Gospel According to Saint John"],
  ["Acts", "acts", "New Testament", "The Acts of the Apostles"],
  ["Romans", "romans", "New Testament", "The Epistle of Paul the Apostle to the Romans"],
  ["1 Corinthians", "1-corinthians", "New Testament", "The First Epistle of Paul the Apostle to the Corinthians"],
  ["2 Corinthians", "2-corinthians", "New Testament", "The Second Epistle of Paul the Apostle to the Corinthians"],
  ["Galatians", "galatians", "New Testament", "The Epistle of Paul the Apostle to the Galatians"],
  ["Ephesians", "ephesians", "New Testament", "The Epistle of Paul the Apostle to the Ephesians"],
  ["Philippians", "philippians", "New Testament", "The Epistle of Paul the Apostle to the Philippians"],
  ["Colossians", "colossians", "New Testament", "The Epistle of Paul the Apostle to the Colossians"],
  ["1 Thessalonians", "1-thessalonians", "New Testament", "The First Epistle of Paul the Apostle to the Thessalonians"],
  ["2 Thessalonians", "2-thessalonians", "New Testament", "The Second Epistle of Paul the Apostle to the Thessalonians"],
  ["1 Timothy", "1-timothy", "New Testament", "The First Epistle of Paul the Apostle to Timothy"],
  ["2 Timothy", "2-timothy", "New Testament", "The Second Epistle of Paul the Apostle to Timothy"],
  ["Titus", "titus", "New Testament", "The Epistle of Paul the Apostle to Titus"],
  ["Philemon", "philemon", "New Testament", "The Epistle of Paul the Apostle to Philemon"],
  ["Hebrews", "hebrews", "New Testament", "The Epistle of Paul the Apostle to the Hebrews"],
  ["James", "james", "New Testament", "The General Epistle of James"],
  ["1 Peter", "1-peter", "New Testament", "The First Epistle General of Peter"],
  ["2 Peter", "2-peter", "New Testament", "The Second General Epistle of Peter"],
  ["1 John", "1-john", "New Testament", "The First Epistle General of John"],
  ["2 John", "2-john", "New Testament", "The Second Epistle General of John"],
  ["3 John", "3-john", "New Testament", "The Third Epistle General of John"],
  ["Jude", "jude", "New Testament", "The General Epistle of Jude"],
  ["Revelation", "revelation", "New Testament", "The Revelation of Saint John the Divine"],
];

const headingToBook = new Map(books.map(([name, slug, testament, heading], index) => [
  heading,
  { index, name, slug, testament },
]));
const bookByName = new Map(books.map(([name, slug, testament], index) => [
  name,
  { index, name, slug, testament },
]));
const bsbBookAliases = new Map([
  ["Psalm", "Psalms"],
]);

function compactText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function emptyParsedBooks() {
  return books.map(([name, slug, testament]) => ({
    name,
    slug,
    testament,
    chapters: [],
  }));
}

function readBibleBody() {
  const raw = readFileSync(sourcePath, "utf8").replace(/\r\n?/g, "\n");
  const startMarker = "*** START OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***";
  const endMarker = "*** END OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***";
  const start = raw.indexOf(startMarker);
  const end = raw.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find Project Gutenberg body markers in ${sourcePath}`);
  }

  return raw.slice(start + startMarker.length, end);
}

function ensureChapter(book, chapterNumber) {
  while (book.chapters.length < chapterNumber) {
    book.chapters.push({
      number: book.chapters.length + 1,
      verses: [],
    });
  }

  return book.chapters[chapterNumber - 1];
}

function appendVerseText(verse, text) {
  const compacted = compactText(text);
  if (!compacted) {
    return;
  }

  verse.text = compactText(`${verse.text} ${compacted}`);
}

function parseBible() {
  const parsedBooks = emptyParsedBooks();
  const body = readBibleBody();
  let currentBook = null;
  let currentVerse = null;
  let skipAliasHeading = false;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line || line === "The Old Testament of the King James Version of the Bible" || line === "The New Testament of the King James Bible") {
      continue;
    }

    if (line === "Otherwise Called:") {
      skipAliasHeading = true;
      continue;
    }

    const bookMatch = headingToBook.get(line);
    if (bookMatch && skipAliasHeading) {
      skipAliasHeading = false;
      continue;
    }

    if (bookMatch) {
      currentBook = parsedBooks[bookMatch.index];
      currentVerse = null;
      continue;
    }

    if (!currentBook) {
      continue;
    }

    const verseMatches = [...line.matchAll(/\b(\d+):(\d+)\s+/g)];
    if (verseMatches.length === 0) {
      if (currentVerse) {
        appendVerseText(currentVerse, line);
      }
      continue;
    }

    if (verseMatches[0].index > 0 && currentVerse) {
      appendVerseText(currentVerse, line.slice(0, verseMatches[0].index));
    }

    for (let index = 0; index < verseMatches.length; index += 1) {
      const match = verseMatches[index];
      const nextMatch = verseMatches[index + 1];
      const chapterNumber = Number(match[1]);
      const verseNumber = Number(match[2]);
      const verseText = line.slice(match.index + match[0].length, nextMatch?.index ?? line.length);
      const chapter = ensureChapter(currentBook, chapterNumber);

      currentVerse = {
        number: verseNumber,
        text: "",
      };
      appendVerseText(currentVerse, verseText);
      chapter.verses.push(currentVerse);
    }
  }

  return parsedBooks;
}

async function readBsbText() {
  if (bsbSourcePath) {
    return readFileSync(bsbSourcePath, "utf8");
  }

  const response = await fetch(bsbSourceUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch BSB source ${bsbSourceUrl}: ${response.status}`);
  }

  return response.text();
}

async function parseBsbBible() {
  const parsedBooks = emptyParsedBooks();
  const raw = (await readBsbText()).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");

  if (!raw.includes("This text of God's Word has been dedicated to the public domain.")) {
    throw new Error("BSB source did not include the expected public-domain notice");
  }

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line || !line.includes("\t")) {
      continue;
    }

    const tabIndex = line.indexOf("\t");
    const reference = line.slice(0, tabIndex);
    const text = line.slice(tabIndex + 1);
    if (reference === "Verse") {
      continue;
    }

    const match = reference.match(/^(.+?) (\d+):(\d+)$/);
    if (!match) {
      throw new Error(`Could not parse BSB reference: ${reference}`);
    }

    const canonicalName = bsbBookAliases.get(match[1]) || match[1];
    const bookMatch = bookByName.get(canonicalName);
    if (!bookMatch) {
      throw new Error(`Unknown BSB book: ${match[1]}`);
    }

    const chapter = ensureChapter(parsedBooks[bookMatch.index], Number(match[2]));
    chapter.verses.push({
      number: Number(match[3]),
      text: compactText(text),
    });
  }

  return parsedBooks;
}

function validateKjvBooks(parsedBooks) {
  const missing = parsedBooks.filter((book) => book.chapters.length === 0).map((book) => book.name);
  if (missing.length > 0) {
    throw new Error(`Parsed books are missing chapters: ${missing.join(", ")}`);
  }

  const genesisOneOne = parsedBooks[0].chapters[0].verses[0]?.text;
  if (genesisOneOne !== "In the beginning God created the heaven and the earth.") {
    throw new Error(`Unexpected Genesis 1:1 parse: ${genesisOneOne}`);
  }

  const john = parsedBooks.find((book) => book.slug === "john");
  const johnThreeSixteen = john?.chapters[2]?.verses.find((verse) => verse.number === 16)?.text;
  if (!johnThreeSixteen?.includes("For God so loved the world")) {
    throw new Error("Could not verify John 3:16 in parsed data");
  }
}

function validateBsbBooks(parsedBooks) {
  const missing = parsedBooks.filter((book) => book.chapters.length === 0).map((book) => book.name);
  if (missing.length > 0) {
    throw new Error(`Parsed BSB books are missing chapters: ${missing.join(", ")}`);
  }

  const genesisOneOne = parsedBooks[0].chapters[0].verses[0]?.text;
  if (genesisOneOne !== "In the beginning God created the heavens and the earth.") {
    throw new Error(`Unexpected BSB Genesis 1:1 parse: ${genesisOneOne}`);
  }

  const john = parsedBooks.find((book) => book.slug === "john");
  const johnThreeSixteen = john?.chapters[2]?.verses.find((verse) => verse.number === 16)?.text;
  if (!johnThreeSixteen?.includes("For God so loved the world")) {
    throw new Error("Could not verify BSB John 3:16 in parsed data");
  }

  const revelation = parsedBooks.find((book) => book.slug === "revelation");
  const revelationLast = revelation?.chapters[21]?.verses.at(-1)?.text;
  if (!revelationLast?.includes("The grace of the Lord Jesus be with all the saints")) {
    throw new Error("Could not verify BSB Revelation 22:21 in parsed data");
  }
}

const parsedBooks = parseBible();
validateKjvBooks(parsedBooks);

const kjvOutput = {
  title: "Digital Bible",
  translation: "King James Version",
  abbreviation: "KJV",
  source: {
    ebook: "Project Gutenberg ebook #10",
    url: "https://www.gutenberg.org/ebooks/10",
    license: "Public domain in the United States via Project Gutenberg",
    sourceFile: "Hidden Shelf source/books/txt/gutenberg-10-the-king-james-version-of-the-bible.txt",
  },
  books: parsedBooks,
};

const bsbBooks = await parseBsbBible();
validateBsbBooks(bsbBooks);

const bsbOutput = {
  title: "Digital Bible",
  translation: "Berean Standard Bible",
  abbreviation: "BSB",
  source: {
    ebook: "Berean Standard Bible Text",
    url: bsbSourceUrl,
    license: "Public domain. All uses are freely permitted.",
    licenseUrl: "https://berean.bible/terms.htm",
    sourceFile: "Official Berean Standard Bible text download",
  },
  books: bsbBooks,
};

mkdirSync(dirname(kjvOutputPath), { recursive: true });
writeFileSync(kjvOutputPath, `${JSON.stringify(kjvOutput)}\n`, "utf8");
writeFileSync(bsbOutputPath, `${JSON.stringify(bsbOutput)}\n`, "utf8");

console.log(`Wrote ${kjvOutput.books.length} KJV books to ${kjvOutputPath}`);
console.log(`Wrote ${bsbOutput.books.length} BSB books to ${bsbOutputPath}`);

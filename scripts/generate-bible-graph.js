const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const lessonsRoot = join(root, "public", "data", "bible_lessons");
const graphRoot = join(root, "public", "data", "bible_graph");

const typeFolders = {
  person: "people",
  place: "places",
  theme: "themes",
  event: "events",
  miracle: "miracles",
  parable: "parables",
  prophecy: "prophecies",
  command: "commands",
  promise: "promises",
  object: "objects",
  memory_verse: "memory_verses",
  quiz_bank: "quiz_banks",
};

const graphTypes = Object.values(typeFolders);

const peopleSeeds = [
  p("adam", "Adam", "Old Testament", ["Genesis"], ["first man"], "Adam was the first man God made.", "Adam was the first man in God's good world."),
  p("eve", "Eve", "Old Testament", ["Genesis"], ["first woman"], "Eve was the first woman and the mother of all living.", "Eve lived with Adam in the garden God made."),
  p("cain", "Cain", "Old Testament", ["Genesis"], ["son of Adam and Eve"], "Cain was Adam and Eve's son who let anger grow into sin.", "Cain reminds us to bring anger to God before it hurts others."),
  p("abel", "Abel", "Old Testament", ["Genesis"], ["son of Adam and Eve"], "Abel was Adam and Eve's son who brought an offering to God.", "Abel was Cain's brother."),
  p("noah", "Noah", "Old Testament", ["Genesis"], ["ark builder"], "Noah obeyed God and built the ark before the flood.", "Noah listened to God and built the big ark."),
  p("abraham", "Abraham", "Old Testament", ["Genesis"], ["patriarch"], "Abraham trusted God's promises and became the father of many nations.", "Abraham followed God even when he did not know every step."),
  p("sarah", "Sarah", "Old Testament", ["Genesis"], ["matriarch"], "Sarah received God's promise and became Isaac's mother.", "Sarah learned that God can keep promises that seem impossible."),
  p("isaac", "Isaac", "Old Testament", ["Genesis"], ["patriarch"], "Isaac was the promised son of Abraham and Sarah.", "Isaac was the son God promised to Abraham and Sarah."),
  p("jacob", "Jacob", "Old Testament", ["Genesis"], ["patriarch"], "Jacob became Israel, and God continued His covenant through his family.", "Jacob learned that blessing comes from God."),
  p("esau", "Esau", "Old Testament", ["Genesis"], ["Jacob's brother"], "Esau was Jacob's brother who traded his birthright for a meal.", "Esau made a quick choice that cost him something important."),
  p("joseph", "Joseph", "Old Testament", ["Genesis"], ["dreamer", "leader"], "Joseph was sold by his brothers, rose in Egypt, and forgave his family.", "Joseph forgave his brothers and saw God at work."),
  p("moses", "Moses", "Old Testament", ["Exodus", "Deuteronomy"], ["prophet", "leader"], "Moses led Israel out of Egypt and received God's law.", "Moses helped God's people leave Egypt."),
  p("aaron", "Aaron", "Old Testament", ["Exodus"], ["priest"], "Aaron was Moses' brother and Israel's first high priest.", "Aaron helped Moses lead God's people."),
  p("joshua", "Joshua", "Old Testament", ["Joshua"], ["leader"], "Joshua led Israel into the promised land after Moses.", "Joshua heard God say, Be strong and courageous."),
  p("rahab", "Rahab", "Old Testament", ["Joshua"], ["rescued helper"], "Rahab helped Israel's spies at Jericho and trusted the God of Israel.", "Rahab showed faith when Jericho was in danger."),
  p("deborah", "Deborah", "Old Testament", ["Judges"], ["judge", "prophetess"], "Deborah led Israel with wisdom and courage.", "Deborah helped God's people obey with courage."),
  p("gideon", "Gideon", "Old Testament", ["Judges"], ["judge"], "Gideon learned to trust God when he felt weak.", "Gideon felt small, but God promised to be with him."),
  p("ruth", "Ruth", "Old Testament", ["Ruth"], ["faithful daughter-in-law"], "Ruth showed loyal love to Naomi and became part of God's bigger story.", "Ruth stayed with Naomi and followed Naomi's God."),
  p("naomi", "Naomi", "Old Testament", ["Ruth"], ["Ruth's mother-in-law"], "Naomi was Ruth's mother-in-law who returned to Bethlehem in sorrow.", "Naomi learned that God could still show kindness."),
  p("samuel", "Samuel", "Old Testament", ["1 Samuel"], ["prophet", "judge"], "Samuel heard God's voice as a child and later served as a prophet.", "Samuel listened when God called his name."),
  p("saul", "Saul", "Old Testament", ["1 Samuel"], ["king"], "Saul was Israel's first king.", "Saul was the first king of Israel."),
  p("david", "David", "Old Testament", ["1 Samuel", "2 Samuel", "Psalms"], ["king", "shepherd"], "David was a shepherd, king, and psalm writer who trusted God.", "David trusted God when he faced Goliath."),
  p("jonathan", "Jonathan", "Old Testament", ["1 Samuel"], ["friend", "prince"], "Jonathan was Saul's son and David's loyal friend.", "Jonathan protected David as a true friend."),
  p("solomon", "Solomon", "Old Testament", ["1 Kings", "Proverbs"], ["king"], "Solomon was David's son who asked God for wisdom.", "Solomon asked God for wisdom."),
  p("elijah", "Elijah", "Old Testament", ["1 Kings", "2 Kings"], ["prophet"], "Elijah was a prophet who called Israel back to worship the Lord.", "Elijah showed that the Lord is God."),
  p("elisha", "Elisha", "Old Testament", ["2 Kings"], ["prophet"], "Elisha was a prophet God used to show mercy and power.", "Elisha told Naaman how to receive God's help."),
  p("naaman", "Naaman", "Old Testament", ["2 Kings"], ["commander"], "Naaman was healed when he humbled himself and obeyed God's word through Elisha.", "Naaman learned to receive God's help God's way."),
  p("josiah", "Josiah", "Old Testament", ["2 Kings"], ["king"], "Josiah was a king who listened when God's Word was found.", "Josiah wanted God's people to listen to God's Word."),
  p("isaiah", "Isaiah", "Old Testament", ["Isaiah"], ["prophet"], "Isaiah was a prophet who spoke God's warnings and promises.", "Isaiah told God's people about God's holiness and hope."),
  p("jeremiah", "Jeremiah", "Old Testament", ["Jeremiah"], ["prophet"], "Jeremiah was a prophet who called God's people back to the Lord.", "Jeremiah told people to listen to God."),
  p("daniel", "Daniel", "Old Testament", ["Daniel"], ["prophet", "exile", "advisor"], "Daniel was a faithful Israelite exile who served foreign kings while remaining loyal to God.", "Daniel loved God and kept praying even when it was dangerous."),
  p("shadrach", "Shadrach", "Old Testament", ["Daniel"], ["exile"], "Shadrach refused to worship the king's statue and trusted God in the fire.", "Shadrach trusted God even in the fiery furnace."),
  p("meshach", "Meshach", "Old Testament", ["Daniel"], ["exile"], "Meshach refused to worship the king's statue and trusted God in the fire.", "Meshach trusted God even in the fiery furnace."),
  p("abednego", "Abednego", "Old Testament", ["Daniel"], ["exile"], "Abednego refused to worship the king's statue and trusted God in the fire.", "Abednego trusted God even in the fiery furnace."),
  p("nebuchadnezzar", "Nebuchadnezzar", "Old Testament", ["Daniel"], ["king"], "Nebuchadnezzar was a Babylonian king who saw God's power through Daniel and his friends.", "Nebuchadnezzar was a powerful king in Babylon."),
  p("darius", "Darius", "Old Testament", ["Daniel"], ["king"], "Darius was the king who saw God protect Daniel in the lions' den.", "Darius saw that God protected Daniel."),
  p("esther", "Esther", "Old Testament", ["Esther"], ["queen"], "Esther used her place as queen to help save her people.", "Esther spoke up bravely to help her people."),
  p("mordecai", "Mordecai", "Old Testament", ["Esther"], ["advisor"], "Mordecai encouraged Esther to act with courage.", "Mordecai helped Esther understand her moment."),
  p("job", "Job", "Old Testament", ["Job"], ["sufferer"], "Job trusted and worshiped God while suffering deeply.", "Job worshiped God even when life hurt."),
  p("jonah", "Jonah", "Old Testament", ["Jonah"], ["prophet"], "Jonah ran from God's command but learned about mercy.", "Jonah learned that he could not run away from God."),
  p("nehemiah", "Nehemiah", "Old Testament", ["Nehemiah"], ["builder", "leader"], "Nehemiah prayed and led the people to rebuild Jerusalem's wall.", "Nehemiah prayed and helped rebuild the wall."),
  p("mary", "Mary", "New Testament", ["Matthew", "Luke", "John"], ["mother of Jesus"], "Mary was chosen by God to be the mother of Jesus.", "Mary heard good news that Jesus would be born."),
  p("joseph-husband-of-mary", "Joseph", "New Testament", ["Matthew", "Luke"], ["earthly father of Jesus"], "Joseph cared for Mary and Jesus with obedience and faith.", "Joseph helped care for young Jesus."),
  p("john-the-baptist", "John the Baptist", "New Testament", ["Matthew", "Mark", "Luke", "John"], ["prophet"], "John the Baptist prepared people for Jesus and baptized Him.", "John pointed people to Jesus."),
  p("jesus", "Jesus", "New Testament", ["Matthew", "Mark", "Luke", "John"], ["Son of God", "Savior"], "Jesus is the Son of God, the promised Savior who died and rose again.", "Jesus saves and teaches us God's way."),
  p("peter", "Peter", "New Testament", ["Matthew", "Acts"], ["apostle"], "Peter was one of Jesus' apostles and a leader in the early church.", "Peter followed Jesus and told people about Him."),
  p("john", "John", "New Testament", ["John", "Acts", "Revelation"], ["apostle"], "John was one of Jesus' apostles and a witness to His life and resurrection.", "John followed Jesus and wrote about Him."),
  p("james", "James", "New Testament", ["Matthew", "Acts"], ["apostle"], "James was one of Jesus' apostles.", "James was one of Jesus' followers."),
  p("paul", "Paul", "New Testament", ["Acts", "Romans"], ["apostle", "missionary"], "Paul met the risen Jesus and became a missionary and teacher.", "Paul changed from hurting Christians to telling people about Jesus."),
  p("stephen", "Stephen", "New Testament", ["Acts"], ["witness"], "Stephen boldly testified about Jesus.", "Stephen spoke bravely about Jesus."),
  p("timothy", "Timothy", "New Testament", ["Acts", "1 Timothy", "2 Timothy"], ["young leader"], "Timothy was a young church leader encouraged by Paul.", "Timothy learned to serve Jesus as a young leader."),
  p("philip", "Philip", "New Testament", ["Acts"], ["evangelist"], "Philip helped an Ethiopian official understand Scripture and Jesus.", "Philip helped someone understand the Bible."),
  p("cornelius", "Cornelius", "New Testament", ["Acts"], ["centurion"], "Cornelius was a Gentile who heard the good news through Peter.", "Cornelius learned that the good news is for every nation."),
  p("silas", "Silas", "New Testament", ["Acts"], ["missionary"], "Silas prayed and sang with Paul in prison.", "Silas worshiped God with Paul in prison."),
  p("lazarus", "Lazarus", "New Testament", ["John"], ["friend of Jesus"], "Lazarus was raised from the dead by Jesus.", "Jesus called Lazarus out of the tomb."),
  p("zacchaeus", "Zacchaeus", "New Testament", ["Luke"], ["tax collector"], "Zacchaeus met Jesus and changed how he treated people.", "Zacchaeus climbed a tree to see Jesus."),
];

const placeSeeds = [
  place("eden", "Eden", "The garden where Adam and Eve first lived with God.", "Eden was the garden home God made for Adam and Eve."),
  place("egypt", "Egypt", "Egypt was the land where Israel was enslaved before God rescued them.", "Egypt was where God's people needed rescue."),
  place("red-sea", "Red Sea", "The sea God opened so Israel could cross on dry ground.", "God made a path through the Red Sea."),
  place("sinai", "Sinai", "Mount Sinai was where God gave Israel His law.", "Sinai was the mountain where God gave the commandments."),
  place("wilderness", "Wilderness", "The wilderness was where Israel learned to depend on God's daily care.", "The wilderness was a hard place where God provided."),
  place("jericho", "Jericho", "Jericho was a fortified city Israel faced when entering the land.", "Jericho's walls fell when God's people obeyed."),
  place("bethlehem", "Bethlehem", "Bethlehem was David's hometown and the place where Jesus was born.", "Jesus was born in Bethlehem."),
  place("jerusalem", "Jerusalem", "Jerusalem was Israel's central city and the place of the temple.", "Jerusalem was an important city for God's people."),
  place("babylon", "Babylon", "Babylon was a powerful empire and city where many Israelites lived in exile.", "Babylon was a faraway place where some of God's people had to live after being taken from home."),
  place("nazareth", "Nazareth", "Nazareth was the town where Jesus grew up.", "Jesus grew up in Nazareth."),
  place("galilee", "Galilee", "Galilee was a region where Jesus taught, called disciples, and did miracles.", "Jesus taught and helped many people in Galilee."),
  place("capernaum", "Capernaum", "Capernaum was a Galilean town connected to Jesus' ministry.", "Capernaum was a town where Jesus helped people."),
  place("samaria", "Samaria", "Samaria was a region Jesus used in teaching about mercy and neighbor love.", "Samaria helps us remember that mercy crosses boundaries."),
  place("judea", "Judea", "Judea was a region that included Jerusalem and many events in Jesus' life.", "Judea was part of the land where Jesus lived and taught."),
  place("rome", "Rome", "Rome was the capital city of the empire during the New Testament.", "Rome was a powerful city in Paul's world."),
  place("nineveh", "Nineveh", "Nineveh was the city God sent Jonah to warn.", "Nineveh was the city Jonah did not want to visit."),
  place("mount-carmel", "Mount Carmel", "Mount Carmel was where Elijah called Israel back to worship the Lord.", "Mount Carmel was where God answered Elijah by fire."),
  place("jordan-river", "Jordan River", "The Jordan River appears in stories of crossing, healing, and baptism.", "The Jordan River is where Jesus was baptized."),
  place("gethsemane", "Gethsemane", "Gethsemane was the garden where Jesus prayed before the cross.", "Gethsemane was where Jesus prayed before He suffered."),
];

const baseThemeSummaries = {
  creation: "Creation teaches that God made the world good and it belongs to Him.",
  sin: "Sin is disobeying God and breaking trust with Him.",
  obedience: "Obedience means listening to God and doing what He says.",
  faith: "Faith is trusting God enough to respond to Him.",
  courage: "Courage is trusting God and doing what is right even when it is scary.",
  prayer: "Prayer is talking to God with trust, honesty, praise, and need.",
  forgiveness: "Forgiveness shows mercy instead of holding on to revenge.",
  wisdom: "Wisdom is learning God's way and choosing what is right.",
  worship: "Worship is giving God the honor, trust, and praise He deserves.",
  sacrifice: "Sacrifice means giving up something costly for God's purpose or another person's good.",
  promise: "Promise points to God's faithful word and His commitment to keep it.",
  covenant: "Covenant is a serious promise relationship God makes with His people.",
  mercy: "Mercy is compassion shown to people in need or guilt.",
  grace: "Grace is God's kindness given to people who do not earn it.",
  judgment: "Judgment means God is holy and deals rightly with evil.",
  salvation: "Salvation means God rescues sinners and brings them to Himself.",
  repentance: "Repentance means turning from sin and turning back to God.",
  resurrection: "Resurrection is Jesus rising from the dead and the hope He gives His people.",
  evangelism: "Evangelism means sharing the good news about Jesus.",
  discipleship: "Discipleship means following Jesus and learning His way.",
  faithfulness: "Faithfulness is steady trust and obedience to God over time.",
  trust: "Trust means depending on God because He is good and faithful.",
  leadership: "Leadership means using responsibility to serve and help others do what is right.",
  love: "Love means patient, faithful care that seeks another person's good.",
  hope: "Hope means confidence in God's promises and future.",
};

const lessonPeople = {
  "creation-good-world": ["adam", "eve"],
  "made-in-gods-image": ["adam", "eve"],
  "garden-first-choice": ["adam", "eve"],
  "cain-and-abel": ["cain", "abel", "adam", "eve"],
  "noahs-ark": ["noah"],
  "god-calls-abram": ["abraham"],
  "abraham-and-lot": ["abraham"],
  "god-promises-abraham": ["abraham", "sarah"],
  "isaac-is-born": ["abraham", "sarah", "isaac"],
  "abraham-and-isaac": ["abraham", "isaac"],
  "jacob-and-esau": ["jacob", "esau", "isaac"],
  "jacob-wrestles": ["jacob"],
  "josephs-dreams": ["joseph", "jacob"],
  "joseph-forgives": ["joseph", "jacob"],
  "baby-moses": ["moses"],
  "burning-bush": ["moses"],
  passover: ["moses", "aaron"],
  "red-sea-crossing": ["moses"],
  "manna-in-wilderness": ["moses", "aaron"],
  "ten-commandments": ["moses"],
  "golden-calf": ["moses", "aaron"],
  "joshua-be-strong": ["joshua", "moses"],
  jericho: ["joshua", "rahab"],
  deborah: ["deborah"],
  gideon: ["gideon"],
  "ruth-stays": ["ruth", "naomi"],
  "hannah-prays": ["samuel"],
  "samuel-hears-god": ["samuel"],
  "david-anointed": ["david", "samuel"],
  "david-and-goliath": ["david", "saul"],
  "david-and-jonathan": ["david", "jonathan", "saul"],
  "solomon-wisdom": ["solomon"],
  "elijah-ravens": ["elijah"],
  "mount-carmel": ["elijah"],
  naaman: ["naaman", "elisha"],
  "josiah-finds-book": ["josiah"],
  "esther-speaks": ["esther", "mordecai"],
  "job-trusts": ["job"],
  "psalm-23": ["david"],
  "jonah-runs": ["jonah"],
  "jonah-prays": ["jonah"],
  "daniel-chooses-faithfulness": ["daniel", "shadrach", "meshach", "abednego", "nebuchadnezzar"],
  "fiery-furnace": ["shadrach", "meshach", "abednego", "nebuchadnezzar", "daniel"],
  "daniel-in-the-lions-den": ["daniel", "darius"],
  "nehemiah-rebuilds": ["nehemiah"],
  "birth-of-jesus": ["jesus", "mary", "joseph-husband-of-mary"],
  "jesus-at-temple": ["jesus", "mary", "joseph-husband-of-mary"],
  "jesus-baptized": ["jesus", "john-the-baptist"],
  "jesus-tempted": ["jesus"],
  "jesus-calls-disciples": ["jesus", "peter", "john", "james"],
  beatitudes: ["jesus"],
  "lords-prayer": ["jesus"],
  "wise-foolish-builders": ["jesus"],
  "jesus-calms-storm": ["jesus", "peter", "john", "james"],
  "good-samaritan": ["jesus"],
  "prodigal-son": ["jesus"],
  "parable-of-sower": ["jesus"],
  "feeding-five-thousand": ["jesus", "peter", "john"],
  "walking-on-water": ["jesus", "peter"],
  lazarus: ["jesus", "lazarus"],
  zacchaeus: ["jesus", "zacchaeus"],
  "last-supper": ["jesus", "peter", "john", "james"],
  gethsemane: ["jesus", "peter", "john", "james"],
  crucifixion: ["jesus", "mary", "john"],
  resurrection: ["jesus", "mary", "john", "peter"],
  "great-commission": ["jesus", "peter", "john", "james"],
  pentecost: ["peter", "john", "james"],
  "peter-and-john-heal": ["peter", "john"],
  "philip-and-ethiopian": ["philip"],
  "saul-converted": ["paul", "jesus"],
  "peter-and-cornelius": ["peter", "cornelius"],
  "paul-and-silas": ["paul", "silas"],
  "fruit-of-spirit": ["paul"],
  "armor-of-god": ["paul"],
  "love-is-patient": ["paul"],
  "new-creation-hope": ["john", "jesus"],
};

const lessonPlaces = {
  "creation-good-world": ["eden"],
  "made-in-gods-image": ["eden"],
  "garden-first-choice": ["eden"],
  "noahs-ark": ["wilderness"],
  "tower-of-babel": ["babylon"],
  "baby-moses": ["egypt"],
  "burning-bush": ["sinai", "wilderness"],
  passover: ["egypt"],
  "red-sea-crossing": ["egypt", "red-sea"],
  "manna-in-wilderness": ["wilderness"],
  "ten-commandments": ["sinai"],
  "golden-calf": ["sinai", "wilderness"],
  jericho: ["jericho"],
  "elijah-ravens": ["wilderness"],
  "mount-carmel": ["mount-carmel"],
  naaman: ["jordan-river"],
  "esther-speaks": ["babylon"],
  "jonah-runs": ["nineveh"],
  "daniel-chooses-faithfulness": ["babylon"],
  "fiery-furnace": ["babylon"],
  "daniel-in-the-lions-den": ["babylon"],
  "nehemiah-rebuilds": ["jerusalem"],
  "birth-of-jesus": ["bethlehem"],
  "jesus-at-temple": ["jerusalem"],
  "jesus-baptized": ["jordan-river", "judea"],
  "jesus-tempted": ["wilderness", "judea"],
  "jesus-calls-disciples": ["galilee"],
  beatitudes: ["galilee"],
  "lords-prayer": ["galilee"],
  "wise-foolish-builders": ["galilee"],
  "jesus-calms-storm": ["galilee"],
  "good-samaritan": ["samaria", "judea"],
  "feeding-five-thousand": ["galilee"],
  "walking-on-water": ["galilee"],
  zacchaeus: ["jericho"],
  "last-supper": ["jerusalem"],
  gethsemane: ["gethsemane", "jerusalem"],
  crucifixion: ["jerusalem"],
  resurrection: ["jerusalem"],
  "great-commission": ["galilee"],
  pentecost: ["jerusalem"],
  "peter-and-john-heal": ["jerusalem"],
  "philip-and-ethiopian": ["judea"],
  "saul-converted": ["judea"],
  "peter-and-cornelius": ["capernaum", "judea"],
  "paul-and-silas": ["rome"],
  "new-creation-hope": ["jerusalem"],
};

const eventIdOverrides = {
  "creation-good-world": "creation",
  "garden-first-choice": "fall",
  "noahs-ark": "flood",
  "god-calls-abram": "call-of-abraham",
  "red-sea-crossing": "exodus",
  jericho: "battle-of-jericho",
  "mount-carmel": "elijah-on-mount-carmel",
  "esther-speaks": "esther-saves-her-people",
  "jesus-baptized": "baptism-of-jesus",
  "jesus-tempted": "temptation-of-jesus",
  beatitudes: "sermon-on-the-mount",
  "saul-converted": "conversion-of-paul",
};

const extraEvents = [
  {
    id: "solomon-builds-the-temple",
    name: "Solomon Builds the Temple",
    passage: "1 Kings 6",
    summary: "Solomon built the temple in Jerusalem as a place for Israel to worship the Lord.",
    people: ["solomon"],
    places: ["jerusalem"],
    themes: ["worship", "promise"],
    related_lessons: ["solomon-wisdom"],
    timeline_order: 34,
  },
];

function p(id, name, testament, books, roles, summary, kid_summary) {
  return { id, name, type: "person", testament, books, roles, summary, kid_summary };
}

function place(id, name, summary, kid_summary) {
  return { id, name, type: "place", summary, kid_summary };
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromSlug(value) {
  return String(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sorted(values) {
  return unique(values).sort((a, b) => a.localeCompare(b));
}

function loadLessons() {
  const index = readJson(join(lessonsRoot, "index.json"));
  return {
    index,
    lessons: index.lessons.map((entry) => ({
      entry,
      path: join(lessonsRoot, entry.file),
      lesson: readJson(join(lessonsRoot, entry.file)),
    })),
  };
}

function main() {
  const { index, lessons } = loadLessons();
  mkdirSync(graphRoot, { recursive: true });
  for (const folder of graphTypes) {
    mkdirSync(join(graphRoot, folder), { recursive: true });
  }

  const peopleById = new Map(peopleSeeds.map((node) => [node.id, { ...node }]));
  const placesById = new Map(placeSeeds.map((node) => [node.id, { ...node }]));
  const themesById = new Map();
  const eventsById = new Map();
  const memoryVersesById = new Map();

  for (const lessonEntry of lessons) {
    const { lesson } = lessonEntry;
    const themes = sorted((lesson.tags || []).map(slug));
    for (const themeId of themes) {
      if (!themesById.has(themeId)) {
        themesById.set(themeId, {
          id: themeId,
          name: titleFromSlug(themeId),
          type: "theme",
          summary: baseThemeSummaries[themeId] || `${titleFromSlug(themeId)} is a Bible lesson theme that helps kids connect stories to everyday faith.`,
          kid_summary: baseThemeSummaries[themeId] || `${titleFromSlug(themeId)} helps us see what this story teaches.`,
          related_lessons: [],
          related_people: [],
          related_verses: [],
          questions: [],
        });
      }
    }
  }

  for (const [themeId, summary] of Object.entries(baseThemeSummaries)) {
    if (!themesById.has(themeId)) {
      themesById.set(themeId, {
        id: themeId,
        name: titleFromSlug(themeId),
        type: "theme",
        summary,
        kid_summary: summary,
        related_lessons: [],
        related_people: [],
        related_verses: [],
        questions: [],
      });
    }
  }

  for (const [timelineIndex, lessonEntry] of lessons.entries()) {
    const { lesson, path } = lessonEntry;
    const lessonId = lesson.lesson_id;
    const people = sorted(lessonPeople[lessonId] || []);
    const places = sorted(lessonPlaces[lessonId] || []);
    const themes = sorted((lesson.tags || []).map(slug));
    const eventId = eventIdOverrides[lessonId] || lessonId;
    const relatedLessons = buildRelatedLessons(lessonId, lesson.related_lessons || [], index.lessons, people, themes);

    const updatedLesson = {
      ...lesson,
      people,
      places,
      themes,
      events: [eventId],
      related_graph_nodes: [
        ...people.map((id) => `person:${id}`),
        ...places.map((id) => `place:${id}`),
        ...themes.map((id) => `theme:${id}`),
        `event:${eventId}`,
      ],
      related_lessons: relatedLessons,
    };
    writeJson(path, updatedLesson);

    eventsById.set(eventId, {
      id: eventId,
      name: eventName(lessonId, lesson.title),
      type: "event",
      passage: lesson.passage,
      summary: lesson.summary,
      kid_summary: lesson.tell_it || lesson.summary,
      people,
      places,
      themes,
      related_lessons: [lessonId],
      timeline_order: lesson.sort_order || timelineIndex + 1,
    });

    const memoryId = slug(lesson.memory_verse?.reference || `${lessonId}-memory`);
    memoryVersesById.set(memoryId, {
      id: memoryId,
      name: lesson.memory_verse?.reference || `${lesson.title} memory verse`,
      type: "memory_verse",
      summary: `Memory verse connected to ${lesson.title}.`,
      kid_summary: lesson.memory_verse?.prompt || `Remember ${lesson.passage}.`,
      reference: lesson.memory_verse?.reference || lesson.passage,
      prompt: lesson.memory_verse?.prompt || `Remember ${lesson.passage}.`,
      themes,
      related_lessons: [lessonId],
    });

    connectLessonToNodes(peopleById, people, "lessons", lessonId);
    connectLessonToNodes(peopleById, people, "major_events", eventId);
    connectLessonToNodes(peopleById, people, "related_places", places);
    connectLessonToNodes(peopleById, people, "themes", themes);
    connectLessonToNodes(peopleById, people, "memory_verses", memoryId);

    connectLessonToNodes(placesById, places, "lessons", lessonId);
    connectLessonToNodes(placesById, places, "related_people", people);
    connectLessonToNodes(placesById, places, "related_events", eventId);
    connectLessonToNodes(placesById, places, "themes", themes);

    connectLessonToNodes(themesById, themes, "related_lessons", lessonId);
    connectLessonToNodes(themesById, themes, "related_people", people);
    connectLessonToNodes(themesById, themes, "related_verses", memoryId);
  }

  for (const node of extraEvents) {
    eventsById.set(node.id, { type: "event", kid_summary: node.summary, ...node });
  }

  for (const node of peopleById.values()) {
    node.major_events = sorted(asArray(node.major_events));
    node.related_people = relatedPeopleFor(node.id, lessons, peopleById);
    node.related_places = sorted(asArray(node.related_places));
    node.themes = sorted(asArray(node.themes));
    node.lessons = sorted(asArray(node.lessons));
    node.memory_verses = sorted(asArray(node.memory_verses));
    node.questions = [];
    node.notes = [];
  }

  for (const node of placesById.values()) {
    node.related_people = sorted(asArray(node.related_people));
    node.related_events = sorted(asArray(node.related_events));
    node.themes = sorted(asArray(node.themes));
    node.lessons = sorted(asArray(node.lessons));
  }

  for (const node of themesById.values()) {
    node.related_lessons = sorted(asArray(node.related_lessons));
    node.related_people = sorted(asArray(node.related_people));
    node.related_verses = sorted(asArray(node.related_verses));
    node.questions = [];
  }

  const miracles = makeTopicalNodes("miracle", [
    topical("jesus-calms-storm", "Jesus Calms the Storm", "Mark 4:35-41", "Jesus has authority over wind and waves.", ["jesus"], ["galilee"], ["faith", "fear"], ["jesus-calms-storm"]),
    topical("feeding-five-thousand", "Feeding of the 5,000", "John 6:1-14", "Jesus provided food for a huge crowd from a small lunch.", ["jesus"], ["galilee"], ["provision", "generosity"], ["feeding-five-thousand"]),
    topical("walking-on-water", "Jesus Walks on Water", "Matthew 14:22-33", "Jesus came to His disciples on the water and rescued Peter.", ["jesus", "peter"], ["galilee"], ["faith", "fear"], ["walking-on-water"]),
    topical("lazarus-raised", "Jesus Raises Lazarus", "John 11:1-44", "Jesus raised Lazarus and showed His power over death.", ["jesus", "lazarus"], ["judea"], ["hope", "resurrection"], ["lazarus"]),
    topical("peter-and-john-heal", "Peter and John Heal a Man", "Acts 3:1-10", "A man was healed in Jesus' name and praised God.", ["peter", "john"], ["jerusalem"], ["healing", "compassion"], ["peter-and-john-heal"]),
  ]);

  const parables = makeTopicalNodes("parable", [
    topical("good-samaritan", "The Good Samaritan", "Luke 10:25-37", "Jesus taught that neighbor love shows mercy in action.", ["jesus"], ["samaria"], ["mercy", "love"], ["good-samaritan"]),
    topical("prodigal-son", "The Prodigal Son", "Luke 15:11-32", "Jesus taught about repentant sinners being welcomed with mercy.", ["jesus"], ["judea"], ["forgiveness", "repentance"], ["prodigal-son"]),
    topical("sower", "The Parable of the Sower", "Matthew 13:1-23", "Jesus taught about hearing and receiving God's Word.", ["jesus"], ["galilee"], ["gods-word", "growth"], ["parable-of-sower"]),
    topical("wise-and-foolish-builders", "Wise and Foolish Builders", "Matthew 7:24-27", "Jesus taught that wise people hear and obey His words.", ["jesus"], ["galilee"], ["obedience", "wisdom"], ["wise-foolish-builders"]),
  ]);

  const prophecies = makeTopicalNodes("prophecy", [
    topical("messiah-born-in-bethlehem", "Messiah Born in Bethlehem", "Micah 5:2", "God promised that a ruler for His people would come from Bethlehem.", ["jesus"], ["bethlehem"], ["promise", "hope"], ["birth-of-jesus"]),
    topical("suffering-servant", "The Suffering Servant", "Isaiah 53", "Isaiah points ahead to God's servant who would suffer for others.", ["isaiah", "jesus"], ["jerusalem"], ["sacrifice", "salvation"], ["crucifixion"]),
    topical("new-covenant", "New Covenant Promise", "Jeremiah 31:31-34", "God promised a new covenant with forgiveness and changed hearts.", ["jeremiah", "jesus"], ["jerusalem"], ["covenant", "forgiveness"], ["last-supper"]),
  ]);

  const commands = makeTopicalNodes("command", [
    topical("ten-commandments", "The Ten Commandments", "Exodus 20:1-17", "God gave commands that teach His people to love Him and others.", ["moses"], ["sinai"], ["obedience", "holiness"], ["ten-commandments"]),
    topical("great-commission", "The Great Commission", "Matthew 28:16-20", "Jesus commanded His followers to make disciples.", ["jesus"], ["galilee"], ["evangelism", "discipleship"], ["great-commission"]),
    topical("pray-like-this", "Pray Like This", "Matthew 6:9-13", "Jesus taught His disciples how to pray.", ["jesus"], ["galilee"], ["prayer", "trust"], ["lords-prayer"]),
  ]);

  const promises = makeTopicalNodes("promise", [
    topical("rainbow-promise", "The Rainbow Promise", "Genesis 9:13", "God gave the rainbow as a sign of His promise after the flood.", ["noah"], ["wilderness"], ["promise", "mercy"], ["noahs-ark"]),
    topical("abraham-promise", "God's Promise to Abraham", "Genesis 12:1-3", "God promised to bless Abraham and bless the nations through him.", ["abraham"], ["wilderness"], ["promise", "covenant"], ["god-calls-abram", "god-promises-abraham"]),
    topical("new-creation", "All Things New", "Revelation 21:1-5", "God promises to make all things new and wipe away every tear.", ["john", "jesus"], ["jerusalem"], ["hope", "new-creation"], ["new-creation-hope"]),
  ]);

  const objects = makeTopicalNodes("object", [
    topical("ark", "Noah's Ark", "Genesis 6:14", "The ark was the boat God told Noah to build for rescue.", ["noah"], ["wilderness"], ["obedience", "salvation"], ["noahs-ark"]),
    topical("rainbow", "Rainbow", "Genesis 9:13", "The rainbow was a sign of God's promise after the flood.", ["noah"], ["wilderness"], ["promise"], ["noahs-ark"]),
    topical("stone-tablets", "Stone Tablets", "Exodus 31:18", "The stone tablets held the commandments God gave Israel.", ["moses"], ["sinai"], ["obedience", "worship"], ["ten-commandments"]),
    topical("sling-stones", "David's Sling Stones", "1 Samuel 17:40", "David used simple stones while trusting God against Goliath.", ["david"], ["jerusalem"], ["faith", "courage"], ["david-and-goliath"]),
    topical("cross", "The Cross", "Luke 23:33", "Jesus died on the cross to save sinners.", ["jesus"], ["jerusalem"], ["sacrifice", "salvation"], ["crucifixion"]),
    topical("empty-tomb", "The Empty Tomb", "John 20:1-18", "The empty tomb shows that Jesus is risen.", ["jesus", "mary", "john", "peter"], ["jerusalem"], ["resurrection", "hope"], ["resurrection"]),
  ]);

  const quizBanks = makeQuizBanks(index, lessons);

  const groups = {
    people: [...peopleById.values()],
    places: [...placesById.values()],
    themes: [...themesById.values()],
    events: [...eventsById.values()],
    miracles,
    parables,
    prophecies,
    commands,
    promises,
    objects,
    memory_verses: [...memoryVersesById.values()],
    quiz_banks: quizBanks,
  };

  for (const [folder, nodes] of Object.entries(groups)) {
    for (const node of nodes.sort((a, b) => a.id.localeCompare(b.id))) {
      writeJson(join(graphRoot, folder, `${node.id}.json`), node);
    }
  }

  writeJson(join(graphRoot, "schema.json"), makeSchema());
  writeJson(join(graphRoot, "index.json"), makeIndex(groups));

  console.log(`Generated Bible graph: ${Object.entries(groups).map(([name, nodes]) => `${name}=${nodes.length}`).join(", ")}`);
}

function connectLessonToNodes(map, ids, field, valueOrValues) {
  for (const id of ids) {
    const node = map.get(id);
    if (!node) continue;
    const values = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];
    node[field] = sorted([...asArray(node[field]), ...values]);
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildRelatedLessons(lessonId, existing, summaries, people, themes) {
  const score = new Map();
  for (const id of existing) bump(score, id, 5);
  for (const summary of summaries) {
    if (summary.lesson_id === lessonId) continue;
    const otherPeople = lessonPeople[summary.lesson_id] || [];
    const otherThemes = (summary.tags || []).map(slug);
    for (const person of people) {
      if (otherPeople.includes(person)) bump(score, summary.lesson_id, 4);
    }
    for (const theme of themes) {
      if (otherThemes.includes(theme)) bump(score, summary.lesson_id, 2);
    }
    if (Math.abs((summary.sort_order || 0) - (summaries.find((entry) => entry.lesson_id === lessonId)?.sort_order || 0)) === 1) {
      bump(score, summary.lesson_id, 1);
    }
  }
  if (lessonId === "daniel-in-the-lions-den") {
    for (const id of ["fiery-furnace", "esther-speaks", "david-and-goliath", "mount-carmel", "daniel-chooses-faithfulness"]) {
      bump(score, id, 9);
    }
  }
  return [...score.entries()]
    .filter(([id]) => id !== lessonId)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([id]) => id);
}

function bump(map, key, amount) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
}

function eventName(lessonId, fallbackTitle) {
  const names = {
    "creation-good-world": "Creation",
    "garden-first-choice": "Fall",
    "noahs-ark": "Flood",
    "god-calls-abram": "Call of Abraham",
    "red-sea-crossing": "Exodus",
    jericho: "Battle of Jericho",
    "mount-carmel": "Elijah on Mount Carmel",
    "esther-speaks": "Esther Saves Her People",
    "jesus-baptized": "Baptism of Jesus",
    "jesus-tempted": "Temptation of Jesus",
    beatitudes: "Sermon on the Mount",
    "saul-converted": "Conversion of Paul",
  };
  return names[lessonId] || fallbackTitle;
}

function relatedPeopleFor(personId, lessons, peopleById) {
  const related = new Set();
  for (const { lesson } of lessons) {
    const people = lessonPeople[lesson.lesson_id] || [];
    if (!people.includes(personId)) continue;
    for (const other of people) {
      if (other !== personId && peopleById.has(other)) related.add(other);
    }
  }
  return sorted([...related]);
}

function topical(id, name, passage, summary, people, places, themes, related_lessons) {
  return {
    id,
    name,
    passage,
    summary,
    kid_summary: summary,
    people,
    places,
    themes,
    related_lessons,
  };
}

function makeTopicalNodes(type, entries) {
  return entries.map((entry) => ({ ...entry, type }));
}

function makeQuizBanks(index, lessons) {
  return index.packs.map((pack) => {
    const lessonIds = index.lessons.filter((lesson) => lesson.collection === pack.id).map((lesson) => lesson.lesson_id);
    const questions = lessons
      .filter(({ lesson }) => lessonIds.includes(lesson.lesson_id))
      .flatMap(({ lesson }) => (lesson.quiz_questions || []).map((question) => ({
        lesson_id: lesson.lesson_id,
        question: question.question,
        answer: question.answer,
        type: question.type,
      })));
    return {
      id: `${pack.id}-quiz-bank`,
      name: `${pack.name} Quiz Bank`,
      type: "quiz_bank",
      summary: `Reusable quiz questions from the ${pack.name} lesson pack.`,
      kid_summary: `Questions from ${pack.name}.`,
      lesson_ids: lessonIds,
      questions,
    };
  });
}

function makeSchema() {
  return {
    schema_version: "bible-graph/v1",
    description: "Reusable Bible knowledge graph nodes for lessons, search, recommendations, timelines, and game modes.",
    node_types: {
      person: ["id", "name", "type", "testament", "books", "roles", "summary", "kid_summary", "major_events", "related_people", "related_places", "themes", "lessons", "memory_verses", "questions", "notes"],
      place: ["id", "name", "type", "summary", "kid_summary", "related_people", "related_events", "themes", "lessons"],
      theme: ["id", "name", "type", "summary", "kid_summary", "related_lessons", "related_people", "related_verses", "questions"],
      event: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons", "timeline_order"],
      miracle: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      parable: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      prophecy: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      command: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      promise: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      object: ["id", "name", "type", "passage", "summary", "people", "places", "themes", "related_lessons"],
      memory_verse: ["id", "name", "type", "reference", "prompt", "themes", "related_lessons"],
      quiz_bank: ["id", "name", "type", "summary", "kid_summary", "lesson_ids", "questions"],
    },
    lesson_reference_fields: ["people", "places", "themes", "events", "related_graph_nodes"],
    related_graph_node_format: "type:id",
  };
}

function makeIndex(groups) {
  const compactGroups = {};
  const nodeCounts = {};
  for (const [folder, nodes] of Object.entries(groups)) {
    compactGroups[folder] = nodes
      .map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        summary: node.summary,
        kid_summary: node.kid_summary || node.summary,
        passage: node.passage,
        reference: node.reference,
        lessons: node.lessons || node.related_lessons || node.lesson_ids || [],
        lesson_ids: node.lesson_ids || [],
        questions: node.questions || [],
        people: node.people || node.related_people || [],
        places: node.places || node.related_places || [],
        themes: node.themes || [],
        events: node.major_events || node.related_events || [],
        timeline_order: node.timeline_order,
        file: `${folder}/${node.id}.json`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    nodeCounts[folder] = nodes.length;
  }

  return {
    schema_version: "bible-graph-index/v1",
    generated_at: new Date().toISOString(),
    node_counts: nodeCounts,
    nodes: compactGroups,
  };
}

main();

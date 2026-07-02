const studyCards = [
  card("Jesus Is Born", "Gospels", "Bethlehem", "Luke 2", "Jesus was born in Bethlehem and laid in a manger.", "God kept His promise to send a Savior.", "Where was Jesus born?", "Bethlehem", ["Nazareth", "Jerusalem", "Rome"], "Luke 2 tells the story of Jesus' birth."),
  card("John the Baptist", "Gospels", "Jordan River", "Matthew 3", "John prepared people to welcome Jesus.", "God helps people get ready to listen.", "Who prepared the way for Jesus?", "John the Baptist", ["Peter", "Paul", "Timothy"], "John pointed people toward Jesus."),
  card("Jesus Calls Fishermen", "Gospels", "Sea of Galilee", "Mark 1", "Jesus called fishermen to follow Him.", "Jesus invites ordinary people to follow.", "What did Peter and Andrew leave to follow Jesus?", "Nets", ["Crowns", "Scrolls", "Horses"], "They were fishermen by the sea."),
  card("The Good Samaritan", "Parables", "Jericho Road", "Luke 10", "Jesus taught that mercy means helping the person in front of us.", "Love your neighbor with action.", "Who helped the hurt man on the road?", "A Samaritan", ["A king", "A soldier", "A fisherman"], "The helper showed mercy."),
  card("The Lost Sheep", "Parables", "Hillside", "Luke 15", "Jesus said the shepherd looks for one lost sheep.", "God cares about each person.", "What did the shepherd look for?", "One lost sheep", ["A coin bag", "A boat", "A crown"], "The shepherd did not give up."),
  card("Jesus Calms the Storm", "Miracles", "Sea of Galilee", "Mark 4", "Jesus spoke, and the wind and waves became calm.", "Jesus is Lord over fearful moments.", "What became still when Jesus spoke?", "Wind and waves", ["A market", "A city wall", "A chariot"], "The disciples were in a boat during a storm."),
  card("Feeding the Five Thousand", "Miracles", "Hillside", "John 6", "Jesus fed a crowd with loaves and fish.", "Little things can become enough in Jesus' hands.", "What food did the boy share?", "Loaves and fish", ["Grapes and figs", "Milk and honey", "Rice and beans"], "John 6 names bread and fish."),
  card("Zacchaeus", "Gospels", "Jericho", "Luke 19", "Zacchaeus climbed a tree to see Jesus.", "Jesus notices people others may avoid.", "Where did Zacchaeus climb?", "A tree", ["A tower", "A boat", "A roof"], "He was short and wanted to see Jesus."),
  card("Mary and Martha", "Gospels", "Bethany", "Luke 10", "Mary listened to Jesus while Martha was busy serving.", "Listening to Jesus matters.", "Who sat and listened to Jesus?", "Mary", ["Martha", "Lydia", "Priscilla"], "Mary chose to listen."),
  card("The Last Supper", "Gospels", "Upper Room", "Luke 22", "Jesus shared bread and a cup with His disciples.", "Jesus gives His people a way to remember Him.", "Where did Jesus eat the Last Supper?", "Upper Room", ["Bethlehem stable", "Damascus road", "Roman prison"], "The meal happened before the cross."),
  card("The Empty Tomb", "Resurrection", "Jerusalem", "John 20", "Jesus rose from the dead.", "The good news begins with Jesus alive.", "What was empty on Easter morning?", "The tomb", ["The temple", "The boat", "The city gate"], "The followers found the tomb empty."),
  card("Thomas Believes", "Resurrection", "Jerusalem", "John 20", "Thomas saw the risen Jesus and believed.", "Bring honest questions to Jesus.", "Who said, 'My Lord and my God'?", "Thomas", ["Andrew", "Matthew", "Silas"], "Thomas answered after seeing Jesus."),
  card("The Great Commission", "Gospels", "Galilee", "Matthew 28", "Jesus sent His followers to make disciples.", "The good news is meant to be shared.", "What did Jesus send His followers to make?", "Disciples", ["Coins", "Boats", "Towers"], "Matthew 28 gives this command."),
  card("Pentecost", "Acts", "Jerusalem", "Acts 2", "The Holy Spirit came, and Peter preached about Jesus.", "God gives courage to witness.", "Which book tells about Pentecost?", "Acts", ["Genesis", "Psalms", "Revelation"], "Pentecost happens early in Acts."),
  card("Peter and John", "Acts", "Temple Gate", "Acts 3", "Peter and John helped a man who could not walk.", "Jesus' name brings hope.", "Who went to the temple gate together?", "Peter and John", ["Paul and Silas", "Mary and Martha", "Luke and Mark"], "Acts 3 names Peter and John."),
  card("Stephen Serves", "Acts", "Jerusalem", "Acts 6-7", "Stephen served the church and spoke boldly.", "Serving and courage belong together.", "Who was a bold early witness in Acts 6-7?", "Stephen", ["Zacchaeus", "Joseph", "Pilate"], "Stephen is remembered in Acts."),
  card("Philip and the Traveler", "Acts", "Desert Road", "Acts 8", "Philip helped a traveler understand Scripture.", "God can use one conversation.", "Who helped the traveler understand Scripture?", "Philip", ["Thomas", "Judas", "Caesar"], "Philip met him on the road."),
  card("Saul Meets Jesus", "Acts", "Damascus Road", "Acts 9", "Jesus met Saul and changed his life.", "Jesus can transform anyone.", "What was Paul's earlier name?", "Saul", ["Silas", "Simon", "Simeon"], "Acts first calls him Saul."),
  card("Ananias Helps Saul", "Acts", "Damascus", "Acts 9", "Ananias obeyed God and prayed for Saul.", "Obedience can help someone begin again.", "Who prayed for Saul in Damascus?", "Ananias", ["Barnabas", "Luke", "Mark"], "God sent Ananias to Saul."),
  card("Peter and Cornelius", "Acts", "Caesarea", "Acts 10", "Peter learned that the good news is for all peoples.", "God welcomes people from every nation.", "Who heard Peter preach in Acts 10?", "Cornelius", ["Zacchaeus", "Nicodemus", "Herod"], "Cornelius was a Gentile household leader."),
  card("Barnabas Encourages", "Acts", "Antioch", "Acts 11", "Barnabas encouraged believers and helped Paul.", "Encouragement helps others grow.", "Whose name means son of encouragement?", "Barnabas", ["Barabbas", "Bartholomew", "Benjamin"], "Acts explains Barnabas' nickname."),
  card("Paul and Silas Sing", "Acts", "Philippi", "Acts 16", "Paul and Silas sang in prison.", "We can worship in hard places.", "Who sang in prison?", "Paul and Silas", ["Peter and Andrew", "Mary and Martha", "James and John"], "Acts 16 tells this story."),
  card("Lydia Listens", "Acts", "Philippi", "Acts 16", "Lydia listened to Paul's message and welcomed believers.", "Open hearts can become open homes.", "Who welcomed Paul in Philippi?", "Lydia", ["Martha", "Rhoda", "Elizabeth"], "Lydia was in Philippi."),
  card("Paul in Athens", "Acts", "Athens", "Acts 17", "Paul taught about the true God in Athens.", "God can be named in new places.", "Where did Paul speak about the unknown God?", "Athens", ["Bethlehem", "Jericho", "Nazareth"], "Acts 17 places Paul in Athens."),
  card("Romans", "Letters", "Rome", "Romans", "Romans teaches about sin, grace, faith, and new life.", "God's grace is bigger than our failure.", "Which New Testament book is a letter to believers in Rome?", "Romans", ["Acts", "Luke", "Revelation"], "Romans is one of Paul's letters."),
  card("Fruit of the Spirit", "Letters", "Galatia", "Galatians 5", "Paul named fruit like love, joy, peace, patience, and kindness.", "The Spirit grows good fruit in us.", "Which fruit is named in Galatians 5?", "Love", ["Pride", "Greed", "Fear"], "Love is first in the list."),
  card("Armor of God", "Letters", "Ephesus", "Ephesians 6", "Paul used armor pictures to teach faith, truth, and prayer.", "God helps His people stand strong.", "Which letter talks about the armor of God?", "Ephesians", ["Matthew", "John", "Acts"], "Ephesians 6 has the armor picture."),
  card("Timothy", "Letters", "Lystra", "2 Timothy 1", "Timothy learned sincere faith and served while young.", "Young believers can serve with courage.", "Who was Paul's young helper?", "Timothy", ["Zacchaeus", "Nicodemus", "Cornelius"], "Paul wrote letters to Timothy."),
  card("Hebrews", "Letters", "Church", "Hebrews 12", "Hebrews encourages believers to keep following Jesus.", "Keep your eyes on Jesus.", "Hebrews says to fix our eyes on whom?", "Jesus", ["Moses", "David", "Peter"], "Hebrews points us to Jesus."),
  card("Revelation", "Revelation", "Patmos", "Revelation 21", "Revelation ends with hope: God makes all things new.", "The story ends with God's good future.", "Which book says God makes all things new?", "Revelation", ["Mark", "Acts", "Philemon"], "Revelation is the last New Testament book.")
];

const newTestamentBooks = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const state = {
  mode: "quest",
  sound: true,
  roundLength: 8,
  current: 0,
  order: [],
  recentOrder: [],
  score: 0,
  streak: 0,
  answered: false,
  trailStep: 0,
  teamTurn: 0,
  deckIndex: 0,
  deckFlipped: false,
  booksComplete: false,
  teams: [
    { name: "Team Lamp", score: 0 },
    { name: "Team Anchor", score: 0 }
  ],
  selectedName: null,
  selectedClue: null,
  bookIndex: 0
};

const el = {
  setupView: document.querySelector("#setupView"),
  finishView: document.querySelector("#finishView"),
  gameContent: document.querySelector("#gameContent"),
  scoreboard: document.querySelector("#scoreboard"),
  trailStops: document.querySelector("#trailStops"),
  trailNote: document.querySelector("#trailNote"),
  playLayout: document.querySelector("#playLayout"),
  studyCard: document.querySelector("#studyCard"),
  roundLabel: document.querySelector("#roundLabel"),
  categoryLabel: document.querySelector("#categoryLabel"),
  questionText: document.querySelector("#questionText"),
  answerGrid: document.querySelector("#answerGrid"),
  feedback: document.querySelector("#feedback"),
  hintButton: document.querySelector("#hintButton"),
  nextButton: document.querySelector("#nextButton"),
  setupButton: document.querySelector("#setupButton"),
  resetButton: document.querySelector("#resetButton"),
  soundToggle: document.querySelector("#soundToggle"),
  startSolo: document.querySelector("#startSolo"),
  startTeams: document.querySelector("#startTeams"),
  openMatch: document.querySelector("#openMatch"),
  openBooks: document.querySelector("#openBooks"),
  openCards: document.querySelector("#openCards"),
  playAgain: document.querySelector("#playAgain"),
  backToSetup: document.querySelector("#backToSetup"),
  finishTitle: document.querySelector("#finishTitle"),
  finishSummary: document.querySelector("#finishSummary"),
  finishScores: document.querySelector("#finishScores"),
  teamOneName: document.querySelector("#teamOneName"),
  teamTwoName: document.querySelector("#teamTwoName"),
  matchNames: document.querySelector("#matchNames"),
  matchClues: document.querySelector("#matchClues"),
  bookPrompt: document.querySelector("#bookPrompt"),
  bookChoices: document.querySelector("#bookChoices"),
  bookProgress: document.querySelector("#bookProgress"),
  bookCompleteActions: document.querySelector("#bookCompleteActions"),
  bookBackToSetup: document.querySelector("#bookBackToSetup"),
  cardDeck: document.querySelector("#cardDeck"),
  cardCounter: document.querySelector("#cardCounter"),
  prevCard: document.querySelector("#prevCard"),
  flipCard: document.querySelector("#flipCard"),
  nextCard: document.querySelector("#nextCard")
};

function card(title, group, place, reference, fact, lesson, question, answer, wrong, hint) {
  return { title, group, place, reference, fact, lesson, question, answer, wrong, hint };
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildRoundOrder(totalCount, roundLength, recentOrder) {
  const allIndexes = [...Array(totalCount).keys()];
  const recent = new Set(recentOrder);
  const freshIndexes = allIndexes.filter(index => !recent.has(index));
  const preferredPool = freshIndexes.length >= roundLength ? freshIndexes : allIndexes;
  const order = shuffle(preferredPool).slice(0, roundLength);

  if (order.length < roundLength) {
    const chosen = new Set(order);
    order.push(...shuffle(allIndexes.filter(index => !chosen.has(index))).slice(0, roundLength - order.length));
  }

  return order;
}

function resetOrder() {
  state.order = buildRoundOrder(studyCards.length, state.roundLength, state.recentOrder);
  state.recentOrder = [...state.order];
}

function currentCard() {
  if (state.order.length !== state.roundLength) resetOrder();
  return studyCards[state.order[state.current]];
}

function questionOptions(studyCard) {
  return shuffle([studyCard.answer, ...studyCard.wrong]);
}

function showSetup() {
  el.setupView.hidden = false;
  el.finishView.hidden = true;
  el.gameContent.hidden = true;
}

function applySettings() {
  state.teams[0].name = cleanName(el.teamOneName.value, "Team Lamp");
  state.teams[1].name = cleanName(el.teamTwoName.value, "Team Anchor");
}

function cleanName(value, fallback) {
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function startRound(mode) {
  applySettings();
  state.mode = mode;
  state.current = 0;
  state.score = 0;
  state.streak = 0;
  state.trailStep = 0;
  state.teamTurn = 0;
  state.teams.forEach(team => team.score = 0);
  resetOrder();
  el.setupView.hidden = true;
  el.finishView.hidden = true;
  el.gameContent.hidden = false;
  setMode(mode);
}

function openPracticeMode(mode) {
  applySettings();
  state.score = 0;
  state.streak = 0;
  state.teamTurn = 0;
  state.teams.forEach(team => team.score = 0);
  el.setupView.hidden = true;
  el.finishView.hidden = true;
  el.gameContent.hidden = false;
  setMode(mode);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  const target = mode === "match" ? "matchView" : mode === "books" ? "booksView" : mode === "cards" ? "cardsView" : "questView";
  document.querySelector(`#${target}`).classList.add("active");
  if (mode === "quest" || mode === "teams") renderQuestion();
  if (mode === "match") renderMatch();
  if (mode === "books") renderBooks();
  if (mode === "cards") renderCards();
  renderScoreboard();
}

function renderScoreboard() {
  const tiles = [
    scoreTile("Score", state.score),
    scoreTile("Streak", state.streak),
    ...state.teams.map((team, index) => `
      <div class="score-tile ${state.mode === "teams" && state.teamTurn === index ? "active-team" : ""}">
        <span>${escapeHtml(team.name)}</span><strong>${team.score}</strong>
      </div>`)
  ];
  el.scoreboard.innerHTML = tiles.join("");
}

function scoreTile(label, value) {
  return `<div class="score-tile"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderTrail() {
  const visible = studyCards.slice(0, 8);
  const step = Math.min(state.trailStep, visible.length - 1);
  el.trailStops.innerHTML = visible.map((item, index) => `
    <div class="trail-stop ${index < step ? "complete" : index === step ? "current" : ""}">
      <span>${index + 1}</span>
      <strong>${escapeHtml(item.group)}</strong>
    </div>
  `).join("");
  const active = visible[step];
  el.trailNote.innerHTML = `<strong>${escapeHtml(active.place)}</strong><span>${escapeHtml(active.lesson)}</span>`;
}

function renderQuestion() {
  const item = currentCard();
  state.answered = false;
  el.studyCard.hidden = true;
  el.studyCard.innerHTML = "";
  el.playLayout.classList.remove("card-open");
  el.hintButton.textContent = "Show Hint";
  el.nextButton.textContent = "Next Question";
  el.roundLabel.textContent = `Question ${state.current + 1} of ${state.roundLength}`;
  el.categoryLabel.textContent = item.group;
  el.questionText.textContent = item.question;
  el.feedback.textContent = state.mode === "teams" ? `${state.teams[state.teamTurn].name}, choose an answer.` : "Choose an answer.";
  el.feedback.className = "feedback";
  el.answerGrid.innerHTML = questionOptions(item).map(option => `
    <button class="answer-button" type="button" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>
  `).join("");
  document.querySelectorAll(".answer-button").forEach(button => {
    button.addEventListener("click", () => chooseAnswer(button));
  });
  renderTrail();
  renderScoreboard();
}

function chooseAnswer(button) {
  if (state.answered) return;
  state.answered = true;
  const item = currentCard();
  const correct = button.dataset.answer === item.answer;
  document.querySelectorAll(".answer-button").forEach(candidate => {
    if (candidate.dataset.answer === item.answer) candidate.classList.add("correct");
    else if (candidate === button) candidate.classList.add("wrong");
  });
  if (correct) {
    const points = 100 + Math.min(state.streak, 4) * 25;
    state.score += points;
    state.streak += 1;
    state.trailStep += 1;
    if (state.mode === "teams") state.teams[state.teamTurn].score += points;
    el.feedback.textContent = `Correct. ${item.hint}`;
    el.feedback.className = "feedback good";
    tone(660, 0.1, "triangle");
  } else {
    state.streak = 0;
    el.feedback.textContent = `Good try. The answer is ${item.answer}. ${item.hint}`;
    el.feedback.className = "feedback bad";
    tone(180, 0.12, "square");
  }
  if (state.current + 1 >= state.roundLength) el.nextButton.textContent = "Show Results";
  showStudyCard(item);
  if (state.mode === "teams") state.teamTurn = (state.teamTurn + 1) % state.teams.length;
  renderTrail();
  renderScoreboard();
}

function nextQuestion() {
  if (state.current + 1 >= state.roundLength) {
    showFinish();
    return;
  }
  state.current += 1;
  renderQuestion();
}

function toggleHint() {
  if (el.studyCard.hidden) {
    showStudyCard(currentCard());
    el.feedback.textContent = currentCard().hint;
    el.feedback.className = "feedback";
    el.hintButton.textContent = "Hide Hint";
  } else {
    el.studyCard.hidden = true;
    el.playLayout.classList.remove("card-open");
    el.hintButton.textContent = "Show Hint";
  }
}

function showStudyCard(item) {
  el.studyCard.innerHTML = studyCardMarkup(item);
  el.studyCard.hidden = false;
  el.playLayout.classList.add("card-open");
}

function studyCardMarkup(item) {
  return `
    <article>
      <div class="card-banner"><span>${escapeHtml(item.group)}</span></div>
      <p class="eyebrow">${escapeHtml(item.group)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="reference">${escapeHtml(item.reference)}</p>
      <p>${escapeHtml(item.fact)}</p>
      <dl class="fact-list">
        <div><dt>Place</dt><dd>${escapeHtml(item.place)}</dd></div>
        <div><dt>Remember</dt><dd>${escapeHtml(item.lesson)}</dd></div>
      </dl>
    </article>`;
}

function renderMatch() {
  const set = shuffle(studyCards).slice(0, 8);
  state.selectedName = null;
  state.selectedClue = null;
  el.matchNames.innerHTML = set.map(item => `
    <button class="match-item" type="button" data-kind="name" data-id="${escapeAttr(item.title)}">${escapeHtml(item.title)}</button>
  `).join("");
  el.matchClues.innerHTML = shuffle(set).map(item => `
    <button class="match-item" type="button" data-kind="clue" data-id="${escapeAttr(item.title)}">${escapeHtml(simpleMatchClue(item))}</button>
  `).join("");
  document.querySelectorAll(".match-item").forEach(item => item.addEventListener("click", () => selectMatch(item)));
}

function simpleMatchClue(item) {
  return `${item.reference}: ${item.fact}`;
}

function selectMatch(item) {
  if (item.classList.contains("matched")) return;
  const kind = item.dataset.kind;
  document.querySelectorAll(`.match-item[data-kind="${kind}"]`).forEach(button => button.classList.remove("selected"));
  item.classList.add("selected");
  if (kind === "name") state.selectedName = item;
  if (kind === "clue") state.selectedClue = item;
  if (!state.selectedName || !state.selectedClue) return;
  if (state.selectedName.dataset.id === state.selectedClue.dataset.id) {
    state.selectedName.classList.add("matched");
    state.selectedClue.classList.add("matched");
    state.score += 75;
    tone(520, 0.09, "sine");
  } else {
    tone(160, 0.1, "square");
  }
  state.selectedName.classList.remove("selected");
  state.selectedClue.classList.remove("selected");
  state.selectedName = null;
  state.selectedClue = null;
  renderScoreboard();
}

function renderBooks() {
  state.bookIndex = 0;
  state.booksComplete = false;
  renderBookQuestion();
}

function renderBookQuestion() {
  const answer = newTestamentBooks[state.bookIndex];
  const wrong = shuffle(newTestamentBooks.filter(book => book !== answer)).slice(0, 3);
  el.bookPrompt.textContent = state.booksComplete
    ? "Great work. You finished all 27 New Testament books."
    : `Book ${state.bookIndex + 1} of ${newTestamentBooks.length}`;
  el.bookCompleteActions.hidden = !state.booksComplete;
  el.bookChoices.innerHTML = shuffle([answer, ...wrong]).map(book => `
    <button class="book-choice" type="button" data-book="${escapeAttr(book)}" ${state.booksComplete ? "disabled" : ""}>${escapeHtml(book)}</button>
  `).join("");
  el.bookProgress.innerHTML = newTestamentBooks.map((book, index) => `
    <span class="${index < state.bookIndex || state.booksComplete ? "complete" : index === state.bookIndex ? "current" : ""}">${index < state.bookIndex || state.booksComplete ? escapeHtml(book) : index + 1}</span>
  `).join("");
  document.querySelectorAll(".book-choice").forEach(button => button.addEventListener("click", () => chooseBook(button)));
}

function chooseBook(button) {
  if (state.booksComplete) return;
  const answer = newTestamentBooks[state.bookIndex];
  if (button.dataset.book === answer) {
    state.score += 40;
    if (state.bookIndex + 1 >= newTestamentBooks.length) {
      state.booksComplete = true;
      button.classList.add("correct");
    } else {
      state.bookIndex += 1;
    }
    tone(620, 0.08, "triangle");
    renderBookQuestion();
  } else {
    button.classList.add("wrong");
    tone(160, 0.1, "square");
  }
  renderScoreboard();
}

function renderCards() {
  state.deckFlipped = false;
  renderDeckCard();
}

function renderDeckCard() {
  const item = studyCards[state.deckIndex];
  el.cardDeck.innerHTML = state.deckFlipped ? `
    <article class="deck-card answer-side">
      <p class="eyebrow">${escapeHtml(item.group)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <dl class="fact-list">
        <div><dt>Reference</dt><dd>${escapeHtml(item.reference)}</dd></div>
        <div><dt>Place</dt><dd>${escapeHtml(item.place)}</dd></div>
        <div><dt>Remember</dt><dd>${escapeHtml(item.lesson)}</dd></div>
      </dl>
    </article>
  ` : `
    <article class="deck-card prompt-side">
      <div class="card-banner"><span>${escapeHtml(item.group)}</span></div>
      <p class="eyebrow">${escapeHtml(item.group)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.fact)}</p>
      <p class="reference">${escapeHtml(item.reference)}</p>
    </article>
  `;
  el.cardCounter.textContent = `Card ${state.deckIndex + 1} of ${studyCards.length}`;
  el.flipCard.textContent = state.deckFlipped ? "Show Front" : "Flip Card";
}

function moveDeck(step) {
  state.deckIndex = (state.deckIndex + step + studyCards.length) % studyCards.length;
  state.deckFlipped = false;
  renderDeckCard();
}

function showFinish() {
  el.gameContent.hidden = true;
  el.finishView.hidden = false;
  if (state.mode === "teams") {
    const [one, two] = state.teams;
    let winner = "It is a tie";
    if (one.score > two.score) winner = `${one.name} wins`;
    if (two.score > one.score) winner = `${two.name} wins`;
    el.finishTitle.textContent = winner;
    el.finishSummary.textContent = `Completed ${state.roundLength} New Testament questions.`;
    el.finishScores.innerHTML = state.teams.map(team => `<div class="finish-score"><span>${escapeHtml(team.name)}</span><strong>${team.score}</strong></div>`).join("");
  } else {
    el.finishTitle.textContent = "Quick Quest Complete";
    el.finishSummary.textContent = `You scored ${state.score} points and reached ${Math.min(state.trailStep, 8)} trail stops.`;
    el.finishScores.innerHTML = `<div class="finish-score"><span>Score</span><strong>${state.score}</strong></div><div class="finish-score"><span>Streak</span><strong>${state.streak}</strong></div>`;
  }
}

function resetGame() {
  if (el.gameContent.hidden) {
    showSetup();
    return;
  }
  startRound(state.mode === "teams" ? "teams" : "quest");
}

function tone(freq, duration, type) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
document.querySelectorAll(".segment").forEach(button => {
  button.addEventListener("click", () => {
    state.roundLength = Number(button.dataset.round);
    document.querySelectorAll(".segment").forEach(segment => segment.classList.toggle("active", segment === button));
  });
});

el.startSolo.addEventListener("click", () => startRound("quest"));
el.startTeams.addEventListener("click", () => startRound("teams"));
el.openMatch.addEventListener("click", () => openPracticeMode("match"));
el.openBooks.addEventListener("click", () => openPracticeMode("books"));
el.openCards.addEventListener("click", () => openPracticeMode("cards"));
el.playAgain.addEventListener("click", () => startRound(state.mode === "teams" ? "teams" : "quest"));
el.backToSetup.addEventListener("click", showSetup);
el.bookBackToSetup.addEventListener("click", showSetup);
el.setupButton.addEventListener("click", showSetup);
el.resetButton.addEventListener("click", resetGame);
el.nextButton.addEventListener("click", nextQuestion);
el.hintButton.addEventListener("click", toggleHint);
el.prevCard.addEventListener("click", () => moveDeck(-1));
el.flipCard.addEventListener("click", () => {
  state.deckFlipped = !state.deckFlipped;
  renderDeckCard();
});
el.nextCard.addEventListener("click", () => moveDeck(1));
el.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  el.soundToggle.textContent = state.sound ? "S" : "M";
});

showSetup();

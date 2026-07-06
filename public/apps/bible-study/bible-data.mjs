export const gameLaunches = [
  {
    id: "apostles-quest",
    title: "Apostles Quest",
    href: "../apostles/",
    eyebrow: "Existing Game",
    summary: "Review the Twelve, Matthias, Paul, Acts moments, team play, matching, and cards.",
    mode: "Apostles, Acts, Teams"
  },
  {
    id: "new-testament-trail",
    title: "New Testament Trail",
    href: "../apostles/new-testament-trail.html",
    eyebrow: "Existing Game",
    summary: "Play through Gospels, Acts, letters, book order, matching, and flashcards.",
    mode: "New Testament Basics"
  }
];

const whoSaidIt = [
  {
    id: "who-peter-confession",
    concept: "Peter recognizes Jesus as the Messiah",
    difficulty: "easy",
    prompt: "Who said, 'You are the Christ, the Son of the living God'?",
    reference: "Matthew 16:16",
    explanation: "Peter confessed that Jesus is the promised Christ, and Jesus used that moment to teach about faith and His church.",
    teachingPoint: "A clear confession of Jesus is a turning point.",
    choices: [
      { id: "peter", text: "Peter", correct: true },
      { id: "andrew", text: "Andrew", wrongNote: "Andrew often brought people to Jesus, but Peter made this confession." },
      { id: "john", text: "John", wrongNote: "John was close to Jesus, but this answer comes from Peter." },
      { id: "thomas", text: "Thomas", wrongNote: "Thomas made a later resurrection confession, not this one." }
    ]
  },
  {
    id: "who-thomas-my-lord",
    concept: "Thomas moves from doubt to worship",
    difficulty: "easy",
    prompt: "Who said, 'My Lord and my God' after seeing the risen Jesus?",
    reference: "John 20:28",
    explanation: "Thomas answered Jesus with worship after seeing that the crucified Lord was alive.",
    teachingPoint: "Honest questions can lead to deeper faith.",
    choices: [
      { id: "thomas", text: "Thomas", correct: true },
      { id: "peter", text: "Peter", wrongNote: "Peter confessed Jesus earlier, but Thomas said this after the resurrection." },
      { id: "philip", text: "Philip", wrongNote: "Philip asked Jesus to show the Father; Thomas made this statement." },
      { id: "mary", text: "Mary Magdalene", wrongNote: "Mary saw the risen Jesus first, but this line belongs to Thomas." }
    ]
  },
  {
    id: "who-philip-come-see",
    concept: "Philip invites Nathanael to meet Jesus",
    difficulty: "easy",
    prompt: "Who told Nathanael, 'Come and see'?",
    reference: "John 1:46",
    explanation: "Philip did not try to win an argument. He invited Nathanael to meet Jesus for himself.",
    teachingPoint: "A simple invitation can open the door to faith.",
    choices: [
      { id: "philip", text: "Philip", correct: true },
      { id: "andrew", text: "Andrew", wrongNote: "Andrew invited his brother Peter, but Philip spoke to Nathanael." },
      { id: "bartholomew", text: "Bartholomew", wrongNote: "Bartholomew is often linked with Nathanael, the person being invited." },
      { id: "matthew", text: "Matthew", wrongNote: "Matthew left the tax booth, but Philip gave this invitation." }
    ]
  },
  {
    id: "who-john-baptist-voice",
    concept: "John the Baptist prepares the way",
    difficulty: "medium",
    prompt: "Who said he was 'the voice of one crying in the wilderness'?",
    reference: "John 1:23",
    explanation: "John the Baptist used Isaiah's words to explain that his mission was to prepare people for the Lord.",
    teachingPoint: "Faithful witnesses point attention away from themselves and toward God.",
    choices: [
      { id: "john-baptist", text: "John the Baptist", correct: true },
      { id: "isaiah", text: "Isaiah", wrongNote: "Isaiah gave the prophecy, but John the Baptist applied it to his own ministry." },
      { id: "john-apostle", text: "John the Apostle", wrongNote: "John's Gospel records this, but John the Baptist spoke the line." },
      { id: "elijah", text: "Elijah", wrongNote: "People asked about Elijah, but John the Baptist gave this answer." }
    ]
  },
  {
    id: "who-cain-brother",
    concept: "Cain avoids responsibility after sin",
    difficulty: "medium",
    prompt: "Who asked, 'Am I my brother's keeper?'",
    reference: "Genesis 4:9",
    explanation: "Cain asked this after killing Abel, trying to dodge the truth God already knew.",
    teachingPoint: "God sees hidden wrongs and calls people to answer truthfully.",
    choices: [
      { id: "cain", text: "Cain", correct: true },
      { id: "abel", text: "Abel", wrongNote: "Abel was Cain's brother and the victim in this story." },
      { id: "adam", text: "Adam", wrongNote: "Adam hid after sin in Eden, but Cain asked this question." },
      { id: "jacob", text: "Jacob", wrongNote: "Jacob had family conflict later, but this question belongs to Cain." }
    ]
  },
  {
    id: "who-samuel-listening",
    concept: "Samuel learns to listen for God",
    difficulty: "medium",
    prompt: "Who said, 'Speak, Lord, for your servant is listening'?",
    reference: "1 Samuel 3:10",
    explanation: "Young Samuel answered God after Eli helped him understand who was calling.",
    teachingPoint: "Listening is often the first faithful response.",
    choices: [
      { id: "samuel", text: "Samuel", correct: true },
      { id: "eli", text: "Eli", wrongNote: "Eli taught Samuel what to say, but Samuel spoke the words." },
      { id: "david", text: "David", wrongNote: "David listened to God in many moments, but this line belongs to Samuel." },
      { id: "solomon", text: "Solomon", wrongNote: "Solomon asked for wisdom later; Samuel gave this answer as a boy." }
    ]
  },
  {
    id: "who-david-shepherd",
    concept: "David describes the Lord as shepherd",
    difficulty: "easy",
    prompt: "Who wrote, 'The Lord is my shepherd'?",
    reference: "Psalm 23:1",
    explanation: "Psalm 23 is connected with David, who knew shepherd life and used it to describe God's care.",
    teachingPoint: "God's care can be trusted like a good shepherd.",
    choices: [
      { id: "david", text: "David", correct: true },
      { id: "moses", text: "Moses", wrongNote: "Moses led Israel, but Psalm 23 is connected with David." },
      { id: "solomon", text: "Solomon", wrongNote: "Solomon wrote wisdom, but this psalm is tied to David." },
      { id: "asaph", text: "Asaph", wrongNote: "Asaph wrote some psalms, but not Psalm 23." }
    ]
  },
  {
    id: "who-joshua-house",
    concept: "Joshua calls Israel to choose faithful worship",
    difficulty: "easy",
    prompt: "Who said, 'As for me and my house, we will serve the Lord'?",
    reference: "Joshua 24:15",
    explanation: "Joshua spoke these words as Israel was challenged to serve the Lord instead of false gods.",
    teachingPoint: "Faithfulness is a household decision, not just a private idea.",
    choices: [
      { id: "joshua", text: "Joshua", correct: true },
      { id: "caleb", text: "Caleb", wrongNote: "Caleb stayed faithful, but Joshua made this public statement." },
      { id: "moses", text: "Moses", wrongNote: "Moses led before Joshua, but this comes near the end of Joshua's life." },
      { id: "gideon", text: "Gideon", wrongNote: "Gideon led during Judges, but this line belongs to Joshua." }
    ]
  },
  {
    id: "who-job-redeemer",
    concept: "Job holds hope while suffering",
    difficulty: "medium",
    prompt: "Who said, 'I know that my Redeemer lives'?",
    reference: "Job 19:25",
    explanation: "Job spoke hope in the middle of grief, pain, and questions he could not yet answer.",
    teachingPoint: "Hope can speak even before life makes sense again.",
    choices: [
      { id: "job", text: "Job", correct: true },
      { id: "eliphaz", text: "Eliphaz", wrongNote: "Eliphaz was one of Job's friends, but Job said this." },
      { id: "isaiah", text: "Isaiah", wrongNote: "Isaiah spoke about redemption, but this line comes from Job." },
      { id: "jeremiah", text: "Jeremiah", wrongNote: "Jeremiah grieved deeply too, but Job said these words." }
    ]
  },
  {
    id: "who-peter-eternal-life",
    concept: "Peter trusts Jesus when others leave",
    difficulty: "medium",
    prompt: "Who asked Jesus, 'Lord, to whom shall we go?'",
    reference: "John 6:68",
    explanation: "Peter said this after many disciples walked away from Jesus' hard teaching.",
    teachingPoint: "Faith sometimes means staying with Jesus when the crowd leaves.",
    choices: [
      { id: "peter", text: "Peter", correct: true },
      { id: "john", text: "John", wrongNote: "John recorded the moment, but Peter spoke the question." },
      { id: "andrew", text: "Andrew", wrongNote: "Andrew was nearby in several John 6 scenes, but Peter said this." },
      { id: "james", text: "James", wrongNote: "James was one of the Twelve, but this question belongs to Peter." }
    ]
  },
  {
    id: "who-jailer-saved",
    concept: "The jailer asks how to be saved",
    difficulty: "medium",
    prompt: "Who asked, 'What must I do to be saved?'",
    reference: "Acts 16:30",
    explanation: "The Philippian jailer asked Paul and Silas this after an earthquake opened the prison doors.",
    teachingPoint: "A crisis can become the moment someone asks the right question.",
    choices: [
      { id: "jailer", text: "The Philippian jailer", correct: true },
      { id: "lydia", text: "Lydia", wrongNote: "Lydia listened to Paul's message earlier in Philippi, but the jailer asked this question." },
      { id: "cornelius", text: "Cornelius", wrongNote: "Cornelius heard Peter preach in Acts 10, not Paul and Silas in prison." },
      { id: "felix", text: "Felix", wrongNote: "Felix heard Paul later, but the jailer asked this urgent question." }
    ]
  },
  {
    id: "who-mary-magnify",
    concept: "Mary praises God for His mercy",
    difficulty: "medium",
    prompt: "Who said, 'My soul magnifies the Lord'?",
    reference: "Luke 1:46",
    explanation: "Mary praised God after Elizabeth blessed her and recognized God's work in the coming birth of Jesus.",
    teachingPoint: "God's mercy turns ordinary obedience into worship.",
    choices: [
      { id: "mary", text: "Mary", correct: true },
      { id: "elizabeth", text: "Elizabeth", wrongNote: "Elizabeth blessed Mary, but Mary began this song of praise." },
      { id: "anna", text: "Anna", wrongNote: "Anna praised God at the temple later, but Mary said this." },
      { id: "martha", text: "Martha", wrongNote: "Martha confessed faith in John 11, but Mary spoke this line in Luke 1." }
    ]
  }
];

const matchMiracle = [
  {
    id: "miracle-water-wine",
    concept: "Jesus reveals glory at a wedding",
    difficulty: "easy",
    prompt: "At Cana, what did Jesus turn water into?",
    reference: "John 2:1-11",
    explanation: "Jesus turned water into wine at a wedding in Cana, and John calls it the first sign that revealed His glory.",
    teachingPoint: "Jesus brings abundance where people only see lack.",
    choices: [
      { id: "wine", text: "Wine", correct: true },
      { id: "oil", text: "Oil", wrongNote: "Oil appears in other Bible stories, but Cana involved water becoming wine." },
      { id: "honey", text: "Honey", wrongNote: "Honey is not the sign John records at the wedding." },
      { id: "bread", text: "Bread", wrongNote: "Bread matters in another miracle, but this sign happened with water jars." }
    ]
  },
  {
    id: "miracle-calm-storm",
    concept: "Jesus has authority over creation",
    difficulty: "easy",
    prompt: "What became calm when Jesus spoke on the Sea of Galilee?",
    reference: "Mark 4:35-41",
    explanation: "Jesus rebuked the wind and spoke to the sea, and the storm became calm.",
    teachingPoint: "Jesus is Lord even over fearful moments.",
    choices: [
      { id: "storm", text: "Wind and waves", correct: true },
      { id: "market", text: "A crowded market", wrongNote: "This miracle happened in a boat during a storm." },
      { id: "army", text: "A marching army", wrongNote: "No army is part of this Sea of Galilee scene." },
      { id: "fire", text: "A temple fire", wrongNote: "The danger here was wind and water, not fire." }
    ]
  },
  {
    id: "miracle-feeding-5000",
    concept: "Jesus provides more than enough",
    difficulty: "easy",
    prompt: "What food did Jesus multiply to feed the five thousand?",
    reference: "John 6:1-14",
    explanation: "A boy had five barley loaves and two fish, and Jesus fed the crowd with food left over.",
    teachingPoint: "Small things are enough in Jesus' hands.",
    choices: [
      { id: "loaves-fish", text: "Loaves and fish", correct: true },
      { id: "manna-quail", text: "Manna and quail", wrongNote: "That points to the wilderness story with Moses, not John 6." },
      { id: "figs-grapes", text: "Figs and grapes", wrongNote: "Figs and grapes are common Bible foods, but not this miracle detail." },
      { id: "bread-wine", text: "Bread and wine", wrongNote: "That pairing points more toward the Last Supper than this feeding miracle." }
    ]
  },
  {
    id: "miracle-walk-water",
    concept: "Jesus meets fearful disciples on the water",
    difficulty: "easy",
    prompt: "Where did Jesus walk when the disciples were afraid in the boat?",
    reference: "Matthew 14:22-33",
    explanation: "Jesus came to the disciples walking on the sea, and Peter briefly walked toward Him too.",
    teachingPoint: "Fear shrinks when attention returns to Jesus.",
    choices: [
      { id: "water", text: "On the water", correct: true },
      { id: "mountain", text: "On a mountain path", wrongNote: "Jesus had prayed on the mountain, but the miracle happened on the water." },
      { id: "temple", text: "Across the temple court", wrongNote: "The temple is not part of this boat scene." },
      { id: "road", text: "On the Jericho road", wrongNote: "The Jericho road belongs to other teachings and stories, not this miracle." }
    ]
  },
  {
    id: "miracle-bartimaeus",
    concept: "Jesus hears persistent faith",
    difficulty: "medium",
    prompt: "Which blind man called out to Jesus near Jericho?",
    reference: "Mark 10:46-52",
    explanation: "Bartimaeus cried out for mercy, and Jesus restored his sight.",
    teachingPoint: "Faith keeps calling to Jesus even when others tell it to be quiet.",
    choices: [
      { id: "bartimaeus", text: "Bartimaeus", correct: true },
      { id: "zacchaeus", text: "Zacchaeus", wrongNote: "Zacchaeus met Jesus in Jericho, but he climbed a tree and was not the blind man." },
      { id: "lazarus", text: "Lazarus", wrongNote: "Lazarus was raised from the dead in John 11, not healed near Jericho." },
      { id: "simeon", text: "Simeon", wrongNote: "Simeon blessed Jesus as a child in Luke 2, not in this miracle." }
    ]
  },
  {
    id: "miracle-lazarus",
    concept: "Jesus has power over death",
    difficulty: "easy",
    prompt: "Whom did Jesus call out of the tomb in Bethany?",
    reference: "John 11:38-44",
    explanation: "Jesus called Lazarus from the tomb after he had been dead four days.",
    teachingPoint: "Jesus brings life where everyone else sees final loss.",
    choices: [
      { id: "lazarus", text: "Lazarus", correct: true },
      { id: "jairus-daughter", text: "Jairus's daughter", wrongNote: "Jesus raised Jairus's daughter in another story, but Bethany was Lazarus." },
      { id: "stephen", text: "Stephen", wrongNote: "Stephen died in Acts 7, after Jesus' earthly ministry." },
      { id: "tabitha", text: "Tabitha", wrongNote: "Peter prayed for Tabitha in Acts 9; Jesus called Lazarus from this tomb." }
    ]
  },
  {
    id: "miracle-ten-lepers",
    concept: "Gratitude recognizes mercy",
    difficulty: "medium",
    prompt: "How many healed lepers returned to thank Jesus?",
    reference: "Luke 17:11-19",
    explanation: "Jesus healed ten lepers, but one returned to praise God and thank Him.",
    teachingPoint: "Receiving mercy should turn into gratitude.",
    choices: [
      { id: "one", text: "One", correct: true },
      { id: "three", text: "Three", wrongNote: "More than one could have returned, but Luke tells us only one did." },
      { id: "seven", text: "Seven", wrongNote: "Seven is a familiar Bible number, but not the number who returned here." },
      { id: "ten", text: "Ten", wrongNote: "Ten were healed, but only one came back to give thanks." }
    ]
  },
  {
    id: "miracle-paralytic-roof",
    concept: "Jesus forgives and heals",
    difficulty: "medium",
    prompt: "How did friends bring a paralyzed man to Jesus when the house was crowded?",
    reference: "Mark 2:1-12",
    explanation: "The man's friends opened the roof and lowered him to Jesus, who forgave and healed him.",
    teachingPoint: "Faith sometimes carries someone else to Jesus.",
    choices: [
      { id: "roof", text: "They lowered him through the roof", correct: true },
      { id: "river", text: "They carried him through a river", wrongNote: "There is no river crossing in this crowded-house story." },
      { id: "tree", text: "They lifted him into a tree", wrongNote: "Zacchaeus climbed a tree, but these friends opened a roof." },
      { id: "gate", text: "They laid him at the temple gate", wrongNote: "A lame man appears at the temple gate in Acts 3, not here." }
    ]
  },
  {
    id: "miracle-centurion",
    concept: "Faith trusts Jesus' authority",
    difficulty: "medium",
    prompt: "Whose servant did Jesus heal after hearing remarkable faith?",
    reference: "Matthew 8:5-13",
    explanation: "A Roman centurion trusted that Jesus could heal with a word, even from a distance.",
    teachingPoint: "Real faith trusts the authority of Jesus' word.",
    choices: [
      { id: "centurion", text: "A Roman centurion's servant", correct: true },
      { id: "pharisee", text: "A Pharisee's servant", wrongNote: "A Pharisee is not the person Matthew names in this healing." },
      { id: "fisherman", text: "A fisherman's servant", wrongNote: "The man who came to Jesus was a centurion, not a fisherman." },
      { id: "king", text: "A king's servant", wrongNote: "The story centers on a centurion's faith, not a royal court." }
    ]
  },
  {
    id: "miracle-woman-touch",
    concept: "Jesus notices hidden faith",
    difficulty: "medium",
    prompt: "What did the suffering woman touch before Jesus healed her?",
    reference: "Mark 5:25-34",
    explanation: "The woman touched Jesus' garment in faith, and Jesus stopped to call her daughter and send her in peace.",
    teachingPoint: "Jesus sees people who feel unseen.",
    choices: [
      { id: "garment", text: "Jesus' garment", correct: true },
      { id: "staff", text: "A prophet's staff", wrongNote: "A staff appears in other Bible scenes, but this woman reached for Jesus' garment." },
      { id: "altar", text: "The temple altar", wrongNote: "This healing happened in a crowd, not at the altar." },
      { id: "water", text: "Water from a pool", wrongNote: "Other healings involve water, but Mark 5 focuses on touching Jesus' garment." }
    ]
  }
];

const paulJourney = [
  {
    id: "paul-damascus-road",
    concept: "Jesus interrupts Saul's opposition",
    difficulty: "easy",
    prompt: "On which road did Saul meet the risen Jesus?",
    reference: "Acts 9:1-9",
    explanation: "Saul was traveling to Damascus when Jesus confronted him and changed the direction of his life.",
    teachingPoint: "Jesus can turn an enemy into a witness.",
    place: "Damascus Road",
    choices: [
      { id: "damascus", text: "The road to Damascus", correct: true },
      { id: "jericho", text: "The Jericho road", wrongNote: "The Jericho road is famous in a parable, but Saul was headed to Damascus." },
      { id: "emmaus", text: "The road to Emmaus", wrongNote: "Two disciples met Jesus on the Emmaus road, not Saul." },
      { id: "bethany", text: "The road to Bethany", wrongNote: "Bethany matters in the Gospels, but Saul's turning point was near Damascus." }
    ]
  },
  {
    id: "paul-ananias",
    concept: "God uses ordinary obedience",
    difficulty: "easy",
    prompt: "Who prayed for Saul in Damascus after his vision?",
    reference: "Acts 9:10-19",
    explanation: "Ananias obeyed God, went to Saul, prayed for him, and welcomed him as a brother.",
    teachingPoint: "One obedient visit can help someone begin again.",
    place: "Damascus",
    choices: [
      { id: "ananias", text: "Ananias", correct: true },
      { id: "barnabas", text: "Barnabas", wrongNote: "Barnabas helped Saul later in Jerusalem, but Ananias came first in Damascus." },
      { id: "silas", text: "Silas", wrongNote: "Silas traveled with Paul later, not in the Damascus conversion scene." },
      { id: "timothy", text: "Timothy", wrongNote: "Timothy became Paul's younger coworker much later." }
    ]
  },
  {
    id: "paul-barnabas-jerusalem",
    concept: "Encouragement opens a door",
    difficulty: "medium",
    prompt: "Who helped the Jerusalem believers receive Saul?",
    reference: "Acts 9:26-28",
    explanation: "Barnabas brought Saul to the apostles and explained how Saul had seen the Lord.",
    teachingPoint: "Encouragers can help rebuild trust.",
    place: "Jerusalem",
    choices: [
      { id: "barnabas", text: "Barnabas", correct: true },
      { id: "stephen", text: "Stephen", wrongNote: "Stephen had already been killed before Saul came to Jerusalem as a believer." },
      { id: "lydia", text: "Lydia", wrongNote: "Lydia appears later in Philippi, not Jerusalem." },
      { id: "apollos", text: "Apollos", wrongNote: "Apollos appears later in Acts, not in Saul's first Jerusalem welcome." }
    ]
  },
  {
    id: "paul-antioch-sent",
    concept: "The church sends workers on mission",
    difficulty: "medium",
    prompt: "From which church were Barnabas and Saul sent out in Acts 13?",
    reference: "Acts 13:1-3",
    explanation: "The church in Antioch worshiped, fasted, prayed, and sent Barnabas and Saul for mission work.",
    teachingPoint: "Mission grows from worshiping communities.",
    place: "Antioch",
    choices: [
      { id: "antioch", text: "Antioch", correct: true },
      { id: "rome", text: "Rome", wrongNote: "Paul eventually reached Rome, but the sending church here was Antioch." },
      { id: "athens", text: "Athens", wrongNote: "Paul preached in Athens later; he was not sent from there." },
      { id: "corinth", text: "Corinth", wrongNote: "Corinth became a ministry stop, not the Acts 13 sending church." }
    ]
  },
  {
    id: "paul-cyprus",
    concept: "The gospel confronts opposition",
    difficulty: "hard",
    prompt: "On which island did Paul confront Elymas the magician?",
    reference: "Acts 13:4-12",
    explanation: "On Cyprus, Elymas opposed the message, and the proconsul saw the Lord's power and believed.",
    teachingPoint: "Opposition does not stop God's word.",
    place: "Cyprus",
    choices: [
      { id: "cyprus", text: "Cyprus", correct: true },
      { id: "malta", text: "Malta", wrongNote: "Malta comes later after Paul's shipwreck on the way to Rome." },
      { id: "crete", text: "Crete", wrongNote: "Crete appears in Paul's voyage, but Elymas was on Cyprus." },
      { id: "patmos", text: "Patmos", wrongNote: "Patmos is connected with Revelation, not this Acts 13 scene." }
    ]
  },
  {
    id: "paul-lystra",
    concept: "Mission can include misunderstanding and hardship",
    difficulty: "hard",
    prompt: "In which city were Paul and Barnabas mistaken for gods?",
    reference: "Acts 14:8-20",
    explanation: "After a healing in Lystra, the crowd tried to honor Paul and Barnabas as gods, and Paul redirected them to the living God.",
    teachingPoint: "Servants of God redirect praise back to God.",
    place: "Lystra",
    choices: [
      { id: "lystra", text: "Lystra", correct: true },
      { id: "philippi", text: "Philippi", wrongNote: "Philippi had Lydia and the jailer, but Lystra had this confused crowd." },
      { id: "athens", text: "Athens", wrongNote: "Athens involved public teaching about the true God, not this mistaken sacrifice." },
      { id: "ephesus", text: "Ephesus", wrongNote: "Ephesus had a major uproar later, but this scene happened in Lystra." }
    ]
  },
  {
    id: "paul-philippi",
    concept: "God opens hearts and prison doors",
    difficulty: "medium",
    prompt: "Which woman listened to Paul's message in Philippi?",
    reference: "Acts 16:11-15",
    explanation: "Lydia listened by the river, the Lord opened her heart, and her home became a place of welcome.",
    teachingPoint: "Open hearts often become open homes.",
    place: "Philippi",
    choices: [
      { id: "lydia", text: "Lydia", correct: true },
      { id: "priscilla", text: "Priscilla", wrongNote: "Priscilla served with Aquila later, but Lydia appears in Philippi." },
      { id: "phoebe", text: "Phoebe", wrongNote: "Phoebe is named in Romans, not in the Philippi river scene." },
      { id: "martha", text: "Martha", wrongNote: "Martha welcomed Jesus in the Gospels, not Paul in Philippi." }
    ]
  },
  {
    id: "paul-athens",
    concept: "Paul connects truth to local questions",
    difficulty: "medium",
    prompt: "Where did Paul speak about the altar to an unknown god?",
    reference: "Acts 17:22-31",
    explanation: "In Athens, Paul used the altar as a starting point to proclaim the true God who made all things.",
    teachingPoint: "Good teaching can begin with what listeners already notice.",
    place: "Athens",
    choices: [
      { id: "athens", text: "Athens", correct: true },
      { id: "corinth", text: "Corinth", wrongNote: "Paul worked in Corinth later, but the unknown god speech was in Athens." },
      { id: "ephesus", text: "Ephesus", wrongNote: "Ephesus had conflict around Artemis, not the unknown god sermon." },
      { id: "rome", text: "Rome", wrongNote: "Rome was Paul's later destination, not the Areopagus setting." }
    ]
  },
  {
    id: "paul-corinth",
    concept: "Paul keeps working and teaching",
    difficulty: "medium",
    prompt: "Which couple worked with Paul as tentmakers in Corinth?",
    reference: "Acts 18:1-4",
    explanation: "Aquila and Priscilla worked with Paul in Corinth, and Paul reasoned in the synagogue each Sabbath.",
    teachingPoint: "Ordinary work and faithful witness can sit side by side.",
    place: "Corinth",
    choices: [
      { id: "aquila-priscilla", text: "Aquila and Priscilla", correct: true },
      { id: "paul-silas", text: "Paul and Silas", wrongNote: "Silas traveled with Paul, but Aquila and Priscilla shared tentmaking work in Corinth." },
      { id: "barnabas-mark", text: "Barnabas and Mark", wrongNote: "Barnabas and Mark went another direction earlier in Acts." },
      { id: "peter-john", text: "Peter and John", wrongNote: "Peter and John ministered together in Acts 3, not as Paul's Corinth coworkers." }
    ]
  },
  {
    id: "paul-ephesus",
    concept: "The gospel changes public life",
    difficulty: "hard",
    prompt: "Which city had an uproar connected with Artemis and silver craftsmen?",
    reference: "Acts 19:23-41",
    explanation: "In Ephesus, Demetrius and other craftsmen feared Paul's message would hurt the Artemis trade.",
    teachingPoint: "The gospel can challenge what a city profits from and praises.",
    place: "Ephesus",
    choices: [
      { id: "ephesus", text: "Ephesus", correct: true },
      { id: "jerusalem", text: "Jerusalem", wrongNote: "Jerusalem had Paul's later arrest, not the Artemis trade riot." },
      { id: "caesarea", text: "Caesarea", wrongNote: "Caesarea was part of Paul's custody path, not this city uproar." },
      { id: "tarsus", text: "Tarsus", wrongNote: "Tarsus was Paul's home city, not the Artemis riot setting." }
    ]
  },
  {
    id: "paul-jerusalem-arrest",
    concept: "Witness continues under pressure",
    difficulty: "hard",
    prompt: "Where was Paul arrested after a temple disturbance?",
    reference: "Acts 21:27-36",
    explanation: "Paul was seized in Jerusalem, but even custody became part of the path toward testifying before rulers.",
    teachingPoint: "Hard turns can still become witness paths.",
    place: "Jerusalem",
    choices: [
      { id: "jerusalem", text: "Jerusalem", correct: true },
      { id: "rome", text: "Rome", wrongNote: "Paul arrived in Rome later, but this arrest happened in Jerusalem." },
      { id: "philippi", text: "Philippi", wrongNote: "Paul was jailed in Philippi earlier, but Acts 21 is Jerusalem." },
      { id: "damascus", text: "Damascus", wrongNote: "Damascus was Saul's conversion city, not this arrest scene." }
    ]
  },
  {
    id: "paul-rome",
    concept: "The witness reaches Rome",
    difficulty: "medium",
    prompt: "Where does Acts end with Paul proclaiming the kingdom of God?",
    reference: "Acts 28:30-31",
    explanation: "Acts closes with Paul in Rome, receiving people and teaching about the Lord Jesus Christ.",
    teachingPoint: "God's mission keeps moving even through chains.",
    place: "Rome",
    choices: [
      { id: "rome", text: "Rome", correct: true },
      { id: "antioch", text: "Antioch", wrongNote: "Antioch sent Paul out, but Acts ends with Paul in Rome." },
      { id: "malta", text: "Malta", wrongNote: "Malta was a shipwreck stop before Rome." },
      { id: "caesarea", text: "Caesarea", wrongNote: "Paul was held in Caesarea before appealing to Caesar, but Acts ends in Rome." }
    ]
  }
];

const parablesQuiz = [
  {
    id: "parable-good-samaritan-neighbor",
    concept: "Neighbor love acts with mercy",
    difficulty: "easy",
    prompt: "In the Good Samaritan, who helped the wounded man?",
    reference: "Luke 10:30-37",
    explanation: "A Samaritan stopped, cared for the man, and paid for his recovery when others passed by.",
    teachingPoint: "A neighbor is the person who shows mercy.",
    choices: [
      { id: "samaritan", text: "A Samaritan", correct: true },
      { id: "priest", text: "A priest", wrongNote: "The priest saw the man and passed by on the other side." },
      { id: "levite", text: "A Levite", wrongNote: "The Levite also passed by instead of stopping to help." },
      { id: "innkeeper", text: "The innkeeper", wrongNote: "The innkeeper cared for him later, but the Samaritan stopped first." }
    ]
  },
  {
    id: "parable-lost-sheep",
    concept: "God seeks the lost",
    difficulty: "easy",
    prompt: "In the Lost Sheep, how many sheep did the shepherd go looking for?",
    reference: "Luke 15:3-7",
    explanation: "The shepherd left the ninety-nine and searched for the one that was lost.",
    teachingPoint: "God cares about each person, not just the crowd.",
    choices: [
      { id: "one", text: "One", correct: true },
      { id: "seven", text: "Seven", wrongNote: "Seven is a familiar Bible number, but this parable centers on one lost sheep." },
      { id: "twelve", text: "Twelve", wrongNote: "Twelve matters elsewhere, but the shepherd searched for one sheep." },
      { id: "ninety-nine", text: "Ninety-nine", wrongNote: "The ninety-nine were safe; the one sheep was missing." }
    ]
  },
  {
    id: "parable-prodigal-son",
    concept: "The father welcomes the repentant son",
    difficulty: "easy",
    prompt: "In the Prodigal Son, who ran to welcome the younger son home?",
    reference: "Luke 15:20",
    explanation: "The father saw his son while he was still far away, ran to him, and welcomed him with compassion.",
    teachingPoint: "Repentance meets a Father who is ready to restore.",
    choices: [
      { id: "father", text: "His father", correct: true },
      { id: "brother", text: "His older brother", wrongNote: "The older brother struggled with the celebration, but the father ran to welcome him." },
      { id: "servant", text: "A servant", wrongNote: "Servants helped prepare the celebration, but the father welcomed the son." },
      { id: "neighbor", text: "A neighbor", wrongNote: "The story centers on the father and sons, not a neighbor." }
    ]
  },
  {
    id: "parable-sower-good-soil",
    concept: "Good soil receives and bears fruit",
    difficulty: "medium",
    prompt: "In the Sower, which soil produced a crop?",
    reference: "Matthew 13:3-9",
    explanation: "The seed on good soil produced fruit, unlike the path, rocky ground, and thorns.",
    teachingPoint: "A receptive heart lets God's word bear fruit.",
    choices: [
      { id: "good-soil", text: "Good soil", correct: true },
      { id: "path", text: "The path", wrongNote: "Birds ate the seed on the path before it could grow." },
      { id: "rocky", text: "Rocky ground", wrongNote: "The rocky ground grew quickly but withered because it had no root." },
      { id: "thorns", text: "Thorny ground", wrongNote: "The thorns choked the plants before they became fruitful." }
    ]
  },
  {
    id: "parable-wise-foolish-builders",
    concept: "Obedience builds on a firm foundation",
    difficulty: "easy",
    prompt: "In Jesus' parable, which builder's house stood through the storm?",
    reference: "Matthew 7:24-27",
    explanation: "The wise man built on rock, picturing someone who hears Jesus' words and does them.",
    teachingPoint: "Hearing Jesus should turn into obedient action.",
    choices: [
      { id: "rock", text: "The builder on the rock", correct: true },
      { id: "sand", text: "The builder on the sand", wrongNote: "The house on sand fell when the storm came." },
      { id: "hill", text: "The builder on the hill", wrongNote: "Jesus contrasts rock and sand, not hill and valley." },
      { id: "river", text: "The builder near the river", wrongNote: "The point is the foundation, not the distance from water." }
    ]
  },
  {
    id: "parable-mustard-seed",
    concept: "God's kingdom grows from small beginnings",
    difficulty: "medium",
    prompt: "What tiny seed did Jesus use to picture kingdom growth?",
    reference: "Matthew 13:31-32",
    explanation: "Jesus compared the kingdom to a mustard seed that starts small and grows large.",
    teachingPoint: "Small beginnings can carry kingdom-sized growth.",
    choices: [
      { id: "mustard", text: "Mustard seed", correct: true },
      { id: "wheat", text: "Wheat seed", wrongNote: "Wheat appears in other parables, but kingdom growth here is a mustard seed." },
      { id: "fig", text: "Fig seed", wrongNote: "Fig trees appear elsewhere, but Jesus names a mustard seed in this parable." },
      { id: "olive", text: "Olive seed", wrongNote: "Olives matter in Bible imagery, but not in this kingdom parable." }
    ]
  },
  {
    id: "parable-talents",
    concept: "Faithful servants use what is entrusted",
    difficulty: "medium",
    prompt: "In the Talents, what did the faithful servants do with what they received?",
    reference: "Matthew 25:14-30",
    explanation: "The faithful servants put their master's money to work instead of burying it.",
    teachingPoint: "Faithfulness uses what God entrusts instead of hiding it.",
    choices: [
      { id: "worked", text: "They put it to work", correct: true },
      { id: "buried", text: "They buried all of it", wrongNote: "The fearful servant buried his talent; the faithful servants used theirs." },
      { id: "gave-away", text: "They gave it all away immediately", wrongNote: "The story emphasizes responsible use, not simply handing it off." },
      { id: "ignored", text: "They ignored it", wrongNote: "The faithful servants acted with what they received." }
    ]
  },
  {
    id: "parable-pharisee-tax-collector",
    concept: "Humility matters before God",
    difficulty: "medium",
    prompt: "In Jesus' temple parable, who went home justified?",
    reference: "Luke 18:9-14",
    explanation: "The tax collector asked God for mercy, while the Pharisee trusted in himself.",
    teachingPoint: "God receives humble repentance, not spiritual bragging.",
    choices: [
      { id: "tax-collector", text: "The tax collector", correct: true },
      { id: "pharisee", text: "The Pharisee", wrongNote: "The Pharisee prayed proudly about himself, but Jesus commended the humble man." },
      { id: "priest", text: "The priest", wrongNote: "A priest is not one of the two people Jesus names in this parable." },
      { id: "disciple", text: "The disciple", wrongNote: "Jesus tells this to listeners, but the parable contrasts a Pharisee and tax collector." }
    ]
  },
  {
    id: "parable-lost-coin",
    concept: "Joy follows finding what was lost",
    difficulty: "easy",
    prompt: "In the Lost Coin, what did the woman do after finding her coin?",
    reference: "Luke 15:8-10",
    explanation: "The woman searched carefully until she found the coin, then called friends and neighbors to rejoice.",
    teachingPoint: "Heaven rejoices when the lost are found.",
    choices: [
      { id: "rejoiced", text: "She called others to rejoice", correct: true },
      { id: "hid-it", text: "She hid it again", wrongNote: "The point is joy over finding what was lost, not hiding it." },
      { id: "spent-it", text: "She spent it at the market", wrongNote: "Jesus focuses on searching and rejoicing, not shopping." },
      { id: "ignored-it", text: "She ignored it", wrongNote: "She searched carefully because the coin mattered." }
    ]
  },
  {
    id: "parable-unforgiving-servant",
    concept: "Forgiven people should forgive",
    difficulty: "medium",
    prompt: "In the Unforgiving Servant, what did the servant refuse to do?",
    reference: "Matthew 18:21-35",
    explanation: "The servant was forgiven a huge debt, but he refused to forgive another servant who owed much less.",
    teachingPoint: "Receiving mercy should make us merciful.",
    choices: [
      { id: "forgive", text: "Forgive a smaller debt", correct: true },
      { id: "work", text: "Work in the field", wrongNote: "The issue is forgiveness of debt, not farm labor." },
      { id: "pray", text: "Pray in the temple", wrongNote: "The parable is about mercy and debt, not public prayer." },
      { id: "travel", text: "Travel to another city", wrongNote: "Travel is not the conflict in this parable." }
    ]
  },
  {
    id: "parable-workers-vineyard",
    concept: "God's generosity can surprise us",
    difficulty: "medium",
    prompt: "In the Workers in the Vineyard, why did early workers complain?",
    reference: "Matthew 20:1-16",
    explanation: "The early workers complained because those hired late received the same pay.",
    teachingPoint: "Grace can feel unfair when we forget the owner's generosity.",
    choices: [
      { id: "same-pay", text: "Late workers received the same pay", correct: true },
      { id: "no-work", text: "No one got paid at all", wrongNote: "Everyone in the story was paid; the complaint was about equal pay." },
      { id: "bad-weather", text: "The weather ruined the vineyard", wrongNote: "Weather is not the reason for their complaint." },
      { id: "missing-owner", text: "The owner disappeared", wrongNote: "The owner is present and explains his generosity." }
    ]
  },
  {
    id: "parable-ten-virgins",
    concept: "Readiness matters",
    difficulty: "medium",
    prompt: "In the Ten Virgins, what did the wise virgins bring extra?",
    reference: "Matthew 25:1-13",
    explanation: "The wise virgins brought oil for their lamps while waiting for the bridegroom.",
    teachingPoint: "Jesus calls His followers to be ready, not careless.",
    choices: [
      { id: "oil", text: "Oil for their lamps", correct: true },
      { id: "bread", text: "Bread for a meal", wrongNote: "The story centers on lamps and oil, not bread." },
      { id: "coins", text: "Coins for the poor", wrongNote: "Generosity matters elsewhere, but this parable is about readiness." },
      { id: "scrolls", text: "Scrolls to read", wrongNote: "Scrolls are not the object that separates wise and foolish virgins." }
    ]
  },
  {
    id: "parable-rich-fool",
    concept: "Life is more than stored possessions",
    difficulty: "easy",
    prompt: "In the Rich Fool, what did the man build bigger to store his crops?",
    reference: "Luke 12:16-21",
    explanation: "The rich man planned bigger barns but was not rich toward God.",
    teachingPoint: "Stored stuff cannot secure a soul.",
    choices: [
      { id: "barns", text: "Barns", correct: true },
      { id: "walls", text: "City walls", wrongNote: "The man planned storage barns, not city defenses." },
      { id: "boats", text: "Fishing boats", wrongNote: "The parable is about crops and barns, not fishing." },
      { id: "towers", text: "Temple towers", wrongNote: "The rich man's issue was hoarding crops, not temple construction." }
    ]
  },
  {
    id: "parable-two-sons",
    concept: "Obedience matters more than talk",
    difficulty: "medium",
    prompt: "In the Two Sons, which son did the father's will?",
    reference: "Matthew 21:28-32",
    explanation: "The son who first refused but later went to work did the father's will.",
    teachingPoint: "Repentant obedience matters more than impressive words.",
    choices: [
      { id: "changed-mind", text: "The son who changed his mind and went", correct: true },
      { id: "said-yes", text: "The son who said yes but did not go", wrongNote: "Saying yes did not matter when he failed to obey." },
      { id: "both", text: "Both sons equally", wrongNote: "Jesus asks which one did the will, and the answer is the one who went." },
      { id: "neither", text: "Neither son", wrongNote: "One son did obey after changing his mind." }
    ]
  },
  {
    id: "parable-wheat-weeds",
    concept: "Final judgment belongs to God",
    difficulty: "hard",
    prompt: "In the Wheat and Weeds, who sowed weeds among the wheat?",
    reference: "Matthew 13:24-30",
    explanation: "An enemy sowed weeds while people slept, and the master waited until harvest to separate them.",
    teachingPoint: "God knows how and when to judge rightly.",
    choices: [
      { id: "enemy", text: "An enemy", correct: true },
      { id: "servants", text: "The servants", wrongNote: "The servants noticed the weeds, but they did not sow them." },
      { id: "farmer", text: "The farmer", wrongNote: "The farmer sowed good seed; an enemy sowed weeds." },
      { id: "birds", text: "Birds", wrongNote: "Birds appear in the Sower, but the weeds came from an enemy." }
    ]
  },
  {
    id: "parable-hidden-treasure",
    concept: "The kingdom is worth everything",
    difficulty: "easy",
    prompt: "In the Hidden Treasure, what did the man sell to buy the field?",
    reference: "Matthew 13:44",
    explanation: "The man joyfully sold all he had to buy the field with hidden treasure.",
    teachingPoint: "God's kingdom is worth more than everything else we hold.",
    choices: [
      { id: "all", text: "All he had", correct: true },
      { id: "half", text: "Half his goods", wrongNote: "Jesus says the man sold all he had." },
      { id: "nothing", text: "Nothing", wrongNote: "The man acted decisively because the treasure was worth it." },
      { id: "only-tools", text: "Only his tools", wrongNote: "The point is total value, not selling a few tools." }
    ]
  },
  {
    id: "parable-pearl",
    concept: "The kingdom is the treasure of highest value",
    difficulty: "easy",
    prompt: "In the Pearl of Great Value, what did the merchant buy?",
    reference: "Matthew 13:45-46",
    explanation: "The merchant found one pearl of great value and sold everything to buy it.",
    teachingPoint: "The kingdom is not one more trinket; it is supreme treasure.",
    choices: [
      { id: "pearl", text: "One pearl of great value", correct: true },
      { id: "field", text: "A wheat field", wrongNote: "A field appears in the Hidden Treasure parable, not this pearl parable." },
      { id: "net", text: "A fishing net", wrongNote: "The net is a separate kingdom parable." },
      { id: "coin", text: "A lost coin", wrongNote: "The lost coin appears in Luke 15, not the merchant's search." }
    ]
  },
  {
    id: "parable-persistent-widow",
    concept: "Persistent prayer matters",
    difficulty: "medium",
    prompt: "In the Persistent Widow, what did the widow keep asking for?",
    reference: "Luke 18:1-8",
    explanation: "The widow kept asking the judge for justice against her adversary.",
    teachingPoint: "Jesus encourages prayer that does not give up.",
    choices: [
      { id: "justice", text: "Justice", correct: true },
      { id: "food", text: "Food for a feast", wrongNote: "The widow's request was for justice, not a meal." },
      { id: "oil", text: "Oil for her lamp", wrongNote: "Lamp oil belongs to the Ten Virgins parable." },
      { id: "field", text: "A field to buy", wrongNote: "Fields appear in other parables, but this widow seeks justice." }
    ]
  },
  {
    id: "parable-great-banquet",
    concept: "God's invitation should not be refused",
    difficulty: "medium",
    prompt: "In the Great Banquet, what did the first invited guests do?",
    reference: "Luke 14:15-24",
    explanation: "The first invited guests made excuses, so the host invited others to fill the house.",
    teachingPoint: "Refusing God's invitation is more serious than it first sounds.",
    choices: [
      { id: "excuses", text: "They made excuses", correct: true },
      { id: "arrived", text: "They arrived early", wrongNote: "They did the opposite: they refused the invitation with excuses." },
      { id: "paid", text: "They paid for the feast", wrongNote: "The guests are invited; payment is not the issue." },
      { id: "cooked", text: "They cooked the meal", wrongNote: "The host prepares the banquet; the issue is refusal." }
    ]
  },
  {
    id: "parable-net",
    concept: "The kingdom brings final sorting",
    difficulty: "hard",
    prompt: "In the Parable of the Net, what was separated after the catch?",
    reference: "Matthew 13:47-50",
    explanation: "The net gathered fish of every kind, and the good were separated from the bad.",
    teachingPoint: "Jesus teaches that final judgment will separate what now seems mixed together.",
    choices: [
      { id: "fish", text: "Good fish from bad fish", correct: true },
      { id: "sheep", text: "Lost sheep from found sheep", wrongNote: "Sheep belong to another parable; this one uses fish in a net." },
      { id: "coins", text: "Silver coins from gold coins", wrongNote: "Coins appear in another parable, not the net." },
      { id: "seeds", text: "Seeds from stones", wrongNote: "Seeds and soil belong to the Sower, not the net." }
    ]
  }
];

const bookOrderChallenge = [
  {
    id: "book-order-matthew-mark",
    concept: "The New Testament opens with the Gospels",
    difficulty: "easy",
    prompt: "Which New Testament book comes immediately after Matthew?",
    reference: "Matthew 1:1",
    explanation: "The New Testament begins Matthew, Mark, Luke, and John.",
    teachingPoint: "The four Gospels introduce Jesus' life, death, and resurrection.",
    choices: [
      { id: "mark", text: "Mark", correct: true },
      { id: "luke", text: "Luke", wrongNote: "Luke comes after Mark, not immediately after Matthew." },
      { id: "john", text: "John", wrongNote: "John is the fourth Gospel, after Matthew, Mark, and Luke." },
      { id: "acts", text: "Acts", wrongNote: "Acts comes after all four Gospels." }
    ]
  },
  {
    id: "book-order-luke-john",
    concept: "John completes the Gospel group",
    difficulty: "easy",
    prompt: "Which book comes immediately after Luke?",
    reference: "Luke 1:1-4",
    explanation: "John follows Luke and is the fourth Gospel before Acts begins.",
    teachingPoint: "Knowing the order helps people find stories faster.",
    choices: [
      { id: "john", text: "John", correct: true },
      { id: "acts", text: "Acts", wrongNote: "Acts comes after John, not directly after Luke." },
      { id: "romans", text: "Romans", wrongNote: "Romans comes after Acts, later in the New Testament." },
      { id: "mark", text: "Mark", wrongNote: "Mark comes before Luke." }
    ]
  },
  {
    id: "book-order-john-acts",
    concept: "Acts follows the Gospels",
    difficulty: "easy",
    prompt: "Which book comes immediately after John?",
    reference: "John 21:24-25",
    explanation: "Acts follows John and tells how the witness about Jesus spread after the resurrection.",
    teachingPoint: "Acts shows the mission moving out from Jerusalem.",
    choices: [
      { id: "acts", text: "Acts", correct: true },
      { id: "romans", text: "Romans", wrongNote: "Romans comes after Acts, not directly after John." },
      { id: "hebrews", text: "Hebrews", wrongNote: "Hebrews is later among the letters." },
      { id: "revelation", text: "Revelation", wrongNote: "Revelation is the final New Testament book." }
    ]
  },
  {
    id: "book-order-acts-romans",
    concept: "Romans begins Paul's letters in the New Testament order",
    difficulty: "easy",
    prompt: "Which book comes immediately after Acts?",
    reference: "Acts 28:30-31",
    explanation: "Romans follows Acts in the New Testament order and begins the major letter section.",
    teachingPoint: "After Acts, the New Testament moves into letters to churches and believers.",
    choices: [
      { id: "romans", text: "Romans", correct: true },
      { id: "1-corinthians", text: "1 Corinthians", wrongNote: "1 Corinthians comes after Romans." },
      { id: "galatians", text: "Galatians", wrongNote: "Galatians comes after 2 Corinthians." },
      { id: "hebrews", text: "Hebrews", wrongNote: "Hebrews comes after Paul's letters in the usual order." }
    ]
  },
  {
    id: "book-order-romans-corinthians",
    concept: "The Corinthian letters follow Romans",
    difficulty: "medium",
    prompt: "Which book comes immediately after Romans?",
    reference: "Romans 1:7",
    explanation: "1 Corinthians follows Romans, then 2 Corinthians comes after it.",
    teachingPoint: "The letters are grouped in a stable order that can be practiced.",
    choices: [
      { id: "1-corinthians", text: "1 Corinthians", correct: true },
      { id: "2-corinthians", text: "2 Corinthians", wrongNote: "2 Corinthians follows 1 Corinthians, not Romans directly." },
      { id: "galatians", text: "Galatians", wrongNote: "Galatians comes after both Corinthian letters." },
      { id: "ephesians", text: "Ephesians", wrongNote: "Ephesians comes after Galatians." }
    ]
  },
  {
    id: "book-order-galatians-ephesians",
    concept: "Paul's church letters continue after Galatians",
    difficulty: "medium",
    prompt: "Which book comes immediately after Galatians?",
    reference: "Galatians 1:2",
    explanation: "Ephesians follows Galatians in the New Testament letter order.",
    teachingPoint: "Practice turns the book list into a map instead of a blur.",
    choices: [
      { id: "ephesians", text: "Ephesians", correct: true },
      { id: "philippians", text: "Philippians", wrongNote: "Philippians comes after Ephesians." },
      { id: "colossians", text: "Colossians", wrongNote: "Colossians comes after Philippians." },
      { id: "romans", text: "Romans", wrongNote: "Romans comes earlier, before the Corinthian letters." }
    ]
  },
  {
    id: "book-order-timothy-titus",
    concept: "The pastoral letters sit near the end of Paul's letters",
    difficulty: "medium",
    prompt: "Which book comes immediately after 2 Timothy?",
    reference: "2 Timothy 1:1-2",
    explanation: "Titus follows 2 Timothy, then Philemon comes after Titus.",
    teachingPoint: "The shorter letters still have a clear place in the order.",
    choices: [
      { id: "titus", text: "Titus", correct: true },
      { id: "philemon", text: "Philemon", wrongNote: "Philemon comes after Titus." },
      { id: "hebrews", text: "Hebrews", wrongNote: "Hebrews comes after Philemon." },
      { id: "1-timothy", text: "1 Timothy", wrongNote: "1 Timothy comes before 2 Timothy." }
    ]
  },
  {
    id: "book-order-jude-revelation",
    concept: "Revelation closes the New Testament",
    difficulty: "easy",
    prompt: "Which book comes immediately after Jude?",
    reference: "Jude 1:1",
    explanation: "Revelation follows Jude and closes the New Testament with hope and judgment.",
    teachingPoint: "The New Testament ends with God's final victory and new creation.",
    choices: [
      { id: "revelation", text: "Revelation", correct: true },
      { id: "3-john", text: "3 John", wrongNote: "3 John comes before Jude." },
      { id: "hebrews", text: "Hebrews", wrongNote: "Hebrews comes much earlier than Jude." },
      { id: "acts", text: "Acts", wrongNote: "Acts comes near the beginning, after the Gospels." }
    ]
  }
];

const characterGuessWho = [
  {
    id: "character-ruth",
    concept: "Ruth shows loyal love",
    difficulty: "easy",
    prompt: "I stayed with Naomi and later became part of David's family line. Who am I?",
    reference: "Ruth 1:16-17",
    explanation: "Ruth chose loyalty to Naomi and to Naomi's God, and her story becomes part of the family line leading to David.",
    teachingPoint: "Faithful love can matter far beyond one household.",
    choices: [
      { id: "ruth", text: "Ruth", correct: true },
      { id: "esther", text: "Esther", wrongNote: "Esther showed courage in Persia, but Ruth stayed with Naomi." },
      { id: "rahab", text: "Rahab", wrongNote: "Rahab helped Israelite spies in Jericho, not Naomi." },
      { id: "miriam", text: "Miriam", wrongNote: "Miriam was Moses' sister, not Naomi's daughter-in-law." }
    ]
  },
  {
    id: "character-esther",
    concept: "Courage serves others at personal risk",
    difficulty: "easy",
    prompt: "I became queen and risked approaching the king to help my people. Who am I?",
    reference: "Esther 4:14-16",
    explanation: "Esther listened to Mordecai and acted courageously when her people were threatened.",
    teachingPoint: "God can place people where courage is needed.",
    choices: [
      { id: "esther", text: "Esther", correct: true },
      { id: "deborah", text: "Deborah", wrongNote: "Deborah judged Israel, but Esther became queen in Persia." },
      { id: "abigail", text: "Abigail", wrongNote: "Abigail acted wisely with David, but Esther approached the king." },
      { id: "mary", text: "Mary", wrongNote: "Mary obeyed God in Luke 1, but Esther's story is in Persia." }
    ]
  },
  {
    id: "character-daniel",
    concept: "Faithfulness continues under pressure",
    difficulty: "easy",
    prompt: "I kept praying even when it meant being thrown into a lions' den. Who am I?",
    reference: "Daniel 6:10-23",
    explanation: "Daniel continued praying to God, and God preserved him in the lions' den.",
    teachingPoint: "Faithfulness can stay steady when pressure rises.",
    choices: [
      { id: "daniel", text: "Daniel", correct: true },
      { id: "samson", text: "Samson", wrongNote: "Samson faced a lion earlier, but Daniel was thrown into the lions' den." },
      { id: "joseph", text: "Joseph", wrongNote: "Joseph was imprisoned in Egypt, but Daniel faced the lions." },
      { id: "elijah", text: "Elijah", wrongNote: "Elijah confronted false prophets, but Daniel is the lions' den story." }
    ]
  },
  {
    id: "character-joseph",
    concept: "God works through betrayal and hardship",
    difficulty: "medium",
    prompt: "My brothers sold me, but God used my life to preserve many people. Who am I?",
    reference: "Genesis 50:20",
    explanation: "Joseph suffered betrayal and prison, yet God raised him up in Egypt to save many lives during famine.",
    teachingPoint: "God can work good even through evil choices.",
    choices: [
      { id: "joseph", text: "Joseph", correct: true },
      { id: "moses", text: "Moses", wrongNote: "Moses led Israel out of Egypt, but Joseph was sold by his brothers." },
      { id: "jacob", text: "Jacob", wrongNote: "Jacob was Joseph's father, not the brother sold into Egypt." },
      { id: "benjamin", text: "Benjamin", wrongNote: "Benjamin was Joseph's younger brother, not the one sold." }
    ]
  },
  {
    id: "character-moses",
    concept: "God calls reluctant servants",
    difficulty: "easy",
    prompt: "God called me from a burning bush to lead Israel out of Egypt. Who am I?",
    reference: "Exodus 3:1-12",
    explanation: "God met Moses at the burning bush and sent him to Pharaoh.",
    teachingPoint: "God's call rests on God's presence, not our confidence.",
    choices: [
      { id: "moses", text: "Moses", correct: true },
      { id: "aaron", text: "Aaron", wrongNote: "Aaron helped Moses speak, but God called Moses at the bush." },
      { id: "joshua", text: "Joshua", wrongNote: "Joshua led after Moses, but the burning bush belongs to Moses." },
      { id: "gideon", text: "Gideon", wrongNote: "Gideon was called later in Judges, not at the burning bush." }
    ]
  },
  {
    id: "character-deborah",
    concept: "God gives wisdom and courage to lead",
    difficulty: "medium",
    prompt: "I judged Israel and helped Barak face Sisera. Who am I?",
    reference: "Judges 4:4-10",
    explanation: "Deborah was a prophetess and judge who called Barak to obey God's command.",
    teachingPoint: "Courageous leadership can strengthen others to obey.",
    choices: [
      { id: "deborah", text: "Deborah", correct: true },
      { id: "jael", text: "Jael", wrongNote: "Jael defeated Sisera, but Deborah judged Israel and called Barak." },
      { id: "hannah", text: "Hannah", wrongNote: "Hannah prayed for Samuel, not for Barak's battle." },
      { id: "ruth", text: "Ruth", wrongNote: "Ruth showed loyalty, but Deborah led during Judges." }
    ]
  },
  {
    id: "character-nehemiah",
    concept: "Prayer and action rebuild what is broken",
    difficulty: "medium",
    prompt: "I prayed, asked the king for help, and rebuilt Jerusalem's wall. Who am I?",
    reference: "Nehemiah 2:1-8",
    explanation: "Nehemiah grieved over Jerusalem, prayed, and then led the rebuilding work with courage.",
    teachingPoint: "Prayer can lead into practical rebuilding.",
    choices: [
      { id: "nehemiah", text: "Nehemiah", correct: true },
      { id: "ezra", text: "Ezra", wrongNote: "Ezra taught the Law, but Nehemiah led the wall rebuilding." },
      { id: "zerubbabel", text: "Zerubbabel", wrongNote: "Zerubbabel helped rebuild the temple, not the wall in this story." },
      { id: "jeremiah", text: "Jeremiah", wrongNote: "Jeremiah warned Jerusalem before exile, but Nehemiah returned to rebuild." }
    ]
  },
  {
    id: "character-mary-magdalene",
    concept: "The risen Jesus sends witnesses",
    difficulty: "medium",
    prompt: "I saw the risen Jesus near the tomb and told the disciples. Who am I?",
    reference: "John 20:11-18",
    explanation: "Mary Magdalene met Jesus after the resurrection and announced that she had seen the Lord.",
    teachingPoint: "The resurrection turns grief into witness.",
    choices: [
      { id: "mary-magdalene", text: "Mary Magdalene", correct: true },
      { id: "mary-mother", text: "Mary the mother of Jesus", wrongNote: "Mary the mother of Jesus was at the cross, but Mary Magdalene met Jesus near the tomb here." },
      { id: "martha", text: "Martha", wrongNote: "Martha confessed faith before Lazarus was raised, but Mary Magdalene saw Jesus at the tomb." },
      { id: "joanna", text: "Joanna", wrongNote: "Joanna is named among women at the tomb in Luke, but John highlights Mary Magdalene here." }
    ]
  }
];

const verseContextChallenge = [
  {
    id: "context-john-316",
    concept: "God's love is shown in sending the Son",
    difficulty: "easy",
    prompt: "What is the context of 'For God so loved the world'?",
    reference: "John 3:16",
    explanation: "Jesus spoke to Nicodemus about new birth, belief, and the Son being given for the world.",
    teachingPoint: "A famous verse gets richer when we know the conversation around it.",
    choices: [
      { id: "nicodemus", text: "Jesus talking with Nicodemus", correct: true },
      { id: "sermon-mount", text: "The Sermon on the Mount", wrongNote: "The Sermon on the Mount is Matthew 5-7, not John 3." },
      { id: "last-supper", text: "The Last Supper", wrongNote: "The Last Supper comes much later in John's Gospel." },
      { id: "empty-tomb", text: "The empty tomb", wrongNote: "John 3 happens during Jesus' ministry, before the resurrection scenes." }
    ]
  },
  {
    id: "context-romans-828",
    concept: "Hope rests in God's purpose",
    difficulty: "medium",
    prompt: "What chapter context surrounds 'all things work together for good'?",
    reference: "Romans 8:28",
    explanation: "Romans 8 speaks about life in the Spirit, suffering, hope, and God's unbreakable love.",
    teachingPoint: "This promise is not shallow optimism; it sits inside suffering and hope.",
    choices: [
      { id: "suffering-hope", text: "Suffering, hope, and life in the Spirit", correct: true },
      { id: "creation-week", text: "The creation week", wrongNote: "Creation is mentioned in Romans 8, but this is not Genesis 1." },
      { id: "food-laws", text: "Food laws and clean animals", wrongNote: "Romans 8 is not about Old Testament food laws." },
      { id: "temple-building", text: "Building the temple", wrongNote: "Romans 8 is a letter about Spirit, hope, and God's love." }
    ]
  },
  {
    id: "context-philippians-413",
    concept: "Strength in Christ includes contentment",
    difficulty: "medium",
    prompt: "What is the context of 'I can do all things through Christ'?",
    reference: "Philippians 4:11-13",
    explanation: "Paul is talking about learning contentment in plenty and in need because Christ strengthens him.",
    teachingPoint: "Christ's strength helps believers endure every season faithfully.",
    choices: [
      { id: "contentment", text: "Paul learning contentment in every situation", correct: true },
      { id: "sports-victory", text: "Winning every contest", wrongNote: "The verse is often quoted that way, but Paul's context is contentment." },
      { id: "building-project", text: "Finishing a building project", wrongNote: "Philippians 4 is not about construction work." },
      { id: "battle-plan", text: "A military battle plan", wrongNote: "Paul is writing about need, plenty, and Christ's strength." }
    ]
  },
  {
    id: "context-jeremiah-2911",
    concept: "Hope is spoken to exiles",
    difficulty: "medium",
    prompt: "What is the setting of 'plans to give you a future and a hope'?",
    reference: "Jeremiah 29:10-14",
    explanation: "Jeremiah wrote to exiles in Babylon, telling them God would bring them back after the appointed time.",
    teachingPoint: "God's hope can be spoken into a long, hard waiting season.",
    choices: [
      { id: "exile-letter", text: "A letter to exiles in Babylon", correct: true },
      { id: "david-coronation", text: "David being crowned king", wrongNote: "Jeremiah 29 is much later than David's coronation." },
      { id: "temple-dedication", text: "Solomon dedicating the temple", wrongNote: "Jeremiah wrote after Solomon's day, as exile was the issue." },
      { id: "red-sea", text: "Israel at the Red Sea", wrongNote: "The Red Sea story is in Exodus, not Jeremiah." }
    ]
  },
  {
    id: "context-micah-68",
    concept: "God wants justice, mercy, and humble walking",
    difficulty: "easy",
    prompt: "What does Micah say the Lord requires?",
    reference: "Micah 6:8",
    explanation: "Micah summarizes faithful living as doing justice, loving kindness, and walking humbly with God.",
    teachingPoint: "God cares about worship that becomes a just and humble life.",
    choices: [
      { id: "justice-mercy-humility", text: "Justice, mercy, and humble walking", correct: true },
      { id: "wealth-fame", text: "Wealth, fame, and comfort", wrongNote: "Micah points away from showy religion and toward humble obedience." },
      { id: "speed-power", text: "Speed, power, and victory", wrongNote: "Micah 6:8 is about faithful character, not performance." },
      { id: "ritual-only", text: "Ritual only", wrongNote: "The context challenges empty offerings without faithful living." }
    ]
  },
  {
    id: "context-psalm-4610",
    concept: "God is exalted among the nations",
    difficulty: "medium",
    prompt: "What is the context of 'Be still, and know that I am God'?",
    reference: "Psalm 46:10",
    explanation: "Psalm 46 celebrates God as refuge and ruler over shaking nations and troubled earth.",
    teachingPoint: "Stillness here means recognizing God's rule when the world feels unstable.",
    choices: [
      { id: "god-refuge", text: "God as refuge over shaking nations", correct: true },
      { id: "quiet-morning", text: "A quiet morning routine", wrongNote: "Personal quiet can be good, but Psalm 46 is bigger than a calm morning." },
      { id: "temple-repair", text: "Repairing the temple", wrongNote: "Psalm 46 is a song about God's refuge and rule, not temple repairs." },
      { id: "wilderness-food", text: "Receiving manna in the wilderness", wrongNote: "Manna is in Exodus; Psalm 46 speaks about God over nations." }
    ]
  },
  {
    id: "context-matthew-633",
    concept: "Kingdom priority answers anxious striving",
    difficulty: "easy",
    prompt: "What is Jesus talking about before 'seek first the kingdom'?",
    reference: "Matthew 6:25-34",
    explanation: "Jesus teaches His followers not to be anxious about food, drink, and clothing, but to seek God's kingdom first.",
    teachingPoint: "Kingdom priority pushes anxiety out of the driver's seat.",
    choices: [
      { id: "anxiety", text: "Anxiety about daily needs", correct: true },
      { id: "boat-storm", text: "A storm on the sea", wrongNote: "Jesus calms a storm elsewhere, but Matthew 6 is about worry and provision." },
      { id: "tax-collector", text: "A tax collector's repentance", wrongNote: "Matthew 6 is part of the Sermon on the Mount, not Zacchaeus's story." },
      { id: "paul-prison", text: "Paul in prison", wrongNote: "Matthew 6 records Jesus' teaching before Paul's ministry." }
    ]
  },
  {
    id: "context-ephesians-210",
    concept: "Good works flow from grace",
    difficulty: "medium",
    prompt: "What comes right before 'created in Christ Jesus for good works'?",
    reference: "Ephesians 2:8-10",
    explanation: "Paul says salvation is by grace through faith, not a result of works, and then says believers are created for good works.",
    teachingPoint: "Good works are fruit of grace, not the price of grace.",
    choices: [
      { id: "grace-through-faith", text: "Saved by grace through faith", correct: true },
      { id: "armor", text: "The armor of God", wrongNote: "The armor of God appears later in Ephesians 6." },
      { id: "tongues", text: "Speaking in tongues at Pentecost", wrongNote: "Pentecost is in Acts 2, not Ephesians 2." },
      { id: "shipwreck", text: "Paul's shipwreck", wrongNote: "The shipwreck is in Acts 27, not this grace passage." }
    ]
  }
];

export const questionPacks = {
  "who-said-it": {
    id: "who-said-it",
    title: "Who Said It?",
    eyebrow: "Quote Context",
    summary: "Match Bible lines to the person and moment, then get the reference in plain English.",
    oneMoreRoundText: "Try another quote round",
    defaultRoundLength: 8,
    color: "#2d7a73",
    challenges: whoSaidIt
  },
  "match-the-miracle": {
    id: "match-the-miracle",
    title: "Match the Miracle",
    eyebrow: "Gospel Signs",
    summary: "Connect each miracle with the detail that makes it memorable and the concept it teaches.",
    oneMoreRoundText: "Try another miracle round",
    defaultRoundLength: 8,
    color: "#b4532a",
    challenges: matchMiracle
  },
  "pauls-journey-map": {
    id: "pauls-journey-map",
    title: "Paul's Journey Map",
    eyebrow: "Acts Road Trip",
    summary: "Move through Acts by answering questions from Damascus to Rome.",
    oneMoreRoundText: "Travel the route again",
    defaultRoundLength: 8,
    color: "#4257a8",
    routeStops: [
      "Damascus Road",
      "Damascus",
      "Jerusalem",
      "Antioch",
      "Cyprus",
      "Lystra",
      "Philippi",
      "Athens",
      "Corinth",
      "Ephesus",
      "Jerusalem",
      "Rome"
    ],
    challenges: paulJourney
  },
  "parables-quiz": {
    id: "parables-quiz",
    title: "Parables Quiz",
    eyebrow: "Jesus' Stories",
    summary: "Learn the point of Jesus' parables without turning them into dry trivia.",
    oneMoreRoundText: "Try another parable round",
    defaultRoundLength: 8,
    color: "#697a37",
    challenges: parablesQuiz
  },
  "book-order-challenge": {
    id: "book-order-challenge",
    title: "Book Order Challenge",
    eyebrow: "Find It Faster",
    summary: "Practice the New Testament order one quick step at a time.",
    oneMoreRoundText: "Run the order again",
    defaultRoundLength: 8,
    color: "#805ad5",
    challenges: bookOrderChallenge
  },
  "character-guess-who": {
    id: "character-guess-who",
    title: "Character Guess Who",
    eyebrow: "Bible People",
    summary: "Use short clues to identify Bible characters and remember why they matter.",
    oneMoreRoundText: "Guess another set",
    defaultRoundLength: 8,
    color: "#2f855a",
    challenges: characterGuessWho
  },
  "verse-context-challenge": {
    id: "verse-context-challenge",
    title: "Verse Context Challenge",
    eyebrow: "Famous Verses",
    summary: "Put well-known verses back into their scene so they teach more clearly.",
    oneMoreRoundText: "Try another context round",
    defaultRoundLength: 8,
    color: "#284b7a",
    challenges: verseContextChallenge
  }
};

export const defaultPackId = "who-said-it";

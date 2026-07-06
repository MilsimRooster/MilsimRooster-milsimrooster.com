import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lessonsRoot = join(root, "public", "data", "bible_lessons");
const libraryRoot = join(lessonsRoot, "library");

const starterFiles = new Map([
  ["david-and-goliath", "david-and-goliath.json"],
  ["noahs-ark", "noahs-ark.json"],
  ["daniel-in-the-lions-den", "daniel-in-the-lions-den.json"],
]);

const oldTestamentBooks = new Set([
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
]);

const packs = [
  {
    id: "beginnings-promises",
    name: "Beginnings and Promises",
    description: "Creation, the fall, early families, and God's promises in Genesis.",
  },
  {
    id: "exodus-wilderness",
    name: "Exodus and Wilderness",
    description: "Moses, rescue, commandments, provision, and learning to trust God.",
  },
  {
    id: "leaders-kings-prophets",
    name: "Leaders, Kings, and Prophets",
    description: "Judges, kings, prophets, courage, wisdom, worship, and return.",
  },
  {
    id: "jesus-life-teaching",
    name: "Jesus' Life and Teaching",
    description: "The birth, words, miracles, death, and resurrection of Jesus.",
  },
  {
    id: "church-letters-hope",
    name: "Church, Letters, and Hope",
    description: "Acts, Christian life, mission, and the hope God promises.",
  },
];

const lessons = [
  l("creation-good-world", "Creation: God's Good World", "Genesis", "Genesis 1:1-2:3", "Beginnings", "beginnings-promises", "God made the world good and made people to know Him and care for His creation.", "God created light, sky, land, plants, animals, and people. Everything God made showed His power and goodness.", ["Creation", "God's Power", "Worship"], "easy", 12, "Who made the heavens and the earth?", "God", "Genesis 1:1", "Creation Days Wheel"),
  l("made-in-gods-image", "Made in God's Image", "Genesis", "Genesis 1:26-31", "Beginnings", "beginnings-promises", "Every person has value because God made people in His image.", "God made people different from everything else He created. People can know God, reflect His care, and treat others with dignity.", ["Identity", "Kindness", "Creation"], "easy", 12, "Why should we treat people with respect?", "People are made in God's image", "Genesis 1:27", "Image Bearer Mirror"),
  l("garden-first-choice", "The Garden and the First Choice", "Genesis", "Genesis 2:15-3:24", "Beginnings", "beginnings-promises", "Sin breaks trust with God, but God still seeks and cares for people.", "Adam and Eve lived in the garden and were given one command. They disobeyed God, and sin brought sadness and separation.", ["Sin", "Obedience", "Mercy"], "medium", 16, "What happened when Adam and Eve disobeyed God?", "Sin entered the world", "Genesis 3:9", "Good Choice Path"),
  l("cain-and-abel", "Cain and Abel", "Genesis", "Genesis 4:1-16", "Beginnings", "beginnings-promises", "Anger must be brought to God before it grows into sin.", "Cain became angry when his offering was not accepted. God warned him, but Cain chose jealousy and hurt his brother.", ["Anger", "Sin", "Choices"], "medium", 14, "What did God warn Cain about?", "Sin was crouching at the door", "Genesis 4:7", "Anger Thermometer"),
  l("noahs-ark", "Noah's Ark", "Genesis", "Genesis 6:9-9:17", "Beginnings", "beginnings-promises", "God judges sin, saves by His mercy, and keeps His promises.", "Noah obeyed God and built the ark. God protected Noah's family and gave the rainbow as a sign of His promise.", ["Obedience", "Faith", "Promise"], "medium", 18, "What sign did God give after the flood?", "A rainbow", "Genesis 9:13", "Promise Rainbow"),
  l("tower-of-babel", "The Tower of Babel", "Genesis", "Genesis 11:1-9", "Beginnings", "beginnings-promises", "Pride says we can live without God, but God is still Lord over every nation.", "The people tried to build a tower to make a name for themselves. God confused their language and scattered them.", ["Pride", "Humility", "Nations"], "medium", 14, "Why did the people build the tower?", "To make a name for themselves", "Genesis 11:4", "Build or Bow"),
  l("god-calls-abram", "God Calls Abram", "Genesis", "Genesis 12:1-9", "Promises", "beginnings-promises", "Faith means following God even when we do not know every next step.", "God told Abram to leave his country and promised to bless him. Abram trusted God and went.", ["Faith", "Trust", "Promise"], "easy", 13, "What did Abram do when God called him?", "He went as God told him", "Genesis 12:4", "Trust Map"),
  l("abraham-and-lot", "Abraham and Lot", "Genesis", "Genesis 13:1-18", "Promises", "beginnings-promises", "Peace sometimes means letting go instead of grabbing first place.", "Abram and Lot had too many animals for one place. Abram let Lot choose first and trusted God with the result.", ["Peace", "Generosity", "Trust"], "easy", 13, "Who chose land first?", "Lot", "Genesis 13:9", "Peace Planner"),
  l("god-promises-abraham", "God Promises Abraham", "Genesis", "Genesis 15:1-6", "Promises", "beginnings-promises", "God keeps promises even when they seem impossible to us.", "Abram wondered how God's promise would happen. God showed him the stars and Abram believed the Lord.", ["Promise", "Faith", "Patience"], "easy", 12, "What did God show Abram?", "The stars", "Genesis 15:5", "Star Promise Count"),
  l("isaac-is-born", "Isaac Is Born", "Genesis", "Genesis 21:1-7", "Promises", "beginnings-promises", "God's timing can be surprising, but His promises do not fail.", "God gave Abraham and Sarah a son named Isaac, just as He had promised. Their sadness turned into laughter.", ["Promise", "Joy", "Patience"], "easy", 12, "What was Abraham and Sarah's son named?", "Isaac", "Genesis 21:3", "Promise Calendar"),
  l("abraham-and-isaac", "Abraham and Isaac", "Genesis", "Genesis 22:1-19", "Promises", "beginnings-promises", "God provides and calls His people to trust Him deeply.", "Abraham obeyed God during a very hard test. God stopped him and provided a ram instead.", ["Trust", "Obedience", "Provision"], "hard", 18, "What did God provide instead?", "A ram", "Genesis 22:14", "Provision Search"),
  l("jacob-and-esau", "Jacob and Esau", "Genesis", "Genesis 25:19-34", "Family Lessons", "beginnings-promises", "Quick wants can lead to foolish choices when we forget what matters most.", "Esau traded his birthright for stew because he wanted food right away. Jacob also acted selfishly.", ["Choices", "Wisdom", "Family"], "medium", 14, "What did Esau trade away?", "His birthright", "Genesis 25:34", "Want or Wise"),
  l("jacob-wrestles", "Jacob Wrestles with God", "Genesis", "Genesis 32:22-32", "Family Lessons", "beginnings-promises", "God can change people and give them a new way to walk.", "Jacob wrestled through the night and received a new name, Israel. He learned that blessing comes from God.", ["Change", "Prayer", "Identity"], "medium", 15, "What new name was Jacob given?", "Israel", "Genesis 32:28", "New Name Card"),
  l("josephs-dreams", "Joseph's Dreams", "Genesis", "Genesis 37:1-11", "Family Lessons", "beginnings-promises", "God can be at work even when family life is messy and painful.", "Joseph had dreams that made his brothers angry. Their jealousy grew, but God was not finished with Joseph.", ["Jealousy", "Family", "God's Plan"], "medium", 14, "Who became angry about Joseph's dreams?", "His brothers", "Genesis 37:11", "Dream Scene Sort"),
  l("joseph-forgives", "Joseph Forgives His Brothers", "Genesis", "Genesis 45:1-15", "Family Lessons", "beginnings-promises", "Forgiveness trusts God with the hurt and chooses mercy instead of revenge.", "Joseph could have punished his brothers, but he forgave them. He saw that God had used hard things to save many lives.", ["Forgiveness", "Mercy", "God's Plan"], "medium", 16, "What did Joseph choose instead of revenge?", "Forgiveness", "Genesis 45:5", "Forgiveness Bridge"),
  l("baby-moses", "Baby Moses Is Protected", "Exodus", "Exodus 2:1-10", "Rescue", "exodus-wilderness", "God can protect His people through brave and caring choices.", "Moses' family hid him, placed him in a basket, and trusted God. Pharaoh's daughter found him and cared for him.", ["Courage", "Protection", "Family"], "easy", 12, "Where was baby Moses placed?", "In a basket", "Exodus 2:3", "Basket Rescue"),
  l("burning-bush", "The Burning Bush", "Exodus", "Exodus 3:1-12", "Rescue", "exodus-wilderness", "God hears His people and calls servants to join His rescue work.", "Moses saw a bush burning without burning up. God told him He had heard Israel's cries and would send Moses.", ["Calling", "Prayer", "Rescue"], "medium", 15, "What did God say He had heard?", "The cries of His people", "Exodus 3:7", "Holy Ground Steps"),
  l("passover", "The Passover", "Exodus", "Exodus 12:1-14", "Rescue", "exodus-wilderness", "God makes a way of rescue and teaches His people to remember.", "God gave Israel the Passover so they would remember His rescue. The lamb and meal pointed to God's saving power.", ["Rescue", "Remember", "Obedience"], "hard", 18, "What were God's people told to remember?", "God's rescue", "Exodus 12:14", "Remember Meal"),
  l("red-sea-crossing", "Crossing the Red Sea", "Exodus", "Exodus 14:10-31", "Rescue", "exodus-wilderness", "God can make a way when His people cannot see one.", "Israel was trapped between Pharaoh's army and the sea. God opened the sea, and His people crossed on dry ground.", ["Faith", "Rescue", "Fear"], "easy", 14, "What did God open for Israel?", "The Red Sea", "Exodus 14:21", "Path Through Water"),
  l("manna-in-wilderness", "Manna in the Wilderness", "Exodus", "Exodus 16:1-18", "Wilderness", "exodus-wilderness", "God provides daily help and teaches His people to trust Him one day at a time.", "Israel was hungry in the wilderness. God gave manna each morning and taught them to gather what they needed.", ["Provision", "Trust", "Gratitude"], "easy", 13, "What food did God give in the wilderness?", "Manna", "Exodus 16:15", "Daily Bread Basket"),
  l("ten-commandments", "The Ten Commandments", "Exodus", "Exodus 20:1-17", "Wilderness", "exodus-wilderness", "God's commands show His holiness and teach His people how to love Him and others.", "God gave commandments to Israel after rescuing them. His law showed how His people should live with Him and one another.", ["Obedience", "Holiness", "Love"], "medium", 18, "Who gave the Ten Commandments?", "God", "Exodus 20:1", "Commandment Match"),
  l("golden-calf", "The Golden Calf", "Exodus", "Exodus 32:1-14", "Wilderness", "exodus-wilderness", "Idols are false helps that pull hearts away from the living God.", "While Moses was on the mountain, the people made a golden calf. They forgot the God who had rescued them.", ["Idols", "Sin", "Worship"], "hard", 18, "What did the people make?", "A golden calf", "Exodus 32:4", "True Worship Sort"),
  l("joshua-be-strong", "Joshua: Be Strong and Courageous", "Joshua", "Joshua 1:1-9", "Courage", "leaders-kings-prophets", "God's presence gives courage for new responsibilities.", "Joshua had to lead Israel after Moses. God told him to be strong and courageous because the Lord would be with him.", ["Courage", "Leadership", "God's Presence"], "easy", 12, "What did God tell Joshua to be?", "Strong and courageous", "Joshua 1:9", "Courage Card"),
  l("jericho", "The Walls of Jericho", "Joshua", "Joshua 6:1-20", "Courage", "leaders-kings-prophets", "Obedience can look strange, but God's people can trust His instructions.", "God told Israel to march around Jericho. When they obeyed, the walls fell and God gave the city into their hands.", ["Obedience", "Faith", "Victory"], "medium", 15, "What happened to Jericho's walls?", "They fell", "Joshua 6:20", "Marching Map"),
  l("deborah", "Deborah Leads with Courage", "Judges", "Judges 4:1-16", "Judges", "leaders-kings-prophets", "God can give wisdom and courage to lead others toward what is right.", "Deborah served as a judge in Israel. She helped Barak obey God's command and led with faith.", ["Leadership", "Courage", "Wisdom"], "medium", 15, "Who was the judge who helped Barak?", "Deborah", "Judges 4:4", "Brave Leader Badge"),
  l("gideon", "Gideon Learns to Trust", "Judges", "Judges 6:11-16", "Judges", "leaders-kings-prophets", "God sees what He can do through us even when we feel weak.", "Gideon felt small and afraid. God called him a mighty man of valor and promised to be with him.", ["Trust", "Fear", "Calling"], "medium", 14, "What did God promise Gideon?", "I will be with you", "Judges 6:16", "Strength You Have"),
  l("ruth-stays", "Ruth Stays with Naomi", "Ruth", "Ruth 1:16-18", "Faithfulness", "leaders-kings-prophets", "Faithful love stays near and serves when life is hard.", "Ruth chose to stay with Naomi and follow Naomi's God. Her loyal love became part of God's bigger story.", ["Faithfulness", "Love", "Family"], "easy", 13, "Who did Ruth stay with?", "Naomi", "Ruth 1:16", "Loyal Love Chain"),
  l("hannah-prays", "Hannah Prays for a Son", "1 Samuel", "1 Samuel 1:9-20", "Prayer", "leaders-kings-prophets", "Prayer is bringing real sadness and hope to God.", "Hannah was deeply sad and prayed to the Lord. God heard her, and she later had a son named Samuel.", ["Prayer", "Hope", "Trust"], "easy", 14, "What did Hannah do with her sadness?", "She prayed", "1 Samuel 1:10", "Prayer Bowl"),
  l("samuel-hears-god", "Samuel Hears God", "1 Samuel", "1 Samuel 3:1-10", "Prayer", "leaders-kings-prophets", "Listening to God matters, and even young people can respond to Him.", "Samuel heard his name at night and learned that the Lord was speaking. He answered with a listening heart.", ["Listening", "Obedience", "Calling"], "easy", 13, "What did Samuel say to the Lord?", "Speak, for Your servant is listening", "1 Samuel 3:10", "Listening Ears"),
  l("david-anointed", "David Is Anointed", "1 Samuel", "1 Samuel 16:1-13", "Bible Heroes", "leaders-kings-prophets", "God sees the heart, not just what people look like outside.", "Samuel thought one of David's older brothers might be king, but God chose David. The Lord looks at the heart.", ["Heart", "Calling", "Humility"], "easy", 13, "What does the Lord look at?", "The heart", "1 Samuel 16:7", "Heart Check"),
  l("david-and-goliath", "David and Goliath", "1 Samuel", "1 Samuel 17:1-50", "Bible Heroes", "leaders-kings-prophets", "God's people can trust Him when they face frightening things.", "David trusted the Lord when the army was afraid. He faced Goliath with faith instead of fear.", ["Faith", "Courage", "Trust"], "easy", 15, "Why was David brave enough to face Goliath?", "He trusted the Lord", "1 Samuel 17:47", "Five Smooth Stones"),
  l("david-and-jonathan", "David and Jonathan", "1 Samuel", "1 Samuel 20:12-17", "Friendship", "leaders-kings-prophets", "True friendship is loyal, truthful, and willing to protect another person.", "Jonathan loved David as a friend and helped protect him. Their friendship showed loyalty and courage.", ["Friendship", "Loyalty", "Courage"], "easy", 13, "Who was David's loyal friend?", "Jonathan", "1 Samuel 20:17", "Friendship Shield"),
  l("solomon-wisdom", "Solomon Asks for Wisdom", "1 Kings", "1 Kings 3:5-14", "Wisdom", "leaders-kings-prophets", "Wisdom is better than showing off because it helps us honor God and serve people.", "God asked Solomon what he wanted. Solomon asked for wisdom to lead God's people well.", ["Wisdom", "Leadership", "Prayer"], "easy", 13, "What did Solomon ask God for?", "Wisdom", "1 Kings 3:9", "Wisdom Wish"),
  l("elijah-ravens", "Elijah and the Ravens", "1 Kings", "1 Kings 17:1-16", "Prophets", "leaders-kings-prophets", "God can provide in surprising ways when His servants depend on Him.", "God cared for Elijah during a drought. Ravens brought food, and later God provided through a widow's jar and jug.", ["Provision", "Trust", "Prophets"], "medium", 15, "What birds brought food to Elijah?", "Ravens", "1 Kings 17:6", "Provision Path"),
  l("mount-carmel", "Elijah at Mount Carmel", "1 Kings", "1 Kings 18:20-39", "Prophets", "leaders-kings-prophets", "The Lord alone is God, and worship belongs to Him.", "Elijah challenged the prophets of Baal. God answered by fire, showing the people that the Lord is God.", ["Worship", "Faith", "God's Power"], "hard", 18, "Who answered by fire?", "The Lord", "1 Kings 18:39", "True God Choice"),
  l("naaman", "Naaman Is Healed", "2 Kings", "2 Kings 5:1-14", "Prophets", "leaders-kings-prophets", "Humility means receiving God's help God's way.", "Naaman wanted a grand cure, but Elisha told him to wash in the Jordan. When Naaman humbled himself, God healed him.", ["Humility", "Obedience", "Healing"], "medium", 15, "Where did Naaman wash?", "The Jordan River", "2 Kings 5:14", "Humble Steps"),
  l("josiah-finds-book", "Josiah Finds God's Word", "2 Kings", "2 Kings 22:1-13", "Kings", "leaders-kings-prophets", "God's Word can wake up hearts and call people back to Him.", "King Josiah heard the Book of the Law and was sorry for Israel's sin. He wanted the people to listen to God.", ["God's Word", "Repentance", "Leadership"], "medium", 16, "What did Josiah hear read?", "The Book of the Law", "2 Kings 22:11", "Word Discovery"),
  l("esther-speaks", "Esther Speaks Up", "Esther", "Esther 4:10-16", "Courage", "leaders-kings-prophets", "Courage can mean using your place to help people in danger.", "Esther was afraid to go to the king, but she chose courage to help her people. Mordecai reminded her that her moment mattered.", ["Courage", "Leadership", "Help"], "medium", 15, "Who chose to speak up for her people?", "Esther", "Esther 4:14", "Courage Moment"),
  l("job-trusts", "Job Worships in Suffering", "Job", "Job 1:20-22", "Wisdom", "leaders-kings-prophets", "God is worthy of trust and worship even when life hurts.", "Job lost many things and grieved deeply. Even in pain, he did not accuse God of wrong.", ["Suffering", "Trust", "Worship"], "hard", 16, "What did Job do after terrible loss?", "He worshiped", "Job 1:20", "Trust in Tears"),
  l("psalm-23", "The Lord Is My Shepherd", "Psalms", "Psalms 23:1-6", "Psalms", "leaders-kings-prophets", "God cares for His people like a shepherd cares for sheep.", "Psalm 23 pictures the Lord as a shepherd who provides, guides, protects, and stays near His people.", ["Comfort", "Trust", "God's Care"], "easy", 12, "Who is pictured as the shepherd?", "The Lord", "Psalms 23:1", "Shepherd Care Map"),
  l("jonah-runs", "Jonah Runs from God", "Jonah", "Jonah 1:1-17", "Prophets", "leaders-kings-prophets", "Running from God does not hide us from His care or His command.", "God told Jonah to go to Nineveh, but Jonah ran the other way. God sent a storm and a great fish.", ["Obedience", "Mercy", "Calling"], "medium", 15, "Where did God tell Jonah to go?", "Nineveh", "Jonah 1:2", "Which Way Jonah"),
  l("jonah-prays", "Jonah Prays from the Fish", "Jonah", "Jonah 2:1-10", "Prophets", "leaders-kings-prophets", "We can pray to God from the deepest trouble.", "Jonah prayed from inside the fish. He remembered the Lord and thanked Him for rescue.", ["Prayer", "Rescue", "Mercy"], "medium", 14, "Where did Jonah pray from?", "Inside the fish", "Jonah 2:1", "Deep Trouble Prayer"),
  l("daniel-chooses-faithfulness", "Daniel Chooses Faithfulness", "Daniel", "Daniel 1:8-17", "Exile", "leaders-kings-prophets", "Faithfulness starts with small choices to honor God.", "Daniel and his friends were far from home, but Daniel resolved not to defile himself. God helped them.", ["Faithfulness", "Choices", "Wisdom"], "medium", 15, "What did Daniel resolve to do?", "Honor God", "Daniel 1:8", "Faithful Choice Plate"),
  l("fiery-furnace", "The Fiery Furnace", "Daniel", "Daniel 3:13-30", "Exile", "leaders-kings-prophets", "God is able to rescue, and His people can stay faithful even before they know the outcome.", "Shadrach, Meshach, and Abednego refused to worship the statue. God was with them in the fire.", ["Faith", "Courage", "Worship"], "medium", 16, "Who was with the men in the fire?", "God was with them", "Daniel 3:17", "Stand Tall"),
  l("daniel-in-the-lions-den", "Daniel in the Lions' Den", "Daniel", "Daniel 6:1-28", "Exile", "leaders-kings-prophets", "Prayer matters, and God is faithful when obeying Him is costly.", "Daniel kept praying to God even when a law made it dangerous. God shut the lions' mouths.", ["Prayer", "Courage", "Faithfulness"], "medium", 16, "What did Daniel keep doing?", "Praying to God", "Daniel 6:10", "Prayer Window"),
  l("nehemiah-rebuilds", "Nehemiah Rebuilds the Wall", "Nehemiah", "Nehemiah 2:11-20", "Return", "leaders-kings-prophets", "God's work often takes prayer, planning, courage, and teamwork.", "Nehemiah saw Jerusalem's broken walls and called the people to rebuild. He trusted God's good hand.", ["Prayer", "Teamwork", "Courage"], "medium", 16, "What did Nehemiah help rebuild?", "Jerusalem's wall", "Nehemiah 2:18", "Rebuild Together"),
  l("birth-of-jesus", "Jesus Is Born", "Luke", "Luke 2:1-20", "Jesus", "jesus-life-teaching", "Jesus came humbly as the Savior God promised.", "Jesus was born in Bethlehem, and shepherds heard the good news from angels. They went to see Him and praised God.", ["Jesus", "Joy", "Good News"], "easy", 14, "Where was Jesus born?", "Bethlehem", "Luke 2:11", "Good News Shepherds"),
  l("jesus-at-temple", "Jesus at the Temple", "Luke", "Luke 2:41-52", "Jesus", "jesus-life-teaching", "Jesus grew in wisdom and knew He belonged to His Father's work.", "When Jesus was twelve, Mary and Joseph found Him in the temple. He was listening, asking questions, and speaking with wisdom.", ["Wisdom", "Jesus", "Growth"], "easy", 13, "Where did Mary and Joseph find Jesus?", "In the temple", "Luke 2:49", "Temple Questions"),
  l("jesus-baptized", "Jesus Is Baptized", "Matthew", "Matthew 3:13-17", "Jesus", "jesus-life-teaching", "Jesus obeyed the Father and was publicly shown as God's beloved Son.", "John baptized Jesus in the Jordan River. The Spirit descended, and the Father's voice spoke from heaven.", ["Jesus", "Obedience", "God's Son"], "medium", 14, "Who baptized Jesus?", "John", "Matthew 3:16", "River Scene"),
  l("jesus-tempted", "Jesus Is Tempted", "Matthew", "Matthew 4:1-11", "Jesus", "jesus-life-teaching", "Jesus answered temptation with God's Word and remained faithful.", "Jesus was tempted in the wilderness, but He did not sin. He answered each temptation with Scripture.", ["Temptation", "God's Word", "Faithfulness"], "medium", 16, "What did Jesus use to answer temptation?", "God's Word", "Matthew 4:4", "Scripture Shield"),
  l("jesus-calls-disciples", "Jesus Calls the First Disciples", "Matthew", "Matthew 4:18-22", "Discipleship", "jesus-life-teaching", "Following Jesus means listening when He calls and learning His way.", "Jesus called fishermen to follow Him. They left their nets and became His disciples.", ["Following Jesus", "Calling", "Obedience"], "easy", 13, "What did Jesus say to the fishermen?", "Follow Me", "Matthew 4:19", "Follow Me Path"),
  l("beatitudes", "The Beatitudes", "Matthew", "Matthew 5:1-12", "Teaching", "jesus-life-teaching", "Jesus teaches that God's kingdom values humility, mercy, purity, and peace.", "Jesus described the blessed life in God's kingdom. His words showed a different kind of greatness.", ["Kingdom", "Humility", "Mercy"], "hard", 18, "Who taught the Beatitudes?", "Jesus", "Matthew 5:3", "Kingdom Values Sort"),
  l("lords-prayer", "The Lord's Prayer", "Matthew", "Matthew 6:5-13", "Prayer", "jesus-life-teaching", "Jesus teaches us to pray with trust, worship, daily dependence, forgiveness, and help.", "Jesus taught His followers how to pray. The prayer begins with honoring the Father and asks for daily needs and forgiveness.", ["Prayer", "Trust", "Forgiveness"], "easy", 15, "Who taught this prayer?", "Jesus", "Matthew 6:9", "Prayer Ladder"),
  l("wise-foolish-builders", "Wise and Foolish Builders", "Matthew", "Matthew 7:24-27", "Parables", "jesus-life-teaching", "Wisdom means hearing Jesus' words and putting them into practice.", "Jesus compared obedient listeners to a wise builder on rock. Hearing without obeying is like building on sand.", ["Obedience", "Wisdom", "Jesus' Words"], "easy", 13, "Where did the wise builder build?", "On the rock", "Matthew 7:24", "Rock or Sand"),
  l("jesus-calms-storm", "Jesus Calms the Storm", "Mark", "Mark 4:35-41", "Miracles", "jesus-life-teaching", "Jesus has authority over creation and cares for fearful disciples.", "A storm frightened the disciples while Jesus was in the boat. Jesus spoke, and the wind and sea became calm.", ["Fear", "Faith", "Jesus' Power"], "easy", 13, "What did Jesus calm?", "The storm", "Mark 4:39", "Storm to Peace"),
  l("good-samaritan", "The Good Samaritan", "Luke", "Luke 10:25-37", "Parables", "jesus-life-teaching", "Love for our neighbor shows mercy in action.", "Jesus told about a Samaritan who helped a hurt man when others passed by. Mercy means stopping to help.", ["Mercy", "Love", "Neighbor"], "easy", 15, "Who helped the hurt man?", "The Samaritan", "Luke 10:37", "Mercy Road"),
  l("prodigal-son", "The Prodigal Son", "Luke", "Luke 15:11-32", "Parables", "jesus-life-teaching", "God welcomes repentant sinners with mercy and joy.", "A son wasted what he had and came home ashamed. His father ran to welcome him back.", ["Forgiveness", "Mercy", "Repentance"], "medium", 16, "What did the father do when the son returned?", "He welcomed him", "Luke 15:20", "Welcome Home"),
  l("parable-of-sower", "The Parable of the Sower", "Matthew", "Matthew 13:1-23", "Parables", "jesus-life-teaching", "God's Word should be received with a heart that listens and grows.", "Jesus told about seed falling on different soils. The good soil pictures a heart that receives God's Word.", ["God's Word", "Listening", "Growth"], "medium", 16, "What did the seed picture?", "God's Word", "Matthew 13:23", "Soil Sort"),
  l("feeding-five-thousand", "Jesus Feeds Five Thousand", "John", "John 6:1-14", "Miracles", "jesus-life-teaching", "Jesus can use small gifts and provide more than enough.", "A boy had five loaves and two fish. Jesus gave thanks and fed a huge crowd with leftovers.", ["Provision", "Generosity", "Jesus' Power"], "easy", 14, "What food did the boy have?", "Five loaves and two fish", "John 6:9", "Lunch Basket"),
  l("walking-on-water", "Jesus Walks on Water", "Matthew", "Matthew 14:22-33", "Miracles", "jesus-life-teaching", "Faith looks to Jesus when fear feels bigger than courage.", "The disciples saw Jesus walking on the water. Peter stepped out, became afraid, and Jesus rescued him.", ["Faith", "Fear", "Rescue"], "medium", 15, "Who rescued Peter?", "Jesus", "Matthew 14:31", "Eyes on Jesus"),
  l("lazarus", "Jesus Raises Lazarus", "John", "John 11:1-44", "Miracles", "jesus-life-teaching", "Jesus has power over death and cares when people grieve.", "Jesus wept with Mary and Martha, then called Lazarus from the tomb. Many saw His power and believed.", ["Jesus' Power", "Grief", "Hope"], "hard", 18, "Who did Jesus raise from the tomb?", "Lazarus", "John 11:25", "Hope at the Tomb"),
  l("zacchaeus", "Zacchaeus Meets Jesus", "Luke", "Luke 19:1-10", "Jesus", "jesus-life-teaching", "Jesus seeks and saves lost people, and His grace changes lives.", "Zacchaeus climbed a tree to see Jesus. Jesus came to his house, and Zacchaeus chose to make wrong things right.", ["Grace", "Repentance", "Jesus"], "easy", 14, "Why did Zacchaeus climb a tree?", "To see Jesus", "Luke 19:10", "Tree View"),
  l("last-supper", "The Last Supper", "Luke", "Luke 22:14-20", "Passion Week", "jesus-life-teaching", "Jesus gave His followers a meal to remember His saving death.", "Jesus shared bread and cup with His disciples and told them to remember Him.", ["Jesus", "Remember", "Salvation"], "medium", 15, "Who told His disciples to remember Him?", "Jesus", "Luke 22:19", "Remember Table"),
  l("gethsemane", "Jesus Prays in Gethsemane", "Matthew", "Matthew 26:36-46", "Passion Week", "jesus-life-teaching", "Jesus obeyed the Father even when the path was painful.", "Jesus prayed in the garden before the cross. He honestly brought His sorrow to the Father and submitted to His will.", ["Prayer", "Obedience", "Jesus"], "hard", 16, "Where did Jesus pray before the cross?", "Gethsemane", "Matthew 26:39", "Garden Prayer"),
  l("crucifixion", "Jesus Dies on the Cross", "Luke", "Luke 23:33-49", "Passion Week", "jesus-life-teaching", "Jesus gave His life to save sinners.", "Jesus was crucified between criminals. Even while suffering, He showed mercy and trusted the Father.", ["Jesus Saves", "Forgiveness", "Sacrifice"], "hard", 18, "Where did Jesus die?", "On the cross", "Luke 23:46", "Mercy at the Cross"),
  l("resurrection", "Jesus Is Risen", "John", "John 20:1-18", "Resurrection", "jesus-life-teaching", "Jesus rose from the dead, giving His people hope and joy.", "Mary found the tomb empty and met the risen Jesus. The resurrection changed fear into good news.", ["Resurrection", "Hope", "Joy"], "easy", 15, "What did Mary find at the tomb?", "It was empty", "John 20:18", "Empty Tomb News"),
  l("great-commission", "The Great Commission", "Matthew", "Matthew 28:16-20", "Mission", "church-letters-hope", "Jesus sends His followers to make disciples and promises to be with them.", "After rising from the dead, Jesus sent His disciples to teach and baptize all nations. He promised His presence.", ["Mission", "Discipleship", "God's Presence"], "medium", 16, "What did Jesus promise His disciples?", "I am with you always", "Matthew 28:20", "Go Map"),
  l("pentecost", "The Holy Spirit Comes at Pentecost", "Acts", "Acts 2:1-12", "Church", "church-letters-hope", "God gives the Holy Spirit and gathers people from many nations.", "The Holy Spirit came upon the believers at Pentecost. People from many places heard the mighty works of God.", ["Holy Spirit", "Church", "Mission"], "medium", 16, "Who came at Pentecost?", "The Holy Spirit", "Acts 2:4", "Many Languages"),
  l("peter-and-john-heal", "Peter and John Help a Lame Man", "Acts", "Acts 3:1-10", "Church", "church-letters-hope", "Jesus' name brings hope, and God's people can notice those in need.", "Peter and John saw a man who could not walk. In Jesus' name, he was healed and began praising God.", ["Healing", "Compassion", "Jesus' Name"], "easy", 14, "In whose name was the man healed?", "Jesus' name", "Acts 3:6", "Notice and Help"),
  l("philip-and-ethiopian", "Philip and the Ethiopian Official", "Acts", "Acts 8:26-40", "Mission", "church-letters-hope", "God can guide His people to help others understand Scripture and Jesus.", "Philip met a man reading Isaiah and explained the good news about Jesus. The man believed and was baptized.", ["Scripture", "Mission", "Good News"], "medium", 16, "Who explained Scripture to the Ethiopian official?", "Philip", "Acts 8:35", "Road Bible Talk"),
  l("saul-converted", "Saul Meets Jesus", "Acts", "Acts 9:1-19", "Mission", "church-letters-hope", "Jesus can change even the hardest heart and give a new mission.", "Saul was going to hurt believers, but Jesus stopped him on the road. Saul became a servant of Jesus.", ["Grace", "Change", "Mission"], "medium", 16, "Who met Saul on the road?", "Jesus", "Acts 9:5", "Changed Direction"),
  l("peter-and-cornelius", "Peter and Cornelius", "Acts", "Acts 10:1-48", "Mission", "church-letters-hope", "The good news of Jesus is for every nation and people group.", "God sent Peter to Cornelius, a Gentile. Peter learned that God welcomes people from every nation who turn to Him.", ["Good News", "Nations", "Welcome"], "hard", 18, "Who did Peter visit?", "Cornelius", "Acts 10:34", "Every Nation Table"),
  l("paul-and-silas", "Paul and Silas in Prison", "Acts", "Acts 16:16-34", "Mission", "church-letters-hope", "God can bring worship and witness even in hard places.", "Paul and Silas prayed and sang in prison. God opened doors, and the jailer heard about Jesus.", ["Prayer", "Worship", "Witness"], "medium", 16, "What did Paul and Silas do in prison?", "They prayed and sang", "Acts 16:25", "Midnight Praise"),
  l("fruit-of-spirit", "The Fruit of the Spirit", "Galatians", "Galatians 5:22-23", "Christian Life", "church-letters-hope", "The Holy Spirit grows Christlike character in God's people.", "Paul described love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control as the Spirit's fruit.", ["Holy Spirit", "Character", "Growth"], "easy", 14, "Who grows this fruit in God's people?", "The Holy Spirit", "Galatians 5:22", "Fruit Basket"),
  l("armor-of-god", "The Armor of God", "Ephesians", "Ephesians 6:10-18", "Christian Life", "church-letters-hope", "God gives His people truth, faith, salvation, Scripture, and prayer for spiritual strength.", "Paul pictured God's help like armor. Believers stand strong by depending on the Lord.", ["Faith", "Prayer", "God's Word"], "medium", 16, "What sword is named in the armor of God?", "The word of God", "Ephesians 6:17", "Armor Match"),
  l("love-is-patient", "Love Is Patient and Kind", "1 Corinthians", "1 Corinthians 13:1-13", "Christian Life", "church-letters-hope", "Love matters because God calls His people to patient, humble, faithful care.", "Paul taught that impressive gifts are empty without love. Real love is patient, kind, humble, and lasting.", ["Love", "Patience", "Kindness"], "easy", 15, "What does Paul say love is?", "Patient and kind", "1 Corinthians 13:4", "Love Looks Like"),
  l("new-creation-hope", "God Makes All Things New", "Revelation", "Revelation 21:1-5", "Hope", "church-letters-hope", "God promises a future where He dwells with His people and wipes away every tear.", "John saw a new heaven and new earth. God promised to make all things new and remove death, mourning, crying, and pain.", ["Hope", "God's Promise", "New Creation"], "hard", 18, "What does God promise to make new?", "All things", "Revelation 21:5", "Hope Picture"),
];

function l(id, title, bibleBook, passage, category, collection, focus, tell, tags, difficulty, estimatedMinutes, quizQuestion, quizAnswer, memoryReference, activityTitle) {
  return {
    id,
    title,
    bibleBook,
    passage,
    category,
    collection,
    focus,
    tell,
    tags,
    difficulty,
    estimatedMinutes,
    quizQuestion,
    quizAnswer,
    memoryReference,
    activityTitle,
  };
}

function lessonFromDescriptor(descriptor, index) {
  const testament = oldTestamentBooks.has(descriptor.bibleBook) ? "Old Testament" : "New Testament";
  const relatedLessons = [
    lessons[index - 1]?.id,
    lessons[index + 1]?.id,
  ].filter(Boolean);

  return {
    schema_version: "bible-lesson/v1",
    lesson_id: descriptor.id,
    title: descriptor.title,
    bible_book: descriptor.bibleBook,
    passage: descriptor.passage,
    testament,
    category: descriptor.category,
    collection: descriptor.collection,
    sort_order: index + 1,
    summary: `${descriptor.focus} This short lesson helps kids read, understand, and play through the passage.`,
    read_it: {
      reference: descriptor.passage,
      prompt: `Read ${descriptor.passage} and look for how this passage teaches: ${descriptor.focus}`,
    },
    tell_it: descriptor.tell,
    understand_it: `${descriptor.focus} This lesson keeps the main point simple: God is faithful, His Word is true, and His people can respond with faith and obedience.`,
    age_modes: ["age_5_7", "age_8_11", "teens"],
    age_5_7_explanation: makeAge57(descriptor),
    age_8_11_explanation: makeAge811(descriptor),
    teen_explanation: makeTeen(descriptor),
    key_truths: keyTruths(descriptor),
    life_application: makeLifeApplication(descriptor),
    quiz_questions: [
      {
        type: "multiple_choice",
        question: descriptor.quizQuestion,
        choices: uniqueChoices([
          descriptor.quizAnswer,
          "To make themselves look important",
          "Because God forgot His people",
          "Because obeying never matters",
        ]),
        answer: descriptor.quizAnswer,
        explanation: `The passage points us back to this answer: ${descriptor.quizAnswer}. It helps kids remember the main event and the truth it teaches.`,
      },
      {
        type: "true_false",
        question: `This lesson teaches that ${descriptor.focus.charAt(0).toLowerCase()}${descriptor.focus.slice(1)}`,
        answer: "True",
        explanation: "That is the plain lesson focus for this passage, stated in kid-friendly language.",
      },
    ],
    memory_verse: {
      reference: descriptor.memoryReference,
      prompt: `Remember ${descriptor.memoryReference} as a short anchor for this lesson.`,
    },
    discussion_questions: [
      `What happened in ${descriptor.title}?`,
      `What does this passage teach us about God or following Him?`,
      "Where could this lesson help you at home, school, church, or with friends?",
    ],
    activity: {
      title: descriptor.activityTitle,
      instructions: `Draw or act out the lesson scene, then name the one clear truth: ${descriptor.focus}`,
    },
    prayer_prompt: `Lord, help me learn from ${descriptor.title}. Teach me to trust You, listen to Your Word, and live this truth this week.`,
    tags: descriptor.tags,
    difficulty: descriptor.difficulty,
    estimated_minutes: descriptor.estimatedMinutes,
    related_lessons: relatedLessons,
  };
}

function makeAge57(descriptor) {
  return `${descriptor.title} reminds us that God is good and we can trust Him. ${simpleTruth(descriptor)}.`;
}

function makeAge811(descriptor) {
  return `${descriptor.title} shows that following God is not only knowing the story. It means learning this truth: ${descriptor.focus}`;
}

function makeTeen(descriptor) {
  return `${descriptor.title} gives older students room to think about faith under pressure. The passage teaches that ${descriptor.focus.charAt(0).toLowerCase()}${descriptor.focus.slice(1)} It also asks how belief becomes action.`;
}

function simpleTruth(descriptor) {
  const firstTag = descriptor.tags[0] || "faith";
  if (firstTag === "Jesus" || firstTag === "Jesus Saves") return "Jesus is the Savior";
  if (firstTag === "Prayer") return "we can talk to God";
  if (firstTag === "Courage") return "God helps us be brave";
  if (firstTag === "Forgiveness") return "God teaches mercy";
  if (firstTag === "God's Word") return "God's Word matters";
  return `${firstTag} matters`;
}

function makeLifeApplication(descriptor) {
  const topic = descriptor.tags[0] || "faith";
  return `A kid can practice this when ${topic.toLowerCase()} is needed: at school, with siblings, during disappointment, or when choosing between an easy wrong thing and a harder right thing.`;
}

function keyTruths(descriptor) {
  const truthByTag = new Map([
    ["Creation", "God made the world and it belongs to Him."],
    ["Faith", "Faith means trusting God enough to respond."],
    ["Courage", "Courage grows when we remember God is with His people."],
    ["Prayer", "God's people can bring real needs and feelings to Him."],
    ["Forgiveness", "Mercy is stronger than revenge."],
    ["Jesus", "Jesus is the promised Savior."],
    ["Jesus Saves", "Jesus gave Himself to save sinners."],
    ["Holy Spirit", "The Holy Spirit helps God's people live for Him."],
    ["God's Word", "God's Word teaches truth and calls for response."],
    ["Mission", "God sends His people to share good news."],
    ["Hope", "God keeps His promises and gives His people future hope."],
  ]);

  const truths = descriptor.tags.map((tag) => truthByTag.get(tag)).filter(Boolean);
  return uniqueChoices([
    descriptor.focus,
    ...truths,
    "God is faithful and His people can trust Him.",
  ]).slice(0, 4);
}

function uniqueChoices(values) {
  return [...new Set(values.filter(Boolean))];
}

function lessonSummary(descriptor, index) {
  const testament = oldTestamentBooks.has(descriptor.bibleBook) ? "Old Testament" : "New Testament";
  const starterFile = starterFiles.get(descriptor.id);
  return {
    lesson_id: descriptor.id,
    title: descriptor.title,
    file: starterFile || `library/${descriptor.id}.json`,
    bible_book: descriptor.bibleBook,
    passage: descriptor.passage,
    testament,
    category: descriptor.category,
    collection: descriptor.collection,
    tags: descriptor.tags,
    difficulty: descriptor.difficulty,
    estimated_minutes: descriptor.estimatedMinutes,
    sort_order: index + 1,
  };
}

mkdirSync(libraryRoot, { recursive: true });

for (const [index, descriptor] of lessons.entries()) {
  if (starterFiles.has(descriptor.id)) continue;
  const lesson = lessonFromDescriptor(descriptor, index);
  writeFileSync(join(libraryRoot, `${descriptor.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
}

const index = {
  schema_version: "bible-lesson-index/v1",
  library_version: "2026-07-06-first-wave",
  lesson_count: lessons.length,
  packs,
  lessons: lessons.map(lessonSummary),
};

writeFileSync(join(lessonsRoot, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

console.log(`Generated ${lessons.length} lesson index entries and ${lessons.length - starterFiles.size} lesson files.`);

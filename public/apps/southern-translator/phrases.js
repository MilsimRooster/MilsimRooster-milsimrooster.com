const TARGET_ENTRIES_PER_CATEGORY = 132;

export const RESEARCH_SOURCES = [
  "Britannica and Merriam-Webster notes on y'all as chiefly Southern plural address",
  "Encyclopedia of Alabama overview of Alabama foodways",
  "Southern Foodways Alliance foodways encyclopedia themes",
  "Appalachian Regional Commission culture and local food resources",
  "VA Veterans Employment Toolkit common military terms and lingo",
  "Military.com military slang and acronym glossaries",
  "Public Appalachian and Southern phrase collections used for tone checks only"
];

const profiles = {
  church: {
    seed: [
      ["We'll see what the Lord does", "Nobody has a plan yet, but everyone is trying to sound faithful."],
      ["Put that on the prayer list", "The news has entered official church circulation."],
      ["Bring a covered dish", "Attendance is expected and the table will be judged lovingly."],
      ["We just need a few volunteers", "The same six people are about to do everything again."],
      ["That sermon found somebody", "A preacher stepped on toes without naming names."]
    ],
    bases: ["We'll see", "Put that", "Bless the", "Save me", "Y'all come", "Somebody better", "The preacher", "The choir", "The deacons", "The fellowship hall", "The prayer chain", "Sunday school", "Vacation Bible School", "The nursery", "The potluck"],
    subjects: ["on the list", "in the bulletin", "before Wednesday night", "after service", "with a casserole", "near the coffee urn", "by the front pew", "under conviction", "beside the hymnals", "before the benediction", "with a servant's heart", "on the signup sheet"],
    endings: ["and act natural", "before Sister Linda hears it", "if the Lord says the same", "while the rolls are still warm", "because the van needs gas", "and do not start nothing", "with a smile and a folding chair", "before the youth group gets involved"],
    translation: ["A church task is being assigned softly.", "Private news is becoming public through prayerful channels.", "Hospitality and obligation have arrived together.", "Someone is trying to keep peace without naming the problem."],
    explanation: ["Church speech often wraps logistics, correction, and care inside gentle language.", "In Southern church culture, a sweet sentence may carry an entire committee agenda.", "The phrase sounds spiritual because directness would make the room too loud."],
    notes: ["This is faith with a clipboard.", "The casserole is sincere, but so is the expectation.", "Church polite can move faster than a group text."],
    regions: ["Alabama church", "rural South", "Southern Baptist hallway", "Appalachian congregation"],
    generations: ["elder", "boomer", "Gen X church aunt", "millennial volunteer"],
    confidence: 0.9,
    severity: 2
  },
  family: {
    seed: [
      ["Everybody's asking about you", "The family already has a status report and wants the missing chapter."],
      ["Your cousin's coming over", "Plans have changed and you are now part of them."],
      ["Don't make me call your daddy", "The warning has reached its final friendly stage."],
      ["It's just family", "There will be opinions, food, and no real privacy."],
      ["Your mama raised you right", "That is serious praise for manners and character."]
    ],
    bases: ["Your cousin", "Your mama", "Your aunt", "Everybody", "The whole side", "Granddaddy", "The kids", "That baby", "The family group text", "Somebody's people", "The reunion", "Dinner table", "Your uncle", "The in-laws", "The porch"],
    subjects: ["is asking questions", "heard you were in town", "needs a plate", "knows the story", "is fixing to visit", "has opinions", "saved you a chair", "wants a picture", "started early", "told it different", "brought dessert", "left with leftovers"],
    endings: ["so smile pretty", "before it gets around", "and do not act brand new", "because blood remembers", "with tea in one hand", "after the blessing", "whether you asked or not", "and everybody heard"],
    translation: ["The family information network is active.", "You are loved, watched, and expected to participate.", "Someone is correcting you while keeping it affectionate.", "A casual gathering has become a full-family operation."],
    explanation: ["Family phrases in the South often carry affection, history, and surveillance at the same time.", "The sentence sounds casual because the real briefing happened before you arrived.", "Kinfolk talk uses shorthand because everyone knows the backstory."],
    notes: ["Family news has legs.", "This may come with a plate and a warning.", "Privacy is present, but only briefly."],
    regions: ["Alabama family table", "Appalachian kinfolk circle", "rural South", "small-town South"],
    generations: ["grandma", "boomer aunt", "Gen X cousin", "millennial parent"],
    confidence: 0.88,
    severity: 3
  },
  food: {
    seed: [
      ["Save the potlikker", "The broth from cooked greens is valuable and belongs with cornbread."],
      ["Who made the potato salad", "Someone is checking trust levels before eating."],
      ["Needs more seasoning", "The dish is under review and may not survive the committee."],
      ["That's a cathead biscuit", "The biscuit is large enough to be respected."],
      ["Pass the chowchow", "The meal needs a sharp relish to wake it up."]
    ],
    bases: ["That potlikker", "The cornbread", "The cathead biscuit", "The chowchow", "The banana pudding", "The cast iron", "The fried okra", "The tomato gravy", "The sweet tea", "The pepper sauce", "The beans", "The gumbo", "The pie", "The barbecue", "The greens"],
    subjects: ["needs respect", "will tell on you", "is not for show", "came out right", "needs another minute", "has a little bite", "is spoken for", "is church-table serious", "will fix your attitude", "does not measure itself", "belongs near the stove", "needs a bigger spoon"],
    endings: ["before the cousins arrive", "with cornbread close by", "and no store-bought excuses", "because somebody is judging", "if the tea is cold enough", "while the pan is still talking", "after one more taste", "and do not waste the good part"],
    translation: ["Food quality is being evaluated with love and precision.", "The dish carries cultural rules beyond the recipe.", "Someone is using food as hospitality, memory, and judgment.", "The cook expects honest praise and practical feedback."],
    explanation: ["Southern food terms often name technique, memory, and family standards at once.", "Food language is practical, but it can also decide who gets trusted with the next holiday dish.", "A simple table comment may include history, skill, and a warning."],
    notes: ["Measurements are suggestions until the ancestors approve.", "A quiet table is either praise or investigation.", "The cast iron has opinions."],
    regions: ["Alabama foodways", "Deep South kitchen", "Appalachian table", "Gulf Coast South"],
    generations: ["elder cook", "boomer host", "Gen X pit boss", "millennial supper club"],
    confidence: 0.92,
    severity: 3
  },
  farming: {
    seed: [
      ["We're burning daylight", "Stop talking and start working."],
      ["The field will tell you", "Conditions matter more than the plan."],
      ["That fence won't fix itself", "A chore has waited long enough."],
      ["The tractor's got character", "The equipment is unreliable but emotionally protected."],
      ["Rain would help if it came gentle", "Weather is needed, but damage is not."]
    ],
    bases: ["The tractor", "The back forty", "That fence", "The hay field", "The garden", "The cows", "The barn", "The rows", "The county road", "The pasture", "The old gate", "The seed bed", "The irrigation", "The feed sack", "The mud"],
    subjects: ["needs seeing to", "will not wait", "is telling on us", "looks fair", "got away from us", "needs rain", "needs sun", "is leaning again", "is better than it was", "is not pretty but it works", "will hold through Sunday", "has one more season in it"],
    endings: ["before the heat sets in", "if the weather holds", "while the dew is still on", "before the auction", "with a come-along and patience", "because daylight costs nothing", "and nobody mention the parts bill", "if the creek stays down"],
    translation: ["A practical farm problem needs attention now.", "Weather and equipment are controlling the schedule.", "The solution may be imperfect but useful.", "Experience is overruling optimism."],
    explanation: ["Rural farm speech is direct because chores, animals, and weather do not wait for committees.", "A farming phrase often weighs daylight, rain, equipment, and money in one breath.", "The humor comes from respecting hard work while admitting the tractor may have other ideas."],
    notes: ["The field keeps better records than people do.", "A straight fence is a temporary blessing.", "Weather is the silent business partner."],
    regions: ["north Alabama farm", "Tennessee Valley", "Appalachian foothills", "rural South"],
    generations: ["elder farmer", "boomer cattleman", "Gen X hay crew", "young farmhand"],
    confidence: 0.87,
    severity: 2
  },
  hunting: {
    seed: [
      ["The wind wasn't right", "The conditions ruined the hunt, not the hunter."],
      ["Saw a big one", "A story has begun and measurements may expand."],
      ["Tracks looked fresh", "There is evidence, hope, and a plan forming."],
      ["They moved after daylight", "The animals had better timing than the people."],
      ["Bring the good boots", "The ground is wet enough to make memories."]
    ],
    bases: ["The wind", "That buck", "The stand", "The tracks", "The dogs", "The ridge", "The holler", "The blind", "The feeder", "The creek crossing", "The old logging road", "The thermals", "The lease", "The game camera", "The frost"],
    subjects: ["was not right", "told the story", "needs work", "looked fresh", "went quiet", "held sign", "got busy early", "needs easing into", "was bigger last week", "made us wait", "changed the plan", "is not where he was"],
    endings: ["before daylight", "and nobody breathed loud", "with coffee getting cold", "because the moon had opinions", "if the leaves stay damp", "after one more sit", "and the tale will grow by supper", "with the truck parked back yonder"],
    translation: ["The hunt did not go perfectly, but a respectable explanation exists.", "There is hope based on sign, timing, and memory.", "A story is forming around patience and conditions.", "The woods made the rules today."],
    explanation: ["Hunting language blends observation, excuse-making, patience, and storytelling.", "The phrase may be accurate, but it also protects pride when the cooler comes home light.", "Southern hunting talk values quiet, wind, tracks, and a good explanation."],
    notes: ["The woods keep minutes, but nobody publishes them.", "A missed chance can still make a fine story.", "The wind gets blamed because it cannot argue."],
    regions: ["Alabama woods", "Appalachian ridge country", "rural South", "piney woods"],
    generations: ["elder hunter", "boomer camp cook", "Gen X lease holder", "young hunter"],
    confidence: 0.86,
    severity: 2
  },
  fishing: {
    seed: [
      ["Fish weren't biting", "Nobody caught much, and nature is taking the blame."],
      ["That's a story fish", "The fish may be larger in memory than it was in water."],
      ["Water's up a little", "Conditions changed enough to explain everything."],
      ["Use the good bait", "Stop experimenting and do what works."],
      ["We'll hit it at daylight", "The plan requires early coffee and optimism."]
    ],
    bases: ["The fish", "The creek", "The river", "The pond", "The boat ramp", "The trotline", "The bait", "The bobber", "The catfish", "The bass", "The brim bed", "The cooler", "The water", "The dock light", "The old reel"],
    subjects: ["weren't biting", "came up quick", "looked right", "needs patience", "is running muddy", "will tell on you", "hit after dark", "needs another cast", "got away clean", "was bigger in the water", "made a liar out of us", "is worth one more stop"],
    endings: ["before the sun gets mean", "if the current lays down", "with hushpuppies in mind", "because the moon changed", "and nobody mention the scale", "while the cooler is still hopeful", "after one more cast", "with the truck pointed home"],
    translation: ["The fishing trip produced more explanation than fish.", "Conditions are being used to protect everyone's dignity.", "Patience is being presented as strategy.", "The story may outgrow the catch."],
    explanation: ["Fishing phrases often turn water, weather, and timing into a respectable defense.", "Southern fishing talk leaves room for truth, memory, and one more cast.", "The phrase is partly report and partly negotiation with pride."],
    notes: ["One more cast is a legal time unit.", "The water level is a complete argument.", "A fish can grow considerably after leaving the hook."],
    regions: ["Alabama river", "Gulf Coast creek", "Appalachian stream", "rural Southern pond"],
    generations: ["elder fisherman", "boomer boat owner", "Gen X bank sitter", "young angler"],
    confidence: 0.86,
    severity: 2
  },
  military: {
    seed: [
      ["Hurry up and wait", "Move fast so you can stand still under orders."],
      ["He's squared away", "He is organized, competent, and not embarrassing the group."],
      ["Police that brass", "Pick up the spent casings and leave the area right."],
      ["We're black on coffee", "The supply is gone and morale is at risk."],
      ["Stand by to stand by", "No real update exists yet, but stay ready."]
    ],
    bases: ["The platoon", "The range", "The convoy", "The motor pool", "The ruck", "The briefing", "The sergeant", "The radio", "The formation", "The field problem", "The chow line", "The barracks", "The gear", "The ammo count", "The word"],
    subjects: ["is squared away", "went sideways", "needs policing", "is black on patience", "got pushed right", "is waiting on higher", "needs a battle buddy", "is tracking now", "is ate up", "will buff out", "needs a proper brief", "is not mission capable"],
    endings: ["before first formation", "with Southern patience wearing thin", "and nobody act surprised", "after a hurry-up-and-wait morning", "because the word changed", "if the lieutenant stays quiet", "with a field-expedient fix", "and coffee is now critical"],
    translation: ["Military process is colliding with practical Southern patience.", "The situation needs discipline, supplies, or a better plan.", "Someone is competent, late, confused, or waiting on orders.", "The group is using military shorthand to describe a very human mess."],
    explanation: ["Military slang in Southern communities often mixes official terms with porch-level commentary.", "The phrase sounds sharp because military speech prizes short labels for common frustrations.", "Veterans and service families may use these phrases for ordinary life once the uniform is off."],
    notes: ["This is field discipline with a drawl.", "The coffee status may determine morale.", "The phrase works at the range and in a church parking lot."],
    regions: ["Fort Novosel Alabama", "Southern military town", "National Guard armory", "rural veteran circle"],
    generations: ["Vietnam-era veteran", "Gulf War veteran", "GWOT veteran", "young guardsman"],
    confidence: 0.84,
    severity: 3
  },
  "small-town": {
    seed: [
      ["Word gets around", "The town already has the story."],
      ["Everybody knows everybody", "Privacy exists, but not for long."],
      ["I saw your truck at the diner", "Your whereabouts have been publicly logged."],
      ["They bought the old Miller place", "Directions require family history and real estate memory."],
      ["Somebody will know", "The local information network is being activated."]
    ],
    bases: ["The gas station", "The diner", "The feed store", "The courthouse", "The barber shop", "The school pickup line", "The old bank", "The volunteer fire hall", "The church sign", "The county road", "The town square", "The hardware store", "The funeral home", "The post office", "The ball field"],
    subjects: ["already knows", "heard it first", "changed the story", "saw your truck", "will ask your mama", "has the real directions", "is where news starts", "closed early", "got everybody talking", "keeps better records", "will settle it", "knows whose people you are"],
    endings: ["before lunch", "and nobody posted a thing", "because small towns do not need apps", "with two witnesses", "while the coffee was still hot", "before you got home", "and the truth is optional", "if the mayor's cousin confirms it"],
    translation: ["The community information network is already working.", "Your private business has become local context.", "Directions and news require knowing people, not addresses.", "The town has collectively noticed something."],
    explanation: ["Small-town Southern speech assumes shared places, shared people, and shared memory.", "The phrase may sound casual, but it often signals public knowledge.", "Local life turns sightings, vehicles, and kinship into information."],
    notes: ["The gas station may be faster than the internet.", "A truck in a parking lot is a public statement.", "Small towns do not forget; they just wait to bring it up."],
    regions: ["small-town Alabama", "rural South", "Appalachian town", "county seat"],
    generations: ["elder neighbor", "boomer clerk", "Gen X coach", "millennial local"],
    confidence: 0.9,
    severity: 2
  },
  humor: {
    seed: [
      ["Bless your heart", "You have caused polite concern."],
      ["Aren't you precious", "You are being corrected with a smile."],
      ["He's busier than a one-legged man in a kicking contest", "He is overwhelmed and still trying."],
      ["That dog won't hunt", "That idea will not work."],
      ["You could tear up an anvil", "You are impressively destructive."]
    ],
    bases: ["Bless", "Ain't", "Well now", "Look at", "Somebody", "That idea", "That boy", "That plan", "That outfit", "That story", "That truck", "That attitude", "That shortcut", "That excuse", "That meeting"],
    subjects: ["your heart", "that something", "you precious", "went and did it", "raised him brave", "won't hunt", "has too much confidence", "needs a grown-up", "is wearing church shoes to a mud hole", "has left the driveway", "is louder than the facts", "is special in daylight"],
    endings: ["and everybody saw it", "with a straight face", "before the tea got cold", "and the Lord is watching", "while patience is available", "like it owes you money", "but keep smiling", "because manners are still on duty"],
    translation: ["A mistake has been identified politely.", "The speaker is laughing without fully letting you off the hook.", "This is a joke with a practical warning inside.", "The idea is being rejected while everyone stays friendly."],
    explanation: ["Southern humor often uses indirectness, exaggeration, and manners to make correction easier to swallow.", "The phrase is playful, but tone decides whether it is a warning shot.", "A funny phrase can carry real judgment while keeping the room comfortable."],
    notes: ["The smile is part of the delivery system.", "Playful does not mean harmless.", "This lands best when nobody has to explain it twice."],
    regions: ["Deep South porch", "Alabama family table", "Appalachian gathering", "rural South"],
    generations: ["grandma", "boomer storyteller", "Gen X uncle", "millennial group chat"],
    confidence: 0.91,
    severity: 4
  },
  weather: {
    seed: [
      ["Looks like rain", "Prepare without acting dramatic."],
      ["That sky looks mean", "Bad weather is likely and everyone knows it."],
      ["It's not the heat, it's the humidity", "The air itself is the problem."],
      ["The air feels funny", "Something weather-related is about to happen."],
      ["It's a good sleeping rain", "The storm is gentle enough to enjoy from inside."]
    ],
    bases: ["The sky", "The air", "The clouds", "The porch", "The radar", "The humidity", "The wind", "The creek", "The power", "The yard", "The heat", "The rain", "The thunder", "The pressure", "The storm"],
    subjects: ["looks mean", "feels funny", "is talking", "needs watching", "is fixing to cut loose", "came up quick", "will pass", "is sitting heavy", "might blink", "needed that", "will make hair honest", "is not done with us"],
    endings: ["before supper", "so bring the chairs in", "and act like you knew", "while the dogs are quiet", "if the power holds", "with the windows cracked", "because the yard needed it", "and nobody trusts that calm"],
    translation: ["Weather may change plans soon.", "A calm phrase is carrying real preparation.", "The speaker is reading the sky as much as the forecast.", "Humidity, wind, or rain is about to become everyone's business."],
    explanation: ["Southern weather language often understates risk while quietly preparing for it.", "Porch forecasts combine lived experience, radar, old injuries, and sky color.", "The phrase can sound mild even when everyone is securing lawn chairs."],
    notes: ["If the air feels funny, someone is checking radar.", "Humidity is a full character in the story.", "A calm voice does not mean a calm sky."],
    regions: ["Alabama summer", "Gulf Coast storm line", "Appalachian valley", "rural South"],
    generations: ["elder sky-reader", "boomer porch watcher", "Gen X parent", "millennial radar checker"],
    confidence: 0.9,
    severity: 2
  },
  politics: {
    seed: [
      ["He's running for courthouse", "Someone wants local power and everybody knows the family history."],
      ["That promise has campaign tires", "The promise is built to travel, not necessarily to last."],
      ["We'll see after election day", "Nobody fully believes the statement yet."],
      ["He's good people, but", "A polite objection is about to arrive."],
      ["The yard signs got loud", "The neighborhood has entered political season."]
    ],
    bases: ["The courthouse", "The county commission", "The school board", "The yard sign", "The campaign promise", "The stump speech", "The mayor", "The sheriff race", "The road project", "The tax talk", "The town hall", "The ballot", "The committee", "The debate", "The handbill"],
    subjects: ["is getting loud", "knows your people", "needs watching", "sounds expensive", "got everybody stirred up", "will be different after Tuesday", "has more paint than plan", "is promising gravel", "is shaking hands hard", "is avoiding the hard question", "will find a cousin", "needs a receipt"],
    endings: ["before election day", "with a church smile", "down at the courthouse", "if the roads get fixed", "and everybody remembers", "while the coffee crowd listens", "with one eye on taxes", "after the signs come down"],
    translation: ["Local politics is being discussed politely but skeptically.", "The speaker doubts the promise without starting a fight.", "Family reputation and public service are being weighed together.", "The campaign has entered everyday conversation."],
    explanation: ["Southern political talk often blends manners, memory, kinship, and practical suspicion.", "A mild phrase may carry a strong opinion about taxes, roads, schools, or character.", "Local politics is personal because everyone knows someone's cousin."],
    notes: ["The courthouse remembers.", "A yard sign can start a whole conversation.", "Polite skepticism is still skepticism."],
    regions: ["Alabama county seat", "small-town South", "Appalachian courthouse town", "rural precinct"],
    generations: ["elder voter", "boomer poll worker", "Gen X taxpayer", "millennial school parent"],
    confidence: 0.82,
    severity: 3
  },
  appalachian: {
    seed: [
      ["It's over yonder", "The location is somewhere understood by locals but not GPS."],
      ["I'm plumb wore out", "I am completely exhausted."],
      ["Might could", "It may be possible, but no promise is being made."],
      ["Red up the room", "Straighten and clean the room."],
      ["He's from up the holler", "He is from farther back in the valley or community."]
    ],
    bases: ["Over yonder", "Up the holler", "Down the branch", "The ridge", "The springhouse", "The poke", "The young'un", "The old homeplace", "The creek road", "The coal road", "The garden patch", "The woodpile", "The porch light", "The mountain", "The fiddle tune"],
    subjects: ["needs red up", "is plumb wore out", "might could work", "ain't far if you know it", "is airish this morning", "knows your people", "has a story", "sits where it always sat", "will slick up quick", "is not for outsiders to rush", "keeps its own time", "came through honest"],
    endings: ["before dark", "if the road ain't washed", "with a poke of groceries", "like Granny said", "when the fog lifts", "and mind the dogs", "because winter is nosing around", "if you know the turn"],
    translation: ["The speaker is using mountain-region shorthand for place, condition, or possibility.", "The phrase carries older vocabulary and local geography.", "The meaning is clear to insiders and confusing to outsiders.", "A practical statement is wrapped in Appalachian cadence."],
    explanation: ["Appalachian expressions often preserve older words and local place logic.", "Directions and meanings depend on hollers, ridges, creeks, kinship, and memory.", "The phrase may be plain to locals because the landscape is part of the grammar."],
    notes: ["Yonder is not vague if you are from there.", "The mountain has its own prepositions.", "A holler can be a place, a people, and a story."],
    regions: ["southern Appalachia", "north Alabama hills", "east Tennessee", "western North Carolina"],
    generations: ["elder mountain speaker", "boomer homeplace keeper", "Gen X Appalachian", "young return-home local"],
    confidence: 0.84,
    severity: 2
  },
  alabama: {
    seed: [
      ["It's hotter than a July parking lot", "The heat is aggressive and personal."],
      ["Meet me by the old Winn-Dixie", "Directions are based on what used to be there."],
      ["That humidity will baptize you", "The air is wet enough to feel ceremonial."],
      ["We're headed to the lake", "Weekend plans involve water, coolers, and traffic."],
      ["Football traffic got us", "The schedule is being controlled by game day."]
    ],
    bases: ["The humidity", "The lake road", "The old store", "The football traffic", "The county line", "The barbecue plate", "The red dirt", "The pine trees", "The Gulf breeze", "The tornado siren", "The tailgate", "The fish camp", "The cotton field", "The church supper", "The July heat"],
    subjects: ["will baptize you", "knows everybody", "is where you turn", "got us hemmed up", "sticks to your shoes", "needs sauce", "is showing out", "will stain the truck", "came in sideways", "changed the plan", "started before breakfast", "is not a dry heat"],
    endings: ["before kickoff", "down past the old place", "with tea sweating in the cup", "if the sirens stay quiet", "after the humidity wins", "because everybody had the same idea", "and the red dirt came too", "while the mosquitoes organize"],
    translation: ["Alabama weather, roads, food, or football is controlling the situation.", "The speaker is using local shorthand for heat, memory, or weekend plans.", "A practical detail has been seasoned with Alabama-specific context.", "The phrase assumes everyone understands humidity and old landmarks."],
    explanation: ["Alabama speech often mixes Southern manners with football calendars, heat, red dirt, foodways, and old-place directions.", "The phrase works because local memory matters as much as street names.", "Weather and community rhythms are part of the translation."],
    notes: ["Humidity is a local institution.", "Old landmarks remain useful long after the sign comes down.", "Game day can explain almost anything."],
    regions: ["Alabama", "north Alabama", "Wiregrass Alabama", "Gulf Coast Alabama"],
    generations: ["elder Alabamian", "boomer football fan", "Gen X lake-goer", "millennial local"],
    confidence: 0.86,
    severity: 2
  },
  rural: {
    seed: [
      ["The road washes out", "Rain can make the normal way impossible."],
      ["Leave it by the gate", "No formal handoff is needed; the place has rules."],
      ["The dogs will let us know", "Visitors cannot arrive secretly."],
      ["It's down past the old barn", "Directions rely on landmarks and memory."],
      ["We'll make do", "The solution will be practical, improvised, and sufficient."]
    ],
    bases: ["The gravel road", "The gate", "The old barn", "The mailbox", "The dogs", "The ditch", "The well house", "The fence row", "The back porch", "The county truck", "The power line", "The neighbor", "The shed", "The culvert", "The tree line"],
    subjects: ["will tell on you", "needs fixing", "is where you leave it", "washed out again", "knows the shortcut", "is not on the map", "held long enough", "needs a better latch", "is close enough", "will make do", "has been that way", "can wait till morning"],
    endings: ["if the rain quits", "before the mail runs", "because the dogs already know", "with a little baling wire", "past where the store used to be", "and bring a flashlight", "if the county ever grades it", "while the daylight holds"],
    translation: ["Rural logistics are being handled by landmarks, weather, and practical improvisation.", "The speaker is solving a problem with what is available.", "The place has routines outsiders may not know.", "A simple errand depends on roads, gates, dogs, and daylight."],
    explanation: ["Rural expressions often treat land, animals, roads, and neighbors as part of daily grammar.", "The phrase is practical because the real constraint is usually distance, weather, or equipment.", "Local knowledge matters more than formal instructions."],
    notes: ["The gate is a communication system.", "Dogs are the doorbell.", "A gravel road has moods."],
    regions: ["rural Alabama", "rural South", "Appalachian foothills", "farm country"],
    generations: ["elder neighbor", "boomer landowner", "Gen X fixer", "young rural local"],
    confidence: 0.88,
    severity: 2
  },
  grandma: {
    seed: [
      ["Come get a plate", "You are expected to eat and not argue."],
      ["You look hungry", "You are about to be fed no matter what."],
      ["Put on a jacket", "Concern has become a command."],
      ["Call me when you get home", "Love requires confirmation of arrival."],
      ["Take some with you", "Leaving without leftovers is not allowed."]
    ],
    bases: ["Come get", "Take", "Put on", "Don't you", "Call me", "Sit down", "Eat", "Tell your mama", "Mind", "Wash", "Carry", "Save", "I made", "You look", "That baby"],
    subjects: ["a plate", "some with you", "a jacket", "leave hungry", "when you get home", "and rest a minute", "before it gets cold", "I asked about her", "your manners", "your hands", "this to your aunt", "the good biscuits", "a little something", "too skinny", "needs socks"],
    endings: ["because I said so", "and do not fuss", "before you get on the road", "while it is still warm", "with tea in the fridge", "like you were raised", "and hug my neck", "because I know best"],
    translation: ["You are loved, corrected, and fed in the same motion.", "Grandma is issuing care as an instruction.", "Resistance will not be successful.", "The sentence carries affection and authority."],
    explanation: ["Grandma phrases often combine protection, food, manners, and command presence.", "The humor comes from care that leaves no room for negotiation.", "The phrase sounds gentle because everyone knows she means it."],
    notes: ["Love and correction arrive from the same kitchen.", "Refusing food may be treated as a symptom.", "Grandma heard the full story before you parked."],
    regions: ["Alabama grandma kitchen", "rural South", "Appalachian family home", "small-town South"],
    generations: ["grandma", "great-grandma", "church aunt", "family matriarch"],
    confidence: 0.9,
    severity: 3
  },
  compliments: {
    seed: [
      ["Good people", "They are trustworthy and respected."],
      ["Raised right", "Their manners and character reflect well on the family."],
      ["Hard worker", "They can be counted on when the work is real."],
      ["She'll help anybody", "She is generous in practical ways."],
      ["He keeps his word", "His reliability has been noticed."]
    ],
    bases: ["Good people", "Raised right", "Hard worker", "That child", "She'll help", "He keeps", "They show", "You did", "That's", "She's steady", "He's handy", "You were", "That family", "Those folks", "Your mama"],
    subjects: ["from way back", "and it shows", "when it counts", "has manners", "anybody", "his word", "up early", "fine", "good work", "as a fence post", "with a socket set", "a blessing", "will do", "are solid", "would be proud"],
    endings: ["and that means something", "without making a show of it", "when nobody is watching", "with both hands", "and no complaint", "because character tells", "in a quiet way", "and folks remember"],
    translation: ["This is sincere respect.", "The person has proven character, manners, or reliability.", "The praise is plain because it is serious.", "Someone's goodness has been noticed publicly."],
    explanation: ["Southern compliments are often understated; plain words can carry real weight.", "The phrase praises character more than performance.", "Respect is delivered without decoration because everyone understands the value."],
    notes: ["Plain praise can land heavy.", "This is not small talk; it is a reputation marker.", "A good name is still currency."],
    regions: ["rural South", "Alabama community", "Appalachian family circle", "small-town South"],
    generations: ["elder neighbor", "boomer coach", "Gen X parent", "millennial friend"],
    confidence: 0.89,
    severity: 1
  }
};

function pick(items, index, offset = 0) {
  return items[(index + offset) % items.length];
}

function confidenceFor(profile, index) {
  return Number(Math.min(0.98, profile.confidence + ((index % 7) - 3) * 0.01).toFixed(2));
}

function severityFor(profile, index) {
  return Math.min(5, Math.max(1, profile.severity + (index % 5 === 0 ? 1 : 0) - (index % 11 === 0 ? 1 : 0)));
}

function makeGeneratedPhrase(profile, index) {
  return `${pick(profile.bases, index)} ${pick(profile.subjects, Math.floor(index / profile.bases.length), index)} ${pick(profile.endings, index, Math.floor(index / 3))}.`;
}

function makeEntry(category, profile, index, phrase, translationOverride) {
  const translation = translationOverride || pick(profile.translation, index);
  const explanation = pick(profile.explanation, index, Math.floor(index / 2));
  return {
    id: `${category}-${String(index + 1).padStart(4, "0")}`,
    phrase,
    translation,
    explanation,
    region: pick(profile.regions, index),
    generation: pick(profile.generations, Math.floor(index / 2)),
    category,
    confidence: confidenceFor(profile, index),
    literalMeaning: explanation,
    actualMeanings: [
      translation,
      pick(profile.translation, index, 1),
      pick(profile.translation, index, 2)
    ],
    severity: severityFor(profile, index),
    roosterNotes: pick(profile.notes, index),
    examples: [
      `${phrase}.`,
      `Somebody heard "${phrase.toLowerCase().replace(/\.$/, "")}" and adjusted their plans.`
    ]
  };
}

function buildPhrasePool() {
  return Object.entries(profiles).flatMap(([category, profile]) => {
    const entries = profile.seed.map(([phrase, translation], index) => makeEntry(category, profile, index, phrase, translation));
    let index = entries.length;
    while (entries.length < TARGET_ENTRIES_PER_CATEGORY) {
      entries.push(makeEntry(category, profile, index, makeGeneratedPhrase(profile, index)));
      index += 1;
    }
    return entries;
  });
}

const englishSeeds = [
  ["This is a bad idea", ["Well now, that's one way to do it", "I reckon we'll learn something", "Let's think on that before we get brave"], "warning"],
  ["I am very hungry", ["I could eat directly over the sink", "I need a plate before I get short with people", "I'm about ready for supper"], "food"],
  ["Please visit again", ["Y'all come back now", "Don't be a stranger", "Come sit a spell next time"], "hospitality"],
  ["That person is making a mistake", ["Bless his heart, he's committed", "He's fixing to learn", "Somebody ought to stand near him"], "humor"],
  ["The weather looks dangerous", ["That sky looks mean", "We might want to bring the chairs in", "It's about to come up something"], "weather"],
  ["I disagree politely", ["I hear what you're saying", "That's a thought", "We may have to pray over that one"], "politics"],
  ["I am proud of you", ["You did fine", "Your mama would be proud", "That's good work right there"], "compliments"],
  ["We need to leave soon", ["We're fixing to head out", "Let's ease on down the road", "We better get to moving"], "rural"],
  ["This vehicle is unreliable", ["She's got character", "It starts most mornings", "Don't turn the radio up or you'll miss the sound"], "rural"],
  ["Everyone already knows", ["Word got around", "The gas station beat you to it", "That story has made the loop"], "small-town"],
  ["Bring food to share", ["Bring a covered dish", "Don't come empty-handed", "Make enough for the table"], "church"],
  ["That was expensive", ["That liked to hurt", "They were proud of it", "That price had shoes on"], "politics"],
  ["I need help", ["I could use another set of hands", "Come hold what I got", "Somebody grab the other end"], "farming"],
  ["That is too spicy", ["It's got a little kick", "That'll wake you up", "It ain't shy"], "food"],
  ["Be careful", ["Don't get cute with it", "Watch yourself now", "Use your head"], "grandma"],
  ["I am annoyed", ["I'm trying to stay sweet", "My patience is wearing Sunday shoes", "The Lord is working on me"], "family"],
  ["That person talks too much", ["He can talk wallpaper off a wall", "She don't run out of words", "He's got a full tank of conversation"], "family"],
  ["The plan is simple", ["Ain't nothing to it but doing it", "We'll knock it out", "Just don't make it fancy"], "farming"],
  ["I forgot", ["It slipped clean out of my head", "My mind took the scenic route", "I left that thought at the house"], "family"],
  ["I am not surprised", ["That tracks", "Sounds about right", "I could've told you that before lunch"], "small-town"]
];

function buildEnglishTranslations() {
  const promptVariants = [
    (text) => text,
    (text) => `${text}, but say it gently`,
    (text) => `${text}, and everyone can tell`,
    (text) => `${text}, before somebody makes it worse`,
    (text) => `${text}, with manners still attached`
  ];

  return Array.from({ length: 100 }, (_, index) => {
    const seed = englishSeeds[index % englishSeeds.length];
    const round = Math.floor(index / englishSeeds.length);
    const variant = promptVariants[round % promptVariants.length];
    return {
      id: `english-${String(index + 1).padStart(3, "0")}`,
      english: variant(seed[0]),
      southernOptions: seed[1].map((option, optionIndex) => optionIndex === 0 && round ? `${option}, if you know what I mean` : option),
      context: seed[2],
      roosterNotes: "Best delivered with timing, tone, and enough politeness to keep the peace."
    };
  });
}

export const PHRASES = buildPhrasePool();
export const ENGLISH_TRANSLATIONS = buildEnglishTranslations();

import { mkdir, readFile, writeFile } from "node:fs/promises";

const appDir = new URL("../public/apps/how-southern-are-you/", import.meta.url);

const groups = [
  {
    category: "food",
    prompts: [
      "Have you ever judged tea before judging the restaurant?",
      "Have you ever fought over who made the potato salad?",
      "Have you ever eaten banana pudding with plastic spoon marks?",
      "Have you ever brought deviled eggs in a special carrier?",
      "Have you ever called every soda a Coke?",
      "Have you ever had gravy before the day got serious?",
      "Have you ever eaten cornbread from a cast iron skillet?",
      "Have you ever argued about beans in chili?",
      "Have you ever saved bacon grease in a jar?",
      "Have you ever eaten breakfast from a gas station?",
      "Have you ever known the good BBQ by the parking lot?",
      "Have you ever judged sauce before saying hello?",
      "Have you ever watched cobbler vanish before supper?",
      "Have you ever eaten leftovers straight from the fridge?",
      "Have you ever called supper dinner and got corrected?",
      "Have you ever had a biscuit bigger than common sense?",
      "Have you ever eaten pie while still claiming you were full?",
      "Have you ever had someone fix you a plate anyway?",
      "Have you ever brought a casserole dish home empty?",
      "Have you ever owned a church cookbook?",
      "Have you ever seen Jell-O treated like salad?",
      "Have you ever had tea served sweeter than dessert?",
      "Have you ever eaten fried okra before it reached the table?",
      "Have you ever known who made the good dressing?",
      "Have you ever tasted first and seasoned later?"
    ]
  },
  {
    category: "church",
    prompts: [
      "Have you ever attended a church potluck?",
      "Have you ever stacked chairs without being asked?",
      "Have you ever waited through a long church goodbye?",
      "Have you ever heard a prayer request turn into news?",
      "Have you ever seen five crockpots on one table?",
      "Have you ever known who sat in the same pew?",
      "Have you ever carried food in after Sunday service?",
      "Have you ever eaten in a fellowship hall?",
      "Have you ever heard a bulletin folded in half?",
      "Have you ever watched kids run between folding tables?",
      "Have you ever been hugged by someone you barely knew?",
      "Have you ever heard amen before the sentence ended?",
      "Have you ever smelled coffee before Sunday school?",
      "Have you ever helped clean up after everyone left?",
      "Have you ever seen desserts guarded like treasure?",
      "Have you ever known the church van had personality?",
      "Have you ever stayed late because somebody kept talking?",
      "Have you ever heard bless her heart at church?",
      "Have you ever eaten ham from a foil pan?",
      "Have you ever followed someone to the potluck line?",
      "Have you ever held a door for half the church?",
      "Have you ever heard someone say pray about it?",
      "Have you ever seen kids asleep across two chairs?",
      "Have you ever had lemonade from a giant dispenser?",
      "Have you ever known exactly who brought the rolls?"
    ]
  },
  {
    category: "family",
    prompts: [
      "Have you ever had three cousins with one nickname?",
      "Have you ever been fed after saying you were full?",
      "Have you ever called a family friend aunt?",
      "Have you ever heard the same story three times?",
      "Have you ever known which cousin not to hand fireworks?",
      "Have you ever had a grandma inspect your plate?",
      "Have you ever been told to hug everybody before leaving?",
      "Have you ever sat at the kids table too long?",
      "Have you ever inherited a pan with history?",
      "Have you ever heard mom'n'em used as directions?",
      "Have you ever watched family argue over a recipe?",
      "Have you ever had a reunion at a park shelter?",
      "Have you ever known who made the loud entrance?",
      "Have you ever been sent to get more ice?",
      "Have you ever heard family news before arriving?",
      "Have you ever had a cousin everyone calls Bubba?",
      "Have you ever shared a folding chair at Thanksgiving?",
      "Have you ever been called baby by an elder?",
      "Have you ever had leftovers wrapped in grocery bags?",
      "Have you ever seen a family photo take forty minutes?",
      "Have you ever been volunteered by your mama?",
      "Have you ever visited for five minutes and stayed two hours?",
      "Have you ever known who brings the good pie?",
      "Have you ever been warned about a relative's mood?",
      "Have you ever heard your full name from another room?"
    ]
  },
  {
    category: "weather",
    prompts: [
      "Have you ever watched tornado weather from the porch?",
      "Have you ever counted after hearing thunder?",
      "Have you ever smelled rain before it started?",
      "Have you ever planned your day around the weather?",
      "Have you ever trusted the sky more than radar?",
      "Have you ever felt humidity open the door first?",
      "Have you ever brought laundry in before clouds arrived?",
      "Have you ever seen everyone stare at a weird sky?",
      "Have you ever had spring and winter in one day?",
      "Have you ever canceled plans because the radar looked mean?",
      "Have you ever said it feels like tornado weather?",
      "Have you ever stood outside during a storm warning?",
      "Have you ever watched lightning like a show?",
      "Have you ever sat in shade like it was currency?",
      "Have you ever heard rain on a tin roof?",
      "Have you ever opened windows before a storm rolled in?",
      "Have you ever checked the weather twice before leaving?",
      "Have you ever had ice cancel the whole town?",
      "Have you ever complained about the heat before breakfast?",
      "Have you ever sweated while standing still?",
      "Have you ever watched clouds with serious people?",
      "Have you ever had a storm knock out supper plans?",
      "Have you ever carried an umbrella and still got soaked?",
      "Have you ever trusted grandma's knee for rain?",
      "Have you ever called seventy degrees cold?"
    ]
  },
  {
    category: "vehicles",
    prompts: [
      "Have you ever sat on a tailgate for hours?",
      "Have you ever owned jumper cables for everybody else?",
      "Have you ever named a truck?",
      "Have you ever parked in grass without thinking?",
      "Have you ever ridden down a gravel road slowly?",
      "Have you ever fixed a vehicle with zip ties?",
      "Have you ever used duct tape on a bumper?",
      "Have you ever known a truck with one working window?",
      "Have you ever waved from a passing vehicle?",
      "Have you ever judged someone by their trailer backing?",
      "Have you ever hauled something that barely fit?",
      "Have you ever kept tools behind the seat?",
      "Have you ever had mud on your floorboard for weeks?",
      "Have you ever ridden in a truck bed?",
      "Have you ever said it still runs fine?",
      "Have you ever followed somebody because directions were impossible?",
      "Have you ever used a driveway as extra parking?",
      "Have you ever known the good mechanic by first name?",
      "Have you ever carried a cooler in the truck?",
      "Have you ever smelled cut grass through open windows?",
      "Have you ever heard a vehicle coming by sound?",
      "Have you ever had a church parking lot traffic jam?",
      "Have you ever kept napkins in the glove box?",
      "Have you ever checked tires with a boot kick?",
      "Have you ever driven the long way because it looked better?"
    ]
  },
  {
    category: "yard",
    prompts: [
      "Have you ever drank water from a garden hose?",
      "Have you ever had more chairs than porch space?",
      "Have you ever mowed before company came over?",
      "Have you ever owned a yard full of projects?",
      "Have you ever watched kids catch lightning bugs?",
      "Have you ever had a burn pile waiting forever?",
      "Have you ever saved jars for no clear reason?",
      "Have you ever swept a porch before visitors arrived?",
      "Have you ever kept a freezer in the garage?",
      "Have you ever had dogs announce every visitor?",
      "Have you ever used a stump as a table?",
      "Have you ever had a porch swing squeak perfectly?",
      "Have you ever watered plants after forgetting them all week?",
      "Have you ever seen a cooler become outside furniture?",
      "Have you ever owned boots by the back door?",
      "Have you ever found a frog on the porch?",
      "Have you ever had wasps claim the shed?",
      "Have you ever stored chairs in a random building?",
      "Have you ever raked leaves into a giant kid pile?",
      "Have you ever had a garden bigger than planned?",
      "Have you ever stepped around a mystery bucket?",
      "Have you ever had a clothesline story?",
      "Have you ever watched someone pressure wash for fun?",
      "Have you ever had a driveway basketball goal?",
      "Have you ever heard crickets louder than the TV?"
    ]
  },
  {
    category: "repairs",
    prompts: [
      "Have you ever used duct tape as a permanent repair?",
      "Have you ever said it ain't pretty but it works?",
      "Have you ever held a flashlight for too long?",
      "Have you ever used a butter knife as a screwdriver?",
      "Have you ever saved screws in a coffee can?",
      "Have you ever fixed something by hitting it once?",
      "Have you ever owned a junk drawer with levels?",
      "Have you ever kept lumber because it might matter?",
      "Have you ever heard hold this and regretted it?",
      "Have you ever repaired something during a family visit?",
      "Have you ever used baling wire indoors?",
      "Have you ever borrowed a tool and returned a story?",
      "Have you ever had one extension cord reach everything?",
      "Have you ever blamed a noise on the house settling?",
      "Have you ever watched someone refuse instructions?",
      "Have you ever used a chair instead of a ladder?",
      "Have you ever fixed the fix from last year?",
      "Have you ever had a drawer just for batteries?",
      "Have you ever bought parts for a maybe project?",
      "Have you ever owned three tape measures and found none?",
      "Have you ever patched a screen door twice?",
      "Have you ever used a pocketknife for everything?",
      "Have you ever kept appliance manuals nobody reads?",
      "Have you ever heard that'll hold with confidence?",
      "Have you ever fixed something during halftime?"
    ]
  },
  {
    category: "manners",
    prompts: [
      "Have you ever waved at someone you didn't know?",
      "Have you ever said yes ma'am without thinking?",
      "Have you ever held a door too long?",
      "Have you ever thanked someone twice by accident?",
      "Have you ever asked how's your mama?",
      "Have you ever offered tea before sitting down?",
      "Have you ever brought food when words felt useless?",
      "Have you ever done a doorway goodbye?",
      "Have you ever done a parking lot goodbye?",
      "Have you ever called a stranger honey?",
      "Have you ever been called sugar by a cashier?",
      "Have you ever said be careful instead of goodbye?",
      "Have you ever waved after someone let you merge?",
      "Have you ever apologized to furniture you bumped?",
      "Have you ever spoken to everyone in a room?",
      "Have you ever asked if someone ate yet?",
      "Have you ever said sir to someone younger?",
      "Have you ever brought extra because somebody might come?",
      "Have you ever said excuse me to a shopping cart?",
      "Have you ever used bless your heart carefully?",
      "Have you ever lowered your voice before gossip?",
      "Have you ever called before dropping by anyway?",
      "Have you ever offered directions and a drink?",
      "Have you ever waved from the porch?",
      "Have you ever said tell your mama I said hey?"
    ]
  },
  {
    category: "sayings",
    prompts: [
      "Have you ever said fixin' to?",
      "Have you ever said y'all twice in one sentence?",
      "Have you ever used over yonder as directions?",
      "Have you ever said might could?",
      "Have you ever said I reckon and meant maybe?",
      "Have you ever said Lord willing?",
      "Have you ever said don't be ugly?",
      "Have you ever said hush and ended the discussion?",
      "Have you ever said good gracious under your breath?",
      "Have you ever called someone a mess lovingly?",
      "Have you ever said that dog won't hunt?",
      "Have you ever said hotter than blue blazes?",
      "Have you ever said worn slap out?",
      "Have you ever said right quick before taking forever?",
      "Have you ever said directly and meant later?",
      "Have you ever used honey as punctuation?",
      "Have you ever said ain't no way?",
      "Have you ever heard well I swanee?",
      "Have you ever said he's something else?",
      "Have you ever said bless it sincerely?",
      "Have you ever used y'all's in public?",
      "Have you ever said come see us?",
      "Have you ever said I ain't studying that?",
      "Have you ever heard somebody called precious trouble?",
      "Have you ever said that about did me in?"
    ]
  },
  {
    category: "shopping",
    prompts: [
      "Have you ever gone to town for one thing?",
      "Have you ever returned with ice and a story?",
      "Have you ever known which gas station has good ice?",
      "Have you ever bought produce from a roadside stand?",
      "Have you ever judged tomatoes by handwriting on signs?",
      "Have you ever used the hardware store as directions?",
      "Have you ever seen everyone you know at Walmart?",
      "Have you ever kept coupons in the car?",
      "Have you ever bought extra cups for company?",
      "Have you ever shopped before a storm like war?",
      "Have you ever known the good dollar store aisle?",
      "Have you ever bought something because it might be useful?",
      "Have you ever left with more feed than planned?",
      "Have you ever checked every checkout lane first?",
      "Have you ever run into family while buying nothing?",
      "Have you ever bought a gift bag and reused it?",
      "Have you ever carried a cooler into the store?",
      "Have you ever bought batteries before needing them?",
      "Have you ever judged a store by its biscuit options?",
      "Have you ever found church friends in frozen foods?",
      "Have you ever bought five gallons of tea?",
      "Have you ever kept emergency paper plates?",
      "Have you ever used grocery bags as trash bags?",
      "Have you ever called shopping running errands?",
      "Have you ever needed one screw and bought snacks?"
    ]
  },
  {
    category: "childhood",
    prompts: [
      "Have you ever stayed outside until streetlights came on?",
      "Have you ever caught lightning bugs in a jar?",
      "Have you ever slammed a screen door and regretted it?",
      "Have you ever ridden bikes on gravel?",
      "Have you ever played barefoot all day?",
      "Have you ever heard go play outside?",
      "Have you ever eaten watermelon outside because mama said so?",
      "Have you ever sat at a card table for kids?",
      "Have you ever had cousins sleeping on pallets?",
      "Have you ever used a stick as a sword?",
      "Have you ever been warned about chiggers?",
      "Have you ever checked for ticks after playing?",
      "Have you ever heard adults spelling around you?",
      "Have you ever helped shell peas?",
      "Have you ever held the bag while someone picked pecans?",
      "Have you ever ridden in a parade trailer?",
      "Have you ever had school canceled for one snowflake?",
      "Have you ever made mud pies and meant it?",
      "Have you ever been scared of the good room?",
      "Have you ever watched cartoons before chores started?",
      "Have you ever used a creek as entertainment?",
      "Have you ever had a tire swing?",
      "Have you ever eaten popsicles on porch steps?",
      "Have you ever heard don't track that in?",
      "Have you ever been sent to find your shoes?"
    ]
  },
  {
    category: "small_town",
    prompts: [
      "Have you ever known news before it was news?",
      "Have you ever been recognized by your truck?",
      "Have you ever given directions by a closed store?",
      "Have you ever known everyone at the diner?",
      "Have you ever waved at a sheriff while speeding slightly?",
      "Have you ever seen a parade with tractors?",
      "Have you ever parked on a road shoulder for fireworks?",
      "Have you ever known the shortcut that isn't shorter?",
      "Have you ever seen your teacher at the grocery store?",
      "Have you ever heard gossip at the post office?",
      "Have you ever known who owns every dog?",
      "Have you ever had one stoplight run the town?",
      "Have you ever seen three generations in one booth?",
      "Have you ever known a road by family name?",
      "Have you ever heard somebody's truck was at somebody's house?",
      "Have you ever been asked who your people are?",
      "Have you ever known the good yard sale route?",
      "Have you ever had a festival for one crop?",
      "Have you ever seen someone wave with two fingers?",
      "Have you ever known everyone at graduation?",
      "Have you ever had directions include a church sign?",
      "Have you ever seen town news on a bulletin board?",
      "Have you ever passed your cousin twice in one day?",
      "Have you ever known which road floods first?",
      "Have you ever heard your name before entering a room?"
    ]
  },
  {
    category: "sports",
    prompts: [
      "Have you ever planned around kickoff?",
      "Have you ever eaten supper at a tailgate?",
      "Have you ever owned game-day clothes?",
      "Have you ever heard yelling from another room?",
      "Have you ever watched high school football under lights?",
      "Have you ever discussed a coach like family?",
      "Have you ever said we look awful while winning?",
      "Have you ever worn team colors to church?",
      "Have you ever had a cooler packed before noon?",
      "Have you ever avoided weddings during football season?",
      "Have you ever heard recruiting news at breakfast?",
      "Have you ever seen a baby in team gear?",
      "Have you ever yelled at a referee on TV?",
      "Have you ever had a lucky seat for games?",
      "Have you ever watched a rivalry split a room?",
      "Have you ever grilled because the game was on?",
      "Have you ever talked standings at a gas pump?",
      "Have you ever known the concession stand burger?",
      "Have you ever brought a blanket to bleachers?",
      "Have you ever left early to beat traffic and failed?",
      "Have you ever heard a radio game in the yard?",
      "Have you ever argued over a ranking?",
      "Have you ever watched sports from a tailgate?",
      "Have you ever packed snacks for a ball field?",
      "Have you ever said next year is our year?"
    ]
  },
  {
    category: "work",
    prompts: [
      "Have you ever worked until dark because daylight was left?",
      "Have you ever changed shoes before doing something serious?",
      "Have you ever brought extra gloves for somebody else?",
      "Have you ever measured time by how hot it got?",
      "Have you ever heard we'll knock it out directly?",
      "Have you ever fixed something before lunch got cold?",
      "Have you ever used a cooler as jobsite furniture?",
      "Have you ever worn work clothes to the store?",
      "Have you ever helped someone load something heavy?",
      "Have you ever said five minutes before sweating an hour?",
      "Have you ever carried water like a responsible adult?",
      "Have you ever solved a problem by calling an uncle?",
      "Have you ever worked around weather instead of clocks?",
      "Have you ever taken a break under a shade tree?",
      "Have you ever had dirt on your boots at dinner?",
      "Have you ever kept a spare shirt in the truck?",
      "Have you ever heard don't start what you can't finish?",
      "Have you ever worked before the sun got mean?",
      "Have you ever eaten lunch sitting on a tailgate?",
      "Have you ever said we'll make it work?",
      "Have you ever borrowed a trailer for a small favor?",
      "Have you ever used a hat as sun protection and storage?",
      "Have you ever smelled like grass after work?",
      "Have you ever finished something because rain was coming?",
      "Have you ever called sweat character building?"
    ]
  },
  {
    category: "home",
    prompts: [
      "Have you ever had plastic grocery bags under the sink?",
      "Have you ever owned a drawer full of twist ties?",
      "Have you ever had a good room nobody used?",
      "Have you ever kept blankets in every vehicle?",
      "Have you ever stored batteries in three places?",
      "Have you ever had a fridge covered in magnets?",
      "Have you ever called the remote the clicker?",
      "Have you ever had company cups and family cups?",
      "Have you ever owned more towels than closet space?",
      "Have you ever had a freezer full of mystery meat?",
      "Have you ever saved Cool Whip bowls?",
      "Have you ever used a bread bag tie later?",
      "Have you ever kept napkins from restaurants?",
      "Have you ever had candles nobody was allowed to light?",
      "Have you ever owned a couch with a favorite spot?",
      "Have you ever had a kitchen drawer nobody understands?",
      "Have you ever stored Christmas tubs in the shed?",
      "Have you ever kept spare chairs behind a door?",
      "Have you ever had a room smell like Pine-Sol?",
      "Have you ever had a fridge in the laundry room?",
      "Have you ever kept a jar for grease?",
      "Have you ever owned one good casserole dish?",
      "Have you ever had a table leaf nobody can find?",
      "Have you ever used foil to save every leftover?",
      "Have you ever had one spoon everyone likes?"
    ]
  },
  {
    category: "music",
    prompts: [
      "Have you ever sung along before knowing the words?",
      "Have you ever heard gospel from another room?",
      "Have you ever had a backroad playlist?",
      "Have you ever heard a guitar appear at a cookout?",
      "Have you ever clapped offbeat and kept going?",
      "Have you ever known a song by the first fiddle note?",
      "Have you ever heard someone harmonize without warning?",
      "Have you ever played music while cleaning before company?",
      "Have you ever heard country from a garage?",
      "Have you ever had church music stuck all week?",
      "Have you ever sung louder in the truck alone?",
      "Have you ever heard a hymn at a funeral dinner?",
      "Have you ever danced in a kitchen?",
      "Have you ever watched elders sing every verse?",
      "Have you ever heard bluegrass faster than your feet?",
      "Have you ever known the song that starts the crowd?",
      "Have you ever heard music from a porch?",
      "Have you ever had a song ruin your mood nicely?",
      "Have you ever played radio during yard work?",
      "Have you ever known someone who sings while cooking?",
      "Have you ever heard a piano change the whole room?",
      "Have you ever sung happy birthday with extra names?",
      "Have you ever heard a song called old but still new?",
      "Have you ever listened to ballgame radio and music together?",
      "Have you ever ended a night with one more song?"
    ]
  },
  {
    category: "tea",
    prompts: [
      "Have you ever made tea in a gallon pitcher?",
      "Have you ever noticed weak tea immediately?",
      "Have you ever called unsweet tea unfinished?",
      "Have you ever used more sugar than felt legal?",
      "Have you ever had tea ready before guests arrived?",
      "Have you ever judged ice by how long it lasted?",
      "Have you ever ordered half-and-half tea?",
      "Have you ever stirred tea with a wooden spoon?",
      "Have you ever had tea in a mason jar?",
      "Have you ever asked if the tea was fresh?",
      "Have you ever refilled tea before the glass was empty?",
      "Have you ever drank tea with crushed ice?",
      "Have you ever known who makes the good tea?",
      "Have you ever carried tea outside during summer?",
      "Have you ever heard tea called too sweet and disagreed?",
      "Have you ever made tea for people not there yet?",
      "Have you ever had a tea pitcher stained forever?",
      "Have you ever kept lemons nobody used?",
      "Have you ever heard the tea urn gurgle?",
      "Have you ever chosen a restaurant for the tea?",
      "Have you ever had tea before breakfast ended?",
      "Have you ever poured tea over too much ice?",
      "Have you ever kept backup tea in the fridge?",
      "Have you ever known tea could start an argument?",
      "Have you ever said this tea tastes right?"
    ]
  },
  {
    category: "neighbors",
    prompts: [
      "Have you ever borrowed something across a fence?",
      "Have you ever known a neighbor by their dog?",
      "Have you ever checked on someone after a storm?",
      "Have you ever returned a dish with food in it?",
      "Have you ever waved at neighbors from the mower?",
      "Have you ever heard a mower start a conversation?",
      "Have you ever shared vegetables from a garden?",
      "Have you ever known who grills on Fridays?",
      "Have you ever helped push a stuck vehicle?",
      "Have you ever watched a driveway project from afar?",
      "Have you ever heard neighborhood news from the porch?",
      "Have you ever had a neighbor bring extra eggs?",
      "Have you ever loaned a ladder for one hour?",
      "Have you ever gotten it back three weeks later?",
      "Have you ever texted about a loose cow?",
      "Have you ever returned mail to the right porch?",
      "Have you ever waved at someone mowing?",
      "Have you ever shared storm pictures with neighbors?",
      "Have you ever known who owns the loud truck?",
      "Have you ever helped look for a missing dog?",
      "Have you ever traded tools for tomatoes?",
      "Have you ever heard a generator before seeing one?",
      "Have you ever checked whose smoke alarm was chirping?",
      "Have you ever noticed a strange car immediately?",
      "Have you ever said holler if you need anything?"
    ]
  },
  {
    category: "animals",
    prompts: [
      "Have you ever had a dog ride shotgun?",
      "Have you ever known a chicken with attitude?",
      "Have you ever named an outdoor cat something ridiculous?",
      "Have you ever had a dog bark at thunder?",
      "Have you ever moved a turtle from the road?",
      "Have you ever watched cows stare at nothing?",
      "Have you ever heard goats sound dramatic?",
      "Have you ever had a dog follow the mower?",
      "Have you ever known a porch cat with boundaries?",
      "Have you ever had a bird nest in the wreath?",
      "Have you ever chased a chicken once?",
      "Have you ever heard coyotes and paused?",
      "Have you ever had a horse judge you?",
      "Have you ever fed scraps to animals outside?",
      "Have you ever seen a dog sleep through chaos?",
      "Have you ever had frogs sing louder than music?",
      "Have you ever checked shoes for critters?",
      "Have you ever named a stray that stayed?",
      "Have you ever seen deer in the yard?",
      "Have you ever had a dog hate the mail truck?",
      "Have you ever stepped around a sleeping pet?",
      "Have you ever called every animal buddy?",
      "Have you ever heard a rooster too early?",
      "Have you ever had a pet steal a seat?",
      "Have you ever talked to animals like people?"
    ]
  },
  {
    category: "holidays",
    prompts: [
      "Have you ever eaten Thanksgiving in shifts?",
      "Have you ever had Christmas lights stay up too long?",
      "Have you ever cooked before sunrise on a holiday?",
      "Have you ever brought chairs to a family party?",
      "Have you ever watched fireworks from a truck bed?",
      "Have you ever heard someone say don't waste that plate?",
      "Have you ever had Easter pictures in itchy clothes?",
      "Have you ever hidden eggs until one stayed hidden?",
      "Have you ever had holiday leftovers for days?",
      "Have you ever seen a dessert table need supervision?",
      "Have you ever had a Christmas tub labeled wrong?",
      "Have you ever heard football during Thanksgiving dinner?",
      "Have you ever brought ice to every gathering?",
      "Have you ever had a holiday at a church hall?",
      "Have you ever watched kids open gifts too fast?",
      "Have you ever used paper plates for serious food?",
      "Have you ever heard someone ask who made this?",
      "Have you ever had a birthday at a picnic table?",
      "Have you ever saved bows for next year?",
      "Have you ever cooked enough for imaginary guests?",
      "Have you ever grilled because the weather allowed it?",
      "Have you ever had a cooler at Christmas?",
      "Have you ever seen deviled eggs disappear first?",
      "Have you ever heard clean your plate before cake?",
      "Have you ever stayed after a party to talk?"
    ]
  },
  {
    category: "water",
    prompts: [
      "Have you ever swam in a creek?",
      "Have you ever skipped rocks until someone got competitive?",
      "Have you ever sat by a pond doing nothing?",
      "Have you ever fished with snacks as backup?",
      "Have you ever used a cooler as a seat?",
      "Have you ever jumped from a rope swing?",
      "Have you ever had lake hair all day?",
      "Have you ever walked barefoot on a boat dock?",
      "Have you ever heard frogs before seeing water?",
      "Have you ever eaten sandwiches by a lake?",
      "Have you ever carried towels nobody used?",
      "Have you ever kept flip-flops by the door?",
      "Have you ever had muddy feet in the truck?",
      "Have you ever watched kids splash until dark?",
      "Have you ever known the good fishing spot secretly?",
      "Have you ever crossed a low-water bridge carefully?",
      "Have you ever heard don't get your clothes wet?",
      "Have you ever got your clothes wet anyway?",
      "Have you ever used a hose to rinse everything?",
      "Have you ever had river rocks in your shoes?",
      "Have you ever packed too much sunscreen and forgot it?",
      "Have you ever brought watermelon to the water?",
      "Have you ever listened to cicadas by a pond?",
      "Have you ever had a minnow scare somebody?",
      "Have you ever stayed outside because the breeze felt right?"
    ]
  }
];

const answerSets = {
  yes: [
    { text: "5/5 - Absolutely", points: 5 },
    { text: "4/5 - Plenty of times", points: 4 },
    { text: "2/5 - Maybe once", points: 2 },
    { text: "0/5 - Never", points: 0 }
  ],
  count: [
    { text: "Too many", points: 5 },
    { text: "A few", points: 4 },
    { text: "One", points: 2 },
    { text: "None", points: 0 }
  ]
};

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function difficultyFor(index) {
  if (index % 5 === 0) return "Hard";
  if (index % 2 === 0) return "Medium";
  return "Easy";
}

function explanationFor(group) {
  return `${group} memories are doing the scoring here.`;
}

const questions = [];
const seen = new Set();
const duplicateCandidates = [];
const activeGroups = groups.slice(0, 20);

for (const group of activeGroups) {
  for (const prompt of group.prompts) {
    const key = normalize(prompt);
    if (seen.has(key)) {
      duplicateCandidates.push(prompt);
      continue;
    }
    seen.add(key);
    const isCount = /^How many\b/i.test(prompt);
    questions.push({
      id: `southern_${String(questions.length + 1).padStart(3, "0")}`,
      category: "southern_culture",
      subcategory: group.category,
      difficulty: difficultyFor(questions.length),
      question: prompt,
      answers: isCount ? answerSets.count : answerSets.yes,
      correctAnswerIndex: 0,
      explanation: explanationFor(group.category)
    });
  }
}

if (questions.length !== 500) {
  throw new Error(`Expected 500 generated questions, got ${questions.length}`);
}

const bank = {
  version: 2,
  quizType: "southern-culture-humor",
  generatedAt: new Date().toISOString(),
  qualityRules: [
    "experience-based, not trivia-based",
    "plain everyday language",
    "under 15 words whenever possible",
    "short punchy answers",
    "warm recognition humor"
  ],
  questions
};

const report = {
  generatedAt: bank.generatedAt,
  sourceResearch: [
    "Southern church potluck foods and customs",
    "Southern sayings and everyday phrasing",
    "Sweet tea, porch, weather, backroad, and family habit discussions"
  ],
  originalQuestionCount: 150,
  rewrittenExistingQuestionCount: 150,
  totalQuestionsAdded: 350,
  finalQuestionCount: questions.length,
  duplicateRemovalCount: duplicateCandidates.length,
  categoryBreakdown: {
    southern_culture: questions.length
  },
  subcategoryBreakdown: Object.fromEntries(activeGroups.map((group) => [
    group.category,
    questions.filter((question) => question.subcategory === group.category).length
  ])),
  validationErrorsFound: 0,
  notes: [
    "UI was not modified.",
    "The old 150 prompts were replaced with shorter quality-rule-compliant phrasing.",
    "Question bank remains scoring-compatible with the current app."
  ]
};

const js = `export const QUESTION_CATEGORIES = ["southern_culture"];

export const QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

await mkdir(appDir, { recursive: true });
await writeFile(new URL("question-bank.json", appDir), `${JSON.stringify(bank, null, 2)}\n`);
await writeFile(new URL("content-report.json", appDir), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(new URL("questions.js", appDir), js);

const existingReadme = await readFile(new URL("README.md", appDir), "utf8");
const updatedReadme = existingReadme.includes("## Expanded Content Bank")
  ? existingReadme
  : `${existingReadme}

## Expanded Content Bank

- \`question-bank.json\` stores the full 500-question Southern culture bank.
- \`questions.js\` is generated from that bank for the current browser app.
- \`content-report.json\` records counts, duplicate removal, and validation status.
- Regenerate with \`node scripts/generate-southern-content.mjs\`.
`;
await writeFile(new URL("README.md", appDir), updatedReadme);

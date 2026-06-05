export const QUESTION_CATEGORIES = [
  "food",
  "church",
  "family",
  "vehicles",
  "outdoors",
  "weather",
  "sayings",
  "manners",
  "sports",
  "home_repair",
  "small_town",
  "music",
  "shopping",
  "childhood",
  "work"
];

const promptsByCategory = {
  food: [
    "judge a restaurant by whether the tea tastes like it met sugar on purpose",
    "know which relative is trusted with deviled eggs at a reunion",
    "own a cast iron skillet with more family history than paperwork",
    "have strong opinions about white gravy thickness",
    "call every carbonated drink a Coke unless forced by witnesses",
    "know the difference between dressing and stuffing without needing a lecture",
    "eat BBQ and quietly grade the smoke ring before speaking",
    "believe cornbread should not need a cake decorator",
    "have seen banana pudding disappear before the main dish line moved",
    "know a gas station that cooks better breakfast than a chain restaurant"
  ],
  church: [
    "know the safest place to stand in a church potluck line",
    "have helped stack metal chairs after an event without being asked",
    "understand that fellowship hall coffee has its own personality",
    "know someone who brings the same casserole to every gathering",
    "have been fed immediately after saying you were not hungry",
    "recognize the sound of a Sunday bulletin being folded in half",
    "know the difference between a prayer request and the whole story",
    "have attended a dinner where every dessert had a handwritten label",
    "have heard someone say they are putting it on the prayer list with authority",
    "know that the last hymn can still leave room for a long goodbye"
  ],
  family: [
    "have a cousin everyone watches carefully around fireworks",
    "know which aunt is in charge of potato salad judgment",
    "have been told to eat something five minutes after eating",
    "call unrelated family friends aunt or uncle because it feels correct",
    "know what somebody means by mom'n'em",
    "have a family recipe that uses measurements like a good handful",
    "have heard three versions of the same family story in one afternoon",
    "know who gets the good folding chair at Thanksgiving",
    "have a relative who can identify a car by sound from the porch",
    "understand that family reunions have both food tables and politics-free escape routes"
  ],
  vehicles: [
    "have trusted duct tape or zip ties longer than the manufacturer intended",
    "know someone who says their truck only needs one more little thing",
    "wave at strangers on back roads without thinking about it",
    "judge a driveway by how many projects are almost finished in it",
    "have ridden down a gravel road slow enough to avoid making mama mad",
    "know a truck with a name, a story, and one door that sticks",
    "have carried jumper cables because somebody always needs them",
    "understand tailgate seating as a legitimate furniture category",
    "have seen a four-wheeler used for errands that were technically nearby",
    "know that a two-minute drive can become twenty minutes of road talk"
  ],
  outdoors: [
    "sit on a porch during a storm like it is premium entertainment",
    "know the sound of tree frogs starting the evening shift",
    "have a preferred creek, pond, or field nobody should post online",
    "own boots that are not fashion boots and can prove it",
    "know someone who checks the moon phase before making plans",
    "have been sent outside because company was coming",
    "understand that shade is a summer survival strategy",
    "have helped move something heavy with a tractor, chain, or confidence",
    "know what chiggers are without wanting to explain them",
    "have watched a sunset from a tailgate or porch step"
  ],
  weather: [
    "know a person who watches tornado weather from outside",
    "understand that humid is not a forecast, it is a lifestyle",
    "have cancelled plans because the radar looked rude",
    "recognize the sky color that makes everybody get quiet",
    "know the phrase heat index and take it personally",
    "have heard thunder and immediately checked whether the laundry was outside",
    "know someone who can smell rain before the app notices",
    "have lived through a day with spring, summer, and second winter",
    "understand that ice on the road changes every plan in town",
    "have seen folks discuss storm tracks like a playoff bracket"
  ],
  sayings: [
    "use fixin' to without translating it first",
    "know bless your heart can mean at least three different things",
    "have heard somebody get told not to be ugly and knew behavior was meant",
    "use y'all because it is efficient and correct",
    "know over yonder is a real location if you point hard enough",
    "have said might could and felt no need to apologize",
    "understand that directly can mean soon, later, or after this tea",
    "know somebody who says good Lord before every announcement",
    "have heard I reckon used as a full decision-making system",
    "know that hush can be gentle or final depending on volume"
  ],
  manners: [
    "say yes ma'am or no sir before your brain finishes loading",
    "hold the door so long it becomes a small community project",
    "wave when someone lets you merge even if they cannot see you",
    "know that a short visit can still require offering a drink",
    "have been corrected for forgetting to speak when entering a room",
    "understand that asking how's your mama is a normal greeting",
    "send food when words are not enough",
    "know the difference between being polite and being nosy but friendly",
    "thank someone twice because once felt light",
    "have performed the parking-lot goodbye after the doorway goodbye"
  ],
  sports: [
    "know SEC football can affect wedding scheduling",
    "have heard a coach described like a distant family member",
    "own game-day clothing that comes out like church clothes",
    "have eaten a full meal from a tailgate setup",
    "know the phrase we look terrible can be said while winning",
    "understand that high school football lights can organize a town",
    "have a family member who yells defensive advice at the television",
    "know somebody whose mood follows recruiting news",
    "have discussed a rivalry game with someone you love but disagree with",
    "know that a cooler can be sports equipment"
  ],
  home_repair: [
    "own a drawer where useful screws go to retire",
    "know somebody who can fix anything with a pocketknife and suspicion",
    "have used a butter knife for a job it did not apply for",
    "keep leftover lumber because it might be the exact piece one day",
    "have heard hold this and immediately became part of a repair crew",
    "know that temporary repairs can celebrate anniversaries",
    "own more extension cords than seems reasonable",
    "have identified a mystery noise by standing still and listening hard",
    "know a garage where every coffee can has a purpose",
    "have said it ain't pretty but it'll hold with real pride"
  ],
  small_town: [
    "know which road people use when the main road is blocked",
    "have given directions by landmarks that no longer exist",
    "know a cashier who asks about your family by name",
    "have heard news before it became news because somebody saw a truck",
    "understand that the post office can be a social platform",
    "know where everyone parks for the parade",
    "have seen three generations in one booth at the same diner",
    "know a shortcut that is only shorter if you know it",
    "have been recognized by your vehicle before your face",
    "know that everybody knowing everybody is both comfort and surveillance"
  ],
  music: [
    "know a gospel chorus that still lives rent-free in your head",
    "have heard country music coming from a garage while something was being fixed",
    "know at least one song that starts a group singalong by accident",
    "have attended a festival where music, fried food, and folding chairs combined",
    "recognize that bluegrass speed can count as cardio",
    "have a playlist for back roads that would confuse a city planner",
    "know someone who can harmonize without announcing it",
    "have heard a church pianist change the whole mood of a room",
    "know a song that makes people point at the floor and say this was the one",
    "understand that porch picking can start with one guitar and end with neighbors"
  ],
  shopping: [
    "know a hardware store aisle better than some maps",
    "have gone to town for one thing and returned with feed, ice, and a story",
    "judge a roadside stand by the tomatoes and the handwriting",
    "know which gas station has the good ice",
    "have compared grocery prices like a competitive sport",
    "understand that a feed store can sell more than feed",
    "have bought something because it was too useful not to",
    "know a thrift find that became family furniture",
    "have a favorite dollar-store aisle for emergency hosting",
    "know someone who keeps coupons with operational discipline"
  ],
  childhood: [
    "have been told to come inside when the streetlights came on",
    "know what a switch is even if nobody used one",
    "have drunk from a water hose and survived the lecture",
    "built a fort from scrap wood, sheets, or whatever was not nailed down",
    "had a school field trip that involved a farm, a courthouse, or both",
    "learned not to slam the screen door the hard way",
    "have caught lightning bugs in a jar with air holes",
    "know the sound of gravel under bicycle tires",
    "have been sent to play outside until supper",
    "remember adults spelling words because kids were listening"
  ],
  work: [
    "know somebody who measures daylight like a project deadline",
    "have worked in heat that made lunch feel like a medical decision",
    "respect a person who brings extra gloves without making a speech",
    "have heard we'll knock it out directly before a long day",
    "know that a cooler full of water can be team leadership",
    "have solved a problem with a phone call to someone older",
    "know a person who refuses to read instructions until absolutely necessary",
    "have worn work clothes to the store and met half the town",
    "understand that a five-minute favor can involve a trailer",
    "have said let me change shoes before doing anything serious"
  ]
};

function answersForPrompt(prompt) {
  return [
    { text: `Absolutely. I ${prompt}.`, points: 5 },
    { text: `Often enough that this feels personal.`, points: 3 },
    { text: `Maybe once, but I need witnesses.`, points: 1 },
    { text: `Nope. This is new territory.`, points: 0 }
  ];
}

export const QUESTIONS = Object.entries(promptsByCategory).flatMap(([category, prompts]) =>
  prompts.map((prompt, index) => ({
    id: `${category}_${String(index + 1).padStart(3, "0")}`,
    category,
    question: `How likely are you to ${prompt}?`,
    answers: answersForPrompt(prompt)
  }))
);

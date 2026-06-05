export const RESULT_RANGES = [
  { min: 0, max: 20, label: "Bless Your Heart Tourist" },
  { min: 21, max: 40, label: "Southern Adjacent" },
  { min: 41, max: 60, label: "Sweet Tea Apprentice" },
  { min: 61, max: 80, label: "Backroad Certified" },
  { min: 81, max: 95, label: "Front Porch Legend" },
  { min: 96, max: 100, label: "Cast Iron Royalty" }
];

export const RESULT_TITLES = [
  "Bless Your Heart Tourist", "Porch-Sitting Prospect", "Sweet Tea Apprentice", "Backroad Certified", "Front Porch Legend",
  "Cast Iron Royalty", "Casserole Committee Alternate", "Fellowship Hall Frequent Flyer", "Gravy-Level Thinker", "Dirt Road Diplomat",
  "Thunderstorm Porch Captain", "Gas Station Biscuit Scholar", "Potluck Plate Strategist", "Y'all Usage Professional", "Tailgate Table Commander",
  "Family Reunion Field Marshal", "Coke Means Every Soda Defender", "Screen Door Discipline Graduate", "White Gravy Theorist", "Parking-Lot Goodbye Expert",
  "Humidity Survivor", "Duct Tape Optimist", "Sunday Dinner Negotiator", "Banana Pudding Scout", "Chicken-Fried Philosopher",
  "Gravel Road Local", "Hushpuppy Historian", "SEC Schedule Consultant", "Good Ice Detective", "Porch Weather Analyst",
  "Country Store Regular", "Deviled Egg Auditor", "Tornado Sky Watcher", "Fixin' To Specialist", "Cast Iron Custodian",
  "BBQ Sauce Juror", "Mom'n'em Correspondent", "Tailgate Chair Quartermaster", "Fried Okra Loyalist", "Roadside Tomato Inspector",
  "Prayer List Archivist", "Screened-Porch Sage", "Jumper Cable Neighbor", "Cobbler Pan Negotiator", "Moon Pie Methodist",
  "Creek Bank Consultant", "Cooler Logistics Manager", "Pie Table Security", "Two-Lane Navigator", "Rooster-Approved Southerner"
];

const observationStarts = [
  "You can turn a short errand into a family update.",
  "You understand that sweet tea is judged before the menu.",
  "You have strong feelings about BBQ without needing a microphone.",
  "You know that a porch can be both furniture and therapy.",
  "You treat a potluck table like a tactical map.",
  "You can translate y'all, all y'all, and y'all's without blinking.",
  "You know storm clouds deserve respect and commentary.",
  "You believe a skillet can be seasoned and emotionally important.",
  "You can find the useful drawer in almost any house.",
  "You know a back road wave is not optional."
];

const observationEnds = [
  "Somebody nearby is probably asking if you ate.",
  "Your instincts are mostly tea, timing, and casserole placement.",
  "The folding chairs recognize your authority.",
  "Your family tree has at least one person trusted with gravy.",
  "You are one thunderstorm away from setting up on the porch.",
  "A cousin has already borrowed your jumper cables.",
  "You can smell a weak potluck plate from across the room.",
  "The good ice location is safe with you.",
  "You know when to say bless your heart and when to just blink.",
  "Your driveway has seen projects that built character."
];

export const RESULT_OBSERVATIONS = observationStarts.flatMap((start) =>
  observationEnds.map((end) => `${start} ${end}`)
).slice(0, 75);

const warningSubjects = [
  "cast iron skillet", "tea pitcher", "folding chair", "truck cup holder", "junk drawer",
  "potluck calendar", "screen door", "storm radar", "gravy spoon", "tailgate cooler"
];

const warningActions = [
  "may legally count as a family heirloom",
  "is close to becoming a personality trait",
  "should be monitored during family gatherings",
  "has probably heard confidential information",
  "is one reunion away from needing its own chair"
];

export const RESULT_WARNINGS = warningSubjects.flatMap((subject) =>
  warningActions.map((action) => `Warning: your ${subject} ${action}.`)
);

const badgeAdjectives = [
  "Certified", "Deputized", "Unofficial", "Front Porch", "Backroad", "Sweet Tea", "Cast Iron", "Fellowship Hall", "Good Ice", "Storm Watch"
];
const badgeNouns = [
  "Tea Inspector", "Casserole Marshal", "BBQ Juror", "Porch Captain", "Gravy Auditor",
  "Road-Wave Specialist", "Potluck Strategist", "Skillet Keeper", "Tailgate Planner", "Family Story Archivist"
];

export const RESULT_BADGES = badgeAdjectives.flatMap((adjective, index) =>
  badgeNouns.slice(index % 5, (index % 5) + 5).map((noun) => `${adjective} ${noun}`)
).slice(0, 50);

const shareLeads = [
  "Somebody get me a porch",
  "Apparently I know my way around sweet tea",
  "The quiz called me out gently",
  "I came for jokes and left with a food opinion",
  "I have been measured by casserole science",
  "My backroad credentials have been reviewed",
  "The tea pitcher has spoken",
  "My family reunion instincts are showing",
  "I survived the Southern audit",
  "This quiz knew too much about my people"
];

const shareTags = [
  "and a glass of tea.",
  "and I am accepting no questions.",
  "with witnesses present.",
  "in front of the whole potluck.",
  "before the storm rolls in."
];

export const SHARE_CAPTIONS = shareLeads.flatMap((lead) => shareTags.map((tag) => `${lead} ${tag}`));

export const REGIONAL_NOTES = [
  "Appalachian note: directions may include a ridge, a holler, and somebody's old barn.",
  "Alabama note: football schedules have been known to affect social planning.",
  "Georgia note: peaches are welcome, but so are strong tea opinions.",
  "Tennessee note: music, mountains, and porch talk all count as navigation aids.",
  "Mississippi note: a good table can hold stories as well as food.",
  "Louisiana note: flavor is not decoration; it is the assignment.",
  "Texas note: BBQ opinions may require extra room.",
  "Carolinas note: sauce debates are best handled with diplomacy.",
  "Rural note: the long way may be the better way if the view is right.",
  "Church note: the fellowship hall has its own rules of traffic.",
  "Potluck note: label your dish unless you enjoy mystery confidence.",
  "Storm note: watching the sky is not a replacement for safety, but people still do it.",
  "Grandma note: if she says eat, negotiations are already over.",
  "Backroad note: wave first, wonder later.",
  "Sweet tea note: unsweetened tea is a beverage, not a peace treaty.",
  "Truck note: the temporary fix has entered its second fiscal year.",
  "Porch note: sitting outside counts as doing something.",
  "Small-town note: news travels faster than the stoplight changes.",
  "Family note: every reunion has one disputed recipe.",
  "Hardware note: one extra bolt is either a problem or a blessing.",
  "Garden note: tomato pride is real and seasonal.",
  "Music note: one guitar can start a whole evening.",
  "Manners note: yes ma'am can arrive before conscious thought.",
  "Shopping note: the good gas station is part restaurant, part landmark.",
  "Summer note: humidity has hands."
];

export function pickResultRange(score) {
  return RESULT_RANGES.find((range) => score >= range.min && score <= range.max) || RESULT_RANGES[0];
}

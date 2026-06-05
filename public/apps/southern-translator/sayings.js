const sayingParts = {
  openers: [
    "That plan",
    "That boy",
    "That truck",
    "That meeting",
    "That casserole",
    "That rain",
    "That story",
    "That shortcut",
    "That dog won't hunt, and that idea",
    "That ladder"
  ],
  comparisons: [
    "has more confidence than brakes",
    "is louder than a screen door in a storm",
    "is holding together on prayer and primer",
    "went sideways before the biscuits cooled",
    "needs more help than a flat tire on Sunday",
    "is moving slower than molasses in January",
    "has been told three different ways already",
    "is about as organized as a junk drawer",
    "is wearing out everybody's patience",
    "will teach somebody a lesson by lunchtime"
  ],
  meanings: [
    "The situation is overconfident and underprepared.",
    "Everyone can see the problem, but politeness is still in charge.",
    "This may technically work, but nobody should brag about it.",
    "A small mistake is gathering family-size momentum.",
    "The person involved needs supervision and possibly a sandwich.",
    "Progress exists, but it is taking the scenic route.",
    "The story has already escaped into public circulation.",
    "There is no plan, just motion and hope.",
    "Patience is being requested from people who are nearly out.",
    "A consequence is approaching with its blinker on."
  ],
  usages: [
    "Use when somebody ignores the obvious warning sign.",
    "Use after the third explanation makes less sense than the first.",
    "Use when a repair involves tape, faith, and a borrowed tool.",
    "Use when the potluck table goes quiet for evaluative reasons.",
    "Use when the weather changes everybody's schedule at once.",
    "Use when a simple errand becomes an afternoon story.",
    "Use when the family group chat starts solving a problem nobody asked about.",
    "Use when the shortcut is longer but more dramatic.",
    "Use when someone says they have it handled and clearly does not.",
    "Use when you need to laugh before you start fixing it."
  ],
  categories: ["church", "grandma", "weather", "food", "family", "small-town", "vehicles", "work", "outdoors", "insults"]
};

export const SAYINGS = Array.from({ length: 120 }, (_, index) => {
  const opener = sayingParts.openers[index % sayingParts.openers.length];
  const comparison = sayingParts.comparisons[Math.floor(index / sayingParts.openers.length) % sayingParts.comparisons.length];
  return {
    id: `saying-${String(index + 1).padStart(3, "0")}`,
    saying: `${opener} ${comparison}.`,
    meaning: sayingParts.meanings[index % sayingParts.meanings.length],
    usage: sayingParts.usages[(index + 3) % sayingParts.usages.length],
    category: sayingParts.categories[index % sayingParts.categories.length]
  };
});

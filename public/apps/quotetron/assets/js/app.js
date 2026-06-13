const shareButton = document.querySelector("#share-button");
const copyButton = document.querySelector("#copy-link-button");
const openLoreButton = document.querySelector("#open-lore-button");
const loreDialog = document.querySelector("#lore-dialog");
const closeLoreButton = document.querySelector("#close-lore-button");

async function shareCurrentPage() {
  const payload = {
    title: document.title,
    text: document.querySelector("meta[name='description']")?.content || document.title,
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(payload);
    return;
  }

  await navigator.clipboard.writeText(payload.url);
}

if (shareButton) {
  shareButton.addEventListener("click", () => {
    shareCurrentPage().catch(() => {});
  });
}

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy link";
    }, 1600);
  });
}

function openLore() {
  if (!loreDialog) return;
  if (typeof loreDialog.showModal === "function") {
    loreDialog.showModal();
    return;
  }
  loreDialog.setAttribute("open", "");
}

function closeLore() {
  if (!loreDialog) return;
  if (typeof loreDialog.close === "function") {
    loreDialog.close();
    return;
  }
  loreDialog.removeAttribute("open");
}

if (openLoreButton) {
  openLoreButton.addEventListener("click", openLore);
}

if (closeLoreButton) {
  closeLoreButton.addEventListener("click", closeLore);
}

if (loreDialog) {
  loreDialog.addEventListener("click", (event) => {
    if (event.target === loreDialog) closeLore();
  });

  loreDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLore();
  });
}

const quoteForm = document.querySelector("#quote-form");
const projectPriceInput = document.querySelector("#project-price");
const targetHourlyInput = document.querySelector("#target-hourly");
const productionHoursInput = document.querySelector("#production-hours");
const adminHoursInput = document.querySelector("#admin-hours");
const revisionBufferInput = document.querySelector("#revision-buffer");
const expensesInput = document.querySelector("#expenses");
const platformFeeInput = document.querySelector("#platform-fee");
const cashReserveInput = document.querySelector("#cash-reserve");
const decisionBadge = document.querySelector("#decision-badge");
const decisionTitle = document.querySelector("#decision-title");
const decisionCopy = document.querySelector("#decision-copy");
const decisionPop = document.querySelector("#decision-pop");
const decisionImage = document.querySelector("#decision-image");
const trueHourlyOutput = document.querySelector("#true-hourly");
const targetQuoteOutput = document.querySelector("#target-quote");
const netProfitOutput = document.querySelector("#net-profit");
const totalHoursOutput = document.querySelector("#total-hours");
const calcOutput = document.querySelector("#calc-output");
const copySummaryButton = document.querySelector("#copy-summary-button");
const resetButton = document.querySelector("#reset-button");
const soundToggleButton = document.querySelector("#sound-toggle");
const soundTake = document.querySelector("#sound-take");
const soundNegotiate = document.querySelector("#sound-negotiate");
const soundPass = document.querySelector("#sound-pass");
const themeSong = document.querySelector("#theme-song");
const rateTaskInput = document.querySelector("#rate-task");
const rateLevelInput = document.querySelector("#rate-level");
const rateMarketInput = document.querySelector("#rate-market");
const rateLowOutput = document.querySelector("#rate-low");
const rateTypicalOutput = document.querySelector("#rate-typical");
const rateHighOutput = document.querySelector("#rate-high");
const rateGuidance = document.querySelector("#rate-guidance");
const rateSource = document.querySelector("#rate-source");
const rateOutput = document.querySelector("#rate-output");
const useRateButton = document.querySelector("#use-rate-button");
const useQuoteButton = document.querySelector("#use-quote-button");

const defaults = {
  projectPrice: 1800,
  targetHourly: 75,
  productionHours: 12,
  adminHours: 2,
  revisionBuffer: 15,
  expenses: 85,
  platformFee: 3,
  cashReserve: 25,
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const decisionAssets = {
  take: {
    src: "assets/img/decision-take.webp",
    alt: "Quotetron giving a thumbs up for a strong quote",
  },
  negotiate: {
    src: "assets/img/decision-negotiate.webp",
    alt: "Quotetron thinking through a quote that needs negotiation",
  },
  pass: {
    src: "assets/img/decision-pass.webp",
    alt: "Quotetron giving a thumbs down for a weak quote",
  },
};

let lastDecisionState = "";
let soundEnabled = true;
let audioUnlocked = false;
const MOBILE_AUDIO_QUERY = "(hover: none), (pointer: coarse)";
const useMobileAudioMix = window.matchMedia(MOBILE_AUDIO_QUERY).matches;
const usePauseDuckingForDecision = useMobileAudioMix;
const DESKTOP_THEME_VOLUME = 0.012;
const MOBILE_THEME_VOLUME = 0.006;
const DESKTOP_DUCKED_THEME_VOLUME = 0.004;
const MOBILE_DUCKED_THEME_VOLUME = 0;
const DESKTOP_DECISION_SOUND_VOLUME = 0.78;
const MOBILE_DECISION_SOUND_VOLUME = 0.46;
const themeVolume = useMobileAudioMix ? MOBILE_THEME_VOLUME : DESKTOP_THEME_VOLUME;
const duckedThemeVolume = useMobileAudioMix ? MOBILE_DUCKED_THEME_VOLUME : DESKTOP_DUCKED_THEME_VOLUME;
const decisionSoundVolume = useMobileAudioMix ? MOBILE_DECISION_SOUND_VOLUME : DESKTOP_DECISION_SOUND_VOLUME;
let themeDuckTimer = 0;
let audioContext = null;
let themeSourceNode = null;
let themeGainNode = null;
let themeWasPlayingBeforeDuck = false;

const rateGuides = {
  portrait: {
    label: "Portrait or family photos",
    rates: [75, 125, 225],
    note: "Good for family, senior, couple, or simple location sessions. Add editing, travel, prints, and extra people.",
    source: "2026 freelance photography guides commonly place portrait work around $75-$250/hr depending on market and portfolio.",
  },
  headshot: {
    label: "Headshots",
    rates: [85, 150, 300],
    note: "Good for LinkedIn, business, actor, or team headshots. Charge more for on-site setup or multiple finished images.",
    source: "Headshot pricing is often sold per person or session; hourly planning rates commonly land above basic portrait work.",
  },
  event: {
    label: "Event photo coverage",
    rates: [100, 175, 300],
    note: "Count shooting time, culling, editing, delivery, travel, and recovery time after the event.",
    source: "2026 photo rate guides commonly put event photographers in the $100-$300/hr band.",
  },
  weddingPhoto: {
    label: "Wedding photography",
    rates: [125, 225, 450],
    note: "Weddings need planning, long coverage, backups, editing, delivery, and high responsibility. Avoid pricing this like a short portrait shoot.",
    source: "Wedding work is usually package-priced; hourly planning rates run higher because risk and post-production are heavy.",
  },
  product: {
    label: "Product photos",
    rates: [100, 175, 350],
    note: "Product work gets expensive when styling, lighting, cleanup, clipping, or many final images are included.",
    source: "Commercial and product photography usually prices above basic consumer sessions because usage and production matter.",
  },
  realEstate: {
    label: "Real estate photos",
    rates: [75, 125, 225],
    note: "Often sold per property. Add travel, drone, twilight, floor plans, video, or rush delivery.",
    source: "Public pricing guides commonly show real estate photo packages from low hundreds to several hundred dollars per property.",
  },
  retouching: {
    label: "Photo editing or retouching",
    rates: [40, 75, 150],
    note: "Use this for culling, color correction, skin cleanup, background fixes, composites, or batch editing.",
    source: "Editing-only work is usually lower than shooting work unless it requires high-end retouching or compositing.",
  },
  video: {
    label: "Basic videography",
    rates: [75, 125, 250],
    note: "Count filming, audio, gear setup, editing, revisions, music, captions, exports, and upload time.",
    source: "Freelance video rates vary widely; simple local coverage often starts below commercial production rates.",
  },
  drone: {
    label: "Drone photo or video",
    rates: [100, 175, 300],
    note: "Add setup, flight time, editing, travel, batteries, weather delays, and any licensing or permission requirements.",
    source: "Drone pricing varies by deliverables, location, licensing, insurance, and job risk.",
  },
  design: {
    label: "Graphic design / flyer work",
    rates: [45, 85, 175],
    note: "Use this for flyers, menus, social graphics, logos, or layouts. Add revisions and print prep.",
    source: "General freelance design rates vary by portfolio, speed, and deliverables; this is a practical local-business planning range.",
  },
  logoBrand: {
    label: "Logo or brand design",
    rates: [75, 125, 250],
    note: "Brand work should include discovery, options, revisions, file prep, and usage value. Do not price it like one quick graphic.",
    source: "2026 design guides commonly place mid-level freelance design around $75-$130/hr, with brand work above basic production.",
  },
  webDesign: {
    label: "Website design",
    rates: [60, 100, 200],
    note: "Use this for layout, page design, site structure, mobile polish, and handoff. Add copy, images, and revisions.",
    source: "2026 web design pricing guides show broad ranges by skill, platform, and project complexity.",
  },
  webDev: {
    label: "Website development",
    rates: [75, 125, 250],
    note: "Use this for building pages, fixing site behavior, forms, integrations, performance, or custom code.",
    source: "2026 web developer rates vary widely by stack, complexity, and responsibility.",
  },
  copywriting: {
    label: "Copywriting or content writing",
    rates: [40, 80, 175],
    note: "Count research, drafts, edits, calls, SEO work, and revisions. Sales copy should cost more than simple content.",
    source: "Freelance writing rates vary by niche, research depth, and whether the work drives sales.",
  },
  socialMedia: {
    label: "Social media management",
    rates: [35, 70, 150],
    note: "Include planning, posting, captions, graphics, scheduling, replies, reporting, and meetings.",
    source: "2026 freelance rate guides commonly place social media work below senior design but above basic admin.",
  },
  seo: {
    label: "SEO / local business setup",
    rates: [60, 100, 200],
    note: "Use this for Google Business Profile, local listings, page cleanup, keywords, tracking, and simple technical fixes.",
    source: "SEO pricing depends on competition, location, technical scope, and whether ongoing management is included.",
  },
  audioEditing: {
    label: "Podcast or audio editing",
    rates: [40, 75, 150],
    note: "Count cleanup, leveling, cuts, music, show notes, exports, and revisions.",
    source: "Audio editing rates vary by episode length, cleanup difficulty, and delivery requirements.",
  },
  handyman: {
    label: "Handyman / repair labor",
    rates: [45, 75, 125],
    note: "Use this for repair or installation labor. Add materials, trip charge, helper time, and tool wear.",
    source: "Local labor rates depend heavily on licensing, insurance, demand, and job risk.",
  },
  painting: {
    label: "Painting labor",
    rates: [40, 70, 120],
    note: "Count prep, masking, patching, cleanup, materials, ladders, travel, and number of coats.",
    source: "Painting is often bid flat-rate, but hourly planning should include prep and cleanup time.",
  },
  drywall: {
    label: "Drywall patch or repair",
    rates: [50, 85, 140],
    note: "Small drywall jobs need setup, drying time, sanding, texture match, cleanup, and sometimes return trips.",
    source: "Repair rates vary by finish level, texture matching, access, and minimum service charges.",
  },
  carpentry: {
    label: "Carpentry / trim work",
    rates: [55, 90, 160],
    note: "Use this for trim, shelves, doors, framing fixes, or small builds. Add material pickup, tools, and finishing.",
    source: "Carpentry rates depend on finish quality, tools, materials, and whether the work is structural.",
  },
  electrical: {
    label: "Electrical helper work",
    rates: [65, 110, 190],
    note: "Use only for work you are qualified and allowed to do. Electrical risk, licensing, and code matter.",
    source: "Electrical pricing is highly local and licensing-dependent; helper rates should not replace licensed bids.",
  },
  plumbing: {
    label: "Plumbing helper work",
    rates: [65, 110, 190],
    note: "Use only for work you are qualified and allowed to do. Add parts, water risk, access, and cleanup.",
    source: "Plumbing rates are highly local and risk-dependent; licensed work often carries higher minimums.",
  },
  hvac: {
    label: "HVAC service helper",
    rates: [70, 120, 200],
    note: "Use only for work you are qualified and allowed to do. Add diagnostic time, parts, travel, and safety risk.",
    source: "HVAC pricing depends on licensing, equipment, urgency, and local demand.",
  },
  appliance: {
    label: "Appliance repair",
    rates: [60, 95, 160],
    note: "Count diagnosis, travel, parts lookup, repair time, cleanup, and a minimum service call.",
    source: "Appliance repair often uses a diagnostic fee plus labor and parts.",
  },
  yard: {
    label: "Yard work / cleanup labor",
    rates: [30, 55, 95],
    note: "Use this for mowing, cleanup, hauling, trimming, or simple outdoor work. Add dump fees and equipment costs.",
    source: "Outdoor labor pricing is local and seasonal; equipment, disposal, and travel can matter more than the hourly rate.",
  },
  landscaping: {
    label: "Landscaping labor",
    rates: [40, 65, 120],
    note: "Count planning, digging, planting, mulch, hauling, cleanup, equipment, and material pickup.",
    source: "Landscape rates vary by season, materials, crew size, and equipment.",
  },
  pressureWash: {
    label: "Pressure washing",
    rates: [60, 100, 175],
    note: "Add setup, water access, chemicals, surface risk, cleanup, travel, and equipment wear.",
    source: "Pressure washing is often bid by surface or job size, but hourly planning should include equipment and risk.",
  },
  junkRemoval: {
    label: "Junk removal / hauling",
    rates: [50, 85, 150],
    note: "Count loading, dump time, dump fees, fuel, truck wear, helpers, and heavy-item risk.",
    source: "Hauling prices depend heavily on volume, disposal fees, distance, and labor intensity.",
  },
  snowRemoval: {
    label: "Snow removal",
    rates: [45, 75, 140],
    note: "Add weather urgency, travel, equipment, ice treatment, repeated visits, and liability risk.",
    source: "Snow removal pricing is seasonal and local, often using per-visit or subscription pricing.",
  },
  fenceDeck: {
    label: "Fence or deck repair",
    rates: [55, 90, 160],
    note: "Count tear-out, material pickup, cutting, fastening, cleanup, and whether posts or structure are involved.",
    source: "Fence and deck pricing depends on materials, access, rot, structural risk, and finish quality.",
  },
  mobileMechanic: {
    label: "Mobile mechanic",
    rates: [75, 120, 200],
    note: "Add diagnosis, travel, parts lookup, tool setup, job risk, and any warranty you offer.",
    source: "Mobile mechanic rates vary by skill, equipment, liability, and local shop-rate competition.",
  },
  autoDetail: {
    label: "Auto detailing",
    rates: [45, 80, 150],
    note: "Count wash, interior, extraction, polish, supplies, travel, weather, and vehicle condition.",
    source: "Detailing is often package-priced; hourly planning should include supplies and vehicle condition.",
  },
  smallEngine: {
    label: "Small engine repair",
    rates: [45, 75, 125],
    note: "Use this for mowers, trimmers, generators, and similar equipment. Add diagnosis, parts, and pickup time.",
    source: "Small engine repair pricing depends on parts availability, diagnosis time, and replacement value.",
  },
  houseCleaning: {
    label: "House cleaning",
    rates: [35, 55, 85],
    note: "Count bathrooms, kitchen, floors, pets, supplies, travel, and whether it is recurring or one-time.",
    source: "2026 cleaning guides commonly place hourly cleaning around $35-$75 per cleaner.",
  },
  deepCleaning: {
    label: "Deep cleaning / move-out clean",
    rates: [45, 75, 120],
    note: "Deep cleans take longer than normal cleaning. Add appliances, baseboards, grime, trash, and supplies.",
    source: "Deep cleaning and move-out work usually prices above recurring house cleaning.",
  },
  movingLabor: {
    label: "Moving labor",
    rates: [40, 65, 110],
    note: "Count stairs, heavy items, truck loading skill, travel, helpers, equipment, and injury risk.",
    source: "Moving labor rates vary by crew size, stairs, heavy items, and local demand.",
  },
  assembly: {
    label: "Furniture assembly",
    rates: [35, 60, 100],
    note: "Count unpacking, assembly, wall mounting, cleanup, missing parts, and travel.",
    source: "Assembly work is often flat-rate; hourly planning should include travel and cleanup.",
  },
  tutoring: {
    label: "Tutoring or lessons",
    rates: [30, 60, 125],
    note: "Use this for academic tutoring, music, software, or skill lessons. Add prep time and follow-up material.",
    source: "Tutoring rates depend on subject difficulty, credentials, age group, and local demand.",
  },
  bookkeeping: {
    label: "Bookkeeping help",
    rates: [40, 70, 130],
    note: "Count cleanup, categorizing, reconciliation, reporting, software setup, and meetings.",
    source: "Bookkeeping rates depend on complexity, software, monthly volume, and responsibility.",
  },
  virtualAssistant: {
    label: "Virtual assistant",
    rates: [25, 45, 90],
    note: "Use this for scheduling, inbox help, data entry, research, simple admin, or customer follow-up.",
    source: "Virtual assistant rates depend on skill level, specialization, speed, and responsibility.",
  },
};

const levelMultipliers = {
  starter: 0.78,
  working: 1,
  premium: 1.32,
};

const marketMultipliers = {
  budget: 0.82,
  standard: 1,
  strong: 1.24,
};

function readNumber(input) {
  const value = Number.parseFloat(input?.value || "0");
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function formatMoney(value) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0);
}

function updateDecisionPop(state) {
  const asset = decisionAssets[state] || decisionAssets.negotiate;
  if (!decisionImage || !decisionPop) return;
  decisionImage.src = asset.src;
  decisionImage.alt = asset.alt;
  decisionPop.dataset.state = state;
  if (lastDecisionState && lastDecisionState !== state) {
    decisionPop.classList.remove("is-popping");
    void decisionPop.offsetWidth;
    decisionPop.classList.add("is-popping");
    playDecisionSound(state);
  }
  lastDecisionState = state;
}

function decisionSoundForState(state) {
  if (state === "take") return soundTake;
  if (state === "pass") return soundPass;
  return soundNegotiate;
}

function ensureAudioGraph() {
  if (!themeSong || !useMobileAudioMix || themeGainNode) return;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;
  audioContext = audioContext || new AudioContextConstructor();
  themeSourceNode = themeSourceNode || audioContext.createMediaElementSource(themeSong);
  themeGainNode = audioContext.createGain();
  themeGainNode.gain.value = themeVolume;
  themeSourceNode.connect(themeGainNode).connect(audioContext.destination);
}

function resumeAudioGraph() {
  ensureAudioGraph();
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function suspendAudioGraph() {
  if (audioContext && audioContext.state === "running") {
    audioContext.suspend().catch(() => {});
  }
}

function setThemeLevel(volume) {
  if (!themeSong) return;
  themeSong.volume = volume;
  if (themeGainNode) {
    themeGainNode.gain.value = volume;
  }
}

function playThemeSong() {
  if (!themeSong || !soundEnabled || document.hidden) return;
  resumeAudioGraph();
  setThemeLevel(themeVolume);
  themeSong.loop = true;
  try {
    const playPromise = themeSong.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch {
    // Browser autoplay rules vary; the first user gesture will retry playback.
  }
}

function pauseAllAudio() {
  window.clearTimeout(themeDuckTimer);
  themeWasPlayingBeforeDuck = false;
  [themeSong, soundTake, soundNegotiate, soundPass].filter(Boolean).forEach((sound) => {
    sound.pause();
  });
}

function pauseAudioForPageLifecycle() {
  pauseAllAudio();
  suspendAudioGraph();
}

function stopAudioForPageExit() {
  audioUnlocked = false;
  pauseAudioForPageLifecycle();
}

function resumeAudioAfterPageReturn() {
  if (!document.hidden && soundEnabled && audioUnlocked) {
    syncThemePlayback();
  }
}

function syncThemePlayback() {
  if (soundEnabled) {
    playThemeSong();
  } else {
    pauseAllAudio();
  }
}

function duckThemeForDecisionSound() {
  if (!themeSong || !soundEnabled) return;
  window.clearTimeout(themeDuckTimer);
  if (usePauseDuckingForDecision) {
    themeWasPlayingBeforeDuck = !themeSong.paused;
    if (themeWasPlayingBeforeDuck) {
      themeSong.pause();
    }
    return;
  }
  setThemeLevel(duckedThemeVolume);
  themeDuckTimer = window.setTimeout(() => {
    restoreThemeAfterDecisionSound();
  }, 1800);
}

function restoreThemeAfterDecisionSound() {
  window.clearTimeout(themeDuckTimer);
  if (!themeSong || !soundEnabled) return;
  setThemeLevel(themeVolume);
  if (usePauseDuckingForDecision && themeWasPlayingBeforeDuck) {
    themeWasPlayingBeforeDuck = false;
    playThemeSong();
  }
}

function unlockDecisionAudio() {
  audioUnlocked = true;
  syncThemePlayback();
}

function playDecisionSound(state) {
  if (!soundEnabled || !audioUnlocked) return;
  const sound = decisionSoundForState(state);
  if (!sound) return;
  try {
    sound.pause();
    sound.currentTime = 0;
    sound.volume = decisionSoundVolume;
    duckThemeForDecisionSound();
    sound.addEventListener("ended", restoreThemeAfterDecisionSound, { once: true });
    sound.addEventListener("pause", restoreThemeAfterDecisionSound, { once: true });
    const playPromise = sound.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        restoreThemeAfterDecisionSound();
      });
    }
  } catch {
    restoreThemeAfterDecisionSound();
    // Audio is decorative; calculator behavior should never depend on it.
  }
}

function updateSoundToggle() {
  if (!soundToggleButton) return;
  soundToggleButton.textContent = soundEnabled ? "Sound on" : "Sound off";
  soundToggleButton.setAttribute("aria-pressed", String(soundEnabled));
}

function calculateQuote() {
  const quote = readNumber(projectPriceInput);
  const targetHourly = readNumber(targetHourlyInput);
  const productionHours = readNumber(productionHoursInput);
  const adminHours = readNumber(adminHoursInput);
  const revisionBuffer = readNumber(revisionBufferInput) / 100;
  const expenses = readNumber(expensesInput);
  const feeRate = readNumber(platformFeeInput) / 100;
  const reserveRate = readNumber(cashReserveInput) / 100;
  const totalRate = Math.min(feeRate + reserveRate, 0.95);
  const totalHours = productionHours + adminHours + productionHours * revisionBuffer;
  const feeCost = quote * feeRate;
  const reserve = quote * reserveRate;
  const net = quote - expenses - feeCost - reserve;
  const trueHourly = totalHours > 0 ? net / totalHours : 0;
  const targetQuote = totalHours > 0
    ? (targetHourly * totalHours + expenses) / (1 - totalRate)
    : expenses / (1 - totalRate);
  const gap = quote - targetQuote;
  const gapText = `${gap >= 0 ? "above" : "below"} your floor by ${formatMoney(Math.abs(gap))}`;

  let state = "pass";
  let title = "Pass or re-scope";
  let copy = `This job is ${gapText}. Ask for a smaller scope, a higher quote, or better terms.`;

  if (trueHourly >= targetHourly * 1.1) {
    state = "take";
    title = "Worth taking";
    copy = `This quote clears your floor and leaves about ${formatMoney(gap)} of room.`;
  } else if (trueHourly >= targetHourly * 0.9) {
    state = "negotiate";
    title = "Negotiate first";
    copy = `This job is close, but it is ${gapText}. Tighten scope or raise the quote.`;
  }

  decisionBadge.textContent = state === "take" ? "Take" : state === "negotiate" ? "Negotiate" : "Pass";
  decisionBadge.dataset.state = state;
  updateDecisionPop(state);
  decisionTitle.textContent = title;
  decisionCopy.textContent = copy;
  trueHourlyOutput.textContent = formatMoney(trueHourly);
  targetQuoteOutput.textContent = formatMoney(targetQuote);
  netProfitOutput.textContent = formatMoney(net);
  totalHoursOutput.textContent = totalHours.toFixed(totalHours % 1 === 0 ? 0 : 1);
  calcOutput.textContent = `At ${formatMoney(quote)}, your true hourly rate is ${formatMoney(trueHourly)}.`;

  return {
    quote,
    targetQuote,
    trueHourly,
    targetHourly,
    totalHours,
    state: decisionBadge.textContent,
  };
}

function quoteForHourly(hourlyRate) {
  const productionHours = readNumber(productionHoursInput);
  const adminHours = readNumber(adminHoursInput);
  const revisionBuffer = readNumber(revisionBufferInput) / 100;
  const expenses = readNumber(expensesInput);
  const feeRate = readNumber(platformFeeInput) / 100;
  const reserveRate = readNumber(cashReserveInput) / 100;
  const totalRate = Math.min(feeRate + reserveRate, 0.95);
  const totalHours = productionHours + adminHours + productionHours * revisionBuffer;
  return totalHours > 0
    ? (hourlyRate * totalHours + expenses) / (1 - totalRate)
    : expenses / (1 - totalRate);
}

function selectedRateGuide() {
  const guide = rateGuides[rateTaskInput?.value] || rateGuides.portrait;
  const levelMultiplier = levelMultipliers[rateLevelInput?.value] || 1;
  const marketMultiplier = marketMultipliers[rateMarketInput?.value] || 1;
  const multiplier = levelMultiplier * marketMultiplier;
  const adjustedRates = guide.rates.map((rate) => Math.round((rate * multiplier) / 5) * 5);
  return {
    guide,
    low: adjustedRates[0],
    typical: adjustedRates[1],
    high: adjustedRates[2],
    suggestedQuote: quoteForHourly(adjustedRates[1]),
  };
}

function updateRateHelper() {
  if (!rateTaskInput) return null;
  const result = selectedRateGuide();
  rateLowOutput.textContent = `${formatMoney(result.low)}/hr`;
  rateTypicalOutput.textContent = `${formatMoney(result.typical)}/hr`;
  rateHighOutput.textContent = `${formatMoney(result.high)}/hr`;
  rateGuidance.textContent = `${result.guide.note} With your hours and costs, the typical-rate quote is about ${formatMoney(result.suggestedQuote)}.`;
  rateSource.textContent = `Source note: ${result.guide.source}`;
  rateOutput.textContent = `Use ${formatMoney(result.typical)}/hr as a starting point, or quote around ${formatMoney(result.suggestedQuote)} for this job.`;
  return result;
}

function buildSummary() {
  const result = calculateQuote();
  return [
    "Quotetron",
    `Decision: ${result.state}`,
    `Quote: ${formatMoney(result.quote)}`,
    `Target quote: ${formatMoney(result.targetQuote)}`,
    `True hourly: ${formatMoney(result.trueHourly)} vs ${formatMoney(result.targetHourly)} target`,
    `Estimated hours: ${result.totalHours.toFixed(result.totalHours % 1 === 0 ? 0 : 1)}`,
    window.location.href,
  ].join("\n");
}

function resetDefaults() {
  projectPriceInput.value = defaults.projectPrice;
  targetHourlyInput.value = defaults.targetHourly;
  productionHoursInput.value = defaults.productionHours;
  adminHoursInput.value = defaults.adminHours;
  revisionBufferInput.value = defaults.revisionBuffer;
  expensesInput.value = defaults.expenses;
  platformFeeInput.value = defaults.platformFee;
  cashReserveInput.value = defaults.cashReserve;
  calculateQuote();
  updateRateHelper();
}

if (quoteForm) {
  quoteForm.addEventListener("input", () => {
    unlockDecisionAudio();
    calculateQuote();
    updateRateHelper();
  });
  calculateQuote();
}

if (copySummaryButton) {
  copySummaryButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(buildSummary());
    copySummaryButton.textContent = "Copied";
    window.setTimeout(() => {
      copySummaryButton.textContent = "Copy summary";
    }, 1600);
  });
}

if (resetButton) {
  resetButton.addEventListener("click", () => {
    unlockDecisionAudio();
    resetDefaults();
  });
}

if (rateTaskInput) {
  [rateTaskInput, rateLevelInput, rateMarketInput].forEach((input) => {
    input.addEventListener("input", () => {
      unlockDecisionAudio();
      updateRateHelper();
    });
    input.addEventListener("change", () => {
      unlockDecisionAudio();
      updateRateHelper();
    });
  });
  updateRateHelper();
}

if (useRateButton) {
  useRateButton.addEventListener("click", () => {
    unlockDecisionAudio();
    const result = updateRateHelper();
    targetHourlyInput.value = result.typical;
    calculateQuote();
    updateRateHelper();
  });
}

if (useQuoteButton) {
  useQuoteButton.addEventListener("click", () => {
    unlockDecisionAudio();
    const result = updateRateHelper();
    projectPriceInput.value = Math.round(result.suggestedQuote / 25) * 25;
    calculateQuote();
    updateRateHelper();
  });
}

if (soundToggleButton) {
  soundToggleButton.addEventListener("click", () => {
    audioUnlocked = true;
    soundEnabled = !soundEnabled;
    updateSoundToggle();
    syncThemePlayback();
  });
  updateSoundToggle();
}

["pointerdown", "click", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, unlockDecisionAudio, { once: true, passive: true });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseAudioForPageLifecycle();
  } else {
    resumeAudioAfterPageReturn();
  }
});

window.addEventListener("pagehide", stopAudioForPageExit);
window.addEventListener("beforeunload", stopAudioForPageExit);
window.addEventListener("freeze", pauseAudioForPageLifecycle);
window.addEventListener("pageshow", resumeAudioAfterPageReturn);

playThemeSong();

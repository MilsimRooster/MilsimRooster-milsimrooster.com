(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const DEFAULT_PRESET = {
    width: 188,
    height: 76,
    scale: 32,
    edge: 42
  };
  const proofPreset = {
    width: 230,
    height: 104,
    scale: 92,
    edge: 86
  };

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function generateDisplacementMap(width, height, edgeStrength) {
    const canvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mapWidth = Math.round(width * dpr);
    const mapHeight = Math.round(height * dpr);
    canvas.width = mapWidth;
    canvas.height = mapHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = ctx.createImageData(mapWidth, mapHeight);
    const data = image.data;
    const power = 4.6;
    const edge = edgeStrength / 100;

    for (let y = 0; y < mapHeight; y += 1) {
      for (let x = 0; x < mapWidth; x += 1) {
        const nx = (x / (mapWidth - 1) - 0.5) * 2;
        const ny = (y / (mapHeight - 1) - 0.5) * 2;
        const shape = Math.pow(Math.pow(Math.abs(nx), power) + Math.pow(Math.abs(ny), power), 1 / power);
        const inside = shape <= 1 ? 1 : 0;
        const edgeBand = smoothstep(0.18, 1, shape);
        const centerPull = (1 - edgeBand) * 0.16;
        const rimPush = edgeBand * edge;
        const bend = inside * (rimPush - centerPull);
        const index = (y * mapWidth + x) * 4;
        data[index] = Math.max(0, Math.min(255, 128 + nx * bend * 118));
        data[index + 1] = Math.max(0, Math.min(255, 128 + ny * bend * 118));
        data[index + 2] = 128;
        data[index + 3] = inside ? 255 : 0;
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  }

  function ensureFilter(stage) {
    const filterId = stage.dataset.liquidGlassFilter || "mr-liquid-glass-filter";
    if (document.getElementById(filterId)) {
      return filterId;
    }

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";

    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", filterId);
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", "100%");
    filter.setAttribute("height", "100%");
    filter.setAttribute("color-interpolation-filters", "sRGB");

    const image = document.createElementNS(SVG_NS, "feImage");
    image.setAttribute("id", `${filterId}-map`);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", String(DEFAULT_PRESET.width));
    image.setAttribute("height", String(DEFAULT_PRESET.height));
    image.setAttribute("result", "map");
    image.setAttribute("preserveAspectRatio", "none");

    const displace = document.createElementNS(SVG_NS, "feDisplacementMap");
    displace.setAttribute("id", `${filterId}-displace`);
    displace.setAttribute("in", "SourceGraphic");
    displace.setAttribute("in2", "map");
    displace.setAttribute("scale", String(DEFAULT_PRESET.scale));
    displace.setAttribute("xChannelSelector", "R");
    displace.setAttribute("yChannelSelector", "G");
    displace.setAttribute("result", "bent");

    const saturate = document.createElementNS(SVG_NS, "feColorMatrix");
    saturate.setAttribute("in", "bent");
    saturate.setAttribute("type", "saturate");
    saturate.setAttribute("values", "1.28");
    saturate.setAttribute("result", "sat");

    filter.append(image, displace, saturate);
    svg.append(filter);
    document.body.prepend(svg);
    return filterId;
  }

  function getPresetFromInputs(controls, fallbackPreset = DEFAULT_PRESET) {
    return {
      width: Number(controls.width?.value) || fallbackPreset.width,
      height: Number(controls.height?.value) || fallbackPreset.height,
      scale: Number(controls.scale?.value) || fallbackPreset.scale,
      edge: Number(controls.edge?.value) || fallbackPreset.edge
    };
  }

  function formatPreset(preset) {
    return JSON.stringify({
      component: "mr-liquid-glass",
      values: preset,
      css: {
        "--mrlg-width": `${preset.width}px`,
        "--mrlg-height": `${preset.height}px`
      },
      svg: {
        displacementScale: preset.scale,
        edgeStrength: preset.edge
      }
    }, null, 2);
  }

  function readSaved(storageKey) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && typeof saved === "object" ? saved : null;
    } catch {
      return null;
    }
  }

  function readStagePreset(stage) {
    return {
      width: Number(stage.dataset.liquidGlassWidth) || DEFAULT_PRESET.width,
      height: Number(stage.dataset.liquidGlassHeight) || DEFAULT_PRESET.height,
      scale: Number(stage.dataset.liquidGlassScale) || DEFAULT_PRESET.scale,
      edge: Number(stage.dataset.liquidGlassEdge) || DEFAULT_PRESET.edge
    };
  }

  function buildSceneReplica(scene) {
    const replica = scene.cloneNode(true);
    replica.classList.add("mr-liquid-glass__replica");
    replica.removeAttribute("data-liquid-glass-scene");
    replica.setAttribute("aria-hidden", "true");

    for (const node of replica.querySelectorAll("[id], [data-liquid-glass-stage], [data-liquid-glass-scene], [data-liquid-glass-lens]")) {
      node.removeAttribute("id");
      node.removeAttribute("data-liquid-glass-stage");
      node.removeAttribute("data-liquid-glass-scene");
      node.removeAttribute("data-liquid-glass-lens");
    }

    return replica;
  }

  function init(stage) {
    if (stage.dataset.liquidGlassReady === "true") {
      return null;
    }

    const scene = stage.querySelector("[data-liquid-glass-scene]");
    const lens = stage.querySelector("[data-liquid-glass-lens]");
    if (!scene || !lens) {
      return null;
    }

    stage.dataset.liquidGlassReady = "true";
    stage.classList.add("mr-liquid-glass-stage");
    lens.classList.add("mr-liquid-glass");

    const filterId = ensureFilter(stage);
    const source = lens.querySelector(".mr-liquid-glass__source") || document.createElement("div");
    const refract = source.querySelector(".mr-liquid-glass__refract") || document.createElement("div");
    const sceneClone = refract.querySelector(".mr-liquid-glass__scene") || document.createElement("div");
    source.className = "mr-liquid-glass__source";
    refract.className = "mr-liquid-glass__refract";
    refract.style.filter = `url("#${filterId}")`;
    sceneClone.className = "mr-liquid-glass__scene";
    sceneClone.replaceChildren(buildSceneReplica(scene));
    refract.replaceChildren(sceneClone);
    source.replaceChildren(refract);
    if (!source.parentElement) {
      lens.prepend(source);
    }

    const mapNode = document.getElementById(`${filterId}-map`);
    const displaceNode = document.getElementById(`${filterId}-displace`);
    const storageKey = stage.dataset.liquidGlassKey || "mr-liquid-glass-preset";
    const defaultPreset = readStagePreset(stage);
    const controls = {
      width: document.querySelector("[data-liquid-glass-control='width']"),
      height: document.querySelector("[data-liquid-glass-control='height']"),
      scale: document.querySelector("[data-liquid-glass-control='scale']"),
      edge: document.querySelector("[data-liquid-glass-control='edge']")
    };
    const outputs = {
      width: document.querySelector("[data-liquid-glass-output='width']"),
      height: document.querySelector("[data-liquid-glass-output='height']"),
      scale: document.querySelector("[data-liquid-glass-output='scale']"),
      edge: document.querySelector("[data-liquid-glass-output='edge']")
    };
    const presetOutput = document.querySelector("[data-liquid-glass-preset-output]");
    const status = document.querySelector("[data-liquid-glass-status]");

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function syncStageSize() {
      const rect = stage.getBoundingClientRect();
      const fixedLens = getComputedStyle(lens).position === "fixed";
      stage.style.setProperty("--mrlg-stage-width", `${fixedLens ? window.innerWidth : rect.width}px`);
      stage.style.setProperty("--mrlg-stage-height", `${fixedLens ? window.innerHeight : rect.height}px`);
    }

    function updateOutputs(preset) {
      Object.entries(outputs).forEach(([key, node]) => {
        if (node) {
          node.value = preset[key];
        }
      });
      if (presetOutput) {
        presetOutput.value = formatPreset(preset);
      }
    }

    function applyPreset(preset) {
      Object.entries(controls).forEach(([key, control]) => {
        if (control) {
          control.value = preset[key];
        }
      });
      updateGlass();
    }

    function updateGlass() {
      const preset = getPresetFromInputs(controls, defaultPreset);
      lens.style.setProperty("--mrlg-width", `${preset.width}px`);
      lens.style.setProperty("--mrlg-height", `${preset.height}px`);
      if (mapNode) {
        mapNode.setAttribute("width", String(preset.width));
        mapNode.setAttribute("height", String(preset.height));
        mapNode.setAttribute("href", generateDisplacementMap(preset.width, preset.height, preset.edge));
      }
      if (displaceNode) {
        displaceNode.setAttribute("scale", String(preset.scale));
      }
      syncStageSize();
      updateOutputs(preset);
    }

    function moveLens(clientX, clientY) {
      const rect = stage.getBoundingClientRect();
      const preset = getPresetFromInputs(controls, defaultPreset);
      const fixedLens = getComputedStyle(lens).position === "fixed";
      const maxX = fixedLens ? window.innerWidth : rect.width;
      const maxY = fixedLens ? window.innerHeight : rect.height;
      const rawX = fixedLens ? clientX : clientX - rect.left;
      const rawY = fixedLens ? clientY : clientY - rect.top;
      const x = Math.max(preset.width / 2 + 10, Math.min(maxX - preset.width / 2 - 10, rawX));
      const y = Math.max(preset.height / 2 + 10, Math.min(maxY - preset.height / 2 - 10, rawY));
      lens.style.setProperty("--mrlg-x", `${x}px`);
      lens.style.setProperty("--mrlg-y", `${y}px`);
      if (fixedLens) {
        sceneClone.style.left = `${-(x - preset.width / 2) - window.scrollX}px`;
        sceneClone.style.top = `${-(y - preset.height / 2) - window.scrollY}px`;
      }
    }

    function savePreset() {
      const preset = getPresetFromInputs(controls, defaultPreset);
      localStorage.setItem(storageKey, JSON.stringify(preset));
      updateOutputs(preset);
      setStatus(`Saved: width ${preset.width}, height ${preset.height}, bend ${preset.scale}, edge ${preset.edge}.`);
    }

    async function copyPreset() {
      if (!presetOutput) {
        return;
      }
      presetOutput.focus();
      presetOutput.select();
      try {
        await navigator.clipboard.writeText(presetOutput.value);
        setStatus("Preset copied.");
      } catch {
        document.execCommand("copy");
        setStatus("Preset selected for copy.");
      }
    }

    stage.addEventListener("pointermove", (event) => moveLens(event.clientX, event.clientY));
    stage.addEventListener("pointerenter", (event) => moveLens(event.clientX, event.clientY));
    Object.values(controls).forEach((control) => {
      if (control) {
        control.addEventListener("input", updateGlass);
      }
    });
    document.querySelector("[data-liquid-glass-save]")?.addEventListener("click", savePreset);
    document.querySelector("[data-liquid-glass-copy]")?.addEventListener("click", copyPreset);
    document.querySelector("[data-liquid-glass-proof]")?.addEventListener("click", () => {
      applyPreset(proofPreset);
      setStatus("Proof preset loaded. Drag the glass over the BEND TEST stripe band.");
    });
    document.querySelector("[data-liquid-glass-reset]")?.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      applyPreset(defaultPreset);
      setStatus("Reset to default preset.");
    });
    window.addEventListener("resize", updateGlass);

    const saved = readSaved(storageKey);
    applyPreset(saved || defaultPreset);
    if (saved) {
      setStatus(`Loaded saved preset: width ${saved.width}, height ${saved.height}, bend ${saved.scale}, edge ${saved.edge}.`);
    }

    return {
      applyPreset,
      savePreset,
      proofPreset,
      updateGlass
    };
  }

  function initAll() {
    return Array.from(document.querySelectorAll("[data-liquid-glass-stage]"), init).filter(Boolean);
  }

  function watchForStages() {
    if (!("MutationObserver" in window)) {
      return;
    }

    const observer = new MutationObserver(() => {
      initAll();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  window.MRLiquidGlass = {
    init,
    initAll,
    generateDisplacementMap,
    proofPreset
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initAll();
      watchForStages();
    }, { once: true });
  } else {
    initAll();
    watchForStages();
  }
}());

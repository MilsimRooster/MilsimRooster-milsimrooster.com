import gsap from "gsap";
import * as THREE from "three";
import { archiveItems, archiveStats } from "./archive-data.js";
import "./styles.css";

const galleryBuild = "20260612-visual-data-trim-1";
document.documentElement.dataset.galleryBuild = galleryBuild;
document.documentElement.dataset.archiveItems = String(archiveStats.selectedCount);

// Archive data uses /media/archive/milsim/ public asset paths.
const galleryItems = archiveItems;

const canvas = document.querySelector("#sphere-gallery");
const shell = document.querySelector(".gallery-shell");
const activeTitle = document.querySelector("#active-title");
const archiveProgress = document.querySelector("#archive-progress");
const expanded = document.querySelector(".expand-view");
const expandedImage = document.querySelector("#expanded-image");
const expandedTitle = document.querySelector("#expanded-title");
const expandedMeta = document.querySelector("#expanded-meta");
const closeExpand = document.querySelector(".close-expand");
const previousItemButton = document.querySelector(".modal-prev");
const nextItemButton = document.querySelector(".modal-next");
const soundButton = document.querySelector(".sound-pill");
const themeAudio = document.querySelector("#gallery-theme");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.018);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, 0.01);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const sphereGroup = new THREE.Group();
scene.add(sphereGroup);

const raycaster = new THREE.Raycaster();
const focusRaycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const centerPointer = new THREE.Vector2(0, 0);
const cardMeshes = [];
const radius = 23;
const focusColor = new THREE.Color(0xffffff);
const nearColor = new THREE.Color(0xe8ecd8);
const midColor = new THREE.Color(0xcfd8bf);
const farColor = new THREE.Color(0x9ba997);

let activeModalItem = null;
let activeMesh = null;
let targetYaw = 0;
let targetPitch = 0;
let currentYaw = targetYaw;
let currentPitch = targetPitch;
let lastX = 0;
let lastY = 0;
let dragDistance = 0;
let isPointerDown = false;
let isModalOpen = false;
let isThemePlaying = false;
let wantsTheme = true;
let lastInteractionTime = performance.now();
const visitedStorageKey = "milsim-rooster-gallery-visited";
const visitedItems = new Set(loadVisitedItems());

function loadVisitedItems() {
  try {
    return JSON.parse(localStorage.getItem(visitedStorageKey) || "[]");
  } catch {
    return [];
  }
}

function saveVisitedItems() {
  try {
    localStorage.setItem(visitedStorageKey, JSON.stringify([...visitedItems]));
  } catch {
  }
}

function getItemKey(item) {
  return item.archiveId || item.src || item.title;
}

function getItemIndex(item) {
  return Math.max(0, galleryItems.findIndex((candidate) => candidate === item || candidate.archiveId === item.archiveId));
}

function getArchiveProgressLabel() {
  const scanned = String(visitedItems.size).padStart(2, "0");
  const total = String(galleryItems.length).padStart(2, "0");
  return `${scanned} / ${total} scanned`;
}

function markVisited(item) {
  visitedItems.add(getItemKey(item));
  saveVisitedItems();
  updateProgressHud();
}

function updateProgressHud() {
  if (!archiveProgress) return;
  archiveProgress.textContent = getArchiveProgressLabel();
}

function makeCanvasTexture(item, index) {
  const source = document.createElement("canvas");
  source.width = 1024;
  source.height = 1360;
  const ctx = source.getContext("2d");

  ctx.fillStyle = "#030404";
  ctx.fillRect(0, 0, source.width, source.height);
  const wash = ctx.createLinearGradient(0, 0, source.width, source.height);
  wash.addColorStop(0, "rgba(184,200,145,0.09)");
  wash.addColorStop(0.52, "rgba(255,255,255,0.015)");
  wash.addColorStop(1, "rgba(189,118,88,0.08)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, source.width, source.height);

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, source.width - 48, source.height - 48);

  ctx.strokeStyle = "rgba(184,200,145,0.42)";
  ctx.lineWidth = 7;
  [
    [24, 24, 104, 0], [24, 24, 0, 104],
    [source.width - 128, 24, 104, 0], [source.width - 24, 24, 0, 104],
    [24, source.height - 24, 104, 0], [24, source.height - 128, 0, 104],
    [source.width - 128, source.height - 24, 104, 0], [source.width - 24, source.height - 128, 0, 104]
  ].forEach(([x, y, w, h]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
  texture.offset.x = 1;
  return { source, ctx, texture };
}

function drawImageIntoCard(ctx, image) {
  const frame = { x: 48, y: 48, w: 928, h: 1264 };
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const frameRatio = frame.w / frame.h;
  let drawW = frame.w;
  let drawH = frame.h;
  let drawX = frame.x;
  let drawY = frame.y;

  if (imageRatio > frameRatio) {
    drawH = frame.h;
    drawW = frame.h * imageRatio;
    drawX = frame.x - (drawW - frame.w) / 2;
  } else {
    drawW = frame.w;
    drawH = frame.w / imageRatio;
    drawY = frame.y - (drawH - frame.h) / 2;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawW, drawH);
  const overlay = ctx.createLinearGradient(0, frame.y, 0, frame.y + frame.h);
  overlay.addColorStop(0, "rgba(3,4,4,0.02)");
  overlay.addColorStop(0.72, "rgba(3,4,4,0.02)");
  overlay.addColorStop(1, "rgba(3,4,4,0.38)");
  ctx.fillStyle = overlay;
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
}

function placeCard(mesh, index, count) {
  const rows = 3;
  const columns = Math.ceil(count / rows);
  const row = index % rows;
  const column = Math.floor(index / rows);
  const thetaStep = Math.PI * 2 / columns;
  const theta = (column * thetaStep) - Math.PI + (row % 2 ? thetaStep * 0.5 : 0);
  const phi = THREE.MathUtils.lerp(0.98, 2.05, row / (rows - 1));
  const depthOffset = [-0.8, -2.0, 1.65][row] + (((column % 3) - 1) * 0.28);
  const cardRadius = radius + depthOffset;

  mesh.userData.depthLayer = row === 1 ? "near" : row === 0 ? "mid" : "far";
  mesh.userData.baseScale = row === 1 ? 1.04 : row === 0 ? 0.95 : 0.9;
  mesh.userData.baseOpacity = row === 1 ? 0.97 : row === 0 ? 0.82 : 0.72;

  mesh.position.set(
    cardRadius * Math.sin(phi) * Math.sin(theta),
    cardRadius * Math.cos(phi),
    cardRadius * Math.sin(phi) * Math.cos(theta)
  );
  mesh.lookAt(0, 0, 0);
  mesh.rotateY(Math.PI);
}

function createFocusOutline() {
  const outlineGeometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(8.65, 11.35));
  const outlineMaterial = new THREE.LineBasicMaterial({
    color: 0xb8c891,
    transparent: true,
    opacity: 0
  });
  const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
  outline.position.z = 0.05;
  return outline;
}

function createCards() {
  const geometry = new THREE.PlaneGeometry(8.4, 11.1, 10, 10);

  galleryItems.forEach((item, index) => {
    const { source, ctx, texture } = makeCanvasTexture(item, index);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.96
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { item, source, texture, baseScale: 1 };
    placeCard(mesh, index, galleryItems.length);
    const outline = createFocusOutline();
    mesh.add(outline);
    mesh.userData.outline = outline;
    mesh.material.opacity = mesh.userData.baseOpacity;
    mesh.material.color.copy(mesh.userData.depthLayer === "near" ? nearColor : mesh.userData.depthLayer === "mid" ? midColor : farColor);
    mesh.scale.setScalar(mesh.userData.baseScale);
    sphereGroup.add(mesh);
    cardMeshes.push(mesh);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      drawImageIntoCard(ctx, image);
      texture.needsUpdate = true;
    };
    image.src = item.src;
  });
}

function addGridLines() {
  const material = new THREE.LineBasicMaterial({
    color: 0xb8c891,
    transparent: true,
    opacity: 0.045
  });

  for (let i = 0; i < 12; i += 1) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(180).map((point) => new THREE.Vector3(point.x, 0, point.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, material);
    line.rotation.x = Math.PI / 2;
    line.rotation.y = (i / 12) * Math.PI;
    line.renderOrder = -1;
    sphereGroup.add(line);
  }

  for (let i = 1; i < 5; i += 1) {
    const y = THREE.MathUtils.lerp(-radius * 0.68, radius * 0.68, i / 5);
    const ringRadius = Math.sqrt(radius * radius - y * y);
    const curve = new THREE.EllipseCurve(0, 0, ringRadius, ringRadius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(180).map((point) => new THREE.Vector3(point.x, y, point.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const ring = new THREE.LineLoop(geometry, material);
    ring.renderOrder = -1;
    sphereGroup.add(ring);
  }
}

function addAmbientArchiveField() {
  const points = [];
  for (let i = 0; i < 150; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = THREE.MathUtils.lerp(0.54, 2.42, Math.random());
    const pointRadius = radius + 4 + Math.random() * 8;
    points.push(
      pointRadius * Math.sin(phi) * Math.sin(theta),
      pointRadius * Math.cos(phi),
      pointRadius * Math.sin(phi) * Math.cos(theta)
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.PointsMaterial({
    color: 0xb8c891,
    transparent: true,
    opacity: 0.13,
    size: 0.08,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(geometry, material);
  particles.renderOrder = -2;
  sphereGroup.add(particles);
}

function setSoundButtonState(pressed) {
  if (!soundButton) return;
  soundButton.textContent = pressed ? "Sound On" : "Sound Off";
  soundButton.setAttribute("aria-pressed", String(pressed));
  soundButton.dataset.playing = String(isThemePlaying);
}

async function startTheme() {
  if (!themeAudio) return;
  wantsTheme = true;
  setSoundButtonState(true);

  try {
    themeAudio.volume = 0.38;
    await themeAudio.play();
    isThemePlaying = true;
    setSoundButtonState(true);
  } catch {
    isThemePlaying = false;
    setSoundButtonState(true);
  }
}

function stopTheme() {
  if (!themeAudio) return;
  wantsTheme = false;
  themeAudio.pause();
  isThemePlaying = false;
  setSoundButtonState(false);
}

async function toggleTheme() {
  if (wantsTheme) {
    stopTheme();
  } else {
    await startTheme();
  }
}

function unlockTheme() {
  if (wantsTheme && !isThemePlaying) {
    startTheme();
  }
}

function setHud(item) {
  activeTitle.textContent = item.title;
  updateProgressHud();
}

function setModalMetadata(item) {
  if (!expandedMeta) return;

  const values = [
    item.archiveId || "MR-FIELD",
    `${item.assetCount || 1} Assets`
  ];
  expandedMeta.replaceChildren(...values.map((value) => {
    const pill = document.createElement("span");
    pill.textContent = value;
    return pill;
  }));
}

function updatePointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
}

function markInteraction() {
  lastInteractionTime = performance.now();
}

function pickCard(event) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster
    .intersectObjects(cardMeshes, false)
    .filter((hit) => hit.object.visible && hit.object.material.opacity > 0.2);
  return intersections[0]?.object || null;
}

function pickCenterCard() {
  focusRaycaster.setFromCamera(centerPointer, camera);
  return focusRaycaster
    .intersectObjects(cardMeshes, false)
    .find((hit) => hit.object.visible && hit.object.material.opacity > 0.28)?.object || null;
}

function openItem(item) {
  isModalOpen = true;
  activeModalItem = item;
  markVisited(item);
  setHud(item);
  expandedImage.src = item.src;
  expandedImage.alt = item.title;
  expandedTitle.textContent = item.title;
  setModalMetadata(item);
  expanded.classList.add("is-open");
  expanded.setAttribute("aria-hidden", "false");
  expanded.inert = false;
  gsap.killTweensOf([expanded, ".expand-card"]);
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(expanded, { autoAlpha: 1, backgroundColor: "rgba(0,0,0,0.72)", duration: 0.26 }, 0)
    .to(".expand-card", { scale: 1, duration: 0.42 }, 0.04);
}

function stepModal(direction) {
  const currentItem = activeModalItem || activeMesh?.userData.item || galleryItems[0];
  const currentIndex = getItemIndex(currentItem);
  const nextIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
  const nextItem = galleryItems[nextIndex];
  if (isModalOpen) {
    openItem(nextItem);
  } else {
    setHud(nextItem);
  }
}

function closeItem() {
  isModalOpen = false;
  activeModalItem = null;
  gsap.killTweensOf([expanded, ".expand-card"]);
  gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      expanded.classList.remove("is-open");
      expanded.setAttribute("aria-hidden", "true");
      expanded.inert = true;
      expandedImage.removeAttribute("src");
    }
  })
    .to(".expand-card", { scale: 0.9, duration: 0.22 }, 0)
    .to(expanded, { autoAlpha: 0, backgroundColor: "rgba(0,0,0,0)", duration: 0.24 }, 0);
}

function animateIn() {
  gsap.fromTo(
    cardMeshes.map((mesh) => mesh.scale),
    { x: 0.78, y: 0.78, z: 1 },
    { x: 1, y: 1, z: 1, duration: 1.1, stagger: { amount: 0.55, from: "center" }, ease: "power3.out" }
  );
  gsap.fromTo(
    [".gallery-topbar", ".gallery-hud", ".sound-pill"],
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" }
  );
}

function onPointerDown(event) {
  if (isModalOpen) return;
  markInteraction();
  isPointerDown = true;
  dragDistance = 0;
  lastX = event.clientX;
  lastY = event.clientY;
  shell.classList.add("is-dragging");
  canvas.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
  if (!isPointerDown || isModalOpen) return;
  markInteraction();
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;
  dragDistance += Math.abs(dx) + Math.abs(dy);

  targetYaw += dx * 0.0042;
  targetPitch += dy * 0.0028;
  targetPitch = THREE.MathUtils.clamp(targetPitch, -0.72, 0.72);
}

function onPointerUp(event) {
  if (!isPointerDown || isModalOpen) return;
  markInteraction();
  isPointerDown = false;
  shell.classList.remove("is-dragging");
  canvas.releasePointerCapture?.(event.pointerId);

  const selected = pickCard(event);
  if (selected && dragDistance < 8) {
    openItem(selected.userData.item);
  }
}

function onWheel(event) {
  if (isModalOpen) return;
  markInteraction();
  event.preventDefault();
  targetYaw += event.deltaX * 0.0016;
  targetPitch += event.deltaY * 0.0011;
  targetPitch = THREE.MathUtils.clamp(targetPitch, -0.72, 0.72);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame(render);
  const now = performance.now();
  const isIdle = !isPointerDown && !isModalOpen && now - lastInteractionTime > 1400;

  if (isIdle) {
    targetYaw += 0.00052;
    targetPitch += ((Math.sin(now * 0.00022) * 0.18) - targetPitch) * 0.003;
  }

  currentYaw += (targetYaw - currentYaw) * 0.075;
  currentPitch += (targetPitch - currentPitch) * 0.075;
  sphereGroup.rotation.y = currentYaw;
  sphereGroup.rotation.x = currentPitch;

  raycaster.setFromCamera(pointer, camera);
  const hover = raycaster
    .intersectObjects(cardMeshes, false)
    .find((hit) => hit.object.visible && hit.object.material.opacity > 0.4)?.object;
  activeMesh = hover || pickCenterCard();

  cardMeshes.forEach((mesh) => {
    const isFeatured = mesh === activeMesh && !isModalOpen;
    const isHover = mesh === hover && !isModalOpen;
    const targetScale = mesh.userData.baseScale * (isHover ? 1.1 : isFeatured ? 1.055 : 1);
    const targetOpacity = isFeatured ? 1 : mesh.userData.baseOpacity;
    const targetColor = isFeatured
      ? focusColor
      : mesh.userData.depthLayer === "near"
        ? nearColor
        : mesh.userData.depthLayer === "mid"
          ? midColor
          : farColor;

    mesh.scale.x += (targetScale - mesh.scale.x) * 0.08;
    mesh.scale.y += (targetScale - mesh.scale.y) * 0.08;
    mesh.scale.z += (targetScale - mesh.scale.z) * 0.08;
    mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.09;
    mesh.material.color.lerp(targetColor, 0.08);
    mesh.renderOrder = isFeatured ? 6 : 0;

    if (mesh.userData.outline) {
      const outlineOpacity = isHover ? 0.72 : isFeatured ? 0.42 : 0;
      mesh.userData.outline.material.opacity += (outlineOpacity - mesh.userData.outline.material.opacity) * 0.1;
    }
  });

  if (activeMesh && !isModalOpen) {
    setHud(activeMesh.userData.item);
  } else if (activeModalItem) {
    setHud(activeModalItem);
  }

  renderer.render(scene, camera);
}

addGridLines();
addAmbientArchiveField();
createCards();
setHud(galleryItems[0]);
animateIn();
render();

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", (event) => {
  updatePointer(event);
  onPointerMove(event);
});
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointercancel", () => {
  isPointerDown = false;
  shell.classList.remove("is-dragging");
});
canvas.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("resize", onResize);
closeExpand.addEventListener("click", closeItem);
expanded.addEventListener("click", (event) => {
  if (event.target === expanded) closeItem();
});
previousItemButton.addEventListener("click", (event) => {
  event.stopPropagation();
  markInteraction();
  stepModal(-1);
});
nextItemButton.addEventListener("click", (event) => {
  event.stopPropagation();
  markInteraction();
  stepModal(1);
});
window.addEventListener("keydown", (event) => {
  markInteraction();
  unlockTheme();
  if (event.key === "Escape" && isModalOpen) {
    closeItem();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (isModalOpen) {
      stepModal(-1);
    } else {
      targetYaw -= 0.58;
    }
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    if (isModalOpen) {
      stepModal(1);
    } else {
      targetYaw += 0.58;
    }
  } else if (event.key === "Enter" && !isModalOpen && activeMesh) {
    event.preventDefault();
    openItem(activeMesh.userData.item);
  }
});
soundButton.addEventListener("click", toggleTheme);
setSoundButtonState(true);
updateProgressHud();
startTheme();
window.addEventListener("pointerup", unlockTheme);
window.addEventListener("click", unlockTheme);

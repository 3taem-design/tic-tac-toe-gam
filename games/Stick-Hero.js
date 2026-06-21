alert("ابدء اللعب الان");
/*



If you want to know how this game was made, check out this video, that explains how it's made: 

https://youtu.be/eue3UdFvwPo

Follow me on twitter for more: https://twitter.com/HunorBorbely

*/

// Extend the base functionality of JavaScript
Array.prototype.last = function () {
  return this[this.length - 1];
};

// A sinus function that acceps degrees instead of radians
Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

// Game data
let phase = "waiting"; 
let lastTimestamp; 
let heroX; 
let heroY; 
let sceneOffset; 
let platforms = [];
let sticks = [];
let trees = [];
let score = 0;

const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const heroDistanceFromEdge = 10; 
const paddingX = 100; 
const perfectAreaSize = 10;
const backgroundSpeedMultiplier = 0.2;
const hill1BaseHeight = 100;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hill2Amplitude = 20;
const hill2Stretch = 0.5;
const stretchingSpeed = 4; 
const turningSpeed = 4; 
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;
const heroWidth = 17; 
const heroHeight = 30; 

const canvas = document.getElementById("game");
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");

// الدوال المعدلة لدعم اللمس مع استثناء زر الريستارت
function startAction(e) {
  if (e.target.id === 'restart') return;
  if (e.type === 'touchstart') e.preventDefault(); 
  
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
}

function endAction(e) {
  if (e.target.id === 'restart') return;
  if (phase == "stretching") {
    phase = "turning";
  }
}

window.addEventListener("mousedown", startAction);
window.addEventListener("mouseup", endAction);
window.addEventListener("touchstart", startAction, { passive: false });
window.addEventListener("touchend", endAction, { passive: false });

window.addEventListener("resize", function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

function resetGame() {
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;
  introductionElement.style.opacity = 1;
  perfectElement.style.opacity = 0;
  restartButton.style.display = "none";
  scoreElement.innerText = score;
  platforms = [{ x: 50, w: 50 }];
  generatePlatform(); generatePlatform(); generatePlatform(); generatePlatform();
  sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
  trees = [];
  for(let i=0; i<10; i++) generateTree();
  heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
  heroY = 0;
  draw();
}

function generateTree() {
  const lastTree = trees[trees.length - 1];
  let furthestX = lastTree ? lastTree.x : 0;
  const x = furthestX + 30 + Math.floor(Math.random() * 120);
  const color = ["#6D8821", "#8FAC34", "#98B333"][Math.floor(Math.random() * 3)];
  trees.push({ x, color });
}

function generatePlatform() {
  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;
  const x = furthestX + 40 + Math.floor(Math.random() * 160);
  const w = 20 + Math.floor(Math.random() * 80);
  platforms.push({ x, w });
}

function animate(timestamp) {
  if (!lastTimestamp) { lastTimestamp = timestamp; window.requestAnimationFrame(animate); return; }
  switch (phase) {
    case "waiting": return;
    case "stretching": sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed; break;
    case "turning": 
      sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;
      if (sticks.last().rotation > 90) {
        sticks.last().rotation = 90;
        const [nextPlatform, perfectHit] = thePlatformTheStickHits();
        if (nextPlatform) {
          score += perfectHit ? 2 : 1;
          scoreElement.innerText = score;
          if (perfectHit) { perfectElement.style.opacity = 1; setTimeout(() => (perfectElement.style.opacity = 0), 1000); }
          generatePlatform(); generateTree(); generateTree();
        }
        phase = "walking";
      }
      break;
    case "walking":
      heroX += (timestamp - lastTimestamp) / walkingSpeed;
      const [nextPlatform] = thePlatformTheStickHits();
      if (nextPlatform) {
        const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
        if (heroX > maxHeroX) { heroX = maxHeroX; phase = "transitioning"; }
      } else {
        const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
        if (heroX > maxHeroX) { heroX = maxHeroX; phase = "falling"; }
      }
      break;
    case "transitioning":
      sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;
      const [nextP] = thePlatformTheStickHits();
      if (sceneOffset > nextP.x + nextP.w - paddingX) {
        sticks.push({ x: nextP.x + nextP.w, length: 0, rotation: 0 });
        phase = "waiting";
      }
      break;
    case "falling":
      if (sticks.last().rotation < 180) sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;
      heroY += (timestamp - lastTimestamp) / fallingSpeed;
      if (heroY > platformHeight + 100 + (window.innerHeight - canvasHeight) / 2) { restartButton.style.display = "block"; return; }
      break;
  }
  draw();
  window.requestAnimationFrame(animate);
  lastTimestamp = timestamp;
}

function thePlatformTheStickHits() {
  const stickFarX = sticks.last().x + sticks.last().length;
  const platformTheStickHits = platforms.find(p => p.x < stickFarX && stickFarX < p.x + p.w);
  if (platformTheStickHits && platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 < stickFarX && stickFarX < platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2)
    return [platformTheStickHits, true];
  return [platformTheStickHits, false];
}

function draw() {
  ctx.save(); ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawBackground();
  ctx.translate((window.innerWidth - canvasWidth) / 2 - sceneOffset, (window.innerHeight - canvasHeight) / 2);
  drawPlatforms(); drawHero(); drawSticks();
  ctx.restore();
}

restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none";
});

function drawPlatforms() {
  platforms.forEach(({ x, w }) => {
    ctx.fillStyle = "black";
    ctx.fillRect(x, canvasHeight - platformHeight, w, platformHeight + (window.innerHeight - canvasHeight) / 2);
    if (sticks.last().x < x) { ctx.fillStyle = "red"; ctx.fillRect(x + w / 2 - perfectAreaSize / 2, canvasHeight - platformHeight, perfectAreaSize, perfectAreaSize); }
  });
}

function drawHero() {
  ctx.save(); ctx.fillStyle = "black";
  ctx.translate(heroX - heroWidth / 2, heroY + canvasHeight - platformHeight - heroHeight / 2);
  drawRoundedRect(-heroWidth / 2, -heroHeight / 2, heroWidth, heroHeight - 4, 5);
  ctx.beginPath(); ctx.arc(5, 11.5, 3, 0, Math.PI * 2, false); ctx.fill();
  ctx.beginPath(); ctx.arc(-5, 11.5, 3, 0, Math.PI * 2, false); ctx.fill();
  ctx.beginPath(); ctx.fillStyle = "white"; ctx.arc(5, -7, 3, 0, Math.PI * 2, false); ctx.fill();
  ctx.fillStyle = "red"; ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
  ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath(); ctx.moveTo(x, y + radius); ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height); ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius); ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y); ctx.arcTo(x, y, x, y + radius, radius); ctx.fill();
}

function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);
    ctx.beginPath(); ctx.lineWidth = 2; ctx.moveTo(0, 0); ctx.lineTo(0, -stick.length); ctx.stroke();
    ctx.restore();
  });
}

function drawBackground() {
  var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#BBD691"); gradient.addColorStop(1, "#FEF1E1");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
  drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");
  trees.forEach((tree) => drawTree(tree.x, tree.color));
}

function drawHill(baseHeight, amplitude, stretch, color) {
  ctx.beginPath(); ctx.moveTo(0, window.innerHeight);
  for (let i = 0; i < window.innerWidth; i++) ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
  ctx.lineTo(window.innerWidth, window.innerHeight); ctx.fillStyle = color; ctx.fill();
}

function drawTree(x, color) {
  ctx.save();
  ctx.translate((-sceneOffset * backgroundSpeedMultiplier + x) * hill1Stretch, getTreeY(x, hill1BaseHeight, hill1Amplitude));
  ctx.fillStyle = "#7D833C"; ctx.fillRect(-1, -5, 2, 5);
  ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(0, -30); ctx.lineTo(5, -5); ctx.fillStyle = color; ctx.fill();
  ctx.restore();
}

function getHillY(windowX, baseHeight, amplitude, stretch) {
  return Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) * amplitude + (window.innerHeight - baseHeight);
}

function getTreeY(x, baseHeight, amplitude) {
  return Math.sinus(x) * amplitude + (window.innerHeight - baseHeight);
}

resetGame();
window.requestAnimationFrame(animate);

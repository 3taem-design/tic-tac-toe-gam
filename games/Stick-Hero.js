alert("استمتع باللعب");
/*



If you want to know how this game was made, check out this video, that explains how it's made: 

https://youtu.be/eue3UdFvwPo

Follow me on twitter for more: https://twitter.com/HunorBorbely

*/

// Extend the base functionality of JavaScript
Array.prototype.last = function () { return this[this.length - 1]; };
Math.sinus = function (degree) { return Math.sin((degree / 180) * Math.PI); };

// Game data
let phase = "waiting"; 
let lastTimestamp;
let heroX, heroY, sceneOffset;
let platforms = [], sticks = [], trees = [];
let score = 0;

const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const heroDistanceFromEdge = 10;
const paddingX = 100;
const perfectAreaSize = 10;
const backgroundSpeedMultiplier = 0.2;
const hill1BaseHeight = 100, hill1Amplitude = 10, hill1Stretch = 1;
const hill2BaseHeight = 70, hill2Amplitude = 20, hill2Stretch = 0.5;
const stretchingSpeed = 4, turningSpeed = 4, walkingSpeed = 4, transitioningSpeed = 2, fallingSpeed = 2;
const heroWidth = 17, heroHeight = 30;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");

// --- الدوال المحدثة للتحكم (تدعم الجوال والكمبيوتر) ---
function handleStart(e) {
    if (e.target.id === 'restart') return; 
    if (phase == "waiting") {
        lastTimestamp = undefined;
        introductionElement.style.opacity = 0;
        phase = "stretching";
        window.requestAnimationFrame(animate);
    }
}

function handleEnd(e) {
    if (e.target.id === 'restart') return;
    if (phase == "stretching") phase = "turning";
}

window.addEventListener("mousedown", handleStart);
window.addEventListener("mouseup", handleEnd);
window.addEventListener("touchstart", (e) => { 
    if (e.target.id !== 'restart') e.preventDefault();
    handleStart(e); 
}, {passive: false});
window.addEventListener("touchend", (e) => { 
    if (e.target.id !== 'restart') e.preventDefault();
    handleEnd(e); 
}, {passive: false});

// بقية كود اللعبة (الرسومات والمنطق)
function resetGame() {
    phase = "waiting"; lastTimestamp = undefined; sceneOffset = 0; score = 0;
    introductionElement.style.opacity = 1; perfectElement.style.opacity = 0;
    restartButton.style.display = "none"; scoreElement.innerText = score;
    platforms = [{ x: 50, w: 50 }];
    generatePlatform(); generatePlatform(); generatePlatform(); generatePlatform();
    sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
    trees = []; for(let i=0; i<10; i++) generateTree();
    heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge; heroY = 0;
    draw();
}

// (أضف هنا باقي دوال generateTree, generatePlatform, animate, draw, etc كما هي في كودك الأصلي)
// *تأكد من بقاء الدالة resetGame() ودوال الرسم كما كانت في كودك*
// سأضع لك الدوال المكملة في الأسفل مباشرة:

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

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.translate((window.innerWidth - canvasWidth) / 2 - sceneOffset, (window.innerHeight - canvasHeight) / 2);
    // ... (استخدم دوال drawPlatforms و drawHero و drawSticks و drawBackground الموجودة في كودك الأصلي)
    ctx.restore();
}

restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none";
});

resetGame();

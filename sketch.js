let tips = [];
const HIT_R = 24;
const LETTER_GAP = 3; 
const WORD_OFFSET = -6;

const poem = `
Eleven Ways of Writing to a Leaf

I
Do you have any recipes for cannibalism?
A cloth of air, cotton, and grass over a cloud.
Looking for a picnic in the park.
-Henry Ding

II
Soft, ruptured, leaf
sand, feet, grounded
breathe in, breathe out
-Olivier Mbabazi

III
Grow and protect what's peeling?
Hedgehog but the opposite,
memories memories my childhood neighborhood
-Jiabao Wu

IV
Why do you rumble only when breakage is looming close?
Aperture before moonlight, tightens you who lie along
the sidewalk. When you fall, what do you have left to release?
-Arete Xu

V
Creeping sharp fingers curling to give me a hug, 
Half-remembered leaves flicker between tongues,
Would its sunburn blush beneath the weight of curiosity?
-Nadine Macapagal

VI
Hands, fall on my luggages before I depart.
Would you walk away if you had hands?
MISSION INCOMPLETE.
-Sarah Feng 

VII
Let leaf be a recursive function such that
↱ Temporal                      Torrential ↲ 
↓↓                                  End
-Selim Kutlu 

VIII
Legacies yours artery out — ////////
Never complete is the crimson //// of steak
& these days we scab two-fold / Arias, turning
-Sako Antonyan

IX
Clutching at the promise of my return,
for now I wilt in your palm.
Where do my veins end and yours begin?
-Zorka Zsembery

X
Looking at your wrinkles and your youth.
Do you feel small? Do you feel the weight 
of the world? I wonder if you also think of your mother.
-Maham Momin

XI
They say it is permissible to love 
you the way it is permissible to love a fly; just shy of blowing 
and shy of bellowing, merely tousling you up into a winter-green weathering.
-Nayyab Naveed
`;

const poemFlat = poem.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
const poemWords = poemFlat ? poemFlat.split(' ') : [];
let wordPos = 0;

function nextWord() {
  const w = poemWords[wordPos % poemWords.length];
  wordPos++;
  return w;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);       // 白背景
  stroke(0);             // 黑线
  strokeWeight(1);
  noFill();
  textFont('Georgia');
  textSize(12);
  textAlign(LEFT, CENTER);
  fill(0);               // 黑字
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {}

function mousePressed() {
  const idx = findNearestTip(mouseX, mouseY, HIT_R);

  if (idx === -1) {
    let ang = -HALF_PI + random(-0.6, 0.6);
    ang = nudgeAwayFromVertical(ang, 0.12);

    const word = nextWord();
    if (word === '') return;

    const len = segmentLenForWord(word, random(22, 44));
    const tip = drawSegmentWithWord(mouseX, mouseY, len, ang, word);
    tips.push(tip);
  } else {
    const base = tips[idx];

    const mainWord = nextWord();
    if (mainWord === '') return;

    let mainAng = base.angle + random(-0.6, 0.6);
    mainAng = nudgeAwayFromVertical(mainAng, 0.12);
    const mainLen = segmentLenForWord(mainWord, random(18, 38));
    const newTip = drawSegmentWithWord(base.x, base.y, mainLen, mainAng, mainWord);

    const forkCount = random([1, 2]);
    for (let i = 0; i < forkCount; i++) {
      const forkWord = nextWord();
      if (forkWord === '') continue;

      let forkAng = mainAng + random([-1, 1]) * random(0.4, 0.7);
      forkAng = nudgeAwayFromHorizontal(forkAng, 0.2);
      forkAng = nudgeAwayFromVertical(forkAng, 0.08);

      const forkLen = segmentLenForWord(forkWord, mainLen * random(0.5, 0.8));
      const forkTip = drawSegmentWithWord(newTip.x, newTip.y, forkLen, forkAng, forkWord);
      tips.push(forkTip);
    }

    tips.splice(idx, 1);
    tips.push(newTip);
  }
}

function drawSegmentWithWord(x, y, len, ang, word) {
  const x2 = x + cos(ang) * len;
  const y2 = y + sin(ang) * len;
  const jx = random(-0.6, 0.6);
  const jy = random(-0.6, 0.6);

  stroke(0);             // 黑线
  strokeWeight(1);
  line(x, y, x2 + jx, y2 + jy);

  noStroke();
  fill(0);               // 黑文字

  const tx = (x + x2) / 2;
  const ty = (y + y2) / 2;

  push();
  translate(tx, ty);
  rotate(ang);
  
  const nx = -sin(ang);
  const ny =  cos(ang);
  translate(nx * WORD_OFFSET, ny * WORD_OFFSET);

  let cx = 0;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (ch !== ' ') text(ch, cx, 0);
    cx += textWidth(ch) + LETTER_GAP;
  }
  pop();

  return { x: x2, y: y2, angle: ang };
}

function segmentLenForWord(word, baseLen) {
  let w = 0;
  for (let i = 0; i < word.length; i++) w += textWidth(word[i]) + LETTER_GAP;
  if (word.length > 0) w -= LETTER_GAP;
  const needed = w * 1.1 + 8;
  return max(baseLen, needed);
}

function findNearestTip(mx, my, r) {
  let best = -1;
  let bestD2 = r * r;
  for (let i = 0; i < tips.length; i++) {
    const d2 = sq(mx - tips[i].x) + sq(my - tips[i].y);
    if (d2 <= bestD2) {
      bestD2 = d2;
      best = i;
    }
  }
  return best;
}

function nudgeAwayFromHorizontal(a, minDelta = 0.15) {
  const norm = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  const near0 = abs(norm - 0) < minDelta || abs(norm - TWO_PI) < minDelta;
  const nearPI = abs(norm - PI) < minDelta;
  if (near0) return a - minDelta;
  if (nearPI) return a + minDelta;
  return a;
}

function nudgeAwayFromVertical(a, minDelta = 0.1) {
  const norm = ((a % TWO_PI) + TWO_PI) % TWO_PI;
  const nearUp =
    abs(norm - (TWO_PI - HALF_PI)) < minDelta ||
    abs(norm - (-HALF_PI % TWO_PI)) < minDelta;
  const nearDown = abs(norm - HALF_PI) < minDelta;
  if (nearUp) return a + (a > -HALF_PI ? minDelta : -minDelta);
  if (nearDown) return a + (a > HALF_PI ? minDelta : -minDelta);
  return a;
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    background(255);  
    tips = [];
    wordPos = 0;
  }
}


// ========================================================
// ELEMENTS
// ========================================================
const lineEls = Array.from(document.querySelectorAll(".line"));
const growArea = document.getElementById("growArea");
const tree = document.getElementById("tree");
const clickCountEl = document.getElementById("clickCount");
const stageLabelEl = document.getElementById("stageLabel");
const messageEl = document.getElementById("message");

const FRUIT_SHAPES = ["shape-round", "shape-drop", "shape-triangle", "shape-star", "shape-blob"];
const FRUIT_COLORS = ["color-pink", "color-mint", "color-blue", "color-orange", "color-purple"];

// 선형 오브젝트용 모양/색
const LINE_SHAPES = [
  "line-shape-curve",
  "line-shape-zigzag",
  "line-shape-shard",
  "line-shape-arc",
  "line-shape-spark"
];

const LINE_COLORS = [
  "line-color-mint",
  "line-color-blue",
  "line-color-purple",
  "line-color-orange",
  "line-color-pink"
];

// fruit & odd nodes
const fruitEls = Array.from(document.querySelectorAll(".fruit"));
const oddEls = Array.from(document.querySelectorAll(".odd"));

// ========================================================
// GAME STATE
// ========================================================
let count = 0;
let currentStage = 0;
let currentVariant = 0;

// ========================================================
// STAGE SYSTEM (0~9, max 1000 clicks)
// ========================================================
const STAGES = [
  { min: 0,   max: 19,   stageIndex: 0, label: "seed",          message: "씨앗을 눌러서 깨워봐요!",          variants: 1 },
  { min: 20,  max: 59,   stageIndex: 1, label: "sprout",        message: "아주 작은 싹이 났다.",             variants: 1 },
  { min: 60,  max: 99,   stageIndex: 2, label: "young",         message: "키가 쑥쑥 자라는 중.",             variants: 1 },
  { min: 100, max: 149,  stageIndex: 3, label: "tree",          message: "나무가 제법 자랐다.",               variants: 1 },

  // 변이 시작
  { min: 150, max: 249,  stageIndex: 4, label: "mutation I",    message: "형태가 변하기 시작한다.",           variants: 5 },

  // 강한 변이
  { min: 250, max: 349,  stageIndex: 5, label: "mutation II",   message: "기묘한 기운이 돈다.",               variants: 5 },

  // 형태 완전 변화
  { min: 350, max: 399,  stageIndex: 6, label: "weird form",    message: "나무라기엔 너무 이상하다.",          variants: 5 },

  // 유기체적 형태
  { min: 450, max: 499,  stageIndex: 7, label: "entity",        message: "넌 뭐가 되고싶은걸까?",             variants: 5 },

  // 기하학 + 동물 암시
  { min: 500, max: 599,  stageIndex: 8, label: "unknown being", message: "조금은 알 것 같아.",               variants: 5 },

  // 엔딩
  { min: 600, max: 700,  stageIndex: 9, label: "final",         message: "너는 그게 되고 싶었구나. 기특해!",   variants: 1 }
];

// ========================================================
// GET CURRENT STAGE/VARIANT
// ========================================================
function getStageInfo(clicks) {
  return STAGES.find(s => clicks >= s.min && clicks <= s.max);
}

function assignVariant(stageInfo) {
  if (stageInfo.variants === 1) return 0;
  return Math.floor(Math.random() * stageInfo.variants);
}

// ========================================================
// APPLY VISUAL STAGE
// ========================================================
function applyStage(stageIndex, variantIndex) {
  // remove all stage-* classes
  for (let i = 0; i <= 9; i++) {
    tree.classList.remove(`stage-${i}`);
  }
  tree.classList.add(`stage-${stageIndex}`);

  // remove variant classes
  for (let i = 0; i <= 4; i++) {
    tree.classList.remove(`variant-${i}`);
  }
  tree.classList.add(`variant-${variantIndex}`);

  // update label + message
  const meta = STAGES.find(s => s.stageIndex === stageIndex);
  stageLabelEl.textContent = meta.label;
  messageEl.textContent = meta.message;

  updateOddAndFruit(stageIndex);
}

// ========================================================
// FRUIT & ODD SYSTEM
// (오브젝트 개수/노출/애니메이션)
// ========================================================
function updateOddAndFruit(stageIndex) {
  // 기본적으로 모두 꺼두기
  oddEls.forEach(el => (el.style.opacity = 0));
  fruitEls.forEach(el => (el.style.opacity = 0));

  // stage별 오브젝트 개수
  let oddCount = 0;
  let fruitCount = 0;
  let lineCount = 0;

  if (stageIndex === 0) {
    oddCount = 0;
    fruitCount = 0;
    lineCount = 0;

  } else if (stageIndex === 1 || stageIndex === 2 || stageIndex === 3) {
    oddCount = 0;
    fruitCount = 0;
    lineCount = 0;

  } else if (stageIndex === 4) {
    oddCount = 1;
    fruitCount = 1;          // 과일 최소
    lineCount = 1 + Math.floor(Math.random() * 2);

  } else if (stageIndex === 5) {
    oddCount = 1 + Math.floor(Math.random() * 2);
    fruitCount = 1 + Math.floor(Math.random() * 2); // 1~2
    lineCount = 1 + Math.floor(Math.random() * 2);

  } else if (stageIndex === 6) {
    oddCount = 2;
    fruitCount = 2;          // 줄임
    lineCount = 2 + Math.floor(Math.random() * 2);

  } else if (stageIndex === 7) {
    oddCount = 2 + Math.floor(Math.random() * 2);
    fruitCount = 2 + Math.floor(Math.random() * 2); // 2~3
    lineCount = 2 + Math.floor(Math.random() * 2);

  } else if (stageIndex === 8) {
    oddCount = 3;
    fruitCount = 3;          // 고정
    lineCount = 3 + Math.floor(Math.random() * 2);

  } else if (stageIndex === 9) {
    oddCount = oddEls.length;           // 최종 스테이지만 전체 odd
    fruitCount = 3 + Math.floor(Math.random() * 2); // 3~4
    lineCount = lineEls.length;         // 전체 line
  }

  // apply to odd
  oddEls.forEach((el, idx) => {
    if (idx < oddCount) {
      el.style.opacity = 1;
      el.style.transform = `scale(${0.6 + Math.random() * 0.4})`;
    }
  });

  // apply to line objects
  lineEls.forEach((el, idx) => {
    // 기존 모양/색 클래스 제거
    el.classList.remove(...LINE_SHAPES, ...LINE_COLORS);

    if (idx < lineCount) {
      el.style.opacity = 1;

      const shape = LINE_SHAPES[Math.floor(Math.random() * LINE_SHAPES.length)];
      const color = LINE_COLORS[Math.floor(Math.random() * LINE_COLORS.length)];
      el.classList.add(shape, color);

      // 선적인 애들도 부드럽게 흔들리게
      const anims = ["lineFloatSoft", "lineFloatWave", "lineFloatTilt"];
      const anim = anims[Math.floor(Math.random() * anims.length)];
      el.style.animationName = anim;
      el.style.animationDuration = `${4.5 + Math.random() * 3}s`;
      el.style.animationIterationCount = "infinite";

      // 살짝 기울기와 크기 랜덤
      const rot = (Math.random() * 26) - 13; // -13 ~ 13deg
      const scale = 0.8 + Math.random() * 0.5;
      el.style.transform = `rotate(${rot}deg) scale(${scale})`;
    } else {
      el.style.opacity = 0;
    }
  });

  // apply to fruit
  fruitEls.forEach((el, idx) => {
    el.classList.remove(...FRUIT_SHAPES, ...FRUIT_COLORS);

    if (idx < fruitCount) {
      el.style.opacity = 1;

      const shape = FRUIT_SHAPES[Math.floor(Math.random() * FRUIT_SHAPES.length)];
      const color = FRUIT_COLORS[Math.floor(Math.random() * FRUIT_COLORS.length)];
      el.classList.add(shape, color);

      // ==========================
      // 스테이지별 스케일 범위 설정
      // ==========================
      let minScale = 0.7;
      let maxScale = 1.3;

      if (stageIndex === 0 || stageIndex === 1) {
        // 초기 단계 — 작고 미세한 변화만
        minScale = 0.6;
        maxScale = 1.0;

      } else if (stageIndex === 2 || stageIndex === 3) {
        // 싹 단계 — 조금 더 커짐
        minScale = 0.7;
        maxScale = 1.2;

      } else if (stageIndex === 4 || stageIndex === 5) {
        // 중간 성장 단계 — 다양성 증가
        minScale = 0.5;
        maxScale = 1.4;

      } else if (stageIndex === 6 || stageIndex === 7) {
        // 기묘한 변이 시작 — 크기 차이 확 커짐
        minScale = 0.4;
        maxScale = 1.6;

      } else if (stageIndex === 8) {
        // 거의 완성 — 큰 스케일 폭
        minScale = 0.35;
        maxScale = 1.9;

      } else if (stageIndex === 9) {
        // 파이널 — 극단적으로 다양
        minScale = 0.25;  // 아주 작은 점 같은 거
        maxScale = 2.4;   // 꽤 큰 행성 사이즈
      }

      const scale = minScale + Math.random() * (maxScale - minScale);

      el.style.animationDuration = `${4 + Math.random() * 2}s`;
      el.style.setProperty("--fruit-scale", scale);

    } else {
      el.style.opacity = 0;
    }
  });
}

// ========================================================
// CLICK HANDLER
// ========================================================
function handleClick() {
  // 클릭 집계는 여기서만

  count++;
  clickCountEl.textContent = count;

  const stageInfo = getStageInfo(count);
  const newStage = stageInfo.stageIndex;

  if (newStage !== currentStage) {
    currentStage = newStage;
    currentVariant = assignVariant(stageInfo);
    applyStage(currentStage, currentVariant);
  }

  // pulse animation
  tree.classList.remove("pulse");
  void tree.offsetWidth;
  tree.classList.add("pulse");
}

// ========================================================
// DEV MODE: ARROW KEYS
// ========================================================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    count += 40;
    clickCountEl.textContent = count;
    const info = getStageInfo(count);
    currentStage = info.stageIndex;
    currentVariant = assignVariant(info);
    applyStage(currentStage, currentVariant);
  }

  if (e.key === "ArrowLeft") {
    count = Math.max(0, count - 40);
    clickCountEl.textContent = count;
    const info = getStageInfo(count);
    currentStage = info.stageIndex;
    currentVariant = assignVariant(info);
    applyStage(currentStage, currentVariant);
  }
});

// ========================================================
// INITIALIZE
// ========================================================
const initInfo = getStageInfo(0);
applyStage(initInfo.stageIndex, 0);

// TOUCH SUPPORT
growArea.addEventListener("touchstart", e => {
  e.preventDefault();
  handleClick(); // 여기서만 호출하면 recordClick까지 다 처리됨
});

growArea.addEventListener("click", handleClick);

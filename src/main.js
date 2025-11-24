const growArea = document.getElementById("growArea");
const tree = document.getElementById("tree");
const clickCountEl = document.getElementById("clickCount");
const stageLabelEl = document.getElementById("stageLabel");
const messageEl = document.getElementById("message");

let count = 0;
let currentStage = 0;

// 각 스테이지 기준 클릭 수
const STAGES = [
  { min: 0, label: "seed", message: "씨앗을 눌러서 깨워봐요!" },
  {
    min: 20,
    label: "sprout",
    message: "아주 작은 싹이 났다. 더 키워보자.",
  },
  {
    min: 60,
    label: "young tree",
    message: "이제 제법 나무 같다. 아직 초입이야.",
  },
  {
    min: 150,
    label: "weird tree",
    message: "가지가 조금 이상하게 자라기 시작했다.",
  },
  {
    min: 300,
    label: "mutation",
    message: "이건… 나무가 맞기는 한 걸까?",
  },
  {
    min: 600,
    label: "unknown",
    message: "여기까지 온 사람은 많지 않다.",
  },
];

// 현재 클릭 수에 맞는 스테이지 인덱스 찾기
function getStageIndex(clicks) {
  let idx = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (clicks >= STAGES[i].min) {
      idx = i;
    } else {
      break;
    }
  }
  return idx;
}

// 스테이지 시각 반영
function applyStage(stageIndex) {
  const stageClassList = ["stage-0", "stage-1", "stage-2", "stage-3", "stage-4", "stage-5"];
  stageClassList.forEach((cls) => tree.classList.remove(cls));
  tree.classList.add(`stage-${stageIndex}`);

  const stageMeta = STAGES[stageIndex];
  stageLabelEl.textContent = stageMeta.label;
  messageEl.textContent = stageMeta.message;
}

// 클릭 시 호출
function handleClick() {
  count += 1;
  clickCountEl.textContent = count;

  const nextStage = getStageIndex(count);
  if (nextStage !== currentStage) {
    currentStage = nextStage;
    applyStage(currentStage);
  }

  // 작은 pulse 효과
  tree.classList.remove("pulse");
  // 강제로 리플로우를 일으켜 애니메이션 재시작
  void tree.offsetWidth;
  tree.classList.add("pulse");
}

// 초기 상태 설정
applyStage(currentStage);

// 화면 아무 곳이나 클릭해도 성장
growArea.addEventListener("click", handleClick);

// 모바일에서 touch 이벤트가 click과 이중 처리되는 것 방지
growArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleClick();
});




// ==========================
// Developer Mode: Arrow keys
// ==========================

document.addEventListener("keydown", (e) => {
  // 오른쪽 → 다음 스테이지
  if (e.key === "ArrowRight") {
    currentStage = Math.min(currentStage + 1, STAGES.length - 1);
    applyStage(currentStage);
    clickCountEl.textContent = STAGES[currentStage].min;
  }

  // 왼쪽 ← 이전 스테이지
  if (e.key === "ArrowLeft") {
    currentStage = Math.max(currentStage - 1, 0);
    applyStage(currentStage);
    clickCountEl.textContent = STAGES[currentStage].min;
  }
});

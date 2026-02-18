const matchupForm = document.querySelector(".form");
const savedPlansContainer = document.querySelector("#savedPlans");
const planStatus = document.querySelector("#planStatus");

const storageKey = "savedMatchupPlans";

const yourCharInput = document.querySelector("#yourChar");
const theirCharInput = document.querySelector("#theirChar");
const styleSelect = document.querySelector("#theirStyle");
const planTextarea = document.querySelector("#plan");

let savedPlans = [];

// I used concepts from past JavaScript courses here: sessionStorage for client-side persistence and event delegation for delete actions.
function setStatus(message, type = "info") {
  if (!planStatus) return;
  planStatus.textContent = message;
  planStatus.dataset.type = type;
}

function persistPlans() {
  sessionStorage.setItem(storageKey, JSON.stringify(savedPlans));
}

function restorePlans() {
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    savedPlans = parsed
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        yourChar: String(entry.yourChar || "").trim(),
        theirChar: String(entry.theirChar || "").trim(),
        theirStyle: String(entry.theirStyle || "").trim(),
        planText: String(entry.planText || "").trim(),
        updatedAt: Number(entry.updatedAt || Date.now()),
      }))
      .filter((entry) => entry.yourChar && entry.theirChar && entry.planText)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    savedPlans = [];
  }
}

function styleLabel(value) {
  if (!value) return "Unknown style";
  if (value === "hitrun") return "Hit-and-Run";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderSavedPlans() {
  savedPlansContainer.innerHTML = "";

  if (savedPlans.length === 0) {
    savedPlansContainer.innerHTML = '<p class="muted">No saved plans yet.</p>';
    return;
  }

  savedPlans.forEach((plan, index) => {
    const card = document.createElement("div");
    card.className = "saved-plan";

    card.innerHTML = `
      <strong>${plan.yourChar} vs ${plan.theirChar}</strong>
      <span class="plan-style">${styleLabel(plan.theirStyle)}</span>
      <p>${plan.planText}</p>
      <button class="delete-btn" data-index="${index}" type="button">Delete</button>
    `;

    savedPlansContainer.appendChild(card);
  });
}

function validateForm(yourChar, theirChar, planText) {
  if (!yourChar || !theirChar || !planText) {
    return "Please fill out your character, their character, and your plan.";
  }
  if (planText.length < 12) {
    return "Plan is too short. Give at least one concrete sentence.";
  }
  return "";
}

function findExistingPlanIndex(yourChar, theirChar, theirStyle) {
  return savedPlans.findIndex((plan) => {
    return (
      plan.yourChar.toLowerCase() === yourChar.toLowerCase() &&
      plan.theirChar.toLowerCase() === theirChar.toLowerCase() &&
      plan.theirStyle === theirStyle
    );
  });
}

matchupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const yourChar = yourCharInput.value.trim();
  const theirChar = theirCharInput.value.trim();
  const theirStyle = styleSelect.value;
  const planText = planTextarea.value.trim();

  const validationError = validateForm(yourChar, theirChar, planText);
  if (validationError) {
    setStatus(validationError, "error");
    return;
  }

  const nextPlan = { yourChar, theirChar, theirStyle, planText, updatedAt: Date.now() };
  const existingIndex = findExistingPlanIndex(yourChar, theirChar, theirStyle);

  if (existingIndex >= 0) {
    savedPlans[existingIndex] = nextPlan;
    setStatus("Updated existing matchup plan.", "success");
  } else {
    savedPlans.push(nextPlan);
    setStatus("Saved new matchup plan.", "success");
  }

  savedPlans.sort((a, b) => b.updatedAt - a.updatedAt);
  persistPlans();
  matchupForm.reset();
  renderSavedPlans();
});

savedPlansContainer.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-btn")) return;

  const index = Number(event.target.dataset.index);
  if (Number.isNaN(index)) return;

  savedPlans.splice(index, 1);
  persistPlans();
  renderSavedPlans();
  setStatus("Deleted plan.", "info");
});

restorePlans();
renderSavedPlans();
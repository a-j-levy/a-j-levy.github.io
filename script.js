const toggleTipsBtn = document.querySelector('#toggleTips');
const tipsBox = document.querySelector('#tipsBox');

const randomPickBtn = document.querySelector('#randomPick');
const randomOutput = document.querySelector('#randomOutput');

const form = document.querySelector('#mainForm');
const result = document.querySelector('#result');

const fighters = [
  { name: 'Mario', style: 'balanced' },
  { name: 'Kirby', style: 'simple' },
  { name: 'Fox', style: 'fast' },
  { name: 'Bowser', style: 'heavy' },
];

function sample(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

// Interactive behavior #1: show/hide tips (not alert)
toggleTipsBtn.addEventListener('click', () => {
  const isHidden = tipsBox.hasAttribute('hidden');

  if (isHidden) {
    tipsBox.removeAttribute('hidden');
    toggleTipsBtn.textContent = 'Hide beginner tips';
  } else {
    tipsBox.setAttribute('hidden', '');
    toggleTipsBtn.textContent = 'Show beginner tips';
  }
});

// Interactive behavior #2: random fighter pick
randomPickBtn.addEventListener('click', () => {
  const pick = sample(fighters);
  randomOutput.textContent = `Random pick: ${pick.name}`;
});

// Interactive behavior #3: form-driven suggestion
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const playstyle = document.querySelector('#playstyle').value;

  const match = fighters.find((f) => f.style === playstyle) ?? fighters[0];

  result.style.display = 'block';
  result.innerHTML = `
    <h3>Suggested main for ${name || 'you'}: ${match.name}</h3>
    <p>You selected <strong>${playstyle}</strong>, so ${match.name} is a great starter choice.</p>
    <p>Tip: Play 10 matches focusing on one thing (recovery, spacing, or staying calm) and you’ll improve fast.</p>
  `;
});
// --- GAME STATE (Tables/Objects) ---

const player = {
  level: 1,
  coins: 0,
  damagePerClick: 5,
};

// --- NOVA LISTA DE ALVOS ---
const targetList = [
  { // Alvo 1: Fácil 
    name: "Círculo Dourado",
    color: "gold",
    shape: "shape-circle",
    baseHealth: 10,
    rewardMultiplier: 1,
  },
  { // Alvo 2: Médio
    name: "Quadrado Carmesim",
    color: "crimson",
    shape: "shape-square",
    baseHealth: 30,
    rewardMultiplier: 2,
  },
  { // Alvo 3: Difícil
    name: "Triângulo Esmeralda",
    color: "mediumseagreen",
    shape: "shape-triangle",
    baseHealth: 80,
    rewardMultiplier: 3,
  },
];

const target = {
  currentIndex: 0, // Qual alvo da lista estamos enfrentando agora (0, 1 ou 2)
  round: 1, // Quantas vezes já completamos a lista inteira
  maxHealth: 10,
  currentHealth: 10,
  baseDamageFormula: (level) => 5 * Math.pow(1.2, level),
};

const coinConfig = {
  spawnQuantity: 2,
  size: 30,
  safetyMargin: 10,
  despawnTime: 10000,
  types: [
    { // Raridade: Comum
      name: "Bronze",
      chance: 0.7,
      multiplier: 1,
      color: "#cd7f32",
      border: "#8b4513",
    },
    { // Raridade: Incomum
      name: "Silver",
      chance: 0.25,
      multiplier: 3,
      color: "#c0c0c0",
      border: "#808080",
    },
    { // Raridade: Raro
      name: "Gold",
      chance: 0.04,
      multiplier: 10,
      color: "#ffd700",
      border: "#b8860b",
    },
    { // Raridade: Lendário
      name: "Diamond",
      chance: 0.01,
      multiplier: 50,
      color: "#b9f2ff",
      border: "#00ced1",
    },
  ],
};

// --- DOM ELEMENTS (UI) ---
const ui = {
  targetObject: document.getElementById("object"),
  healthBar: document.getElementById("health_fill"),
  nameDisplay: document.querySelector(".object_name"),
  playField: document.getElementById("play_field"),
  targetWrapper: document.querySelector(".target_wrapper"),
  coinsDisplay: document.querySelectorAll(".counters")[0],
  damageDisplay: document.querySelectorAll(".counters")[1],
  multDisplay: document.getElementById("mult_value"),

  xpBar: document.getElementById("xp_fill"),
  xpText: document.querySelector(".player_xp_text"),

  healthText: document.querySelectorAll(".object_counters")[0],

  roundText: document.getElementById("round_text"),
  progressionCircles: document.getElementById("progression_circles"),
};

// --- INITIALIZATION ---
function updateUI() {
  const currentTargetData = targetList[target.currentIndex];
  const healthPercentage =
    (Math.max(0, target.currentHealth) / target.maxHealth) * 100;

  ui.healthBar.style.width = `${healthPercentage}%`;
  ui.nameDisplay.innerHTML = `${currentTargetData.name}<br>(Nível ${target.round})`;
  ui.healthText.innerText = `${formatNumber(Math.max(0, target.currentHealth))} / ${formatNumber(target.maxHealth)}`;
  ui.coinsDisplay.innerText = `Moedas: ${formatNumber(player.coins)}`;
  ui.damageDisplay.innerText = `Dano por Clique: ${formatNumber(player.damagePerClick)}`;

  ui.xpBar.style.width = `50%`;
  ui.xpText.innerText = `Nv. ${player.level} (50%)`;

  ui.targetObject.className = `objects ${currentTargetData.shape}`;
  ui.targetObject.style.backgroundColor = currentTargetData.color;

  // --- NOVA LÓGICA DO MULTIPLICADOR AQUI ---
  // (Rodada - 1) * (Quantidade de Alvos) + Multiplicador do Alvo Atual
  const targetMultiplier = (
    (target.round - 1) * targetList.length +
    currentTargetData.rewardMultiplier
  ).toFixed(1);
  ui.multDisplay.innerText = `x${targetMultiplier}`;

  // --- NOVA LÓGICA DO RASTREADOR DE PROGRESSÃO ---
  
  // 1. Atualiza o texto da rodada
  ui.roundText.innerText = `Rodada ${target.round}`;

  // 2. Limpa os círculos antigos da tela para desenhar os novos
  ui.progressionCircles.innerHTML = '';

  // 3. Cria um círculo para cada alvo que existe na sua targetList
  for (let i = 0; i < targetList.length; i++) {
    const circle = document.createElement('div');
    circle.classList.add('prog-circle');

    // Define a cor baseada no índice atual em relação ao inimigo atual
    if (i < target.currentIndex) {
      circle.classList.add('prog-defeated'); // Inimigos que já morreram nesta rodada
    } else if (i === target.currentIndex) {
      circle.classList.add('prog-current');  // Inimigo que estamos batendo agora
    } else {
      circle.classList.add('prog-upcoming'); // Inimigos que ainda vão aparecer
    }

    // Adiciona o círculo desenhado na tela
    ui.progressionCircles.appendChild(circle);
  }
}

updateUI();

// --- HELPER FUNCTIONS ---
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return Math.floor(num).toString();
}

// --- CORE GAME FUNCTIONS ---

function spawnCoin() {
  const coin = document.createElement('div');
  coin.className = 'coin';

  // --- LÓGICA DE SORTEIO (RARIDADE) ---
  const rand = Math.random();
  let selectedType = coinConfig.types[0]; // Padrão: Bronze
  let cumulativeChance = 0;

  for (const type of coinConfig.types) {
    cumulativeChance += type.chance;
    if (rand < cumulativeChance) {
      selectedType = type;
      break;
    }
  }

  // Calcula o valor baseado no nível e multiplicador da raridade
  const currentTargetData = targetList[target.currentIndex];

  const currentTargetMult =
    (target.round - 1) * targetList.length + currentTargetData.rewardMultiplier;
  const coinValue = Math.floor(selectedType.multiplier * currentTargetMult);

  coin.dataset.value = coinValue;

  // 1. Cria o elemento do Nível (Verde)
  const levelText = document.createElement('span');
  levelText.className = 'coin_level';
  levelText.innerText = `Nv.${target.round}`; // Usa o nível da rodada

  // 2. Cria o elemento do Valor (Amarelo com +)
  const valueText = document.createElement('span');
  valueText.className = 'coin_value';
  // Use Math.floor para garantir que seja um número inteiro simples
  valueText.innerText = `${Math.floor(coinValue)}c`;

  // 3. Adiciona ambos os textos dentro da moeda
  coin.appendChild(levelText);
  coin.appendChild(valueText);

  // Define a aparência e o texto
  coin.style.backgroundColor = selectedType.color;
  coin.style.borderColor = selectedType.border;
  coin.style.color = selectedType.border; // Texto da mesma cor da borda para ler melhor

  let x, y;
  let attempts = 0;
  let isInsideForbiddenArea = true;

  const fieldRect = ui.playField.getBoundingClientRect();
  const targetRect = ui.targetWrapper.getBoundingClientRect();

  const forbidden = {
    left: targetRect.left - fieldRect.left - coinConfig.safetyMargin,
    right: targetRect.right - fieldRect.left + coinConfig.safetyMargin,
    top: targetRect.top - fieldRect.top - coinConfig.safetyMargin,
    bottom: targetRect.bottom - fieldRect.top + coinConfig.safetyMargin,
  };

  do {
    x = Math.random() * (ui.playField.clientWidth - coinConfig.size);
    y = Math.random() * (ui.playField.clientHeight - coinConfig.size);

    const hitX = x + coinConfig.size > forbidden.left && x < forbidden.right;
    const hitY = y + coinConfig.size > forbidden.top && y < forbidden.bottom;

    isInsideForbiddenArea = hitX && hitY;
    attempts++;

    if (!isInsideForbiddenArea) break;
  } while (attempts < 50);

  coin.style.left = `${x}px`;
  coin.style.top = `${y}px`;

  // --- COLETA (COM ANIMAÇÃO) ---
  coin.addEventListener('click', () => {
    // 1. Atualiza o saldo do jogador (Mantenha sua lógica atual)
    player.coins += coinValue;
    ui.coinsDisplay.innerText = `Moedas: ${formatNumber(player.coins)}`;

    // --- NOVA LÓGICA DE ANIMAÇÃO ---

    // 2. Cria o elemento de texto flutuante temporário
    const floatingScore = document.createElement('div');
    floatingScore.className = 'floating_score';
    floatingScore.innerText = `+${formatNumber(coinValue)}`; // Copia o valor

    // 3. Posiciona o texto flutuante EXATAMENTE onde a moeda estava
    // Usamos as mesmas posições left/top que calculamos para a moeda
    floatingScore.style.left = coin.style.left;
    floatingScore.style.top = coin.style.top;

    // 4. Adiciona o texto flutuante na playarea para a animação começar
    ui.playField.appendChild(floatingScore);

    // 5. Remove a moeda original IMEDIATAMENTE.
    // O texto flutuante dá o feedback visual.
    coin.remove();

    // 6. Configura a remoção do texto flutuante após a animação (0.5s)
    setTimeout(() => {
      if (floatingScore) floatingScore.remove();
    }, 500); // 500ms é a duração da animação no CSS
  });

  setTimeout(() => {
    if (coin) coin.remove();
  }, coinConfig.despawnTime);
  ui.playField.appendChild(coin);
}

function handleTargetClick() {
  target.currentHealth -= player.damagePerClick;
  player.totalClicks++;

  if (Math.floor(target.currentHealth) <= 0) {
    
    const bonusQuantity = Math.floor(coinConfig.spawnQuantity);
    for (let i = 0; i < bonusQuantity; i++) {
      spawnCoin();
    }

    player.level++;

    // 2. Avança para o próximo alvo
    target.currentIndex++;

    // Se passamos do último da lista, voltamos pro primeiro e aumentamos a Rodada (Round)
    if (target.currentIndex >= targetList.length) {
      target.currentIndex = 0;
      target.round++;
      console.log(`Rodada ${target.round} iniciada!`);
    }

    // 3. Puxa os dados do NOVO alvo que vamos enfrentar
    const nextTargetData = targetList[target.currentIndex];

    target.maxHealth = Math.floor(
      nextTargetData.baseHealth * Math.pow(2, target.round - 1),
    );
    target.currentHealth = target.maxHealth;

    // Atualiza o dano do jogador
    player.damagePerClick = target.baseDamageFormula(player.level);
  }

  updateUI();
  ui.targetObject.style.transform = "scale(0.9)";
  setTimeout(() => (ui.targetObject.style.transform = "scale(1)"), 50);
}

// --- EVENT LISTENERS ---
ui.targetObject.addEventListener("click", () => {
  // Slight delay to simulate responsiveness
  setTimeout(handleTargetClick, 150);
});

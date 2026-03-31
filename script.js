// --- GAME STATE (Tables/Objects) ---

const player = {
    level: 1,
    coins: 0,
    totalClicks: 0,
    damagePerClick: 3.75 
};

// --- NOVA LISTA DE ALVOS ---
const targetList = [
    { name: 'Círculo Dourado',   color: 'gold',           shape: 'shape-circle',   baseHealth: 50,  rewardMultiplier: 1 },
    { name: 'Quadrado Carmesim', color: 'crimson',        shape: 'shape-square',   baseHealth: 100, rewardMultiplier: 1.5 },
    { name: 'Triângulo Esmeralda', color: 'mediumseagreen', shape: 'shape-triangle', baseHealth: 200, rewardMultiplier: 2.5 }
];

const target = {
    currentIndex: 0, // Qual alvo da lista estamos enfrentando agora (0, 1 ou 2)
    round: 1,        // Quantas vezes já completamos a lista inteira
    maxHealth: 50,
    currentHealth: 50,
    baseDamageFormula: (level) => 5 * (level * 0.75)
};

const coinConfig = {
    spawnQuantity: 2,
    size: 30,
    safetyMargin: 10,
    despawnTime: 10000,
    types: [
        { name: 'Bronze',  chance: 0.70, multiplier: 1,  color: '#cd7f32', border: '#8b4513' },
        { name: 'Silver',  chance: 0.25, multiplier: 3,  color: '#c0c0c0', border: '#808080' },
        { name: 'Gold',    chance: 0.04, multiplier: 10, color: '#ffd700', border: '#b8860b' },
        { name: 'Diamond', chance: 0.01, multiplier: 50, color: '#b9f2ff', border: '#00ced1' }
    ]
};

// --- DOM ELEMENTS (UI) ---
const ui = {
    targetObject: document.getElementById('object'),
    healthBar: document.getElementById('health_fill'),
    nameDisplay: document.querySelector('.object_name'),
    playField: document.getElementById('play_field'),
    targetWrapper: document.querySelector('.target_wrapper'),
    coinsDisplay: document.querySelectorAll('.counters')[0],
    damageDisplay: document.querySelectorAll('.counters')[1],
    clicksDisplay: document.querySelectorAll('.counters')[2],
    healthText: document.querySelectorAll('.object_counters')[0]
};

// --- INITIALIZATION ---
function updateUI() {
    const currentTargetData = targetList[target.currentIndex];
    const healthPercentage = (Math.max(0, target.currentHealth) / target.maxHealth) * 100;
    
    // Atualiza a barra e os textos
    ui.healthBar.style.width = `${healthPercentage}%`;
    ui.nameDisplay.innerText = `${currentTargetData.name} (Nív. ${player.level})`;
    ui.healthText.innerText = `${formatNumber(Math.max(0, target.currentHealth))} / ${formatNumber(target.maxHealth)}`;
    ui.coinsDisplay.innerText = `Coins: ${formatNumber(player.coins)}`;
    ui.damageDisplay.innerText = `Damage per Click: ${formatNumber(player.damagePerClick)}`;
    ui.clicksDisplay.innerText = `Clicks: ${formatNumber(player.totalClicks)}`;

    // Atualiza a aparência do objeto (Forma e Cor)
    ui.targetObject.className = `objects ${currentTargetData.shape}`;
    ui.targetObject.style.backgroundColor = currentTargetData.color;
}

updateUI();

// --- HELPER FUNCTIONS ---
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
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
  const coinValue = Math.floor(player.level * selectedType.multiplier);

  // Define a aparência e o texto
  coin.innerText = `+${formatNumber(coinValue)}`;
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

  // --- COLETA ---
  coin.addEventListener('click', () => {
    player.coins += coinValue; // Adiciona o valor real calculado
    ui.coinsDisplay.innerText = `Coins: ${formatNumber(player.coins)}`;
    coin.remove();
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
        const currentTargetData = targetList[target.currentIndex];

        // 1. Spawna as moedas com um bônus extra baseado na dificuldade do alvo!
        const bonusQuantity = Math.floor(coinConfig.spawnQuantity * currentTargetData.rewardMultiplier);
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

        // 4. Progressão de Vida: (Vida Base do Alvo) * (1.5 elevado ao nível do jogador)
        // Isso garante que a vida cresça de forma exponencial, mantendo o desafio!
        target.maxHealth = Math.floor(nextTargetData.baseHealth * Math.pow(1.5, player.level - 1));
        target.currentHealth = target.maxHealth;
        
        // Atualiza o dano do jogador
        player.damagePerClick = target.baseDamageFormula(player.level);

        console.log(`Level Up! Novo Alvo: ${nextTargetData.name}, Vida: ${target.maxHealth}`);
    }

    updateUI();
    ui.targetObject.style.transform = 'scale(0.9)';
    setTimeout(() => (ui.targetObject.style.transform = 'scale(1)'), 50);
}

// --- EVENT LISTENERS ---
ui.targetObject.addEventListener('click', () => {
    // Slight delay to simulate responsiveness
    setTimeout(handleTargetClick, 150);
});
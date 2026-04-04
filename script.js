const player = {
  level: 1,
  xp: 0,
  xpNextLevel: 100,
  coins: 0,
  damagePerClick: 10,
  totalClicks: 0,
  getLevelMultiplier: () => 1 + (player.level - 1) * 0.05,
};

const targetList = [
  {
    name: 'Círculo Dourado',
    color: 'gold',
    shape: 'shape-circle',
    baseHealth: 10,
    rewardMultiplier: 1,
  },
  {
    name: 'Quadrado Carmesim',
    color: 'crimson',
    shape: 'shape-square',
    baseHealth: 50,
    rewardMultiplier: 2,
  },
  {
    name: 'Triângulo Esmeralda',
    color: 'mediumseagreen',
    shape: 'shape-triangle',
    baseHealth: 100,
    rewardMultiplier: 3,
  },
  {
    name: 'Losango de Ametista',
    color: '#9b59b6',
    shape: 'shape-diamond',
    baseHealth: 250,
    rewardMultiplier: 4,
  },
  {
    name: 'Pentágono de Ferro',
    color: '#7f8c8d',
    shape: 'shape-pentagon',
    baseHealth: 500,
    rewardMultiplier: 5,
  },
  {
    name: 'Hexágono de Obsidiana',
    color: '#2c3e50',
    shape: 'shape-hexagon',
    baseHealth: 800,
    rewardMultiplier: 6,
  },
];

const target = {
  currentIndex: 0,
  round: 1,
  maxHealth: 10,
  currentHealth: 10,
  isTransitioning: false,
  baseDamageFormula: (level) => 5 * Math.pow(1.15, level),
};

const coinConfig = {
  spawnQuantity: 2,
  size: 30,
  safetyMargin: 10,
  despawnTime: 10000,
  types: [
    {
      name: 'Bronze',
      chance: 0.7,
      multiplier: 1,
      color: '#cd7f32',
      border: '#8b4513',
    },
    {
      name: 'Silver',
      chance: 0.25,
      multiplier: 3,
      color: '#c0c0c0',
      border: '#808080',
    },
    {
      name: 'Gold',
      chance: 0.04,
      multiplier: 10,
      color: '#ffd700',
      border: '#b8860b',
    },
    {
      name: 'Diamond',
      chance: 0.01,
      multiplier: 50,
      color: '#b9f2ff',
      border: '#00ced1',
    },
  ],
};

const ui = {
  targetObject: document.getElementById('object'),
  healthBar: document.getElementById('health_fill'),
  nameDisplay: document.querySelector('.object_name'),
  playField: document.getElementById('play_field'),
  targetWrapper: document.querySelector('.target_wrapper'),
  coinsDisplay: document.querySelectorAll('.counters')[0],
  damageDisplay: document.querySelectorAll('.counters')[1],
  multDisplay: document.getElementById('mult_value'),

  xpBar: document.getElementById('xp_fill'),
  xpText: document.querySelector('.player_xp_text'),

  healthText: document.querySelector('.object_counters'),

  roundText: document.getElementById('round_text'),
  progressionCircles: document.getElementById('progression_circles'),
};

function updateUI() {
  const currentTargetData = targetList[target.currentIndex];
  const healthPercentage =
    (Math.max(0, target.currentHealth) / target.maxHealth) * 100;
  const xpPercentage = (player.xp / player.xpNextLevel) * 100;

  ui.xpBar.style.width = `${xpPercentage}%`;
  ui.xpText.innerText = `Nv. ${player.level} - ${player.xp}/${player.xpNextLevel} (${Math.floor(xpPercentage)}%)`;

  ui.healthBar.style.width = `${healthPercentage}%`;
  ui.nameDisplay.innerHTML = `${currentTargetData.name}<br>(Nível ${target.round})`;
  ui.healthText.innerText = `${formatNumber(Math.max(0, target.currentHealth))} / ${formatNumber(target.maxHealth)}`;
  ui.coinsDisplay.innerText = `Moedas: ${formatNumber(player.coins)}`;
  ui.damageDisplay.innerText = `Dano por Clique: ${formatNumber(player.damagePerClick)}`;

  ui.targetObject.className = `objects ${currentTargetData.shape}`;
  ui.targetObject.style.backgroundColor = currentTargetData.color;

  const targetMultiplier = (
    (target.round - 1) * targetList.length +
    currentTargetData.rewardMultiplier
  ).toFixed(1);
  ui.multDisplay.innerText = `x${targetMultiplier}`;

  ui.roundText.innerText = `Rodada ${target.round}`;

  ui.progressionCircles.innerHTML = '';

  for (let i = 0; i < targetList.length; i++) {
    const circle = document.createElement('div');
    circle.classList.add('prog-circle');

    if (i < target.currentIndex) {
      circle.classList.add('prog-defeated');
    } else if (i === target.currentIndex) {
      circle.classList.add('prog-current');
    } else {
      circle.classList.add('prog-upcoming');
    }

    ui.progressionCircles.appendChild(circle);
  }
}

const firstTarget = targetList[target.currentIndex];
target.maxHealth = firstTarget.baseHealth;
target.currentHealth = target.maxHealth;

updateUI();

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(1).toString();
}

function showRoundAnnouncer(roundNum) {
  const container = document.getElementById('round_announcement');
  const title = document.getElementById('round_title');
  const alert = document.getElementById('round_stats_alert');

  const nextBonus = 50;

  title.innerText = `Rodada ${roundNum} Concluída!`;
  alert.innerText = `⚠ Mais Dificuldade: Alvos com +${nextBonus}% de Vida!`;

  container.classList.remove('animate-round-text');
  void container.offsetWidth;
  container.classList.add('animate-round-text');
}

function addXp(amount) {
  player.xp += amount;

  if (player.xp >= player.xpNextLevel) {
    player.xp -= player.xpNextLevel;
    player.level++;

    player.xpNextLevel = Math.floor(100 * Math.pow(1.5, player.level - 1));

    console.log('Level Up! Novo nível: ' + player.level);
  }
  updateUI();
}

function getScaledHealth(baseHealth) {
  const totalGrowthFactor = 0.5;
  const multiplier = 1 + (target.round - 1) * totalGrowthFactor;

  return Math.floor(baseHealth * multiplier);
}

function spawnCoin() {
  const coin = document.createElement('div');
  coin.className = 'coin';

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

  const currentTargetData = targetList[target.currentIndex];

  const currentTargetMult =
    (target.round - 1) * targetList.length + currentTargetData.rewardMultiplier;
  const coinValue = Math.floor(selectedType.multiplier * currentTargetMult);

  coin.dataset.value = coinValue;

  const levelText = document.createElement('span');
  levelText.className = 'coin_level';
  levelText.innerText = `Nv.${target.round}`;

  const valueText = document.createElement('span');
  valueText.className = 'coin_value';
  valueText.innerText = `${Math.floor(coinValue)}c`;

  coin.appendChild(levelText);
  coin.appendChild(valueText);

  // Define a aparência e o texto
  coin.style.backgroundColor = selectedType.color;
  coin.style.borderColor = selectedType.border;
  coin.style.color = selectedType.border;

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

  coin.addEventListener('click', () => {
    player.coins += coinValue;
    ui.coinsDisplay.innerText = `Moedas: ${formatNumber(player.coins)}`;

    const floatingScore = document.createElement('div');
    floatingScore.className = 'floating_score';
    floatingScore.innerText = `+${formatNumber(coinValue)}`;

    floatingScore.style.left = coin.style.left;
    floatingScore.style.top = coin.style.top;

    ui.playField.appendChild(floatingScore);

    coin.remove();

    setTimeout(() => {
      if (floatingScore) floatingScore.remove();
    }, 500);
  });

  setTimeout(() => {
    if (coin) coin.remove();
  }, coinConfig.despawnTime);
  ui.playField.appendChild(coin);
}

function handleTargetClick(clickX, clickY) {
  if (target.isTransitioning) return;

  const currentTargetData = targetList[target.currentIndex];

  // --- LÓGICA DE PARTÍCULAS DE BRILHO (Faíscas do clique normal) ---
  const numParticles = 10;
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'target-particle';

    const randomX = (Math.random() - 0.5) * 150;
    const randomY = -(Math.random() * 80 + 20);
    const randomRotate = (Math.random() - 0.5) * 360;

    particle.style.setProperty('--rand-x', `${randomX}px`);
    particle.style.setProperty('--rand-y', `${randomY}px`);
    particle.style.setProperty('--rand-rotate', `${randomRotate}deg`);

    const fieldRect = ui.playField.getBoundingClientRect();
    particle.style.left = `${clickX - fieldRect.left}px`;
    particle.style.top = `${clickY - fieldRect.top}px`;

    ui.playField.appendChild(particle);

    setTimeout(() => {
      if (particle) particle.remove();
    }, 800);
  }

  target.currentHealth -= player.damagePerClick;
  player.totalClicks++;

  if (Math.floor(target.currentHealth) <= 0) {
    target.isTransitioning = true;

    const xpGained = currentTargetData.rewardMultiplier * 10 * target.round;
    addXp(xpGained);

    const bonusQuantity = Math.floor(coinConfig.spawnQuantity);
    for (let i = 0; i < bonusQuantity; i++) {
      spawnCoin();
    }

    const rect = ui.targetObject.getBoundingClientRect();
    const fieldRect = ui.playField.getBoundingClientRect();

    ui.targetObject.style.opacity = '0';

    const numFragments = 18;
    for (let j = 0; j < numFragments; j++) {
      const fragment = document.createElement('div');
      fragment.className = `shatter-fragment ${currentTargetData.shape}`;
      fragment.style.backgroundColor = currentTargetData.color;

      const tx = (Math.random() - 0.5) * 200;
      const ty = Math.random() * 150 + 50;
      const rot = (Math.random() - 0.5) * 360;

      fragment.style.setProperty('--frag-tx', `${tx}px`);
      fragment.style.setProperty('--frag-ty', `${ty}px`);
      fragment.style.setProperty('--frag-rot', `${rot}deg`);

      fragment.style.left = `${rect.left - fieldRect.left}px`;
      fragment.style.top = `${rect.top - fieldRect.top}px`;
      fragment.style.width = `${rect.width}px`;
      fragment.style.height = `${rect.height}px`;

      ui.playField.appendChild(fragment);

      setTimeout(() => {
        if (fragment) fragment.remove();
      }, 800);
    }

    setTimeout(() => {
      target.currentIndex++;

      if (target.currentIndex >= targetList.length) {
        target.currentIndex = 0;

        showRoundAnnouncer(target.round);

        target.round++;
        console.log(`Rodada ${target.round} iniciada!`);
      }

      const nextTargetData = targetList[target.currentIndex];

      target.maxHealth = getScaledHealth(nextTargetData.baseHealth);
      target.currentHealth = target.maxHealth;

      player.damagePerClick += target.baseDamageFormula(player.level);

      updateUI();

      ui.targetObject.style.opacity = '1';

      target.isTransitioning = false;
    }, 150);
  } else {
    updateUI();
  }

  ui.targetObject.style.transform = 'scale(0.9)';
  setTimeout(() => (ui.targetObject.style.transform = 'scale(1)'), 50);
}

ui.targetObject.addEventListener('click', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  handleTargetClick(x, y);
});

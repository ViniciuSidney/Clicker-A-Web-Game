
// Variáveis globais para armazenar o estado do jogo

// Estado do jogador
const player = {
  level: 1,
  xp: 0,
  xpNextLevel: 5,
  coins: 0,
  totalClicks: 0,

  // Upgrades de clique: cada um tem um efeito diferente no cálculo do dano
  upgrades: {
      clickBase: 0, 
      clickMult: 0, 
      clickPower: 1 
  },

  // Função para calcular o dano por clique com base no nível, upgrades e multiplicadores
  getDamage: function() {
      const base = 1; // Dano base inicial por clique (pode ser ajustado para balanceamento)

      // 1. Upgrades somam na base (o "alicerce" do seu dano)
      // Se o clickBase for 5, a base vira 20.
      const upgradeBonus = (this.upgrades.clickBase * 2) * this.upgrades.clickPower;

      // 2. Multiplicador de Nível Exponencial (50% de aumento composto)
      const levelMult = Math.pow(1.5, this.level - 1);

      // 3. Multiplicador do Upgrade 4 (Bônus final de utilidade)
      const upgradeMult = 1 + (this.upgrades.clickMult * 1);

      // CÁLCULO FINAL: (Soma da Base) * (Multiplicador Exponencial de XP) * (Upgrades de Multiplicação)
      // O Math.floor garante que não teremos quebrados como 22.50 na UI
      return ((base + upgradeBonus) * levelMult * upgradeMult);
  }
};

// Configurações dos alvos
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
    baseHealth: 25,
    rewardMultiplier: 2,
  },
  {
    name: 'Triângulo Esmeralda',
    color: 'mediumseagreen',
    shape: 'shape-triangle',
    baseHealth: 50,
    rewardMultiplier: 3,
  },
  {
    name: 'Losango de Ametista',
    color: '#9b59b6',
    shape: 'shape-diamond',
    baseHealth: 90,
    rewardMultiplier: 4,
  },
  {
    name: 'Pentágono de Ferro',
    color: '#7f8c8d',
    shape: 'shape-pentagon',
    baseHealth: 175,
    rewardMultiplier: 5,
  },
  {
    name: 'Hexágono de Obsidiana',
    color: '#2c3e50',
    shape: 'shape-hexagon',
    baseHealth: 350,
    rewardMultiplier: 6,
  },
];

// Estado do alvo atual
const target = {
  currentIndex: 0,
  round: 1,
  maxHealth: 10,
  currentHealth: 10,
  isTransitioning: false,
};

// Configurações das moedas
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

// Referências para elementos da interface
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

// ---------------------------------------------------

// Atualiza as informações do alvo e do jogador na interface
function updateUI() {
  // Valores atuais do alvo e do jogador para cálculos e exibição
  const currentTargetData = targetList[target.currentIndex];
  const healthPercentage = (Math.max(0, target.currentHealth) / target.maxHealth) * 100;
  const xpPercentage = (player.xp / player.xpNextLevel) * 100;
  const targetMultiplier = ((target.round - 1) * targetList.length + currentTargetData.rewardMultiplier).toFixed(1);
  const currentDamage = player.getDamage();

  // Atualiza a barra de XP e o texto do jogador
  ui.xpBar.style.width = `${xpPercentage}%`;
  ui.xpText.innerText = `Nv. ${player.level} - ${player.xp}/${player.xpNextLevel} (${Math.floor(xpPercentage)}%)`;

  // Atualiza a barra de saúde, nome do alvo, texto de saúde
  ui.healthBar.style.width = `${healthPercentage}%`;
  ui.nameDisplay.innerHTML = `${currentTargetData.name}<br>(Nível ${target.round})`;
  ui.healthText.innerText = `${formatNumber(Math.max(0, target.currentHealth))} / ${formatNumber(target.maxHealth)}`;

  // Atualiza os contadores de moedas e dano
  ui.coinsDisplay.innerText = `Moedas: ${formatNumber(player.coins)}`;
  ui.damageDisplay.innerText = `Dano por Clique: ${formatNumber(currentDamage)}`;

  // Atualiza a aparência do alvo com base no tipo atual
  ui.targetObject.className = `objects ${currentTargetData.shape}`;
  ui.targetObject.style.backgroundColor = currentTargetData.color;

  // Atualiza o multiplicador e a rodada atual
  ui.multDisplay.innerText = `x${targetMultiplier}`;
  ui.roundText.innerText = `Rodada ${target.round}`;
  ui.progressionCircles.innerHTML = '';

  // Atualiza os círculos de progressão
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
function initializeGame() {
  const firstTarget = targetList[target.currentIndex];

  target.maxHealth = firstTarget.baseHealth;
  target.currentHealth = target.maxHealth;
}

// Chama a função de inicialização para configurar o estado inicial do jogo
initializeGame();

// Chama a função para atualizar a interface com os valores iniciais
updateUI();

// ---------------------------------------------------

// Funções auxiliares para o jogo //

// Função para formatar números grandes em uma forma mais legível (ex: 1.5K, 2.3M)
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(1).toString();
}

// Função para mostrar o anúncio de rodada concluída com animação
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

// Função para adicionar experiência ao jogador e verificar se ele sobe de nível
function addXp(amount) {
  player.xp += amount;

  if (player.xp >= player.xpNextLevel) {
    player.xp -= player.xpNextLevel;
    player.level++;

    player.xpNextLevel = Math.floor(5 * Math.pow(1.5, player.level - 1));

    console.log('Level Up! Novo nível: ' + player.level);
  }
  updateUI();
}

// Função para calcular a saúde do alvo com base na rodada atual usando um aumento composto
function getScaledHealth(baseHealth) {
  const growthRate = 1.50; // 50% de aumento composto
  const multiplier = Math.pow(growthRate, target.round - 1);

  return Math.floor(baseHealth * multiplier);
}

// ---------------------------------------------------

// Funções principais do jogo //

// Função para gerar uma moeda no campo de jogo com base nas configurações e na posição do alvo
function spawnCoin() {
  const coin = document.createElement('div');
  coin.className = 'coin';

  // Seleção do tipo de moeda com base nas chances definidas
  const rand = Math.random();
  let selectedType = coinConfig.types[0]; // Padrão: Bronze
  let cumulativeChance = 0;

  // O loop percorre os tipos de moeda e acumula as chances até encontrar o tipo correspondente ao número aleatório gerado
  for (const type of coinConfig.types) {
    cumulativeChance += type.chance;
    if (rand < cumulativeChance) {
      selectedType = type;
      break;
    }
  }

  // Cálculo do valor da moeda com base no multiplicador do tipo e no multiplicador do alvo atual
  const currentTargetData = targetList[target.currentIndex];
  const currentTargetMult =
    (target.round - 1) * targetList.length + currentTargetData.rewardMultiplier;
  const coinValue = Math.floor(selectedType.multiplier * currentTargetMult);

  coin.dataset.value = coinValue;

  // Criação dos elementos de texto para exibir o nível e o valor da moeda
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

  // Cálculo de uma posição aleatória para a moeda, garantindo que ela não apareça muito próxima do alvo
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

  // O loop tenta gerar uma posição aleatória para a moeda e verifica se ela está dentro da área proibida (próxima ao alvo). Ele faz isso até encontrar uma posição válida ou atingir um número máximo de tentativas para evitar loops infinitos.
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

  // Adiciona um evento de clique à moeda para que, quando o jogador clicar nela, ele receba as moedas correspondentes e a moeda desapareça com um efeito de pontuação flutuante
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

    // O efeito de pontuação flutuante dura 0.5 segundos antes de ser removido do DOM
    setTimeout(() => {
      if (floatingScore) floatingScore.remove();
    }, 500);
  });

  // A moeda desaparece automaticamente após um tempo definido em coinConfig.despawnTime para evitar que o campo fique muito cheio de moedas não coletadas
  setTimeout(() => {if (coin) coin.remove();}, coinConfig.despawnTime);
  ui.playField.appendChild(coin);
}

// Função para lidar com o clique no alvo, aplicando dano, gerando partículas de clique e verificando se o alvo foi derrotado para avançar para o próximo
function handleTargetClick(clickX, clickY) {
  if (target.isTransitioning) return;

  const currentTargetData = targetList[target.currentIndex];

  // Geração de partículas de clique para criar um efeito visual de impacto
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
  const currentDamage = player.getDamage();

  // Aplica o dano ao alvo, subtrai a saúde atual e incrementa o contador de cliques do jogador
  target.currentHealth -= currentDamage;
  player.totalClicks++;

  // Verifica se o alvo foi derrotado (saúde atual menor ou igual a zero) e, se for o caso, inicia a transição para o próximo alvo, concede experiência ao jogador, gera moedas de recompensa e cria um efeito de fragmentação visual do alvo derrotado
  if (Math.floor(target.currentHealth) <= 0) {
    target.isTransitioning = true;

    const xpGained = currentTargetData.rewardMultiplier * 2 * target.round;
    addXp(xpGained);

    // Gera moedas de bônus com base na configuração definida em coinConfig.spawnQuantity
    const bonusQuantity = Math.floor(coinConfig.spawnQuantity);
    for (let i = 0; i < bonusQuantity; i++) {
      spawnCoin();
    }

    // Obtém as dimensões do alvo e do campo de jogo para posicionar corretamente os fragmentos de quebra do alvo
    const rect = ui.targetObject.getBoundingClientRect();
    const fieldRect = ui.playField.getBoundingClientRect();

    ui.targetObject.style.opacity = '0';

    // Efeito de fragmentação do alvo
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

    // Após um breve atraso para permitir que o efeito de fragmentação seja visto, o jogo avança para o próximo alvo, atualiza as informações do alvo e do jogador na interface e torna o novo alvo visível novamente
    setTimeout(() => {
      target.currentIndex++;

      // Verifica se o índice do alvo atual ultrapassou a lista de alvos, o que indica que o jogador completou uma rodada. Se for o caso, ele reseta o índice para zero, exibe um anúncio de rodada concluída e incrementa o número da rodada para aumentar a dificuldade dos próximos alvos.
      if (target.currentIndex >= targetList.length) {
        target.currentIndex = 0;
        showRoundAnnouncer(target.round);
        target.round++;
        console.log(`Rodada ${target.round} iniciada!`);
      }

      // Obtém os dados do próximo alvo com base no índice atualizado e calcula a saúde máxima do novo alvo usando a função getScaledHealth, que aplica um aumento composto com base na rodada atual para tornar os alvos progressivamente mais difíceis. Em seguida, ele define a saúde atual do alvo para o valor máximo calculado.
      const nextTargetData = targetList[target.currentIndex];
      target.maxHealth = getScaledHealth(nextTargetData.baseHealth);
      target.currentHealth = target.maxHealth;

      updateUI();

      ui.targetObject.style.opacity = '1';

      target.isTransitioning = false;
    }, 150);
  } else {
    updateUI();
  }

  // Aplica um breve efeito de escala no alvo para dar feedback visual do clique, fazendo com que ele encolha ligeiramente e depois volte ao tamanho normal
  ui.targetObject.style.transform = 'scale(0.9)';
  setTimeout(() => (ui.targetObject.style.transform = 'scale(1)'), 50);
}

// ---------------------------------------------------

// Adiciona um evento de clique ao elemento do alvo para que, quando o jogador clicar nele, a função handleTargetClick seja chamada com as coordenadas do clique para processar o dano e os efeitos visuais correspondentes
ui.targetObject.addEventListener('click', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  handleTargetClick(x, y);
});

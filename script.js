// --- GAME STATE (Tables/Objects) ---

// Configurações e progresso do jogador
const player = {
    level: 1,
    coins: 0,
    totalClicks: 0,
    damagePerClick: 3.75 // 5 * (1 * 0.75)
};

// Estado do alvo (Círculo Dourado)
const target = {
    maxHealth: 50,
    currentHealth: 50,
    healthMultiplier: 1.5,
    baseDamageFormula: (level) => 5 * (level * 0.75)
};

// Configurações das moedas
const coinConfig = {
    valuePerLevel: 1,
    spawnQuantity: 5,
    size: 30,
    safetyMargin: 10,
    despawnTime: 10000 // 10 segundos
};

// --- DOM ELEMENTS (UI) ---
const ui = {
    targetObject: document.getElementById('object'),
    healthBar: document.getElementById('health_fill'),
    nameDisplay: document.querySelector('.object_name'),
    playField: document.getElementById('play_field'),
    targetWrapper: document.querySelector('.target_wrapper'),
    // Counters
    coinsDisplay: document.querySelectorAll('.counters')[0],
    damageDisplay: document.querySelectorAll('.counters')[1],
    clicksDisplay: document.querySelectorAll('.counters')[2],
    healthText: document.querySelectorAll('.object_counters')[0]
};

// --- INITIALIZATION ---
function updateUI() {
    const healthPercentage = (Math.max(0, target.currentHealth) / target.maxHealth) * 100;
    
    ui.healthBar.style.width = `${healthPercentage}%`;
    ui.nameDisplay.innerText = `Golden Circle (Lv. ${player.level})`;
    
    ui.healthText.innerText = `${formatNumber(Math.max(0, target.currentHealth))} / ${formatNumber(target.maxHealth)}`;
    ui.coinsDisplay.innerText = `Coins: ${formatNumber(player.coins)}`;
    ui.damageDisplay.innerText = `Damage per Click: ${formatNumber(player.damagePerClick)}`;
    ui.clicksDisplay.innerText = `Clicks: ${formatNumber(player.totalClicks)}`;
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
    coin.innerText = '$';

    let x, y;
    let attempts = 0;
    let isInsideForbiddenArea = true;

    const fieldRect = ui.playField.getBoundingClientRect();
    const targetRect = ui.targetWrapper.getBoundingClientRect();

    const forbidden = {
        left: targetRect.left - fieldRect.left - coinConfig.safetyMargin,
        right: targetRect.right - fieldRect.left + coinConfig.safetyMargin,
        top: targetRect.top - fieldRect.top - coinConfig.safetyMargin,
        bottom: targetRect.bottom - fieldRect.top + coinConfig.safetyMargin
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
        player.coins += Math.floor(coinConfig.valuePerLevel * player.level);
        ui.coinsDisplay.innerText = `Coins: ${formatNumber(player.coins)}`;
        coin.remove();
    });

    // Auto-despawn
    setTimeout(() => { if (coin) coin.remove(); }, coinConfig.despawnTime);

    ui.playField.appendChild(coin);
}

function handleTargetClick() {
    // 1. Damage Logic
    target.currentHealth -= player.damagePerClick;
    player.totalClicks++;

    // 2. Death / Level Up Logic
    if (Math.floor(target.currentHealth) <= 0) {
        // Spawn rewards
        for (let i = 0; i < coinConfig.spawnQuantity; i++) {
            spawnCoin();
        }

        player.level++;

        // Scaling Progression
        target.maxHealth = Math.floor(target.maxHealth * target.healthMultiplier);
        target.currentHealth = target.maxHealth;
        player.damagePerClick = target.baseDamageFormula(player.level);

        console.log(`Level Up! New Health: ${target.maxHealth}, New Damage: ${player.damagePerClick}`);
    }

    // 3. Visual Feedback
    updateUI();
    ui.targetObject.style.transform = 'scale(0.9)';
    setTimeout(() => (ui.targetObject.style.transform = 'scale(1)'), 50);
}

// --- EVENT LISTENERS ---
ui.targetObject.addEventListener('click', () => {
    // Slight delay to simulate responsiveness
    setTimeout(handleTargetClick, 150);
});
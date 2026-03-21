// --- ESTADO INICIAL DO JOGO ---
let nivel = 1;
let vidaMaxima = 100;
let vidaAtual = vidaMaxima;
let cliquesTotais = 0;

// O dano inicial baseado na fórmula: vidaMaxima / 20 (100 / 20 = 5)
let danoPorClique = vidaMaxima / 20;

// Selecionando os elementos
const objeto = document.getElementById('object');
const barraPreenchimento = document.getElementById('health_fill');
const nomeObjeto = document.querySelector('.object_name');

// Selecionando os contadores (ajuste os índices conforme seu HTML)
const displayMoedas = document.querySelectorAll('.counters')[0];
const displayDano = document.querySelectorAll('.counters')[1];
const displayCliques = document.querySelectorAll('.counters')[2];
const displayVidaObjeto = document.querySelectorAll('.object_counters')[0];

// 3. Função inicial que atualiza a interface visual
function atualizarInterface() {
  const porcentagem = (Math.max(0, vidaAtual) / vidaMaxima) * 100;
  barraPreenchimento.style.width = porcentagem + '%';
   nomeObjeto.innerText = `Círculo Dourado (Nív. ${nivel})`;

  displayVidaObjeto.innerText =
    formatarNumero(Math.max(0, vidaAtual)) + ' / ' + formatarNumero(vidaMaxima);

   displayMoedas.innerText = 'Moedas: 0';
   displayDano.innerText = 'Dano por Clique: ' + formatarNumero(danoPorClique);
   displayCliques.innerText = 'Cliques: ' + formatarNumero(cliquesTotais);
}

atualizarInterface();

function formatarNumero(num) {
  if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + 'T'; // Trilhão
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'; // Bilhão
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'; // Milhão
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'; // Mil
  return Math.floor(num).toString(); // Menor que 1000, mostra normal
}

function clicarObjeto() {
  // 1. Aplicar Dano
  vidaAtual -= danoPorClique;
  cliquesTotais++;

  // 2. Verificar se o objeto "morreu" (Level Up)
  if (Math.floor(vidaAtual) <= 0) {
    nivel++;

    // Lógica de Progressão:
    vidaMaxima = Math.floor(vidaMaxima * 1.5); // Aumenta 1.5x (arredondado)
    vidaAtual = vidaMaxima; // Cura o objeto para o novo nível

    danoPorClique = vidaMaxima / 15; // Novo dano baseado na nova vida

    // Atualizar o nome para mostrar o Nível
    nomeObjeto.innerText = `Círculo Dourado (Nív. ${nivel})`;
    console.log(
      `Level Up! Nova Vida: ${vidaMaxima}, Novo Dano: ${danoPorClique}`,
    );
  }
  displayVidaObjeto.innerText =
    formatarNumero(Math.max(0, vidaAtual)) + ' / ' + formatarNumero(vidaMaxima);

  // 3. Atualização Visual da Barra
  const porcentagem = (Math.max(0, vidaAtual) / vidaMaxima) * 100;
  barraPreenchimento.style.width = porcentagem + '%';

  // 4. Atualizar os contadores na tela
  displayDano.innerText = 'Dano por Clique: ' + formatarNumero(danoPorClique);
  displayCliques.innerText = 'Cliques: ' + formatarNumero(cliquesTotais);

  // Efeito de clique (feedback visual)
  objeto.style.transform = 'scale(0.9)';
  setTimeout(() => (objeto.style.transform = 'scale(1)'), 100);
}

objeto.addEventListener('click', () => {
  setTimeout(() => {
    clicarObjeto();
  }, 150);
  // Pequeno delay para garantir que o clique seja registrado antes de atualizar a interface
});

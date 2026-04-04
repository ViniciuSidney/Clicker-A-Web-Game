# Ideias para o Projeto Clicker Game A

Este documento serve como um brainstorm para coletar todas as ideias e melhorias que quero implementar no jogo. Organize as ideias por categoria para facilitar a visualização e priorização.

## 1. Mecânicas de Jogo
Aqui vão ideias relacionadas à jogabilidade principal, como novos tipos de cliques, upgrades, inimigos, etc.

- **Ideia 1:** Troca de alvo ao derrotar o atual e troca para o primeiro ao derrotar o último. ✅
- **Ideia 2:** Dano ao jogador depois de certo tempo no mesmo alvo. Ao ser derrotado, jogador volta para o alvo anterior. 🔨
- **Ideia 3:** ...

### Subseções:
- Tipos de Alvos
- Sistema de Upgrades
- Modos de Jogo (ex: survival, endless)
- Eventos Especiais

### Tipos de Alvos

- Alvos normais
- Alvos chefes

### Sistema de Upgrades 🔨

- **Custos dos Upgrades**
   - CustoProximoNv = Base * 1.15^NivelAtual

- **Upgrades de Clique**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Aumenta o dano base por clique.
      - DanoTotal = DanoBase + [ (NívelUpgrade * Multiplicador) * (Upgrade 4) ]
   - Upgrade 2 [Inicial] [por_nível]:
      - Aumenta em 5% a chance de causar 2x mais dano (Inicialmente: 0%)

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Aumenta a % da chance de causar 2x mais dano em +1%
   - Upgrade 4 [Desbloqueável] [por_nível]:
      - Aumenta a potencia do multiplicador de dano em +1x
   - Upgrade 5 [Desbloqueável] [por_nível]:
      - Aumenta a potencia do aumento de dano base em +1x (Inicialmente: 1x)

- **Upgrades Passivos**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Dano passivo de 10% do dano ativo a cada 5 segundos
   - Upgrade 2 [Inicial] [por_nível]:
      - Chance de 10% de Coleta de 1 moeda de forma automática

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Aumentar % do dano passivo em 2%
   - Upgrade 4 [Desbloqueável] [por_nível]:
      - Diminuir espera até o próximo ataque passivo em 0.1 segundos
   - Upgrade 5 [Desbloqueável] [por_nível]:
      - Aumentar chance de coleta automática em 2%
   - Upgrade 6 [Desbloqueável] [por_nível]:
      - Aumentar quantidade de moedas coletadas em +1

- **Upgrades Econômicos**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Aumenta em 1% a chance de aparecer moedas de raridade maior (Inicialmente: 0%)
      - Diminuindo as chances de moedas de raridade menor
   - Upgrade 2 [Inicial] [por_nível]:
      - Aumenta o valor base de cada moeda em +1

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Aumenta o aumento do valor base de cada moeda em +1   

## 2. UI/UX Melhorias
Ideias para melhorar a interface do usuário, design visual, responsividade, etc.

- **Ideia 1:** ...
- **Ideia 2:** ...

### Subseções:
- Animações e Efeitos Visuais
- Layout Responsivo
- Feedback Visual (sons, partículas)
- Menus e Navegação

### Animações e Efeitos Visuais

- Ao clicar no alvo
- Ao derrotar o alvo
- Ao sumir moeda
- Ao clicar na moeda

## 3. Balanceamento e Progressão
Ajustes para tornar o jogo mais equilibrado, progressão de dificuldade, economia, etc.

- **Ideia 1:** ...
- **Ideia 2:** ...

### Subseções:
- Curva de Dificuldade
- Sistema de Moedas e Recompensas
- Níveis e XP
- Balanceamento de Poderes

### Níveis e XP

- Ganhar XP ao derrotar alvos
- Ao receber XP suficiente, jogador sobe de Nível
- Ao subir de Nível ganhar multiplicador de [...]

## 4. Novos Conteúdos
Adições de novos elementos ao jogo, como itens, skins, mundos, etc.

- **Ideia 1:** ...
- **Ideia 2:** ...

### Subseções:
- Novos Inimigos/Alvos
- Itens Cosméticos
- Expansões ou DLCs
- Personagens ou Avatares
- Telas de Funcionalidades

### Novos Alvos:
- Círculo Dourado ✅
- Quadrado Carmesim ✅
- Triângulo Esmeralda ✅
- Losango de Ametista ✅
- Pentágono de Ferro ✅
- Hexágono de Obsidiana ✅
- Estrela [Chefe] 🔨

### Telas de Funcionalidades
- Sistema de Melhorias
- Sistema de Reset

## 5. Tecnologias e Performance
Ideias técnicas para melhorar o código, otimização, novas features técnicas.

- **Ideia 1:** ...
- **Ideia 2:** ...

### Subseções:
- Otimização de Performance
- Integração com APIs
- Salvamento de Progresso
- Multiplayer (se aplicável)

## 6. Outras Ideias
Qualquer outra ideia que não se encaixe nas categorias acima.

- **Ideia 1:** ...

## Priorização
- **Alta Prioridade:** [Liste ideias críticas]
- **Média Prioridade:** [Liste ideias importantes]
- **Baixa Prioridade:** [Liste ideias futuras]

## Notas Gerais
- [Espaço para anotações adicionais, links, referências, etc.]
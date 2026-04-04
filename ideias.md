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
      - Base: 50 moedas
      - Incremento: +2 de Dano Base por nível.
      - Lógica: DanoTotal = DanoBase + [ (NívelUpgrade * 2) * [Upgrade_4] ]
   - Upgrade 2 [Inicial] [por_nível]:
      - Base: 150 moedas
      - Incremento: +5% de chance de Crítico por nível.

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Base: 1.000 moedas
      - Incremento: +1 no aumento de x% na chance de Crítico do [Upgrade_2].
   - Upgrade 4 [Desbloqueável] [por_nível]:
      - Base: 2.500 moedas
      - Incremento: +1x na potência do multiplicador do Crítico.
      - Inicialmente: 1x
   - Upgrade 5 [Desbloqueável] [por_nível]:
      - Base: 5.000 moedas
      - Incremento: +1x na potência do multiplicador do dano base.
      - Inicialmente: 1x

- **Upgrades Passivos**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Base: 100 moedas
      - Incremento: Ativa o dano de 30% a cada 5s.
   - Upgrade 2 [Inicial] [por_nível]:
      - Base: 300 moedas
      - Incremento: Chance inicial de 10% de coleta automática.

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Base: 1.500 moedas
      - Incremento: +2% de dano passivo por nível.
   - Upgrade 4 [Desbloqueável] [por_nível]:
      - Base: 4.000 moedas
      - Incremento: -0.1s de espera por nível.
      - Limite: Mínimo de 0.2s.
   - Upgrade 5 [Desbloqueável] [por_nível]:
      - Base: 2.000 moedas
      - Incremento: +2% de chance de coleta por nível.
   - Upgrade 6 [Desbloqueável] [por_nível]:
      - Base: 7.500 moedas
      - Incremento: +1 moeda coletada automaticamente por nível.

- **Upgrades Econômicos**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Base: 400 moedas
      - Incremento: +1% de chance de raridade alta (reduz Bronze).
   - Upgrade 2 [Inicial] [por_nível]:
      - Base: 600 moedas
      - Incremento: +1 no valor base de todas as moedas.
   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Base: 10.000 moedas
      - Incremento: +1 no adicional do Upgrade 2 por nível.

- **Upgrades De Alvos**:
   - Upgrade 1 [Inicial] [por_nível]:
      - Base: 800 moedas
      - Incremento: -5% na "resistência" (o alvo recebe mais dano) por nível.
      - Limite: Máximo de 50% de redução.
   - Upgrade 2 [Inicial] [por_nível]:
      - Base: 1.200 moedas
      - Incremento: +1 moeda solta ao derrotar o alvo.

   - Upgrade 3 [Desbloqueável] [por_nível]:
      - Base: 3.500 moedas
      - Incremento: 

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
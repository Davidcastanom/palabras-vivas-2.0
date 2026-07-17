export function renderMemory(gameArea, gameInstance) {
  const cards = gameInstance.getCards();

  gameArea.innerHTML = `
    <div class="memory-grid">
      ${cards.map(card => `
        <div class="memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}" 
             data-id="${card.id}" role="button" tabindex="0" aria-label="${card.type === 'image' ? 'Imagen' : card.content}">
          <div class="memory-card-front">
            <i class="fas fa-question"></i>
          </div>
          <div class="memory-card-back">
            ${card.type === 'image' 
              ? `<img src="${card.content}" alt="${card.text}" class="memory-card-image" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'memory-card-emoji\\'>🔍</span>'" loading="lazy">`
              : `<span class="memory-card-word">${card.content}</span>`
            }
          </div>
        </div>
      `).join('')}
    </div>
  `;

  gameArea.querySelectorAll('.memory-card').forEach(card => {
    const handler = () => {
      const cardId = card.dataset.id;
      const flippedCard = gameInstance.flipCard(cardId);
      
      if (flippedCard) {
        card.classList.add('flipped');
        
        if (gameInstance.getFlippedCards().length === 2) {
          setTimeout(() => updateMemoryCards(gameArea, gameInstance), 1000);
        }
      }
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

export function updateMemoryCards(gameArea, gameInstance) {
  if (!gameInstance || !gameArea) return;
  const cards = gameInstance.getCards();

  cards.forEach(card => {
    const cardElement = gameArea.querySelector(`[data-id="${card.id}"]`);
    if (cardElement) {
      cardElement.classList.toggle('flipped', card.isFlipped);
      cardElement.classList.toggle('matched', card.isMatched);
    }
  });
}

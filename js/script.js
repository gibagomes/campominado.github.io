let tamanho, minas, tabuleiro, mensagem, jogoEncerrado;

function iniciarJogo() {
  const dificuldade = parseInt(document.getElementById("dificuldade").value);
  tamanho = dificuldade;
  minas = Math.floor(tamanho * tamanho * 0.2); // 20% da grade
  jogoEncerrado = false;
  tabuleiro = document.getElementById("tabuleiro");
  mensagem = document.getElementById("mensagem");
  tabuleiro.innerHTML = "";
  mensagem.textContent = "";

  tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 40px)`;

  // Gera minas aleatórias
  const totalCelas = tamanho * tamanho;
  const posicoesMinas = new Set();
  while (posicoesMinas.size < minas) {
    posicoesMinas.add(Math.floor(Math.random() * totalCelas));
  }

  // Cria as células
  for (let i = 0; i < totalCelas; i++) {
    const btn = document.createElement("button");
    btn.classList.add("cela");
    btn.dataset.index = i;

    btn.onclick = () => {
      if (jogoEncerrado || btn.disabled) return;

      const isMina = posicoesMinas.has(i);
      if (isMina) {
        btn.textContent = "💣";
        btn.style.backgroundColor = "red";
        mensagem.textContent = "💥 BOOM! Você perdeu.";
        encerrarJogo();
      } else {
        const minasAoRedor = contarMinasVizinhas(i, posicoesMinas);
        btn.textContent = minasAoRedor > 0 ? minasAoRedor : "✅";
        btn.disabled = true;

        // Checa vitória
        const celasAbertas = document.querySelectorAll(".cela:disabled").length;
        if (celasAbertas === totalCelas - minas) {
          mensagem.textContent = "🎉 Parabéns! Você venceu!";
          encerrarJogo();
        }
      }
    };

    tabuleiro.appendChild(btn);
  }
}

// Conta quantas minas estão ao redor de uma cela
function contarMinasVizinhas(index, minasSet) {
  const linha = Math.floor(index / tamanho);
  const coluna = index % tamanho;
  let total = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const novaLinha = linha + dx;
      const novaColuna = coluna + dy;
      if (
        novaLinha >= 0 && novaLinha < tamanho &&
        novaColuna >= 0 && novaColuna < tamanho
      ) {
        const vizinho = novaLinha * tamanho + novaColuna;
        if (minasSet.has(vizinho)) total++;
      }
    }
  }

  return total;
}

// Desativa todas as celas
function encerrarJogo() {
  jogoEncerrado = true;
  const botoes = document.querySelectorAll(".cela");
  botoes.forEach(btn => btn.disabled = true);
}

// Inicia o jogo ao carregar a página
window.onload = iniciarJogo;

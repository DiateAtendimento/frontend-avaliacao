const SCRIPT_URL = "https://backend-avaliacao.onrender.com/api/avaliacao";

// Estado atual da avaliação
let answers = {
  clareza: "",
  resolvida: "",
  tempoResposta: "",
  experienciaGeral: "",
  comentario: ""
};

let etapaAtual = 0;
const etapas = [
  "etapaInicio",
  "etapa1",
  "etapa2",
  "etapa3",
  "etapa4",
  "etapa5",
  "etapaFinal"
];

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  // Sempre começa com a imagem da atendente
  showEtapa(0);

  // Botão de começar (agora está dentro da etapaInicio)
  document.getElementById('btnStart').addEventListener('click', e => {
    e.preventDefault();

    etapaAtual = 1; // vai para a primeira pergunta
    showEtapa(etapaAtual);
    
    // Limpa seleções dos emojis de todas as etapas
  document.querySelectorAll('.emoji-btn.selected').forEach(btn => {
    btn.classList.remove('selected');
  });

  // (Opcional) Limpa o campo de comentário também
  document.getElementById('comentario').value = '';
  });

  setupEmojis('etapa1', 'clareza');
  setupEmojis('etapa2', 'resolvida');
  setupEmojis('etapa3', 'tempoResposta');
  setupEmojis('etapa4', 'experienciaGeral');

  document.getElementById('btnEnviar').addEventListener('click', async function() {
    answers.comentario = document.getElementById('comentario').value.trim();
    await enviarAvaliacao();
  });
});


// Mostra a etapa desejada
function showEtapa(idx) {
  etapas.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (i === idx) ? 'block' : 'none';
  });
}


// Função para setup dos botões de emoji
function setupEmojis(etapaId, campo) {
  const etapaDiv = document.getElementById(etapaId);
  if (!etapaDiv) return;
  const botoes = etapaDiv.querySelectorAll('.emoji-btn');
  botoes.forEach(btn => {
    btn.addEventListener('click', function() {
      // Marca/desmarca seleção
      botoes.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[campo] = btn.getAttribute('data-value');
      // Vai para próxima etapa
      etapaAtual++;
      showEtapa(etapaAtual);
      // Limpa seleção da etapa seguinte (se voltar para trás e responder de novo)
      if (etapas[etapaAtual]) {
        const nextDiv = document.getElementById(etapas[etapaAtual]);
        if (nextDiv) {
          const nextBtns = nextDiv.querySelectorAll('.emoji-btn');
          nextBtns.forEach(nb => nb.classList.remove('selected'));
        }
      }
    });
  });
}

// Envio final
async function enviarAvaliacao() {
  const msgDiv = document.getElementById("msg");
  msgDiv.textContent = "Enviando...";
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });
    if (res.ok) {
      etapaAtual++;
      showEtapa(etapaAtual); // Mostra agradecimento
      msgDiv.textContent = "";
      // Limpa respostas, se quiser
      document.getElementById('comentario').value = "";
      answers = {
        clareza: "",
        resolvida: "",
        tempoResposta: "",
        experienciaGeral: "",
        comentario: ""
      };
    } else {
      const errorText = await res.text();
      msgDiv.textContent = "Erro ao enviar: " + errorText;
    }
  } catch (err) {
    msgDiv.textContent = "Erro ao conectar. Verifique sua internet ou tente novamente.";
  }
}

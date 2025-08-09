// Número máximo de vagas
const MAX_VAGAS = 100;
// URL do seu Google Apps Script (substitua pela sua URL real)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxioa9KNFnYaStqu2UZmiUSxamSi3S5PiPnxZqTenWvOCkWiqqKOdmqI_549v3QN99YIw/exec";

let inscritos = 0;

// Atualiza o contador de vagas na tela
function atualizarVagas(qtd) {
  const vagasEl = document.querySelector(".log-vagas");
  if (vagasEl) vagasEl.textContent = `Vagas ${qtd}/${MAX_VAGAS}`;
}

// Busca número atual de inscritos no Apps Script
async function carregarVagas() {
  try {
    const response = await fetch(`${SCRIPT_URL}?acao=getVagas`);
    const data = await response.json();
    inscritos = data.inscritos;
    atualizarVagas(inscritos);
  } catch (err) {
    console.error("Erro ao carregar vagas:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  const btnEnviar = document.querySelector("#bttn-enviar");

  if (!form || !btnEnviar) return;

  // Carrega vagas quando a página abrir
  carregarVagas();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (inscritos >= MAX_VAGAS) {
      alert("Todas as vagas foram preenchidas.");
      btnEnviar.value = "Vagas Esgotadas";
      btnEnviar.disabled = true;
      return;
    }

    btnEnviar.disabled = true;

    // Animação de envio
    let dots = 0;
    btnEnviar.value = "Enviando";
    const intervalId = setInterval(() => {
      dots = (dots + 1) % 4;
      btnEnviar.value = "Enviando" + ".".repeat(dots);
    }, 500);

    try {
      const nome = document.querySelector('#nome').value;
      const cargo = document.querySelector('#cargo').value;
      const denominacao = document.querySelector('#denominacao').value;
      const cidade = document.querySelector('#cidade').value;

      const response = await fetch(`${SCRIPT_URL}?acao=addInscrito&nome=${encodeURIComponent(nome)}&cargo=${encodeURIComponent(cargo)}&denominacao=${encodeURIComponent(denominacao)}&cidade=${encodeURIComponent(cidade)}`);
      const data = await response.json();

      clearInterval(intervalId);

      if (data.sucesso) {
        alert("Inscrição realizada com sucesso!");
        inscritos = data.inscritos;
        atualizarVagas(inscritos);
        form.reset();
        btnEnviar.value = "Enviado!";
      } else {
        alert(data.mensagem || "Não foi possível realizar a inscrição.");
        btnEnviar.value = "Enviar";
        btnEnviar.disabled = false;
      }
    } catch (error) {
      clearInterval(intervalId);
      console.error("Erro ao enviar:", error);
      alert("Dados Enviado com Sucesso!!");
      btnEnviar.value = "Enviar";
      btnEnviar.disabled = false;
    }
  });
});

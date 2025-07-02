

document.querySelector('.formulario').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário
  
  // Desabilitar o botão Enviar para evitar envios múltiplos
  const enviarBtn = document.querySelector('#bttn-enviar');
  enviarBtn.disabled = true;
  enviarBtn.value = "Enviando..."; // Atualiza o texto do botão para indicar envio

  // Coletar os dados do formulário
  const nome = document.querySelector('#nome').value;
  const cargo = document.querySelector('#cargo').value;
  const denominacao = document.querySelector('#denominacao').value;
  const cidade = document.querySelector('#cidade').value;
  
  // Montar a URL com os parâmetros do formulário
  const url = `https://script.google.com/macros/s/AKfycbxioa9KNFnYaStqu2UZmiUSxamSi3S5PiPnxZqTenWvOCkWiqqKOdmqI_549v3QN99YIw/exec?nome=${encodeURIComponent(nome)}&cargo=${encodeURIComponent(cargo)}&denominacao=${encodeURIComponent(denominacao)}&cidade=${encodeURIComponent(cidade)}`;
  
  // Enviar os dados para a API via GET
  fetch(url)
    .then(response => response.text()) // Esperar por texto simples, não JSON
    .then(data => {
      alert(data); // Exibe a resposta do servidor
      enviarBtn.value = "Enviado"; // Atualiza o botão após o envio
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Houve um erro ao enviar os dados.');
      enviarBtn.disabled = false; // Reabilitar o botão em caso de erro
      enviarBtn.value = "Enviar"; // Voltar o texto original
    });
});

  // Valor máximo de vagas
  const MAX_VAGAS = 100;

  // Pega o número atual de inscritos do localStorage ou começa com 0
  let inscritos = localStorage.getItem("inscritos") || 0;

  // Atualiza o texto das vagas na tela
  function atualizarVagas() {
    document.querySelector(".log-vagas").textContent = `Vagas ${inscritos}/${MAX_VAGAS}`;
  }

  atualizarVagas(); // Chama ao abrir a página

  // Escuta o envio do formulário
  document.querySelector(".formulario").addEventListener("submit", function(e) {
    e.preventDefault(); // Impede o envio real do formulário

    if (inscritos >= MAX_VAGAS) {
      alert("Todas as vagas foram preenchidas.");
      return;
    }

    inscritos++;
    localStorage.setItem("inscritos", inscritos); // Atualiza o número de inscritos
    atualizarVagas(); // Atualiza na interface
    this.reset(); // Limpa o formulário
  });
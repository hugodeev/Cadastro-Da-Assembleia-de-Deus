// Importações Firebase (deve estar num módulo JS com suporte ESM)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANixu7VTzveDAQbibARZEYw19FTMAmtVI",
  authDomain: "cadastro-do-ec.firebaseapp.com",
  databaseURL: "https://cadastro-do-ec-default-rtdb.firebaseio.com",
  projectId: "cadastro-do-ec",
  storageBucket: "cadastro-do-ec.appspot.com",
  messagingSenderId: "908715266580",
  appId: "1:908715266580:web:802dd4159752f7652fcd01",
  measurementId: "G-FVMTJCLL9F"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const inscritosRef = ref(db, "inscritos");
const MAX_VAGAS = 100;

// Atualiza contador de vagas na tela
function atualizarVagas(qtd) {
  const vagasEl = document.querySelector(".log-vagas");
  if (vagasEl) vagasEl.textContent = `Vagas ${qtd}/${MAX_VAGAS}`;
}

// Atualiza contador quando Firebase muda
onValue(inscritosRef, (snapshot) => {
  const qtd = snapshot.val() || 0;
  atualizarVagas(qtd);
});

// Evento DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  const btnEnviar = document.querySelector("#bttn-enviar");

  if (!form || !btnEnviar) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Bloqueio máximo vagas
    btnEnviar.disabled = true;

    // Inicia animação dos pontinhos no botão
    let dots = 0;
    btnEnviar.value = "Enviando";
    const intervalId = setInterval(() => {
      dots = (dots + 1) % 4; // 0..3
      btnEnviar.value = "Enviando" + ".".repeat(dots);
    }, 500);

    try {
      const snapshot = await get(inscritosRef);
      let inscritos = snapshot.val() || 0;

      if (inscritos >= MAX_VAGAS) {
        clearInterval(intervalId);
        alert("Todas as vagas foram preenchidas.");
        btnEnviar.value = "Vagas Esgotadas";
        return;
      }

      // Coleta os dados do formulário
      const nome = document.querySelector('#nome').value;
      const cargo = document.querySelector('#cargo').value;
      const denominacao = document.querySelector('#denominacao').value;
      const cidade = document.querySelector('#cidade').value;

      // URL do Google Script com parâmetros
      const url = `https://script.google.com/macros/s/AKfycbxioa9KNFnYaStqu2UZmiUSxamSi3S5PiPnxZqTenWvOCkWiqqKOdmqI_549v3QN99YIw/exec?nome=${encodeURIComponent(nome)}&cargo=${encodeURIComponent(cargo)}&denominacao=${encodeURIComponent(denominacao)}&cidade=${encodeURIComponent(cidade)}`;

      // Envia para o Google Script
      const response = await fetch(url);
      const data = await response.text();

      // Atualiza Firebase com mais um inscrito
      await set(inscritosRef, inscritos + 1);

      clearInterval(intervalId);

      alert(data); // Mostra a mensagem da API Google Script

      form.reset();
      btnEnviar.value = "Enviado!";
      // mantém botão desabilitado para evitar novo envio sem reload

    } catch (error) {
      clearInterval(intervalId);
      console.error("Erro ao enviar:", error);
      alert("Houve um erro ao enviar os dados.");
      btnEnviar.value = "Enviar";
      btnEnviar.disabled = false;
    }
  });
});

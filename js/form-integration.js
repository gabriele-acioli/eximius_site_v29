/* PONTO DE INTEGRAÇÃO BACKEND DO FORMULÁRIO */
(() => {
  const form=document.getElementById('visitForm');
  const note=document.getElementById('visitFormNote');
  if(!form||!note){
    throw new Error('Não foi possível inicializar o formulário de matrículas: elementos obrigatórios ausentes.');
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    /*
      Substituir este placeholder pela requisição ao endpoint HTTPS definido
      com a equipe de backend. O contrato do formulário é:
      { nome, email, whatsapp, mensagem }.

      Não inserir credenciais privadas neste arquivo; validar e proteger os
      dados também no servidor.
    */
    note.textContent='Dados preenchidos. A integração de envio do formulário será conectada na publicação.';
  });

  form.addEventListener('input',()=>{
    note.textContent='';
  });
})();
/* Envio assíncrono: somente confirma sucesso após resposta positiva do FormSubmit. */
(() => {
  const form = document.querySelector('#portfolio-contact-form');
  const dialog = document.querySelector('#contact-success-dialog');
  if (!form || !dialog) return;

  const submit = form.querySelector('button[type="submit"]');
  const feedback = form.querySelector('#form-feedback');
  const close = dialog.querySelector('[data-close-dialog]');
  const originalLabel = submit.textContent;

  close?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;

    submit.disabled = true;
    submit.textContent = 'Enviando...';
    feedback.textContent = '';

    const payload = Object.fromEntries(new FormData(form).entries());
    if (payload._honey) {
      feedback.textContent = 'Não foi possível enviar a mensagem.';
      submit.disabled = false;
      submit.textContent = originalLabel;
      return;
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/nayjoplin96@gmail.com', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      // Respostas de erro também podem ter status HTTP 200 ou "success": "false".
      if (!response.ok || (data.success !== true && data.success !== 'true')) {
        throw new Error('A plataforma não confirmou o envio.');
      }
      form.reset();
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    } catch (error) {
      feedback.textContent = 'Não foi possível confirmar o envio. Tente novamente ou escreva para nayjoplin96@gmail.com.';
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
})();

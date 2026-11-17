/* FormSubmit AJAX: informa falha real e só abre o diálogo com confirmação positiva. */
(() => {
  const form = document.getElementById('portfolio-contact-form');
  const dialog = document.getElementById('contact-success-dialog');
  if (!form || !dialog) return;

  const button = form.querySelector('[type="submit"]');
  const feedback = document.getElementById('form-feedback');
  const close = dialog.querySelector('[data-close-dialog]');
  const normalLabel = button.textContent;

  function showError(message) {
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  close?.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close?.();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;

    feedback.textContent = '';
    button.disabled = true;
    button.textContent = 'Enviando mensagem...';

    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('https://formsubmit.co/ajax/nayjoplin96@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      const success = data?.success === true || data?.success === 'true' || data?.success === 'True';

      if (!response.ok || !success) {
        const serverMessage = typeof data?.message === 'string' ? data.message : '';
        if (/activat|confirm.*form/i.test(serverMessage)) {
          showError('O formulário está aguardando ativação no e-mail de Nay Rodrigues. Sua mensagem ainda não foi confirmada. Enquanto isso, escreva diretamente para nayjoplin96@gmail.com.');
        } else if (/server|web server|referer|website|form url/i.test(serverMessage)) {
          showError('O serviço de contato não reconheceu o endereço do site. Tente novamente pela página publicada ou escreva diretamente para nayjoplin96@gmail.com.');
        } else if (serverMessage) {
          showError('O serviço de envio informou: ' + serverMessage + ' Você também pode escrever para nayjoplin96@gmail.com.');
        } else {
          showError('O serviço não confirmou o envio. Tente novamente ou escreva para nayjoplin96@gmail.com.');
        }
        return;
      }

      form.reset();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } catch (_error) {
      showError('Não foi possível conectar ao serviço de mensagens. Verifique sua conexão e tente novamente. Se preferir, envie diretamente para nayjoplin96@gmail.com.');
    } finally {
      button.disabled = false;
      button.textContent = normalLabel;
    }
  });
})();

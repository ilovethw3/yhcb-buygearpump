(function () {
  const params = new URLSearchParams(window.location.search);
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid'].forEach(function (key) {
    const field = form && form.elements[key];
    if (field) field.value = params.get(key) || '';
  });

  document.querySelectorAll('[data-event]').forEach(function (element) {
    element.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: element.dataset.event });
    });
  });

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'test_form_submit' });
      status.textContent = 'Test mode: the form interaction worked, but no message was sent.';
    });
  }
})();

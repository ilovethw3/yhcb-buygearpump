(function () {
  const params = new URLSearchParams(window.location.search);
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');
  const selectedModel = form && form.elements.selected_model;
  const selectedConfiguration = form && form.elements.selected_configuration;
  const formSelectedModel = document.querySelector('#form-selected-model');
  const selectedNote = document.querySelector('#selected-note');
  const mobileSelected = document.querySelector('#mobile-selected');
  const configImage = document.querySelector('#config-image');
  const configImageLabel = document.querySelector('#config-image-label');
  const configImageCaption = document.querySelector('#config-image-caption');
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('.carousel-dot'));
  const heroSlideLabel = document.querySelector('#hero-slide-label');
  const videoShell = document.querySelector('.video-shell');
  const operationVideo = document.querySelector('.video-shell video');
  let heroIndex = 0;
  let heroTimer;

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid'].forEach(function (key) {
    const field = form && form.elements[key];
    if (field) field.value = params.get(key) || '';
  });

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });
    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
      dot.setAttribute('aria-selected', dotIndex === heroIndex ? 'true' : 'false');
    });
    if (heroSlideLabel) heroSlideLabel.textContent = heroSlides[heroIndex].dataset.slideLabel;
  }

  function restartHeroTimer() {
    window.clearInterval(heroTimer);
    if (heroSlides.length > 1) heroTimer = window.setInterval(function () { showHeroSlide(heroIndex + 1); }, 4800);
  }

  document.querySelector('[data-carousel-prev]')?.addEventListener('click', function () { showHeroSlide(heroIndex - 1); restartHeroTimer(); });
  document.querySelector('[data-carousel-next]')?.addEventListener('click', function () { showHeroSlide(heroIndex + 1); restartHeroTimer(); });
  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () { showHeroSlide(Number(dot.dataset.carouselDot)); restartHeroTimer(); });
  });
  restartHeroTimer();

  function matchVideoRatio() {
    if (videoShell && operationVideo && operationVideo.videoWidth && operationVideo.videoHeight) {
      videoShell.style.aspectRatio = operationVideo.videoWidth + ' / ' + operationVideo.videoHeight;
    }
  }

  if (operationVideo) {
    operationVideo.addEventListener('loadedmetadata', matchVideoRatio);
    matchVideoRatio();
  }

  document.querySelectorAll('.variant-option').forEach(function (option) {
    option.addEventListener('click', function () {
      document.querySelectorAll('.variant-option').forEach(function (item) {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      option.classList.add('is-selected');
      option.setAttribute('aria-pressed', 'true');
      if (selectedModel) selectedModel.value = option.dataset.variantId;
      if (selectedConfiguration) selectedConfiguration.value = option.dataset.variantLabel;
      if (formSelectedModel) formSelectedModel.textContent = option.dataset.variantLabel;
      if (selectedNote) selectedNote.textContent = option.dataset.variantNote;
      if (mobileSelected) mobileSelected.textContent = option.querySelector('.variant-size').textContent + ' selected';
      if (configImage) {
        configImage.classList.add('is-switching');
        window.setTimeout(function () {
          configImage.src = option.dataset.variantImage;
          configImage.alt = option.dataset.variantAlt;
          configImage.classList.remove('is-switching');
        }, 120);
      }
      if (configImageLabel) configImageLabel.textContent = option.dataset.variantType;
      if (configImageCaption) configImageCaption.textContent = option.dataset.variantLabel;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'configuration_select', selected_model: option.dataset.variantId });
    });
  });

  document.querySelectorAll('[data-event]').forEach(function (element) {
    element.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: element.dataset.event });
    });
  });

  if (form) {
    form.addEventListener('focusin', function () {
      if (!form.dataset.started) {
        form.dataset.started = 'true';
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'form_start' });
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.dataset.formMode === 'test') {
        if (status) status.textContent = 'Test mode: no message was sent.';
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
      }
      if (status) status.textContent = 'Sending your inquiry…';

      fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Formspree submission failed');
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'Lead', {
              content_name: 'YHCB Mobile Pump',
              content_category: 'quote'
            });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'lead_submit',
            selected_model: selectedModel && selectedModel.value,
            selected_configuration: selectedConfiguration && selectedConfiguration.value
          });
          if (status) status.textContent = 'Thanks — your inquiry has been sent.';
        })
        .catch(function () {
          if (status) status.textContent = 'We couldn’t send your inquiry. Please try again or contact us directly.';
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
          }
        });
    });
  }
})();

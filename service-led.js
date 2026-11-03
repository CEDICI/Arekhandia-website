(() => {
  'use strict';
  const serviceNames = {
    'brand-identity': 'Brand Identity',
    'digital-experiences': 'Digital Experiences',
    'creative-direction': 'Creative Direction',
    'brand-transformation': 'Brand Transformation'
  };
  const form = document.getElementById('contactForm');
  if (!form) return;
  const requestedService = new URLSearchParams(location.search).get('service');
  const topic = form.querySelector('[name="topic"]');
  if (topic && Object.hasOwn(serviceNames, requestedService)) topic.value = serviceNames[requestedService];
  const fieldError = (field) => {
    if (!field.name || field.type === 'hidden' || field.name.startsWith('_')) return;
    const errorId = field.id + '-error';
    let error = document.getElementById(errorId);
    if (field.validity.valid) {
      field.removeAttribute('aria-invalid');
      if (error) error.remove();
      if (field.getAttribute('aria-describedby') === errorId) field.removeAttribute('aria-describedby');
      return;
    }
    if (!error) {
      error = document.createElement('p');
      error.id = errorId;
      error.className = 'field-error';
      field.after(error);
    }
    error.textContent = field.validity.valueMissing ? 'Bitte fülle dieses Feld aus.' : field.validity.typeMismatch ? 'Bitte gib eine gültige E-Mail-Adresse ein.' : 'Bitte prüfe deine Eingabe.';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  };
  form.addEventListener('invalid', event => fieldError(event.target), true);
  form.addEventListener('input', event => {
    if (event.target.hasAttribute('aria-invalid')) fieldError(event.target);
  });
})();

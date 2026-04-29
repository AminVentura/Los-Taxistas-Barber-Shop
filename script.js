(function () {
  'use strict';

  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  var header = document.querySelector('.header');

  if (menuToggle && nav && header) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      header.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      menuToggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        header.classList.remove('open');
      });
    });
  }

  // Language toggle (ES / EN)
  var langToggle = document.getElementById('lang-toggle');
  var htmlRoot = document.documentElement;
  var langLabel = document.querySelector('.lang-toggle-text');
  var STORAGE_KEY = 'lostaxistas-lang';

  function updateFloatLabels(lang) {
    var callText = document.querySelector('.float-call-text');
    var waText = document.querySelector('.float-whatsapp-text');
    if (callText) {
      callText.textContent = lang === 'en'
        ? (callText.getAttribute('data-float-en') || 'Call')
        : (callText.getAttribute('data-float-es') || 'Llamar');
    }
    if (waText) {
      waText.textContent = lang === 'en'
        ? (waText.getAttribute('data-float-en') || 'Book Now')
        : (waText.getAttribute('data-float-es') || 'Reservar');
    }
  }

  function setLang(lang) {
    if (lang === 'en') {
      document.body.classList.add('lang-en');
      htmlRoot.lang = 'en';
      if (langLabel) {
        langLabel.textContent = langLabel.getAttribute('data-en') || 'ES';
      }
    } else {
      document.body.classList.remove('lang-en');
      htmlRoot.lang = 'es';
      if (langLabel) {
        langLabel.textContent = langLabel.getAttribute('data-es') || 'EN';
      }
    }
    updateFloatLabels(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  if (langToggle) {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === 'en') setLang('en');
    else setLang('es');

    langToggle.addEventListener('click', function () {
      var isEn = document.body.classList.contains('lang-en');
      setLang(isEn ? 'es' : 'en');
    });
  }

  // Book form: build WhatsApp message and open
  function handleBookForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var service = (form.querySelector('[name="service"]') && form.querySelector('[name="service"]').value) || '';
      var staff = (form.querySelector('[name="staff"]') && form.querySelector('[name="staff"]').value) || '';
      var date = (form.querySelector('[name="date"]') && form.querySelector('[name="date"]').value) || '';
      var time = (form.querySelector('[name="time"]') && form.querySelector('[name="time"]').value) || '';
      var timeAltEl = form.querySelector('[name="time_alt"]');
      var timeAlt = (timeAltEl && timeAltEl.value) ? timeAltEl.value.trim() : '';
      var name = (form.querySelector('[name="name"]') && form.querySelector('[name="name"]').value) || '';
      var phone = (form.querySelector('[name="phone"]') && form.querySelector('[name="phone"]').value) || '';
      var notes = (form.querySelector('[name="notes"]') && form.querySelector('[name="notes"]').value) || '';
      var parts = [];
      if (name) parts.push('Nombre / Name: ' + name);
      if (phone) parts.push('Tel: ' + phone);
      if (service) parts.push('Servicio / Service: ' + service);
      if (staff) parts.push('Barbero preferido / Preferred: ' + staff);
      if (date) parts.push('Fecha / Date: ' + date);
      if (time) parts.push('Hora / Time: ' + time);
      if (timeAlt) parts.push('Hora alternativa / Alternative time: ' + timeAlt);
      if (notes) parts.push('Notas: ' + notes);
      var msg = 'Hola, quiero reservar una cita en Los Taxistas Barber Shop.\n\n' + parts.join('\n');
      window.open('https://wa.me/12129420519?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
  handleBookForm('book-form-es');
  handleBookForm('book-form-en');

  // Individual barber cards: show/hide form + WhatsApp booking
  document.querySelectorAll('.toggle-barber-form').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.barber-card');
      if (!card) return;
      var wrap = card.querySelector('.barber-form-wrap');
      if (!wrap) return;
      var isHidden = wrap.hasAttribute('hidden');
      if (isHidden) wrap.removeAttribute('hidden');
      else wrap.setAttribute('hidden', '');
      card.querySelectorAll('.toggle-barber-form').forEach(function (control) {
        if (control.classList.contains('btn')) {
          control.textContent = isHidden ? 'Ocultar formulario' : 'Reservar Cita';
          control.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        }
      });
    });
  });

  var SHOP_WA = '12129420519';

  document.querySelectorAll('.barber-book-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var staff = form.getAttribute('data-staff') || 'Barbero';
      var phone = form.getAttribute('data-phone') || SHOP_WA;
      var route = form.getAttribute('data-wa-route');
      var toShop = route === 'shop' || (route !== 'direct' && phone === SHOP_WA);
      var service = (form.querySelector('[name="service"]') || {}).value || '';
      var date = (form.querySelector('[name="date"]') || {}).value || '';
      var time = (form.querySelector('[name="time"]') || {}).value || '';
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var description = (form.querySelector('[name="description"]') || {}).value || '';
      var body =
        'Tipo de servicio: ' + service + '\n' +
        'Fecha: ' + date + '\n' +
        'Hora preferida: ' + time + '\n' +
        'Nombre del cliente: ' + name + '\n' +
        'Descripcion: ' + description;
      var msg = toShop
        ? 'Hola Los Taxistas Barber Shop — quiero reservar cita con ' + staff + '.\n\n' + body
        : 'Hola ' + staff + ', quiero reservar cita.\n\n' + body;
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  });

  // Booksy: un solo enlace para actualizar (cambia data-booksy-url o el href del primer enlace)
  var booksyCard = document.getElementById('booking-booksy-link');
  var booksyBtn = document.getElementById('btn-booksy');
  if (booksyCard && booksyBtn) {
    var url = booksyCard.getAttribute('data-booksy-url') || booksyCard.getAttribute('href');
    if (url && url !== '#') {
      booksyCard.setAttribute('href', url);
      booksyBtn.setAttribute('href', url);
    }
  }
})();

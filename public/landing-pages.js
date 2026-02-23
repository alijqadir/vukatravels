(function () {
  var page = document.querySelector('.page');
  if (!page) {
    return;
  }

  var quoteFrom = page.getAttribute('data-quote-from') || '';
  var quoteTo = page.getAttribute('data-quote-to') || '';
  var quoteDestination = page.getAttribute('data-destination') || quoteTo;

  var airlineRules = [
    { pattern: /emirates/i, code: 'EK', name: 'Emirates', logo: '/airline-logos/emirates.svg' },
    { pattern: /british airways/i, code: 'BA', name: 'British Airways', logo: '/airline-logos/britishairways.svg' },
    { pattern: /etihad/i, code: 'EY', name: 'Etihad Airways', logo: '/airline-logos/etihadairways.svg' },
    { pattern: /qatar/i, code: 'QR', name: 'Qatar Airways', logo: '/airline-logos/qatarairways.svg' },
    { pattern: /pegasus/i, code: 'PC', name: 'Pegasus Airlines', logo: '/airline-logos/pegasusairlines.svg' },
    { pattern: /kenya airways/i, code: 'KQ', name: 'Kenya Airways', logo: '/airline-logos/kenyaairways.svg' },
    { pattern: /ethiopian/i, code: 'ET', name: 'Ethiopian Airlines', logo: '/airline-logos/ethiopianairlines.svg' },
    { pattern: /turkish/i, code: 'TK', name: 'Turkish Airlines', logo: '/airline-logos/turkishairlines.svg' },
    { pattern: /honeymoon|holiday|zanzibar|escape|package|safari/i, code: 'HG', name: 'Holiday Package', logo: '/favicon.jpeg' },
  ];

  var template = [
    '<div class="fare-modal" id="fare-modal" aria-hidden="true">',
    '  <div class="fare-modal__backdrop" data-close-modal></div>',
    '  <div class="fare-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="fare-modal-title">',
    '    <div class="fare-modal__hero">',
    '      <div class="fare-modal__head">',
    '        <span class="fare-modal__kicker">Fast Fare Request</span>',
    '        <h2 class="fare-modal__title" id="fare-modal-title">Hold This Ticket</h2>',
    '        <p class="fare-modal__subtitle">Complete this short form and our VUKA team will confirm live availability, baggage, and fare rules.</p>',
    '      </div>',
    '      <button type="button" class="fare-modal__close" aria-label="Close" data-close-modal>&times;</button>',
    '    </div>',
    '    <div class="fare-modal__content">',
    '      <aside class="fare-picked">',
    '        <p class="fare-picked__label">Your selected option</p>',
    '        <p class="fare-picked__name" data-picked-name>Selected fare</p>',
    '        <p class="fare-picked__meta" data-picked-meta></p>',
    '        <ul class="fare-picked__list">',
    '          <li>Checked against current seat inventory</li>',
    '          <li>Baggage and conditions confirmed before payment</li>',
    '          <li>Support from a UK-based VUKA consultant</li>',
    '        </ul>',
    '      </aside>',
    '      <form class="fare-form" id="fare-quote-form">',
    '        <div class="fare-form__row">',
    '          <label>Full name<input type="text" name="name" required autocomplete="name" placeholder="Your full name" /></label>',
    '          <label>Email<input type="email" name="email" required autocomplete="email" placeholder="you@email.com" /></label>',
    '        </div>',
    '        <div class="fare-form__row">',
    '          <label>Phone<input type="tel" name="phone" required autocomplete="tel" placeholder="+44" /></label>',
    '          <label>Passengers<input type="number" name="passengers" min="1" value="1" /></label>',
    '        </div>',
    '        <div class="fare-form__row">',
    '          <label>Departure date<input type="date" name="departure_date" /></label>',
    '          <label>Return date<input type="date" name="return_date" /></label>',
    '        </div>',
    '        <div class="fare-form__row">',
    '          <label>Cabin<select name="cabin_class"><option value="Economy">Economy</option><option value="Premium Economy">Premium Economy</option><option value="Business">Business</option></select></label>',
    '          <label>Trip type<select name="trip_type"><option value="Return">Return</option><option value="One Way">One Way</option><option value="Multi City">Multi City</option></select></label>',
    '        </div>',
    '        <label>Extra details<textarea name="message" placeholder="Add date flexibility, baggage needs, or traveller details"></textarea></label>',
    '        <input type="text" name="website" value="" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;opacity:0;" />',
    '        <div class="fare-form__status" id="fare-form-status"></div>',
    '        <button class="btn btn--primary" type="submit">Send Fare Request</button>',
    '      </form>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join('');

  document.body.insertAdjacentHTML('beforeend', template);

  var modal = document.getElementById('fare-modal');
  var form = document.getElementById('fare-quote-form');
  var pickedNameEl = modal.querySelector('[data-picked-name]');
  var pickedMetaEl = modal.querySelector('[data-picked-meta]');
  var statusEl = document.getElementById('fare-form-status');

  var selectedFare = {
    name: 'General fare enquiry',
    price: '',
    tag: '',
    details: 'Please send live fare options.',
  };

  function getSupportPhoneFromPage() {
    var phoneLink = document.querySelector('.topbar a[href^="tel:"]') || document.querySelector('a[href^="tel:"]');
    if (!phoneLink) {
      return '+442038768217';
    }

    var rawHref = (phoneLink.getAttribute('href') || '').replace(/^tel:/i, '');
    var normalizedPhone = rawHref.replace(/[^\d+]/g, '');
    return normalizedPhone || '+442038768217';
  }

  var supportPhoneHref = getSupportPhoneFromPage();
  var supportWhatsappNumber = supportPhoneHref.replace(/[^\d]/g, '') || '442038768217';

  function cleanText(value) {
    return (value || '').toString().replace(/\s+/g, ' ').trim();
  }

  function lockBody(isLocked) {
    document.body.style.overflow = isLocked ? 'hidden' : '';
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'fare-form__status is-visible';
    if (type === 'error') {
      statusEl.classList.add('is-error');
    }
    if (type === 'success') {
      statusEl.classList.add('is-success');
    }
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.textContent = '';
    statusEl.className = 'fare-form__status';
  }

  function textContent(node, selector) {
    var el = node.querySelector(selector);
    return el ? cleanText(el.textContent) : '';
  }

  function inferAirlineInfo(title) {
    var rule = null;
    for (var i = 0; i < airlineRules.length; i += 1) {
      if (airlineRules[i].pattern.test(title)) {
        rule = airlineRules[i];
        break;
      }
    }

    if (rule) {
      return rule;
    }

    var initials = cleanText(title)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) { return part[0] ? part[0].toUpperCase() : ''; })
      .join('');

    return {
      code: initials || 'VF',
      name: cleanText(title).split(' ').slice(0, 2).join(' ') || 'VUKA Fare',
      logo: '/favicon.jpeg',
    };
  }

  function parseLineParts(lineText) {
    var line = cleanText(lineText);
    if (!line) {
      return {
        route: '',
        date: '',
        stops: '',
      };
    }

    var routePart = line;
    var colonIndex = line.indexOf(':');
    if (colonIndex >= 0) {
      routePart = cleanText(line.slice(colonIndex + 1));
    }

    var segments = routePart.split('|').map(cleanText).filter(Boolean);
    var route = segments[0] || '';
    var date = segments[1] || '';
    var stops = segments[2] || '';

    if (segments.length > 3 && !stops) {
      stops = segments[3];
    }

    if (!stops) {
      if (/\bvia\b/i.test(routePart)) {
        stops = '1 Stop';
      } else if (/\bdirect\b/i.test(routePart)) {
        stops = 'Direct';
      }
    }

    route = route.replace(/\s+to\s+/i, ' -> ');

    return {
      route: route,
      date: date,
      stops: stops,
    };
  }

  function createMetaItem(className, value) {
    var item = document.createElement('span');
    item.className = 'ticket-meta__item ' + className;
    item.textContent = value;
    return item;
  }

  function buildWhatsappHref(fare) {
    var messageParts = [
      'Hi VUKA Travels, I want this fare.',
      fare && fare.name ? 'Option: ' + fare.name : '',
      fare && fare.price ? 'Price: ' + fare.price : '',
      fare && fare.details ? 'Details: ' + fare.details : '',
      'Please share live availability.',
    ];

    var message = messageParts.filter(Boolean).join(' | ');
    return 'https://wa.me/' + supportWhatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function decorateFareItem(item) {
    if (!item || item.getAttribute('data-ticket-enhanced') === '1') {
      return;
    }

    var details = item.querySelector('.fare-details');
    var titleEl = details ? details.querySelector('.fare-title') : null;
    if (!details || !titleEl) {
      return;
    }

    var title = cleanText(titleEl.textContent);
    var airlineInfo = inferAirlineInfo(title);
    var firstLine = textContent(details, '.fare-line');
    var parsed = parseLineParts(firstLine);
    var tag = textContent(details, '.fare-tag') || 'Fare rules apply';

    var airlineWrap = document.createElement('div');
    airlineWrap.className = 'ticket-airline';

    var logo = document.createElement('span');
    logo.className = 'ticket-logo';
    logo.setAttribute('data-airline', airlineInfo.code);

    var logoImg = document.createElement('img');
    logoImg.className = 'ticket-logo__img';
    logoImg.alt = airlineInfo.name + ' logo';

    var logoFallback = document.createElement('span');
    logoFallback.className = 'ticket-logo__fallback';
    logoFallback.textContent = airlineInfo.code;

    logo.appendChild(logoImg);
    logo.appendChild(logoFallback);

    if (airlineInfo.logo) {
      logoImg.addEventListener('load', function () {
        logo.classList.add('ticket-logo--loaded');
      });
      logoImg.addEventListener('error', function () {
        logo.classList.remove('ticket-logo--loaded');
      });
      logoImg.src = airlineInfo.logo;
    }

    var airlineText = document.createElement('div');
    airlineText.className = 'ticket-airline__text';

    var airlineName = document.createElement('span');
    airlineName.className = 'ticket-airline__name';
    airlineName.textContent = airlineInfo.name;

    var airlineRoute = document.createElement('span');
    airlineRoute.className = 'ticket-airline__route';
    airlineRoute.textContent = parsed.route || (quoteFrom + ' -> ' + quoteTo);

    airlineText.appendChild(airlineName);
    airlineText.appendChild(airlineRoute);
    airlineWrap.appendChild(logo);
    airlineWrap.appendChild(airlineText);

    details.insertBefore(airlineWrap, titleEl);

    var linesWrap = details.querySelector('.fare-lines');
    var metaWrap = document.createElement('div');
    metaWrap.className = 'ticket-meta';
    metaWrap.appendChild(createMetaItem('ticket-meta__item--route', parsed.route || 'Route details'));
    metaWrap.appendChild(createMetaItem('ticket-meta__item--date', parsed.date || 'Flexible dates'));
    metaWrap.appendChild(createMetaItem('ticket-meta__item--stops', parsed.stops || 'Journey info'));
    metaWrap.appendChild(createMetaItem('ticket-meta__item--baggage', tag));

    if (linesWrap) {
      details.insertBefore(metaWrap, linesWrap);
    } else {
      details.appendChild(metaWrap);
    }

    var selectBtn = item.querySelector('.select-fare-btn');
    if (selectBtn && !item.querySelector('.fare-actions')) {
      var actionsWrap = document.createElement('div');
      actionsWrap.className = 'fare-actions';

      var utilityWrap = document.createElement('div');
      utilityWrap.className = 'fare-actions__utility';

      var fareData = collectFareFromRow(selectBtn);

      var whatsappLink = document.createElement('a');
      whatsappLink.className = 'fare-quick fare-quick--wa';
      whatsappLink.href = buildWhatsappHref(fareData);
      whatsappLink.target = '_blank';
      whatsappLink.rel = 'noopener noreferrer';
      whatsappLink.textContent = 'WhatsApp';

      var callLink = document.createElement('a');
      callLink.className = 'fare-quick fare-quick--call';
      callLink.href = 'tel:' + supportPhoneHref;
      callLink.textContent = 'Call';

      utilityWrap.appendChild(whatsappLink);
      utilityWrap.appendChild(callLink);

      selectBtn.textContent = 'Book Now';
      selectBtn.classList.add('fare-select-btn');
      item.insertBefore(actionsWrap, selectBtn);
      actionsWrap.appendChild(utilityWrap);
      actionsWrap.appendChild(selectBtn);
    }

    item.setAttribute('data-ticket-enhanced', '1');
  }

  function collectFareFromRow(button) {
    var item = button.closest('.fare-item');
    if (!item) {
      return {
        name: 'General fare enquiry',
        price: '',
        tag: '',
        details: 'Please send live fare options.',
      };
    }

    var lines = Array.prototype.slice.call(item.querySelectorAll('.fare-line'))
      .map(function (line) {
        return cleanText(line.textContent);
      })
      .filter(Boolean)
      .join(' | ');

    var airlineName = textContent(item, '.ticket-airline__name');
    var route = textContent(item, '.ticket-airline__route');

    var detailParts = [];
    if (airlineName) detailParts.push(airlineName);
    if (route) detailParts.push(route);
    if (lines) detailParts.push(lines);

    return {
      name: textContent(item, '.fare-title') || 'Selected fare',
      price: textContent(item, '.fare-price strong'),
      tag: textContent(item, '.fare-tag'),
      details: detailParts.join(' | '),
    };
  }

  function openModal(fare) {
    selectedFare = fare;
    pickedNameEl.textContent = fare.name || 'Selected fare';

    var metaParts = [];
    if (fare.price) {
      metaParts.push('Price: ' + fare.price);
    }
    if (fare.tag) {
      metaParts.push('Type: ' + fare.tag);
    }
    if (fare.details) {
      metaParts.push(fare.details);
    }
    pickedMetaEl.textContent = metaParts.join(' | ');

    clearStatus();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockBody(true);

    var nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      nameInput.focus();
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockBody(false);
  }

  Array.prototype.slice.call(document.querySelectorAll('.fare-item')).forEach(function (item) {
    decorateFareItem(item);
  });

  Array.prototype.slice.call(document.querySelectorAll('.select-fare-btn')).forEach(function (button) {
    button.textContent = 'Book Now';
    button.addEventListener('click', function (event) {
      event.preventDefault();
      openModal(collectFareFromRow(button));
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.open-quote-form')).forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      var context = button.getAttribute('data-quote-context') || 'General route enquiry';
      openModal({
        name: context,
        price: '',
        tag: 'Live Quote',
        details: 'Please send the best current options for this route.',
      });
    });
  });

  Array.prototype.slice.call(modal.querySelectorAll('[data-close-modal]')).forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearStatus();

    var formData = new FormData(form);
    var payload = {
      formType: 'landing_fare_quote',
      name: cleanText(formData.get('name')),
      email: cleanText(formData.get('email')),
      phone: cleanText(formData.get('phone')),
      message: cleanText(formData.get('message')),
      destination: quoteDestination,
      from: quoteFrom,
      to: quoteTo,
      departureDate: cleanText(formData.get('departure_date')),
      returnDate: cleanText(formData.get('return_date')),
      passengers: cleanText(formData.get('passengers')),
      cabinClass: cleanText(formData.get('cabin_class')),
      tripType: cleanText(formData.get('trip_type')) || 'Return',
      pageUrl: window.location.href,
      selectedFareName: selectedFare.name,
      selectedFarePrice: selectedFare.price,
      selectedFareTag: selectedFare.tag,
      selectedFareDetails: selectedFare.details,
      selectedFareCurrency: 'GBP',
      website: cleanText(formData.get('website')),
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setStatus('Please complete name, email, and phone.', 'error');
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    fetch('/api/submit.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.text().then(function (text) {
          var data = null;
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              data = null;
            }
          }

          if (!res.ok) {
            var message = data && data.error ? data.error : 'Could not send request right now. Please try again.';
            throw new Error(message);
          }

          return data;
        });
      })
      .then(function () {
        setStatus('Thanks. Your fare request has been sent. Our team will contact you shortly.', 'success');
        form.reset();
      })
      .catch(function (error) {
        var errMessage = (error && error.message) ? error.message : 'Could not send request right now. Please try again.';
        setStatus(errMessage, 'error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Fare Request';
        }
      });
  });
})();

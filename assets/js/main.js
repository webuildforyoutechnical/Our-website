// Main JavaScript for WE BUILD FOR YOU TECHNICAL SERVICES L.L.C

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle with Icon Animation & Auto-Close
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    const icon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        if (icon) {
          icon.classList.remove('fa-bars-staggered');
          icon.classList.add('fa-xmark');
        }
      } else {
        mobileMenu.classList.add('hidden');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Auto-close menu when clicking any link inside
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      }
    });

    // Auto-close on resize to desktop (lg: 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      }
    });
  }

  // 2. Sticky Navbar Glass Effect on Scroll
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('bg-dark-950/98', 'shadow-xl', 'border-dark-700');
        navbar.classList.remove('bg-dark-900/95');
      } else {
        navbar.classList.remove('bg-dark-950/98', 'shadow-xl', 'border-dark-700');
        navbar.classList.add('bg-dark-900/95');
      }
    }, { passive: true });
  }

  // 3. Instant Cost Estimator (Dubai Technical Services)
  const serviceSelect = document.getElementById('calcService');
  const propertyType = document.getElementById('calcProperty');
  const unitSize = document.getElementById('calcSize');
  const sizeValueDisplay = document.getElementById('calcSizeValue');
  const estimateResult = document.getElementById('estimateResult');
  const sendEstimateBtn = document.getElementById('sendEstimateWhatsapp');

  function calculateEstimate() {
    if (!serviceSelect || !propertyType || !unitSize || !estimateResult) return;

    const size = parseInt(unitSize.value, 10);
    if (sizeValueDisplay) {
      sizeValueDisplay.textContent = `${size.toLocaleString()} Sq. Ft.`;
    }

    const baseRates = {
      'ac': { apt: 250, villa: 450, commercial: 650, ratePerSqFt: 0.15 },
      'mep': { apt: 300, villa: 550, commercial: 800, ratePerSqFt: 0.20 },
      'plumbing': { apt: 200, villa: 380, commercial: 550, ratePerSqFt: 0.12 },
      'tiling': { apt: 600, villa: 1200, commercial: 1800, ratePerSqFt: 1.10 },
      'painting': { apt: 450, villa: 900, commercial: 1400, ratePerSqFt: 0.75 },
      'carpentry': { apt: 350, villa: 700, commercial: 1100, ratePerSqFt: 0.60 },
      'wallpaper': { apt: 300, villa: 600, commercial: 900, ratePerSqFt: 0.50 },
      'false-ceiling': { apt: 500, villa: 1000, commercial: 1600, ratePerSqFt: 0.95 },
      'cleaning': { apt: 180, villa: 350, commercial: 500, ratePerSqFt: 0.10 }
    };

    const selectedService = serviceSelect.value || 'ac';
    const selectedProp = propertyType.value || 'villa';
    const rateData = baseRates[selectedService] || baseRates['ac'];

    let base = rateData[selectedProp] || 450;
    let estimatedTotal = Math.round(base + (size * rateData.ratePerSqFt));
    
    let minRange = Math.round(estimatedTotal * 0.9);
    let maxRange = Math.round(estimatedTotal * 1.15);

    estimateResult.textContent = `AED ${minRange.toLocaleString()} - ${maxRange.toLocaleString()}`;

    if (sendEstimateBtn) {
      const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
      const propName = propertyType.options[propertyType.selectedIndex].text;
      const msg = encodeURIComponent(
        `Hello We Build For You Technical Services LLC!\nI calculated an estimate on your website:\n- Service: ${serviceName}\n- Property: ${propName}\n- Approximate Area: ${size.toLocaleString()} Sq. Ft.\n- Estimated Range: AED ${minRange.toLocaleString()} - AED ${maxRange.toLocaleString()}\nPlease schedule a free on-site survey.`
      );
      sendEstimateBtn.href = `https://wa.me/971522765742?text=${msg}`;
    }
  }

  if (serviceSelect && propertyType && unitSize) {
    serviceSelect.addEventListener('change', calculateEstimate);
    propertyType.addEventListener('change', calculateEstimate);
    unitSize.addEventListener('input', calculateEstimate);
    calculateEstimate(); // initial call
  }

  // 4. Project Filters (Projects page)
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950');
        b.classList.add('bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950');
      btn.classList.remove('bg-slate-900', 'text-slate-300');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Contact Form Pre-Selection & Submission
  const contactForm = document.getElementById('technicalContactForm');
  const serviceDropdown = document.getElementById('clientService');
  
  // Pre-select service from URL parameter (e.g. ?service=ac)
  if (serviceDropdown) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const serviceMapping = {
        'ac': 'AC & Ventilation Maintenance',
        'mep': 'Electromechanical MEP',
        'plumbing': 'Plumbing & Sanitary',
        'tiling': 'Floor & Wall Tiling',
        'painting': 'Painting Contracting',
        'carpentry': 'Carpentry & Wood Flooring',
        'wallpaper': 'Wallpaper Fixing',
        'false-ceiling': 'False Ceiling & Partitions',
        'ceiling': 'False Ceiling & Partitions',
        'plaster': 'Plaster Works',
        'cleaning': 'Building Cleaning Services',
        'fitout': 'Turnkey Full Fit-Out'
      };
      const targetVal = serviceMapping[serviceParam.toLowerCase()];
      if (targetVal) {
        serviceDropdown.value = targetVal;
      }
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Client';
      const phone = document.getElementById('clientPhone')?.value || '';
      const email = document.getElementById('clientEmail')?.value || '';
      const service = document.getElementById('clientService')?.value || 'Technical Services';
      const location = document.getElementById('clientLocation')?.value || 'Dubai';
      const message = document.getElementById('clientMessage')?.value || '';

      const waText = encodeURIComponent(
        `*New Technical Survey Request - We Build For You LLC*\n\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Phone / WhatsApp:* ${phone}\n` +
        `✉️ *Email:* ${email}\n` +
        `🛠️ *Service Required:* ${service}\n` +
        `📍 *Location in Dubai:* ${location}\n` +
        `📝 *Requirement Notes:* ${message}\n\n` +
        `Please confirm survey schedule.`
      );

      window.open(`https://wa.me/971522765742?text=${waText}`, '_blank');
      
      const formAlert = document.getElementById('formSuccessAlert');
      if (formAlert) {
        formAlert.classList.remove('hidden');
        contactForm.reset();
      }
    });
  }

  // 6. Accordion for FAQs
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      
      const isOpen = !content.classList.contains('hidden');
      
      // Close all
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.accordion-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 7. Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(r => observer.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('visible'));
  }
});

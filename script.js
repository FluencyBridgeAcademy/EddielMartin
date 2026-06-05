// Google Apps Script Deployment URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxcyx25jz5bF6jDGQ4yTU2WJfzbsGHzNRgaiT64DsbXAK5tPv0rOEebQ66ZXCsLr02V/exec";

// ========== CONTACT FORM HANDLER ==========
async function handleContactSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('form-submit-btn');
  const originalText = submitBtn.innerHTML;
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Enviando...</span>';
  
  const formData = {
    nombre: document.getElementById('contact-name').value.trim(),
    correo: document.getElementById('contact-email').value.trim(),
    servicio: document.getElementById('contact-service').value,
    mensaje: document.getElementById('contact-message').value.trim()
  };
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      mode: 'no-cors'
    });
    
    // Show success message
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('contact-success-toast').classList.remove('hidden');
    document.getElementById('success-username').textContent = formData.nombre;
    
    // Reset form after 3 seconds
    setTimeout(() => {
      resetContactForm();
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ========== BOOKING FORM HANDLER ==========
async function handleBookingSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Agendando...</span>';
  
  const formData = {
    name: document.getElementById('book-name').value.trim(),
    phone: document.getElementById('book-phone').value.trim(),
    service: document.getElementById('book-service').value,
    date: document.getElementById('book-date').value,
    time: document.getElementById('book-time').value
  };
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(formData),
      mode: 'no-cors'
    });
    
    // Show success message
    document.getElementById('booking-form').style.display = 'none';
    document.getElementById('booking-success-container').classList.remove('hidden');
    document.getElementById('booking-user').textContent = formData.name;
    document.getElementById('booking-date-text').textContent = formData.date;
    document.getElementById('booking-time-text').textContent = formData.time;
    
    // Close modal after 3 seconds
    setTimeout(() => {
      closeBookingModal();
    }, 3000);
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al agendar la clase. Por favor, intenta de nuevo.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ========== MODAL FUNCTIONS ==========
function openBookingModal() {
  document.getElementById('booking-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.add('hidden');
  document.body.style.overflow = 'auto';
  resetBookingForm();
}

function openBookingModalWithService(service) {
  document.getElementById('book-service').value = service;
  openBookingModal();
}

// ========== FORM RESET FUNCTIONS ==========
function resetContactForm() {
  document.getElementById('contact-form').style.display = 'block';
  document.getElementById('contact-success-toast').classList.add('hidden');
  document.getElementById('contact-form').reset();
}

function resetBookingForm() {
  document.getElementById('booking-form').style.display = 'block';
  document.getElementById('booking-success-container').classList.add('hidden');
  document.getElementById('booking-form').reset();
}

// ========== MOBILE MENU FUNCTIONS ==========
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  
  menu.classList.toggle('hidden');
  hamburgerIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
  });
});

// ========== CONTACT DETAIL COPY FUNCTIONS ==========
function copyContactDetail(text, tooltipId) {
  navigator.clipboard.writeText(text).then(() => {
    const tooltip = document.getElementById(tooltipId);
    tooltip.classList.remove('opacity-0');
    
    setTimeout(() => {
      tooltip.classList.add('opacity-0');
    }, 2000);
  }).catch(err => {
    console.error('Error copying:', err);
  });
}

// ========== PIANO CHORD SOUND FUNCTION ==========
function playPianoChord() {
  // Simple piano chord using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [261.63, 329.63, 392.00]; // C, E, G (C Major chord)
  
  notes.forEach((frequency, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }, index * 100);
  });
}

// ========== LANGUAGE TRANSLATION FUNCTION ==========
function translatePage(language) {
  if (language === 'en') {
    // Trigger Google Translate
    const element = document.querySelector('html');
    if (window.google && window.google.translate) {
      const googleTranslateElement = document.getElementById('google_translate_element');
      const translateSelect = document.querySelector('.goog-te-combo');
      if (translateSelect) {
        translateSelect.value = 'en';
        translateSelect.dispatchEvent(new Event('change'));
      }
    }
  } else {
    location.reload();
  }
}

// ========== SMOOTH SCROLL BEHAVIOR ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== CLOSE MODAL ON BACKGROUND CLICK ==========
document.addEventListener('DOMContentLoaded', function() {
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeBookingModal();
      }
    });
  }
});

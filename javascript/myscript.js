document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================
       VARIABLES
    ====================================================== */
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    const menuCheckbox = document.querySelector('.menu-toggle-checkbox');
    const backToTop = document.createElement('button');
    const dateInput = document.getElementById('date');
    const contactForm = document.getElementById('contact-form');
    const revealSelectors = `
        .service-card, .card, .value-item, .step, .feature-box, 
        .cta, details, .timeline-item, .icon-card, fieldset, .highlights li
    `;
    const revealElements = document.querySelectorAll(revealSelectors);

    /* ======================================================
       SCROLL REVEAL
    ====================================================== */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => observer.observe(el));

    /* ======================================================
       BOOKING DATE MINIMUM
    ====================================================== */
    if (dateInput) {
        const today = new Date();
        dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    }

    /* ======================================================
       PAGE LOADER
    ====================================================== */
    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
    window.onload = () => {
        loader.classList.add("fade-out");
        setTimeout(() => loader.remove(), 600);
    };

    /* ======================================================
       MOBILE NAVBAR TOGGLE
    ====================================================== */
    if (menuCheckbox) {
        menuCheckbox.addEventListener("change", () => {
            navbar.style.maxHeight = menuCheckbox.checked ? navbar.scrollHeight + "px" : null;
        });
    }

    document.querySelectorAll(".navbar a").forEach(a =>
        a.addEventListener("click", () => {
            if (menuCheckbox && menuCheckbox.checked) {
                menuCheckbox.checked = false;
                navbar.style.maxHeight = null;
            }
        })
    );

    /* ======================================================
       BACK TO TOP BUTTON
    ====================================================== */
    backToTop.id = "back-to-top";
    backToTop.textContent = "↑";
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        window.scrollY > 300 ? backToTop.classList.add("visible") : backToTop.classList.remove("visible");
    });

    backToTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    /* ======================================================
       SMOOTH SCROLL FOR ANCHORS
    ====================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* ======================================================
       FAQ ACCORDION
    ====================================================== */
    document.querySelectorAll(".faq details").forEach(item => {
        item.addEventListener("toggle", () => {
            if (item.open) {
                document.querySelectorAll(".faq details").forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    /* ======================================================
       PARALLAX HERO IMAGE
    ====================================================== */
    const heroImg = document.querySelector(".home-img img");
    if (heroImg) {
        window.addEventListener("scroll", () => {
            heroImg.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        });
    }

    /* ======================================================
       PARTICLES BACKGROUND
    ====================================================== */
    const createParticles = () => {
        const container = document.createElement("div");
        container.id = "particle-container";
        document.body.appendChild(container);
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement("span");
            particle.classList.add("particle");
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${4 + Math.random() * 6}s`;
            particle.style.opacity = Math.random();
            container.appendChild(particle);
        }
    };
    createParticles();

    /* ======================================================
       3D PARALLAX TILT WITH GSAP
    ====================================================== */
    const tiltCards = document.querySelectorAll(".service-card, .card, .value-item, .feature-box, .step, .icon-card");
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const percentX = (e.clientX - rect.left) / rect.width - 0.5;
            const percentY = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotateX: -percentY * 25,
                rotateY: percentX * 25,
                z: 30,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    });

    /* ======================================================
       CONTACT FORM VALIDATION + AJAX
    ====================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMsg = document.getElementById('form-msg');

            if (!name || !email || !message) {
                formMsg.textContent = "All fields are required.";
                formMsg.style.color = "red";
                return;
            }

            if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)) {
                formMsg.textContent = "Enter a valid email.";
                formMsg.style.color = "red";
                return;
            }

            fetch('send_email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            })
            .then(res => res.json())
            .then(data => {
                formMsg.textContent = data.status;
                formMsg.style.color = data.status === "Message sent!" ? "green" : "red";
                if (data.status === "Message sent!") contactForm.reset();
            })
            .catch(() => {
                formMsg.textContent = "An error occurred. Try again later.";
                formMsg.style.color = "red";
            });
        });
    }

});


// Scroll reveal (simple)
const revealElements = document.querySelectorAll('.reveal-bottom, .reveal-right');
const revealOnScroll = () => {
revealElements.forEach(el => {
const rect = el.getBoundingClientRect();
if (rect.top < window.innerHeight - 60) {
el.classList.add('visible');
}
});
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();


// Mobile menu auto-close
const menuToggle = document.getElementById('menu-toggle');
document.querySelectorAll('.navbar a').forEach(a => {
a.addEventListener('click', () => menuToggle.checked = false);
});

 // ===============================
// Preselect service from URL
// ===============================
const params = new URLSearchParams(window.location.search);
const serviceSelect = document.getElementById('service');
if (serviceSelect && params.has('service')) {
  serviceSelect.value = params.get('service');
}  

// Highlight styles applied by JS
function highlightField(field, isValid) {
  if (isValid) {
    field.classList.remove("invalid");
    field.classList.add("valid");
  } else {
    field.classList.remove("valid");
    field.classList.add("invalid");
  }
}

// Validation rules
function validateField(field) {
  if (field.type === "email") {
    const valid = /\S+@\S+\.\S+/.test(field.value.trim());
    highlightField(field, valid);
    return valid;
  }

  // Required fields
  if (field.hasAttribute("required")) {
    const valid = field.value.trim() !== "";
    highlightField(field, valid);
    return valid;
  }

  return true;
}

// Attach validation to all inputs
document.querySelectorAll("input, select, textarea").forEach(field => {
  field.addEventListener("input", () => validateField(field));
});

// Submit validation
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => {
    let valid = true;

    form.querySelectorAll("input, select, textarea").forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      e.preventDefault();
      alert("Please complete all required fields correctly.");
      return;
    }

    e.preventDefault();
    alert("Thank you! Your submission has been received.");
    form.reset();

    // Remove validation highlighting after reset
    form.querySelectorAll("input, select, textarea").forEach(f => {
      f.classList.remove("valid", "invalid");
    });
  });
});

/* --- Gallery Lightbox Logic --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3').innerText;
            
            if (lightbox && img) {
                lightbox.style.display = "block";
                lightboxImg.src = img.src;
                captionText.innerHTML = title;
            }
        });
    });

    // Close Lightbox
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
        });
    }

    // Close when clicking outside image
    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if(e.target !== lightboxImg) {
                lightbox.style.display = "none";
            }
        });
    }
    
    /* --- Gallery Filtering (Simple) --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
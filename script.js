
    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // Scroll reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== BOOKING MODAL =====
    let bookingData = { service: '', price: '', barber: '', date: '', time: '' };
    const weekdayNames = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    
    function openBookingModal() {
      document.getElementById('bookingModal').classList.add('active');
      document.body.style.overflow = 'hidden';
      const t = new Date(); t.setDate(t.getDate() + 1);
      document.getElementById('bookingDate').min = t.toISOString().split('T')[0];
    }
    function closeBookingModal() {
      document.getElementById('bookingModal').classList.remove('active');
      document.body.style.overflow = '';
    }
    document.getElementById('bookingModal').addEventListener('click', function(e) {
      if (e.target === this) closeBookingModal();
    });
    
    function selectService(el) {
      document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      bookingData.service = el.dataset.service;
      bookingData.price = '';
      document.getElementById('step1Btn').disabled = false;
    }
    function selectBarber(el) {
      document.querySelectorAll('.barber-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      bookingData.barber = el.dataset.barber;
      document.getElementById('step2Btn').disabled = false;
    }
    function goToStep1() { document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden')); document.getElementById('step1').classList.remove('hidden'); }
    function goToStep2() { document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden')); document.getElementById('step2').classList.remove('hidden'); }
    function goToStep3() { document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden')); document.getElementById('step3').classList.remove('hidden'); generateTimeSlots(); }
    function goToStep4() {
      if (!bookingData.date || !bookingData.time) return;
      document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden'));
      document.getElementById('step4').classList.remove('hidden');
      const d = new Date(bookingData.date + 'T12:00:00');
      const dayName = weekdayNames[d.getDay()];
      const formattedDate = d.toLocaleDateString('pt-BR');
      document.getElementById('reviewContent').innerHTML =
        '<p><span class="label">Serviço</span><br><span>' + bookingData.service + '</span></p>' +
        '<p style="margin-top:0.8rem;"><span class="label">Barbeiro</span><br><span>' + bookingData.barber + '</span></p>' +
        '<p style="margin-top:0.8rem;"><span class="label">Data</span><br><span>' + dayName + ', ' + formattedDate + '</span></p>' +
        '<p style="margin-top:0.8rem;"><span class="label">Horário</span><br><span>' + bookingData.time + '</span></p>';
    }
    
    function generateTimeSlots() {
      const dateInput = document.getElementById('bookingDate').value;
      if (!dateInput) return;
      bookingData.date = dateInput;
      const slots = document.getElementById('timeSlots');
      slots.innerHTML = '';
      const d = new Date(dateInput + 'T12:00:00');
      const day = d.getDay();
      if (day === 0 || day === 1) {
        slots.innerHTML = '<p style=\"color:var(--gray);grid-column:1/-1;text-align:center;\">🔒 Fechado neste dia</p>';
        document.getElementById('step3Btn').disabled = true;
        return;
      }
      let start = 9, end = 19;
      if (day === 6) { start = 9; end = 16; }
      document.getElementById('step3Btn').disabled = true;
      for (let h = start; h < end; h++) {
        for (let m of [0, 30]) {
          const t = h.toString().padStart(2,'0') + ':' + m.toString().padStart(2,'0');
          if (h === end-1 && m === 30) continue;
          const slot = document.createElement('div');
          slot.className = 'time-slot';
          slot.textContent = t;
          slot.onclick = function() { selectTime(this); };
          slots.appendChild(slot);
        }
      }
    }
    
    function selectTime(el) {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      bookingData.time = el.textContent;
      document.getElementById('step3Btn').disabled = false;
    }
    
    function sendToWhatsApp() {
      const phone = '556730459452';
      const d = new Date(bookingData.date + 'T12:00:00');
      const dayName = weekdayNames[d.getDay()];
      const formattedDate = d.toLocaleDateString('pt-BR');
      const msg = 'Olá! Gostaria de agendar um horário 🙋‍♂️%0A%0A' +
        '🔹 *Serviço:* ' + bookingData.service + '%0A' +
        '🔹 *Barbeiro:* ' + bookingData.barber + '%0A' +
        '🔹 *Data:* ' + dayName + ', ' + formattedDate + '%0A' +
        '🔹 *Horário:* ' + bookingData.time + '%0A%0A' +
        'Pode confirmar?';
      window.open('https://wa.me/55' + phone + '?text=' + msg, '_blank');
      closeBookingModal();
    }
    
    // Make booking callable from anywhere
    document.querySelectorAll('a[href="#agendar"]').forEach(a => {
      a.addEventListener('click', function(e) { e.preventDefault(); openBookingModal(); });
    });

    // ===== ANIMAÇÕES PROFISSIONAIS =====

    // 1. Mouse follower
    const follower = document.getElementById('mouseFollower');
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.transform = 'translate(' + (followerX - 10) + 'px, ' + (followerY - 10) + 'px)';
      requestAnimationFrame(animateFollower);
    }
    if (window.innerWidth > 768) {
      animateFollower();
      // Hover detection for cards
      document.querySelectorAll('.service-card, .btn, .gallery-item, .barber-option, a').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
      });
    } else {
      follower.style.display = 'none';
    }

    // 2. Service card 3D tilt
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        if (window.innerWidth < 768) return;
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });

    // 3. Stat numbers counter animation
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate number count-up
          const num = entry.target.querySelector('.stat-number');
          if (num && !num.dataset.counted) {
            num.dataset.counted = 'true';
            const target = num.textContent;
            num.textContent = '0';
            let start = 0;
            const end = parseFloat(target.replace(',','.'));
            if (isNaN(end)) { num.textContent = target; return; }
            const duration = 1500;
            const step = (end / duration) * 16;
            const timer = setInterval(() => {
              start += step;
              if (start >= end) {
                num.textContent = target;
                clearInterval(timer);
              } else {
                num.textContent = Math.floor(start).toString();
              }
            }, 16);
          }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-item').forEach(item => statsObserver.observe(item));

    // 4. Enhanced scroll reveal with multiple variants
    const enhancedObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add stagger to children
          const children = entry.target.querySelectorAll('.service-card, .gallery-item, .testimonial-card');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.services-grid, .gallery-grid, .testimonials-grid').forEach(grid => {
      enhancedObserver.observe(grid);
      grid.querySelectorAll('.service-card, .gallery-item, .testimonial-card').forEach(c => c.classList.add('reveal'));
    });

    // 5. Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 6. Active nav highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkElements.forEach(l => l.style.color = '');
          const link = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (link) link.style.color = 'var(--gold)';
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));

    // 7. Mouse parallax in hero
    document.querySelector('.hero-content').addEventListener('mousemove', function(e) {
      if (window.innerWidth < 768) return;
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.querySelector('h1').style.transform = 'translate(' + (x * 20) + 'px, ' + (y * 10) + 'px)';
      this.querySelector('p').style.transform = 'translate(' + (x * 10) + 'px, ' + (y * 5) + 'px)';
    });
    document.querySelector('.hero-content').addEventListener('mouseleave', function() {
      this.querySelector('h1').style.transform = '';
      this.querySelector('p').style.transform = '';
    });
  

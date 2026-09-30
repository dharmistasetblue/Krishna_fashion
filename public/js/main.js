(()=>{

const header = document.querySelector("header");
const backTop = document.getElementById("backTop");
const menu = null; // React Header owns mobile menu
const toggle = null; // React Header owns mobile menu
const progress = document.getElementById("scrollProgress");
const heroCopy = document.querySelector(".hero-copy");

if (toggle && menu) {
  let backdrop = document.querySelector(".mobile-menu-backdrop");

  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "mobile-menu-backdrop";
    document.body.appendChild(backdrop);
  }

  const setMenu = (open) => {
    if (open) {
      document.querySelectorAll(".nav-dropdown.open").forEach(d => d.classList.remove("open"));
    }
    menu.classList.toggle("open", open);
    toggle.classList.toggle("active", open);
    backdrop.classList.toggle("show", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.innerHTML = open ? "×" : "☰";

    if (!open) {
      document.querySelectorAll(".nav-dropdown.open").forEach(d => d.classList.remove("open"));
    }
  };

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu(!menu.classList.contains("open"));
  });

  backdrop.addEventListener("click", () => setMenu(false));

  document.querySelectorAll(".menu > a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 900) setMenu(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menu.classList.contains("open")) setMenu(false);
  });
}

const onScroll = () => {
  const y = window.scrollY;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (y / max) * 100 : 0;

  if (header) header.classList.toggle("scrolled", y > 50);
  if (backTop) backTop.classList.toggle("show", y > 500);
  if (progress) progress.style.width = pct + "%";

  // subtle hero motion on scroll
  if (heroCopy && y < window.innerHeight) {
    heroCopy.style.transform = `translateY(${y * 0.14}px)`;
    heroCopy.style.opacity = String(Math.max(0.35, 1 - y / (window.innerHeight * 1.15)));
  }

  // lightweight parallax for visual blocks
  document.querySelectorAll(".parallax-media").forEach(el => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const shift = Math.max(-24, Math.min(24, -center * 0.035));
    el.style.backgroundPosition = `center calc(50% + ${shift}px)`;
  });
};

window.addEventListener("scroll", onScroll, { passive:true });
window.addEventListener("resize", onScroll);
onScroll();

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top:0, behavior:"smooth" });
  });
}

// Intersection Observer for entrance animations
const animated = document.querySelectorAll("[data-animate]");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, {
  threshold:0.14,
  rootMargin:"0px 0px -7% 0px"
});

animated.forEach((el, i) => {
  if (!el.dataset.delay && i % 3 !== 0) {
    el.dataset.delay = String((i % 3) + 1);
  }
  io.observe(el);
});

// Initial hero animation
requestAnimationFrame(() => {
  document.querySelectorAll(".hero [data-animate]").forEach(el => el.classList.add("in-view"));
});


// Smooth anchor scrolling with custom easing
function smoothScrollTo(targetY, duration = 900){
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start = null;

  const ease = t => t < .5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(ts){
    if(!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if(!id || id === "#") return;
    const target = document.querySelector(id);
    if(!target) return;

    e.preventDefault();
    const headerH = document.querySelector("header")?.offsetHeight || 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
    smoothScrollTo(y, 950);
  });
});



// Mobile Products dropdown is owned by React in components/Header.jsx.
// Do not mutate .nav-dropdown/open here; doing so conflicts with React state.

// ===== Infrastructure gallery + reliable lightbox =====
(function(){
  const slider = document.querySelector('.infra-slider');
  const allLightboxItems = [...document.querySelectorAll('[data-lightbox]')];

  if (!allLightboxItems.length) return;

  /* Create lightbox once */
  let lb = document.querySelector('.kf-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'kf-lightbox';
    lb.innerHTML = `
      <button class="kf-lightbox-close" type="button" aria-label="Close">×</button>
      <div class="kf-lightbox-counter"></div>
      <button class="kf-lightbox-nav kf-lightbox-prev" type="button" aria-label="Previous image">←</button>
      <div class="kf-lightbox-stage">
        <img src="" alt="">
      </div>
      <button class="kf-lightbox-nav kf-lightbox-next" type="button" aria-label="Next image">→</button>
      <div class="kf-lightbox-caption"></div>
    `;
    document.body.appendChild(lb);
  }

  const lightboxImg = lb.querySelector('.kf-lightbox-stage img');
  const caption = lb.querySelector('.kf-lightbox-caption');
  const counter = lb.querySelector('.kf-lightbox-counter');
  const closeBtn = lb.querySelector('.kf-lightbox-close');
  const prevBtn = lb.querySelector('.kf-lightbox-prev');
  const nextBtn = lb.querySelector('.kf-lightbox-next');
  if (!lightboxImg || !caption || !counter || !closeBtn || !prevBtn || !nextBtn) return;

  let currentLightbox = 0;
  let lightboxTouchStartX = 0;

  function sourceFor(item){
    return item.getAttribute('data-lightbox')
      || item.querySelector('img')?.getAttribute('src')
      || '';
  }

  function titleFor(item){
    return item.getAttribute('data-caption')
      || item.querySelector('img')?.getAttribute('alt')
      || '';
  }

  function renderLightbox(index){
    currentLightbox = (index + allLightboxItems.length) % allLightboxItems.length;
    const item = allLightboxItems[currentLightbox];

    lightboxImg.src = sourceFor(item);
    lightboxImg.alt = titleFor(item);
    caption.textContent = titleFor(item);
    counter.textContent = `${currentLightbox + 1} / ${allLightboxItems.length}`;

    const multiple = allLightboxItems.length > 1;
    prevBtn.style.display = multiple ? 'grid' : 'none';
    nextBtn.style.display = multiple ? 'grid' : 'none';
  }

  function openLightbox(item){
    const idx = allLightboxItems.indexOf(item);
    renderLightbox(idx >= 0 ? idx : 0);
    lb.classList.add('open');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox(){
    lb.classList.remove('open');
    document.body.classList.remove('lightbox-open');
  }

  function previousImage(){ renderLightbox(currentLightbox - 1); }
  function nextImage(){ renderLightbox(currentLightbox + 1); }

  /* Direct click listeners: no event delegation dependency */
  allLightboxItems.forEach(item => {
    item.addEventListener('click', function(e){
      const viewport = item.closest('.infra-slider-viewport');
      if (viewport && viewport.dataset.draggingGallery === '1') {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openLightbox(item);
    });
  });

  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closeLightbox();
  });

  prevBtn.addEventListener('click', function(e){
    e.stopPropagation();
    previousImage();
  });

  nextBtn.addEventListener('click', function(e){
    e.stopPropagation();
    nextImage();
  });

  lb.addEventListener('click', function(e){
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function(e){
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') previousImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  lb.addEventListener('touchstart', function(e){
    lightboxTouchStartX = e.changedTouches[0].clientX;
  }, {passive:true});

  lb.addEventListener('touchend', function(e){
    const dx = e.changedTouches[0].clientX - lightboxTouchStartX;
    if (Math.abs(dx) < 45) return;
    dx > 0 ? previousImage() : nextImage();
  }, {passive:true});

  /* Slider */
  if (!slider) return;

  const viewport = slider.querySelector('.infra-slider-viewport');
  const track = slider.querySelector('.infra-slider-track');
  const slides = [...slider.querySelectorAll('.infra-slide')];
  const prev = slider.querySelector('[data-slider-prev]');
  const next = slider.querySelector('[data-slider-next]');
  if (!viewport || !track || !slides.length) return;

  let index = 0;
  let startX = 0;
  let liveX = 0;
  let isPointerDown = false;
  let didDrag = false;

  const perView = () => window.innerWidth <= 620 ? 1 : (window.innerWidth <= 980 ? 2 : 3);

  function getMetrics(){
    const visible = perView();
    const gap = 18;
    const width = viewport.clientWidth;
    const slideWidth = (width - gap * (visible - 1)) / visible;
    const maxIndex = Math.max(0, slides.length - visible);
    return {gap, slideWidth, maxIndex};
  }

  function updateSlider(animate = true){
    const {gap, slideWidth, maxIndex} = getMetrics();
    index = Math.max(0, Math.min(index, maxIndex));
    track.style.transition = animate ? 'transform .55s cubic-bezier(.2,.7,.2,1)' : 'none';
    track.style.transform = `translate3d(-${index * (slideWidth + gap)}px,0,0)`;
  }

  prev?.addEventListener('click', () => { index--; updateSlider(); });
  next?.addEventListener('click', () => { index++; updateSlider(); });

  viewport.addEventListener('pointerdown', function(e){
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isPointerDown = true;
    didDrag = false;
    startX = liveX = e.clientX;
    track.style.transition = 'none';
  });

  viewport.addEventListener('pointermove', function(e){
    if (!isPointerDown) return;

    liveX = e.clientX;
    const dx = liveX - startX;

    if (Math.abs(dx) > 10) {
      didDrag = true;
      viewport.dataset.draggingGallery = '1';
    }

    if (!didDrag) return;

    const {gap, slideWidth} = getMetrics();
    const base = -(index * (slideWidth + gap));
    track.style.transform = `translate3d(${base + dx}px,0,0)`;
  });

  function endPointer(){
    if (!isPointerDown) return;

    const dx = liveX - startX;
    isPointerDown = false;

    if (didDrag) {
      const threshold = Math.min(70, viewport.clientWidth * .14);
      if (dx < -threshold) index++;
      if (dx > threshold) index--;
    }

    updateSlider(true);

    if (didDrag) {
      setTimeout(() => {
        delete viewport.dataset.draggingGallery;
        didDrag = false;
      }, 80);
    } else {
      delete viewport.dataset.draggingGallery;
    }
  }

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  viewport.addEventListener('pointerleave', function(){
    if (isPointerDown) endPointer();
  });

  window.addEventListener('resize', () => updateSlider(false));
  updateSlider(false);
})();


// ===== Home Product Card Sliders =====
(() => {
  document.querySelectorAll('[data-product-slider]').forEach((slider) => {
    const track = slider.querySelector('.product-slider-track');
    const slides = [...slider.querySelectorAll('.product-slider-slide')];
    const prev = slider.querySelector('.product-slider-prev');
    const next = slider.querySelector('.product-slider-next');
    const dotsWrap = slider.querySelector('.product-slider-dots');
    if (!track || slides.length < 2 || !dotsWrap) return;

    let index = 0;
    let timer = null;
    const delay = 3500;

    // Next.js dev/Strict Mode or client-side route navigation can initialize
    // this legacy slider more than once. Always rebuild pagination from the
    // actual slide count so duplicate dots can never accumulate.
    dotsWrap.replaceChildren();

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'product-slider-dot';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', (e) => { e.preventDefault(); go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = [...dotsWrap.children];

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translate3d(-${index * 100}%,0,0)`;
      dots.forEach((dot, n) => dot.classList.toggle('active', n === index));
    }
    function start(){ stop(); timer = setInterval(() => go(index + 1), delay); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function restart(){ start(); }

    prev?.addEventListener('click', (e) => { e.preventDefault(); go(index - 1); restart(); });
    next?.addEventListener('click', (e) => { e.preventDefault(); go(index + 1); restart(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    const viewport = slider.querySelector('.product-slider-viewport');
    let dragStartX = 0;
    let dragX = 0;
    let dragging = false;
    let dragged = false;

    function dragStart(e) {
      // Navigation controls must stay clickable. Do not start a drag
      // when the pointer begins on arrows or pagination dots.
      if (e.target.closest('.product-slider-arrow, .product-slider-dots, .product-slider-dot')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      dragged = false;
      dragStartX = e.clientX;
      dragX = e.clientX;
      stop();
      track.style.transition = 'none';
      viewport.classList.add('is-dragging');
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
    }

    function dragMove(e) {
      if (!dragging) return;
      dragX = e.clientX;
      const dx = dragX - dragStartX;
      if (Math.abs(dx) > 5) dragged = true;
      const width = viewport.clientWidth || 1;
      const offset = (-index * width) + dx;
      track.style.transform = `translate3d(${offset}px,0,0)`;
    }

    function dragEnd(e) {
      if (!dragging) return;
      dragging = false;
      const dx = dragX - dragStartX;
      const threshold = Math.min(90, (viewport.clientWidth || 1) * 0.16);
      track.style.transition = '';
      viewport.classList.remove('is-dragging');
      if (Math.abs(dx) >= threshold) {
        go(index + (dx < 0 ? 1 : -1));
      } else {
        go(index);
      }
      setTimeout(() => { dragged = false; }, 80);
      start();
    }

    viewport?.addEventListener('pointerdown', dragStart);
    viewport?.addEventListener('pointermove', dragMove);
    viewport?.addEventListener('pointerup', dragEnd);
    viewport?.addEventListener('pointercancel', dragEnd);
    viewport?.addEventListener('dragstart', e => e.preventDefault());
    viewport?.addEventListener('click', e => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    go(0);
    start();
  });
})();

})();

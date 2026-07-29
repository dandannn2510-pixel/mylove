/* ===================================================
   script.js - Anniversary Website (Mobile Optimized & Audio Engine Fixed)
   Features: Robust Autoplay Audio Unlocker for Mobile, Realtime Timer,
   Love Calendar, Constellation Galaxy, Fullscreen Love Letter Modal.
   =================================================== */

const CONFIG = {
  PASSCODE: "0308",
  LOVE_START_DATE: new Date("2024-08-03T00:00:00"),
  PLAYLIST: [
    { title: "ชอบตัวเองตอนอยู่กับเธอ - Billkin 💖", ytid: "DhtKoB4qdm4", url: "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-preview-583.mp3" },
    { title: "คู่ชีวิต - COCKTAIL 🎸", ytid: "cnRtjG6lLHU", url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3" },
    { title: "จังหวะตกหลุมรัก - DIDIxDADA 🎵", ytid: "y5qMnKY9VR8", url: "https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3" },
    { title: "ยินดี - Sarah Salola 🌸", ytid: "uRopiMriHsA", url: "https://assets.mixkit.co/music/preview/mixkit-sweet-love-514.mp3" }
  ]
};

const REASONS = [
  "สวย 🥰 สวยที่สุดในใจเลย",
  "สนุก 🤣 อยู่ด้วยกันแล้วไม่เคยเบื่อเลย",
  "น่ารัก 🥰 น่ารักที่สุดเลยคือไอ่บี๋นี่แหละ",
  "อยู่ด้วยกันแล้วสบายใจดี 😌 ถึงบางทีจะพาหงุดหงิดไปมั่งแต่รักน้าา",
  "อ่าเจ๊ 👑 เจ๊แสนน่ารัก",
  "ตอน... น่ารักคูณ 100 🥹",
  "ใส่ใจเก่ง 💖 จะทำอะไรก็คอยใส่ใจเสมอ",
  "เหมือนมีแม่ในตัว 😊 ดูแลเก่งมากๆ เลย",
  "บนเก่ง 👑 เก่งทุกอย่างเลย แนว กุ้ยๆๆๆๆๆ",
  "ร้องไห้เก่ง มีเรื่องให้โอ๋ทุกวันนนน 😢😂"
];

let ytPlayer = null;
let isYtReady = false;
let isPlaying = false;
let currentTrackIdx = 0;
let fallbackAudio = null;
let mainUnlocked = false;
let audioEngineUnlocked = false;

// ===== YOUTUBE IFRAME PLAYER API =====
window.onYouTubeIframeAPIReady = function() {
  try {
    ytPlayer = new YT.Player('yt-player', {
      events: {
        onReady: (event) => {
          isYtReady = true;
          event.target.setVolume(85);
          if (mainUnlocked || audioEngineUnlocked) {
            event.target.playVideo();
            isPlaying = true;
            updateMusicUI(true);
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            updateMusicUI(true);
          } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
            updateMusicUI(false);
          }
        }
      }
    });
  } catch (err) {
    console.warn("YouTube API init fallback", err);
  }
};

// ===== MOBILE AUDIO ENGINE UNLOCKER (ROBUST MULTI-ENGINE) =====
function unlockAudioEngine() {
  const bgAudio = document.getElementById("bg-audio-fallback");
  if (bgAudio) {
    bgAudio.play().then(() => {
      isPlaying = true;
      updateMusicUI(true);
    }).catch(() => {});
  }

  if (isYtReady && ytPlayer && typeof ytPlayer.playVideo === "function") {
    try {
      ytPlayer.playVideo();
      isPlaying = true;
      updateMusicUI(true);
    } catch (e) {}
  }
  audioEngineUnlocked = true;
}

// ===== PASSCODE SCREEN CONTROLLER =====
(function initPasscode() {
  const screen = document.getElementById("passcode-screen");
  const main   = document.getElementById("main-content");
  const dots   = document.querySelectorAll(".dot");
  const errorEl = document.getElementById("passcode-error");
  const keys   = document.querySelectorAll(".key");
  let input    = "";
  let unlocking = false;

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("filled", i < input.length));
  }

  function shakeKeypad() {
    errorEl.classList.remove("hidden");
    input = "";
    updateDots();
    setTimeout(() => errorEl.classList.add("hidden"), 2000);
  }

  function tryUnlock() {
    if (unlocking) return;
    if (input === CONFIG.PASSCODE) {
      unlocking = true;
      mainUnlocked = true;
      unlockAudioEngine();

      launchFireworks(window.innerWidth / 2, window.innerHeight / 2, 40);
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 20);

      gsap.to(".passcode-box", {
        scale: 1.08,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(screen, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              screen.style.display = "none";
              main.classList.remove("hidden");
              initMain();
            }
          });
        }
      });
    } else {
      shakeKeypad();
    }
  }

  keys.forEach(key => {
    key.addEventListener("click", () => {
      unlockAudioEngine();
      const v = key.dataset.val;
      if (v === "clear") {
        input = input.slice(0, -1);
        updateDots();
        return;
      }
      if (v === "enter") {
        if (input.length === 4) tryUnlock();
        return;
      }
      if (input.length < 4) {
        input += v;
        updateDots();
      }
      if (input.length === 4) {
        setTimeout(tryUnlock, 150);
      }
    });
  });
})();

// ===== MAIN INITIALIZER =====
function initMain() {
  initNightSkyCanvas();
  initFireworksEngine();
  initTouchSparkleTrail();
  init3DTiltEffects();
  initTabNavigation();
  initRealtimeCounter();
  initPlaylistEngine();
  initLoveCalendar();
  initStarryReasons();
  initLoveLetterModal();
  initMasonryGallery();
  initTimelineModal();
  initLoveSpinner();
  initCoupleNotes();
  initFloatingAmbientHearts();
  initConfettiBtn();
  initGlobalTapBurst();

  // CTA button scroll to timeline
  document.getElementById("hero-start-journey-btn").addEventListener("click", () => {
    const timelineTab = document.querySelector('.nav-dock-item[data-target="page-timeline"]');
    if (timelineTab) timelineTab.click();
  });
}

// ===== NIGHT SKY STARS & SHOOTING STARS CANVAS =====
function initNightSkyCanvas() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      width = canvas.width = entry.contentRect.width;
      height = canvas.height = entry.contentRect.height;
    }
  });
  resizeObserver.observe(canvas.parentElement);

  const stars = [];
  for (let i = 0; i < 75; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }

  // Shooting Stars Array
  const shootingStars = [];
  function createShootingStar() {
    shootingStars.push({
      x: Math.random() * width,
      y: Math.random() * (height / 2),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 6 + 4,
      angle: Math.PI / 4,
      alpha: 1
    });
  }

  setInterval(() => {
    if (Math.random() < 0.6) createShootingStar();
  }, 2500);

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render Stars
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      st.x += Math.cos(st.angle) * st.speed;
      st.y += Math.sin(st.angle) * st.speed;
      st.alpha -= 0.015;

      if (st.alpha <= 0 || st.x > width || st.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = st.x - Math.cos(st.angle) * st.length;
      const tailY = st.y - Math.sin(st.angle) * st.length;

      const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 228, 243, ${st.alpha})`);
      grad.addColorStop(0.5, `rgba(255, 143, 171, ${st.alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(st.x, st.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }
  render();
}

// ===== REALTIME LOVE COUNTER =====
function initRealtimeCounter() {
  function update() {
    const now = new Date();
    const start = CONFIG.LOVE_START_DATE;
    if (now < start) return;

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = now - start;
    const totalSecs = Math.floor(diffMs / 1000);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600) % 24;

    document.getElementById("t-years").textContent = years;
    document.getElementById("t-months").textContent = months;
    document.getElementById("t-days").textContent = days;
    document.getElementById("t-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("t-mins").textContent = String(mins).padStart(2, "0");
    document.getElementById("t-secs").textContent = String(secs).padStart(2, "0");
  }
  update();
  setInterval(update, 1000);
}

// ===== TAB NAVIGATION WITH GSAP STAGGER ANIMATIONS =====
function initTabNavigation() {
  const tabs = document.querySelectorAll(".nav-dock-item");
  const pages = document.querySelectorAll(".app-page");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;
      const targetPage = document.getElementById(targetId);
      const activePage = document.querySelector(".app-page.active");

      if (targetPage === activePage) return;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (activePage) activePage.classList.remove("active");
      targetPage.classList.add("active");

      // Smooth Page Scale Entrance
      gsap.fromTo(targetPage, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });

      // Stagger animate child elements inside target page
      const elements = targetPage.querySelectorAll(".glass-panel, .timeline-item, .special-date-item, .constellation-star");
      if (elements.length) {
        gsap.fromTo(elements, 
          { y: 25, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: "back.out(1.3)", clearProps: "transform" }
        );
      }
    });
  });
}

// ===== PLAYLIST & MUSIC UI CONTROLLER =====
function updateMusicUI(active) {
  const headerEq = document.getElementById("header-audio-eq");
  const drawerEq = document.getElementById("drawer-audio-eq");
  const playBtn = document.getElementById("play-song-btn");
  const vinyl = document.getElementById("vinyl-disk");

  if (active) {
    if (playBtn) playBtn.textContent = "⏸️";
    if (vinyl) vinyl.classList.add("playing");
    if (headerEq) headerEq.classList.remove("hidden");
    if (drawerEq) drawerEq.classList.remove("hidden");
  } else {
    if (playBtn) playBtn.textContent = "▶️";
    if (vinyl) vinyl.classList.remove("playing");
    if (headerEq) headerEq.classList.add("hidden");
    if (drawerEq) drawerEq.classList.add("hidden");
  }
}

function initPlaylistEngine() {
  const trigger = document.getElementById("music-mini-btn");
  const drawer  = document.getElementById("music-drawer");
  const closeBtn = document.getElementById("close-music-drawer");
  const playBtn = document.getElementById("play-song-btn");
  const songTitle = document.getElementById("song-title");
  const items = document.querySelectorAll(".playlist-item");

  trigger.addEventListener("click", () => {
    unlockAudioEngine();
    drawer.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => drawer.classList.add("hidden"));

  function togglePlay() {
    unlockAudioEngine();

    if (isPlaying) {
      if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") ytPlayer.pauseVideo();
      if (fallbackAudio) fallbackAudio.pause();
      const bgAudio = document.getElementById("bg-audio-fallback");
      if (bgAudio) bgAudio.pause();
      isPlaying = false;
      updateMusicUI(false);
    } else {
      if (currentTrackIdx === 0 && isYtReady && ytPlayer && typeof ytPlayer.playVideo === "function") {
        ytPlayer.playVideo();
      } else if (fallbackAudio) {
        fallbackAudio.play().catch(() => {});
      } else {
        const bgAudio = document.getElementById("bg-audio-fallback");
        if (bgAudio) bgAudio.play().catch(() => {});
      }
      isPlaying = true;
      updateMusicUI(true);
    }
  }

  playBtn.addEventListener("click", togglePlay);

  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
      unlockAudioEngine();
      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      currentTrackIdx = idx;
      songTitle.textContent = CONFIG.PLAYLIST[idx].title;

      const bgAudio = document.getElementById("bg-audio-fallback");
      if (bgAudio) bgAudio.pause();

      const track = CONFIG.PLAYLIST[idx];
      if (track.ytid) {
        // Load new YouTube video
        if (fallbackAudio) fallbackAudio.pause();
        if (isYtReady && ytPlayer && typeof ytPlayer.loadVideoById === "function") {
          ytPlayer.loadVideoById(track.ytid);
          ytPlayer.playVideo();
        }
      } else {
        if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") ytPlayer.pauseVideo();
        if (fallbackAudio) fallbackAudio.pause();
        fallbackAudio = new Audio(track.url);
        fallbackAudio.play().catch(() => {});
      }
      isPlaying = true;
      updateMusicUI(true);
    });
  });
}

// ===== LOVE CALENDAR CONTROLLER =====
function initLoveCalendar() {
  const highlights = document.querySelectorAll(".special-date-item[data-title], .cal-day[data-title]");
  const modal = document.getElementById("cal-modal");
  const titleEl = document.getElementById("cal-modal-title");
  const descEl = document.getElementById("cal-modal-desc");
  const closeBtn = document.getElementById("cal-modal-close");

  highlights.forEach(h => {
    h.addEventListener("click", () => {
      titleEl.textContent = h.dataset.title;
      descEl.textContent = h.dataset.desc;
      modal.classList.remove("hidden");
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 10);
    });
  });

  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

// ===== GORGEOUS CRYSTAL REASONS GALAXY =====
function initStarryReasons() {
  const container = document.getElementById("sky-stars-container");
  const displayCard = document.getElementById("reason-display-card");
  const textEl = document.getElementById("reason-card-text");
  const iconEl = document.getElementById("reason-card-icon");
  const randomBtn = document.getElementById("random-reason-btn");
  if (!container) return;

  container.innerHTML = "";

  const starOrbs = [
    { icon: "💖", label: "ข้อ 1", title: "เหตุผลข้อที่ 1" },
    { icon: "✨", label: "ข้อ 2", title: "เหตุผลข้อที่ 2" },
    { icon: "🌸", label: "ข้อ 3", title: "เหตุผลข้อที่ 3" },
    { icon: "😌", label: "ข้อ 4", title: "เหตุผลข้อที่ 4" },
    { icon: "👑", label: "ข้อ 5", title: "เหตุผลข้อที่ 5" },
    { icon: "🥹", label: "ข้อ 6", title: "เหตุผลข้อที่ 6" },
    { icon: "💝", label: "ข้อ 7", title: "เหตุผลข้อที่ 7" },
    { icon: "🥰", label: "ข้อ 8", title: "เหตุผลข้อที่ 8" },
    { icon: "😆", label: "ข้อ 9", title: "เหตุผลข้อที่ 9" },
    { icon: "😭", label: "ข้อ 10", title: "เหตุผลข้อที่ 10" }
  ];

  const starElements = [];
  starOrbs.forEach((orb, idx) => {
    const s = document.createElement("div");
    s.className = "crystal-orb-item glass-panel";
    s.innerHTML = `<span class="orb-icon">${orb.icon}</span><span class="orb-label">${orb.label}</span>`;
    
    s.addEventListener("click", () => {
      starElements.forEach(el => el.classList.remove("active-orb"));
      s.classList.add("active-orb");
      showReason(idx);
    });
    container.appendChild(s);
    starElements.push(s);
  });

  function showReason(idx) {
    if (!displayCard || !textEl) return;
    displayCard.classList.remove("hidden");
    if (iconEl) iconEl.textContent = starOrbs[idx].icon;
    textEl.textContent = REASONS[idx];
    gsap.fromTo(displayCard, { scale: 0.88, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.5)" });
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 10);
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const randomIdx = Math.floor(Math.random() * REASONS.length);
      starElements.forEach(el => el.classList.remove("active-orb"));
      if (starElements[randomIdx]) starElements[randomIdx].classList.add("active-orb");
      showReason(randomIdx);
    });
  }
}

// ===== REALISTIC 3D LOVE LETTER ENVELOPE MODAL =====
function initLoveLetterModal() {
  const trigger = document.getElementById("open-love-letter-trigger");
  const envFlap = document.getElementById("envelope-flap");
  const envLetter = document.getElementById("envelope-letter");
  const modal = document.getElementById("love-letter-modal");
  const overlay = document.getElementById("love-letter-overlay");
  const closeBtn = document.getElementById("close-letter-modal-btn");
  const closeX = document.getElementById("close-letter-modal-x");

  if (!trigger || !modal) return;

  function openEnvelopeSequence(e) {
    if (e) e.stopPropagation();

    if (envFlap) envFlap.classList.add("flap-open");
    if (envLetter) envLetter.classList.add("letter-slide-out");

    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
    launchFireworks(window.innerWidth / 2, window.innerHeight / 3, 25);

    setTimeout(() => {
      modal.classList.remove("hidden");
      gsap.fromTo(".love-letter-modal-paper", 
        { scale: 0.8, opacity: 0, y: 30 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
      );
    }, 200);
  }

  function closeModal() {
    gsap.to(".love-letter-modal-paper", {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.25,
      onComplete: () => {
        modal.classList.add("hidden");
        if (envFlap) envFlap.classList.remove("flap-open");
        if (envLetter) envLetter.classList.remove("letter-slide-out");
      }
    });
  }

  trigger.addEventListener("click", openEnvelopeSequence);
  closeBtn.addEventListener("click", closeModal);
  closeX.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}

// ===== GALLERY SLIDESHOW & PERSISTENCE =====
// ===== GALLERY SLIDESHOW & PERSISTENCE =====
function initMasonryGallery() {
  const slideshowTrack = document.getElementById("slideshow-track");
  const dotsContainer = document.getElementById("slideshow-dots");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const uploadInput = document.getElementById("polaroid-file-input");
  const uploadTrigger = document.getElementById("polaroid-upload-trigger");

  const FOLDER_PHOTOS = [
    "รูปรวม/0025DE2D-F078-44AB-9DDC-1293AFA9F6E0.png",
    "รูปรวม/1265F838-1C48-42A7-96F1-8A113AB8736A.jpg",
    "รูปรวม/1847C064-8684-4675-A157-0A88C031B9A5.jpg",
    "รูปรวม/2C70A7AE-9F14-48EC-9EEA-0B89D71C2AC9.jpg",
    "รูปรวม/31FD862E-7369-4A8A-80AD-4E603D6DCC67.jpg",
    "รูปรวม/355CCEA7-FAF2-4684-AEA7-437DBD93323F.jpg",
    "รูปรวม/3602F16F-E073-47C7-9665-F74106A75C49.jpg",
    "รูปรวม/3DF4688F-F2CA-4B06-9769-CAD54A26EED6.jpg",
    "รูปรวม/59FAA9BF-A85F-4FD3-AB16-C34019158765.jpg",
    "รูปรวม/5DD348BF-3E1F-49D7-92AF-9070C7096699.jpg",
    "รูปรวม/5FEA5A02-5614-42CD-8DDC-E09048D1E6E2.jpg",
    "รูปรวม/6C99E2D9-57D6-4B3A-A3CA-34128698C403.png",
    "รูปรวม/6E5D8079-7547-4B44-841E-C7E6EC350A4E.jpg",
    "รูปรวม/70BB3631-4690-475B-AACD-D4A3B478A36B.jpg",
    "รูปรวม/AA222C1A-95DB-4CF0-A60A-C39F6ED3ECDB.jpg",
    "รูปรวม/AD52637C-CD9A-466C-97FC-C9A39B2E38FF.jpg",
    "รูปรวม/C664A8C7-F79B-43A5-BD8C-F017E632C3BE.jpg",
    "รูปรวม/C8F0E65E-2BE4-4C99-9C74-5E3D46644381.jpg",
    "รูปรวม/D995E79C-3E29-4690-97EB-D4BA05EA73A2.jpg",
    "รูปรวม/E8E980FD-D80C-428D-9ECF-2BECCF581A8F.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_1.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_2.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_3.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_4.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_5.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_6.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_7.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_8.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_9.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_10.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_11.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_12.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_13.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_14.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_15.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_16.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_17.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_18.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_19.jpg",
    "รูปรวม/LINE_ALBUM_💪🏼💪🏼_260729_20.jpg",
    "รูปรวม/S__17743878_0.jpg",
    "รูปรวม/S__17743902_0.jpg",
    "รูปรวม/S__17743903_0.jpg",
    "รูปรวม/S__17743904_0.jpg",
    "รูปรวม/S__17743905_0.jpg",
    "รูปรวม/S__17743906_0.jpg",
    "รูปรวม/S__17743907_0.jpg",
    "รูปรวม/S__17743908_0.jpg",
    "รูปรวม/S__17743909_0.jpg",
    "รูปรวม/S__17743913_0.jpg",
    "รูปรวม/S__17743914_0.jpg",
    "รูปรวม/S__17743915_0.jpg",
    "รูปรวม/S__17743916_0.jpg",
    "รูปรวม/S__17743917_0.jpg",
    "รูปรวม/S__17743918_0.jpg",
    "รูปรวม/S__17743919_0.jpg",
    "รูปรวม/S__17743920_0.jpg",
    "รูปรวม/S__17743922_0.jpg",
    "รูปรวม/S__17743925_0.jpg",
    "รูปรวม/S__17743926_0.jpg",
    "รูปรวม/S__17743927_0.jpg",
    "รูปรวม/S__17743928_0.jpg",
    "รูปรวม/S__17743929_0.jpg",
    "รูปรวม/S__17743930_0.jpg",
    "รูปรวม/S__17743931_0.jpg",
    "รูปรวม/S__17743932_0.jpg",
    "รูปรวม/S__17743933_0.jpg",
    "รูปรวม/S__17743935_0.jpg",
    "รูปรวม/S__17743936_0.jpg",
    "รูปรวม/S__17743937_0.jpg",
    "รูปรวม/S__17743938_0.jpg",
    "รูปรวม/S__17743939_0.jpg",
    "รูปรวม/S__17743940_0.jpg",
    "รูปรวม/S__17743941_0.jpg",
    "รูปรวม/S__17743942_0.jpg",
    "รูปรวม/S__17743943_0.jpg",
    "รูปรวม/S__17743944_0.jpg"
  ];

  let currentSlide = 0;
  let autoInterval = null;

  function loadAllPhotos() {
    if (!slideshowTrack) return;
    slideshowTrack.innerHTML = "";

    // Load photos from folder
    FOLDER_PHOTOS.forEach((src, idx) => {
      const slide = document.createElement("div");
      slide.className = "gallery-slide" + (idx === 0 ? " active-slide" : "");
      const img = document.createElement("img");
      img.src = encodeURI(src);
      img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:16px;";
      slide.appendChild(img);
      slideshowTrack.appendChild(slide);
    });

    // Load any user uploaded local photos
    try {
      const saved = JSON.parse(localStorage.getItem("mylove_photos") || "[]");
      saved.forEach(dataUrl => {
        const slide = document.createElement("div");
        slide.className = "gallery-slide";
        const img = document.createElement("img");
        img.src = dataUrl;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:16px;";
        slide.appendChild(img);
        slideshowTrack.appendChild(slide);
      });
    } catch (e) {}

    renderDots();
    goToSlide(0);
  }

  function getSlides() {
    return slideshowTrack ? Array.from(slideshowTrack.querySelectorAll(".gallery-slide, .slide-placeholder")) : [];
  }

  function goToSlide(idx) {
    const slides = getSlides();
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove("active-slide"));
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add("active-slide");
    renderDots();
  }

  function renderDots() {
    const slides = getSlides();
    if (!dotsContainer) return;
    dotsContainer.innerHTML = `<span class="slide-count-badge">📸 ${currentSlide + 1} / ${slides.length}</span>`;
  }

  function startAutoplay() {
    stopAutoplay();
    autoInterval = setInterval(() => {
      const slides = getSlides();
      if (slides.length > 1) goToSlide(currentSlide + 1);
    }, 3500);
  }

  function stopAutoplay() {
    if (autoInterval) clearInterval(autoInterval);
  }

  function loadSavedPhotos() {
    try {
      const saved = JSON.parse(localStorage.getItem("mylove_photos") || "[]");
      if (saved.length && slideshowTrack) {
        const placeholder = slideshowTrack.querySelector(".slide-placeholder");
        if (placeholder) placeholder.remove();
        saved.forEach(dataUrl => {
          const slide = document.createElement("div");
          slide.className = "gallery-slide";
          const img = document.createElement("img");
          img.src = dataUrl;
          img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:16px;";
          slide.appendChild(img);
          slideshowTrack.appendChild(slide);
        });
        renderDots();
        goToSlide(0);
      }
    } catch (e) {}
  }

  function savePhoto(dataUrl) {
    try {
      const saved = JSON.parse(localStorage.getItem("mylove_photos") || "[]");
      saved.push(dataUrl);
      localStorage.setItem("mylove_photos", JSON.stringify(saved.slice(-20))); // keep last 20 photos
    } catch (e) {}
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { goToSlide(currentSlide - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { goToSlide(currentSlide + 1); startAutoplay(); });

  // Handle photo uploads
  if (uploadTrigger && uploadInput) {
    uploadTrigger.addEventListener("click", () => uploadInput.click());
    uploadInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const placeholder = slideshowTrack ? slideshowTrack.querySelector(".slide-placeholder") : null;
      if (placeholder) placeholder.remove();

      files.forEach((file, fileIdx) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const slide = document.createElement("div");
          slide.className = "gallery-slide";
          const img = document.createElement("img");
          img.src = ev.target.result;
          img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:16px;";
          slide.appendChild(img);
          if (slideshowTrack) slideshowTrack.appendChild(slide);
          savePhoto(ev.target.result);

          const slides = getSlides();
          renderDots();
          if (fileIdx === files.length - 1) {
            goToSlide(slides.length - 1);
            startAutoplay();
          }
        };
        reader.readAsDataURL(file);
      });
      uploadInput.value = "";
    });
  }

  loadAllPhotos();
  startAutoplay();
}

// ===== TIMELINE MODAL CLICK HANDLER =====
function initTimelineModal() {
  const cards = document.querySelectorAll(".timeline-card");
  const modal = document.getElementById("cal-modal");
  const titleEl = document.getElementById("cal-modal-title");
  const descEl = document.getElementById("cal-modal-desc");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (!modal || !titleEl || !descEl) return;
      const title = card.dataset.title || card.querySelector("h3").textContent;
      const date = card.dataset.date || card.querySelector(".tl-date").textContent;
      const desc = card.dataset.desc || card.querySelector("p").textContent;
      titleEl.textContent = `${title} (${date})`;
      descEl.textContent = desc;
      modal.classList.remove("hidden");
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 12);
    });
  });
}

// ===== LOVE COUPON SPINNER =====
function initLoveSpinner() {
  const btn = document.getElementById("spin-coupon-btn");
  const iconEl = document.getElementById("coupon-icon");
  const titleEl = document.getElementById("coupon-title");

  const coupons = [
    { icon: "🍲", title: "คูปองกินชาบูหมูกระทะตามใจแฟน 1 มื้อ ✨" },
    { icon: "👑", title: "คูปองเป็นราชา 1 วัน สั่งอะไรแดนทำตามหมด!" },
    { icon: "🫂", title: "คูปองกอดแน่นๆ 10 วินาที + จุ๊บแก้ม 3 ที 🥰" },
    { icon: "☕", title: "คูปองพาไปเที่ยวคาเฟ่ถ่ายรูปสวยๆ 📸" },
    { icon: "💆‍♂️", title: "คูปองนวดหลังนวดไหล่ผ่อนคลายสบายตัว 💆‍♀️" },
    { icon: "🍰", title: "คูปองเลี้ยงขนมหวานของโปรดไอ่บี๋ 🧁" },
    { icon: "🎬", title: "คูปองนอนดูหนังเรื่องโปรดด้วยกันทั้งคืน 🍿" }
  ];

  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!titleEl || !iconEl) return;
    titleEl.textContent = "กำลังหมุนสุ่มคูปองสุดพิเศษ... 🎲";
    iconEl.textContent = "🎰";

    let count = 0;
    const interval = setInterval(() => {
      const randomc = coupons[Math.floor(Math.random() * coupons.length)];
      iconEl.textContent = randomc.icon;
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalCoupon = coupons[Math.floor(Math.random() * coupons.length)];
        iconEl.textContent = finalCoupon.icon;
        titleEl.textContent = finalCoupon.title;
        launchFireworks(window.innerWidth / 2, window.innerHeight / 3, 25);
        createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 15);
      }
    }, 100);
  });
}

// ===== COUPLE NOTES WISHLIST =====
function initCoupleNotes() {
  const input = document.getElementById("love-note-input");
  const saveBtn = document.getElementById("save-note-btn");
  const listEl = document.getElementById("saved-notes-list");

  if (!saveBtn || !listEl) return;

  function loadNotes() {
    try {
      const notes = JSON.parse(localStorage.getItem("mylove_notes") || "[]");
      listEl.innerHTML = "";
      if (!notes.length) {
        listEl.innerHTML = `<div class="note-item-empty">ยังไม่มีโน้ตที่บันทึก พิมพ์แล้วกดบันทึกได้เลย! 💕</div>`;
        return;
      }
      notes.forEach((note, idx) => {
        const item = document.createElement("div");
        item.className = "note-item glass-panel";
        item.innerHTML = `
          <div class="note-text">💖 ${escapeHtml(note.text)}</div>
          <div class="note-meta">${note.date} <button class="delete-note-btn" data-idx="${idx}">✕</button></div>
        `;
        listEl.appendChild(item);
      });

      listEl.querySelectorAll(".delete-note-btn").forEach(b => {
        b.addEventListener("click", (e) => {
          const i = parseInt(e.target.dataset.idx);
          deleteNote(i);
        });
      });
    } catch (e) {}
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function saveNote() {
    const text = input.value.trim();
    if (!text) return;
    try {
      const notes = JSON.parse(localStorage.getItem("mylove_notes") || "[]");
      const d = new Date();
      const dateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear() + 543} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      notes.unshift({ text: text, date: dateStr });
      localStorage.setItem("mylove_notes", JSON.stringify(notes));
      input.value = "";
      loadNotes();
      createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 8);
    } catch (e) {}
  }

  function deleteNote(idx) {
    try {
      const notes = JSON.parse(localStorage.getItem("mylove_notes") || "[]");
      notes.splice(idx, 1);
      localStorage.setItem("mylove_notes", JSON.stringify(notes));
      loadNotes();
    } catch (e) {}
  }

  saveBtn.addEventListener("click", saveNote);
  loadNotes();
}


// ===== FIREWORKS ENGINE =====
let launchFireworks = () => {};

function initFireworksEngine() {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  const fireworks = [];
  const colors = ["#FF8FAB", "#FF2A7A", "#C9B1FF", "#FFD3B6", "#FFD700"];

  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1;
      this.gravity = 0.08;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.size = Math.random() * 3 + 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.vy += this.gravity;
      this.x += this.vx; this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let animFrameId = null;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      p.update(); p.draw();
      if (p.alpha <= 0) fireworks.splice(i, 1);
    }
    if (fireworks.length > 0) {
      animFrameId = requestAnimationFrame(animate);
    } else {
      animFrameId = null;
      ctx.clearRect(0, 0, width, height);
    }
  }

  launchFireworks = (x, y, count = 35) => {
    for (let i = 0; i < count; i++) fireworks.push(new Particle(x, y));
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(animate);
    }
  };
}

// ===== HEART BURST EFFECT =====
function createHeartBurst(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.textContent = ["💕", "💖", "✨", "🌸", "❤️"][Math.floor(Math.random() * 5)];
    h.style.cssText = `
      position: fixed;
      left: ${x}px; top: ${y}px;
      font-size: ${Math.random() * 1 + 0.8}rem;
      pointer-events: none; z-index: 9999;
    `;
    document.body.appendChild(h);

    const angle = (Math.random() * 360 * Math.PI) / 180;
    const distance = Math.random() * 70 + 30;

    gsap.to(h, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 30,
      scale: 0.2, opacity: 0,
      duration: Math.random() * 0.6 + 0.4,
      ease: "power2.out",
      onComplete: () => h.remove()
    });
  }
}

// ===== CELEBRATION CONFETTI =====
function initConfettiBtn() {
  const btn = document.getElementById("confetti-btn");
  btn.addEventListener("click", () => {
    launchFireworks(window.innerWidth / 2, window.innerHeight / 3, 40);
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
  });
}

function initGlobalTapBurst() {
  window.addEventListener("touchstart", unlockAudioEngine, { once: true, passive: true });
  window.addEventListener("click", (e) => {
    unlockAudioEngine();
    const target = e.target.closest("button, .nav-dock-item, .key, .timeline-card");
    if (target) {
      const rect = target.getBoundingClientRect();
      createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 4);
    }
  });
}

// ===== TOUCH & CURSOR SPARKLE TRAIL =====
function initTouchSparkleTrail() {
  const frame = document.querySelector(".app-frame");
  if (!frame) return;

  const sparkles = ["💕", "✨", "🌸", "⭐", "💖"];
  let lastX = 0, lastY = 0;

  function spawnSparkle(x, y) {
    const el = document.createElement("div");
    el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    const rect = frame.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    el.style.cssText = `
      position: absolute;
      left: ${relX}px;
      top: ${relY}px;
      font-size: ${Math.random() * 0.6 + 0.7}rem;
      pointer-events: none;
      z-index: 999;
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      transition: transform 0.6s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.6s ease;
    `;
    frame.appendChild(el);

    requestAnimationFrame(() => {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = -Math.random() * 35 - 10;
      el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0.3)`;
      el.style.opacity = "0";
    });

    setTimeout(() => el.remove(), 600);
  }

  function handleMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const dist = Math.hypot(clientX - lastX, clientY - lastY);
    if (dist > 18) {
      spawnSparkle(clientX, clientY);
      lastX = clientX;
      lastY = clientY;
    }
  }

  frame.addEventListener("mousemove", handleMove);
  frame.addEventListener("touchmove", handleMove, { passive: true });
}

// ===== 3D TILT INTERACTIVE MOTION =====
function init3DTiltEffects() {
  const cards = document.querySelectorAll(".hero-card, .timeline-card, .calendar-card, .envelope-sealed-card, .masonry-item");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power1.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });
}

// ===== AMBIENT FLOATING HEARTS BACKGROUND EMITTER =====
function initFloatingAmbientHearts() {
  const frame = document.querySelector(".app-frame");
  if (!frame) return;

  const heartIcons = ["💕", "💖", "🌸", "✨", "💗", "🌟"];

  setInterval(() => {
    // Limit maximum active ambient hearts to 5 for high performance
    const activeHearts = frame.querySelectorAll(".ambient-floating-heart");
    if (activeHearts.length >= 5) return;

    const h = document.createElement("div");
    h.className = "ambient-floating-heart";
    h.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    const startX = Math.random() * frame.clientWidth;
    const size = Math.random() * 0.5 + 0.7;

    h.style.cssText = `
      position: absolute;
      left: ${startX}px;
      bottom: -20px;
      font-size: ${size}rem;
      pointer-events: none !important;
      z-index: 2;
      opacity: ${Math.random() * 0.5 + 0.3};
      will-change: transform, opacity;
    `;
    frame.appendChild(h);

    const driftX = (Math.random() - 0.5) * 60;
    const duration = Math.random() * 4 + 5;

    gsap.to(h, {
      y: -frame.clientHeight - 40,
      x: driftX,
      rotation: Math.random() * 180 - 90,
      opacity: 0,
      duration: duration,
      ease: "power1.out",
      onComplete: () => h.remove()
    });
  }, 2200);
}

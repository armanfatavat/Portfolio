/* ==========================================================================
   FATAVAT ARMAN - AI/ML PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initTheme();
  initModals();
});

/* Persistent light/dark theme control */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  let saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (e) { /* storage unavailable */ }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.innerHTML = theme === 'dark' ? '<span aria-hidden="true">☀</span>' : '<span aria-hidden="true">◐</span>';
  };

  setTheme(saved || (prefersDark ? 'dark' : 'light'));
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* ignore */ }
    setTheme(next);
  });
}

/* Mobile Nav Toggle */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');

  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove('active');
    toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const isOpen = links.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      links.classList.add('active');
      toggle.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  toggle.addEventListener('click', toggleMenu);

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

/* Highlight the nav link of the section currently in view */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const map = new Map();
  navLinks.forEach(link => {
    const id = (link.getAttribute('href') || '').replace('#', '');
    const section = id ? document.getElementById(id) : null;
    if (section) map.set(section, link);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('active'));
      const link = map.get(entry.target);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  map.forEach((_, section) => observer.observe(section));
}

/* Case Study Modals & Demos */
const caseStudies = {
  studymate: {
    title: "StudyMate AI – RAG-Powered Study Assistant",
    problem: "Students collect study material across PDFs, text files, notes, and web pages, and finding specific answers in it is slow. They need a way to ask questions and get answers they can trace back to their own sources.",
    data: "User-provided study material: PDF documents, TXT files, notes, and content from URLs.",
    approach: "Built a Retrieval-Augmented Generation (RAG) pipeline with LangChain. Uploaded content is ingested, relevant passages are retrieved for each question, and an LLM uses them to produce contextual summaries and source-grounded answers.",
    evaluation: "Checked that answers stay grounded in the uploaded material and that summaries reflect the source content.",
    deployment: "Delivered as an interactive Streamlit application where users upload materials and hold a conversation with them.",
    type: "rag"
  },
  smartcrop: {
    title: "SmartCrop – Crop Recommendation System",
    problem: "Farmers need data-driven guidance on which crop suits their land, based on soil nutrient measurements and local climate conditions.",
    data: "Tabular data with soil Nitrogen, Phosphorus, and Potassium (NPK) levels, plus temperature, humidity, pH, and rainfall.",
    approach: "Built an end-to-end pipeline in Python covering preprocessing, feature scaling, model training, and prediction with Scikit-learn, using Pandas and NumPy for data handling.",
    evaluation: "Evaluated the multi-class classifier on held-out data with standard classification metrics.",
    deployment: "Integrated the trained model with a FastAPI backend and a responsive frontend for real-time crop recommendations.",
    type: "crop"
  },
  houseprice: {
    title: "House Price Prediction",
    problem: "Estimating a property's value means weighing several features together, such as size, quality, age, and amenities.",
    data: "Tabular housing data with physical features of each property and its sale price.",
    approach: "Built during the Edunet Foundation (AICTE approved) internship using Python. Applied Pandas and NumPy for preprocessing and feature engineering, then trained a regression model with Scikit-learn.",
    evaluation: "Evaluated model predictions on unseen data using regression metrics.",
    deployment: "Delivered as a Python machine learning project with a complete preprocessing, training, and evaluation workflow.",
    type: "valuation"
  }
};

function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  const btns = document.querySelectorAll('.cs-btn');

  if (!overlay) return;

  let lastFocused = null;

  const renderDemo = (type) => {
    if (type === 'crop') return renderCropSim();
    if (type === 'valuation') return renderValSim();
    return renderRagFlow();
  };

  const demoTitle = (type) => type === 'rag' ? 'HOW THE RAG PIPELINE WORKS' : 'ILLUSTRATIVE MODEL DEMO';

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-proj');
      const cs = caseStudies[key];
      if (!cs) return;

      lastFocused = btn;
      title.textContent = cs.title;
      body.innerHTML = `
        <div class="cs-block">
          <div class="cs-block-title">01 — PROBLEM STATEMENT</div>
          <p>${cs.problem}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">02 — DATA</div>
          <p>${cs.data}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">03 — APPROACH</div>
          <p>${cs.approach}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">04 — EVALUATION & DEPLOYMENT</div>
          <p>${cs.evaluation}</p>
          <p style="margin-top:0.4rem;">${cs.deployment}</p>
        </div>

        <div class="sim-container">
          <span class="sim-title">⚡ ${demoTitle(cs.type)}</span>
          ${renderDemo(cs.type)}
        </div>
      `;

      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();

      if (cs.type === 'crop') setupCropSim();
      if (cs.type === 'valuation') setupValSim();
    });
  });

  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
}

/* StudyMate AI: simple pipeline overview (no fake model output) */
function renderRagFlow() {
  return `
    <div class="sim-inputs">
      <div class="sim-field">
        <label>1. Ingest</label>
        <span style="font-size:0.85rem; color:var(--text-body);">PDF, TXT, notes, and URLs are loaded as study material.</span>
      </div>
      <div class="sim-field">
        <label>2. Retrieve</label>
        <span style="font-size:0.85rem; color:var(--text-body);">The passages most relevant to the question are found.</span>
      </div>
      <div class="sim-field">
        <label>3. Generate</label>
        <span style="font-size:0.85rem; color:var(--text-body);">An LLM answers using only that retrieved context.</span>
      </div>
      <div class="sim-field">
        <label>4. Converse</label>
        <span style="font-size:0.85rem; color:var(--text-body);">Follow-up questions continue in a Streamlit chat.</span>
      </div>
    </div>
    <div class="sim-output-box">
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">STACK</div>
      <div class="sim-output-val" style="font-size:1.05rem;">Python · LangChain · LLMs · Streamlit</div>
    </div>
  `;
}

/* SmartCrop: rule-based illustration, not the trained model */
function renderCropSim() {
  return `
    <div class="sim-inputs">
      <div class="sim-field">
        <label>Nitrogen (N): <span id="lbl-n">90</span> mg/kg</label>
        <input type="range" id="sim-n" min="0" max="140" value="90">
      </div>
      <div class="sim-field">
        <label>Phosphorus (P): <span id="lbl-p">42</span> mg/kg</label>
        <input type="range" id="sim-p" min="5" max="145" value="42">
      </div>
      <div class="sim-field">
        <label>Potassium (K): <span id="lbl-k">43</span> mg/kg</label>
        <input type="range" id="sim-k" min="5" max="205" value="43">
      </div>
      <div class="sim-field">
        <label>Rainfall: <span id="lbl-rf">200</span> mm</label>
        <input type="range" id="sim-rf" min="20" max="300" value="200">
      </div>
    </div>
    <div class="sim-output-box">
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">SAMPLE RECOMMENDATION</div>
      <div class="sim-output-val" id="crop-res">Rice</div>
    </div>
    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.75rem;">
      Simple rules for illustration only. The real SmartCrop model is a trained Scikit-learn classifier served through FastAPI.
    </p>
  `;
}

function setupCropSim() {
  const n = document.getElementById('sim-n');
  const p = document.getElementById('sim-p');
  const k = document.getElementById('sim-k');
  const rf = document.getElementById('sim-rf');
  const out = document.getElementById('crop-res');

  const calc = () => {
    document.getElementById('lbl-n').textContent = n.value;
    document.getElementById('lbl-p').textContent = p.value;
    document.getElementById('lbl-k').textContent = k.value;
    document.getElementById('lbl-rf').textContent = rf.value;

    const nV = parseInt(n.value);
    const pV = parseInt(p.value);
    const kV = parseInt(k.value);
    const rfV = parseInt(rf.value);

    if (rfV > 180 && nV > 70) out.textContent = "Rice 🌾";
    else if (kV > 150) out.textContent = "Apple 🍎 / Banana 🍌";
    else if (nV < 30 && pV > 60) out.textContent = "Chickpea 🫘";
    else if (rfV < 70) out.textContent = "Maize 🌽 / Moth Beans";
    else out.textContent = "Cotton 🧵 / Coffee ☕";
  };

  [n, p, k, rf].forEach(el => el.addEventListener('input', calc));
  calc();
}

/* House Price Prediction: linear illustration, not the trained model */
function renderValSim() {
  return `
    <div class="sim-inputs">
      <div class="sim-field">
        <label>Living Area: <span id="lbl-sqft">1800</span> sqft</label>
        <input type="range" id="sim-sqft" min="600" max="4000" value="1800" step="50">
      </div>
      <div class="sim-field">
        <label>Overall Quality (1-10): <span id="lbl-qual">7</span></label>
        <input type="range" id="sim-qual" min="1" max="10" value="7">
      </div>
      <div class="sim-field">
        <label>Year Built: <span id="lbl-year">2005</span></label>
        <input type="range" id="sim-year" min="1920" max="2024" value="2005">
      </div>
      <div class="sim-field">
        <label>Garage Cars: <span id="lbl-gar">2</span></label>
        <input type="range" id="sim-gar" min="0" max="4" value="2">
      </div>
    </div>
    <div class="sim-output-box">
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">SAMPLE PRICE ESTIMATE</div>
      <div class="sim-output-val" id="val-res">$215,000</div>
    </div>
    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.75rem;">
      A simple formula for illustration only, not the trained Scikit-learn model.
    </p>
  `;
}

function setupValSim() {
  const sqft = document.getElementById('sim-sqft');
  const qual = document.getElementById('sim-qual');
  const year = document.getElementById('sim-year');
  const gar = document.getElementById('sim-gar');
  const out = document.getElementById('val-res');

  const calc = () => {
    document.getElementById('lbl-sqft').textContent = sqft.value;
    document.getElementById('lbl-qual').textContent = qual.value;
    document.getElementById('lbl-year').textContent = year.value;
    document.getElementById('lbl-gar').textContent = gar.value;

    const sqV = parseInt(sqft.value);
    const qV = parseInt(qual.value);
    const yV = parseInt(year.value);
    const gV = parseInt(gar.value);

    const price = 30000 + (sqV * 72) + (qV * 18500) + ((yV - 1950) * 450) + (gV * 9500);
    out.textContent = `$${price.toLocaleString('en-US')}`;
  };

  [sqft, qual, year, gar].forEach(el => el.addEventListener('input', calc));
  calc();
}

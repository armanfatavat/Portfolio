/* ==========================================================================
   FATAVAT ARMAN - DATA SCIENCE PORTFOLIO INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initModals();
});

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

/* Case Study Modals & ML Simulators */
const caseStudies = {
  smartcrop: {
    title: "SmartCrop – Crop Recommendation System",
    problem: "Farmers require data-driven guidance on selecting suitable crops based on soil nutrient measurements (N, P, K) and localized climate conditions to optimize agricultural yield.",
    data: "Tabular dataset comprising soil Nitrogen, Phosphorus, Potassium levels along with ambient Temperature (°C), Humidity (%), pH level, and annual Rainfall (mm).",
    approach: "Cleaned raw dataset, handled missing entries, performed StandardScaler feature scaling, and trained multi-class classification estimators using Scikit-learn.",
    evaluation: "Evaluated classification accuracy using Confusion Matrices, Precision, Recall, and F1-score metrics.",
    deployment: "Serialized model pipeline with Joblib and deployed via a Flask REST API backend with real-time web interface.",
    type: "crop"
  },
  smartvaluation: {
    title: "SmartValuation – House Price Prediction System",
    problem: "Estimating real estate property values accurately requires capturing complex structural feature interactions and high-cardinality neighborhood variables without overfitting.",
    data: "Ames Housing Dataset containing detailed physical features (living area square footage, overall quality rating, year built, basement square footage, garage capacity, and sale prices).",
    approach: "Executed preprocessing pipeline involving missing value imputation, One-Hot Encoding for categorical features, standard scaling, and XGBoost regression algorithm tuning.",
    evaluation: "Measured predictive accuracy using Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R² metrics.",
    deployment: "Serialized XGBoost pipeline and served predictions via a Flask REST API web application.",
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

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-proj');
      const cs = caseStudies[key];
      if (!cs) return;

      title.textContent = cs.title;
      body.innerHTML = `
        <div class="cs-block">
          <div class="cs-block-title">01 — PROBLEM STATEMENT</div>
          <p>${cs.problem}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">02 — DATASET & PREPROCESSING</div>
          <p>${cs.data}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">03 — MODELING APPROACH</div>
          <p>${cs.approach}</p>
        </div>

        <div class="cs-block">
          <div class="cs-block-title">04 — EVALUATION & DEPLOYMENT</div>
          <p>${cs.evaluation}</p>
          <p style="margin-top:0.4rem;">${cs.deployment}</p>
        </div>

        <div class="sim-container">
          <span class="sim-title">⚡ INTERACTIVE MODEL SIMULATOR DEMO</span>
          ${cs.type === 'crop' ? renderCropSim() : renderValSim()}
        </div>
      `;

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (cs.type === 'crop') setupCropSim();
      if (cs.type === 'valuation') setupValSim();
    });
  });

  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
}

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
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">PREDICTED OPTIMAL CROP</div>
      <div class="sim-output-val" id="crop-res">Rice</div>
    </div>
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
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">ESTIMATED AMES HOUSING VALUE</div>
      <div class="sim-output-val" id="val-res">$215,000</div>
    </div>
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

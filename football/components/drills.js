/**
 * DRILL LIBRARY & GENERATOR MODULE (drills.js)
 * Manages drill repositories, age filters, and the interactive Simulated AI Drill Generator.
 */

window.DrillsComponent = {
  render() {
    const drills = window.db.getDrills();
    
    return `
      <div class="page-header">
        <div>
          <h2 class="page-title">Tactical Drill Library</h2>
          <p class="page-subtitle">Browse preloaded soccer drill catalogs, filter by positional attributes, or leverage the AI Drill Generator.</p>
        </div>
        <button class="btn btn-primary" onclick="DrillsComponent.openCreateModal()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Custom Drill
        </button>
      </div>

      <!-- AI TACTICAL DRILL GENERATOR BOARD (HIGH-ENERGY BOX) -->
      <div class="card generator-card">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 1.4rem;">🤖</span>
          <h3 style="font-family: var(--font-display); font-weight: 800; letter-spacing: -0.01em;">AI Pitch-Side Drill Generator</h3>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; max-width: 800px;">
          Need a drill immediately on the turf? Choose your team age bracket and target focus area, and our simulated tactical engine will draft a complete set of setup parameters, instructions, and coaching points.
        </p>
        
        <div class="generator-form">
          <div class="form-group" style="flex-grow: 1; min-width: 200px;">
            <label class="form-label" for="gen-ageGroup">Target Age Group</label>
            <select id="gen-ageGroup" class="form-select">
              <option value="U9">Under-9 (U9)</option>
              <option value="U11">Under-11 (U11)</option>
              <option value="U13">Under-13 (U13)</option>
              <option value="U15">Under-15 (U15)</option>
              <option value="U17" selected>Under-17 (U17)</option>
              <option value="Senior">Seniors / Adults</option>
            </select>
          </div>

          <div class="form-group" style="flex-grow: 1; min-width: 200px;">
            <label class="form-label" for="gen-focusArea">Session Focus Area</label>
            <select id="gen-focusArea" class="form-select">
              <option value="Technical" selected>Technical Skills (Dribbling, Passing)</option>
              <option value="Tactical">Tactical Strategies (Pressing, Shapes)</option>
              <option value="Physical">Physical Conditioning (Agility, Speed)</option>
              <option value="Psychological">Psychological Mindset (Reaction, Scanning)</option>
            </select>
          </div>

          <button type="button" class="btn btn-primary" style="height: 48px;" onclick="DrillsComponent.simulateAIGeneration()">
            <span>Generate Pitch Drill</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>

        <!-- Dynamic Loader Widget -->
        <div id="ai-generator-loader" style="display: none; margin-top: 24px; text-align: center; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: var(--radius-md); border: 1px solid rgba(57, 255, 20, 0.1);">
          <div style="width: 36px; height: 36px; border: 3px solid rgba(57, 255, 20, 0.1); border-top-color: var(--accent-green); border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; margin-bottom: 12px;"></div>
          <h4 id="ai-loader-text" style="color: var(--accent-green); font-family: var(--font-display); font-weight: 700;">Running tactical engine...</h4>
          <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">Formulating instructions and scanning coaching triggers.</p>
        </div>
      </div>

      <!-- General Filters & Search -->
      <div class="card" style="margin-bottom: 24px; padding: 16px;">
        <div class="filters-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" id="drill-search" class="search-input" placeholder="Search drill title..." oninput="DrillsComponent.applyFilters()">
          </div>

          <div class="filter-group">
            <button class="filter-chip active" id="fd-focus-all" onclick="DrillsComponent.filterFocus('ALL')">All Areas</button>
            <button class="filter-chip" id="fd-focus-tech" onclick="DrillsComponent.filterFocus('Technical')">Technical</button>
            <button class="filter-chip" id="fd-focus-tact" onclick="DrillsComponent.filterFocus('Tactical')">Tactical</button>
            <button class="filter-chip" id="fd-focus-phys" onclick="DrillsComponent.filterFocus('Physical')">Physical</button>
            <button class="filter-chip" id="fd-focus-psyc" onclick="DrillsComponent.filterFocus('Psychological')">Psychological</button>
          </div>

          <div class="filter-group">
            <button class="filter-chip active" id="fd-age-all" onclick="DrillsComponent.filterAge('ALL')">All Ages</button>
            <button class="filter-chip" id="fd-age-u11" onclick="DrillsComponent.filterAge('U11')">U11</button>
            <button class="filter-chip" id="fd-age-u13" onclick="DrillsComponent.filterAge('U13')">U13</button>
            <button class="filter-chip" id="fd-age-u15" onclick="DrillsComponent.filterAge('U15')">U15</button>
            <button class="filter-chip" id="fd-age-u17" onclick="DrillsComponent.filterAge('U17')">U17</button>
            <button class="filter-chip" id="fd-age-senior" onclick="DrillsComponent.filterAge('Senior')">Senior</button>
          </div>
        </div>
      </div>

      <!-- Drill Cards Grid Deck -->
      <div class="drills-grid" id="drills-cards-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  },

  init() {
    this.currentFocusFilter = 'ALL';
    this.currentAgeFilter = 'ALL';
    this.renderDrillsGrid();
  },

  renderDrillsGrid() {
    const drills = window.db.getDrills();
    const searchVal = document.getElementById('drill-search')?.value.toLowerCase() || '';
    const container = document.getElementById('drills-cards-container');
    if (!container) return;

    // Apply Filter Rules
    const filteredDrills = drills.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchVal);
      const matchesFocus = this.currentFocusFilter === 'ALL' || d.focusArea === this.currentFocusFilter;
      const matchesAge = this.currentAgeFilter === 'ALL' || d.ageGroup === this.currentAgeFilter;
      return matchesSearch && matchesFocus && matchesAge;
    });

    if (filteredDrills.length === 0) {
      container.innerHTML = `
        <div class="card full-width" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
          <h3 style="color: var(--text-secondary); margin-bottom: 8px;">No Drills Found</h3>
          <p style="color: var(--text-muted);">Try adjusting your filter search or run the AI Drill Generator above.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredDrills.map(d => {
      const instructionsLi = d.instructions.map(i => `<li>${i}</li>`).join('');
      const coachingLi = d.coachingPoints.map(c => `<li>${c}</li>`).join('');
      
      return `
        <div class="card drill-card">
          <div class="drill-card-header">
            <h3 class="drill-title">${d.title}</h3>
            <div class="drill-meta">
              <span class="player-badge badge-position" style="background: rgba(57, 255, 20, 0.08); color: var(--accent-green); border-color: rgba(57, 255, 20, 0.2);">${d.focusArea}</span>
              <span class="player-badge badge-position">${d.ageGroup} Group</span>
            </div>
          </div>

          <div class="pitch-setup"></div>
          
          <div class="drill-content">
            <div>
              <span class="drill-section-title">Field Setup</span>
              <div class="drill-setup">${d.setupDetails}</div>
            </div>

            <div>
              <span class="drill-section-title">Equipment Needed</span>
              <div class="drill-equipment">${d.equipmentNeeded || 'Standard matchday kit.'}</div>
            </div>

            <div>
              <span class="drill-section-title">Step-by-Step Execution</span>
              <ol class="drill-list">${instructionsLi}</ol>
            </div>

            <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-color); padding: 12px 16px; border-radius: var(--radius-md); margin-top: auto;">
              <span class="drill-section-title" style="color: var(--accent-green);">Coaching Key Triggers</span>
              <ul class="drill-list" style="list-style-type: square; padding-left: 16px; color: var(--text-primary); margin-top: 4px;">${coachingLi}</ul>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  applyFilters() {
    this.renderDrillsGrid();
  },

  filterFocus(focus) {
    this.currentFocusFilter = focus;
    ['ALL', 'Technical', 'Tactical', 'Physical', 'Psychological'].forEach(f => {
      const tag = f === 'ALL' ? 'all' : f.substring(0, 4).toLowerCase();
      const el = document.getElementById(`fd-focus-${tag}`);
      if (el) el.classList.toggle('active', f === focus);
    });
    this.renderDrillsGrid();
  },

  filterAge(age) {
    this.currentAgeFilter = age;
    ['ALL', 'U11', 'U13', 'U15', 'U17', 'Senior'].forEach(a => {
      const el = document.getElementById(`fd-age-${a.toLowerCase()}`);
      if (el) el.classList.toggle('active', a === age);
    });
    this.renderDrillsGrid();
  },

  simulateAIGeneration() {
    const age = document.getElementById('gen-ageGroup').value;
    const focus = document.getElementById('gen-focusArea').value;
    const loader = document.getElementById('ai-generator-loader');
    const loaderText = document.getElementById('ai-loader-text');

    if (!loader) return;

    // Show Loader
    loader.style.display = 'block';

    const steps = [
      'Scanning player metrics database...',
      'Mapping technical grid layouts...',
      'Synthesizing step-by-step coaching cues...',
      'Completing drill design!'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        loaderText.innerText = steps[i];
        i++;
      } else {
        clearInterval(interval);
        
        // Generate actual custom structured drill data
        const generated = this.getAITemplate(focus, age);
        window.db.createDrill(generated);

        loader.style.display = 'none';
        window.App.toast(`Generated drill: "${generated.title}"! Added to library.`);
        
        // Reload library list
        window.App.loadView();
      }
    }, 600);
  },

  getAITemplate(focus, age) {
    const templates = {
      Technical: {
        title: `AI Speed Passing & Control Grid (${age})`,
        setupDetails: 'A 15x15 yard square. Four players stand on the corners, two players actively passing in the center.',
        equipmentNeeded: '6 Cones, 2 Footballs, 2 Agility bibs.',
        instructions: [
          'The outside player passes to the center midfielder.',
          'Midfielder intercepts, performs an instant half-turn to scan, and distributes to the opposite corner.',
          'Center players switch roles every 2 minutes of continuous high-tempo play.'
        ],
        coachingPoints: [
          'Focus on clean first touches directing the ball forward.',
          'Open hips to unlock 180 degree sightlines.',
          'Weight and speed of the pass.'
        ]
      },
      Tactical: {
        title: `AI High-Pressing Counter Transition (${age})`,
        setupDetails: '30x40 yard pitch grid with one primary keeper goal and two small wing gates.',
        equipmentNeeded: '10 Cones, full size nets, 2 sets of bibs.',
        instructions: [
          'Defending team works in blocks of 4 trying to clear the ball through side gates.',
          'Attacking team must trigger high vertical presses instantly upon losing possession.',
          'When attackers win the ball back, they must score in the primary keeper goal in under 8 seconds.'
        ],
        coachingPoints: [
          'The player closest to the ball must sprint to press, second player covers the diagonal lane.',
          'Compact vertical spacing to choke passing lanes.',
          'Rapid explosive mental transition from defending to finishing.'
        ]
      },
      Physical: {
        title: `AI Agility Sprint & Muscle Rebound (${age})`,
        setupDetails: 'Linear 25 yard drill path with hurdles, ladders, and speed gates.',
        equipmentNeeded: '5 agility hurdles, 1 ladder, 1 rebound board, stopwatch.',
        instructions: [
          'Player performs fast high-knees through the ladder.',
          'Instantly sprints to jump over hurdles.',
          'Executes an explosive wall-pass rebound, turns 180 degrees, and finishes with a full throttle sprint.'
        ],
        coachingPoints: [
          'Keep standard posture with high arm pumps.',
          'Short, quick foot contact times inside the ladder grids.',
          'Rapid deceleration and immediate weight shifts on turns.'
        ]
      },
      Psychological: {
        title: `AI Cognitive Gate Scanning Maze (${age})`,
        setupDetails: '25x25 yard grid containing 5 multi-colored gates scattered throughout.',
        equipmentNeeded: '10 Colored gates cones (Red, Yellow, Blue, Green, White), 4 Balls.',
        instructions: [
          'Play a standard 4v4 possession match.',
          'Before passing, a player must shout out the color of the nearest unoccupied gate.',
          'Points are scored by passing through the named gate to a teammate.'
        ],
        coachingPoints: [
          'Continuous scanning: players must scan off-the-ball every 3 seconds.',
          'Clear, early vocal cues to dictate teammates movements.',
          'High adaptability as gates clog and open up rapidly.'
        ]
      }
    };

    const t = templates[focus] || templates.Technical;
    return {
      title: `${t.title} - ${Date.now().toString().slice(-4)}`,
      setupDetails: t.setupDetails,
      equipmentNeeded: t.equipmentNeeded,
      instructions: t.instructions,
      coachingPoints: t.coachingPoints,
      ageGroup: age,
      focusArea: focus
    };
  },

  openCreateModal() {
    window.App.openModal('Add Custom Training Drill', `
      <form id="create-drill-form" onsubmit="DrillsComponent.handleCreate(event)">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label" for="dr-title">Drill Title</label>
            <input type="text" id="dr-title" class="form-input" placeholder="e.g. Tiki-Taka Triangles" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="dr-ageGroup">Age Group</label>
            <select id="dr-ageGroup" class="form-select" required>
              <option value="U7">U7</option>
              <option value="U9">U9</option>
              <option value="U11">U11</option>
              <option value="U13">U13</option>
              <option value="U15">U15</option>
              <option value="U17">U17</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="dr-focusArea">Focus Area</label>
            <select id="dr-focusArea" class="form-select" required>
              <option value="Technical">Technical</option>
              <option value="Tactical">Tactical</option>
              <option value="Physical">Physical</option>
              <option value="Psychological">Psychological</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="dr-setup">Setup Details</label>
            <textarea id="dr-setup" class="form-textarea" placeholder="e.g. 20x20 yard grid. Cones placed..." required></textarea>
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="dr-equipment">Equipment Needed</label>
            <input type="text" id="dr-equipment" class="form-input" placeholder="e.g. 8 Cones, 4 Footballs, Bibs">
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="dr-instructions">Step-by-Step Instructions (One instruction per line)</label>
            <textarea id="dr-instructions" class="form-textarea" placeholder="Step 1: Players line up...&#10;Step 2: On whistle..." required></textarea>
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="dr-coaching">Coaching Points (One point per line)</label>
            <textarea id="dr-coaching" class="form-textarea" placeholder="1. High intensity...&#10;2. Accurate passes..." required></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Drill</button>
        </div>
      </form>
    `);
  },

  handleCreate(e) {
    e.preventDefault();
    const drillData = {
      title: document.getElementById('dr-title').value.trim(),
      ageGroup: document.getElementById('dr-ageGroup').value,
      focusArea: document.getElementById('dr-focusArea').value,
      setupDetails: document.getElementById('dr-setup').value.trim(),
      equipmentNeeded: document.getElementById('dr-equipment').value.trim(),
      instructions: document.getElementById('dr-instructions').value,
      coachingPoints: document.getElementById('dr-coaching').value
    };

    if (!drillData.title || !drillData.setupDetails || !drillData.instructions) {
      window.App.toast('Please fill in all required fields.', 'error');
      return;
    }

    window.db.createDrill(drillData);
    
    window.App.closeModal();
    window.App.toast(`Successfully saved "${drillData.title}"!`);
    window.App.loadView();
  }
};

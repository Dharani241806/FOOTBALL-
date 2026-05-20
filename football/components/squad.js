/**
 * SQUAD ROSTER MANAGEMENT MODULE (squad.js)
 * Manages player onboarding, card grid displays, position chips, and fitness filter rules.
 */

window.SquadComponent = {
  render() {
    const players = window.db.getPlayers();
    
    return `
      <div class="page-header">
        <div>
          <h2 class="page-title">Squad Roster</h2>
          <p class="page-subtitle">Manage player details, injuries, positions, and drill performance assignments.</p>
        </div>
        <button class="btn btn-primary" onclick="SquadComponent.openOnboardModal()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Onboard New Player
        </button>
      </div>

      <!-- Quick Summary Stats Widget Bar -->
      <div class="stats-deck">
        <div class="stat-widget">
          <span class="stat-title">Total Players</span>
          <span class="stat-val" id="stat-total-players">${players.length}</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">Healthy Squad</span>
          <span class="stat-val accent" id="stat-healthy">${players.filter(p => p.injuryStatus === 'Healthy').length}</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">In Reconditioning</span>
          <span class="stat-val" style="color: var(--color-recon)" id="stat-recon">${players.filter(p => p.injuryStatus === 'Reconditioning').length}</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">Injured List</span>
          <span class="stat-val" style="color: var(--color-injured)" id="stat-injured">${players.filter(p => p.injuryStatus === 'Injured').length}</span>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="card" style="margin-bottom: 24px; padding: 16px;">
        <div class="filters-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" id="squad-search" class="search-input" placeholder="Search player name..." oninput="SquadComponent.applyFilters()">
          </div>

          <div class="filter-group">
            <button class="filter-chip active" id="f-pos-all" onclick="SquadComponent.filterPosition('ALL')">All Positions</button>
            <button class="filter-chip" id="f-pos-att" onclick="SquadComponent.filterPosition('ATT')">Attackers</button>
            <button class="filter-chip" id="f-pos-mid" onclick="SquadComponent.filterPosition('MID')">Midfielders</button>
            <button class="filter-chip" id="f-pos-def" onclick="SquadComponent.filterPosition('DEF')">Defenders</button>
            <button class="filter-chip" id="f-pos-gk" onclick="SquadComponent.filterPosition('GK')">GK</button>
          </div>

          <div class="filter-group">
            <button class="filter-chip active" id="f-fit-all" onclick="SquadComponent.filterFitness('ALL')">All Fitness</button>
            <button class="filter-chip" id="f-fit-healthy" onclick="SquadComponent.filterFitness('Healthy')">Healthy</button>
            <button class="filter-chip" id="f-fit-recon" onclick="SquadComponent.filterFitness('Reconditioning')">Recon</button>
            <button class="filter-chip" id="f-fit-injured" onclick="SquadComponent.filterFitness('Injured')">Injured</button>
          </div>
        </div>
      </div>

      <!-- Active Squad Roster Cards Grid -->
      <div class="squad-grid" id="squad-cards-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  },

  init() {
    this.currentPositionFilter = 'ALL';
    this.currentFitnessFilter = 'ALL';
    this.renderSquadGrid();
  },

  renderSquadGrid() {
    const players = window.db.getPlayers();
    const searchVal = document.getElementById('squad-search')?.value.toLowerCase() || '';
    const container = document.getElementById('squad-cards-container');
    if (!container) return;

    // Apply Filter Rules
    const filteredPlayers = players.filter(p => {
      // Search Name Match
      const matchesSearch = p.fullName.toLowerCase().includes(searchVal);
      
      // Position Match
      let matchesPosition = true;
      if (this.currentPositionFilter === 'GK') {
        matchesPosition = p.primaryPosition === 'GK';
      } else if (this.currentPositionFilter === 'ATT') {
        matchesPosition = ['ST', 'LW', 'RW'].includes(p.primaryPosition);
      } else if (this.currentPositionFilter === 'MID') {
        matchesPosition = ['CM', 'CDM', 'CAM'].includes(p.primaryPosition);
      } else if (this.currentPositionFilter === 'DEF') {
        matchesPosition = ['CB', 'LB', 'RB'].includes(p.primaryPosition);
      }

      // Fitness Match
      let matchesFitness = true;
      if (this.currentFitnessFilter !== 'ALL') {
        matchesFitness = p.injuryStatus === this.currentFitnessFilter;
      }

      return matchesSearch && matchesPosition && matchesFitness;
    });

    if (filteredPlayers.length === 0) {
      container.innerHTML = `
        <div class="card full-width" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
          <h3 style="color: var(--text-secondary); margin-bottom: 8px;">No Players Found</h3>
          <p style="color: var(--text-muted);">Try adjusting your filter search or onboard a new squad member.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredPlayers.map(p => {
      const injuryClass = p.injuryStatus.toLowerCase();
      const initials = p.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);
      
      const avatarContent = p.photo 
        ? `<img src="${p.photo}" class="player-avatar-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />` 
        : initials;
      
      return `
        <div class="card player-card ${injuryClass}">
          <div class="player-jersey-number">${p.jerseyNumber}</div>
          <div class="player-card-header">
            <div class="player-avatar" style="padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">${avatarContent}</div>
            <div>
              <h3 class="player-name">${p.fullName}</h3>
              <span class="player-badge badge-position">${p.primaryPosition}</span>
              <div>
                <span class="player-badge badge-injury ${injuryClass}">${p.injuryStatus}</span>
              </div>
            </div>
          </div>
          
          <div class="player-details-row">
            <div class="player-detail-item">
              <span class="detail-label">Secondary</span>
              <span class="detail-value">${p.secondaryPosition || 'None'}</span>
            </div>
            <div class="player-detail-item">
              <span class="detail-label">Pref. Foot</span>
              <span class="detail-value">${p.preferredFoot}</span>
            </div>
            <div class="player-detail-item" style="text-align: right;">
              <span class="detail-label">Age</span>
              <span class="detail-value">${p.age} yrs</span>
            </div>
          </div>

          <div class="player-card-actions">
            <a href="#reports?playerId=${p.id}" class="btn btn-primary" style="font-size: 0.8rem; padding: 8px 12px;">
              View Profile
            </a>
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 8px; flex-grow: 0;" onclick="SquadComponent.deletePlayer('${p.id}', '${p.fullName}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; stroke: var(--color-injured);">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  applyFilters() {
    this.renderSquadGrid();
  },

  filterPosition(pos) {
    this.currentPositionFilter = pos;
    // update active chip states
    ['ALL', 'ATT', 'MID', 'DEF', 'GK'].forEach(p => {
      const el = document.getElementById(`f-pos-${p.toLowerCase()}`);
      if (el) el.classList.toggle('active', p === pos);
    });
    this.renderSquadGrid();
  },

  filterFitness(fit) {
    this.currentFitnessFilter = fit;
    ['ALL', 'Healthy', 'Reconditioning', 'Injured'].forEach(f => {
      const tag = f === 'Reconditioning' ? 'recon' : f.toLowerCase();
      const el = document.getElementById(`f-fit-${tag}`);
      if (el) el.classList.toggle('active', f === fit);
    });
    this.renderSquadGrid();
  },

  openOnboardModal() {
    window.App.openModal('Onboard Squad Player', `
      <form id="onboard-form" onsubmit="SquadComponent.handleOnboard(event)">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label" for="ob-fullName">Player Full Name</label>
            <input type="text" id="ob-fullName" class="form-input" placeholder="e.g. Bukayo Saka" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="ob-age">Age</label>
            <input type="number" id="ob-age" class="form-input" min="4" max="60" placeholder="e.g. 21" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-jerseyNumber">Jersey Number</label>
            <input type="number" id="ob-jerseyNumber" class="form-input" min="1" max="99" placeholder="e.g. 7" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-primaryPosition">Primary Position</label>
            <select id="ob-primaryPosition" class="form-select" required>
              <option value="GK">Goalkeeper (GK)</option>
              <option value="CB">Center Back (CB)</option>
              <option value="LB">Left Back (LB)</option>
              <option value="RB">Right Back (RB)</option>
              <option value="CDM">Defensive Mid (CDM)</option>
              <option value="CM">Center Mid (CM)</option>
              <option value="CAM">Attacking Mid (CAM)</option>
              <option value="LW">Left Wing (LW)</option>
              <option value="RW">Right Wing (RW)</option>
              <option value="ST">Striker (ST)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-secondaryPosition">Secondary Position</label>
            <select id="ob-secondaryPosition" class="form-select">
              <option value="None">None</option>
              <option value="GK">Goalkeeper (GK)</option>
              <option value="CB">Center Back (CB)</option>
              <option value="LB">Left Back (LB)</option>
              <option value="RB">Right Back (RB)</option>
              <option value="CDM">Defensive Mid (CDM)</option>
              <option value="CM">Center Mid (CM)</option>
              <option value="CAM">Attacking Mid (CAM)</option>
              <option value="LW">Left Wing (LW)</option>
              <option value="RW">Right Wing (RW)</option>
              <option value="ST">Striker (ST)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-preferredFoot">Preferred Foot</label>
            <select id="ob-preferredFoot" class="form-select" required>
              <option value="Right">Right Foot</option>
              <option value="Left">Left Foot</option>
              <option value="Both">Both Feet</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-injuryStatus">Injury Status</label>
            <select id="ob-injuryStatus" class="form-select" required>
              <option value="Healthy">Healthy (Available)</option>
              <option value="Reconditioning">Reconditioning (Light Training)</option>
              <option value="Injured">Injured (Unavailable)</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="ob-photo">Player Photo (Optional)</label>
            <input type="file" id="ob-photo" class="form-input" accept="image/*">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save & Register Player</button>
        </div>
      </form>
    `);
  },

  handleOnboard(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('ob-photo');
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    const saveDetails = (photoBase64 = null) => {
      const playerData = {
        fullName: document.getElementById('ob-fullName').value.trim(),
        age: parseInt(document.getElementById('ob-age').value),
        primaryPosition: document.getElementById('ob-primaryPosition').value,
        secondaryPosition: document.getElementById('ob-secondaryPosition').value === 'None' ? null : document.getElementById('ob-secondaryPosition').value,
        jerseyNumber: parseInt(document.getElementById('ob-jerseyNumber').value),
        preferredFoot: document.getElementById('ob-preferredFoot').value,
        injuryStatus: document.getElementById('ob-injuryStatus').value,
        photo: photoBase64
      };

      // Validation checks
      if (!playerData.fullName || isNaN(playerData.age) || isNaN(playerData.jerseyNumber)) {
        window.App.toast('Please fill in all required fields.', 'error');
        return;
      }

      // Save to DB
      window.db.createPlayer(playerData);
      
      // Close modal, show toast, refresh view
      window.App.closeModal();
      window.App.toast(`${playerData.fullName} registered to roster successfully!`);
      
      // Refresh SPA squad page
      window.App.loadView();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        saveDetails(event.target.result);
      };
      reader.onerror = () => {
        saveDetails(null);
      };
      reader.readAsDataURL(file);
    } else {
      saveDetails(null);
    }
  },

  deletePlayer(id, name) {
    if (confirm(`Are you absolutely sure you want to release ${name} from the active roster? This will clear all attendance logs for this player.`)) {
      window.db.deletePlayer(id);
      window.App.toast(`${name} released from the club.`);
      window.App.loadView();
    }
  }
};

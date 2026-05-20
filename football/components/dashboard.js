/**
 * TEAM DASHBOARD & HUB COMPONENT (dashboard.js)
 * Serves as the landing page displaying club stats, tactical formation boards, and direct route navigations.
 */

window.DashboardComponent = {
  render() {
    const players = window.db.getPlayers();
    const sessions = window.db.getSessions();
    
    const totalPlayers = players.length;
    const healthyPlayers = players.filter(p => p.injuryStatus === 'Healthy').length;
    const avgAge = totalPlayers > 0 ? (players.reduce((sum, p) => sum + p.age, 0) / totalPlayers).toFixed(1) : 0;
    
    // Recent training session details
    const lastSession = sessions[0] ? `${sessions[0].focusArea} (${sessions[0].date})` : 'No sessions logged';

    return `
      <!-- High-Energy Club Hero Section -->
      <div class="card hero-card" style="margin-bottom: 28px;">
        <div class="hero-flex">
          <div class="hero-shield-wrapper" style="position: relative; width: 90px; height: 90px; flex-shrink: 0;">
            <!-- Dynamic Image Loader with Fail-safe Fallback -->
            <img src="team_logo.png" class="hero-shield-img" style="width: 100%; height: 100%; object-fit: contain; border-radius: 24px; box-shadow: 0 0 30px rgba(0, 240, 255, 0.3); display: none;" onload="document.getElementById('fallback-shield').style.display='none'; this.style.display='block';" onerror="this.style.display='none'; document.getElementById('fallback-shield').style.display='flex';" />
            <div class="hero-shield" id="fallback-shield" style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">PP</div>
          </div>
          <div class="hero-text-content">
            <span class="hero-academy-tag">OFFICIAL CLUB HUB</span>
            <h2 class="hero-club-title">PAKKA PAKKA FC</h2>
            <p class="hero-club-subtitle">U17 Youth Development Academy &bull; Tactical Pitch Portal</p>
            <div class="hero-badges">
              <span class="player-badge" style="background: rgba(0, 240, 255, 0.1); color: var(--accent-cyan); border-color: rgba(0, 240, 255, 0.25);">League Standing: 1st</span>
              <span class="player-badge" style="background: rgba(57, 255, 20, 0.1); color: var(--accent-green); border-color: rgba(57, 255, 20, 0.25);">Active Formation: 4-3-3 (Attack)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="stats-deck" style="margin-bottom: 28px;">
        <div class="stat-widget" style="border-left: 3px solid var(--accent-cyan);">
          <span class="stat-title">Squad Size</span>
          <span class="stat-val" style="color: var(--text-primary);">${totalPlayers} Active</span>
        </div>
        <div class="stat-widget" style="border-left: 3px solid var(--accent-green);">
          <span class="stat-title">Match Ready</span>
          <span class="stat-val accent">${healthyPlayers} Available</span>
        </div>
        <div class="stat-widget" style="border-left: 3px solid var(--color-recon);">
          <span class="stat-title">Average Age</span>
          <span class="stat-val" style="color: var(--color-recon);">${avgAge} Yrs</span>
        </div>
        <div class="stat-widget" style="border-left: 3px solid #a855f7;">
          <span class="stat-title">Last Activity</span>
          <span class="stat-val" style="font-size: 1.1rem; color: #a855f7; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastSession}</span>
        </div>
      </div>

      <!-- Main Columns: Tactics Board & Quick Navigation -->
      <div class="analytics-grid" style="margin-bottom: 28px;">
        
        <!-- Interactive Tactics Pitch Card -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3>Active Tactical Board</h3>
            <span class="player-badge badge-position" style="background: rgba(255,255,255,0.03);">4-3-3 ATTACK</span>
          </div>
          
          <div class="tactics-pitch-container">
            <div class="tactics-pitch">
              <!-- Grid Line divisions -->
              <div class="pitch-line center-circle"></div>
              <div class="pitch-line penalty-box top"></div>
              <div class="pitch-line penalty-box bottom"></div>
              
              <!-- Player Positions (4-3-3 Attacking) -->
              <!-- GK -->
              <div class="position-node gk" data-pos="GK"><span class="node-number">1</span><span class="node-label">GK</span></div>
              
              <!-- Defense (LB, CB, CB, RB) -->
              <div class="position-node lb" data-pos="LB"><span class="node-number">3</span><span class="node-label">LB</span></div>
              <div class="position-node cb1" data-pos="CB"><span class="node-number">4</span><span class="node-label">CB</span></div>
              <div class="position-node cb2" data-pos="CB"><span class="node-number">5</span><span class="node-label">CB</span></div>
              <div class="position-node rb" data-pos="RB"><span class="node-number">2</span><span class="node-label">RB</span></div>
              
              <!-- Midfield (CDM, CM, CAM) -->
              <div class="position-node cdm" data-pos="CDM"><span class="node-number">6</span><span class="node-label">CDM</span></div>
              <div class="position-node cm" data-pos="CM"><span class="node-number">8</span><span class="node-label">CM</span></div>
              <div class="position-node cam" data-pos="CAM"><span class="node-number">10</span><span class="node-label">CAM</span></div>
              
              <!-- Forwards (LW, ST, RW) -->
              <div class="position-node lw" data-pos="LW"><span class="node-number">11</span><span class="node-label">LW</span></div>
              <div class="position-node st" data-pos="ST"><span class="node-number">9</span><span class="node-label">ST</span></div>
              <div class="position-node rw" data-pos="RW"><span class="node-number">7</span><span class="node-label">RW</span></div>
            </div>
          </div>
          <p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 12px;">
            Hover over elements inside the tactical screen to analyze position configurations.
          </p>
        </div>

        <!-- Quick Navigation Panel Deck -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <div class="card hub-nav-card cyan-hover" onclick="window.location.hash = '#squad'">
            <div style="display: flex; gap: 16px; align-items: start;">
              <div class="hub-nav-icon cyan">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div style="flex-grow: 1;">
                <h4 class="hub-nav-title">Squad Roster Manager</h4>
                <p class="hub-nav-desc">Onboard active squad members, inspect medical reports, and search primary foot preferences.</p>
                <span class="hub-nav-link" style="color: var(--accent-cyan);">Browse Players &rarr;</span>
              </div>
            </div>
          </div>

          <div class="card hub-nav-card green-hover" onclick="window.location.hash = '#sessions'">
            <div style="display: flex; gap: 16px; align-items: start;">
              <div class="hub-nav-icon green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style="flex-grow: 1;">
                <h4 class="hub-nav-title">Training Logger & Analytics</h4>
                <p class="hub-nav-desc">Inspect team tactical focus summaries, log session durations, and track overall intensity ratings.</p>
                <span class="hub-nav-link" style="color: var(--accent-green);">View Practice Logs &rarr;</span>
              </div>
            </div>
          </div>

          <div class="card hub-nav-card purple-hover" onclick="window.location.hash = '#drills'">
            <div style="display: flex; gap: 16px; align-items: start;">
              <div class="hub-nav-icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div style="flex-grow: 1;">
                <h4 class="hub-nav-title">Drill Library & AI Planner</h4>
                <p class="hub-nav-desc">Browse pre-made positional catalogs, filter categories, or draft new sessions instantly with the AI generator.</p>
                <span class="hub-nav-link" style="color: #c084fc;">Open Library &rarr;</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Official Squad Group Photo Section -->
      <div class="card team-photo-card" style="margin-top: 28px; border-color: rgba(0, 240, 255, 0.12); box-shadow: 0 10px 30px rgba(0, 240, 255, 0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3>Official Squad Photo</h3>
          <span class="player-badge badge-position" style="background: rgba(0, 240, 255, 0.1); color: var(--accent-cyan); border-color: rgba(0, 240, 255, 0.25);">PAKKA PAKKA FC U17</span>
        </div>
        <div class="team-photo-container" style="position: relative; width: 100%; height: 340px; border-radius: var(--radius-md); overflow: hidden; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; transition: border-color 0.3s ease;">
          <!-- Team Photo Image -->
          <img src="team_photo.jpg" class="team-photo-img" style="width: 100%; height: 100%; object-fit: cover; display: none;" onload="document.getElementById('fallback-photo').style.display='none'; this.style.display='block';" onerror="this.style.display='none'; document.getElementById('fallback-photo').style.display='flex';" />
          <!-- Elegant Fallback Graphic -->
          <div class="team-photo-fallback" id="fallback-photo" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; color: var(--text-secondary); gap: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="width: 60px; height: 60px; stroke: var(--accent-cyan); filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.2));">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 2px;">Official Squad Group Picture</h4>
            <p style="max-width: 500px; font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);">
              Drop your custom team squad photo named <strong style="color: var(--accent-cyan);">team_photo.jpg</strong> into the project folder to replace this placeholder with your high-resolution team picture!
            </p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    // Standard initialization triggers
  }
};

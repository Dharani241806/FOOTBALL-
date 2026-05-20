/**
 * TRAINING SESSION LOGGER & ANALYTICS MODULE (sessions.js)
 * Manages daily session logging, overall squad metrics, and team-focus visualizations.
 */

window.SessionsComponent = {
  render() {
    const sessions = window.db.getSessions();
    const focusData = window.db.getTeamTrainingFocusData();
    
    // Quick aggregated stats
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgIntensity = totalSessions > 0 ? (sessions.reduce((sum, s) => sum + s.intensity, 0) / totalSessions).toFixed(1) : 0;
    
    // Find top focus area
    let topFocus = 'None';
    let maxFocusVal = -1;
    Object.keys(focusData).forEach(k => {
      if (focusData[k] > maxFocusVal) {
        maxFocusVal = focusData[k];
        topFocus = k;
      }
    });

    return `
      <div class="page-header">
        <div>
          <h2 class="page-title">Training Sessions</h2>
          <p class="page-subtitle">Log daily pitch sessions, manage tactical attendance, and review training focus cycles.</p>
        </div>
        <button class="btn btn-primary" onclick="SessionsComponent.openLogModal()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Log Practice Session
        </button>
      </div>

      <!-- Aggregated Analytics Metrics -->
      <div class="stats-deck">
        <div class="stat-widget">
          <span class="stat-title">Sessions Logged</span>
          <span class="stat-val">${totalSessions}</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">Total Minutes</span>
          <span class="stat-val accent">${totalDuration}m</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">Avg Intensity</span>
          <span class="stat-val" style="color: var(--color-recon)">${avgIntensity}/10</span>
        </div>
        <div class="stat-widget">
          <span class="stat-title">Primary Focus</span>
          <span class="stat-val" style="color: #60a5fa">${topFocus}</span>
        </div>
      </div>

      <!-- Core Analytics Chart Area -->
      <div class="analytics-grid">
        <div class="card analytics-card">
          <h3 style="margin-bottom: 20px;">Team Training Focus (Last 30 Days)</h3>
          <div style="flex-grow: 1; min-height: 250px; display: flex; align-items: center; justify-content: center; position: relative;">
            <canvas id="team-focus-chart" style="max-height: 280px; width: 100% !important;"></canvas>
          </div>
        </div>
        
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <h3>Focus Insights</h3>
          <div style="margin: 20px 0; font-size: 0.9rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 14px;">
            <p>📋 <strong style="color: var(--text-primary)">Technical:</strong> Covers passing patterns, rondos, shooting practices, and individual ball skills.</p>
            <p>🛡️ <strong style="color: var(--text-primary)">Tactical:</strong> Covers offside traps, shifting, match simulation, and positional plays.</p>
            <p>⚡ <strong style="color: var(--text-primary)">Physical:</strong> High intensity agility drills, speed duels, and cardiovascular training.</p>
            <p>🧠 <strong style="color: var(--text-primary)">Psychological:</strong> Focuses on reaction timers, spatial scans, decision-making, and communication drills.</p>
          </div>
          <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
            <span class="detail-label" style="display: block; margin-bottom: 4px;">Last active session focus</span>
            <span style="font-family: var(--font-display); font-weight: 700; color: var(--accent-green);">
              ${sessions[0] ? `${sessions[0].focusArea} (${sessions[0].date})` : 'No sessions logged yet'}
            </span>
          </div>
        </div>
      </div>

      <!-- Historical Log Table -->
      <div class="card" style="padding: 20px;">
        <h3 style="margin-bottom: 16px;">Training Log History</h3>
        <div class="table-responsive">
          <table class="app-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Focus Area</th>
                <th>Duration (Min)</th>
                <th>Intensity Rating</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${sessions.map(s => `
                <tr>
                  <td style="font-family: var(--font-display); font-weight: 600;">${s.date}</td>
                  <td>
                    <span class="player-badge" style="background: rgba(255, 255, 255, 0.05); color: #fff;">
                      ${s.focusArea}
                    </span>
                  </td>
                  <td>${s.duration} mins</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 60px; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${s.intensity * 10}%; height: 100%; background: var(--accent-green);"></div>
                      </div>
                      <span style="font-size: 0.8rem; font-weight: 700;">${s.intensity}/10</span>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <a href="#reports?sessionId=${s.id}" class="btn btn-secondary" style="font-size: 0.75rem; padding: 6px 12px;">
                      Grade Squad Attendance
                    </a>
                  </td>
                </tr>
              `).join('')}
              ${sessions.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No training sessions logged yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  init() {
    this.renderTeamFocusChart();
  },

  renderTeamFocusChart() {
    const ctx = document.getElementById('team-focus-chart');
    if (!ctx) return;

    const focusData = window.db.getTeamTrainingFocusData();
    const labels = Object.keys(focusData);
    const dataVals = Object.values(focusData);

    // If no values, put empty indicators
    const allZero = dataVals.every(v => v === 0);
    const finalData = allZero ? [25, 25, 25, 25] : dataVals;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: finalData,
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',  // Technical (Green)
            'rgba(59, 130, 246, 0.7)',  // Tactical (Blue)
            'rgba(249, 115, 22, 0.7)',  // Physical (Orange)
            'rgba(168, 85, 247, 0.7)'   // Psychological (Purple)
          ],
          borderColor: [
            '#22c55e',
            '#3b82f6',
            '#f97316',
            '#a855f7'
          ],
          borderWidth: 1.5,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Outfit',
                weight: '500'
              },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (allZero) return `${context.label}: No session logged yet`;
                return ` ${context.label}: ${context.raw} mins`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  },

  openLogModal() {
    // default date to today
    const today = new Date().toISOString().split('T')[0];
    
    window.App.openModal('Log Practice Session', `
      <form id="session-log-form" onsubmit="SessionsComponent.handleLogSubmit(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="sess-date">Session Date</label>
            <input type="date" id="sess-date" class="form-input" value="${today}" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sess-duration">Duration (Minutes)</label>
            <input type="number" id="sess-duration" class="form-input" min="5" max="360" value="90" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sess-focusArea">Session Focus Area</label>
            <select id="sess-focusArea" class="form-select" required>
              <option value="Technical">Technical (Skill/Passing/Control)</option>
              <option value="Tactical">Tactical (Positioning/Offside/Match Simulation)</option>
              <option value="Physical">Physical (Stamina/Speed/Agility)</option>
              <option value="Psychological">Psychological (Mental Speed/Decision Making)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Session Intensity Rating</label>
            <div class="rating-container" style="margin-top: 8px;">
              <input type="range" id="sess-intensity" class="rating-slider" min="1" max="10" value="7" oninput="document.getElementById('sess-intensity-lbl').innerText = this.value">
              <span class="rating-val" id="sess-intensity-lbl">7</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Session Logs</button>
        </div>
      </form>
    `);
  },

  handleLogSubmit(e) {
    e.preventDefault();
    const sessionData = {
      date: document.getElementById('sess-date').value,
      duration: document.getElementById('sess-duration').value,
      focusArea: document.getElementById('sess-focusArea').value,
      intensity: document.getElementById('sess-intensity').value
    };

    if (!sessionData.date || !sessionData.duration) {
      window.App.toast('All session fields are required.', 'error');
      return;
    }

    const newSession = window.db.createSession(sessionData);
    
    window.App.closeModal();
    window.App.toast(`Successfully logged ${sessionData.focusArea} training session!`);
    
    // Automatically redirect to reports module for newly created session so they can mark attendance immediately!
    window.location.hash = `#reports?sessionId=${newSession.id}`;
  }
};

/**
 * INDIVIDUAL PLAYER REPORTS & PERFORMANCE GRADING MODULE (reports.js)
 * Manages player profile pages, attendance matrices, 1-10 rating scales, and developmental line graphs.
 */

window.ReportsComponent = {
  render(params) {
    const players = window.db.getPlayers();
    const sessions = window.db.getSessions();

    if (players.length === 0) {
      return `
        <div class="page-header">
          <h2 class="page-title">Performance Reports</h2>
        </div>
        <div class="card" style="text-align: center; padding: 48px;">
          <h3>No Players Found</h3>
          <p style="color: var(--text-muted);">Please add players in the Squad Roster page to view developmental reports.</p>
        </div>
      `;
    }

    // STATE B: SESSION ATTENDANCE / PERFORMANCE GRADING VIEW
    if (params && params.sessionId) {
      const session = window.db.getSessionById(params.sessionId);
      if (!session) {
        return `<div class="card"><h3>Session Not Found</h3></div>`;
      }
      const playerSessions = window.db.getPlayerSessionsBySessionId(params.sessionId);

      return `
        <div class="page-header">
          <div>
            <a href="#sessions" style="color: var(--accent-green); text-decoration: none; font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px;">
              &larr; Back to Sessions
            </a>
            <h2 class="page-title">Session Grading Matrix</h2>
            <p class="page-subtitle">${session.focusArea} Session &bull; ${session.date} &bull; ${session.duration} mins &bull; Intensity ${session.intensity}/10</p>
          </div>
        </div>

        <div class="card" style="padding: 24px;">
          <h3 style="margin-bottom: 16px;">Squad Performance Log</h3>
          <div class="table-responsive">
            <table class="app-table" style="vertical-align: middle;">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Attendance</th>
                  <th>Performance Grade (1-10)</th>
                  <th>Feedback & Coach Annotations</th>
                  <th style="text-align: right;">Save</th>
                </tr>
              </thead>
              <tbody>
                ${playerSessions.map(ps => {
                  const p = ps.playerDetails;
                  const isPresent = ps.attendance === 'Present';
                  
                  return `
                    <tr id="row-${ps.id}">
                      <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="font-family: var(--font-display); font-weight: 800; color: var(--accent-green); font-size: 1.1rem; width: 28px;">#${p.jerseyNumber}</div>
                          <div>
                            <strong style="color: var(--text-primary); display: block;">${p.fullName}</strong>
                            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${p.primaryPosition}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select class="form-select" style="padding: 6px 12px; font-size: 0.85rem;" onchange="ReportsComponent.toggleRowAttendance('${ps.id}', this.value)">
                          <option value="Present" ${ps.attendance === 'Present' ? 'selected' : ''}>Present</option>
                          <option value="Absent" ${ps.attendance === 'Absent' ? 'selected' : ''}>Absent</option>
                          <option value="Excused" ${ps.attendance === 'Excused' ? 'selected' : ''}>Excused</option>
                        </select>
                      </td>
                      <td>
                        <div class="rating-container" id="rating-cnt-${ps.id}" style="display: ${isPresent ? 'flex' : 'none'};">
                          <input type="range" class="rating-slider" min="1" max="10" value="${ps.performanceGrade || 7}" 
                            oninput="document.getElementById('lbl-${ps.id}').innerText = this.value">
                          <span class="rating-val" style="font-size: 1.1rem;" id="lbl-${ps.id}">${ps.performanceGrade || 7}</span>
                        </div>
                        <span id="rating-na-${ps.id}" style="color: var(--text-muted); font-size: 0.85rem; display: ${isPresent ? 'none' : 'inline'};">N/A (Not Present)</span>
                      </td>
                      <td>
                        <textarea class="form-textarea" style="padding: 8px 12px; font-size: 0.85rem; width: 100%; min-height: 44px; height: 44px;" placeholder="Leave constructive coaching points...">${ps.feedbackNotes || ''}</textarea>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-primary btn-icon" onclick="ReportsComponent.saveRowGrade('${ps.id}')">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // STATE A: INDIVIDUAL PLAYER PROFILE VIEW
    const activePlayerId = (params && params.playerId) ? params.playerId : players[0].id;
    const player = window.db.getPlayerById(activePlayerId);
    
    if (!player) {
      return `<div class="card"><h3>Player Profile Not Found</h3></div>`;
    }

    const playerSessions = window.db.getPlayerSessionsByPlayerId(activePlayerId);
    const presentSessions = playerSessions.filter(ps => ps.attendance === 'Present');
    
    // Aggregated player statistics
    const totalAssigned = playerSessions.length;
    const totalPresent = presentSessions.length;
    const attendancePct = totalAssigned > 0 ? Math.round((totalPresent / totalAssigned) * 100) : 0;
    
    const grades = presentSessions.map(ps => ps.performanceGrade).filter(g => g !== null);
    const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1) : 'N/A';

    return `
      <div class="page-header">
        <div>
          <h2 class="page-title">Performance Reports</h2>
          <p class="page-subtitle">Track, grade, and analyze technical development and attendance metrics per player.</p>
        </div>
      </div>

      <div class="profile-layout">
        <!-- Profile Selection and General Profile card -->
        <div class="profile-sidebar">
          
          <!-- Quick Selector Dropdown -->
          <div class="card" style="padding: 16px;">
            <label class="form-label" style="margin-bottom: 6px; display: block;">Select Player Profile</label>
            <select class="form-select" style="width: 100%;" onchange="window.location.hash = '#reports?playerId=' + this.value">
              ${players.map(p => `
                <option value="${p.id}" ${p.id === activePlayerId ? 'selected' : ''}>#${p.jerseyNumber} - ${p.fullName}</option>
              `).join('')}
            </select>
          </div>

          <!-- Main Stats Card -->
          <div class="card profile-card">
            <!-- Profile Avatar with custom photo uploader overlay -->
            <div class="profile-avatar-wrapper" style="position: relative; width: 110px; height: 110px; margin: 0 auto 16px; border-radius: 50%; border: 3px solid var(--accent-green); box-shadow: 0 0 20px var(--accent-green-glow); overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); cursor: pointer;">
              ${player.photo 
                ? `<img src="${player.photo}" id="profile-avatar-img" style="width: 100%; height: 100%; object-fit: cover;" />`
                : `<div style="font-family: var(--font-display); font-size: 3rem; font-weight: 900; color: var(--accent-green); line-height: 1;">#${player.jerseyNumber}</div>`
              }
              
              <!-- Hover Edit Photo Badge overlay -->
              <label for="profile-photo-upload" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 240, 255, 0.95); color: #000; padding: 4px; font-size: 0.65rem; font-family: var(--font-display); font-weight: 800; cursor: pointer; opacity: 0; transition: opacity 0.2s ease; text-align: center; text-transform: uppercase;">
                Upload
              </label>
              <input type="file" id="profile-photo-upload" style="display: none;" accept="image/*" onchange="window.ReportsComponent.handleProfilePhotoUpload('${player.id}', this)" />
            </div>
            <h3 class="profile-name">${player.fullName}</h3>
            <div class="profile-position">${player.primaryPosition} &bull; ${player.secondaryPosition || 'None'}</div>
            
            <span class="player-badge badge-injury ${player.injuryStatus.toLowerCase()}" style="margin-bottom: 20px; display: inline-block;">
              ${player.injuryStatus}
            </span>

            <div class="profile-meta-row">
              <div class="profile-meta-item">
                <span class="detail-label">Age</span>
                <span class="detail-value" style="font-size: 1rem;">${player.age} yrs</span>
              </div>
              <div class="profile-meta-item" style="border-left: 1px solid var(--border-color); padding-left: 16px;">
                <span class="detail-label">Pref. Foot</span>
                <span class="detail-value" style="font-size: 1rem;">${player.preferredFoot}</span>
              </div>
            </div>

            <div class="profile-main-stats">
              <div style="background: rgba(255, 255, 255, 0.02); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <span class="detail-label" style="font-size: 0.7rem; display: block; margin-bottom: 4px;">ATTENDANCE</span>
                <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--accent-green);">${attendancePct}%</span>
              </div>
              <div style="background: rgba(255, 255, 255, 0.02); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <span class="detail-label" style="font-size: 0.7rem; display: block; margin-bottom: 4px;">AVG RATING</span>
                <span style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: #60a5fa;">${avgGrade}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Chart and Sessions list -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Progress Line Chart -->
          <div class="card" style="padding: 24px;">
            <h3>Development Trend (Performance Rating over Time)</h3>
            <div style="flex-grow: 1; min-height: 250px; display: flex; align-items: center; justify-content: center; position: relative; margin-top: 16px;">
              <canvas id="player-progress-chart" style="max-height: 260px; width: 100% !important;"></canvas>
            </div>
          </div>

          <!-- Session Grades Ledger Table -->
          <div class="card" style="padding: 20px;">
            <h3 style="margin-bottom: 16px;">Session Logs & Technical Annotations</h3>
            <div class="table-responsive">
              <table class="app-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Focus Area</th>
                    <th>Attendance</th>
                    <th>Grade</th>
                    <th>Coach Feedback Comments</th>
                  </tr>
                </thead>
                <tbody>
                  ${playerSessions.map(ps => {
                    const hasGrade = ps.performanceGrade !== null;
                    let badgeClass = 'grade-med';
                    if (hasGrade) {
                      if (ps.performanceGrade >= 8) badgeClass = 'grade-high';
                      else if (ps.performanceGrade <= 5) badgeClass = 'grade-low';
                    }

                    return `
                      <tr>
                        <td style="font-family: var(--font-display); font-weight: 600;">${ps.sessionDetails.date}</td>
                        <td>
                          <span class="player-badge" style="background: rgba(255, 255, 255, 0.05); color: #fff;">
                            ${ps.sessionDetails.focusArea}
                          </span>
                        </td>
                        <td>
                          <span style="font-weight: 600; color: ${ps.attendance === 'Present' ? 'var(--color-healthy)' : 'var(--text-muted)'}">
                            ${ps.attendance}
                          </span>
                        </td>
                        <td>
                          ${hasGrade ? `<span class="grade-badge ${badgeClass}">${ps.performanceGrade}</span>` : '<span style="color: var(--text-muted);">-</span>'}
                        </td>
                        <td style="color: var(--text-secondary); max-width: 250px; font-size: 0.85rem;">
                          ${ps.feedbackNotes || 'No notes compiled.'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                  ${playerSessions.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No sessions logged for this player yet.</td></tr>' : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init(params) {
    if (!params || !params.sessionId) {
      // Individual player line trend initialization
      const players = window.db.getPlayers();
      if (players.length > 0) {
        const activePlayerId = (params && params.playerId) ? params.playerId : players[0].id;
        this.renderPlayerProgressChart(activePlayerId);
      }
    }
  },

  renderPlayerProgressChart(playerId) {
    const ctx = document.getElementById('player-progress-chart');
    if (!ctx) return;

    // Retrieve historical performance logs (only Present sessions, sorted ascending by date)
    const allSessions = window.db.getPlayerSessionsByPlayerId(playerId);
    const chartLogs = allSessions
      .filter(ps => ps.attendance === 'Present' && ps.performanceGrade !== null)
      .reverse(); // Reverse to get chronological order (oldest to newest)

    const labels = chartLogs.map(l => l.sessionDetails.date);
    const dataVals = chartLogs.map(l => l.performanceGrade);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Performance Grade',
          data: dataVals,
          fill: true,
          borderColor: '#39ff14',
          borderWidth: 3,
          backgroundColor: 'rgba(57, 255, 20, 0.05)',
          tension: 0.35,
          pointBackgroundColor: '#39ff14',
          pointBorderColor: '#07090e',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#fff',
            bodyColor: '#39ff14',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleFont: { family: 'Outfit', weight: '700' },
            bodyFont: { family: 'Outfit', weight: '700', size: 14 }
          }
        },
        scales: {
          y: {
            min: 1,
            max: 10,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Inter', weight: '600' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { family: 'Inter', weight: '600' } }
          }
        }
      }
    });
  },

  toggleRowAttendance(psId, status) {
    const isPresent = status === 'Present';
    const ratingContainer = document.getElementById(`rating-cnt-${psId}`);
    const ratingNA = document.getElementById(`rating-na-${psId}`);
    
    if (ratingContainer && ratingNA) {
      ratingContainer.style.display = isPresent ? 'flex' : 'none';
      ratingNA.style.display = isPresent ? 'none' : 'inline';
    }
  },

  saveRowGrade(psId) {
    const rowEl = document.getElementById(`row-${psId}`);
    if (!rowEl) return;

    const attendance = rowEl.querySelector('select').value;
    const gradeVal = attendance === 'Present' ? rowEl.querySelector('.rating-slider').value : null;
    const feedback = rowEl.querySelector('textarea').value.trim();

    // Call DB update adapter
    const updated = window.db.updatePlayerSession(psId, attendance, gradeVal, feedback);
    
    if (updated) {
      window.App.toast('Player metrics saved successfully!');
    } else {
      window.App.toast('Failed to save metrics.', 'error');
    }
  },

  handleProfilePhotoUpload(playerId, input) {
    const file = input.files ? input.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Photo = event.target.result;
      const updated = window.db.updatePlayerPhoto(playerId, base64Photo);
      if (updated) {
        window.App.toast('Player profile photo updated successfully!');
        window.App.loadView();
      } else {
        window.App.toast('Failed to update photo.', 'error');
      }
    };
    reader.onerror = () => {
      window.App.toast('Error reading image file.', 'error');
    };
    reader.readAsDataURL(file);
  }
};

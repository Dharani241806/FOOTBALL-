/**
 * FOOTBALL TRAINING & ANALYTICS - CLIENT DATABASE (db.js)
 * High-performance, reactive mock database using localStorage.
 * Includes relations, seeding, aggregations, and CRUD API adapters.
 */

const STORAGE_KEYS = {
  PLAYERS: 'football_db_players',
  SESSIONS: 'football_db_sessions',
  PLAYER_SESSIONS: 'football_db_player_sessions',
  DRILLS: 'football_db_drills'
};

// Seed Data
const SEED_PLAYERS = [
  { id: 'p1', fullName: 'Marcus Rashford', age: 26, primaryPosition: 'LW', secondaryPosition: 'ST', jerseyNumber: 10, preferredFoot: 'Right', injuryStatus: 'Healthy' },
  { id: 'p2', fullName: 'Erling Haaland', age: 23, primaryPosition: 'ST', secondaryPosition: 'None', jerseyNumber: 9, preferredFoot: 'Left', injuryStatus: 'Healthy' },
  { id: 'p3', fullName: 'Kevin De Bruyne', age: 32, primaryPosition: 'CAM', secondaryPosition: 'CM', jerseyNumber: 17, preferredFoot: 'Right', injuryStatus: 'Reconditioning' },
  { id: 'p4', fullName: 'Virgil van Dijk', age: 32, primaryPosition: 'CB', secondaryPosition: 'None', jerseyNumber: 4, preferredFoot: 'Right', injuryStatus: 'Healthy' },
  { id: 'p5', fullName: 'Bukayo Saka', age: 22, primaryPosition: 'RW', secondaryPosition: 'CAM', jerseyNumber: 7, preferredFoot: 'Left', injuryStatus: 'Healthy' },
  { id: 'p6', fullName: 'Trent Alexander-Arnold', age: 25, primaryPosition: 'RB', secondaryPosition: 'CM', jerseyNumber: 66, preferredFoot: 'Right', injuryStatus: 'Healthy' },
  { id: 'p7', fullName: 'Alisson Becker', age: 31, primaryPosition: 'GK', secondaryPosition: 'None', jerseyNumber: 1, preferredFoot: 'Right', injuryStatus: 'Injured' },
  { id: 'p8', fullName: 'Declan Rice', age: 25, primaryPosition: 'CDM', secondaryPosition: 'CM', jerseyNumber: 41, preferredFoot: 'Right', injuryStatus: 'Healthy' },
  { id: 'p9', fullName: 'Jude Bellingham', age: 20, primaryPosition: 'CM', secondaryPosition: 'CAM', jerseyNumber: 5, preferredFoot: 'Right', injuryStatus: 'Healthy' },
  { id: 'p10', fullName: 'Alphonso Davies', age: 23, primaryPosition: 'LB', secondaryPosition: 'LW', jerseyNumber: 19, preferredFoot: 'Left', injuryStatus: 'Healthy' }
];

const SEED_DRILLS = [
  {
    id: 'd1',
    title: '4v4 + 3 Neutral Tiki-Taka Rondo',
    setupDetails: '20x20 yard grid. 4 attacking players on the outside, 4 defenders inside the grid trying to intercept, 3 neutral players down the central vertical line.',
    equipmentNeeded: '8 Cones, 2 sets of colored bibs, 3 footballs.',
    instructions: [
      'Attacking team must keep possession of the ball, utilizing the neutral players to transition from side to side.',
      'Defenders must press and intercept. If defenders win the ball, they transition to outside and attackers become defenders.',
      'Neutral players must play with 1 or 2 touches only.'
    ],
    coachingPoints: [
      'Body shape should be open to receive and play forward.',
      'High tempo: look to pass immediately upon receiving.',
      'Speed of transition: switch from defensive to attacking mindset instantly.'
    ],
    ageGroup: 'U15',
    focusArea: 'Technical'
  },
  {
    id: 'd2',
    title: 'High-Intensity Overlapping Run Circuit',
    setupDetails: 'Two stations set up on the wings, 30 yards from the goal. Cones placed to dictate the wing-back overlap path.',
    equipmentNeeded: '12 Cones, 6 Hurdles, 1 Goal, 10 Footballs.',
    instructions: [
      'Midfielder passes to wide winger standing near touchline.',
      'Wing-back makes an explosive overlapping run around the winger.',
      'Winger plays a weighted through-ball into the overlap zone.',
      'Wing-back crosses the ball into the box for oncoming strikers to finish.'
    ],
    coachingPoints: [
      'Timing of overlapping run: do not run too early to stay onside.',
      'Quality of the cross: aim for the corridor of uncertainty between goalkeeper and defenders.',
      'Speed of execution: full sprint on overlap.'
    ],
    ageGroup: 'U13',
    focusArea: 'Tactical'
  },
  {
    id: 'd3',
    title: '1v1 Transition & Physical Agility Duel',
    setupDetails: '15x15 yard grid with mini-goals on opposite ends. Players line up in two lines next to the coach.',
    equipmentNeeded: '4 Cones, 2 Mini-goals, 8 Agility poles.',
    instructions: [
      'Coach plays a ball into the center grid.',
      'First player from each line sprints around an agility pole and enters the grid to secure the ball.',
      'The player who secures the ball attacks the mini-goal; the other defends.',
      'Time limit of 30 seconds per duel.'
    ],
    coachingPoints: [
      'Aggressiveness to win the first contact.',
      'Low center of gravity when defending to jockey effectively.',
      'Explosive acceleration to beat the defender after winning the ball.'
    ],
    ageGroup: 'U11',
    focusArea: 'Physical'
  },
  {
    id: 'd4',
    title: 'Mental Alertness & Spatial Awareness Game',
    setupDetails: '30x30 yard area with 4 gated goals in each corner, colored Red, Blue, Yellow, Green.',
    equipmentNeeded: '16 colored cones for gates, 1 whistle, 2 colored balls.',
    instructions: [
      'Play 5v5 possession game in the center of the grid.',
      'Every 45 seconds, the coach shouts a color (e.g. "BLUE!").',
      'The team in possession must instantly transition and pass the ball through the Blue gate to score.',
      'If intercepted, the opposing team can score through the same or opposite gate.'
    ],
    coachingPoints: [
      'Constant scanning: players must always know where the 4 gates are.',
      'Cognitive speed: quick switch in tactics and immediate direction change.',
      'Clear communication between teammates.'
    ],
    ageGroup: 'Senior',
    focusArea: 'Psychological'
  },
  {
    id: 'd5',
    title: 'Dynamic Positional Defensive Shift',
    setupDetails: 'Half field setup. 4 defenders and 2 defensive midfielders lined up in shape. 6 attacking players passing in front.',
    equipmentNeeded: '10 training bibs, full-size goals, 12 large cones to mark zones.',
    instructions: [
      'Attackers pass the ball horizontally to shift the defense side to side.',
      'Defending line must slide as a cohesive unit, keeping compact vertical and horizontal spacing.',
      'On a specific trigger pass, defenders must press high and trigger an offside trap.'
    ],
    coachingPoints: [
      'Maintain a maximum of 8-10 yards of spacing between defenders.',
      'The nearest defender must press the ball while the other three cover and support.',
      'Body orientation to force attackers wide.'
    ],
    ageGroup: 'U17',
    focusArea: 'Tactical'
  }
];

// Helper to seed training sessions and performance reports for the last 30 days
function generateSeedSessionsAndReports() {
  const sessions = [];
  const playerSessions = [];
  const focusAreas = ['Technical', 'Tactical', 'Physical', 'Psychological'];
  
  // Create 12 training sessions spaced over the last 30 days
  const today = new Date();
  for (let i = 12; i >= 1; i--) {
    const sessionDate = new Date();
    sessionDate.setDate(today.getDate() - (i * 2 + 1)); // spaced sessions
    
    const sessionId = `s${13 - i}`;
    const focusArea = focusAreas[i % 4];
    const duration = 60 + (i % 3) * 15; // 60, 75, 90 mins
    const intensity = 5 + (i % 5); // 5 to 9 intensity

    sessions.push({
      id: sessionId,
      date: sessionDate.toISOString().split('T')[0],
      duration: duration,
      focusArea: focusArea,
      intensity: intensity
    });

    // Create attendance and performance scores for players for each session
    SEED_PLAYERS.forEach(player => {
      // Set attendance probabilities: 90% Present, 5% Excused, 5% Absent
      let attendance = 'Present';
      const rand = Math.random();
      if (player.injuryStatus === 'Injured') {
        attendance = 'Excused';
      } else if (rand > 0.95) {
        attendance = 'Absent';
      } else if (rand > 0.90) {
        attendance = 'Excused';
      }

      let grade = null;
      let feedback = '';

      if (attendance === 'Present') {
        // Base grade on position and some random skill multiplier
        const baseGrade = 6 + (parseInt(player.id.replace('p', '')) % 4);
        grade = Math.min(10, Math.max(1, Math.round(baseGrade + (Math.random() * 2 - 1))));
        
        const feedbacks = [
          'Excellent tactical positioning and speed of execution.',
          'Solid work rate, showed great leadership on the pitch.',
          'Demonstrated excellent technique during passing drills, needs slight improvement in defensive tracking.',
          'Very energetic in high-pressing drills. Needs to scan more before receiving.',
          'Struggled slightly with stamina towards the end but technically immaculate.',
          'Superb ball recovery and quick distribution.'
        ];
        feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
      } else if (attendance === 'Excused') {
        feedback = player.injuryStatus === 'Injured' ? 'Absent due to medical assessment.' : 'Excused personal leave.';
      } else {
        feedback = 'Unexcused absence. No performance score.';
      }

      playerSessions.push({
        id: `ps_${sessionId}_${player.id}`,
        playerId: player.id,
        sessionId: sessionId,
        attendance: attendance,
        performanceGrade: grade,
        feedbackNotes: feedback
      });
    });
  }

  return { sessions, playerSessions };
}

// Local Database Interface
class FootballDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PLAYERS)) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(SEED_PLAYERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DRILLS)) {
      localStorage.setItem(STORAGE_KEYS.DRILLS, JSON.stringify(SEED_DRILLS));
    }

    const { sessions, playerSessions } = generateSeedSessionsAndReports();
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLAYER_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_SESSIONS, JSON.stringify(playerSessions));
    }

    // Dynamic Seed Patch for Player "Gokul" with uploaded photo
    try {
      let players = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS)) || [];
      const hasGokul = players.some(p => p.fullName.toLowerCase().includes('gokul'));
      if (!hasGokul) {
        const gokul = { id: 'p_gokul', fullName: 'Gokul', age: 21, primaryPosition: 'CM', secondaryPosition: 'CAM', jerseyNumber: 8, preferredFoot: 'Right', injuryStatus: 'Healthy', photo: 'gokul.jpg' };
        players.push(gokul);
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
      } else {
        players = players.map(p => p.fullName.toLowerCase().includes('gokul') ? { ...p, photo: 'gokul.jpg' } : p);
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
      }
    } catch (e) {
      console.error('Failed to run Gokul patch:', e);
    }
  }

  // --- PLAYERS API ---
  getPlayers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS)) || [];
  }

  getPlayerById(id) {
    return this.getPlayers().find(p => p.id === id);
  }

  createPlayer(playerData) {
    const players = this.getPlayers();
    const newPlayer = {
      id: 'p_' + Date.now(),
      ...playerData,
      age: parseInt(playerData.age),
      jerseyNumber: parseInt(playerData.jerseyNumber)
    };
    players.push(newPlayer);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return newPlayer;
  }

  updatePlayer(id, updatedData) {
    let players = this.getPlayers();
    players = players.map(p => p.id === id ? { ...p, ...updatedData, age: parseInt(updatedData.age), jerseyNumber: parseInt(updatedData.jerseyNumber) } : p);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return this.getPlayerById(id);
  }

  updatePlayerPhoto(id, photoBase64) {
    let players = this.getPlayers();
    players = players.map(p => p.id === id ? { ...p, photo: photoBase64 } : p);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    return this.getPlayerById(id);
  }

  deletePlayer(id) {
    let players = this.getPlayers();
    players = players.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    
    // Cascading delete player sessions
    let playerSessions = this.getPlayerSessions();
    playerSessions = playerSessions.filter(ps => ps.playerId !== id);
    localStorage.setItem(STORAGE_KEYS.PLAYER_SESSIONS, JSON.stringify(playerSessions));
  }

  // --- SESSIONS API ---
  getSessions() {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS)) || [];
    return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getSessionById(id) {
    return this.getSessions().find(s => s.id === id);
  }

  createSession(sessionData) {
    const sessions = this.getSessions();
    const newSession = {
      id: 's_' + Date.now(),
      ...sessionData,
      duration: parseInt(sessionData.duration),
      intensity: parseInt(sessionData.intensity)
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Automatically create empty player session entries for all active players
    const players = this.getPlayers();
    const playerSessions = this.getPlayerSessions();
    players.forEach(p => {
      playerSessions.push({
        id: `ps_${newSession.id}_${p.id}`,
        playerId: p.id,
        sessionId: newSession.id,
        attendance: 'Present',
        performanceGrade: 7, // default default grade
        feedbackNotes: 'Good effort in active training drills.'
      });
    });
    localStorage.setItem(STORAGE_KEYS.PLAYER_SESSIONS, JSON.stringify(playerSessions));

    return newSession;
  }

  // --- PLAYER PERFORMANCE SESSIONS API ---
  getPlayerSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYER_SESSIONS)) || [];
  }

  getPlayerSessionsByPlayerId(playerId) {
    const playerSessions = this.getPlayerSessions();
    const sessions = this.getSessions();
    return playerSessions
      .filter(ps => ps.playerId === playerId)
      .map(ps => {
        const session = sessions.find(s => s.id === ps.sessionId);
        return {
          ...ps,
          sessionDetails: session || { date: 'N/A', focusArea: 'N/A', duration: 0, intensity: 0 }
        };
      })
      .sort((a, b) => new Date(b.sessionDetails.date) - new Date(a.sessionDetails.date));
  }

  getPlayerSessionsBySessionId(sessionId) {
    const playerSessions = this.getPlayerSessions();
    const players = this.getPlayers();
    return playerSessions
      .filter(ps => ps.sessionId === sessionId)
      .map(ps => {
        const player = players.find(p => p.id === ps.playerId);
        return {
          ...ps,
          playerDetails: player || { fullName: 'Deleted Player', jerseyNumber: 0, primaryPosition: 'N/A' }
        };
      });
  }

  updatePlayerSession(id, attendance, grade, feedback) {
    const playerSessions = this.getPlayerSessions();
    const index = playerSessions.findIndex(ps => ps.id === id);
    if (index !== -1) {
      playerSessions[index].attendance = attendance;
      playerSessions[index].performanceGrade = attendance === 'Present' ? parseInt(grade) : null;
      playerSessions[index].feedbackNotes = feedback;
      localStorage.setItem(STORAGE_KEYS.PLAYER_SESSIONS, JSON.stringify(playerSessions));
      return playerSessions[index];
    }
    return null;
  }

  // --- DRILLS API ---
  getDrills() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DRILLS)) || [];
  }

  createDrill(drillData) {
    const drills = this.getDrills();
    const newDrill = {
      id: 'd_' + Date.now(),
      ...drillData,
      instructions: Array.isArray(drillData.instructions) ? drillData.instructions : drillData.instructions.split('\n').filter(l => l.trim() !== ''),
      coachingPoints: Array.isArray(drillData.coachingPoints) ? drillData.coachingPoints : drillData.coachingPoints.split('\n').filter(l => l.trim() !== '')
    };
    drills.push(newDrill);
    localStorage.setItem(STORAGE_KEYS.DRILLS, JSON.stringify(drills));
    return newDrill;
  }

  // --- ADVANCED AGGREGATIONS FOR ANALYTICS ---
  getTeamTrainingFocusData() {
    const sessions = this.getSessions();
    const focusSummary = { Technical: 0, Tactical: 0, Physical: 0, Psychological: 0 };
    
    // Aggregate over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    sessions.forEach(s => {
      const sDate = new Date(s.date);
      if (sDate >= thirtyDaysAgo) {
        if (focusSummary[s.focusArea] !== undefined) {
          focusSummary[s.focusArea] += s.duration;
        }
      }
    });

    return focusSummary;
  }
}

// Export database globally for SPA access
window.db = new FootballDatabase();

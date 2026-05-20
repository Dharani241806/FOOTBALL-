-- ====================================================================
-- FOOTBALL TRAINING & ANALYTICS WEB APP - DATABASE SCHEMAS
-- ====================================================================
-- This file provides the complete, production-ready backend database blueprints.
-- Section 1: Relational Database Schema (PostgreSQL)
-- Section 2: Document Database Schema (MongoDB / Mongoose)
-- Section 3: Data Entity Relationship Overview
-- ====================================================================

-- ====================================================================
-- SECTION 1: RELATIONAL DATABASE SCHEMA (POSTGRESQL)
-- ====================================================================

-- 1. Enable extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Player Roster Table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 4 AND age <= 60),
    primary_position VARCHAR(20) NOT NULL,
    secondary_position VARCHAR(20),
    jersey_number INT CHECK (jersey_number >= 1 AND jersey_number <= 99),
    preferred_foot VARCHAR(10) CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
    injury_status VARCHAR(20) NOT NULL DEFAULT 'Healthy' CHECK (injury_status IN ('Healthy', 'Injured', 'Reconditioning')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for position filtering and squad dashboard lists
CREATE INDEX idx_players_position ON players(primary_position);
CREATE INDEX idx_players_injury ON players(injury_status);

-- 3. Training Sessions Table
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_date DATE NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 360),
    focus_area VARCHAR(30) NOT NULL CHECK (focus_area IN ('Tactical', 'Technical', 'Physical', 'Psychological')),
    intensity_rating INT NOT NULL CHECK (intensity_rating >= 1 AND intensity_rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for date ranges and filtering focus areas
CREATE INDEX idx_sessions_date ON training_sessions(session_date);
CREATE INDEX idx_sessions_focus ON training_sessions(focus_area);

-- 4. Player Session Attendance & Performance Junction Table
CREATE TABLE player_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'Present' CHECK (attendance_status IN ('Present', 'Absent', 'Excused')),
    performance_grade INT CHECK (performance_grade >= 1 AND performance_grade <= 10),
    feedback_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Ensure a player can only have one attendance log per session
    CONSTRAINT uq_player_session UNIQUE (player_id, session_id)
);

-- Indexes for fast lookup of player progress and session-wide attendance grids
CREATE INDEX idx_player_sessions_player ON player_sessions(player_id);
CREATE INDEX idx_player_sessions_session ON player_sessions(session_id);

-- 5. Drill Library Table
CREATE TABLE drills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    setup_details TEXT NOT NULL,
    equipment_needed TEXT,
    instructions TEXT[] NOT NULL, -- Array of step-by-step instructions
    coaching_points TEXT[] NOT NULL, -- Key points for coaches
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior')),
    focus_area VARCHAR(30) NOT NULL CHECK (focus_area IN ('Tactical', 'Technical', 'Physical', 'Psychological')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast category and age filtering
CREATE INDEX idx_drills_filtering ON drills(focus_area, age_group);


-- ====================================================================
-- SECTION 2: DOCUMENT DATABASE SCHEMA (MONGODB / MONGOOSE)
-- ====================================================================

/*
// Player Schema (Mongoose Model: 'Player')
const PlayerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 4, max: 60 },
  primaryPosition: { type: String, required: true, enum: ['GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'RW', 'ST'] },
  secondaryPosition: { type: String, enum: ['GK', 'CB', 'LB', 'RB', 'CM', 'CDM', 'CAM', 'LW', 'RW', 'ST', 'None'] },
  jerseyNumber: { type: Number, required: true, min: 1, max: 99 },
  preferredFoot: { type: String, required: true, enum: ['Left', 'Right', 'Both'] },
  injuryStatus: { type: String, required: true, default: 'Healthy', enum: ['Healthy', 'Injured', 'Reconditioning'] }
}, { timestamps: true });

PlayerSchema.index({ primaryPosition: 1 });
PlayerSchema.index({ injuryStatus: 1 });


// TrainingSession Schema (Mongoose Model: 'TrainingSession')
const TrainingSessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  duration: { type: Number, required: true, min: 1, max: 360 }, // in minutes
  focusArea: { type: String, required: true, enum: ['Tactical', 'Technical', 'Physical', 'Psychological'] },
  intensity: { type: Number, required: true, min: 1, max: 10 }
}, { timestamps: true });

TrainingSessionSchema.index({ date: -1 });


// PlayerSession Performance Schema (Mongoose Model: 'PlayerSession')
const PlayerSessionSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingSession', required: true },
  attendance: { type: String, required: true, default: 'Present', enum: ['Present', 'Absent', 'Excused'] },
  performanceGrade: { type: Number, min: 1, max: 10 },
  feedbackNotes: { type: String, default: '' }
}, { timestamps: true });

// Prevent duplicate entries for player-session relationships
PlayerSessionSchema.index({ player: 1, session: 1 }, { unique: true });
PlayerSessionSchema.index({ player: 1 });


// Drill Schema (Mongoose Model: 'Drill')
const DrillSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  setupDetails: { type: String, required: true },
  equipmentNeeded: { type: String },
  instructions: [{ type: String, required: true }],
  coachingPoints: [{ type: String, required: true }],
  ageGroup: { type: String, required: true, enum: ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior'] },
  focusArea: { type: String, required: true, enum: ['Tactical', 'Technical', 'Physical', 'Psychological'] }
}, { timestamps: true });

DrillSchema.index({ focusArea: 1, ageGroup: 1 });
*/


-- ====================================================================
-- SECTION 3: ENTITY RELATIONSHIP OVERVIEW
-- ====================================================================
-- [Player] (1) <==== (M) [PlayerSession] (M) ====> (1) [TrainingSession]
--
-- - Players table holds general profile information.
-- - TrainingSessions table logs specific group/team practice sessions.
-- - PlayerSessions connects them, tracking individual presence, 
--   a performance evaluation rating, and technical annotations.
-- - Drills is an independent, high-performance static library.
-- ====================================================================

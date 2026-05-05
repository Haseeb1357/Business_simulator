/**
 * firestoreSync.ts
 *
 * Handles serializing the Zustand store state (which uses Map and Set)
 * into plain JSON for Firestore, and deserializing it back.
 *
 * A single Firestore document at:
 *   Collection: "simulations"
 *   Document:   "main"
 * holds the entire game state.
 */

import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
    TeamDecision, TeamQuarterResult, TeamCarryForward, GameConfig
} from '../engine/simulationEngine';
import { TeamInfo } from './simulationStore';

// ─── Serialized shape (plain JSON for Firestore) ────────────────────────────

export interface SerializedState {
    currentQuarter: number;
    gameStatus: 'inputting' | 'processing' | 'complete';
    teams: TeamInfo[];
    activeTeamId: number;
    gameConfig: GameConfig;
    totalQuarters: number;
    // Map<number, TeamDecision>  →  Record<string, TeamDecision>
    currentDecisions: Record<string, TeamDecision>;
    // Set<number>                →  number[]
    submittedTeams: number[];
    // Map<number, TeamQuarterResult[]> → Record<string, TeamQuarterResult[]>
    allResults: Record<string, TeamQuarterResult[]>;
    // Map<number, TeamCarryForward>    → Record<string, TeamCarryForward>
    carryForwards: Record<string, TeamCarryForward>;
    processingLog: string[];
    updatedAt: number; // epoch ms — used to deduplicate echoed writes
}

// ─── Serialize ───────────────────────────────────────────────────────────────

export function serializeState(s: {
    currentQuarter: number;
    gameStatus: 'inputting' | 'processing' | 'complete';
    teams: TeamInfo[];
    activeTeamId: number;
    gameConfig: GameConfig;
    totalQuarters: number;
    currentDecisions: Map<number, TeamDecision>;
    submittedTeams: Set<number>;
    allResults: Map<number, TeamQuarterResult[]>;
    carryForwards: Map<number, TeamCarryForward>;
    processingLog: string[];
}): SerializedState {
    const currentDecisions: Record<string, TeamDecision> = {};
    s.currentDecisions.forEach((v, k) => { currentDecisions[String(k)] = v; });

    const allResults: Record<string, TeamQuarterResult[]> = {};
    s.allResults.forEach((v, k) => { allResults[String(k)] = v; });

    const carryForwards: Record<string, TeamCarryForward> = {};
    s.carryForwards.forEach((v, k) => { carryForwards[String(k)] = v; });

    return {
        currentQuarter: s.currentQuarter,
        gameStatus: s.gameStatus,
        teams: s.teams,
        activeTeamId: s.activeTeamId,
        gameConfig: s.gameConfig,
        totalQuarters: s.totalQuarters,
        currentDecisions,
        submittedTeams: Array.from(s.submittedTeams),
        allResults,
        carryForwards,
        processingLog: s.processingLog,
        updatedAt: Date.now(),
    };
}

// ─── Deserialize ─────────────────────────────────────────────────────────────

export interface DeserializedState {
    currentQuarter: number;
    gameStatus: 'inputting' | 'processing' | 'complete';
    teams: TeamInfo[];
    activeTeamId: number;
    gameConfig: GameConfig;
    totalQuarters: number;
    currentDecisions: Map<number, TeamDecision>;
    submittedTeams: Set<number>;
    allResults: Map<number, TeamQuarterResult[]>;
    carryForwards: Map<number, TeamCarryForward>;
    processingLog: string[];
}

export function deserializeState(s: SerializedState): DeserializedState {
    const currentDecisions = new Map<number, TeamDecision>();
    Object.entries(s.currentDecisions || {}).forEach(([k, v]) => {
        currentDecisions.set(Number(k), v as TeamDecision);
    });

    const allResults = new Map<number, TeamQuarterResult[]>();
    Object.entries(s.allResults || {}).forEach(([k, v]) => {
        allResults.set(Number(k), v as TeamQuarterResult[]);
    });

    const carryForwards = new Map<number, TeamCarryForward>();
    Object.entries(s.carryForwards || {}).forEach(([k, v]) => {
        carryForwards.set(Number(k), v as TeamCarryForward);
    });

    return {
        currentQuarter: s.currentQuarter,
        gameStatus: s.gameStatus,
        teams: s.teams,
        activeTeamId: s.activeTeamId,
        gameConfig: s.gameConfig,
        totalQuarters: s.totalQuarters,
        currentDecisions,
        submittedTeams: new Set<number>(s.submittedTeams || []),
        allResults,
        carryForwards,
        processingLog: s.processingLog || [],
    };
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

const COLLECTION = 'simulations';
const DOC_ID = 'main';

function gameDocRef() {
    return doc(db, COLLECTION, DOC_ID);
}

/** Write full state to Firestore */
export async function saveStateToFirestore(serialized: SerializedState): Promise<void> {
    try {
        await setDoc(gameDocRef(), serialized);
    } catch (err) {
        console.error('[Firestore] Failed to save state:', err);
    }
}

/** Load state once (on app init, before the listener kicks in) */
export async function loadInitialState(): Promise<DeserializedState | null> {
    try {
        const snap = await getDoc(gameDocRef());
        if (snap.exists()) {
            return deserializeState(snap.data() as SerializedState);
        }
    } catch (err) {
        console.error('[Firestore] Failed to load initial state:', err);
    }
    return null;
}

/** Subscribe to real-time updates. Returns unsubscribe function. */
export function subscribeToFirestore(
    callback: (state: DeserializedState, updatedAt: number) => void
): () => void {
    return onSnapshot(gameDocRef(), (snap) => {
        if (snap.exists()) {
            const raw = snap.data() as SerializedState;
            callback(deserializeState(raw), raw.updatedAt ?? 0);
        }
    }, (err) => {
        console.error('[Firestore] Snapshot listener error:', err);
    });
}

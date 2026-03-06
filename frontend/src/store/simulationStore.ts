import { create } from 'zustand';
import {
    TeamDecision, TeamQuarterResult, TeamCarryForward, GameConfig, IPOState,
    getDefaultDecision, randomizeDecision, getInitialCarryForward,
    processQuarterSimulation,
} from '../engine/simulationEngine';

// ---- Team Info ----
export interface TeamInfo {
    id: number;
    name: string;
    companyNumber: number;
}

// ---- Store Interface ----
interface SimulationState {
    // Game state
    currentQuarter: number;
    gameStatus: 'inputting' | 'processing' | 'complete';
    teams: TeamInfo[];
    activeTeamId: number;
    gameConfig: GameConfig;
    totalQuarters: number;

    // Decisions: teamId -> decision for current quarter
    currentDecisions: Map<number, TeamDecision>;
    submittedTeams: Set<number>;

    // Results: teamId -> array of quarter results
    allResults: Map<number, TeamQuarterResult[]>;

    // Carry-forward state per team
    carryForwards: Map<number, TeamCarryForward>;

    // Processing log
    processingLog: string[];

    // Actions
    setActiveTeam: (teamId: number) => void;
    updateDecision: (teamId: number, decision: TeamDecision) => void;
    randomizeCurrentDecision: () => void;
    submitDecision: (teamId: number) => void;
    processQuarter: () => void;
    resetGame: () => void;
    updateGameConfig: (config: Partial<GameConfig>) => void;
    launchIPO: (teamId: number, sharePrice: number, sharesIssued: number) => void;
    adminEditSharePrice: (teamId: number, newPrice: number) => void;

    // Helpers
    getTeamResult: (teamId: number, quarter: number) => TeamQuarterResult | undefined;
    getTeamLatestResult: (teamId: number) => TeamQuarterResult | undefined;
    getAllTeamLatestResults: () => TeamQuarterResult[];
    getTeamResultHistory: (teamId: number) => TeamQuarterResult[];
    getTeamIPOState: (teamId: number) => IPOState;
}

// ---- Default Teams ----
const DEFAULT_TEAMS: TeamInfo[] = [
    { id: 1, name: 'Alpha Corp', companyNumber: 1 },
    { id: 2, name: 'Beta Industries', companyNumber: 2 },
    { id: 3, name: 'Gamma Global', companyNumber: 3 },
    { id: 4, name: 'Delta Dynamics', companyNumber: 4 },
    { id: 5, name: 'Epsilon Enterprises', companyNumber: 5 },
    { id: 6, name: 'Zeta Holdings', companyNumber: 6 },
    { id: 7, name: 'Eta Manufacturing', companyNumber: 7 },
    { id: 8, name: 'Theta Solutions', companyNumber: 8 },
];

const DEFAULT_CONFIG: GameConfig = {
    gdpGrowth: 2.5,
    interestRate: 5.0,
    inflationRate: 2.0,
    materialPrice: 50,
    unemploymentRate: 5.0,
    marketGrowthFactor: 1.02,
};

// ---- Initialize Maps ----
function initDecisions(teams: TeamInfo[]): Map<number, TeamDecision> {
    const map = new Map<number, TeamDecision>();
    teams.forEach(t => map.set(t.id, getDefaultDecision()));
    return map;
}

function initCarryForwards(teams: TeamInfo[]): Map<number, TeamCarryForward> {
    const map = new Map<number, TeamCarryForward>();
    teams.forEach(t => map.set(t.id, getInitialCarryForward()));
    return map;
}

// ---- Store ----
export const useSimulationStore = create<SimulationState>((set, get) => ({
    currentQuarter: 1,
    gameStatus: 'inputting',
    teams: DEFAULT_TEAMS,
    activeTeamId: 1,
    gameConfig: DEFAULT_CONFIG,
    totalQuarters: 12,
    currentDecisions: initDecisions(DEFAULT_TEAMS),
    submittedTeams: new Set<number>(),
    allResults: new Map<number, TeamQuarterResult[]>(),
    carryForwards: initCarryForwards(DEFAULT_TEAMS),
    processingLog: [],

    setActiveTeam: (teamId) => set({ activeTeamId: teamId }),

    updateDecision: (teamId, decision) => {
        const map = new Map(get().currentDecisions);
        map.set(teamId, decision);
        set({ currentDecisions: map });
    },

    randomizeCurrentDecision: () => {
        const { activeTeamId, currentDecisions } = get();
        const map = new Map(currentDecisions);
        map.set(activeTeamId, randomizeDecision());
        set({ currentDecisions: map });
    },

    submitDecision: (teamId) => {
        const submitted = new Set(get().submittedTeams);
        submitted.add(teamId);
        set({ submittedTeams: submitted });
    },

    processQuarter: () => {
        const state = get();
        const log: string[] = [];

        set({ gameStatus: 'processing', processingLog: [] });

        log.push(`> Locking decisions for Quarter ${state.currentQuarter}...`);
        set({ processingLog: [...log] });

        // Auto-submit any teams that haven't submitted (use defaults)
        const decisions = new Map(state.currentDecisions);
        for (const team of state.teams) {
            if (!decisions.has(team.id)) {
                decisions.set(team.id, getDefaultDecision());
            }
        }

        log.push(`> ${state.teams.length} teams locked. Running simulation...`);
        log.push(`> Calculating demand across ${state.teams.length} companies × 3 products...`);
        set({ processingLog: [...log] });

        // Run simulation
        const { results, newCarryForwards } = processQuarterSimulation(
            decisions,
            state.carryForwards,
            state.teams.map(t => t.id),
            state.currentQuarter,
            state.gameConfig
        );

        // Store results - create new arrays to trigger Zustand re-render
        const allRes = new Map(state.allResults);
        for (const [tid, result] of results) {
            const existing = allRes.get(tid) || [];
            allRes.set(tid, [...existing, result]);
        }

        log.push(`> Processing factory output vs demand constraints...`);
        log.push(`> Generating P&L and Balance Sheet ledgers...`);

        for (const [tid, result] of results) {
            const team = state.teams.find(t => t.id === tid);
            log.push(`> ${team?.name}: Revenue $${result.kpis.totalRevenue.toLocaleString()}, Net Profit $${result.kpis.netProfit.toLocaleString()}`);
        }

        log.push(`> Quarter ${state.currentQuarter} processing COMPLETE.`);
        log.push(`> Results written. Quarter advanced to Q${state.currentQuarter + 1}.`);

        set({
            allResults: allRes,
            carryForwards: newCarryForwards,
            currentQuarter: state.currentQuarter + 1,
            gameStatus: 'inputting',
            submittedTeams: new Set<number>(),
            currentDecisions: initDecisions(state.teams),
            processingLog: log,
        });
    },

    resetGame: () => {
        const teams = get().teams;
        set({
            currentQuarter: 1,
            gameStatus: 'inputting',
            currentDecisions: initDecisions(teams),
            submittedTeams: new Set<number>(),
            allResults: new Map<number, TeamQuarterResult[]>(),
            carryForwards: initCarryForwards(teams),
            processingLog: [],
        });
    },

    updateGameConfig: (config) => {
        set({ gameConfig: { ...get().gameConfig, ...config } });
    },

    launchIPO: (teamId, sharePrice, sharesIssued) => {
        const cfs = new Map(get().carryForwards);
        const cf = cfs.get(teamId);
        if (cf && !cf.ipoState.isPublic) {
            cfs.set(teamId, {
                ...cf,
                ipoState: { isPublic: true, sharePrice, sharesIssued, ipoQuarter: get().currentQuarter },
            });
            set({ carryForwards: cfs });
        }
    },

    adminEditSharePrice: (teamId, newPrice) => {
        const cfs = new Map(get().carryForwards);
        const cf = cfs.get(teamId);
        if (cf && cf.ipoState.isPublic) {
            cfs.set(teamId, {
                ...cf,
                ipoState: { ...cf.ipoState, sharePrice: newPrice },
            });
            set({ carryForwards: cfs });
        }
    },

    getTeamResult: (teamId, quarter) => {
        const results = get().allResults.get(teamId);
        return results?.find(r => r.quarter === quarter);
    },

    getTeamLatestResult: (teamId) => {
        const results = get().allResults.get(teamId);
        return results?.[results.length - 1];
    },

    getAllTeamLatestResults: () => {
        const { allResults, teams, currentQuarter } = get();
        const latestQ = currentQuarter - 1;
        if (latestQ < 1) return [];
        return teams.map(t => {
            const res = allResults.get(t.id);
            return res?.find(r => r.quarter === latestQ);
        }).filter(Boolean) as TeamQuarterResult[];
    },

    getTeamResultHistory: (teamId) => {
        return get().allResults.get(teamId) || [];
    },

    getTeamIPOState: (teamId) => {
        const cf = get().carryForwards.get(teamId);
        return cf?.ipoState ?? { isPublic: false, sharePrice: 0, sharesIssued: 0, ipoQuarter: null };
    },
}));

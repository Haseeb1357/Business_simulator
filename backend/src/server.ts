import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { runSimulationEngine } from './services/simulateQuarter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ===== TEAM CRUD =====
app.get('/api/teams', async (_req: Request, res: Response) => {
    const teams = await prisma.team.findMany();
    res.json(teams);
});

app.post('/api/teams', async (req: Request, res: Response) => {
    const { name, company_number, password, gameId } = req.body;
    const team = await prisma.team.create({
        data: { name, company_number, password, gameId }
    });
    res.json(team);
});

// ===== GAME CRUD =====
app.get('/api/games', async (_req: Request, res: Response) => {
    const games = await prisma.gameInstance.findMany({ include: { teams: true } });
    res.json(games);
});

app.post('/api/games', async (req: Request, res: Response) => {
    const { name } = req.body;
    const game = await prisma.gameInstance.create({
        data: { name }
    });
    res.json(game);
});

// ===== DECISIONS =====
app.post('/api/decisions', async (req: Request, res: Response) => {
    const { teamId, gameId, quarter, prices, advertising, ...rest } = req.body;
    const decision = await prisma.decision.upsert({
        where: { teamId_quarter: { teamId, quarter } },
        update: {
            prices: JSON.stringify(prices),
            advertising: JSON.stringify(advertising),
            ...rest,
            status: 'submitted'
        },
        create: {
            teamId,
            gameId,
            quarter,
            prices: JSON.stringify(prices),
            advertising: JSON.stringify(advertising),
            ...rest,
            status: 'submitted'
        }
    });
    res.json(decision);
});

// ===== SIMULATION =====
app.post('/api/simulation/process-quarter', async (req: Request, res: Response) => {
    try {
        const { gameId } = req.body;

        const game = await prisma.gameInstance.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }

        if (game.status === 'processing') {
            res.status(400).json({ error: 'Quarter is currently processing' });
            return;
        }

        // Update status
        await prisma.gameInstance.update({
            where: { id: gameId },
            data: { status: 'processing' }
        });

        // Run simulation engine
        const result = await runSimulationEngine(gameId, game.current_quarter);

        // Advance the quarter
        await prisma.gameInstance.update({
            where: { id: gameId },
            data: {
                status: 'inputting',
                current_quarter: game.current_quarter + 1
            }
        });

        res.json({ message: 'Quarter processed successfully', result });

    } catch (error) {
        console.error('Error processing quarter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== RESULTS =====
app.get('/api/results/:gameId/:quarter', async (req: Request, res: Response) => {
    const gameId = req.params.gameId as string;
    const quarter = req.params.quarter as string;
    const results = await prisma.financialSnapshot.findMany({
        where: {
            gameId: parseInt(gameId),
            quarter: parseInt(quarter)
        },
        include: { team: true }
    });
    res.json(results);
});

// ===== LEADERBOARD =====
app.get('/api/leaderboard/:gameId', async (req: Request, res: Response) => {
    const gameId = req.params.gameId as string;
    const game = await prisma.gameInstance.findUnique({ where: { id: parseInt(gameId) } });
    if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
    }
    const leaderboard = await prisma.financialSnapshot.findMany({
        where: {
            gameId: parseInt(gameId),
            quarter: game.current_quarter - 1
        },
        include: { team: true },
        orderBy: { company_value: 'desc' }
    });
    res.json(leaderboard);
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'topaz-sync-sim-engine' });
});

app.listen(port, () => {
    console.log(`Topaz-Sync backend listening on port ${port}`);
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding database...');

    // Create a game
    const game = await prisma.gameInstance.create({
        data: {
            name: 'Topaz Simulation - GM05',
            current_quarter: 1,
            gdp_growth: 2.5,
            interest_rate: 5.0
        }
    });

    console.log(`Created game: ${game.name} (ID: ${game.id})`);

    // Create 8 teams with preset history
    const teamNames = [
        'Alpha Corp', 'Beta Industries', 'Gamma Global', 'Delta Dynamics',
        'Epsilon Enterprises', 'Zeta Holdings', 'Eta Manufacturing', 'Theta Solutions'
    ];

    for (let i = 0; i < teamNames.length; i++) {
        const team = await prisma.team.create({
            data: {
                gameId: game.id,
                name: teamNames[i],
                company_number: i + 1,
                password: `team${i + 1}pass`
            }
        });

        console.log(`Created team: ${team.name} (Company ${team.company_number})`);

        // Create default decision for Q1
        await prisma.decision.create({
            data: {
                teamId: team.id,
                gameId: game.id,
                quarter: 1,
                prices: JSON.stringify({
                    p1: { home: 150, export: 170 },
                    p2: { home: 270, export: 290 },
                    p3: { home: 550, export: 580 }
                }),
                advertising: JSON.stringify({
                    p1: { trade: 10, press_tv: 12, merchandising: 8 },
                    p2: { trade: 10, press_tv: 14, merchandising: 8 },
                    p3: { trade: 18, press_tv: 20, merchandising: 10 }
                }),
                shift_level: 1,
                maintenance_hours: 50,
                management_budget_k: 120,
                dividend_pence: 4,
                status: 'submitted'
            }
        });
    }

    console.log('Seeding complete!');
    await prisma.$disconnect();
}

seed().catch(console.error);

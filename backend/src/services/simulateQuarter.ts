import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The "Black Box" simulation logic
export const runSimulationEngine = async (gameId: number, quarter: number) => {
    console.log(`[SIM] Starting Simulation Run for Game ${gameId}, Quarter ${quarter}`);

    // 1. Fetch game with teams and their decisions
    const game = await prisma.gameInstance.findUnique({
        where: { id: gameId },
        include: {
            teams: {
                include: {
                    decisions: { where: { quarter } }
                }
            }
        }
    });

    if (!game) throw new Error('Game instance not found.');

    const teams = game.teams;
    const totalTeams = teams.length;
    if (totalTeams === 0) throw new Error('No teams in this game.');

    // Base market demand scaled by GDP growth
    const baseMarketSize = { p1: 10000, p2: 5000, p3: 2500 };
    const gdpMultiplier = 1 + (game.gdp_growth / 100);

    // 2. Calculate industry averages for relative pricing
    const priceAccumulator = { p1: { home: 0, export: 0 }, p2: { home: 0, export: 0 }, p3: { home: 0, export: 0 } };
    let submittedCount = 0;

    for (const team of teams) {
        const dec = team.decisions[0];
        if (!dec) continue;
        const prices = JSON.parse(dec.prices);
        priceAccumulator.p1.home += prices?.p1?.home || 150;
        priceAccumulator.p1.export += prices?.p1?.export || 170;
        priceAccumulator.p2.home += prices?.p2?.home || 270;
        priceAccumulator.p2.export += prices?.p2?.export || 290;
        priceAccumulator.p3.home += prices?.p3?.home || 550;
        priceAccumulator.p3.export += prices?.p3?.export || 580;
        submittedCount++;
    }

    if (submittedCount === 0) throw new Error('No team decisions submitted.');

    const avgPrices = {
        p1: { home: priceAccumulator.p1.home / submittedCount, export: priceAccumulator.p1.export / submittedCount },
        p2: { home: priceAccumulator.p2.home / submittedCount, export: priceAccumulator.p2.export / submittedCount },
        p3: { home: priceAccumulator.p3.home / submittedCount, export: priceAccumulator.p3.export / submittedCount },
    };

    // 3. Process each team
    for (const team of teams) {
        const dec = team.decisions[0];
        if (!dec) continue;

        const prices = JSON.parse(dec.prices);
        const adv = JSON.parse(dec.advertising);

        // Demand formula: Q_id = MarketSize * (Price_i^-e / SumPrice_j^-e) * AdvEffect
        const elasticity = 1.5;
        const teamPrice_p1 = prices?.p1?.home || 150;
        const advSpend = (adv?.p1?.trade || 10) + (adv?.p1?.press_tv || 12);
        const advEffect = 1 + (advSpend / 100); // Simplified advertising effect

        // Relative price effect
        const relativePriceEffect = Math.pow(avgPrices.p1.home / teamPrice_p1, elasticity);
        const teamDemand_p1 = (baseMarketSize.p1 * gdpMultiplier / submittedCount) * relativePriceEffect * advEffect;

        // Production bottleneck
        const machineCapacity = 3700;
        const assemblyCapacity = Math.floor(18340 / 118); // hours / assembly time per unit
        const actualProduced = Math.min(machineCapacity, assemblyCapacity, Math.ceil(teamDemand_p1));

        // Inventory & sales
        const unitsSold = Math.min(actualProduced, Math.floor(teamDemand_p1));
        const rejected = Math.floor(actualProduced * 0.03);

        // Revenue
        const revenue = unitsSold * teamPrice_p1;

        // COGS
        const materialCost = actualProduced * 40; // $40 per unit material
        const assemblyWages = actualProduced * 7 * (118 / 60); // $7/hr * assembly time
        const machinistWages = 213535; // Fixed quarterly cost
        const machineRunning = 107322;
        const closingStockVal = (actualProduced - unitsSold) * 40;

        const cogs = materialCost + assemblyWages + machinistWages + machineRunning - closingStockVal;

        // Overheads
        const advertisingCost = advSpend * 1000;
        const salesExpense = 178224;
        const managementBudget = dec.management_budget_k * 1000;
        const maintenanceCost = dec.maintenance_hours * 600;
        const totalOverheads = advertisingCost + salesExpense + managementBudget + maintenanceCost + 45000 + 13500;

        const grossProfit = revenue - cogs;
        const interestPaid = 1615;
        const depreciation = 50044;
        const netProfit = grossProfit - totalOverheads - interestPaid - depreciation;

        // Share price calculation
        const prevSharePrice = 116.0;
        const sharePriceChange = (netProfit / 100000) * 5;
        const newSharePrice = Math.max(10, prevSharePrice + sharePriceChange);

        // Market share
        const totalMarket = baseMarketSize.p1 * gdpMultiplier;
        const marketShare = (unitsSold / totalMarket) * 100;

        // Company value
        const companyValue = 2000000 + netProfit;

        // Write result
        await prisma.financialSnapshot.create({
            data: {
                teamId: team.id,
                gameId: game.id,
                quarter,
                net_profit: netProfit,
                share_price: newSharePrice,
                market_share: marketShare,
                company_value: companyValue,
                profit_and_loss: JSON.stringify({
                    revenue,
                    openingStockValue: 126459,
                    materialsPurchased: materialCost,
                    assemblyWages,
                    machinistWages,
                    machineRunningCosts: machineRunning,
                    lessClosingStockValue: closingStockVal,
                    costOfSales: cogs,
                    grossProfit,
                    interestPaid,
                    overheads: totalOverheads,
                    depreciation,
                    netProfit,
                    dividendPaid: dec.dividend_pence * 800,
                    transferredToReserves: netProfit - (dec.dividend_pence * 800)
                }),
                balance_sheet: JSON.stringify({
                    assets: {
                        property: 300000,
                        machines: 1594818 - depreciation,
                        vehicles: 175758,
                        productStocks: closingStockVal,
                        materialStock: 57711,
                        debtors: revenue * 0.35,
                        cashInvested: 0
                    },
                    liabilities: {
                        taxDue: 0,
                        creditors: materialCost * 1.4,
                        overdraft: netProfit < 0 ? Math.abs(netProfit) : 0,
                        unsecuredLoans: 0
                    },
                    netAssets: companyValue,
                    ordinaryCapital: 2000000,
                    reserves: netProfit
                }),
                cash_flow: JSON.stringify({
                    tradingReceipts: revenue * 0.99,
                    tradingPayments: cogs + totalOverheads,
                    operatingCashFlow: revenue * 0.99 - cogs - totalOverheads,
                    capitalPayments: 100000,
                    investingCashFlow: -100000,
                    interestPaid,
                    dividendPaid: dec.dividend_pence * 800,
                    netCashFlow: (revenue * 0.99 - cogs - totalOverheads) - 100000 - interestPaid - dec.dividend_pence * 800
                }),
                operations: JSON.stringify({
                    demand: teamDemand_p1,
                    produced: actualProduced,
                    sold: unitsSold,
                    rejected,
                    machineEfficiency: 95.4,
                    shiftLevel: dec.shift_level
                })
            }
        });

        console.log(`[SIM] Team "${team.name}": Revenue $${revenue}, Net Profit $${netProfit}, Share ${newSharePrice.toFixed(1)}c`);
    }

    return { success: true, teamsProcessed: submittedCount };
};

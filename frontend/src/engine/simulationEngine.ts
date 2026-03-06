// ============================================================
// CUI SIMULATION ENGINE
// Multi-product demand, production, and financial model
// ============================================================

// ---- Type Definitions ----

export interface ProductPrices {
    home: number;
    export: number;
}

export interface ProductAdvertising {
    trade: number;
    press_tv: number;
    merchandising: number;
}

export interface TeamDecision {
    prices: { p1: ProductPrices; p2: ProductPrices; p3: ProductPrices };
    advertising: { p1: ProductAdvertising; p2: ProductAdvertising; p3: ProductAdvertising };
    rawMaterialOrder: number;       // thousands of units
    shiftLevel: number;             // 1 = normal, 2 = overtime, 3 = double
    maintenanceHours: number;       // quarterly
    machinePurchase: number;        // number of new machines ($100k each)
    recruitWorkers: number;
    dismissWorkers: number;
    trainWorkers: number;
    dividendCents: number;          // cents per share (only relevant if public)
    managementBudgetK: number;      // thousands
    loanRequest: number;            // thousands
    rdSpend: number;                // thousands
    // IPO fields
    launchIPO: boolean;             // true = team wants to go public this quarter
    ipoSharePrice: number;          // initial share price in dollars
    ipoSharesIssued: number;        // number of shares to issue
}

export interface IPOState {
    isPublic: boolean;
    sharePrice: number;             // current share price (0 if private)
    sharesIssued: number;           // total shares outstanding (0 if private)
    ipoQuarter: number | null;      // quarter when IPO happened
}

export interface ProductResult {
    demand: number;
    produced: number;
    sold: number;
    revenue: number;
    rejected: number;
    closingStock: number;
    openingStock: number;
}

export interface ProfitAndLoss {
    salesRevenue: number;
    openingStockValue: number;
    materialsPurchased: number;
    assemblyWages: number;
    machinistWages: number;
    machineRunningCosts: number;
    lessClosingStockValue: number;
    costOfSales: number;
    grossProfit: number;
    advertisingCost: number;
    salesExpenses: number;
    managementSalaries: number;
    maintenanceCosts: number;
    depreciation: number;
    otherOverheads: number;
    totalOverheads: number;
    operatingProfit: number;
    interestPaid: number;
    netProfitBeforeTax: number;
    tax: number;
    netProfit: number;
    dividendPaid: number;
    retainedProfit: number;
}

export interface BalanceSheet {
    fixedAssets: {
        property: number;
        machinery: number;
        vehicles: number;
        totalFixed: number;
    };
    currentAssets: {
        productStock: number;
        materialStock: number;
        debtors: number;
        cash: number;
        totalCurrent: number;
    };
    currentLiabilities: {
        creditors: number;
        overdraft: number;
        taxOwed: number;
        totalCurrent: number;
    };
    netCurrentAssets: number;
    totalAssetsLessCurrentLiabilities: number;
    longTermLiabilities: {
        loans: number;
    };
    netAssets: number;
    capital: {
        shareCapital: number;
        reserves: number;
        totalCapital: number;
    };
}

export interface CashFlow {
    tradingReceipts: number;
    tradingPayments: number;
    operatingCashFlow: number;
    capitalExpenditure: number;
    investingCashFlow: number;
    loanReceipts: number;
    interestPaid: number;
    dividendPaid: number;
    financingCashFlow: number;
    netCashFlow: number;
    openingBalance: number;
    closingBalance: number;
}

export interface TeamQuarterResult {
    teamId: number;
    quarter: number;
    products: { p1: ProductResult; p2: ProductResult; p3: ProductResult };
    profitAndLoss: ProfitAndLoss;
    balanceSheet: BalanceSheet;
    cashFlow: CashFlow;
    kpis: {
        netProfit: number;
        sharePrice: number;
        marketShare: number;
        companyValue: number;
        totalRevenue: number;
        employees: number;
    };
}

export interface GameConfig {
    gdpGrowth: number;
    interestRate: number;
    inflationRate: number;
    materialPrice: number;   // per 1000 units
    unemploymentRate: number;
    marketGrowthFactor: number;
}

// ---- Product Defaults ----

const PRODUCT_DEFAULTS = {
    p1: {
        defaultHomePrice: 150, defaultExportPrice: 170,
        baseDemandHome: 3700, baseDemandExport: 1800,
        assemblyMinutes: 118, materialCostPerUnit: 40,
        elasticity: 1.5, qualityFactor: 1.0,
    },
    p2: {
        defaultHomePrice: 270, defaultExportPrice: 290,
        baseDemandHome: 2025, baseDemandExport: 980,
        assemblyMinutes: 165, materialCostPerUnit: 75,
        elasticity: 1.3, qualityFactor: 1.0,
    },
    p3: {
        defaultHomePrice: 550, defaultExportPrice: 580,
        baseDemandHome: 900, baseDemandExport: 450,
        assemblyMinutes: 330, materialCostPerUnit: 150,
        elasticity: 1.1, qualityFactor: 1.0,
    },
};

// ---- Default Decision ----

export function getDefaultDecision(): TeamDecision {
    return {
        prices: {
            p1: { home: 150, export: 170 },
            p2: { home: 270, export: 290 },
            p3: { home: 550, export: 580 },
        },
        advertising: {
            p1: { trade: 10, press_tv: 12, merchandising: 8 },
            p2: { trade: 10, press_tv: 14, merchandising: 8 },
            p3: { trade: 18, press_tv: 20, merchandising: 10 },
        },
        rawMaterialOrder: 12,
        shiftLevel: 1,
        maintenanceHours: 50,
        machinePurchase: 0,
        recruitWorkers: 0,
        dismissWorkers: 0,
        trainWorkers: 0,
        dividendCents: 0,
        managementBudgetK: 120,
        loanRequest: 0,
        rdSpend: 50,
        launchIPO: false,
        ipoSharePrice: 0,
        ipoSharesIssued: 0,
    };
}

// ---- Randomize Decision ----

function randBetween(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
}

export function randomizeDecision(): TeamDecision {
    return {
        prices: {
            p1: { home: randBetween(120, 185), export: randBetween(140, 210) },
            p2: { home: randBetween(220, 340), export: randBetween(240, 360) },
            p3: { home: randBetween(440, 680), export: randBetween(470, 720) },
        },
        advertising: {
            p1: { trade: randBetween(5, 20), press_tv: randBetween(5, 25), merchandising: randBetween(3, 15) },
            p2: { trade: randBetween(5, 20), press_tv: randBetween(8, 28), merchandising: randBetween(3, 15) },
            p3: { trade: randBetween(10, 30), press_tv: randBetween(12, 35), merchandising: randBetween(5, 20) },
        },
        rawMaterialOrder: randBetween(8, 18),
        shiftLevel: randBetween(1, 2),
        maintenanceHours: randBetween(30, 80),
        machinePurchase: Math.random() > 0.7 ? randBetween(1, 3) : 0,
        recruitWorkers: randBetween(0, 10),
        dismissWorkers: Math.random() > 0.8 ? randBetween(1, 5) : 0,
        trainWorkers: randBetween(0, 8),
        dividendCents: randBetween(0, 8),
        managementBudgetK: randBetween(80, 180),
        loanRequest: Math.random() > 0.7 ? randBetween(50, 300) : 0,
        rdSpend: randBetween(20, 100),
        launchIPO: false,
        ipoSharePrice: 0,
        ipoSharesIssued: 0,
    };
}

// ---- Previous Quarter State (carry forward) ----

export interface TeamCarryForward {
    cash: number;
    machines: number;           // net book value
    machineCapacityHours: number;
    employees: number;          // assembly workers
    productStock: { p1: number; p2: number; p3: number };
    materialStock: number;
    loans: number;
    reserves: number;
    ipoState: IPOState;
    cumulativeProfit: number;
    trainedWorkers: number;
}

export function getInitialCarryForward(): TeamCarryForward {
    return {
        cash: 50000,
        machines: 1594818,
        machineCapacityHours: 10920,
        employees: 92,
        productStock: { p1: 200, p2: 100, p3: 50 },
        materialStock: 5000,
        loans: 0,
        reserves: 0,
        ipoState: { isPublic: false, sharePrice: 0, sharesIssued: 0, ipoQuarter: null },
        cumulativeProfit: 0,
        trainedWorkers: 0,
    };
}

// ---- MAIN SIMULATION FUNCTION ----

export function processQuarterSimulation(
    decisions: Map<number, TeamDecision>,
    carryForwards: Map<number, TeamCarryForward>,
    teamIds: number[],
    quarter: number,
    config: GameConfig
): { results: Map<number, TeamQuarterResult>; newCarryForwards: Map<number, TeamCarryForward> } {

    const numTeams = teamIds.length;
    const gdpMult = 1 + (config.gdpGrowth / 100);
    const inflMult = 1 + (config.inflationRate / 100);

    // 1. Calculate industry average prices for demand model
    const avgPrices = { p1: { home: 0, export: 0 }, p2: { home: 0, export: 0 }, p3: { home: 0, export: 0 } };
    const totalAdv = { p1: 0, p2: 0, p3: 0 };

    for (const tid of teamIds) {
        const dec = decisions.get(tid)!;
        for (const pk of ['p1', 'p2', 'p3'] as const) {
            avgPrices[pk].home += dec.prices[pk].home;
            avgPrices[pk].export += dec.prices[pk].export;
            const a = dec.advertising[pk];
            totalAdv[pk] += a.trade + a.press_tv + a.merchandising;
        }
    }
    for (const pk of ['p1', 'p2', 'p3'] as const) {
        avgPrices[pk].home /= numTeams;
        avgPrices[pk].export /= numTeams;
    }

    // 2. Process each team
    const results = new Map<number, TeamQuarterResult>();
    const newCarryForwards = new Map<number, TeamCarryForward>();
    const teamRevenues: number[] = [];

    for (const tid of teamIds) {
        const dec = decisions.get(tid)!;
        const prev = carryForwards.get(tid)!;

        // ---- WORKFORCE ----
        let employees = prev.employees + dec.recruitWorkers - dec.dismissWorkers;
        employees = Math.max(20, employees);
        const recruitCost = dec.recruitWorkers * 800;
        const dismissCost = dec.dismissWorkers * 1200;
        const trainCost = dec.trainWorkers * 500;
        const trainedPct = Math.min(1, (prev.trainedWorkers + dec.trainWorkers) / employees);
        const productivityBonus = 1 + trainedPct * 0.15; // up to 15% bonus

        // ---- MACHINES ----
        const newMachineCost = dec.machinePurchase * 100000;
        const depreciationRate = 0.03;
        const machineValue = prev.machines + newMachineCost;
        const depreciation = Math.round(machineValue * depreciationRate);
        const machineCapHours = prev.machineCapacityHours + dec.machinePurchase * 1200;

        // ---- SHIFT LEVEL ----
        const shiftMultiplier = dec.shiftLevel === 1 ? 1.0 : dec.shiftLevel === 2 ? 1.35 : 1.6;
        const shiftCostMultiplier = dec.shiftLevel === 1 ? 1.0 : dec.shiftLevel === 2 ? 1.5 : 2.0;

        // ---- ASSEMBLY CAPACITY ----
        const assemblyHoursAvailable = employees * 480 * shiftMultiplier * productivityBonus; // 480 hrs/qtr per worker

        // ---- MATERIALS ----
        const materialAvailable = prev.materialStock + dec.rawMaterialOrder * 1000;
        const materialCostTotal = dec.rawMaterialOrder * config.materialPrice;

        // ---- PROCESS EACH PRODUCT ----
        const productResults: Record<string, ProductResult> = {};
        let totalRev = 0;
        let totalCOGS = 0;
        let totalAdvCost = 0;
        let assemblyHoursUsed = 0;
        let materialUsed = 0;
        let totalUnitsSold = 0;
        let totalDemand = 0;

        for (const pk of ['p1', 'p2', 'p3'] as const) {
            const pdefs = PRODUCT_DEFAULTS[pk];
            const teamPrice = dec.prices[pk];
            const teamAdv = dec.advertising[pk];

            // DEMAND CALCULATION
            const advSpend = teamAdv.trade + teamAdv.press_tv + teamAdv.merchandising;
            const avgAdv = totalAdv[pk] / numTeams;
            const advEffect = avgAdv > 0 ? Math.pow(advSpend / avgAdv, 0.4) : 1;
            const rdEffect = 1 + (dec.rdSpend / 500); // R&D boosts quality

            // Home demand
            const priceRatioHome = avgPrices[pk].home / teamPrice.home;
            const homeDemand = Math.round(
                (pdefs.baseDemandHome * gdpMult * config.marketGrowthFactor / numTeams)
                * Math.pow(priceRatioHome, pdefs.elasticity)
                * advEffect * rdEffect * pdefs.qualityFactor
            );

            // Export demand
            const priceRatioExport = avgPrices[pk].export / teamPrice.export;
            const exportDemand = Math.round(
                (pdefs.baseDemandExport * gdpMult * config.marketGrowthFactor / numTeams)
                * Math.pow(priceRatioExport, pdefs.elasticity)
                * advEffect * rdEffect * 0.9
            );

            const totalProductDemand = homeDemand + exportDemand;

            // PRODUCTION CONSTRAINTS
            const assemblyTimePerUnit = pdefs.assemblyMinutes / 60;
            const maxByAssembly = Math.floor((assemblyHoursAvailable - assemblyHoursUsed) / assemblyTimePerUnit);
            const maxByMachine = Math.floor((machineCapHours * shiftMultiplier * 0.95 - assemblyHoursUsed * 0.5) / (assemblyTimePerUnit * 0.7));
            const maxByMaterial = Math.floor((materialAvailable - materialUsed) / 1); // 1 unit material per product

            const canProduce = Math.max(0, Math.min(maxByAssembly, maxByMachine, maxByMaterial, totalProductDemand + 200));
            const actualProduced = Math.min(canProduce, totalProductDemand + Math.round(totalProductDemand * 0.1));

            // Quality & Rejection
            const maintenanceEffect = Math.min(1, dec.maintenanceHours / 60);
            const rejectionRate = 0.05 * (1 - maintenanceEffect * 0.7);
            const rejected = Math.round(actualProduced * rejectionRate);
            const goodUnits = actualProduced - rejected;

            // Opening stock from previous quarter
            const openingStock = (prev.productStock as Record<string, number>)[pk] || 0;
            const availableForSale = goodUnits + openingStock;
            const unitsSold = Math.min(availableForSale, totalProductDemand);
            const closingStock = availableForSale - unitsSold;

            // Revenue (weighted avg of home/export prices)
            const homeRatio = homeDemand / Math.max(1, totalProductDemand);
            const avgSellingPrice = teamPrice.home * homeRatio + teamPrice.export * (1 - homeRatio);
            const revenue = Math.round(unitsSold * avgSellingPrice);

            totalRev += revenue;
            totalUnitsSold += unitsSold;
            totalDemand += totalProductDemand;
            assemblyHoursUsed += actualProduced * assemblyTimePerUnit;
            materialUsed += actualProduced;
            totalCOGS += actualProduced * pdefs.materialCostPerUnit;
            totalAdvCost += (teamAdv.trade + teamAdv.press_tv + teamAdv.merchandising) * 1000;

            productResults[pk] = {
                demand: totalProductDemand,
                produced: actualProduced,
                sold: unitsSold,
                revenue,
                rejected,
                closingStock,
                openingStock,
            };
        }

        // ---- FINANCIALS ----
        const assemblyWages = Math.round(assemblyHoursUsed * 6.95 * shiftCostMultiplier);
        const machinistWages = Math.round(39 * 11.5 * 480); // 39 machinists
        const machineRunning = Math.round(assemblyHoursUsed * 8.5);
        const closingStockValue = Object.values(productResults).reduce((s, r) => s + r.closingStock * 40, 0);
        const openingStockValue = Object.values(prev.productStock).reduce((s, v) => s + v * 40, 0);

        const costOfSales = openingStockValue + materialCostTotal + assemblyWages + machinistWages + machineRunning - closingStockValue;
        const grossProfit = totalRev - costOfSales;

        const salesExpenses = Math.round(178224 * inflMult);
        const managementSalaries = dec.managementBudgetK * 1000;
        const maintenanceCosts = dec.maintenanceHours * 600;
        const otherOverheads = Math.round((45000 + 13500 + recruitCost + dismissCost + trainCost) * inflMult);

        const totalOverheads = totalAdvCost + salesExpenses + managementSalaries + maintenanceCosts + depreciation + otherOverheads;
        const operatingProfit = grossProfit - totalOverheads;

        const interestRate = config.interestRate / 100;
        const interestPaid = Math.round((prev.loans > 0 ? prev.loans * interestRate / 4 : 0) + (prev.cash < 0 ? Math.abs(prev.cash) * (interestRate + 0.02) / 4 : 0));

        const netProfitBeforeTax = operatingProfit - interestPaid;
        const tax = netProfitBeforeTax > 0 ? Math.round(netProfitBeforeTax * 0.19) : 0;
        const netProfit = netProfitBeforeTax - tax;

        // ---- IPO LOGIC ----
        let currentIPO = { ...prev.ipoState };
        let ipoCashInflow = 0;
        if (!currentIPO.isPublic && dec.launchIPO && dec.ipoSharePrice > 0 && dec.ipoSharesIssued > 0) {
            currentIPO = {
                isPublic: true,
                sharePrice: dec.ipoSharePrice,
                sharesIssued: dec.ipoSharesIssued,
                ipoQuarter: quarter,
            };
            ipoCashInflow = dec.ipoSharePrice * dec.ipoSharesIssued;
        }

        // Dividends only apply to public companies
        const dividendTotal = currentIPO.isPublic ? dec.dividendCents * currentIPO.sharesIssued : 0;
        const retainedProfit = netProfit - dividendTotal;

        const pnl: ProfitAndLoss = {
            salesRevenue: totalRev,
            openingStockValue,
            materialsPurchased: materialCostTotal,
            assemblyWages,
            machinistWages,
            machineRunningCosts: machineRunning,
            lessClosingStockValue: closingStockValue,
            costOfSales,
            grossProfit,
            advertisingCost: totalAdvCost,
            salesExpenses,
            managementSalaries,
            maintenanceCosts,
            depreciation,
            otherOverheads,
            totalOverheads,
            operatingProfit,
            interestPaid,
            netProfitBeforeTax,
            tax,
            netProfit,
            dividendPaid: dividendTotal,
            retainedProfit,
        };

        // ---- BALANCE SHEET ----
        const newCash = prev.cash + totalRev * 0.65 - costOfSales * 0.8 - totalOverheads + dec.loanRequest * 1000 - newMachineCost - dividendTotal - interestPaid - tax + ipoCashInflow;
        const newLoans = prev.loans + dec.loanRequest * 1000;

        const bs: BalanceSheet = {
            fixedAssets: {
                property: 300000,
                machinery: machineValue - depreciation,
                vehicles: Math.round(175758 * (1 - 0.02)),
                totalFixed: 300000 + (machineValue - depreciation) + Math.round(175758 * 0.98),
            },
            currentAssets: {
                productStock: closingStockValue,
                materialStock: Math.round((materialAvailable - materialUsed) * config.materialPrice / 1000),
                debtors: Math.round(totalRev * 0.35),
                cash: Math.max(0, newCash),
                totalCurrent: 0,
            },
            currentLiabilities: {
                creditors: Math.round(materialCostTotal * 0.4),
                overdraft: newCash < 0 ? Math.abs(Math.round(newCash)) : 0,
                taxOwed: tax,
                totalCurrent: 0,
            },
            netCurrentAssets: 0,
            totalAssetsLessCurrentLiabilities: 0,
            longTermLiabilities: { loans: newLoans },
            netAssets: 0,
            capital: {
                shareCapital: currentIPO.isPublic ? currentIPO.sharesIssued * currentIPO.sharePrice : 0,
                reserves: prev.reserves + retainedProfit,
                totalCapital: 0,
            },
        };
        bs.currentAssets.totalCurrent = bs.currentAssets.productStock + bs.currentAssets.materialStock + bs.currentAssets.debtors + bs.currentAssets.cash;
        bs.currentLiabilities.totalCurrent = bs.currentLiabilities.creditors + bs.currentLiabilities.overdraft + bs.currentLiabilities.taxOwed;
        bs.netCurrentAssets = bs.currentAssets.totalCurrent - bs.currentLiabilities.totalCurrent;
        bs.totalAssetsLessCurrentLiabilities = bs.fixedAssets.totalFixed + bs.netCurrentAssets;
        bs.netAssets = bs.totalAssetsLessCurrentLiabilities - bs.longTermLiabilities.loans;
        bs.capital.totalCapital = bs.capital.shareCapital + bs.capital.reserves;

        // ---- CASH FLOW ----
        const cf: CashFlow = {
            tradingReceipts: Math.round(totalRev * 0.65 + prev.cash * 0.1),
            tradingPayments: Math.round(costOfSales * 0.8 + totalOverheads * 0.9),
            operatingCashFlow: 0,
            capitalExpenditure: newMachineCost,
            investingCashFlow: -newMachineCost,
            loanReceipts: dec.loanRequest * 1000,
            interestPaid,
            dividendPaid: dividendTotal,
            financingCashFlow: 0,
            netCashFlow: 0,
            openingBalance: prev.cash,
            closingBalance: newCash,
        };
        cf.operatingCashFlow = cf.tradingReceipts - cf.tradingPayments;
        cf.financingCashFlow = cf.loanReceipts - cf.interestPaid - cf.dividendPaid;
        cf.netCashFlow = cf.operatingCashFlow + cf.investingCashFlow + cf.financingCashFlow;

        // ---- KPIs ----
        const cumProfit = prev.cumulativeProfit + netProfit;
        let finalSharePrice = currentIPO.sharePrice;
        if (currentIPO.isPublic && currentIPO.ipoQuarter !== quarter) {
            // Share price evolves for public companies (not during IPO quarter itself)
            const sharePriceChange = (netProfit / 100000) * 3 + (dividendTotal > 0 ? 1.5 : -0.5);
            finalSharePrice = Math.max(1, Math.round((currentIPO.sharePrice + sharePriceChange) * 10) / 10);
        }
        if (currentIPO.isPublic) {
            currentIPO.sharePrice = finalSharePrice;
        }
        const marketShare = totalDemand > 0 ? Math.round((totalUnitsSold / (totalDemand * numTeams)) * 10000) / 100 : 0;
        const companyValue = currentIPO.isPublic ? finalSharePrice * currentIPO.sharesIssued : bs.netAssets;

        results.set(tid, {
            teamId: tid,
            quarter,
            products: productResults as any,
            profitAndLoss: pnl,
            balanceSheet: bs,
            cashFlow: cf,
            kpis: {
                netProfit,
                sharePrice: finalSharePrice,
                marketShare,
                companyValue,
                totalRevenue: totalRev,
                employees,
            },
        });

        teamRevenues.push(totalRev);

        newCarryForwards.set(tid, {
            cash: newCash,
            machines: machineValue - depreciation,
            machineCapacityHours: machineCapHours,
            employees,
            productStock: {
                p1: productResults.p1.closingStock,
                p2: productResults.p2.closingStock,
                p3: productResults.p3.closingStock,
            },
            materialStock: Math.max(0, materialAvailable - materialUsed),
            loans: newLoans,
            reserves: prev.reserves + retainedProfit,
            ipoState: currentIPO,
            cumulativeProfit: cumProfit,
            trainedWorkers: prev.trainedWorkers + dec.trainWorkers,
        });
    }

    return { results, newCarryForwards };
}

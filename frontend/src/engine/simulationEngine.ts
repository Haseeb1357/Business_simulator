// ============================================================
// CUI SIMULATION ENGINE
// Multi-product demand, production, and financial model
// ============================================================

// ---- Type Definitions for Topaz VBE ----

// 1. INPUT DECISIONS (The Form)
export interface TeamDecision {
    companyInfo: {
        simulationCode: string;
        year: string;
        quarter: string;
        groupNumber: string;
        companyNumber: string;
        identityNumber: string;
        status: string;
    };
    productImprovements: [boolean, boolean, boolean];
    prices: {
        exportMarket: [number, number, number];
        homeMarkets: [number, number, number];
    };
    promotion: {
        tradePress: [number, number, number];
        advertisingSupport: [number, number, number];
        merchandising: [number, number, number];
    };
    assemblyTime: [number, number, number];
    dividendRate: number;
    daysCreditAllowed: number;
    vansToBuy: number;
    vansToSell: number;
    informationWanted: {
        otherCompanies: boolean;
        marketShares: boolean;
    };
    deliveries: {
        exportArea: [number, number, number];
        southArea: [number, number, number];
        westArea: [number, number, number];
        northArea: [number, number, number];
    };
    researchExpenditure: number;
    salesforceAllocated: {
        exportArea: number;
        southArea: number;
        westArea: number;
        northArea: number;
    };
    salesforceRemuneration: {
        quarterlySalary: number;
        commission: number;
    };
    assemblyWorkersWage: {
        pounds: number;
        pence: number;
    };
    shiftLevel: number;
    managementBudget: number;
    contractMaintenanceHours: number;
    machinesToSell: number;
    salesforce: {
        recruit: number;
        dismiss: number;
        train: number;
    };
    assemblyWorkers: {
        recruit: number;
        dismiss: number;
        train: number;
    };
    rawMaterial: {
        unitsToOrder: number;
        supplierNo: number;
        deliveries: number;
    };
    newMachinesToOrder: number;
}

// 2. CARRY FORWARD INTERNAL STATE (For tracking between quarters)
export interface TopazInventory {
    finishedGoods: number;
    componentA: number;
    componentB: number;
    rawMaterials: number;
}

export interface TopazStaffing {
    productionWorkers: number;
    adminStaff: number;
    salesStaff: number;
    productionSkillLevel: number;
    salesSkillLevel: number;
}

export interface TopazAssets {
    plantUnits: number;
    machines: number;
    vehicles: number;
    plantValue: number;
    machinesValue: number;
    vehiclesValue: number;
}

export interface TeamCarryForward {
    inventory: TopazInventory;
    staffing: TopazStaffing;
    assets: TopazAssets;

    // Financial history
    cash: number;
    overdraft: number;
    fixedTermLoans: number;
    retainedProfit: number;
    shareCapital: number;

    // Prior quarter tracking
    lastQuarterTaxOwed: number;
    lastQuarterRDCumulative: number;
}

// 3. OUTPUT REPORT (What the user sees after execution)
export interface TopazProfitAndLoss {
    salesRevenue: number;
    openingStockValue: number;
    materialsPurchased: number;
    productionWages: number;
    depreciation: number;
    lessClosingStockValue: number;
    costOfGoodsSold: number;
    grossProfit: number;

    advertisingCost: number;
    salesForceCost: number;
    commissionCost: number;
    adminSalaries: number;
    qcCost: number;
    rdCost: number;
    interestPaid: number;
    totalOverheads: number;

    operatingProfit: number;
    tax: number;
    netProfit: number;
    dividendPaid: number;
    retainedProfit: number;
}

export interface TopazBalanceSheet {
    fixedAssets: {
        plant: number;
        machines: number;
        vehicles: number;
        totalFixed: number;
    };
    currentAssets: {
        stockValuation: number;
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

export interface TopazProductStats {
    potentialSalesArea1: number;
    actualSalesArea1: number;
    potentialSalesArea2: number;
    actualSalesArea2: number;
    marketSharePercent: number;
    qualityRatingPercent: number;
    defectsPercent: number;
}

export interface TeamQuarterResult {
    teamId: number;
    quarter: number;
    decisions: TeamDecision;
    previousCarryForward: TeamCarryForward;
    carryForward: TeamCarryForward;
    stats: TopazProductStats;
    profitAndLoss: TopazProfitAndLoss;
    balanceSheet: TopazBalanceSheet;
    kpis: {
        netProfit: number;
        marketShare: number;
        companyValue: number;
    };
}

// 4. GAME CONFIG (System variables)
export interface GameConfig {
    gdpGrowth: number;
    interestRate: number;
    inflationRate: number;
    materialPrice: number;
    unemploymentRate: number;
    marketGrowthFactor: number;
    news: string[]; // Global news string array
}

// ---- Default Decision ----

export function getDefaultDecision(): TeamDecision {
    return {
        companyInfo: {
            simulationCode: "Topaz",
            year: "1",
            quarter: "1",
            groupNumber: "1",
            companyNumber: "1",
            identityNumber: "0",
            status: "2"
        },
        productImprovements: [false, false, false],
        prices: {
            exportMarket: [0, 0, 0],
            homeMarkets: [15, 18, 0]
        },
        promotion: {
            tradePress: [5, 5, 0],
            advertisingSupport: [50, 30, 0],
            merchandising: [10, 10, 0]
        },
        assemblyTime: [30, 45, 0],
        dividendRate: 0,
        daysCreditAllowed: 30,
        vansToBuy: 0,
        vansToSell: 0,
        informationWanted: {
            otherCompanies: false,
            marketShares: false
        },
        deliveries: {
            exportArea: [0, 0, 0],
            southArea: [10000, 5000, 0],
            westArea: [5000, 2000, 0],
            northArea: [5000, 2000, 0]
        },
        researchExpenditure: 15,
        salesforceAllocated: {
            exportArea: 0,
            southArea: 4,
            westArea: 3,
            northArea: 3
        },
        salesforceRemuneration: {
            quarterlySalary: 80,
            commission: 5
        },
        assemblyWorkersWage: {
            pounds: 10,
            pence: 50
        },
        shiftLevel: 1,
        managementBudget: 50,
        contractMaintenanceHours: 40,
        machinesToSell: 0,
        salesforce: { recruit: 0, dismiss: 0, train: 0 },
        assemblyWorkers: { recruit: 0, dismiss: 0, train: 5 },
        rawMaterial: { unitsToOrder: 50000, supplierNo: 1, deliveries: 1 },
        newMachinesToOrder: 0
    };
}

function randBetween(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
}

export function randomizeDecision(): TeamDecision {
    const def = getDefaultDecision();
    def.prices.homeMarkets = [randBetween(12, 20), randBetween(15, 25), 0];
    def.promotion.advertisingSupport = [randBetween(20, 80), randBetween(10, 50), 0];
    def.deliveries.southArea = [randBetween(5000, 15000), randBetween(2000, 8000), 0];
    def.rawMaterial.unitsToOrder = randBetween(30000, 80000);
    def.salesforceRemuneration.commission = randBetween(2, 8);
    def.researchExpenditure = randBetween(5, 30);
    return def;
}

// ---- Previous Quarter State (carry forward) ----

export function getInitialCarryForward(): TeamCarryForward {
    return {
        inventory: {
            finishedGoods: 5000,
            componentA: 2000,
            componentB: 1000,
            rawMaterials: 15000
        },
        staffing: {
            productionWorkers: 100,
            adminStaff: 10,
            salesStaff: 12,
            productionSkillLevel: 1.0,
            salesSkillLevel: 1.0
        },
        assets: {
            plantUnits: 2,
            machines: 50,
            vehicles: 5,
            plantValue: 2000000,
            machinesValue: 500000,
            vehiclesValue: 100000
        },
        cash: 250000,
        overdraft: 0,
        fixedTermLoans: 0,
        retainedProfit: 0,
        shareCapital: 1000000, // E.g., 1 million shares at $1
        lastQuarterTaxOwed: 0,
        lastQuarterRDCumulative: 0
    };
}

// ---- MAIN SIMULATION FUNCTION ----

// Helper to map code.html form inputs to internal math variables
function mapDecision(inputDec: TeamDecision) {
    return {
        marketing: {
            area1Price: inputDec.prices.homeMarkets[0] || 15,
            area2Price: inputDec.prices.exportMarket[0] || 18,
            area1Advertising: inputDec.promotion.advertisingSupport[0] || 50,
            area2Advertising: inputDec.promotion.tradePress[0] || 30,
            salesForce: inputDec.salesforceAllocated.southArea + inputDec.salesforceAllocated.exportArea,
            commissionRate: inputDec.salesforceRemuneration.commission || 5
        },
        operations: {
            materialsOrdered: inputDec.rawMaterial.unitsToOrder || 50000,
            productionTarget: (inputDec.deliveries.southArea[0] || 0) + (inputDec.deliveries.exportArea[0] || 0),
            componentAUsage: 10000,
            componentBUsage: 5000,
            qcSpend: inputDec.researchExpenditure || 15
        },
        hr: {
            productionWorkersTrained: inputDec.assemblyWorkers.train || 0,
            productionWorkersRecruited: inputDec.assemblyWorkers.recruit || 0,
            productionWorkersDismissed: inputDec.assemblyWorkers.dismiss || 0,
            adminStaffRecruited: 0,
            adminStaffDismissed: 0,
            salesStaffRecruited: inputDec.salesforce.recruit || 0
        },
        infrastructure: {
            buyPlant: 0,
            sellPlant: 0,
            buyMachines: inputDec.newMachinesToOrder || 0,
            sellMachines: inputDec.machinesToSell || 0,
            buyVehicles: inputDec.vansToBuy || 0,
            sellVehicles: inputDec.vansToSell || 0
        },
        finance: {
            fixedTermLoanRequest: 0,
            dividendCents: inputDec.dividendRate || 0
        },
        rd: {
            rdClass1: inputDec.productImprovements[0] ? 10 : 0,
            rdClass2: inputDec.productImprovements[1] ? 10 : 0,
            rdClass3: 5,
            rdClass4: 5
        }
    };
}

export function processQuarterSimulation(
    decisions: Map<number, TeamDecision>,
    carryForwards: Map<number, TeamCarryForward>,
    teamIds: number[],
    quarter: number,
    config: GameConfig
): { results: Map<number, TeamQuarterResult>; newCarryForwards: Map<number, TeamCarryForward> } {

    const numTeams = teamIds.length;

    // 1. Calculate industry averages for competitive demand
    let totalArea1Price = 0;
    let totalArea2Price = 0;
    let totalArea1Adv = 0;
    let totalArea2Adv = 0;
    let totalPDRD = 0; // Product R&D affects quality

    for (const tid of teamIds) {
        const dec = mapDecision(decisions.get(tid)!);
        totalArea1Price += dec.marketing.area1Price;
        totalArea2Price += dec.marketing.area2Price;
        totalArea1Adv += dec.marketing.area1Advertising;
        totalArea2Adv += dec.marketing.area2Advertising;
        totalPDRD += dec.rd.rdClass2;
    }

    const avgArea1Price = totalArea1Price / numTeams;
    const avgArea2Price = totalArea2Price / numTeams;
    const avgArea1Adv = totalArea1Adv / numTeams;
    const avgArea2Adv = totalArea2Adv / numTeams;
    const avgPDRD = totalPDRD / numTeams;

    // 2. Process each team
    const results = new Map<number, TeamQuarterResult>();
    const newCarryForwards = new Map<number, TeamCarryForward>();

    for (const tid of teamIds) {
        const dec = mapDecision(decisions.get(tid)!);
        const prev = carryForwards.get(tid)!;

        // --- A. STAFFING & HR ---
        const prodWorkers = prev.staffing.productionWorkers + dec.hr.productionWorkersRecruited - dec.hr.productionWorkersDismissed;
        const adminStaff = prev.staffing.adminStaff + dec.hr.adminStaffRecruited - dec.hr.adminStaffDismissed;
        const salesStaff = prev.staffing.salesStaff + dec.hr.salesStaffRecruited; // Simplification, no dismissal for sales in this model

        // Skill level evolution (R&D Training class 4 and HR training)
        const newProdSkill = Math.min(1.5, prev.staffing.productionSkillLevel + (dec.hr.productionWorkersTrained * 0.01) + (dec.rd.rdClass4 * 0.005));
        const newSalesSkill = Math.min(1.5, prev.staffing.salesSkillLevel + (dec.rd.rdClass4 * 0.005));

        // --- B. ASSETS & INFRASTRUCTURE ---
        const plantUnits = prev.assets.plantUnits + dec.infrastructure.buyPlant - dec.infrastructure.sellPlant;
        const machines = prev.assets.machines + dec.infrastructure.buyMachines - dec.infrastructure.sellMachines;
        const vehicles = prev.assets.vehicles + dec.infrastructure.buyVehicles - dec.infrastructure.sellVehicles;

        // Asset Valuations (with Depreciation)
        // E.g., Plant $1M each, Machines $100k, Vehicles $20k
        const newPlantValue = prev.assets.plantValue + (dec.infrastructure.buyPlant * 1000000) - (dec.infrastructure.sellPlant * 800000);
        const newMachinesValue = prev.assets.machinesValue + (dec.infrastructure.buyMachines * 100000) - (dec.infrastructure.sellMachines * 50000);
        const newVehiclesValue = prev.assets.vehiclesValue + (dec.infrastructure.buyVehicles * 20000) - (dec.infrastructure.sellVehicles * 10000);

        const plantDepreciation = newPlantValue * 0.01; // 1% per quarter
        const machineDepreciation = newMachinesValue * 0.05; // 5% per quarter
        const vehicleDepreciation = newVehiclesValue * 0.10; // 10% per quarter
        const totalDepreciation = plantDepreciation + machineDepreciation + vehicleDepreciation;

        // --- C. PRODUCTION & OPERATIONS ---
        // Materials available
        const rawMatAvailable = prev.inventory.rawMaterials + dec.operations.materialsOrdered;
        const compAAvailable = prev.inventory.componentA + dec.operations.componentAUsage; // Simplified component sourcing
        const compBAvailable = prev.inventory.componentB + dec.operations.componentBUsage;

        // Capacity Constraints
        // Assume 1 machine = 500 units capacity; 1 worker = 550 units capacity
        const machineCapacity = machines * 500 * (1 + (dec.rd.rdClass1 * 0.01)); // Process R&D boosts machine efficiency
        const laborCapacity = prodWorkers * 550 * newProdSkill;

        let targetProduction = dec.operations.productionTarget;

        // Final viable production (Cannot exceed capacity or materials)
        // Assume 1 Finished Good requires 2 Raw Mat, 1 Comp A, 1 Comp B
        const matConstraint = Math.floor(rawMatAvailable / 2);
        const compAConstraint = compAAvailable;
        const compBConstraint = compBAvailable;

        let actualProduced = Math.min(
            targetProduction,
            machineCapacity,
            laborCapacity,
            matConstraint,
            compAConstraint,
            compBConstraint
        );

        // Quality and defects (QC spend + Env/Quality R&D reduces defects)
        const defectBaseRate = 0.08;
        const qcMitigation = (dec.operations.qcSpend / 100) * 0.04;
        const rdMitigation = (dec.rd.rdClass3 / 100) * 0.02;
        const finalDefectRate = Math.max(0.01, defectBaseRate - qcMitigation - rdMitigation);

        const rejectedUnits = Math.round(actualProduced * finalDefectRate);
        const goodUnits = actualProduced - rejectedUnits;

        // Update Inventories
        const closingRawMat = rawMatAvailable - (actualProduced * 2);
        const closingCompA = compAAvailable - actualProduced;
        const closingCompB = compBAvailable - actualProduced;

        // --- D. MARKETING & SALES (DEMAND) ---
        // Base demand per area
        let baseDemandArea1 = 150000 * (config.marketGrowthFactor / numTeams);
        let baseDemandArea2 = 80000 * (config.marketGrowthFactor / numTeams);

        // Price elasticity
        const priceEffect1 = Math.pow(avgArea1Price / Math.max(0.1, dec.marketing.area1Price), 1.5);
        const priceEffect2 = Math.pow(avgArea2Price / Math.max(0.1, dec.marketing.area2Price), 1.6);

        // Advertising effect
        const advEffect1 = avgArea1Adv > 0 ? Math.pow(dec.marketing.area1Advertising / avgArea1Adv, 0.4) : 1;
        const advEffect2 = avgArea2Adv > 0 ? Math.pow(dec.marketing.area2Advertising / avgArea2Adv, 0.4) : 1;

        // Quality/R&D effect
        const qualityEffect = avgPDRD > 0 ? 1 + ((dec.rd.rdClass2 - avgPDRD) / (avgPDRD * 2)) : 1;

        // Sales force effect
        const salesForceEffect = 1 + (dec.marketing.salesForce * 0.02 * newSalesSkill);

        const potentialArea1 = Math.round(baseDemandArea1 * priceEffect1 * advEffect1 * qualityEffect * salesForceEffect);
        const potentialArea2 = Math.round(baseDemandArea2 * priceEffect2 * advEffect2 * qualityEffect * salesForceEffect);
        const totalPotentialDemand = potentialArea1 + potentialArea2;

        const goodsAvailableForSale = prev.inventory.finishedGoods + goodUnits;

        // Allocate stock proportionally if demand > supply
        let actualArea1 = potentialArea1;
        let actualArea2 = potentialArea2;
        if (totalPotentialDemand > goodsAvailableForSale) {
            const ratio1 = potentialArea1 / totalPotentialDemand;
            actualArea1 = Math.floor(goodsAvailableForSale * ratio1);
            actualArea2 = goodsAvailableForSale - actualArea1;
        }

        const totalSold = actualArea1 + actualArea2;
        const closingFinishedGoods = goodsAvailableForSale - totalSold;

        // --- E. FINANCIALS (PROFIT & LOSS) ---
        // Revenue
        const revArea1 = actualArea1 * dec.marketing.area1Price;
        const revArea2 = actualArea2 * dec.marketing.area2Price;
        const totalSalesRevenue = revArea1 + revArea2;

        // Direct Costs
        // Stock valuation: Flat assumptions for simplicity (Raw Mat $2, CompA $5, CompB $5, FG $15)
        const openingStockValue = (prev.inventory.finishedGoods * 15) + (prev.inventory.componentA * 5) + (prev.inventory.componentB * 5) + (prev.inventory.rawMaterials * 2);
        const materialsPurchasedCost = (dec.operations.materialsOrdered * config.materialPrice) + (dec.operations.componentAUsage * 5) + (dec.operations.componentBUsage * 5); // Simplification

        const prodWages = prodWorkers * 5000; // $5k per worker per quarter
        const closingStockValueLocal = (closingFinishedGoods * 15) + (closingCompA * 5) + (closingCompB * 5) + (closingRawMat * 2);

        const costOfGoodsSold = openingStockValue + materialsPurchasedCost + prodWages + totalDepreciation - closingStockValueLocal;
        const grossProfit = totalSalesRevenue - costOfGoodsSold;

        // Overheads
        const advCost = (dec.marketing.area1Advertising + dec.marketing.area2Advertising) * 1000;
        const salesForceCost = salesStaff * 6000; // $6k base
        const commissionCost = totalSalesRevenue * (dec.marketing.commissionRate / 100);
        const adminSalaries = adminStaff * 7000;
        const qcCost = dec.operations.qcSpend * 1000;
        const rdCost = (dec.rd.rdClass1 + dec.rd.rdClass2 + dec.rd.rdClass3 + dec.rd.rdClass4) * 1000;

        // Interest calculation
        const shortTermInterestRate = (config.interestRate + 2) / 100 / 4; // Quarterly
        const longTermInterestRate = config.interestRate / 100 / 4;
        let interestPaid = prev.fixedTermLoans * longTermInterestRate;
        if (prev.overdraft > 0) {
            interestPaid += prev.overdraft * shortTermInterestRate;
        }

        const totalOverheads = advCost + salesForceCost + commissionCost + adminSalaries + qcCost + rdCost + interestPaid;
        const operatingProfit = grossProfit - totalOverheads;

        // Tax
        const taxableIncome = operatingProfit - prev.lastQuarterTaxOwed; // Using prior tax for simplified offsetting
        const currentTax = taxableIncome > 0 ? taxableIncome * 0.33 : 0; // 33% standard corp tax
        const netProfit = operatingProfit - currentTax;

        // Dividends
        const dividendPaid = dec.finance.dividendCents * (prev.shareCapital / 1); // Assuming $1 par value shares
        const retainedProfitForQuarter = netProfit - dividendPaid;
        const cumulativeRetainedProfit = prev.retainedProfit + retainedProfitForQuarter;

        // --- F. BALANCE SHEET ---
        // Assets
        const netPlant = newPlantValue - plantDepreciation;
        const netMachines = newMachinesValue - machineDepreciation;
        const netVehicles = newVehiclesValue - vehicleDepreciation;
        const totalFixedAssets = netPlant + netMachines + netVehicles;

        const debtors = totalSalesRevenue * 0.25; // 25% of sales on credit

        // Cash flow proxy for simplicity
        const cashIn = totalSalesRevenue * 0.75 + (prev.cash > 0 ? prev.cash : 0) + dec.finance.fixedTermLoanRequest;
        const cashOut = materialsPurchasedCost + prodWages + totalOverheads + currentTax + dividendPaid +
            (dec.infrastructure.buyPlant * 1000000) + (dec.infrastructure.buyMachines * 100000) + (dec.infrastructure.buyVehicles * 20000) +
            (prev.overdraft > 0 ? prev.overdraft : 0);

        let newCash = 0;
        let newOverdraft = 0;
        const netCashPosition = cashIn - cashOut;

        if (netCashPosition >= 0) {
            newCash = netCashPosition;
        } else {
            newOverdraft = Math.abs(netCashPosition);
        }

        const currentAssetsTotal = closingStockValueLocal + debtors + newCash;

        // Liabilities
        const creditors = materialsPurchasedCost * 0.3; // 30% of materials on credit
        const currentLiabilitiesTotal = creditors + newOverdraft + currentTax; // Taxes owed paid next quarter

        const netCurrentAssets = currentAssetsTotal - currentLiabilitiesTotal;
        const totalAssetsLessCurrent = totalFixedAssets + netCurrentAssets;

        const newLoans = prev.fixedTermLoans + dec.finance.fixedTermLoanRequest;
        const netAssets = totalAssetsLessCurrent - newLoans;

        // Equity
        const totalCapital = prev.shareCapital + cumulativeRetainedProfit;

        // --- G. RESULTS ASSEMBLY ---
        const marketSharePercent = totalPotentialDemand > 0 ? (totalSold / (150000 * config.marketGrowthFactor)) * 100 : 0;

        // Build Output Objects
        const pnlOut: TopazProfitAndLoss = {
            salesRevenue: totalSalesRevenue,
            openingStockValue,
            materialsPurchased: materialsPurchasedCost,
            productionWages: prodWages,
            depreciation: totalDepreciation,
            lessClosingStockValue: closingStockValueLocal,
            costOfGoodsSold,
            grossProfit,
            advertisingCost: advCost,
            salesForceCost,
            commissionCost,
            adminSalaries,
            qcCost,
            rdCost,
            interestPaid,
            totalOverheads,
            operatingProfit,
            tax: currentTax,
            netProfit,
            dividendPaid,
            retainedProfit: retainedProfitForQuarter
        };

        const bsOut: TopazBalanceSheet = {
            fixedAssets: {
                plant: netPlant,
                machines: netMachines,
                vehicles: netVehicles,
                totalFixed: totalFixedAssets
            },
            currentAssets: {
                stockValuation: closingStockValueLocal,
                debtors,
                cash: newCash,
                totalCurrent: currentAssetsTotal
            },
            currentLiabilities: {
                creditors,
                overdraft: newOverdraft,
                taxOwed: currentTax,
                totalCurrent: currentLiabilitiesTotal
            },
            netCurrentAssets,
            totalAssetsLessCurrentLiabilities: totalAssetsLessCurrent,
            longTermLiabilities: {
                loans: newLoans
            },
            netAssets,
            capital: {
                shareCapital: prev.shareCapital,
                reserves: cumulativeRetainedProfit,
                totalCapital
            }
        };

        const statsOut: TopazProductStats = {
            potentialSalesArea1: potentialArea1,
            actualSalesArea1: actualArea1,
            potentialSalesArea2: potentialArea2,
            actualSalesArea2: actualArea2,
            marketSharePercent,
            qualityRatingPercent: Math.min(100, 70 + (dec.rd.rdClass2 * 0.5)),
            defectsPercent: finalDefectRate * 100
        };

        const nextCf: TeamCarryForward = {
            inventory: {
                finishedGoods: closingFinishedGoods,
                componentA: closingCompA,
                componentB: closingCompB,
                rawMaterials: closingRawMat
            },
            staffing: {
                productionWorkers: prodWorkers,
                adminStaff,
                salesStaff,
                productionSkillLevel: newProdSkill,
                salesSkillLevel: newSalesSkill
            },
            assets: {
                plantUnits,
                machines,
                vehicles,
                plantValue: netPlant,
                machinesValue: netMachines,
                vehiclesValue: netVehicles
            },
            cash: newCash,
            overdraft: newOverdraft,
            fixedTermLoans: newLoans,
            retainedProfit: cumulativeRetainedProfit,
            shareCapital: prev.shareCapital,
            lastQuarterTaxOwed: currentTax,
            lastQuarterRDCumulative: prev.lastQuarterRDCumulative + rdCost
        };

        newCarryForwards.set(tid, nextCf);

        results.set(tid, {
            teamId: tid,
            quarter,
            decisions: decisions.get(tid)!,
            previousCarryForward: prev,
            carryForward: nextCf,
            stats: statsOut,
            profitAndLoss: pnlOut,
            balanceSheet: bsOut,
            kpis: {
                netProfit,
                marketShare: marketSharePercent,
                companyValue: netAssets
            }
        });
    }

    return { results, newCarryForwards };
}

'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';

// Brand Colors
const BRAND = {
  orange: '#FA4E23',
  orangeLight: '#FEE8E2',
  orangeMedium: '#FDCDC0',
  black: '#1A1A1A',
  white: '#FFFFFF'
};

// Cytronic Logo Component (Orange + White version for dark backgrounds)
const CytronicLogo = ({ height = 24 }) => (
  <svg height={height} viewBox="0 0 4658 918" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1036.79 393.987V392.028C1036.79 184.247 1174.68 39.5337 1355.3 39.5337C1512.63 39.5337 1638.89 141.484 1665.11 305.599L1569.94 308.5C1546.62 196.829 1461.17 130.783 1354.36 130.783C1225.21 130.783 1130.04 237.593 1130.04 391.048V393.948C1130.04 547.402 1225.21 655.193 1354.36 655.193C1461.17 655.193 1546.66 588.167 1569.94 476.496L1665.11 479.397C1638.89 643.512 1512.63 746.442 1355.3 746.442C1174.68 746.521 1036.79 601.807 1036.79 393.987Z" fill="white"/>
    <path d="M1844.11 906.76L1905.3 732.923H1863.55L1701.36 266.799V256.137H1785.83L1917.92 641.674H1941.24L2072.35 256.137H2157.8V266.799L1929.6 917.46H1844.15V906.799L1844.11 906.76Z" fill="white"/>
    <path d="M2554.38 256.089H2635.94V332.796H2643.7C2661.19 296.853 2701.99 248.328 2768 248.328C2795.2 248.328 2815.58 253.188 2838.9 264.829L2836.94 349.298H2828.2C2807.82 339.577 2782.58 331.816 2757.3 331.816C2689.33 331.816 2638.8 402.723 2638.8 472.61V732.875H2554.34V256.089H2554.38Z" fill="white"/>
    <path d="M2859.65 494.997V493.037C2859.65 346.403 2965.48 244.414 3095.65 244.414C3225.83 244.414 3332.6 346.364 3332.6 493.037V494.997C3332.6 642.611 3227.71 744.561 3095.65 744.561C2963.6 744.561 2859.65 642.611 2859.65 494.997ZM3246.13 494.997V493.037C3246.13 393.007 3182.04 321.16 3095.62 321.16C3009.19 321.16 2947.02 393.007 2947.02 493.037V494.997C2947.02 596.006 3009.19 667.853 3095.62 667.853C3182.04 667.853 3246.13 596.006 3246.13 494.997Z" fill="white"/>
    <path d="M3404.9 256.089H3489.37V325.035H3497.13C3527.23 280.351 3573.84 244.447 3650.58 244.447C3764.21 244.447 3837.04 338.636 3837.04 452.267V732.914H3751.59V460.028C3751.59 382.341 3707.89 323.115 3629.22 323.115C3550.55 323.115 3489.37 381.4 3489.37 459.087V732.953H3404.9V256.089Z" fill="white"/>
    <path d="M3897.47 658.136H3995.54V330.885H3897.47V256.098H4081.03V658.136H4179.1V732.923H3897.47V658.136ZM3984.88 49.2578H4085.89V148.307H3984.88V49.2578Z" fill="white"/>
    <path d="M4192.74 494.997V493.037C4192.74 346.403 4298.57 244.414 4431.64 244.414C4543.32 244.414 4637.5 312.38 4657.93 438.632L4569.54 441.533C4554.02 364.825 4499.61 321.121 4431.64 321.121C4344.24 321.121 4280.15 392.968 4280.15 492.998V494.958C4280.15 595.967 4344.24 667.814 4431.64 667.814C4499.61 667.814 4554.02 623.13 4569.54 547.402L4657.93 550.303C4637.54 676.555 4543.32 744.522 4431.64 744.522C4298.61 744.522 4192.74 642.571 4192.74 494.958V494.997Z" fill="white"/>
    <path d="M2357.17 658.136L2357.91 330.885H2492.91V256.098H2357.91L2358.89 117.225H2274.42L2273.44 256.098H2188.98V330.885H2273.44L2272.82 672.521C2272.74 705.877 2299.79 732.923 2333.14 732.923H2488.01V658.136H2357.21H2357.17Z" fill="white"/>
    <path d="M520.078 341.292H773.458V201.121L465.643 21.7519C417.409 -6.33138 357.457 -6.33138 309.173 21.7519L207.626 80.8204L63.9962 164.382C25.0373 186.907 0.871094 229.106 0.871094 274.354V577.221C0.871094 622.469 25.0373 664.668 63.9473 687.292L309.173 829.922C357.457 858.005 417.409 857.956 465.643 829.922L773.458 650.504V510.333H520.078L175.747 710.605C170.962 713.408 165.055 713.408 160.27 710.605L144.501 701.408C139.18 698.309 139.229 690.587 144.501 687.538L258.595 621.191C276.024 611.059 286.765 592.271 286.765 572.008V279.715C286.765 259.403 276.024 240.664 258.595 230.533L144.501 164.185C139.18 161.087 139.18 153.414 144.501 150.316L160.27 141.118C165.055 138.315 170.962 138.315 175.747 141.118L520.078 341.39V341.292Z" fill="#FA4E23"/>
  </svg>
);

// Utility functions
const formatCurrency = (val) => {
  if (val === null || val === undefined) return '-';
  const absVal = Math.abs(val);
  if (absVal >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (absVal >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val.toFixed(0)}`;
};

const formatNumber = (val) => {
  if (val === null || val === undefined) return '-';
  return val.toLocaleString();
};

const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

const StatusBadge = ({ status, size = 'normal' }) => {
  const styles = {
    live: 'bg-green-100 text-green-700 border-green-300',
    launching: 'bg-orange-100 text-orange-700 border-orange-300',
    planning: 'bg-gray-100 text-gray-600 border-gray-300',
    active: 'bg-green-100 text-green-700 border-green-300',
    onboarding: 'bg-orange-100 text-orange-700 border-orange-300',
    churned: 'bg-red-100 text-red-700 border-red-300',
    prospect: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    loi: 'bg-purple-100 text-purple-700 border-purple-300',
    signed: 'bg-green-100 text-green-700 border-green-300'
  };
  const labels = {
    live: 'Live', launching: 'Launching', planning: 'Planning',
    active: 'Active', onboarding: 'Onboarding', churned: 'Churned',
    prospect: 'Prospect', loi: 'LOI', signed: 'Signed'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-300'} ${size === 'small' ? 'text-[10px] px-1.5 py-0' : ''}`}>
      {labels[status] || status}
    </span>
  );
};

const ConfidenceBadge = ({ confidence }) => {
  const styles = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[confidence]}`}>
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
    </span>
  );
};

const TierBadge = ({ tier }) => {
  const styles = {
    anchor: 'bg-purple-100 text-purple-700',
    mid: 'bg-slate-100 text-slate-700',
    small: 'bg-gray-100 text-gray-600'
  };
  const labels = { anchor: 'Anchor (25K+)', mid: 'Mid (10-25K)', small: 'Small (<10K)' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[tier]}`}>
      {labels[tier]}
    </span>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = false, rightContent }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`transform transition-transform text-gray-400 text-sm ${isOpen ? 'rotate-90' : ''}`}>▶</span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {rightContent && <div className="text-right">{rightContent}</div>}
      </button>
      {isOpen && <div className="px-6 pb-6 border-t pt-4">{children}</div>}
    </div>
  );
};

// Input component (defined outside main component to prevent focus loss on re-render)
const InputField = ({ label, value, onChange, prefix = '', suffix = '', step = 1, min = 0, type = 'number', className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs text-gray-500">{label}</label>}
    <div className="flex items-center gap-1">
      {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
        onFocus={(e) => e.target.select()}
        step={step}
        min={min}
        className="w-full px-2 py-1.5 border rounded text-sm bg-white focus:ring-2 focus:ring-orange-500"
      />
      {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
    </div>
  </div>
);

// Data creation helpers
const createMonthlySnapshot = (baseConfig = {}) => ({
  labor: baseConfig.labor || { teamLeads: 1, teamLeadCost: 5291, associates: 3, associateCost: 3466 },
  opex: baseConfig.opex || {
    rent: 30000, internet: 290, trash: 250, security: 60, pio: 20000,
    energy: 550, gas: 400, hvac: 70, repairs: 200, officeCleaning: 200,
    drinksSnacks: 150, cleaningSupplies: 50, toiletries: 40, officeSupplies: 30, equipmentReplacement: 500
  },
  customOpex: baseConfig.customOpex || [],
  customers: baseConfig.customers || { anchor: 0, midTier: 0, small: 0 },
  actuals: baseConfig.actuals || { orders: 0, revenue: 0, storageUtil: 0 },
  isLocked: false
});

// Default rate card structure
const defaultRateCard = {
  orderFee: 0.50,
  pickFee: 0.10,
  storagePerCuFtWeek: 0.39,
  returnFee: 3.00
};

const createDefaultWarehouse = (name = 'New Warehouse') => ({
  id: Date.now().toString(),
  name,
  location: '',
  status: 'planning',
  goLiveDate: '',
  sqft: 25000,
  bins: 10000,
  ports: 9,
  cuFtPerBin: 2.68,
  ordersPerPortPerHour: 125,
  capex: {
    securityDeposit: 100000, firePreSurvey: 1200, pio50_1: 250000, install50_1: 110000,
    firePermitting: 30000, electricalDesign: 30000, electricalPermit: 40000, seismic: 0,
    pio50_2: 250000, install50_2: 110000, pioShipping: 60000, pioTariffs: 0,
    autobagger: 200000, conveyors: 18510, warehouseEquipment: 26122, airCompression: 12714,
    networkGear: 4000, crateRemoval: 2500, binInsertHires: 4700, furniture: 2500,
    forkliftUnload: 1750, securityInstall: 1950
  },
  customCapex: [],
  capexPaid: {},
  monthlySnapshots: {},
  rateCard: { ...defaultRateCard },
  variableCostPerOrder: 0.44 // Packaging, materials, etc.
});

const createDefaultCustomer = () => ({
  id: Date.now().toString(),
  name: '',
  tier: 'small',
  status: 'onboarding',
  warehouseId: '',
  contractedOrders: 0,
  actualOrders: 0,
  actualUnits: 0, // Total units/picks
  startDate: '',
  notes: '',
  // Customer-specific rate overrides (null = use warehouse default)
  rateOverrides: {
    orderFee: null,
    pickFee: null,
    storagePerCuFtWeek: null,
    returnFee: null
  },
  monthlyMinimum: 0, // Minimum monthly charge
  inboundPricing: '',
  specialProjects: ''
});

const createDefaultForecast = () => ({
  id: Date.now().toString(),
  name: '',
  tier: 'small',
  warehouseId: '',
  expectedOrders: 0, // Full run-rate orders/mo
  expectedStart: '',
  confidence: 'medium',
  notes: '',
  // Ramp schedule - array of { month: number, orders: number }
  // month 1 = first month, orders = volume that month
  rampSchedule: [
    { month: 1, orders: 0 },
    { month: 3, orders: 0 },
    { month: 6, orders: 0 }
  ],
  rampMonths: 6 // Months to reach full run-rate
});

// Initial data
const initialWarehouses = [
  {
    ...createDefaultWarehouse('Chicago'),
    id: 'chicago',
    location: 'Chicago, IL',
    status: 'live',
    goLiveDate: '2026-01-01',
    sqft: 21000,
    bins: 10000,
    ports: 9,
    capex: {
      securityDeposit: 76857, firePreSurvey: 0, pio50_1: 247500, install50_1: 109370,
      firePermitting: 26500, electricalDesign: 32850, electricalPermit: 80481, seismic: 0,
      pio50_2: 247500, install50_2: 109370, pioShipping: 60000, pioTariffs: 0,
      autobagger: 200000, conveyors: 18510, warehouseEquipment: 26122, airCompression: 12714,
      networkGear: 3700, crateRemoval: 2500, binInsertHires: 4700, furniture: 2500,
      forkliftUnload: 1750, securityInstall: 1950, electricalPermitAddl: 12000
    },
    capexPaid: { all: true },
    monthlySnapshots: {
      '2026-01': createMonthlySnapshot({
        labor: { teamLeads: 1, teamLeadCost: 5291, associates: 3, associateCost: 3466 },
        opex: { rent: 30510, internet: 290, trash: 250, security: 60, pio: 19253, energy: 550, gas: 418, hvac: 70, repairs: 200, officeCleaning: 200, drinksSnacks: 150, cleaningSupplies: 50, toiletries: 40, officeSupplies: 30, equipmentReplacement: 500 },
        customers: { anchor: 0, midTier: 0, small: 0 },
        actuals: { orders: 0, revenue: 0, storageUtil: 0 }
      })
    }
  },
  {
    ...createDefaultWarehouse('Dallas'),
    id: 'dallas',
    location: 'Dallas, TX',
    status: 'launching',
    goLiveDate: '2026-05-01',
    sqft: 28760,
    bins: 13000,
    ports: 13,
    capex: {
      securityDeposit: 101846, firePreSurvey: 1200, pio50_1: 300900, install50_1: 131600,
      firePermitting: 30000, electricalDesign: 30000, electricalPermit: 40000, seismic: 0,
      pio50_2: 300900, install50_2: 131600, pioShipping: 60000, pioTariffs: 120000,
      autobagger: 200000, conveyors: 18510, warehouseEquipment: 26122, airCompression: 12714,
      networkGear: 4000, crateRemoval: 2500, binInsertHires: 4700, furniture: 2500,
      forkliftUnload: 1750, securityInstall: 1950
    },
    capexPaid: { pio50_1: true },
    monthlySnapshots: {}
  }
];

const initialCustomers = [
  {
    id: 'cust1',
    name: 'First Customer (LOI)',
    tier: 'anchor',
    status: 'onboarding',
    warehouseId: 'chicago',
    contractedOrders: 25000,
    actualOrders: 0,
    startDate: '2026-02-01',
    notes: 'Ramp: 2,500 → 25,000 → 100,000 units',
    rateOverrides: { orderFee: null, pickFee: null, storagePerCuFtWeek: null, returnFee: null }
  }
];

const initialForecasts = [];

// E-commerce Seasonality Curve (monthly multipliers)
// Based on typical e-commerce patterns: Q4 peak (Oct-Dec), Q1 trough (Jan-Feb)
const ECOMM_SEASONALITY = {
  1: 0.75,   // January - post-holiday slump
  2: 0.70,   // February - lowest point
  3: 0.85,   // March - spring pickup
  4: 0.90,   // April
  5: 0.95,   // May - pre-summer
  6: 0.90,   // June
  7: 0.85,   // July - summer lull
  8: 0.90,   // August - back to school
  9: 1.00,   // September - baseline
  10: 1.15,  // October - holiday prep
  11: 1.35,  // November - Black Friday/Cyber Monday
  12: 1.50,  // December - peak season
};

// Default scenario assumptions (single unified scenario)
const defaultScenarioAssumptions = {
  // Growth assumptions - Quarterly revenue targets (replaces pipeline close rate)
  rampMonths: 18,
  quarterlyGrowth: {
    q1: 30000,  // New revenue added in Q1 ($/mo)
    q2: 75000,  // New revenue added in Q2 ($/mo)
    q3: 75000,  // New revenue added in Q3 ($/mo)
    q4: 100000, // New revenue added in Q4 ($/mo)
  },

  // Capacity planning - Dual triggers
  orderCapacityTrigger: 0.5,   // Trigger expansion at X% of order capacity
  storageCapacityTrigger: 0.7, // Trigger expansion at X% of storage capacity
  newSiteLeadTime: 5,
  autoSuggestExpansion: true, // Auto-add hypothetical sites when triggers hit

  // Revenue assumptions
  avgRevenuePerOrder: 0.60, // Order fee + pick fees (blended)
  storageRatePerCuFtWeek: 0.39, // Storage revenue rate
  avgStorageUtilization: 0.5, // Expected storage utilization for projections
  avgItemsPerOrder: 1.1,
  returnRate: 0.05,

  // Cost assumptions
  variableCostPerOrder: 0.44,
  defaultMonthlyOpex: 55000, // Used when no actuals exist
  newSiteCapex: 1500000, // Default CapEx for auto-suggested new sites

  // CapEx assumptions
  capexSpreadMonths: 6, // Months to spread pre-launch CapEx

  // Financial modeling
  paymentTermsDays: 30, // Net 30 payment terms (cash lag)
  applySeasonality: true, // Apply e-commerce seasonality curve
};

export default function WarehouseDashboard() {
  // Core state
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [customers, setCustomers] = useState(initialCustomers);
  const [forecasts, setForecasts] = useState(initialForecasts);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Modal state
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddForecast, setShowAddForecast] = useState(false);
  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [showCashDrawer, setShowCashDrawer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Import state
  const [importData, setImportData] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [importMonth, setImportMonth] = useState(getMonthKey(new Date()));

  // Edit state
  const [editingWarehouseSpecs, setEditingWarehouseSpecs] = useState(null);
  const [editingCapex, setEditingCapex] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingForecast, setEditingForecast] = useState(null);

  // New item state
  const [newWarehouse, setNewWarehouse] = useState(createDefaultWarehouse());
  const [newCustomer, setNewCustomer] = useState(createDefaultCustomer());
  const [newForecast, setNewForecast] = useState(createDefaultForecast());

  // Scenario state
  const [projectionYears, setProjectionYears] = useState(2);
  const [scenarioAssumptions, setScenarioAssumptions] = useState(defaultScenarioAssumptions);
  const [useActuals, setUseActuals] = useState(false); // Toggle between custom assumptions vs. derived from actuals
  const [includePipeline, setIncludePipeline] = useState(true);

  // Global settings
  const [globalSettings, setGlobalSettings] = useState({
    cash: { onHand: 3000000, vcFunding: 5000000 },
    rateCard: { orderFee: 0.50, pickFee: 0.10, storagePerCuFtWeek: 0.39, returnFee: 3.00 },
    assumptions: { avgItemsPerOrder: 1.1, returnRate: 0.05, variableCostPerOrder: 0.44 }
  });

  // Load/Save
  useEffect(() => {
    const saved = localStorage.getItem('warehouseDashboardV7');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.warehouses) setWarehouses(data.warehouses);
        if (data.customers) setCustomers(data.customers);
        if (data.forecasts) setForecasts(data.forecasts);
        if (data.globalSettings) setGlobalSettings(data.globalSettings);
        if (data.projectionYears) setProjectionYears(data.projectionYears);
        if (data.scenarioAssumptions) setScenarioAssumptions(data.scenarioAssumptions);
        if (data.useActuals !== undefined) setUseActuals(data.useActuals);
        if (data.includePipeline !== undefined) setIncludePipeline(data.includePipeline);
      } catch (e) { console.error('Failed to load saved data'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('warehouseDashboardV7', JSON.stringify({
      warehouses, customers, forecasts, globalSettings, projectionYears, scenarioAssumptions, useActuals, includePipeline
    }));
  }, [warehouses, customers, forecasts, globalSettings, projectionYears, scenarioAssumptions, useActuals, includePipeline]);

  // Calculations
  const calculateMonthlyPnL = (wh, snapshot) => {
    const laborCost = (snapshot.labor.teamLeads * snapshot.labor.teamLeadCost) + (snapshot.labor.associates * snapshot.labor.associateCost);
    const standardOpex = Object.values(snapshot.opex).reduce((sum, v) => sum + (v || 0), 0);
    const customOpexTotal = (snapshot.customOpex || []).reduce((sum, item) => sum + (item.amount || 0), 0);
    const fixedOpex = standardOpex + customOpexTotal + laborCost;

    const totalStorage = wh.bins * wh.cuFtPerBin;
    const storageRevenue = totalStorage * (snapshot.actuals.storageUtil || 0) * globalSettings.rateCard.storagePerCuFtWeek * 4.33;
    const revenuePerOrder = globalSettings.rateCard.orderFee + (globalSettings.rateCard.pickFee * globalSettings.assumptions.avgItemsPerOrder) + (globalSettings.rateCard.returnFee * globalSettings.assumptions.returnRate);
    const orderRevenue = (snapshot.actuals.orders || 0) * revenuePerOrder;
    const totalRevenue = snapshot.actuals.revenue || (orderRevenue + storageRevenue);
    const variableCosts = (snapshot.actuals.orders || 0) * globalSettings.assumptions.variableCostPerOrder;
    const totalCosts = fixedOpex + variableCosts;
    const netMargin = totalRevenue - totalCosts;

    return { laborCost, standardOpex, customOpexTotal, fixedOpex, storageRevenue, orderRevenue, totalRevenue, variableCosts, totalCosts, netMargin, orders: snapshot.actuals.orders || 0 };
  };

  const calculations = useMemo(() => {
    const warehouseCalcs = {};
    let totalCapexSpent = 0;

    warehouses.forEach(wh => {
      const standardCapex = Object.values(wh.capex).reduce((sum, v) => sum + (v || 0), 0);
      const customCapexTotal = (wh.customCapex || []).reduce((sum, item) => sum + (item.amount || 0), 0);
      const totalCapex = standardCapex + customCapexTotal;

      let capexPaid = 0;
      if (wh.capexPaid.all) {
        capexPaid = totalCapex;
      } else {
        Object.keys(wh.capexPaid).filter(k => k !== 'all' && wh.capexPaid[k]).forEach(k => {
          if (k.startsWith('custom_')) {
            const customItem = (wh.customCapex || []).find(item => item.id === parseInt(k.replace('custom_', '')));
            if (customItem) capexPaid += customItem.amount || 0;
          } else {
            capexPaid += wh.capex[k] || 0;
          }
        });
      }

      if (wh.status === 'live' || wh.status === 'launching') totalCapexSpent += capexPaid;

      const monthKeys = Object.keys(wh.monthlySnapshots).sort();
      const latestMonth = monthKeys[monthKeys.length - 1];
      const latestSnapshot = latestMonth ? wh.monthlySnapshots[latestMonth] : null;
      const latestPnL = latestSnapshot ? calculateMonthlyPnL(wh, latestSnapshot) : null;

      const maxOrdersPerMonth = wh.ports * wh.ordersPerPortPerHour * 8 * 22;

      let cumulativeProfit = 0;
      monthKeys.forEach(mk => {
        const snapshot = wh.monthlySnapshots[mk];
        if (snapshot) cumulativeProfit += calculateMonthlyPnL(wh, snapshot).netMargin;
      });

      const capexRecouped = Math.max(0, cumulativeProfit);
      const capexRecoupmentProgress = totalCapex > 0 ? Math.min(100, (capexRecouped / totalCapex) * 100) : 0;

      // Break-even calculation
      const baseMonthlyOpex = latestPnL ? latestPnL.fixedOpex : 55000;
      const revenuePerOrder = globalSettings.rateCard.orderFee + (globalSettings.rateCard.pickFee * globalSettings.assumptions.avgItemsPerOrder) + (globalSettings.rateCard.returnFee * globalSettings.assumptions.returnRate);
      const contributionMargin = revenuePerOrder - globalSettings.assumptions.variableCostPerOrder;
      const breakEvenOrders = Math.ceil(baseMonthlyOpex / contributionMargin);
      const breakEvenUtilization = (breakEvenOrders / maxOrdersPerMonth) * 100;

      // Current orders from active customers
      const warehouseCustomers = customers.filter(c => c.warehouseId === wh.id && c.status === 'active');
      const customerOrders = warehouseCustomers.reduce((sum, c) => sum + (c.actualOrders || 0), 0);

      warehouseCalcs[wh.id] = {
        totalCapex, capexPaid, capexRemaining: totalCapex - capexPaid,
        capexPaidProgress: totalCapex > 0 ? (capexPaid / totalCapex) * 100 : 0,
        capexRecouped, capexRecoupmentProgress, cumulativeProfit,
        maxOrdersPerMonth, latestMonth, latestSnapshot, latestPnL, monthKeys,
        breakEvenOrders, breakEvenUtilization, contributionMargin,
        customerOrders, currentUtilization: (customerOrders / maxOrdersPerMonth) * 100
      };
    });

    const totalCash = globalSettings.cash.onHand + globalSettings.cash.vcFunding;
    // Cash on hand is already net of past CapEx (live sites)
    // Only subtract CapEx paid on non-live sites (launching/planning)
    const futureCapexPaid = warehouses
      .filter(wh => wh.status !== 'live')
      .reduce((sum, wh) => sum + (warehouseCalcs[wh.id]?.capexPaid || 0), 0);
    const availableCash = totalCash - futureCapexPaid;

    let totalMonthlyOpex = 0;
    let totalMonthlyRevenue = 0;
    warehouses.filter(wh => wh.status === 'live').forEach(wh => {
      const calc = warehouseCalcs[wh.id];
      if (calc.latestPnL) {
        totalMonthlyOpex += calc.latestPnL.totalCosts;
        totalMonthlyRevenue += calc.latestPnL.totalRevenue;
      }
    });

    const monthlyBurn = totalMonthlyOpex - totalMonthlyRevenue;
    const runway = monthlyBurn > 0 ? Math.floor(availableCash / monthlyBurn) : 999;

    return { warehouses: warehouseCalcs, portfolio: { totalCash, totalCapexSpent, availableCash, futureCapexPaid, totalMonthlyOpex, totalMonthlyRevenue, monthlyBurn, runway } };
  }, [warehouses, customers, globalSettings]);

  // Forecast calculations
  const forecastCalcs = useMemo(() => {
    const confidenceWeights = { high: 1, medium: 0.5, low: 0.25 };

    const totalExpectedOrders = forecasts.reduce((sum, f) => sum + (f.expectedOrders || 0), 0);
    const weightedOrders = forecasts.reduce((sum, f) => sum + ((f.expectedOrders || 0) * confidenceWeights[f.confidence]), 0);

    const byWarehouse = {};
    warehouses.forEach(wh => {
      const whForecasts = forecasts.filter(f => f.warehouseId === wh.id);
      byWarehouse[wh.id] = {
        total: whForecasts.reduce((sum, f) => sum + (f.expectedOrders || 0), 0),
        weighted: whForecasts.reduce((sum, f) => sum + ((f.expectedOrders || 0) * confidenceWeights[f.confidence]), 0),
        count: whForecasts.length
      };
    });

    // Build 12-month timeline projection from pipeline
    const today = new Date();
    const timeline = [];
    for (let m = 0; m < 12; m++) {
      const projDate = new Date(today);
      projDate.setMonth(projDate.getMonth() + m);
      const monthKey = getMonthKey(projDate);
      const monthLabel = projDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      let monthOrders = 0;
      let monthWeighted = 0;

      forecasts.forEach(f => {
        if (!f.expectedStart) return;
        const startDate = new Date(f.expectedStart);
        const monthsFromStart = Math.floor((projDate - startDate) / (1000 * 60 * 60 * 24 * 30));

        if (monthsFromStart < 0) return; // Not started yet

        // Calculate ramped orders based on ramp schedule
        const rampMonths = f.rampMonths || 6;
        let orders = 0;

        if (monthsFromStart >= rampMonths) {
          orders = f.expectedOrders; // Full run-rate
        } else if (f.rampSchedule && f.rampSchedule.length > 0) {
          // Interpolate from ramp schedule
          const schedule = f.rampSchedule.sort((a, b) => a.month - b.month);
          for (let i = 0; i < schedule.length; i++) {
            if (monthsFromStart + 1 <= schedule[i].month) {
              const prevOrders = i > 0 ? schedule[i - 1].orders : 0;
              const prevMonth = i > 0 ? schedule[i - 1].month : 0;
              const progress = (monthsFromStart + 1 - prevMonth) / (schedule[i].month - prevMonth);
              orders = prevOrders + (schedule[i].orders - prevOrders) * progress;
              break;
            }
          }
          if (orders === 0 && monthsFromStart + 1 > schedule[schedule.length - 1].month) {
            // Past last schedule point, interpolate to full
            const lastSchedule = schedule[schedule.length - 1];
            const progress = (monthsFromStart + 1 - lastSchedule.month) / (rampMonths - lastSchedule.month);
            orders = lastSchedule.orders + (f.expectedOrders - lastSchedule.orders) * Math.min(1, progress);
          }
        } else {
          // Simple linear ramp
          orders = f.expectedOrders * Math.min(1, (monthsFromStart + 1) / rampMonths);
        }

        monthOrders += orders;
        monthWeighted += orders * confidenceWeights[f.confidence];
      });

      timeline.push({
        month: m + 1,
        monthKey,
        label: monthLabel,
        orders: Math.round(monthOrders),
        weighted: Math.round(monthWeighted)
      });
    }

    return { totalExpectedOrders, weightedOrders, byWarehouse, timeline };
  }, [forecasts, warehouses]);

  // Compute actuals-based assumptions from real data
  const actualsBasedAssumptions = useMemo(() => {
    // Calculate averages from actual warehouse data
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalCosts = 0;
    let monthCount = 0;

    warehouses.forEach(wh => {
      Object.values(wh.monthlySnapshots || {}).forEach(snapshot => {
        if (snapshot.actuals?.orders > 0) {
          totalOrders += snapshot.actuals.orders;
          totalRevenue += snapshot.actuals.revenue || 0;
          monthCount++;
        }
        // Sum up OpEx
        const laborCost = (snapshot.labor?.teamLeads || 0) * (snapshot.labor?.teamLeadCost || 0) +
                         (snapshot.labor?.associates || 0) * (snapshot.labor?.associateCost || 0);
        const opexTotal = Object.values(snapshot.opex || {}).reduce((sum, v) => sum + (v || 0), 0);
        totalCosts += laborCost + opexTotal;
      });
    });

    const avgRevenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0.60;
    const avgMonthlyOpex = monthCount > 0 ? totalCosts / monthCount : 55000;

    // Get actual variable cost from warehouse rate cards
    const avgVariableCost = warehouses.length > 0
      ? warehouses.reduce((sum, wh) => sum + (wh.variableCostPerOrder || 0.44), 0) / warehouses.length
      : 0.44;

    // Calculate average storage utilization from actuals
    let totalStorageUtil = 0;
    let storageMonthCount = 0;
    warehouses.forEach(wh => {
      Object.values(wh.monthlySnapshots || {}).forEach(snapshot => {
        if (snapshot.actuals?.storageUtil > 0) {
          totalStorageUtil += snapshot.actuals.storageUtil;
          storageMonthCount++;
        }
      });
    });
    const avgStorageUtil = storageMonthCount > 0 ? totalStorageUtil / storageMonthCount : 0.5;

    // Estimate quarterly growth based on historical trends
    // For actuals mode, we estimate based on recent revenue growth
    const estimatedQuarterlyGrowth = Math.round((totalRevenue / Math.max(monthCount, 1)) * 0.1); // 10% monthly growth as baseline

    return {
      ...defaultScenarioAssumptions,
      avgRevenuePerOrder: Math.round(avgRevenuePerOrder * 100) / 100,
      defaultMonthlyOpex: Math.round(avgMonthlyOpex),
      variableCostPerOrder: avgVariableCost,
      avgStorageUtilization: Math.round(avgStorageUtil * 100) / 100,
      // Keep growth assumptions editable - reasonable defaults based on actuals
      rampMonths: 12, // Based on typical ramp patterns
      quarterlyGrowth: {
        q1: Math.round(estimatedQuarterlyGrowth * 0.5),   // Q1 slower (post-holiday)
        q2: estimatedQuarterlyGrowth,                     // Q2 normal
        q3: estimatedQuarterlyGrowth,                     // Q3 normal
        q4: Math.round(estimatedQuarterlyGrowth * 1.5),   // Q4 peak
      },
      orderCapacityTrigger: 0.7,
      storageCapacityTrigger: 0.7,
      newSiteLeadTime: 5,
      // Default financial settings
      paymentTermsDays: 30,
      applySeasonality: true,
      autoSuggestExpansion: true,
    };
  }, [warehouses]);

  // Get effective assumptions (either custom or actuals-based)
  const effectiveAssumptions = useMemo(() => {
    return useActuals ? actualsBasedAssumptions : scenarioAssumptions;
  }, [useActuals, actualsBasedAssumptions, scenarioAssumptions]);

  // Main projections calculation with seasonality, payment lag, storage revenue, and auto-expansion
  const projections = useMemo(() => {
    const assumptions = effectiveAssumptions;
    const totalMonths = projectionYears * 12;
    const data = [];

    let runningCash = globalSettings.cash.onHand + globalSettings.cash.vcFunding;
    const today = new Date();

    // Track auto-suggested expansion sites
    const autoExpansionSites = [];
    let nextSiteNumber = warehouses.length + 1;

    // Payment lag buffer (for Net 30 cash delay)
    const paymentLagMonths = Math.ceil((assumptions.paymentTermsDays || 30) / 30);
    const revenueBuffer = []; // Store revenue that will be received later

    // Get quarterly growth target for a given month
    const getQuarterlyGrowth = (monthIndex) => {
      const projDate = new Date(today);
      projDate.setMonth(projDate.getMonth() + monthIndex);
      const quarter = Math.floor(projDate.getMonth() / 3) + 1;
      const qKey = `q${quarter}`;
      return assumptions.quarterlyGrowth?.[qKey] || 70000; // Default $70K/mo
    };

    // Calculate cumulative new revenue added by month (from quarterly targets)
    const getCumulativeNewRevenue = (monthIndex) => {
      let cumulative = 0;
      for (let m = 0; m <= monthIndex; m++) {
        // Add new revenue at the start of each quarter
        const projDate = new Date(today);
        projDate.setMonth(projDate.getMonth() + m);
        const isQuarterStart = projDate.getMonth() % 3 === 0;
        if (isQuarterStart || m === 0) {
          cumulative += getQuarterlyGrowth(m);
        }
      }
      return cumulative;
    };

    // Calculate storage capacity for a warehouse
    const getStorageCapacity = (wh) => {
      return wh.bins * (wh.cuFtPerBin || 2.68);
    };

    // First pass: calculate demand and check capacity triggers
    const uncappedDemand = [];
    for (let m = 0; m < totalMonths; m++) {
      const projDate = new Date(today);
      projDate.setMonth(projDate.getMonth() + m);
      const calendarMonth = projDate.getMonth() + 1;
      const seasonalMultiplier = assumptions.applySeasonality ? (ECOMM_SEASONALITY[calendarMonth] || 1) : 1;

      let baseDemand = 0;
      let totalOrderCapacity = 0;
      let totalStorageCapacity = 0;
      let totalStorageUsed = 0;

      warehouses.forEach(wh => {
        const calc = calculations.warehouses[wh.id];
        const goLive = new Date(wh.goLiveDate);
        const monthsLive = Math.floor((projDate - goLive) / (1000 * 60 * 60 * 24 * 30));
        if (monthsLive < 0) return;

        totalOrderCapacity += calc.maxOrdersPerMonth;
        totalStorageCapacity += getStorageCapacity(wh);

        const whCustomers = customers.filter(c => c.warehouseId === wh.id && c.status === 'active');
        const existingOrders = whCustomers.reduce((sum, c) => sum + (c.actualOrders || c.contractedOrders || 0), 0);
        const rampProgress = Math.min(1, monthsLive / assumptions.rampMonths);
        const sCurve = (x) => x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2;
        const utilization = sCurve(rampProgress);
        baseDemand += existingOrders > 0 ? existingOrders * utilization : calc.maxOrdersPerMonth * utilization * 0.5;

        // Estimate storage usage based on utilization
        totalStorageUsed += getStorageCapacity(wh) * (assumptions.avgStorageUtilization || 0.5) * utilization;
      });

      // Add growth from quarterly revenue targets (convert revenue to approximate orders)
      const newRevenue = getCumulativeNewRevenue(m);
      const additionalOrders = newRevenue / (assumptions.avgRevenuePerOrder || 0.60);

      uncappedDemand.push({
        month: m,
        demand: Math.round((baseDemand + additionalOrders) * seasonalMultiplier),
        orderCapacity: totalOrderCapacity,
        storageCapacity: totalStorageCapacity,
        storageUsed: totalStorageUsed
      });
    }

    // Calculate capacity including auto-expansion sites
    const getCapacityAtMonth = (monthIndex, type = 'orders') => {
      let capacity = 0;
      const projDate = new Date(today);
      projDate.setMonth(projDate.getMonth() + monthIndex);

      warehouses.forEach(wh => {
        const calc = calculations.warehouses[wh.id];
        const goLive = new Date(wh.goLiveDate);
        if (projDate >= goLive) {
          capacity += type === 'orders' ? calc.maxOrdersPerMonth : getStorageCapacity(wh);
        }
      });

      autoExpansionSites.forEach(site => {
        if (monthIndex >= site.goLiveMonth) {
          capacity += type === 'orders' ? site.orderCapacity : site.storageCapacity;
        }
      });

      return capacity;
    };

    // Check for expansion triggers (DUAL: order OR storage) and auto-suggest sites
    if (assumptions.autoSuggestExpansion) {
      for (let m = 0; m < totalMonths; m++) {
        const currentOrderCapacity = getCapacityAtMonth(m, 'orders');
        const currentStorageCapacity = getCapacityAtMonth(m, 'storage');

        const orderTrigger = currentOrderCapacity * (assumptions.orderCapacityTrigger || 0.5);
        const storageTrigger = currentStorageCapacity * (assumptions.storageCapacityTrigger || 0.7);

        const orderTriggered = uncappedDemand[m].demand >= orderTrigger && currentOrderCapacity > 0;
        const storageTriggered = uncappedDemand[m].storageUsed >= storageTrigger && currentStorageCapacity > 0;

        if (orderTriggered || storageTriggered) {
          const hasPlannedExpansion = autoExpansionSites.some(site =>
            site.goLiveMonth > m && site.goLiveMonth <= m + assumptions.newSiteLeadTime
          );

          if (!hasPlannedExpansion) {
            const goLiveMonth = m + assumptions.newSiteLeadTime;
            if (goLiveMonth < totalMonths) {
              // Use average of existing warehouses for new site
              const avgOrderCapacity = warehouses.length > 0
                ? warehouses.reduce((sum, wh) => sum + calculations.warehouses[wh.id].maxOrdersPerMonth, 0) / warehouses.length
                : 200000;
              const avgStorageCapacity = warehouses.length > 0
                ? warehouses.reduce((sum, wh) => sum + getStorageCapacity(wh), 0) / warehouses.length
                : 25000;

              autoExpansionSites.push({
                id: `auto-site-${nextSiteNumber}`,
                name: `Site #${nextSiteNumber}`,
                triggerMonth: m,
                triggerReason: orderTriggered && storageTriggered ? 'both' : orderTriggered ? 'orders' : 'storage',
                goLiveMonth,
                orderCapacity: avgOrderCapacity,
                storageCapacity: avgStorageCapacity,
                capex: assumptions.newSiteCapex || 1500000
              });
              nextSiteNumber++;
            }
          }
        }
      }
    }

    // Main projection loop
    for (let m = 0; m < totalMonths; m++) {
      const projDate = new Date(today);
      projDate.setMonth(projDate.getMonth() + m);
      const monthKey = getMonthKey(projDate);
      const calendarMonth = projDate.getMonth() + 1;

      // Apply seasonality multiplier
      const seasonalMultiplier = assumptions.applySeasonality ? (ECOMM_SEASONALITY[calendarMonth] || 1) : 1;

      let monthDemand = 0;
      let monthOrders = 0;
      let monthOrderRevenue = 0;
      let monthStorageRevenue = 0;
      let monthCosts = 0;
      let monthCapex = 0;
      let totalOrderCapacity = 0;
      let totalStorageCapacity = 0;
      let totalStorageUsed = 0;

      // Per-warehouse capacity tracking for stacked chart
      const warehouseCapacities = {};

      // Existing warehouses
      warehouses.forEach(wh => {
        const calc = calculations.warehouses[wh.id];
        const goLive = new Date(wh.goLiveDate);
        const monthsLive = Math.floor((projDate - goLive) / (1000 * 60 * 60 * 24 * 30));

        if (monthsLive < 0) {
          const monthsUntil = Math.abs(monthsLive);
          const capexSpread = assumptions.capexSpreadMonths || 6;
          if (monthsUntil <= capexSpread) {
            monthCapex += calc.totalCapex / capexSpread;
          }
          warehouseCapacities[wh.id] = { name: wh.name, orders: 0, storage: 0, isAuto: false };
          return;
        }

        const whOrderCapacity = calc.maxOrdersPerMonth;
        const whStorageCapacity = getStorageCapacity(wh);
        totalOrderCapacity += whOrderCapacity;
        totalStorageCapacity += whStorageCapacity;

        // Base orders from existing customers
        const whCustomers = customers.filter(c => c.warehouseId === wh.id && c.status === 'active');
        const existingOrders = whCustomers.reduce((sum, c) => sum + (c.actualOrders || c.contractedOrders || 0), 0);

        // Ramp using S-curve
        const rampProgress = Math.min(1, monthsLive / assumptions.rampMonths);
        const sCurve = (x) => x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2;
        const utilization = sCurve(rampProgress);

        // Base demand + quarterly growth
        const newRevenue = getCumulativeNewRevenue(m);
        const growthOrders = (newRevenue / (assumptions.avgRevenuePerOrder || 0.60)) / Math.max(1, warehouses.filter(w => new Date(w.goLiveDate) <= projDate).length);
        const baseOrders = existingOrders > 0 ? existingOrders * utilization : whOrderCapacity * utilization * 0.5;
        const rawDemand = (baseOrders + growthOrders) * seasonalMultiplier;
        monthDemand += rawDemand;

        // Cap at warehouse capacity
        const orders = Math.min(whOrderCapacity, Math.round(rawDemand));
        monthOrders += orders;

        // Order Revenue
        monthOrderRevenue += orders * (assumptions.avgRevenuePerOrder || 0.60);

        // Storage Revenue (independent of orders)
        const storageUtil = (assumptions.avgStorageUtilization || 0.5) * utilization;
        const storageUsed = whStorageCapacity * storageUtil;
        totalStorageUsed += storageUsed;
        const weeksPerMonth = 4.33;
        monthStorageRevenue += storageUsed * (assumptions.storageRatePerCuFtWeek || 0.39) * weeksPerMonth;

        // Costs
        const baseOpex = calc.latestPnL ? calc.latestPnL.fixedOpex : assumptions.defaultMonthlyOpex;
        monthCosts += baseOpex + (orders * (assumptions.variableCostPerOrder || 0.44));

        // Track for stacked chart
        warehouseCapacities[wh.id] = { name: wh.name, orders: whOrderCapacity, storage: whStorageCapacity, isAuto: false };
      });

      // Auto-expansion sites
      autoExpansionSites.forEach(site => {
        if (m >= site.goLiveMonth) {
          totalOrderCapacity += site.orderCapacity;
          totalStorageCapacity += site.storageCapacity;

          const rampMonths = assumptions.rampMonths;
          const monthsLive = m - site.goLiveMonth;
          const rampProgress = Math.min(1, monthsLive / rampMonths);
          const sCurve = (x) => x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) / 2;
          const utilization = sCurve(rampProgress);

          const siteOrders = Math.round(site.orderCapacity * utilization * 0.5 * seasonalMultiplier);
          monthOrders += siteOrders;
          monthDemand += siteOrders;
          monthOrderRevenue += siteOrders * (assumptions.avgRevenuePerOrder || 0.60);

          // Storage revenue for auto site
          const siteStorageUsed = site.storageCapacity * (assumptions.avgStorageUtilization || 0.5) * utilization;
          totalStorageUsed += siteStorageUsed;
          monthStorageRevenue += siteStorageUsed * (assumptions.storageRatePerCuFtWeek || 0.39) * 4.33;

          monthCosts += assumptions.defaultMonthlyOpex + (siteOrders * (assumptions.variableCostPerOrder || 0.44));

          warehouseCapacities[site.id] = { name: site.name, orders: site.orderCapacity, storage: site.storageCapacity, isAuto: true };
        } else if (m >= site.goLiveMonth - assumptions.capexSpreadMonths && m < site.goLiveMonth) {
          monthCapex += site.capex / assumptions.capexSpreadMonths;
          warehouseCapacities[site.id] = { name: site.name, orders: 0, storage: 0, isAuto: true };
        }
      });

      const monthRevenue = monthOrderRevenue + monthStorageRevenue;

      // Payment lag
      revenueBuffer.push(monthRevenue);
      const cashReceived = m >= paymentLagMonths ? revenueBuffer[m - paymentLagMonths] : 0;
      const netCashFlow = cashReceived - monthCosts - monthCapex;
      runningCash += netCashFlow;

      data.push({
        month: monthKey,
        label: getMonthLabel(monthKey),
        orders: monthOrders,
        demand: Math.round(monthDemand),
        orderCapacity: totalOrderCapacity,
        storageCapacity: totalStorageCapacity,
        storageUsed: Math.round(totalStorageUsed),
        orderRevenue: monthOrderRevenue,
        storageRevenue: monthStorageRevenue,
        revenue: monthRevenue,
        cashReceived,
        costs: monthCosts,
        capex: monthCapex,
        profit: monthRevenue - monthCosts,
        cashFlow: netCashFlow,
        cashPosition: runningCash,
        seasonalMultiplier,
        warehouseCapacities, // For stacked chart
        autoExpansionSites: autoExpansionSites.filter(s => s.goLiveMonth === m).map(s => s.name)
      });
    }

    // Attach auto-expansion sites to result for display
    data.autoExpansionSites = autoExpansionSites;

    return data;
  }, [warehouses, customers, calculations, globalSettings, effectiveAssumptions, projectionYears]);

  // Expansion trigger analysis (dual: orders + storage)
  const expansionAnalysis = useMemo(() => {
    const assumptions = effectiveAssumptions;
    const analysis = [];

    // Helper to get storage capacity
    const getStorageCapacity = (wh) => wh.bins * (wh.cuFtPerBin || 2.68);

    warehouses.forEach(wh => {
      const calc = calculations.warehouses[wh.id];
      const storageCapacity = getStorageCapacity(wh);

      const orderTrigger = calc.maxOrdersPerMonth * (assumptions.orderCapacityTrigger || 0.5);
      const storageTrigger = storageCapacity * (assumptions.storageCapacityTrigger || 0.7);

      // Find month when we hit EITHER trigger
      let orderTriggerMonth = null;
      let storageTriggerMonth = null;

      for (let i = 0; i < projections.length; i++) {
        if (orderTriggerMonth === null && projections[i].orders >= orderTrigger) {
          orderTriggerMonth = i;
        }
        if (storageTriggerMonth === null && projections[i].storageUsed >= storageTrigger) {
          storageTriggerMonth = i;
        }
        if (orderTriggerMonth !== null && storageTriggerMonth !== null) break;
      }

      // Use whichever trigger comes first
      const triggerMonth = Math.min(
        orderTriggerMonth ?? Infinity,
        storageTriggerMonth ?? Infinity
      );
      const actualTriggerMonth = triggerMonth === Infinity ? null : triggerMonth;
      const triggerReason = actualTriggerMonth === orderTriggerMonth && actualTriggerMonth === storageTriggerMonth
        ? 'both'
        : actualTriggerMonth === orderTriggerMonth ? 'orders' : 'storage';

      const leadTimeMonths = assumptions.newSiteLeadTime || 5;
      const planningStartMonth = actualTriggerMonth !== null ? Math.max(0, actualTriggerMonth - leadTimeMonths) : null;

      analysis.push({
        warehouse: wh,
        calc,
        storageCapacity,
        orderTrigger,
        storageTrigger,
        orderTriggerMonth,
        storageTriggerMonth,
        triggerMonth: actualTriggerMonth,
        triggerReason,
        planningStartMonth,
        leadTimeMonths,
        currentOrderUtil: (calc.latestPnL?.orders || 0) / calc.maxOrdersPerMonth,
        currentStorageUtil: (calc.latestSnapshot?.actuals?.storageUtil || 0)
      });
    });

    return analysis;
  }, [warehouses, calculations, projections, effectiveAssumptions]);

  // Handlers
  const handleUpdateWarehouse = (id, updates) => {
    setWarehouses(warehouses.map(wh => wh.id === id ? { ...wh, ...updates } : wh));
  };

  const handleDeleteWarehouse = (id) => {
    if (confirm('Delete this warehouse?')) {
      setWarehouses(warehouses.filter(wh => wh.id !== id));
      if (selectedView === id) setSelectedView('overview');
    }
  };

  const handleAddWarehouse = () => {
    setWarehouses([...warehouses, { ...newWarehouse, id: Date.now().toString() }]);
    setNewWarehouse(createDefaultWarehouse());
    setShowAddWarehouse(false);
  };

  const handleAddMonth = (warehouseId, monthKey) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;
    const monthKeys = Object.keys(wh.monthlySnapshots).sort();
    const prevSnapshot = monthKeys.length > 0 ? wh.monthlySnapshots[monthKeys[monthKeys.length - 1]] : null;
    const newSnapshot = createMonthlySnapshot(prevSnapshot ? { ...prevSnapshot, actuals: { orders: 0, revenue: 0, storageUtil: prevSnapshot.actuals?.storageUtil || 0 } } : {});
    handleUpdateWarehouse(warehouseId, { monthlySnapshots: { ...wh.monthlySnapshots, [monthKey]: newSnapshot } });
    setSelectedMonth(monthKey);
    setShowAddMonthModal(false);
  };

  const handleUpdateMonthSnapshot = (warehouseId, monthKey, updates) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;
    const current = wh.monthlySnapshots[monthKey] || createMonthlySnapshot();
    const updated = {
      ...current, ...updates,
      labor: updates.labor ? { ...current.labor, ...updates.labor } : current.labor,
      opex: updates.opex ? { ...current.opex, ...updates.opex } : current.opex,
      actuals: updates.actuals ? { ...current.actuals, ...updates.actuals } : current.actuals
    };
    handleUpdateWarehouse(warehouseId, { monthlySnapshots: { ...wh.monthlySnapshots, [monthKey]: updated } });
  };

  const handleAddCustomer = () => {
    setCustomers([...customers, { ...newCustomer, id: Date.now().toString() }]);
    setNewCustomer(createDefaultCustomer());
    setShowAddCustomer(false);
  };

  const handleUpdateCustomer = (id, updates) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCustomer = (id) => {
    if (confirm('Delete this customer?')) setCustomers(customers.filter(c => c.id !== id));
  };

  const handleAddForecast = () => {
    setForecasts([...forecasts, { ...newForecast, id: Date.now().toString() }]);
    setNewForecast(createDefaultForecast());
    setShowAddForecast(false);
  };

  const handleUpdateForecast = (id, updates) => {
    setForecasts(forecasts.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteForecast = (id) => {
    if (confirm('Delete this forecast?')) setForecasts(forecasts.filter(f => f.id !== id));
  };

  const handleConvertToCustomer = (forecastId) => {
    const forecast = forecasts.find(f => f.id === forecastId);
    if (!forecast) return;
    const customer = {
      id: Date.now().toString(),
      name: forecast.name,
      tier: forecast.tier,
      status: 'onboarding',
      warehouseId: forecast.warehouseId,
      contractedOrders: forecast.expectedOrders,
      actualOrders: 0,
      startDate: forecast.expectedStart,
      notes: forecast.notes,
      rateOverrides: { orderFee: null, pickFee: null, storagePerCuFtWeek: null, returnFee: null }
    };
    setCustomers([...customers, customer]);
    setForecasts(forecasts.filter(f => f.id !== forecastId));
  };

  // Get effective rate for a customer (customer override > warehouse default > global default)
  const getEffectiveRate = (customerId, rateKey) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return defaultRateCard[rateKey];

    // Check customer override first
    if (customer.rateOverrides && customer.rateOverrides[rateKey] !== null && customer.rateOverrides[rateKey] !== undefined) {
      return customer.rateOverrides[rateKey];
    }

    // Fall back to warehouse default
    const warehouse = warehouses.find(w => w.id === customer.warehouseId);
    if (warehouse && warehouse.rateCard && warehouse.rateCard[rateKey] !== undefined) {
      return warehouse.rateCard[rateKey];
    }

    // Fall back to global default
    return defaultRateCard[rateKey];
  };

  // Get all effective rates for a customer
  const getEffectiveRates = (customerId) => ({
    orderFee: getEffectiveRate(customerId, 'orderFee'),
    pickFee: getEffectiveRate(customerId, 'pickFee'),
    storagePerCuFtWeek: getEffectiveRate(customerId, 'storagePerCuFtWeek'),
    returnFee: getEffectiveRate(customerId, 'returnFee')
  });

  const getNextMonth = (wh) => {
    const monthKeys = Object.keys(wh.monthlySnapshots).sort();
    if (monthKeys.length === 0) return getMonthKey(new Date());
    const [year, month] = monthKeys[monthKeys.length - 1].split('-').map(Number);
    return getMonthKey(new Date(year, month, 1));
  };

  // ============== IMPORT FUNCTIONS ==============

  const parseImportCSV = (csvText) => {
    const lines = csvText.trim().split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length < 2) return { error: 'Need at least a header row and one data row' };

    const header = lines[0].toLowerCase().split(',').map(h => h.trim());

    // Find column indices
    const warehouseIdx = header.findIndex(h => h.includes('warehouse') || h.includes('site') || h.includes('location'));
    const customerIdx = header.findIndex(h => h.includes('customer') || h.includes('client') || h.includes('brand') || h.includes('name'));
    const ordersIdx = header.findIndex(h => h.includes('order'));
    const unitsIdx = header.findIndex(h => h.includes('unit') || h.includes('pick') || h.includes('item'));
    const revenueIdx = header.findIndex(h => h.includes('revenue') || h.includes('amount') || h.includes('total'));

    if (customerIdx === -1) return { error: 'Could not find Customer column' };
    if (ordersIdx === -1) return { error: 'Could not find Orders column' };

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());

      const warehouseName = warehouseIdx >= 0 ? values[warehouseIdx] : null;
      const customerName = values[customerIdx];
      const orders = parseInt(values[ordersIdx]?.replace(/[^0-9.-]/g, '')) || 0;
      const units = unitsIdx >= 0 ? parseInt(values[unitsIdx]?.replace(/[^0-9.-]/g, '')) || 0 : null;
      const revenue = revenueIdx >= 0 ? parseFloat(values[revenueIdx]?.replace(/[^0-9.-]/g, '')) || 0 : null;

      if (!customerName) continue;

      // Match warehouse
      let matchedWarehouse = null;
      let warehouseMatch = 'none';
      if (warehouseName) {
        matchedWarehouse = warehouses.find(w =>
          w.name.toLowerCase() === warehouseName.toLowerCase() ||
          w.location.toLowerCase().includes(warehouseName.toLowerCase()) ||
          warehouseName.toLowerCase().includes(w.name.toLowerCase())
        );
        warehouseMatch = matchedWarehouse ? 'exact' : 'not_found';
      }

      // Match customer
      let matchedCustomer = null;
      let customerMatch = 'not_found';
      const existingCustomer = customers.find(c =>
        c.name.toLowerCase() === customerName.toLowerCase() ||
        c.name.toLowerCase().includes(customerName.toLowerCase()) ||
        customerName.toLowerCase().includes(c.name.toLowerCase())
      );

      if (existingCustomer) {
        matchedCustomer = existingCustomer;
        customerMatch = existingCustomer.name.toLowerCase() === customerName.toLowerCase() ? 'exact' : 'fuzzy';
      }

      rows.push({
        raw: { warehouseName, customerName, orders, units, revenue },
        warehouseMatch,
        matchedWarehouse,
        customerMatch,
        matchedCustomer,
        createNew: !matchedCustomer
      });
    }

    return { rows, hasWarehouseColumn: warehouseIdx >= 0, hasUnitsColumn: unitsIdx >= 0, hasRevenueColumn: revenueIdx >= 0 };
  };

  const handleImportPreview = () => {
    const result = parseImportCSV(importData);
    if (result.error) {
      alert(result.error);
      return;
    }
    setImportPreview(result);
  };

  const handleImportConfirm = () => {
    if (!importPreview || !importPreview.rows) return;

    const updatedCustomers = [...customers];
    const updatedWarehouses = [...warehouses];
    let totalOrders = 0;
    let totalRevenue = 0;

    // Group by warehouse for monthly snapshot updates
    const warehouseOrders = {};
    const warehouseRevenue = {};

    importPreview.rows.forEach(row => {
      if (row.createNew && row.raw.customerName) {
        // Create new customer
        const warehouseId = row.matchedWarehouse?.id || warehouses[0]?.id || '';
        const newCust = {
          ...createDefaultCustomer(),
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: row.raw.customerName,
          warehouseId,
          actualOrders: row.raw.orders,
          actualUnits: row.raw.units || Math.round(row.raw.orders * 1.1), // Default to 1.1x orders if no units
          status: 'active'
        };
        updatedCustomers.push(newCust);

        if (warehouseId) {
          warehouseOrders[warehouseId] = (warehouseOrders[warehouseId] || 0) + row.raw.orders;
          if (row.raw.revenue) warehouseRevenue[warehouseId] = (warehouseRevenue[warehouseId] || 0) + row.raw.revenue;
        }
      } else if (row.matchedCustomer) {
        // Update existing customer
        const custIdx = updatedCustomers.findIndex(c => c.id === row.matchedCustomer.id);
        if (custIdx >= 0) {
          updatedCustomers[custIdx] = {
            ...updatedCustomers[custIdx],
            actualOrders: row.raw.orders,
            actualUnits: row.raw.units || Math.round(row.raw.orders * 1.1),
            status: 'active'
          };

          const whId = updatedCustomers[custIdx].warehouseId;
          if (whId) {
            warehouseOrders[whId] = (warehouseOrders[whId] || 0) + row.raw.orders;
            if (row.raw.revenue) warehouseRevenue[whId] = (warehouseRevenue[whId] || 0) + row.raw.revenue;
          }
        }
      }

      totalOrders += row.raw.orders;
      if (row.raw.revenue) totalRevenue += row.raw.revenue;
    });

    // Update warehouse monthly snapshots
    Object.keys(warehouseOrders).forEach(whId => {
      const whIdx = updatedWarehouses.findIndex(w => w.id === whId);
      if (whIdx >= 0) {
        const wh = updatedWarehouses[whIdx];
        const existingSnapshot = wh.monthlySnapshots[importMonth] || createMonthlySnapshot();
        updatedWarehouses[whIdx] = {
          ...wh,
          monthlySnapshots: {
            ...wh.monthlySnapshots,
            [importMonth]: {
              ...existingSnapshot,
              actuals: {
                ...existingSnapshot.actuals,
                orders: warehouseOrders[whId],
                revenue: warehouseRevenue[whId] || existingSnapshot.actuals?.revenue || 0
              }
            }
          }
        };
      }
    });

    setCustomers(updatedCustomers);
    setWarehouses(updatedWarehouses);
    setShowImportModal(false);
    setImportData('');
    setImportPreview(null);

    alert(`Import complete!\n\nUpdated ${importPreview.rows.filter(r => r.matchedCustomer).length} customers\nCreated ${importPreview.rows.filter(r => r.createNew).length} new customers\nTotal orders: ${formatNumber(totalOrders)}\nMonth: ${getMonthLabel(importMonth)}`);
  };

  const selectedWarehouse = warehouses.find(wh => wh.id === selectedView);

  // ============== RENDER FUNCTIONS ==============

  const renderOverview = () => {
    const totalActiveCustomers = customers.filter(c => c.status === 'active').length;
    const totalOrders = customers.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.actualOrders || 0), 0);

    return (
      <div className="space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.portfolio.totalMonthlyRevenue)}</div>
            <div className="text-xs text-gray-400 mt-1">Monthly across all sites</div>
          </div>
          <div
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all"
            onClick={() => setShowCashDrawer(true)}
          >
            <div className="text-sm text-gray-500 flex items-center gap-1">
              Available Cash
              <span className="text-orange-500 text-xs">✎</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(calculations.portfolio.availableCash)}</div>
            <div className="text-xs text-gray-400 mt-1">Click to edit</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Monthly Burn</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(Math.max(0, calculations.portfolio.monthlyBurn))}</div>
            <div className="text-xs text-gray-400 mt-1">Net of revenue</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Runway</div>
            <div className={`text-2xl font-bold ${calculations.portfolio.runway > 18 ? 'text-green-600' : calculations.portfolio.runway > 12 ? 'text-yellow-600' : 'text-red-600'}`}>
              {calculations.portfolio.runway > 100 ? '100+' : calculations.portfolio.runway} mo
            </div>
            <div className="text-xs text-gray-400 mt-1">At current burn</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">CapEx Deployed</div>
            <div className="text-2xl font-bold">{formatCurrency(calculations.portfolio.totalCapexSpent)}</div>
            <div className="text-xs text-gray-400 mt-1">Across all sites</div>
          </div>
        </div>

        {/* Warehouses */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Warehouses</h2>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 text-white rounded-lg text-sm hover:bg-orange-700 flex items-center gap-2" style={{ backgroundColor: BRAND.orange }}
            >
              <span>↑</span> Import Actuals
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Site</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Net P&L</th>
                  <th className="pb-3 font-medium text-right">Orders/Mo</th>
                  <th className="pb-3 font-medium text-right">Break-Even</th>
                  <th className="pb-3 font-medium text-right">Utilization</th>
                  <th className="pb-3 font-medium text-right">Max Capacity</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map(wh => {
                  const calc = calculations.warehouses[wh.id];
                  const daysUntil = getDaysUntil(wh.goLiveDate);
                  return (
                    <tr key={wh.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedView(wh.id)}>
                      <td className="py-3">
                        <div className="font-medium">{wh.name}</div>
                        <div className="text-xs text-gray-500">{wh.location}</div>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={wh.status} />
                        {wh.status === 'launching' && daysUntil && (
                          <span className="text-xs text-gray-500 ml-2">{daysUntil}d</span>
                        )}
                      </td>
                      <td className={`py-3 text-right font-medium ${(calc.latestPnL?.netMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calc.latestPnL ? formatCurrency(calc.latestPnL.netMargin) : '-'}
                      </td>
                      <td className="py-3 text-right">{formatNumber(calc.latestPnL?.orders || 0)}</td>
                      <td className="py-3 text-right">
                        <span className="text-gray-600">{formatNumber(calc.breakEvenOrders)}</span>
                        <span className="text-xs text-gray-400 ml-1">({calc.breakEvenUtilization.toFixed(0)}%)</span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${calc.currentUtilization > 70 ? 'bg-red-500' : calc.currentUtilization > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, calc.currentUtilization)}%` }}
                            />
                          </div>
                          <span className="text-xs w-8">{calc.currentUtilization.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{formatNumber(calc.maxOrdersPerMonth)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Active Customers</div>
            <div className="text-3xl font-bold">{totalActiveCustomers}</div>
            <div className="text-xs text-gray-400 mt-1">{customers.filter(c => c.status === 'onboarding').length} onboarding</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Total Orders/Mo</div>
            <div className="text-3xl font-bold">{formatNumber(totalOrders)}</div>
            <div className="text-xs text-gray-400 mt-1">From active customers</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Pipeline</div>
            <div className="text-3xl font-bold">{formatNumber(forecastCalcs.weightedOrders)}</div>
            <div className="text-xs text-gray-400 mt-1">Weighted orders/mo ({forecasts.length} deals)</div>
          </div>
        </div>

        {/* Cash Position Slide-out Drawer */}
        {showCashDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowCashDrawer(false)} />
            <div className="relative bg-white w-96 h-full shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Cash Position</h2>
                <button onClick={() => setShowCashDrawer(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600">Available Cash</div>
                  <div className="text-3xl font-bold text-orange-600">{formatCurrency(calculations.portfolio.availableCash)}</div>
                  <div className="text-xs text-gray-500 mt-1">= Cash on Hand + VC Funding</div>
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Cash on Hand (Current)"
                    prefix="$"
                    value={globalSettings.cash.onHand}
                    onChange={(v) => setGlobalSettings({...globalSettings, cash: {...globalSettings.cash, onHand: v}})}
                    step={100000}
                  />
                  <InputField
                    label="VC Funding (Expected/Committed)"
                    prefix="$"
                    value={globalSettings.cash.vcFunding}
                    onChange={(v) => setGlobalSettings({...globalSettings, cash: {...globalSettings.cash, vcFunding: v}})}
                    step={100000}
                  />
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cash on Hand</span>
                    <span className="font-medium">{formatCurrency(globalSettings.cash.onHand)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">+ VC Funding</span>
                    <span className="font-medium">{formatCurrency(globalSettings.cash.vcFunding)}</span>
                  </div>
                  {calculations.portfolio.futureCapexPaid > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">− CapEx (New Sites)</span>
                      <span className="font-medium text-orange-600">-{formatCurrency(calculations.portfolio.futureCapexPaid)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-700 font-medium">Available</span>
                    <span className="font-bold text-orange-600">{formatCurrency(calculations.portfolio.availableCash)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-500 mb-1">Note</div>
                  Cash on Hand reflects your current balance (already net of past spend like Chicago). New CapEx payments (Dallas, future sites) will reduce Available Cash as you mark them paid.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button onClick={() => setShowAddCustomer(true)} className="px-4 py-2 text-white rounded-lg text-sm hover:bg-orange-700" style={{ backgroundColor: BRAND.orange }}>
          + Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-gray-500">No customers yet</p>
          <button onClick={() => setShowAddCustomer(true)} className="mt-4 text-orange-600 hover:text-orange-700">Add your first customer</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Tier</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Warehouse</th>
                <th className="text-right p-4 font-medium">Contracted</th>
                <th className="text-right p-4 font-medium">Actual</th>
                <th className="text-left p-4 font-medium">Start</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => {
                const wh = warehouses.find(w => w.id === c.warehouseId);
                return (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{c.name || 'Unnamed'}</div>
                      {c.notes && <div className="text-xs text-gray-500 truncate max-w-xs">{c.notes}</div>}
                    </td>
                    <td className="p-4"><TierBadge tier={c.tier} /></td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-gray-600">{wh?.name || 'Unassigned'}</td>
                    <td className="p-4 text-right">{formatNumber(c.contractedOrders)}</td>
                    <td className="p-4 text-right font-medium">{formatNumber(c.actualOrders)}</td>
                    <td className="p-4 text-gray-600">{c.startDate || '-'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setEditingCustomer(c)} className="text-orange-600 hover:text-orange-700 mr-3">Edit</button>
                      <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-600 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Summary */}
      <div className="grid grid-cols-3 gap-4">
        {['anchor', 'mid', 'small'].map(tier => {
          const tierCustomers = customers.filter(c => c.tier === tier);
          const totalOrders = tierCustomers.reduce((sum, c) => sum + (c.actualOrders || 0), 0);
          return (
            <div key={tier} className="bg-white rounded-xl p-4 shadow-sm">
              <TierBadge tier={tier} />
              <div className="mt-2 text-2xl font-bold">{tierCustomers.length}</div>
              <div className="text-xs text-gray-500">{formatNumber(totalOrders)} orders/mo</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Forecast</h1>
        <button onClick={() => setShowAddForecast(true)} className="px-4 py-2 text-white rounded-lg text-sm hover:bg-orange-700" style={{ backgroundColor: BRAND.orange }}>
          + Add Deal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Pipeline Deals</div>
          <div className="text-2xl font-bold">{forecasts.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Expected</div>
          <div className="text-2xl font-bold">{formatNumber(forecastCalcs.totalExpectedOrders)}</div>
          <div className="text-xs text-gray-400">orders/mo</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Weighted Pipeline</div>
          <div className="text-2xl font-bold text-orange-600">{formatNumber(forecastCalcs.weightedOrders)}</div>
          <div className="text-xs text-gray-400">orders/mo (confidence-adjusted)</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Est. Monthly Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(forecastCalcs.weightedOrders * (globalSettings.rateCard.orderFee + globalSettings.rateCard.pickFee * globalSettings.assumptions.avgItemsPerOrder))}
          </div>
        </div>
      </div>

      {/* 12-Month Timeline Chart */}
      {forecasts.length > 0 && forecastCalcs.timeline && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Pipeline Volume Timeline (12 months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastCalcs.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="orders" name="Total Orders" fill="#FDCDC0" opacity={0.6} />
                <Bar dataKey="weighted" name="Weighted (confidence-adjusted)" fill="#FA4E23" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Shows projected order volume from pipeline deals, accounting for ramp schedules and confidence weighting.
          </p>
        </div>
      )}

      {forecasts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-500">No deals in pipeline</p>
          <button onClick={() => setShowAddForecast(true)} className="mt-4 text-orange-600 hover:text-orange-700">Add your first deal</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium">Deal</th>
                <th className="text-left p-4 font-medium">Tier</th>
                <th className="text-left p-4 font-medium">Warehouse</th>
                <th className="text-right p-4 font-medium">Run-Rate</th>
                <th className="text-left p-4 font-medium">Ramp</th>
                <th className="text-left p-4 font-medium">Start</th>
                <th className="text-left p-4 font-medium">Confidence</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map(f => {
                const wh = warehouses.find(w => w.id === f.warehouseId);
                const startMonth1 = f.rampSchedule?.[0]?.orders || Math.round(f.expectedOrders * 0.1);
                return (
                  <tr key={f.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{f.name || 'Unnamed Deal'}</div>
                      {f.notes && <div className="text-xs text-gray-500">{f.notes}</div>}
                    </td>
                    <td className="p-4"><TierBadge tier={f.tier} /></td>
                    <td className="p-4 text-gray-600">{wh?.name || 'TBD'}</td>
                    <td className="p-4 text-right font-medium">{formatNumber(f.expectedOrders)}</td>
                    <td className="p-4">
                      <div className="text-xs text-gray-600">
                        {formatNumber(startMonth1)} → {formatNumber(f.expectedOrders)}
                      </div>
                      <div className="text-xs text-gray-400">{f.rampMonths || 6} mo</div>
                    </td>
                    <td className="p-4 text-gray-600">{f.expectedStart || 'TBD'}</td>
                    <td className="p-4"><ConfidenceBadge confidence={f.confidence} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleConvertToCustomer(f.id)} className="text-green-600 hover:text-green-700 mr-3">Convert</button>
                      <button onClick={() => setEditingForecast(f)} className="text-orange-600 hover:text-orange-700 mr-3">Edit</button>
                      <button onClick={() => handleDeleteForecast(f.id)} className="text-red-600 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* By Warehouse */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Pipeline by Warehouse</h3>
        <div className="grid grid-cols-2 gap-4">
          {warehouses.map(wh => {
            const fc = forecastCalcs.byWarehouse[wh.id];
            const calc = calculations.warehouses[wh.id];
            const currentOrders = calc.customerOrders || 0;
            const pipelineOrders = fc?.weighted || 0;
            const projectedTotal = currentOrders + pipelineOrders;
            const projectedUtilization = (projectedTotal / calc.maxOrdersPerMonth) * 100;
            const capacityRemaining = calc.maxOrdersPerMonth - projectedTotal;

            return (
              <div key={wh.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{wh.name}</span>
                  <StatusBadge status={wh.status} size="small" />
                </div>
                <div className="text-2xl font-bold">{formatNumber(pipelineOrders)}</div>
                <div className="text-xs text-gray-500">weighted orders/mo from {fc?.count || 0} deals</div>

                {/* Capacity Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Projected utilization</span>
                    <span className={projectedUtilization > 80 ? 'text-red-600 font-medium' : ''}>{projectedUtilization.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-300" style={{ width: `${Math.min(100, (currentOrders / calc.maxOrdersPerMonth) * 100)}%` }} />
                    <div
                      className="h-full -mt-2" style={{ backgroundColor: BRAND.orange }}
                      style={{
                        width: `${Math.min(100, projectedUtilization)}%`,
                        opacity: 0.5
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">Current: {formatNumber(currentOrders)}</span>
                    <span className={capacityRemaining < 0 ? 'text-red-600' : 'text-gray-400'}>
                      {capacityRemaining >= 0 ? `${formatNumber(capacityRemaining)} remaining` : `${formatNumber(Math.abs(capacityRemaining))} over capacity`}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs border-t pt-2">
                  <span className="text-gray-500">Max:</span> {formatNumber(calc.maxOrdersPerMonth)} |
                  <span className="text-gray-500 ml-2">Break-even:</span> {formatNumber(calc.breakEvenOrders)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Link to Scenarios */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">See how this impacts your projections</h3>
            <p className="text-sm text-gray-600 mt-1">Pipeline deals feed into scenario planning to forecast cash flow and site expansion timing.</p>
          </div>
          <button
            onClick={() => setSelectedView('scenarios')}
            className="px-4 py-2 text-white rounded-lg text-sm hover:bg-orange-700" style={{ backgroundColor: BRAND.orange }}
          >
            View Scenarios →
          </button>
        </div>
      </div>
    </div>
  );

  const renderScenarios = () => {
    const assumptions = effectiveAssumptions;
    const autoExpansionSites = projections.autoExpansionSites || [];

    // Helper to update custom assumptions
    const updateAssumption = (key, value) => {
      if (!useActuals) {
        setScenarioAssumptions({ ...scenarioAssumptions, [key]: value });
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Scenario Planning</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(y => (
                <button
                  key={y}
                  onClick={() => setProjectionYears(y)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${projectionYears === y ? 'text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  style={projectionYears === y ? { backgroundColor: BRAND.orange } : {}}
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Assumptions Card - AT TOP */}
        <CollapsibleSection
          title="Model Assumptions"
          defaultOpen={false}
          rightContent={
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 rounded ${useActuals ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                {useActuals ? 'Based on Actuals' : 'Custom'}
              </span>
              {assumptions.applySeasonality && <span className="text-gray-500">📈 Seasonality ON</span>}
              <span className="text-gray-500">Net {assumptions.paymentTermsDays}</span>
            </div>
          }
        >
          {/* Mode Toggle Header */}
          <div className="flex border-b -mx-6 px-6 -mt-4 mb-4">
            <button
              onClick={() => setUseActuals(false)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${!useActuals ? 'bg-orange-50 border-b-2 border-orange-500 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Custom Assumptions
            </button>
            <button
              onClick={() => setUseActuals(true)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${useActuals ? 'bg-orange-50 border-b-2 border-orange-500 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Based on Actuals
            </button>
          </div>

          {useActuals && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              📊 Values below are calculated from your actual warehouse data. Switch to "Custom Assumptions" to edit.
            </div>
          )}

          <div className="grid grid-cols-5 gap-6">
            {/* Quarterly Growth Targets - Stacked Vertically */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Quarterly Growth</h3>
              <p className="text-xs text-gray-400 -mt-1">New revenue added per quarter</p>
              {[
                { label: 'Q1', key: 'q1', default: 30000 },
                { label: 'Q2', key: 'q2', default: 75000 },
                { label: 'Q3', key: 'q3', default: 75000 },
                { label: 'Q4', key: 'q4', default: 100000 },
              ].map(q => (
                <div key={q.key} className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 w-6">{q.label}</label>
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="5000"
                    value={assumptions.quarterlyGrowth?.[q.key] || q.default}
                    onChange={(e) => updateAssumption('quarterlyGrowth', { ...assumptions.quarterlyGrowth, [q.key]: parseInt(e.target.value) || 0 })}
                    disabled={useActuals}
                    className={`flex-1 px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t mt-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">Ramp</label>
                <input
                  type="number"
                  value={assumptions.rampMonths}
                  onChange={(e) => updateAssumption('rampMonths', parseInt(e.target.value) || 18)}
                  disabled={useActuals}
                  className={`flex-1 px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                />
                <span className="text-gray-400 text-xs">mo</span>
              </div>
            </div>

            {/* Capacity Planning - Dual Triggers */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Capacity Triggers</h3>
              <p className="text-xs text-gray-400 -mt-1">Expand when either hits</p>
              <div>
                <label className="text-xs text-gray-500 block mb-1">📦 Order Trigger</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={Math.round((assumptions.orderCapacityTrigger || 0.5) * 100)}
                    onChange={(e) => updateAssumption('orderCapacityTrigger', (parseFloat(e.target.value) || 50) / 100)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                  <span className="text-gray-400 text-xs">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">🗄️ Storage Trigger</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={Math.round((assumptions.storageCapacityTrigger || 0.7) * 100)}
                    onChange={(e) => updateAssumption('storageCapacityTrigger', (parseFloat(e.target.value) || 70) / 100)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                  <span className="text-gray-400 text-xs">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Site Lead Time</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={assumptions.newSiteLeadTime}
                    onChange={(e) => updateAssumption('newSiteLeadTime', parseInt(e.target.value) || 5)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                  <span className="text-gray-400 text-xs">mo</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <input
                    type="checkbox"
                    checked={assumptions.autoSuggestExpansion}
                    onChange={(e) => updateAssumption('autoSuggestExpansion', e.target.checked)}
                    disabled={useActuals}
                    className="rounded"
                  />
                  Auto-suggest sites
                </label>
              </div>
            </div>

            {/* Revenue Assumptions - Order Revenue */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Order Revenue</h3>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Avg Rev/Order</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={assumptions.avgRevenuePerOrder}
                    onChange={(e) => updateAssumption('avgRevenuePerOrder', parseFloat(e.target.value) || 0.60)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Items/Order</label>
                <input
                  type="number"
                  step="0.1"
                  value={assumptions.avgItemsPerOrder}
                  onChange={(e) => updateAssumption('avgItemsPerOrder', parseFloat(e.target.value) || 1.1)}
                  disabled={useActuals}
                  className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                />
              </div>
            </div>

            {/* Storage Revenue */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Storage Revenue</h3>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Rate/cu ft/week</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={assumptions.storageRatePerCuFtWeek || 0.39}
                    onChange={(e) => updateAssumption('storageRatePerCuFtWeek', parseFloat(e.target.value) || 0.39)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Avg Utilization</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={Math.round((assumptions.avgStorageUtilization || 0.5) * 100)}
                    onChange={(e) => updateAssumption('avgStorageUtilization', (parseFloat(e.target.value) || 50) / 100)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                  <span className="text-gray-400 text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Cost Assumptions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Costs</h3>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Variable/Order</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={assumptions.variableCostPerOrder}
                    onChange={(e) => updateAssumption('variableCostPerOrder', parseFloat(e.target.value) || 0.44)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Monthly OpEx</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="1000"
                    value={assumptions.defaultMonthlyOpex}
                    onChange={(e) => updateAssumption('defaultMonthlyOpex', parseInt(e.target.value) || 55000)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">New Site CapEx</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    step="100000"
                    value={assumptions.newSiteCapex}
                    onChange={(e) => updateAssumption('newSiteCapex', parseInt(e.target.value) || 1500000)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 text-sm">Financial</h3>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Payment Terms</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">Net</span>
                  <input
                    type="number"
                    value={assumptions.paymentTermsDays}
                    onChange={(e) => updateAssumption('paymentTermsDays', parseInt(e.target.value) || 30)}
                    disabled={useActuals}
                    className={`w-full px-2 py-1.5 border rounded text-sm ${useActuals ? 'bg-gray-50 text-gray-500' : ''}`}
                  />
                  <span className="text-gray-400 text-xs">days</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <input
                    type="checkbox"
                    checked={assumptions.applySeasonality}
                    onChange={(e) => updateAssumption('applySeasonality', e.target.checked)}
                    disabled={useActuals}
                    className="rounded"
                  />
                  E-comm seasonality
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={includePipeline}
                    onChange={(e) => setIncludePipeline(e.target.checked)}
                    className="rounded"
                  />
                  Include pipeline
                </label>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            {includePipeline && forecasts.length > 0 && (
              <button onClick={() => setSelectedView('forecast')} className="text-orange-600 text-sm hover:text-orange-700 font-medium">
                Edit Pipeline ({forecasts.length} deals) →
              </button>
            )}
            {!useActuals && (
              <button
                onClick={() => setScenarioAssumptions(defaultScenarioAssumptions)}
                className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
              >
                Reset to defaults
              </button>
            )}
          </div>
        </CollapsibleSection>

        {/* HERO: Supply/Demand Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Supply vs Demand Timeline</h3>
              <p className="text-sm text-gray-500">
                {assumptions.applySeasonality ? 'Seasonality applied' : 'No seasonality'} •
                Net {assumptions.paymentTermsDays} payment terms •
                {assumptions.orderCapacityTrigger * 100}% order / {assumptions.storageCapacityTrigger * 100}% storage triggers
              </p>
            </div>
          </div>

          {/* Clean 2-Line Chart: Capacity vs Demand with Rich Tooltip */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections.map((p, monthIndex) => {
                // Calculate site counts and breakdown at this point in time
                const today = new Date();
                const projectionDate = new Date(today);
                projectionDate.setMonth(projectionDate.getMonth() + monthIndex);

                const liveSites = [];
                const launchingSites = [];
                const plannedSites = [];

                // Existing warehouses
                warehouses.forEach(wh => {
                  const whData = p.warehouseCapacities?.[wh.id];
                  const capacity = whData?.orders || 0;
                  const goLiveDate = new Date(wh.goLiveDate);
                  const siteInfo = { name: wh.name, capacity, id: wh.id };

                  if (projectionDate >= goLiveDate) {
                    liveSites.push(siteInfo);
                  } else {
                    launchingSites.push(siteInfo);
                  }
                });

                // Auto-suggested sites
                autoExpansionSites.forEach(site => {
                  const siteData = p.warehouseCapacities?.[site.id];
                  const capacity = siteData?.orders || 0;
                  const siteInfo = { name: site.name, capacity, id: site.id, goLiveMonth: site.goLiveMonth };

                  if (monthIndex >= site.goLiveMonth) {
                    liveSites.push(siteInfo);
                  } else if (monthIndex >= site.triggerMonth) {
                    launchingSites.push(siteInfo);
                  } else if (capacity > 0) {
                    plannedSites.push(siteInfo);
                  }
                });

                return {
                  ...p,
                  liveSites,
                  launchingSites,
                  plannedSites,
                  liveCount: liveSites.length,
                  launchingCount: launchingSites.length,
                  plannedCount: plannedSites.length,
                  totalSites: liveSites.length + launchingSites.length + plannedSites.length,
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={Math.max(1, Math.floor(projections.length / 8))} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0]?.payload;
                    if (!data) return null;

                    const utilization = data.orderCapacity > 0 ? (data.demand / data.orderCapacity * 100) : 0;
                    const isOverCapacity = data.demand > data.orderCapacity;

                    return (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs max-w-xs">
                        <div className="font-semibold text-gray-900 mb-2 pb-2 border-b">{label}</div>

                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                          <div className="text-gray-500">Capacity:</div>
                          <div className="font-medium text-right text-green-700">{formatNumber(data.orderCapacity)}/mo</div>
                          <div className="text-gray-500">Demand:</div>
                          <div className="font-medium text-right" style={{ color: BRAND.orange }}>{formatNumber(data.demand)}/mo</div>
                          <div className="text-gray-500">Utilization:</div>
                          <div className={`font-medium text-right ${isOverCapacity ? 'text-red-600' : utilization > 80 ? 'text-amber-600' : 'text-green-600'}`}>
                            {utilization.toFixed(0)}%{isOverCapacity ? ' ⚠️' : ''}
                          </div>
                        </div>

                        {/* Site Counts */}
                        <div className="border-t pt-2 mb-2">
                          <div className="font-medium text-gray-700 mb-1">{data.totalSites} Sites</div>
                          <div className="flex gap-3 text-[10px]">
                            {data.liveCount > 0 && (
                              <span className="text-green-700">🟢 {data.liveCount} Live</span>
                            )}
                            {data.launchingCount > 0 && (
                              <span className="text-orange-600">🟠 {data.launchingCount} Launching</span>
                            )}
                            {data.plannedCount > 0 && (
                              <span className="text-purple-600">🟣 {data.plannedCount} Planned</span>
                            )}
                          </div>
                        </div>

                        {/* Site Details */}
                        <div className="border-t pt-2 space-y-1 text-[10px]">
                          {data.liveSites?.map(s => (
                            <div key={s.id} className="flex justify-between text-green-700">
                              <span>🟢 {s.name}</span>
                              <span>{formatNumber(s.capacity)}</span>
                            </div>
                          ))}
                          {data.launchingSites?.map(s => (
                            <div key={s.id} className="flex justify-between text-orange-600">
                              <span>🟠 {s.name}</span>
                              <span>{s.goLiveMonth ? `Go-live Mo ${s.goLiveMonth + 1}` : 'Launching'}</span>
                            </div>
                          ))}
                          {data.plannedSites?.slice(0, 3).map(s => (
                            <div key={s.id} className="flex justify-between text-purple-600">
                              <span>🟣 {s.name}</span>
                              <span>Mo {s.goLiveMonth + 1}</span>
                            </div>
                          ))}
                          {data.plannedSites?.length > 3 && (
                            <div className="text-gray-400">+{data.plannedSites.length - 3} more planned...</div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />

                {/* Capacity area - green fill */}
                <Area
                  type="stepAfter"
                  dataKey="orderCapacity"
                  name="Capacity"
                  fill="#d1fae5"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={0.5}
                />

                {/* Demand line - orange */}
                <Line
                  type="monotone"
                  dataKey="demand"
                  name="Demand"
                  stroke={BRAND.orange}
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Clean summary row */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#d1fae5', border: '2px solid #10b981' }}></div>
                <span className="text-gray-600">Capacity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded" style={{ backgroundColor: BRAND.orange }}></div>
                <span className="text-gray-600">Demand</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Hover for site breakdown</span>
            </div>
            <div className="text-gray-500">
              End: <span className="font-medium text-gray-900">{formatNumber(projections[projections.length - 1]?.orderCapacity || 0)}</span> capacity
              / <span className="font-medium" style={{ color: BRAND.orange }}>{formatNumber(projections[projections.length - 1]?.demand || 0)}</span> demand
            </div>
          </div>

          {/* Auto-Expansion Summary - Compact Table */}
          {autoExpansionSites.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-purple-700 font-medium">Planned Expansion</span>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                    {autoExpansionSites.length} sites • {formatCurrency(autoExpansionSites.reduce((sum, s) => sum + s.capex, 0))} total CapEx
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-purple-200">
                      <th className="pb-2 font-medium">Site</th>
                      <th className="pb-2 font-medium">Trigger</th>
                      <th className="pb-2 font-medium">Go-Live</th>
                      <th className="pb-2 font-medium text-right">Capacity</th>
                      <th className="pb-2 font-medium text-right">CapEx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autoExpansionSites.map((site, idx) => (
                      <tr key={site.id} className="border-b border-purple-100 last:border-0">
                        <td className="py-2 font-medium text-purple-800">{site.name}</td>
                        <td className="py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            site.triggerReason === 'orders' ? 'bg-blue-100 text-blue-700' :
                            site.triggerReason === 'storage' ? 'bg-amber-100 text-amber-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {site.triggerReason === 'orders' ? 'Orders' : site.triggerReason === 'storage' ? 'Storage' : 'Both'}
                          </span>
                          <span className="text-gray-400 ml-1">Mo {site.triggerMonth + 1}</span>
                        </td>
                        <td className="py-2 text-gray-600">Mo {site.goLiveMonth + 1}</td>
                        <td className="py-2 text-right text-gray-600">{formatNumber(site.orderCapacity)}/mo</td>
                        <td className="py-2 text-right text-gray-600">{formatCurrency(site.capex)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Seasonality Preview (if enabled) */}
        {assumptions.applySeasonality && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-blue-800">📈 E-Commerce Seasonality Applied</div>
              <div className="text-xs text-blue-600">Based on typical e-comm patterns (Q4 peak, Q1 trough)</div>
            </div>
            <div className="flex gap-1">
              {Object.entries(ECOMM_SEASONALITY).map(([month, multiplier]) => {
                const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                const height = multiplier * 30;
                const isPeak = multiplier >= 1.15;
                const isTrough = multiplier <= 0.75;
                return (
                  <div key={month} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full rounded-t ${isPeak ? 'bg-green-400' : isTrough ? 'bg-red-300' : 'bg-blue-300'}`}
                      style={{ height: `${height}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{months[parseInt(month) - 1]}</div>
                    <div className="text-xs text-gray-400">{(multiplier * 100).toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Yearly Summary Cards */}
        <div className={`grid gap-4 ${projectionYears <= 3 ? 'grid-cols-3' : projectionYears === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {Array.from({ length: projectionYears }, (_, i) => {
            const yearData = projections.slice(i * 12, (i + 1) * 12);
            const totalRevenue = yearData.reduce((sum, m) => sum + m.revenue, 0);
            const totalCashReceived = yearData.reduce((sum, m) => sum + (m.cashReceived || 0), 0);
            const totalCosts = yearData.reduce((sum, m) => sum + m.costs, 0);
            const totalCapex = yearData.reduce((sum, m) => sum + m.capex, 0);
            const pipelineOrders = yearData.reduce((sum, m) => sum + (m.pipelineOrders || 0), 0);
            const profit = totalRevenue - totalCosts;
            const endingCash = yearData[yearData.length - 1]?.cashPosition || 0;
            const cashFlowDelta = totalCashReceived - totalCosts - totalCapex;

            return (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Year {i + 1}</div>
                <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </div>
                <div className="text-xs text-gray-400 mb-3">Net P&L (accrual)</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenue</span>
                    <span className="text-green-600 font-medium">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">OpEx</span>
                    <span className="text-red-600 font-medium">{formatCurrency(totalCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CapEx</span>
                    <span className="text-orange-600 font-medium">{formatCurrency(totalCapex)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-gray-500">Cash Flow</span>
                    <span className={`font-medium ${cashFlowDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cashFlowDelta)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ending Cash</span>
                    <span className={`font-medium ${endingCash >= 0 ? 'text-gray-700' : 'text-red-600'}`}>
                      {formatCurrency(endingCash)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cash Flow Chart with Payment Lag */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Cash Flow Projection</h3>
            {assumptions.paymentTermsDays > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                💰 Net {assumptions.paymentTermsDays} cash lag applied
              </span>
            )}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={Math.max(1, Math.floor(projections.length / 12))} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v)} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area yAxisId="right" type="monotone" dataKey="cashPosition" name="Cash Position" fill="#FEE8E2" stroke="#FA4E23" />
                <Bar yAxisId="left" dataKey="cashReceived" name="Cash Received" fill="#22c55e" opacity={0.8} />
                <Bar yAxisId="left" dataKey="costs" name="Costs" fill="#ef4444" opacity={0.8} />
                <Line yAxisId="left" type="monotone" dataKey="profit" name="Profit (Accrual)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights with Payment Lag Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">📊 Key Insights</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Break-even Month</div>
              <div className="text-2xl font-bold text-green-600">
                {(() => {
                  const beMonth = projections.findIndex(p => p.profit >= 0);
                  return beMonth >= 0 ? `Month ${beMonth + 1}` : `>${projectionYears * 12} mo`;
                })()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Accrual basis</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Lowest Cash Point</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(Math.min(...projections.map(p => p.cashPosition)))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Month {projections.findIndex(p => p.cashPosition === Math.min(...projections.map(p => p.cashPosition))) + 1}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Cash Positive Month</div>
              <div className="text-2xl font-bold" style={{ color: BRAND.orange }}>
                {(() => {
                  const cashPosMonth = projections.findIndex(p => p.cashFlow >= 0);
                  return cashPosMonth >= 0 ? `Month ${cashPosMonth + 1}` : `>${projectionYears * 12} mo`;
                })()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Monthly cash flow &gt; $0</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">End of Year {projectionYears} Cash</div>
              <div className="text-2xl font-bold" style={{ color: projections[projections.length - 1]?.cashPosition >= 0 ? '#22c55e' : '#ef4444' }}>
                {formatCurrency(projections[projections.length - 1]?.cashPosition || 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">After Net {assumptions.paymentTermsDays} lag</div>
            </div>
          </div>
        </div>

        {/* Warehouse Expansion Triggers */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">🚀 Expansion Planning</h3>
          <p className="text-sm text-gray-600 mb-4">
            Based on your assumptions, here's when you should start planning new capacity
            (trigger at {Math.round(assumptions.triggerCapacity * 100)}% utilization, {assumptions.newSiteLeadTime} month lead time).
          </p>

          <div className="space-y-4">
            {expansionAnalysis.map(({ warehouse: wh, calc, triggerOrders, triggerMonth, planningStartMonth, leadTimeMonths }) => {
              const currentOrders = calc.latestPnL?.orders || 0;
              const currentUtil = (currentOrders / calc.maxOrdersPerMonth) * 100;

              return (
                <div key={wh.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{wh.name}</span>
                      <StatusBadge status={wh.status} size="small" />
                    </div>
                    {triggerMonth !== null ? (
                      <div className="text-right">
                        {planningStartMonth === 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            ⚠️ Start planning NOW
                          </span>
                        ) : planningStartMonth !== null && planningStartMonth <= 3 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Start planning in {planningStartMonth} months
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Plan in {planningStartMonth} months
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Trigger not reached in projection</span>
                    )}
                  </div>

                  {/* Visual Timeline */}
                  <div className="relative">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      {/* Current utilization */}
                      <div
                        className="absolute left-0 top-0 h-full bg-orange-200"
                        style={{ width: `${Math.min(100, currentUtil)}%` }}
                      />
                      {/* Break-even marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-yellow-500"
                        style={{ left: `${calc.breakEvenUtilization}%` }}
                      />
                      {/* Trigger marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-red-500"
                        style={{ left: `${assumptions.triggerCapacity * 100}%` }}
                      />
                      {/* Labels */}
                      <div className="absolute inset-0 flex items-center justify-between px-3 text-xs">
                        <span className="text-gray-600">{Math.round(currentUtil)}% now</span>
                        <span className="text-gray-600">{formatNumber(calc.maxOrdersPerMonth)} max</span>
                      </div>
                    </div>

                    {/* Timeline months */}
                    {triggerMonth !== null && (
                      <div className="mt-2 flex items-center gap-1 text-xs">
                        <div className="flex-1 h-2 bg-gray-200 rounded relative">
                          {planningStartMonth !== null && (
                            <div
                              className="absolute top-0 h-full bg-yellow-400 rounded-l"
                              style={{
                                left: `${(planningStartMonth / (projectionYears * 12)) * 100}%`,
                                width: `${(leadTimeMonths / (projectionYears * 12)) * 100}%`
                              }}
                            />
                          )}
                          <div
                            className="absolute top-0 w-2 h-2 bg-red-500 rounded-full -mt-0"
                            style={{ left: `${(triggerMonth / (projectionYears * 12)) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-500 whitespace-nowrap ml-2">
                          Trigger: Month {triggerMonth + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Current: {formatNumber(currentOrders)} orders/mo</span>
                    <span>Break-even: {formatNumber(calc.breakEvenOrders)}</span>
                    <span>Trigger: {formatNumber(triggerOrders)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-200 rounded" /> Current utilization</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded" /> Break-even</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded" /> Capacity trigger</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded" /> Planning window</div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderWarehouseDetail = (wh) => {
    const calc = calculations.warehouses[wh.id];
    const daysUntilLaunch = getDaysUntil(wh.goLiveDate);
    const whCustomers = customers.filter(c => c.warehouseId === wh.id);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{wh.name}</h1>
                <StatusBadge status={wh.status} />
              </div>
              <p className="text-gray-500 mt-1">{wh.location || 'Location not set'}</p>
            </div>
            {wh.status === 'launching' && daysUntilLaunch !== null && (
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">{daysUntilLaunch}</div>
                <div className="text-sm text-gray-500">days to launch</div>
              </div>
            )}
          </div>

          {/* Specs */}
          {editingWarehouseSpecs === wh.id ? (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <InputField label="Sq Ft" value={wh.sqft} onChange={(v) => handleUpdateWarehouse(wh.id, { sqft: v })} step={1000} />
                <InputField label="Bins" value={wh.bins} onChange={(v) => handleUpdateWarehouse(wh.id, { bins: v })} step={1000} />
                <InputField label="Ports" value={wh.ports} onChange={(v) => handleUpdateWarehouse(wh.id, { ports: v })} />
                <InputField label="Cu Ft/Bin" value={wh.cuFtPerBin} onChange={(v) => handleUpdateWarehouse(wh.id, { cuFtPerBin: v })} step={0.1} />
                <InputField label="Orders/Port/Hr" value={wh.ordersPerPortPerHour} onChange={(v) => handleUpdateWarehouse(wh.id, { ordersPerPortPerHour: v })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Name" value={wh.name} onChange={(v) => handleUpdateWarehouse(wh.id, { name: v })} type="text" />
                <InputField label="Location" value={wh.location} onChange={(v) => handleUpdateWarehouse(wh.id, { location: v })} type="text" />
                <InputField label="Go-Live Date" value={wh.goLiveDate} onChange={(v) => handleUpdateWarehouse(wh.id, { goLiveDate: v })} type="date" />
              </div>
              <button onClick={() => setEditingWarehouseSpecs(null)} className="px-4 py-2 text-white rounded-lg text-sm" style={{ backgroundColor: BRAND.orange }}>Done</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Sq Ft</div>
                  <div className="font-semibold">{formatNumber(wh.sqft)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Bins</div>
                  <div className="font-semibold">{formatNumber(wh.bins)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Ports</div>
                  <div className="font-semibold">{wh.ports}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-orange-600">Max Orders/Mo</div>
                  <div className="font-bold text-orange-700">{formatNumber(calc.maxOrdersPerMonth)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-600">Break-Even</div>
                  <div className="font-bold text-green-700">{formatNumber(calc.breakEvenOrders)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-purple-600">Utilization</div>
                  <div className="font-bold text-purple-700">{calc.currentUtilization.toFixed(1)}%</div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setEditingWarehouseSpecs(wh.id)} className="text-sm text-gray-600 hover:text-gray-900">Edit Details</button>
              </div>
            </>
          )}
        </div>

        {/* Rate Card Section */}
        <CollapsibleSection
          title="Default Rate Card"
          defaultOpen={false}
          rightContent={
            <div className="text-sm text-gray-500">
              Base pricing for customers at this location
            </div>
          }
        >
          <div className="grid grid-cols-4 gap-4 mb-4">
            <InputField
              label="Order Fee"
              prefix="$"
              value={wh.rateCard?.orderFee ?? defaultRateCard.orderFee}
              onChange={(v) => handleUpdateWarehouse(wh.id, { rateCard: { ...wh.rateCard, orderFee: v } })}
              step={0.01}
            />
            <InputField
              label="Pick Fee (per item)"
              prefix="$"
              value={wh.rateCard?.pickFee ?? defaultRateCard.pickFee}
              onChange={(v) => handleUpdateWarehouse(wh.id, { rateCard: { ...wh.rateCard, pickFee: v } })}
              step={0.01}
            />
            <InputField
              label="Storage (per cu ft/week)"
              prefix="$"
              value={wh.rateCard?.storagePerCuFtWeek ?? defaultRateCard.storagePerCuFtWeek}
              onChange={(v) => handleUpdateWarehouse(wh.id, { rateCard: { ...wh.rateCard, storagePerCuFtWeek: v } })}
              step={0.01}
            />
            <InputField
              label="Return Fee"
              prefix="$"
              value={wh.rateCard?.returnFee ?? defaultRateCard.returnFee}
              onChange={(v) => handleUpdateWarehouse(wh.id, { rateCard: { ...wh.rateCard, returnFee: v } })}
              step={0.01}
            />
          </div>
          <p className="text-xs text-gray-400 mb-4">
            These rates are used as defaults for customers at this warehouse. Individual customers can have custom rates.
          </p>

          {/* Variable Costs */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Variable Costs</label>
            <div className="grid grid-cols-4 gap-4">
              <InputField
                label="Cost per Order"
                prefix="$"
                value={wh.variableCostPerOrder ?? 0.44}
                onChange={(v) => handleUpdateWarehouse(wh.id, { variableCostPerOrder: v })}
                step={0.01}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Packaging, materials, and other costs that scale with order volume.
            </p>
          </div>
        </CollapsibleSection>

        {/* CapEx Section */}
        <CollapsibleSection
          title="CapEx"
          defaultOpen={wh.status !== 'live'}
          rightContent={
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-gray-500">Paid:</span> <span className="font-semibold text-green-600">{formatCurrency(calc.capexPaid)}</span></div>
              <div><span className="text-gray-500">Remaining:</span> <span className="font-semibold text-orange-600">{formatCurrency(calc.capexRemaining)}</span></div>
              <div><span className="text-gray-500">Total:</span> <span className="font-semibold">{formatCurrency(calc.totalCapex)}</span></div>
            </div>
          }
        >
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={wh.capexPaid.all || false} onChange={(e) => handleUpdateWarehouse(wh.id, { capexPaid: e.target.checked ? { all: true } : {} })} className="rounded" />
              <span className="font-medium">Mark All Paid</span>
            </label>
            <button onClick={() => setEditingCapex(editingCapex === wh.id ? null : wh.id)} className="text-sm text-orange-600">
              {editingCapex === wh.id ? 'Done' : 'Edit Amounts'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {Object.entries(wh.capex).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                <input type="checkbox" checked={wh.capexPaid.all || wh.capexPaid[key] || false} disabled={wh.capexPaid.all}
                  onChange={(e) => handleUpdateWarehouse(wh.id, { capexPaid: { ...wh.capexPaid, [key]: e.target.checked } })} className="rounded" />
                <span className={`flex-1 ${wh.capexPaid.all || wh.capexPaid[key] ? 'text-green-700' : ''}`}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                </span>
                {editingCapex === wh.id ? (
                  <input type="number" value={value || 0} onChange={(e) => handleUpdateWarehouse(wh.id, { capex: { ...wh.capex, [key]: parseFloat(e.target.value) || 0 } })}
                    className="w-24 px-2 py-1 border rounded text-right text-sm" />
                ) : (
                  <span className={`font-medium ${wh.capexPaid.all || wh.capexPaid[key] ? 'text-green-700' : ''}`}>{formatCurrency(value || 0)}</span>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Customers at this warehouse */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Customers ({whCustomers.length})</h2>
          </div>
          {whCustomers.length === 0 ? (
            <p className="text-gray-500 text-sm">No customers assigned to this warehouse</p>
          ) : (
            <div className="space-y-2">
              {whCustomers.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{c.name}</span>
                    <StatusBadge status={c.status} size="small" />
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(c.actualOrders)} orders/mo</div>
                    <div className="text-xs text-gray-500">Contracted: {formatNumber(c.contractedOrders)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly P&L (Live sites only) */}
        {wh.status === 'live' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Monthly P&L</h2>
              <button onClick={() => setShowAddMonthModal(true)} className="px-3 py-1.5 text-white rounded-lg text-sm">+ Add Month</button>
            </div>

            {calc.monthKeys.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No monthly data. Click "Add Month" to start tracking.</p>
            ) : (
              <div className="space-y-2">
                {calc.monthKeys.map(mk => {
                  const snapshot = wh.monthlySnapshots[mk];
                  const pnl = calculateMonthlyPnL(wh, snapshot);
                  return (
                    <div key={mk} onClick={() => setSelectedMonth(selectedMonth === mk ? null : mk)}
                      className={`p-4 rounded-lg cursor-pointer border-2 ${selectedMonth === mk ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{getMonthLabel(mk)}</span>
                        <span className={`font-semibold ${pnl.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(pnl.netMargin)}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div><span className="text-gray-500">Orders:</span> {formatNumber(pnl.orders)}</div>
                        <div><span className="text-gray-500">Revenue:</span> <span className="text-green-600">{formatCurrency(pnl.totalRevenue)}</span></div>
                        <div><span className="text-gray-500">Costs:</span> <span className="text-red-600">{formatCurrency(pnl.totalCosts)}</span></div>
                        <div><span className="text-gray-500">Net:</span> <span className={pnl.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(pnl.netMargin)}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Month Detail Editor */}
            {selectedMonth && wh.monthlySnapshots[selectedMonth] && (
              <div className="mt-6 pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{getMonthLabel(selectedMonth)} Details</h3>
                  <button onClick={() => setSelectedMonth(null)} className="text-sm text-gray-500">Close</button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <InputField label="Orders" value={wh.monthlySnapshots[selectedMonth].actuals.orders}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { actuals: { orders: v } })} step={1000} />
                  <InputField label="Revenue (actual)" prefix="$" value={wh.monthlySnapshots[selectedMonth].actuals.revenue}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { actuals: { revenue: v } })} step={1000} />
                  <div>
                    <label className="text-xs text-gray-500">Storage Util</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="range" min="0" max="100" value={(wh.monthlySnapshots[selectedMonth].actuals.storageUtil || 0) * 100}
                        onChange={(e) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { actuals: { storageUtil: e.target.value / 100 } })} className="flex-1" />
                      <span className="text-sm w-10">{((wh.monthlySnapshots[selectedMonth].actuals.storageUtil || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Team Leads" value={wh.monthlySnapshots[selectedMonth].labor.teamLeads}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { labor: { teamLeads: v } })} />
                  <InputField label="TL Cost" prefix="$" value={wh.monthlySnapshots[selectedMonth].labor.teamLeadCost}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { labor: { teamLeadCost: v } })} />
                  <InputField label="Associates" value={wh.monthlySnapshots[selectedMonth].labor.associates}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { labor: { associates: v } })} />
                  <InputField label="Assoc Cost" prefix="$" value={wh.monthlySnapshots[selectedMonth].labor.associateCost}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { labor: { associateCost: v } })} />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <InputField label="Rent" prefix="$" value={wh.monthlySnapshots[selectedMonth].opex.rent}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { opex: { rent: v } })} />
                  <InputField label="PIO" prefix="$" value={wh.monthlySnapshots[selectedMonth].opex.pio}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { opex: { pio: v } })} />
                  <InputField label="Energy" prefix="$" value={wh.monthlySnapshots[selectedMonth].opex.energy}
                    onChange={(v) => handleUpdateMonthSnapshot(wh.id, selectedMonth, { opex: { energy: v } })} />
                  <InputField label="Other" prefix="$" value={
                    Object.entries(wh.monthlySnapshots[selectedMonth].opex)
                      .filter(([k]) => !['rent', 'pio', 'energy'].includes(k))
                      .reduce((sum, [, v]) => sum + (v || 0), 0)
                  } onChange={() => {}} />
                </div>
              </div>
            )}

            {showAddMonthModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                  <h3 className="font-semibold mb-4">Add Month</h3>
                  <p className="text-sm text-gray-500 mb-4">Add {getMonthLabel(getNextMonth(wh))}</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddMonthModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                    <button onClick={() => handleAddMonth(wh.id, getNextMonth(wh))} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND.orange }}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={() => handleDeleteWarehouse(wh.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Delete Warehouse</button>
        </div>
      </div>
    );
  };

  // ============== MODALS ==============

  const renderCustomerModal = () => {
    const data = editingCustomer || newCustomer;
    const setData = editingCustomer ? (updates) => setEditingCustomer({ ...editingCustomer, ...updates }) : (updates) => setNewCustomer({ ...newCustomer, ...updates });
    const onSave = editingCustomer ? () => { handleUpdateCustomer(editingCustomer.id, editingCustomer); setEditingCustomer(null); } : handleAddCustomer;
    const onClose = () => { setEditingCustomer(null); setShowAddCustomer(false); };

    // Get warehouse default rates for comparison
    const selectedWarehouse = warehouses.find(w => w.id === data.warehouseId);
    const warehouseRates = selectedWarehouse?.rateCard || defaultRateCard;

    // Helper to update rate override
    const setRateOverride = (key, value) => {
      const newOverrides = { ...(data.rateOverrides || {}), [key]: value === '' ? null : parseFloat(value) };
      setData({ rateOverrides: newOverrides });
    };

    if (!showAddCustomer && !editingCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
          <h2 className="text-xl font-bold mb-4">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
          <div className="space-y-4">
            <InputField label="Customer Name" value={data.name} onChange={(v) => setData({ name: v })} type="text" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Tier</label>
                <select value={data.tier} onChange={(e) => setData({ tier: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                  <option value="anchor">Anchor (25K+)</option>
                  <option value="mid">Mid (10-25K)</option>
                  <option value="small">Small (&lt;10K)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select value={data.status} onChange={(e) => setData({ status: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                  <option value="onboarding">Onboarding</option>
                  <option value="active">Active</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Warehouse</label>
              <select value={data.warehouseId} onChange={(e) => setData({ warehouseId: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                <option value="">Select warehouse</option>
                {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Contracted Orders/mo" value={data.contractedOrders} onChange={(v) => setData({ contractedOrders: v })} step={1000} />
              <InputField label="Actual Orders/mo" value={data.actualOrders} onChange={(v) => setData({ actualOrders: v })} step={1000} />
              <InputField label="Actual Units/mo" value={data.actualUnits} onChange={(v) => setData({ actualUnits: v })} step={1000} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Start Date" value={data.startDate} onChange={(v) => setData({ startDate: v })} type="date" />
              <InputField label="Monthly Minimum" prefix="$" value={data.monthlyMinimum || 0} onChange={(v) => setData({ monthlyMinimum: v })} step={100} />
            </div>

            {/* Custom Pricing Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Custom Pricing</label>
                <span className="text-xs text-gray-400">Leave blank to use warehouse default</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Order Fee</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={data.rateOverrides?.orderFee ?? ''}
                      onChange={(e) => setRateOverride('orderFee', e.target.value)}
                      placeholder={`$${warehouseRates.orderFee}`}
                      className="w-full px-2 py-1.5 border rounded text-sm mt-1 placeholder-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Pick Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    value={data.rateOverrides?.pickFee ?? ''}
                    onChange={(e) => setRateOverride('pickFee', e.target.value)}
                    placeholder={`$${warehouseRates.pickFee}`}
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1 placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Storage/cuft/wk</label>
                  <input
                    type="number"
                    step="0.01"
                    value={data.rateOverrides?.storagePerCuFtWeek ?? ''}
                    onChange={(e) => setRateOverride('storagePerCuFtWeek', e.target.value)}
                    placeholder={`$${warehouseRates.storagePerCuFtWeek}`}
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1 placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Return Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    value={data.rateOverrides?.returnFee ?? ''}
                    onChange={(e) => setRateOverride('returnFee', e.target.value)}
                    placeholder={`$${warehouseRates.returnFee}`}
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1 placeholder-gray-300"
                  />
                </div>
              </div>
              {data.warehouseId && (
                <p className="text-xs text-gray-400 mt-2">
                  Warehouse default: ${warehouseRates.orderFee} order + ${warehouseRates.pickFee}/pick + ${warehouseRates.storagePerCuFtWeek}/cuft/wk + ${warehouseRates.returnFee} return
                </p>
              )}
            </div>

            {/* Inbound Pricing */}
            <div className="border-t pt-4 mt-4">
              <label className="text-sm font-medium text-gray-700">Inbound Pricing</label>
              <textarea
                value={data.inboundPricing || ''}
                onChange={(e) => setData({ inboundPricing: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm mt-2"
                rows={2}
                placeholder="e.g., $15/pallet, $2/carton, $0.10/unit..."
              />
            </div>

            {/* Special Projects */}
            <div>
              <label className="text-sm font-medium text-gray-700">Special Projects</label>
              <textarea
                value={data.specialProjects || ''}
                onChange={(e) => setData({ specialProjects: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm mt-2"
                rows={2}
                placeholder="e.g., Kitting, relabeling, custom packaging..."
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Notes</label>
              <textarea value={data.notes} onChange={(e) => setData({ notes: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1" rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={onSave} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND.orange }}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const renderForecastModal = () => {
    const data = editingForecast || newForecast;
    const setData = editingForecast ? (updates) => setEditingForecast({ ...editingForecast, ...updates }) : (updates) => setNewForecast({ ...newForecast, ...updates });
    const onSave = editingForecast ? () => { handleUpdateForecast(editingForecast.id, editingForecast); setEditingForecast(null); } : handleAddForecast;
    const onClose = () => { setEditingForecast(null); setShowAddForecast(false); };

    if (!showAddForecast && !editingForecast) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full p-6">
          <h2 className="text-xl font-bold mb-4">{editingForecast ? 'Edit Deal' : 'Add Deal'}</h2>
          <div className="space-y-4">
            <InputField label="Deal / Customer Name" value={data.name} onChange={(v) => setData({ name: v })} type="text" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Tier</label>
                <select value={data.tier} onChange={(e) => setData({ tier: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                  <option value="anchor">Anchor (25K+)</option>
                  <option value="mid">Mid (10-25K)</option>
                  <option value="small">Small (&lt;10K)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Confidence</label>
                <select value={data.confidence} onChange={(e) => setData({ confidence: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Target Warehouse</label>
              <select value={data.warehouseId} onChange={(e) => setData({ warehouseId: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                <option value="">TBD</option>
                {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Full Run-Rate Orders/mo" value={data.expectedOrders} onChange={(v) => setData({ expectedOrders: v })} step={1000} />
              <InputField label="Expected Start" value={data.expectedStart} onChange={(v) => setData({ expectedStart: v })} type="date" />
            </div>

            {/* Ramp Schedule */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Ramp Schedule</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Months to full:</span>
                  <select
                    value={data.rampMonths || 6}
                    onChange={(e) => setData({ rampMonths: parseInt(e.target.value) })}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value={1}>1 mo (instant)</option>
                    <option value={3}>3 mo</option>
                    <option value={6}>6 mo</option>
                    <option value={12}>12 mo</option>
                    <option value={18}>18 mo</option>
                    <option value={24}>24 mo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Month 1</label>
                  <input
                    type="number"
                    value={data.rampSchedule?.[0]?.orders ?? Math.round(data.expectedOrders * 0.1)}
                    onChange={(e) => {
                      const newSchedule = [...(data.rampSchedule || [])];
                      newSchedule[0] = { month: 1, orders: parseInt(e.target.value) || 0 };
                      setData({ rampSchedule: newSchedule });
                    }}
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1"
                    placeholder="Starting orders"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Month 3</label>
                  <input
                    type="number"
                    value={data.rampSchedule?.[1]?.orders ?? Math.round(data.expectedOrders * 0.5)}
                    onChange={(e) => {
                      const newSchedule = [...(data.rampSchedule || [])];
                      newSchedule[1] = { month: 3, orders: parseInt(e.target.value) || 0 };
                      setData({ rampSchedule: newSchedule });
                    }}
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1"
                    placeholder="Mid-ramp orders"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Month 6+</label>
                  <input
                    type="number"
                    value={data.expectedOrders || 0}
                    disabled
                    className="w-full px-2 py-1.5 border rounded text-sm mt-1 bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Enter expected order volume at each milestone. Full run-rate reached at month {data.rampMonths || 6}.
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Notes</label>
              <textarea value={data.notes} onChange={(e) => setData({ notes: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1" rows={2} placeholder="e.g., Key contacts, contract details..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={onSave} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND.orange }}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const renderImportModal = () => {
    if (!showImportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Import Monthly Actuals</h2>
            <button onClick={() => { setShowImportModal(false); setImportPreview(null); setImportData(''); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>

          {!importPreview ? (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Month</label>
                <input
                  type="month"
                  value={importMonth}
                  onChange={(e) => setImportMonth(e.target.value)}
                  className="ml-3 px-3 py-1.5 border rounded text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Paste CSV Data</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm mt-2 font-mono"
                  rows={10}
                  placeholder={`Warehouse, Customer, Orders, Units, Revenue
Chicago, First Customer (LOI), 2500, 2750, 1875.00
Chicago, Acme Corp, 8000, 8800, 6000.00
Dallas, New Brand, 3000, 3300, 2250.00`}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Expected Format</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Required columns:</strong> Customer (or Name/Client/Brand), Orders</p>
                  <p><strong>Optional columns:</strong> Warehouse (or Site/Location), Units (or Picks/Items), Revenue (or Amount/Total)</p>
                  <p>Column names are flexible - the system will try to match them automatically.</p>
                  <p>If Units is not provided, it defaults to Orders × 1.1</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowImportModal(false); setImportData(''); }} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleImportPreview} disabled={!importData.trim()} className="flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50" style={{ backgroundColor: BRAND.orange }}>Preview Import</button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">Importing for: <strong>{getMonthLabel(importMonth)}</strong></span>
                <span className="text-sm text-gray-600">|</span>
                <span className="text-sm text-gray-600">{importPreview.rows.length} rows found</span>
              </div>

              <div className="border rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Warehouse</th>
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-right p-3 font-medium">Orders</th>
                      {importPreview.hasUnitsColumn && <th className="text-right p-3 font-medium">Units</th>}
                      {importPreview.hasRevenueColumn && <th className="text-right p-3 font-medium">Revenue</th>}
                      <th className="text-left p-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.rows.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">
                          {row.customerMatch === 'exact' && <span className="text-green-600">✓ Match</span>}
                          {row.customerMatch === 'fuzzy' && <span className="text-yellow-600">~ Fuzzy</span>}
                          {row.customerMatch === 'not_found' && <span className="text-orange-600">+ New</span>}
                        </td>
                        <td className="p-3">
                          {row.matchedWarehouse ? (
                            <span className="text-gray-900">{row.matchedWarehouse.name}</span>
                          ) : row.raw.warehouseName ? (
                            <span className="text-red-500">{row.raw.warehouseName} (?)</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div>{row.raw.customerName}</div>
                          {row.matchedCustomer && row.customerMatch === 'fuzzy' && (
                            <div className="text-xs text-gray-500">→ {row.matchedCustomer.name}</div>
                          )}
                        </td>
                        <td className="p-3 text-right font-medium">{formatNumber(row.raw.orders)}</td>
                        {importPreview.hasUnitsColumn && (
                          <td className="p-3 text-right">{row.raw.units ? formatNumber(row.raw.units) : '—'}</td>
                        )}
                        {importPreview.hasRevenueColumn && (
                          <td className="p-3 text-right">{row.raw.revenue ? formatCurrency(row.raw.revenue) : '—'}</td>
                        )}
                        <td className="p-3">
                          {row.createNew ? (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Create customer</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Update actuals</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="text-sm">
                  <span className="font-medium">{importPreview.rows.filter(r => r.matchedCustomer).length}</span> customers will be updated,{' '}
                  <span className="font-medium">{importPreview.rows.filter(r => r.createNew).length}</span> new customers will be created
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setImportPreview(null)} className="flex-1 px-4 py-2 border rounded-lg">Back</button>
                <button onClick={handleImportConfirm} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Confirm Import</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderWarehouseModal = () => {
    if (!showAddWarehouse) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6">
          <h2 className="text-xl font-bold mb-4">Add Warehouse</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Name" value={newWarehouse.name} onChange={(v) => setNewWarehouse({ ...newWarehouse, name: v })} type="text" />
              <InputField label="Location" value={newWarehouse.location} onChange={(v) => setNewWarehouse({ ...newWarehouse, location: v })} type="text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select value={newWarehouse.status} onChange={(e) => setNewWarehouse({ ...newWarehouse, status: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm mt-1">
                  <option value="planning">Planning</option>
                  <option value="launching">Launching</option>
                  <option value="live">Live</option>
                </select>
              </div>
              <InputField label="Go-Live Date" value={newWarehouse.goLiveDate} onChange={(v) => setNewWarehouse({ ...newWarehouse, goLiveDate: v })} type="date" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <InputField label="Sq Ft" value={newWarehouse.sqft} onChange={(v) => setNewWarehouse({ ...newWarehouse, sqft: v })} step={1000} />
              <InputField label="Bins" value={newWarehouse.bins} onChange={(v) => setNewWarehouse({ ...newWarehouse, bins: v })} step={1000} />
              <InputField label="Ports" value={newWarehouse.ports} onChange={(v) => setNewWarehouse({ ...newWarehouse, ports: v })} />
              <InputField label="Orders/Port/Hr" value={newWarehouse.ordersPerPortPerHour} onChange={(v) => setNewWarehouse({ ...newWarehouse, ordersPerPortPerHour: v })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowAddWarehouse(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={handleAddWarehouse} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND.orange }}>Add</button>
          </div>
        </div>
      </div>
    );
  };

  // ============== MAIN RENDER ==============

  const renderContent = () => {
    switch (selectedView) {
      case 'overview': return renderOverview();
      case 'customers': return renderCustomers();
      case 'forecast': return renderForecast();
      case 'scenarios': return renderScenarios();
      default: return selectedWarehouse ? renderWarehouseDetail(selectedWarehouse) : renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-56 text-white flex flex-col fixed h-full" style={{ backgroundColor: BRAND.black }}>
        <div className="py-5 px-4 border-b border-gray-800 flex items-center justify-center">
          <CytronicLogo height={24} />
        </div>

        <nav className="flex-1 p-3 overflow-y-auto text-sm">
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">Actuals</div>
            <button onClick={() => setSelectedView('overview')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedView === 'overview' ? 'text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              style={selectedView === 'overview' ? { backgroundColor: BRAND.orange } : {}}>
              Overview
            </button>
            <button onClick={() => setSelectedView('customers')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedView === 'customers' ? 'text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              style={selectedView === 'customers' ? { backgroundColor: BRAND.orange } : {}}>
              Customers
            </button>
            <div className="mt-2 space-y-1">
              {warehouses.map(wh => (
                <button key={wh.id} onClick={() => setSelectedView(wh.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${selectedView === wh.id ? 'text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                  style={selectedView === wh.id ? { backgroundColor: BRAND.orange } : {}}>
                  <span className="truncate">{wh.name}</span>
                  <span className={`text-xs ${wh.status === 'live' ? 'text-green-400' : wh.status === 'launching' ? 'text-orange-400' : 'text-gray-600'}`}>●</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">Planning</div>
            <button onClick={() => setSelectedView('forecast')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedView === 'forecast' ? 'text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              style={selectedView === 'forecast' ? { backgroundColor: BRAND.orange } : {}}>
              Sales Forecast
            </button>
            <button onClick={() => setSelectedView('scenarios')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedView === 'scenarios' ? 'text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              style={selectedView === 'scenarios' ? { backgroundColor: BRAND.orange } : {}}>
              Scenarios
            </button>
          </div>

          <button onClick={() => setShowAddWarehouse(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white transition-colors">
            + Add Warehouse
          </button>
        </nav>

        <div className="p-3 border-t border-gray-800" style={{ backgroundColor: '#252525' }}>
          <div className="text-xs text-gray-500 mb-1">Cash Runway</div>
          <div className="text-lg font-bold" style={{ color: BRAND.orange }}>{formatCurrency(calculations.portfolio.availableCash)}</div>
          <div className="text-xs text-gray-500">{calculations.portfolio.runway > 100 ? '100+' : calculations.portfolio.runway} months</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div className={`h-1 rounded-full ${calculations.portfolio.runway > 18 ? 'bg-green-500' : calculations.portfolio.runway > 12 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (calculations.portfolio.runway / 36) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-56 p-6">
        {renderContent()}
      </div>

      {/* Modals */}
      {renderCustomerModal()}
      {renderForecastModal()}
      {renderWarehouseModal()}
      {renderImportModal()}
    </div>
  );
}

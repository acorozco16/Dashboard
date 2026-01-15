'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area } from 'recharts';

// Utility functions
const formatCurrency = (val) => {
  if (val === null || val === undefined) return '-';
  const absVal = Math.abs(val);
  if (absVal >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (absVal >= 1000) return `$${(val / 1000).toFixed(0)}K`;
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

const StatusBadge = ({ status }) => {
  const styles = {
    live: 'bg-green-100 text-green-700 border-green-300',
    launching: 'bg-blue-100 text-blue-700 border-blue-300',
    planning: 'bg-gray-100 text-gray-600 border-gray-300'
  };
  const labels = { live: 'Live', launching: 'Launching', planning: 'Planning' };
  const icons = { live: '●', launching: '◐', planning: '○' };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span>{icons[status]}</span> {labels[status]}
    </span>
  );
};

// Collapsible Section Component
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

// Create default monthly snapshot
const createMonthlySnapshot = (baseConfig = {}) => ({
  labor: baseConfig.labor || {
    teamLeads: 1,
    teamLeadCost: 5291,
    associates: 3,
    associateCost: 3466
  },
  opex: baseConfig.opex || {
    rent: 30000,
    internet: 290,
    trash: 250,
    security: 60,
    pio: 20000,
    energy: 550,
    gas: 400,
    hvac: 70,
    repairs: 200,
    officeCleaning: 200,
    drinksSnacks: 150,
    cleaningSupplies: 50,
    toiletries: 40,
    officeSupplies: 30,
    equipmentReplacement: 500
  },
  customOpex: baseConfig.customOpex || [],
  customers: baseConfig.customers || { anchor: 0, midTier: 0, small: 0 },
  actuals: baseConfig.actuals || {
    orders: 0,
    revenue: 0,
    storageUtil: 0
  },
  isLocked: false
});

// Default warehouse template
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
    securityDeposit: 100000,
    firePreSurvey: 1200,
    pio50_1: 250000,
    install50_1: 110000,
    firePermitting: 30000,
    electricalDesign: 30000,
    electricalPermit: 40000,
    seismic: 0,
    pio50_2: 250000,
    install50_2: 110000,
    pioShipping: 60000,
    pioTariffs: 0,
    autobagger: 200000,
    conveyors: 18510,
    warehouseEquipment: 26122,
    airCompression: 12714,
    networkGear: 4000,
    crateRemoval: 2500,
    binInsertHires: 4700,
    furniture: 2500,
    forkliftUnload: 1750,
    securityInstall: 1950
  },
  customCapex: [],
  capexPaid: {},
  monthlySnapshots: {}
});

// Initial warehouses
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
      securityDeposit: 76857,
      firePreSurvey: 0,
      pio50_1: 247500,
      install50_1: 109370,
      firePermitting: 26500,
      electricalDesign: 32850,
      electricalPermit: 80481,
      seismic: 0,
      pio50_2: 247500,
      install50_2: 109370,
      pioShipping: 60000,
      pioTariffs: 0,
      autobagger: 200000,
      conveyors: 18510,
      warehouseEquipment: 26122,
      airCompression: 12714,
      networkGear: 3700,
      crateRemoval: 2500,
      binInsertHires: 4700,
      furniture: 2500,
      forkliftUnload: 1750,
      securityInstall: 1950,
      electricalPermitAddl: 12000
    },
    customCapex: [],
    capexPaid: { all: true },
    monthlySnapshots: {
      '2026-01': createMonthlySnapshot({
        labor: { teamLeads: 1, teamLeadCost: 5291, associates: 3, associateCost: 3466 },
        opex: { rent: 30510, internet: 290, trash: 250, security: 60, pio: 19253, energy: 550, gas: 418, hvac: 70, repairs: 200, officeCleaning: 200, drinksSnacks: 150, cleaningSupplies: 50, toiletries: 40, officeSupplies: 30, equipmentReplacement: 500 },
        customOpex: [],
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
      securityDeposit: 101846,
      firePreSurvey: 1200,
      pio50_1: 300900,
      install50_1: 131600,
      firePermitting: 30000,
      electricalDesign: 30000,
      electricalPermit: 40000,
      seismic: 0,
      pio50_2: 300900,
      install50_2: 131600,
      pioShipping: 60000,
      pioTariffs: 120000,
      autobagger: 200000,
      conveyors: 18510,
      warehouseEquipment: 26122,
      airCompression: 12714,
      networkGear: 4000,
      crateRemoval: 2500,
      binInsertHires: 4700,
      furniture: 2500,
      forkliftUnload: 1750,
      securityInstall: 1950
    },
    customCapex: [],
    capexPaid: { pio50_1: true },
    monthlySnapshots: {}
  }
];

export default function WarehouseDashboard() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState(createDefaultWarehouse());

  const [globalSettings, setGlobalSettings] = useState({
    cash: { onHand: 3000000, vcFunding: 5000000 },
    rateCard: {
      orderFee: 0.50,
      pickFee: 0.10,
      storagePerCuFtWeek: 0.39,
      returnFee: 3.00
    },
    assumptions: {
      avgItemsPerOrder: 2,
      returnRate: 0.05,
      variableCostPerOrder: 0.44
    }
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('warehouseDashboardV5');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.warehouses) setWarehouses(data.warehouses);
        if (data.globalSettings) setGlobalSettings(data.globalSettings);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('warehouseDashboardV5', JSON.stringify({ warehouses, globalSettings }));
  }, [warehouses, globalSettings]);

  // Calculate monthly P&L for a snapshot
  const calculateMonthlyPnL = (wh, snapshot) => {
    const laborCost = (snapshot.labor.teamLeads * snapshot.labor.teamLeadCost) +
                     (snapshot.labor.associates * snapshot.labor.associateCost);
    const standardOpex = Object.values(snapshot.opex).reduce((sum, v) => sum + (v || 0), 0);
    const customOpexTotal = (snapshot.customOpex || []).reduce((sum, item) => sum + (item.amount || 0), 0);
    const fixedOpex = standardOpex + customOpexTotal + laborCost;

    const totalStorage = wh.bins * wh.cuFtPerBin;
    const storageRevenue = totalStorage * (snapshot.actuals.storageUtil || 0) * globalSettings.rateCard.storagePerCuFtWeek * 4.33;

    const revenuePerOrder = globalSettings.rateCard.orderFee +
      (globalSettings.rateCard.pickFee * globalSettings.assumptions.avgItemsPerOrder) +
      (globalSettings.rateCard.returnFee * globalSettings.assumptions.returnRate);

    const orderRevenue = (snapshot.actuals.orders || 0) * revenuePerOrder;
    const totalRevenue = orderRevenue + storageRevenue;
    const variableCosts = (snapshot.actuals.orders || 0) * globalSettings.assumptions.variableCostPerOrder;
    const totalCosts = fixedOpex + variableCosts;
    const netMargin = totalRevenue - totalCosts;

    const totalCustomers = (snapshot.customers.anchor || 0) + (snapshot.customers.midTier || 0) + (snapshot.customers.small || 0);

    return {
      laborCost,
      standardOpex,
      customOpexTotal,
      fixedOpex,
      storageRevenue,
      orderRevenue,
      totalRevenue,
      variableCosts,
      totalCosts,
      netMargin,
      totalCustomers,
      orders: snapshot.actuals.orders || 0
    };
  };

  // Portfolio calculations
  const calculations = useMemo(() => {
    const warehouseCalcs = {};
    let totalCapexSpent = 0;

    warehouses.forEach(wh => {
      const standardCapex = Object.values(wh.capex).reduce((sum, v) => sum + (v || 0), 0);
      const customCapexTotal = (wh.customCapex || []).reduce((sum, item) => sum + (item.amount || 0), 0);
      const totalCapex = standardCapex + customCapexTotal;

      const capexPaid = wh.capexPaid.all
        ? totalCapex
        : Object.keys(wh.capexPaid).filter(k => wh.capexPaid[k]).reduce((sum, k) => sum + (wh.capex[k] || 0), 0);

      if (wh.status === 'live' || wh.status === 'launching') {
        totalCapexSpent += capexPaid;
      }

      const monthKeys = Object.keys(wh.monthlySnapshots).sort();
      const latestMonth = monthKeys[monthKeys.length - 1];
      const latestSnapshot = latestMonth ? wh.monthlySnapshots[latestMonth] : null;

      let latestPnL = null;
      if (latestSnapshot) {
        latestPnL = calculateMonthlyPnL(wh, latestSnapshot);
      }

      const maxOrdersPerHour = wh.ports * wh.ordersPerPortPerHour;
      const maxOrdersPerDay = maxOrdersPerHour * 8;
      const maxOrdersPerMonthPerShift = maxOrdersPerDay * 22;

      warehouseCalcs[wh.id] = {
        totalCapex,
        capexPaid,
        capexRemaining: totalCapex - capexPaid,
        capexProgress: totalCapex > 0 ? (capexPaid / totalCapex) * 100 : 0,
        maxOrdersPerMonthPerShift,
        latestMonth,
        latestSnapshot,
        latestPnL,
        monthKeys
      };
    });

    const totalCash = globalSettings.cash.onHand + globalSettings.cash.vcFunding;
    const availableCash = totalCash - totalCapexSpent;

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

    return {
      warehouses: warehouseCalcs,
      portfolio: { totalCash, totalCapexSpent, availableCash, totalMonthlyOpex, totalMonthlyRevenue, monthlyBurn, runway }
    };
  }, [warehouses, globalSettings]);

  // Handlers
  const handleAddWarehouse = () => {
    setWarehouses([...warehouses, { ...newWarehouse, id: Date.now().toString() }]);
    setNewWarehouse(createDefaultWarehouse());
    setShowAddModal(false);
  };

  const handleUpdateWarehouse = (id, updates) => {
    setWarehouses(warehouses.map(wh => wh.id === id ? { ...wh, ...updates } : wh));
  };

  const handleDeleteWarehouse = (id) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(wh => wh.id !== id));
      if (selectedView === id) setSelectedView('overview');
    }
  };

  const handleAddMonth = (warehouseId, monthKey) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const monthKeys = Object.keys(wh.monthlySnapshots).sort();
    const prevMonth = monthKeys[monthKeys.length - 1];
    const prevSnapshot = prevMonth ? wh.monthlySnapshots[prevMonth] : null;

    const newSnapshot = createMonthlySnapshot(prevSnapshot ? {
      labor: { ...prevSnapshot.labor },
      opex: { ...prevSnapshot.opex },
      customOpex: [...(prevSnapshot.customOpex || [])],
      customers: { ...prevSnapshot.customers },
      actuals: { orders: 0, revenue: 0, storageUtil: prevSnapshot.actuals.storageUtil || 0 }
    } : {});

    handleUpdateWarehouse(warehouseId, {
      monthlySnapshots: {
        ...wh.monthlySnapshots,
        [monthKey]: newSnapshot
      }
    });
    setSelectedMonth(monthKey);
    setShowAddMonthModal(false);
  };

  const handleUpdateMonthSnapshot = (warehouseId, monthKey, updates) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const currentSnapshot = wh.monthlySnapshots[monthKey] || createMonthlySnapshot();
    const updatedSnapshot = {
      ...currentSnapshot,
      ...updates,
      labor: updates.labor ? { ...currentSnapshot.labor, ...updates.labor } : currentSnapshot.labor,
      opex: updates.opex ? { ...currentSnapshot.opex, ...updates.opex } : currentSnapshot.opex,
      customOpex: updates.customOpex !== undefined ? updates.customOpex : currentSnapshot.customOpex,
      customers: updates.customers ? { ...currentSnapshot.customers, ...updates.customers } : currentSnapshot.customers,
      actuals: updates.actuals ? { ...currentSnapshot.actuals, ...updates.actuals } : currentSnapshot.actuals
    };

    handleUpdateWarehouse(warehouseId, {
      monthlySnapshots: {
        ...wh.monthlySnapshots,
        [monthKey]: updatedSnapshot
      }
    });
  };

  const handleAddCustomOpex = (warehouseId, monthKey) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;
    const snapshot = wh.monthlySnapshots[monthKey];
    if (!snapshot) return;

    const newCustomOpex = [...(snapshot.customOpex || []), { id: Date.now(), name: '', amount: 0 }];
    handleUpdateMonthSnapshot(warehouseId, monthKey, { customOpex: newCustomOpex });
  };

  const handleUpdateCustomOpex = (warehouseId, monthKey, itemId, field, value) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;
    const snapshot = wh.monthlySnapshots[monthKey];
    if (!snapshot) return;

    const updatedCustomOpex = (snapshot.customOpex || []).map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    handleUpdateMonthSnapshot(warehouseId, monthKey, { customOpex: updatedCustomOpex });
  };

  const handleRemoveCustomOpex = (warehouseId, monthKey, itemId) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;
    const snapshot = wh.monthlySnapshots[monthKey];
    if (!snapshot) return;

    const updatedCustomOpex = (snapshot.customOpex || []).filter(item => item.id !== itemId);
    handleUpdateMonthSnapshot(warehouseId, monthKey, { customOpex: updatedCustomOpex });
  };

  const handleAddCustomCapex = (warehouseId) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const newCustomCapex = [...(wh.customCapex || []), { id: Date.now(), name: '', amount: 0 }];
    handleUpdateWarehouse(warehouseId, { customCapex: newCustomCapex });
  };

  const handleUpdateCustomCapex = (warehouseId, itemId, field, value) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const updatedCustomCapex = (wh.customCapex || []).map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    handleUpdateWarehouse(warehouseId, { customCapex: updatedCustomCapex });
  };

  const handleRemoveCustomCapex = (warehouseId, itemId) => {
    const wh = warehouses.find(w => w.id === warehouseId);
    if (!wh) return;

    const updatedCustomCapex = (wh.customCapex || []).filter(item => item.id !== itemId);
    handleUpdateWarehouse(warehouseId, { customCapex: updatedCustomCapex });
  };

  const selectedWarehouse = warehouses.find(wh => wh.id === selectedView);

  // Input component with select-all on focus
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
          className="w-full px-2 py-1.5 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );

  // Get next available month
  const getNextMonth = (wh) => {
    const monthKeys = Object.keys(wh.monthlySnapshots).sort();
    if (monthKeys.length === 0) {
      return getMonthKey(new Date());
    }
    const lastMonth = monthKeys[monthKeys.length - 1];
    const [year, month] = lastMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    return getMonthKey(nextDate);
  };

  // Monthly Progress Timeline (vertical scroll)
  const renderMonthlyProgress = (wh) => {
    const calc = calculations.warehouses[wh.id];
    const monthKeys = calc.monthKeys || [];

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Monthly Progress</h2>
          <button
            onClick={() => setShowAddMonthModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Month
          </button>
        </div>

        {monthKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📅</div>
            <p>No monthly data yet</p>
            <p className="text-sm">Click "Add Month" to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {monthKeys.map(mk => {
              const snapshot = wh.monthlySnapshots[mk];
              const pnl = calculateMonthlyPnL(wh, snapshot);
              const isSelected = selectedMonth === mk;

              return (
                <div
                  key={mk}
                  onClick={() => setSelectedMonth(isSelected ? null : mk)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{getMonthLabel(mk)}</span>
                    <span className={`text-sm font-medium ${pnl.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(pnl.netMargin)}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div>
                      <div className="text-xs text-gray-500">Orders</div>
                      <div className="text-sm font-medium">{formatNumber(pnl.orders)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="text-sm font-medium text-green-600">{formatCurrency(pnl.totalRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Costs</div>
                      <div className="text-sm font-medium text-red-600">{formatCurrency(pnl.totalCosts)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Net</div>
                      <div className={`text-sm font-medium ${pnl.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(pnl.netMargin)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Customers</div>
                      <div className="text-sm font-medium">{pnl.totalCustomers}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Month Modal */}
        {showAddMonthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Month</h3>
              <p className="text-sm text-gray-500 mb-4">
                {monthKeys.length > 0
                  ? `This will copy forward settings from ${getMonthLabel(monthKeys[monthKeys.length - 1])}`
                  : 'Start tracking monthly data'
                }
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddMonthModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => handleAddMonth(wh.id, getNextMonth(wh))} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add {getMonthLabel(getNextMonth(wh))}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Monthly Detail View
  const renderMonthDetail = (wh, monthKey) => {
    const snapshot = wh.monthlySnapshots[monthKey];
    if (!snapshot) return null;

    const pnl = calculateMonthlyPnL(wh, snapshot);

    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{getMonthLabel(monthKey)} Details</h3>
          <button onClick={() => setSelectedMonth(null)} className="text-sm text-blue-600 hover:text-blue-700">
            ← Close
          </button>
        </div>

        {/* P&L Summary - 5 cards */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-medium mb-3 text-sm text-gray-600">P&L Summary</h4>
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-600">Orders</div>
              <div className="text-lg font-bold text-blue-700">{formatNumber(pnl.orders)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xs text-green-600">Revenue</div>
              <div className="text-lg font-bold text-green-700">{formatCurrency(pnl.totalRevenue)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xs text-red-600">Costs</div>
              <div className="text-lg font-bold text-red-700">{formatCurrency(pnl.totalCosts)}</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${pnl.netMargin >= 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
              <div className={`text-xs ${pnl.netMargin >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>Net</div>
              <div className={`text-lg font-bold ${pnl.netMargin >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                {formatCurrency(pnl.netMargin)}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xs text-purple-600">Customers</div>
              <div className="text-lg font-bold text-purple-700">{pnl.totalCustomers}</div>
            </div>
          </div>
        </div>

        {/* Actuals + Customers side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-medium mb-3 text-sm text-gray-600">Actuals</h4>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Orders"
                value={snapshot.actuals.orders}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { actuals: { orders: v }})}
                step={1000}
              />
              <InputField
                label="Revenue"
                prefix="$"
                value={snapshot.actuals.revenue}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { actuals: { revenue: v }})}
                step={1000}
              />
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500">Storage Utilization</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(snapshot.actuals.storageUtil || 0) * 100}
                  onChange={(e) => handleUpdateMonthSnapshot(wh.id, monthKey, { actuals: { storageUtil: e.target.value / 100 }})}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-10">{((snapshot.actuals.storageUtil || 0) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-medium mb-3 text-sm text-gray-600">Customers</h4>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="Anchor (25K+)"
                value={snapshot.customers.anchor}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { customers: { anchor: v }})}
              />
              <InputField
                label="Mid (10-25K)"
                value={snapshot.customers.midTier}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { customers: { midTier: v }})}
              />
              <InputField
                label="Small (0-10K)"
                value={snapshot.customers.small}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { customers: { small: v }})}
              />
            </div>
          </div>
        </div>

        {/* Labor + OpEx side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-medium mb-3 text-sm text-gray-600">Labor</h4>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Team Leads"
                value={snapshot.labor.teamLeads}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { labor: { teamLeads: v }})}
              />
              <InputField
                label="TL Cost/mo"
                prefix="$"
                value={snapshot.labor.teamLeadCost}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { labor: { teamLeadCost: v }})}
              />
              <InputField
                label="Associates"
                value={snapshot.labor.associates}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { labor: { associates: v }})}
              />
              <InputField
                label="Assoc Cost/mo"
                prefix="$"
                value={snapshot.labor.associateCost}
                onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { labor: { associateCost: v }})}
              />
            </div>
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              Total Labor: <span className="font-medium text-gray-900">{formatCurrency(pnl.laborCost)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-medium mb-3 text-sm text-gray-600">Monthly OpEx</h4>
            <div className="grid grid-cols-3 gap-2">
              <InputField label="Rent" prefix="$" value={snapshot.opex.rent} onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { opex: { rent: v }})} />
              <InputField label="PIO" prefix="$" value={snapshot.opex.pio} onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { opex: { pio: v }})} />
              <InputField label="Energy" prefix="$" value={snapshot.opex.energy} onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { opex: { energy: v }})} />
              <InputField label="Gas" prefix="$" value={snapshot.opex.gas} onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { opex: { gas: v }})} />
              <InputField label="Internet" prefix="$" value={snapshot.opex.internet} onChange={(v) => handleUpdateMonthSnapshot(wh.id, monthKey, { opex: { internet: v }})} />
              <InputField label="Other" prefix="$" value={
                (snapshot.opex.trash || 0) + (snapshot.opex.security || 0) + (snapshot.opex.hvac || 0) +
                (snapshot.opex.repairs || 0) + (snapshot.opex.officeCleaning || 0) + (snapshot.opex.drinksSnacks || 0) +
                (snapshot.opex.cleaningSupplies || 0) + (snapshot.opex.toiletries || 0) + (snapshot.opex.officeSupplies || 0) +
                (snapshot.opex.equipmentReplacement || 0)
              } onChange={() => {}} />
            </div>

            {/* Custom OpEx */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Custom Expenses</span>
                <button
                  onClick={() => handleAddCustomOpex(wh.id, monthKey)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  + Add
                </button>
              </div>
              {(snapshot.customOpex || []).map(item => (
                <div key={item.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => handleUpdateCustomOpex(wh.id, monthKey, item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleUpdateCustomOpex(wh.id, monthKey, item.id, 'amount', parseFloat(e.target.value) || 0)}
                      onFocus={(e) => e.target.select()}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveCustomOpex(wh.id, monthKey, item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              Total OpEx: <span className="font-medium text-gray-900">{formatCurrency(pnl.standardOpex + pnl.customOpexTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Site Detail View
  const renderSiteDetail = (wh) => {
    const calc = calculations.warehouses[wh.id];
    const daysUntilLaunch = getDaysUntil(wh.goLiveDate);

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
            <div className="text-right">
              {wh.status === 'launching' && daysUntilLaunch !== null && (
                <div>
                  <div className="text-3xl font-bold text-blue-600">{daysUntilLaunch}</div>
                  <div className="text-sm text-gray-500">days until launch</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Sq Ft</div>
              <div className="text-lg font-semibold">{formatNumber(wh.sqft)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Bins</div>
              <div className="text-lg font-semibold">{formatNumber(wh.bins)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Ports</div>
              <div className="text-lg font-semibold">{wh.ports}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">Max Orders/Mo/Shift</div>
              <div className="text-lg font-semibold">{formatNumber(calc.maxOrdersPerMonthPerShift)}</div>
            </div>
          </div>
        </div>

        {/* CapEx Card */}
        <CollapsibleSection
          title="CapEx"
          defaultOpen={wh.status === 'launching'}
          rightContent={
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-bold">{formatCurrency(calc.totalCapex)}</div>
              </div>
              <div className="w-32">
                <div className="text-xs text-gray-500 mb-1">{calc.capexProgress.toFixed(0)}% Paid</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${calc.capexProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${calc.capexProgress}%` }}
                  />
                </div>
              </div>
            </div>
          }
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Phase 1 - Real Estate & Permits</h3>
              <div className="space-y-1 text-sm">
                {[
                  ['Security Deposit', 'securityDeposit'],
                  ['Fire Pre-Survey', 'firePreSurvey'],
                  ['PIO 50%', 'pio50_1'],
                  ['Install 50%', 'install50_1'],
                  ['Fire Permitting', 'firePermitting'],
                  ['Electrical Design', 'electricalDesign'],
                  ['Electrical Permit', 'electricalPermit'],
                  ['Seismic/Structural', 'seismic']
                ].map(([label, key]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">{formatCurrency(wh.capex[key] || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Phase 2 - Operational</h3>
              <div className="space-y-1 text-sm">
                {[
                  ['PIO 50%', 'pio50_2'],
                  ['Install 50%', 'install50_2'],
                  ['PIO Shipping', 'pioShipping'],
                  ['PIO Tariffs', 'pioTariffs'],
                  ['Autobagger', 'autobagger'],
                  ['Conveyors', 'conveyors'],
                  ['Equipment', 'warehouseEquipment']
                ].map(([label, key]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">{formatCurrency(wh.capex[key] || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom CapEx */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Additional CapEx</span>
              <button onClick={() => handleAddCustomCapex(wh.id)} className="text-sm text-blue-600 hover:text-blue-700">
                + Add Item
              </button>
            </div>
            {(wh.customCapex || []).map(item => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => handleUpdateCustomCapex(wh.id, item.id, 'name', e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleUpdateCustomCapex(wh.id, item.id, 'amount', parseFloat(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    className="w-24 px-2 py-1 border rounded text-sm"
                  />
                </div>
                <button onClick={() => handleRemoveCustomCapex(wh.id, item.id)} className="text-red-500 hover:text-red-700">×</button>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Monthly Progress (for Live warehouses) */}
        {wh.status === 'live' && (
          <>
            {renderMonthlyProgress(wh)}
            {selectedMonth && renderMonthDetail(wh, selectedMonth)}
          </>
        )}

        {/* Delete button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => handleDeleteWarehouse(wh.id)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
          >
            Delete Warehouse
          </button>
        </div>
      </div>
    );
  };

  // Overview
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Available Cash</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.portfolio.availableCash)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Monthly Burn</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(Math.max(0, calculations.portfolio.monthlyBurn))}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Runway</div>
          <div className={`text-2xl font-bold ${calculations.portfolio.runway > 18 ? 'text-green-600' : calculations.portfolio.runway > 12 ? 'text-yellow-600' : 'text-red-600'}`}>
            {calculations.portfolio.runway > 100 ? '100+' : calculations.portfolio.runway} months
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">CapEx Deployed</div>
          <div className="text-2xl font-bold">{formatCurrency(calculations.portfolio.totalCapexSpent)}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Warehouses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map(wh => {
            const calc = calculations.warehouses[wh.id];
            const daysUntilLaunch = getDaysUntil(wh.goLiveDate);

            return (
              <div
                key={wh.id}
                onClick={() => setSelectedView(wh.id)}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{wh.name}</h3>
                    <p className="text-sm text-gray-500">{wh.location || 'Location TBD'}</p>
                  </div>
                  <StatusBadge status={wh.status} />
                </div>

                {wh.status === 'live' && calc.latestPnL && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Latest</span>
                      <span className="font-medium">{calc.latestMonth ? getMonthLabel(calc.latestMonth) : '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Orders</span>
                      <span className="font-medium">{formatNumber(calc.latestPnL.orders)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Net</span>
                      <span className={`font-medium ${calc.latestPnL.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(calc.latestPnL.netMargin)}
                      </span>
                    </div>
                  </div>
                )}

                {wh.status === 'launching' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Launch</span>
                      <span className="font-medium text-blue-600">{daysUntilLaunch} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">CapEx</span>
                      <span className="font-medium">{calc.capexProgress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${calc.capexProgress}%` }} />
                    </div>
                  </div>
                )}

                {wh.status === 'planning' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Est. CapEx</span>
                      <span className="font-medium">{formatCurrency(calc.totalCapex)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Cash Position</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Cash on Hand"
            prefix="$"
            value={globalSettings.cash.onHand}
            onChange={(v) => setGlobalSettings({...globalSettings, cash: {...globalSettings.cash, onHand: v}})}
            step={100000}
          />
          <InputField
            label="VC Funding"
            prefix="$"
            value={globalSettings.cash.vcFunding}
            onChange={(v) => setGlobalSettings({...globalSettings, cash: {...globalSettings.cash, vcFunding: v}})}
            step={100000}
          />
        </div>
      </div>
    </div>
  );

  // Add Warehouse Modal
  const renderAddModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Add New Warehouse</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Warehouse Name" value={newWarehouse.name} onChange={(v) => setNewWarehouse({...newWarehouse, name: v})} type="text" />
            <InputField label="Location" value={newWarehouse.location} onChange={(v) => setNewWarehouse({...newWarehouse, location: v})} type="text" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Status</label>
              <select
                value={newWarehouse.status}
                onChange={(e) => setNewWarehouse({...newWarehouse, status: e.target.value})}
                className="w-full px-2 py-1.5 border rounded text-sm bg-white mt-1"
              >
                <option value="planning">Planning</option>
                <option value="launching">Launching</option>
                <option value="live">Live</option>
              </select>
            </div>
            <InputField label="Go-Live Date" value={newWarehouse.goLiveDate} onChange={(v) => setNewWarehouse({...newWarehouse, goLiveDate: v})} type="date" />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <InputField label="Sq Ft" value={newWarehouse.sqft} onChange={(v) => setNewWarehouse({...newWarehouse, sqft: v})} step={1000} />
            <InputField label="Bins" value={newWarehouse.bins} onChange={(v) => setNewWarehouse({...newWarehouse, bins: v})} step={1000} />
            <InputField label="Ports" value={newWarehouse.ports} onChange={(v) => setNewWarehouse({...newWarehouse, ports: v})} />
            <InputField label="Orders/Port/Hr" value={newWarehouse.ordersPerPortPerHour} onChange={(v) => setNewWarehouse({...newWarehouse, ordersPerPortPerHour: v})} step={25} />
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleAddWarehouse} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Warehouse</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-4 border-b border-gray-800">
          <h1 className="font-bold text-lg">Warehouse Dashboard</h1>
          <p className="text-gray-400 text-xs mt-1">Multi-site P&L Tracker</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Portfolio</div>
            <button
              onClick={() => { setSelectedView('overview'); setSelectedMonth(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedView === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Overview
            </button>
          </div>

          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Warehouses</div>
            <div className="space-y-1">
              {warehouses.map(wh => (
                <button
                  key={wh.id}
                  onClick={() => { setSelectedView(wh.id); setSelectedMonth(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    selectedView === wh.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{wh.name}</span>
                  <span className={`text-xs ${
                    wh.status === 'live' ? 'text-green-400' :
                    wh.status === 'launching' ? 'text-blue-400' : 'text-gray-500'
                  }`}>
                    {wh.status === 'live' ? '●' : wh.status === 'launching' ? '◐' : '○'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Warehouse
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-800">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Cash Runway</div>
          <div className="text-xl font-bold text-green-400">{formatCurrency(calculations.portfolio.availableCash)}</div>
          <div className="text-sm text-gray-400 mt-1">
            {calculations.portfolio.runway > 100 ? '100+' : calculations.portfolio.runway} months runway
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                calculations.portfolio.runway > 18 ? 'bg-green-500' :
                calculations.portfolio.runway > 12 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (calculations.portfolio.runway / 36) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {selectedView === 'overview' ? renderOverview() : selectedWarehouse && renderSiteDetail(selectedWarehouse)}
      </div>

      {showAddModal && renderAddModal()}
    </div>
  );
}

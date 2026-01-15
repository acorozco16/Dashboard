import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area } from 'recharts';

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

const sites = {
  chicago: { name: 'Chicago', sqft: 21000, bins: 10000, ports: 9, status: 'live' },
  dallas: { name: 'Dallas', sqft: 28760, bins: 13000, ports: 13, status: 'in_progress' },
  newjersey: { name: 'New Jersey', sqft: 24750, bins: 13000, ports: 13, status: 'planning' },
  losangeles: { name: 'Los Angeles', sqft: 34468, bins: 13000, ports: 13, status: 'planning' },
  phoenix: { name: 'Phoenix', sqft: 29099, bins: 13000, ports: 13, status: 'planning' }
};

const defaultCapex = {
  chicago: { phase1: 573558, phase2: 703316 },
  dallas: { phase1: 635547, phase2: 887246 },
  newjersey: { phase1: 691481, phase2: 887246 },
  losangeles: { phase1: 776700, phase2: 887246 },
  phoenix: { phase1: 651040, phase2: 887246 }
};

const defaultOpex = {
  chicago: { rent: 30510, pio: 19253, other: 2318 },
  dallas: { rent: 33949, pio: 29673, other: 2318 },
  newjersey: { rent: 52594, pio: 29673, other: 2318 },
  losangeles: { rent: 55149, pio: 29673, other: 2318 },
  phoenix: { rent: 39113, pio: 29673, other: 2318 }
};

export default function WarehouseDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Inputs
  const [rateCard, setRateCard] = useState({
    orderFee: 0.50,
    pickFee: 0.10,
    storagePerCuFtWeek: 0.39,
    returnFee: 3.00,
    inboundFee: 3.50
  });

  const [assumptions, setAssumptions] = useState({
    avgItemsPerOrder: 2,
    returnRate: 0.05,
    peakSurgeMultiplier: 2.0,
    variableCostPerOrder: 0.44,
    cuFtPerBin: 2.68,
    ordersPerPortPerHour: 125,
    teamLeadSalary: 5291,
    associateSalary: 3466
  });

  const [cash, setCash] = useState({
    onHand: 3000000,
    vcFunding: 5000000
  });

  const [customerMix, setCustomerMix] = useState({
    anchor: { count: 2, ordersPerMonth: 15000 },
    midTier: { count: 8, ordersPerMonth: 5000 },
    small: { count: 15, ordersPerMonth: 2000 }
  });

  const [labor, setLabor] = useState({
    chicago: { teamLeads: 1, associates: 3 },
    dallas: { teamLeads: 1, associates: 3 }
  });

  const [storageUtil, setStorageUtil] = useState(0.50);

  const [siteTimeline, setSiteTimeline] = useState({
    chicago: 1,
    dallas: 4,
    site3: 12,
    site4: 18,
    site5: 24
  });

  // Calculations
  const calculations = useMemo(() => {
    const revenuePerOrder = rateCard.orderFee + (rateCard.pickFee * assumptions.avgItemsPerOrder) + (rateCard.returnFee * assumptions.returnRate);
    const marginPerOrder = revenuePerOrder - assumptions.variableCostPerOrder;

    const siteCalcs = {};
    Object.keys(sites).forEach(key => {
      const site = sites[key];
      const capex = defaultCapex[key];
      const opex = defaultOpex[key];
      const laborData = labor[key] || { teamLeads: 1, associates: 3 };

      const totalCapex = capex.phase1 + capex.phase2;
      const totalStorage = site.bins * assumptions.cuFtPerBin;
      const storageRevenue = totalStorage * storageUtil * rateCard.storagePerCuFtWeek * 4.33;
      const laborCost = (laborData.teamLeads * assumptions.teamLeadSalary) + (laborData.associates * assumptions.associateSalary);
      const fixedOpex = opex.rent + opex.pio + opex.other + laborCost;
      const gapToCover = fixedOpex - storageRevenue;
      const breakEvenOrders = marginPerOrder > 0 ? Math.ceil(gapToCover / marginPerOrder) : 0;
      const maxOrdersPerHour = site.ports * assumptions.ordersPerPortPerHour;
      const maxOrdersPerDay = maxOrdersPerHour * 8;
      const maxOrdersPerMonth = maxOrdersPerDay * 22;
      const capacityUtilAtBE = breakEvenOrders / maxOrdersPerMonth;

      siteCalcs[key] = {
        totalCapex,
        totalStorage,
        storageRevenue,
        laborCost,
        fixedOpex,
        gapToCover,
        breakEvenOrders,
        maxOrdersPerHour,
        maxOrdersPerDay,
        maxOrdersPerMonth,
        capacityUtilAtBE
      };
    });

    // Customer scenario
    const totalCustomers = customerMix.anchor.count + customerMix.midTier.count + customerMix.small.count;
    const totalOrders = (customerMix.anchor.count * customerMix.anchor.ordersPerMonth) +
                       (customerMix.midTier.count * customerMix.midTier.ordersPerMonth) +
                       (customerMix.small.count * customerMix.small.ordersPerMonth);
    const orderRevenue = totalOrders * revenuePerOrder;
    const storageRev = siteCalcs.chicago.storageRevenue;
    const totalRevenue = orderRevenue + storageRev;
    const variableCosts = totalOrders * assumptions.variableCostPerOrder;
    const totalCosts = siteCalcs.chicago.fixedOpex + variableCosts;
    const monthlyPnL = totalRevenue - totalCosts;
    const monthsToPayback = monthlyPnL > 0 ? Math.ceil(siteCalcs.chicago.totalCapex / monthlyPnL) : null;

    return {
      revenuePerOrder,
      marginPerOrder,
      sites: siteCalcs,
      scenario: {
        totalCustomers,
        totalOrders,
        orderRevenue,
        storageRevenue: storageRev,
        totalRevenue,
        variableCosts,
        fixedCosts: siteCalcs.chicago.fixedOpex,
        totalCosts,
        monthlyPnL,
        monthsToPayback
      }
    };
  }, [rateCard, assumptions, customerMix, labor, storageUtil]);

  // Cash flow projection
  const cashFlowData = useMemo(() => {
    const data = [];
    let runningCash = cash.onHand + cash.vcFunding;

    // Chicago capex already spent
    runningCash -= defaultCapex.chicago.phase1 + defaultCapex.chicago.phase2;
    // Dallas PIO 50% paid
    runningCash -= 300900;

    const chicagoOrderRamp = [0, 10000, 22000, 38000, 56000, 78000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000];
    const dallasOrderRamp = [0, 0, 0, 0, 15000, 35000, 55000, 80000, 100000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000];

    for (let month = 1; month <= 24; month++) {
      const chiOrders = chicagoOrderRamp[month - 1] || 100000;
      const dalOrders = dallasOrderRamp[month - 1] || 0;

      const chiRevenue = (chiOrders * calculations.revenuePerOrder) + calculations.sites.chicago.storageRevenue;
      const dalRevenue = dalOrders > 0 ? (dalOrders * calculations.revenuePerOrder) + calculations.sites.dallas.storageRevenue : 0;

      const chiCosts = calculations.sites.chicago.fixedOpex + (chiOrders * assumptions.variableCostPerOrder);
      const dalCosts = month >= siteTimeline.dallas ? calculations.sites.dallas.fixedOpex + (dalOrders * assumptions.variableCostPerOrder) : 0;

      let capexOutflow = 0;
      if (month === 2) capexOutflow = defaultCapex.dallas.phase1 - 300900; // Remaining Phase 1
      if (month === 4) capexOutflow = defaultCapex.dallas.phase2; // Phase 2 at launch

      const totalRevenue = chiRevenue + dalRevenue;
      const totalCosts = chiCosts + dalCosts;
      const netOperating = totalRevenue - totalCosts;
      const netCashFlow = netOperating - capexOutflow;

      runningCash += netCashFlow;

      data.push({
        month: `M${month}`,
        chiOrders,
        dalOrders,
        totalOrders: chiOrders + dalOrders,
        revenue: totalRevenue,
        costs: totalCosts,
        netOperating,
        capex: -capexOutflow,
        cashPosition: runningCash
      });
    }

    return data;
  }, [calculations, assumptions, cash, siteTimeline]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'cashflow', label: 'Cash Flow' },
    { id: 'expansion', label: 'Expansion' }
  ];

  const InputField = ({ label, value, onChange, prefix = '', suffix = '', step = 1, min = 0 }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full px-2 py-1 border rounded text-sm bg-blue-50 text-blue-700 font-medium"
        />
        {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );

  const StatCard = ({ title, value, subtitle, trend }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${trend === 'negative' ? 'text-red-600' : trend === 'positive' ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Warehouse P&L & Scenario Planner</h1>
          <p className="text-gray-500 text-sm">Multi-site 3PL financial model</p>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Capital" value={formatCurrency(cash.onHand + cash.vcFunding)} subtitle="Cash + VC" />
              <StatCard title="Chicago Break-Even" value={formatNumber(calculations.sites.chicago.breakEvenOrders)} subtitle="orders/month" />
              <StatCard title="Dallas Break-Even" value={formatNumber(calculations.sites.dallas.breakEvenOrders)} subtitle="orders/month" />
              <StatCard title="Margin/Order" value={`$${calculations.marginPerOrder.toFixed(2)}`} subtitle="after variable costs" />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Site Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Site</th>
                      <th className="text-right py-2 px-2">CapEx</th>
                      <th className="text-right py-2 px-2">Monthly OpEx</th>
                      <th className="text-right py-2 px-2">Break-Even</th>
                      <th className="text-right py-2 px-2">Max Capacity</th>
                      <th className="text-left py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sites).map(([key, site]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{site.name}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].totalCapex)}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].fixedOpex)}</td>
                        <td className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].breakEvenOrders)}</td>
                        <td className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].maxOrdersPerMonth)}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            site.status === 'live' ? 'bg-green-100 text-green-700' :
                            site.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {site.status === 'live' ? 'Live' : site.status === 'in_progress' ? 'Apr/May 2026' : 'Planning'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">24-Month Cash Position</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="cashPosition" fill="#10B981" fillOpacity={0.2} stroke="#10B981" strokeWidth={2} name="Cash Position" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Rate Card</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Order Fee" prefix="$" value={rateCard.orderFee} onChange={(v) => setRateCard({...rateCard, orderFee: v})} step={0.05} />
                <InputField label="Pick Fee (per item)" prefix="$" value={rateCard.pickFee} onChange={(v) => setRateCard({...rateCard, pickFee: v})} step={0.05} />
                <InputField label="Storage (per cu ft/week)" prefix="$" value={rateCard.storagePerCuFtWeek} onChange={(v) => setRateCard({...rateCard, storagePerCuFtWeek: v})} step={0.01} />
                <InputField label="Return Fee" prefix="$" value={rateCard.returnFee} onChange={(v) => setRateCard({...rateCard, returnFee: v})} step={0.25} />
                <InputField label="Inbound Fee (per carton)" prefix="$" value={rateCard.inboundFee} onChange={(v) => setRateCard({...rateCard, inboundFee: v})} step={0.25} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Order Assumptions</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Avg Items per Order" value={assumptions.avgItemsPerOrder} onChange={(v) => setAssumptions({...assumptions, avgItemsPerOrder: v})} step={0.5} />
                <InputField label="Return Rate" suffix="%" value={assumptions.returnRate * 100} onChange={(v) => setAssumptions({...assumptions, returnRate: v / 100})} step={1} />
                <InputField label="Variable Cost per Order" prefix="$" value={assumptions.variableCostPerOrder} onChange={(v) => setAssumptions({...assumptions, variableCostPerOrder: v})} step={0.01} />
                <InputField label="Peak Surge Multiplier" suffix="x" value={assumptions.peakSurgeMultiplier} onChange={(v) => setAssumptions({...assumptions, peakSurgeMultiplier: v})} step={0.25} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Labor Costs</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Team Lead (monthly)" prefix="$" value={assumptions.teamLeadSalary} onChange={(v) => setAssumptions({...assumptions, teamLeadSalary: v})} step={100} />
                <InputField label="Associate (monthly)" prefix="$" value={assumptions.associateSalary} onChange={(v) => setAssumptions({...assumptions, associateSalary: v})} step={100} />
              </div>
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Chicago Labor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Team Leads" value={labor.chicago?.teamLeads || 1} onChange={(v) => setLabor({...labor, chicago: {...labor.chicago, teamLeads: v}})} />
                  <InputField label="Associates" value={labor.chicago?.associates || 3} onChange={(v) => setLabor({...labor, chicago: {...labor.chicago, associates: v}})} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Cash Position</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Cash on Hand" prefix="$" value={cash.onHand} onChange={(v) => setCash({...cash, onHand: v})} step={100000} />
                <InputField label="VC Funding (Incoming)" prefix="$" value={cash.vcFunding} onChange={(v) => setCash({...cash, vcFunding: v})} step={100000} />
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <div className="text-sm text-green-600">Total Capital</div>
                <div className="text-xl font-bold text-green-700">{formatCurrency(cash.onHand + cash.vcFunding)}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
              <h3 className="font-semibold mb-4">Calculated Unit Economics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Revenue per Order</div>
                  <div className="text-lg font-bold">${calculations.revenuePerOrder.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Variable Cost per Order</div>
                  <div className="text-lg font-bold">${assumptions.variableCostPerOrder.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Margin per Order</div>
                  <div className="text-lg font-bold text-green-600">${calculations.marginPerOrder.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Storage Rev (50% util)</div>
                  <div className="text-lg font-bold">{formatCurrency(calculations.sites.chicago.storageRevenue)}/mo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capacity' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Storage Utilization</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={storageUtil * 100}
                    onChange={(e) => setStorageUtil(e.target.value / 100)}
                    className="w-32"
                  />
                  <span className="text-sm font-medium w-12">{(storageUtil * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-2">Metric</th>
                      {Object.values(sites).map(site => (
                        <th key={site.name} className="text-right py-2 px-2">{site.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-2">Ports</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{sites[key].ports}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Bins</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(sites[key].bins)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Storage (cu ft)</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(Math.round(calculations.sites[key].totalStorage))}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Max Orders/Hour</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].maxOrdersPerHour)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Max Orders/Day (8hr)</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].maxOrdersPerDay)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Max Orders/Month</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].maxOrdersPerMonth)}</td>
                      ))}
                    </tr>
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-2 font-medium">Storage Revenue</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right font-medium">{formatCurrency(calculations.sites[key].storageRevenue)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Fixed + Labor OpEx</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].fixedOpex)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Gap to Cover</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].gapToCover)}</td>
                      ))}
                    </tr>
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-2 font-bold">Break-Even Orders/Month</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right font-bold text-green-700">{formatNumber(calculations.sites[key].breakEvenOrders)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-2">Break-Even Orders/Day</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{formatNumber(Math.ceil(calculations.sites[key].breakEvenOrders / 22))}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-2">Capacity Util at BE</td>
                      {Object.keys(sites).map(key => (
                        <td key={key} className="py-2 px-2 text-right">{(calculations.sites[key].capacityUtilAtBE * 100).toFixed(1)}%</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-4">Customer Mix (Chicago)</h3>

                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium text-gray-700 mb-2">Anchor Customers (Large)</div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField label="# of Customers" value={customerMix.anchor.count} onChange={(v) => setCustomerMix({...customerMix, anchor: {...customerMix.anchor, count: v}})} />
                      <InputField label="Orders/Month Each" value={customerMix.anchor.ordersPerMonth} onChange={(v) => setCustomerMix({...customerMix, anchor: {...customerMix.anchor, ordersPerMonth: v}})} step={1000} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Subtotal: {formatNumber(customerMix.anchor.count * customerMix.anchor.ordersPerMonth)} orders/mo</div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium text-gray-700 mb-2">Mid-Tier Customers</div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField label="# of Customers" value={customerMix.midTier.count} onChange={(v) => setCustomerMix({...customerMix, midTier: {...customerMix.midTier, count: v}})} />
                      <InputField label="Orders/Month Each" value={customerMix.midTier.ordersPerMonth} onChange={(v) => setCustomerMix({...customerMix, midTier: {...customerMix.midTier, ordersPerMonth: v}})} step={500} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Subtotal: {formatNumber(customerMix.midTier.count * customerMix.midTier.ordersPerMonth)} orders/mo</div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium text-gray-700 mb-2">Small Customers</div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField label="# of Customers" value={customerMix.small.count} onChange={(v) => setCustomerMix({...customerMix, small: {...customerMix.small, count: v}})} />
                      <InputField label="Orders/Month Each" value={customerMix.small.ordersPerMonth} onChange={(v) => setCustomerMix({...customerMix, small: {...customerMix.small, ordersPerMonth: v}})} step={250} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Subtotal: {formatNumber(customerMix.small.count * customerMix.small.ordersPerMonth)} orders/mo</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Customers:</span>
                    <span className="font-bold">{calculations.scenario.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Orders/Month:</span>
                    <span className="font-bold">{formatNumber(calculations.scenario.totalOrders)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-4">Monthly P&L Projection</h3>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Order Revenue</span>
                    <span className="font-medium">{formatCurrency(calculations.scenario.orderRevenue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Storage Revenue ({(storageUtil*100).toFixed(0)}% util)</span>
                    <span className="font-medium">{formatCurrency(calculations.scenario.storageRevenue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b bg-blue-50 px-2 -mx-2">
                    <span className="font-medium">Total Revenue</span>
                    <span className="font-bold">{formatCurrency(calculations.scenario.totalRevenue)}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Fixed + Labor Costs</span>
                    <span className="font-medium text-red-600">({formatCurrency(calculations.scenario.fixedCosts)})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Variable Costs</span>
                    <span className="font-medium text-red-600">({formatCurrency(calculations.scenario.variableCosts)})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b bg-red-50 px-2 -mx-2">
                    <span className="font-medium">Total Costs</span>
                    <span className="font-bold text-red-600">({formatCurrency(calculations.scenario.totalCosts)})</span>
                  </div>

                  <div className={`flex justify-between py-3 px-2 -mx-2 rounded ${calculations.scenario.monthlyPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className="font-bold">Monthly P&L</span>
                    <span className={`font-bold text-xl ${calculations.scenario.monthlyPnL >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {calculations.scenario.monthlyPnL >= 0 ? '' : '('}{formatCurrency(Math.abs(calculations.scenario.monthlyPnL))}{calculations.scenario.monthlyPnL >= 0 ? '' : ')'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">CapEx Payback (Chicago)</div>
                  <div className="text-lg font-bold">
                    {calculations.scenario.monthsToPayback
                      ? `${calculations.scenario.monthsToPayback} months`
                      : 'N/A - Not Profitable'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(calculations.sites.chicago.totalCapex)} ÷ {formatCurrency(calculations.scenario.monthlyPnL)}/mo
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Break-Even Comparison</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded">
                  <div className="text-3xl font-bold text-blue-600">{formatNumber(calculations.scenario.totalOrders)}</div>
                  <div className="text-sm text-gray-500">Your Scenario</div>
                </div>
                <div className="text-4xl text-gray-300 flex items-center justify-center">vs</div>
                <div className="p-4 border rounded">
                  <div className="text-3xl font-bold text-gray-600">{formatNumber(calculations.sites.chicago.breakEvenOrders)}</div>
                  <div className="text-sm text-gray-500">Break-Even</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500 mb-1">Progress to Break-Even</div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${calculations.scenario.totalOrders >= calculations.sites.chicago.breakEvenOrders ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (calculations.scenario.totalOrders / calculations.sites.chicago.breakEvenOrders) * 100)}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {((calculations.scenario.totalOrders / calculations.sites.chicago.breakEvenOrders) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">24-Month Order Ramp</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatNumber(v)} />
                  <Legend />
                  <Bar dataKey="chiOrders" name="Chicago" fill="#3B82F6" stackId="orders" />
                  <Bar dataKey="dalOrders" name="Dallas" fill="#10B981" stackId="orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Revenue vs Costs</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="costs" name="Costs" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Cash Position</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="netOperating" name="Net Operating" fill="#3B82F6" />
                  <Line type="monotone" dataKey="cashPosition" name="Cash Position" stroke="#10B981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Monthly Detail</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 px-1 text-left">Month</th>
                      <th className="py-2 px-1 text-right">Orders</th>
                      <th className="py-2 px-1 text-right">Revenue</th>
                      <th className="py-2 px-1 text-right">Costs</th>
                      <th className="py-2 px-1 text-right">Net</th>
                      <th className="py-2 px-1 text-right">Cash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlowData.slice(0, 12).map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-1 px-1">{row.month}</td>
                        <td className="py-1 px-1 text-right">{formatNumber(row.totalOrders)}</td>
                        <td className="py-1 px-1 text-right">{formatCurrency(row.revenue)}</td>
                        <td className="py-1 px-1 text-right text-red-600">{formatCurrency(row.costs)}</td>
                        <td className={`py-1 px-1 text-right font-medium ${row.netOperating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(row.netOperating)}
                        </td>
                        <td className="py-1 px-1 text-right font-medium">{formatCurrency(row.cashPosition)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expansion' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Site 3 Comparison: New Jersey vs Los Angeles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-3">New Jersey</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total CapEx:</span><span className="font-medium">{formatCurrency(calculations.sites.newjersey.totalCapex)}</span></div>
                    <div className="flex justify-between"><span>Monthly OpEx:</span><span className="font-medium">{formatCurrency(calculations.sites.newjersey.fixedOpex)}</span></div>
                    <div className="flex justify-between"><span>Rent:</span><span className="font-medium">{formatCurrency(defaultOpex.newjersey.rent)}</span></div>
                    <div className="flex justify-between"><span>Break-Even Orders:</span><span className="font-bold text-green-600">{formatNumber(calculations.sites.newjersey.breakEvenOrders)}</span></div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-3">Los Angeles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total CapEx:</span><span className="font-medium">{formatCurrency(calculations.sites.losangeles.totalCapex)}</span></div>
                    <div className="flex justify-between"><span>Monthly OpEx:</span><span className="font-medium">{formatCurrency(calculations.sites.losangeles.fixedOpex)}</span></div>
                    <div className="flex justify-between"><span>Rent:</span><span className="font-medium">{formatCurrency(defaultOpex.losangeles.rent)}</span></div>
                    <div className="flex justify-between"><span>Break-Even Orders:</span><span className="font-bold text-green-600">{formatNumber(calculations.sites.losangeles.breakEvenOrders)}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium">Recommendation</div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>New Jersey</strong> has lower CapEx ({formatCurrency(calculations.sites.newjersey.totalCapex - calculations.sites.losangeles.totalCapex)} less)
                  and lower monthly OpEx ({formatCurrency(calculations.sites.newjersey.fixedOpex - calculations.sites.losangeles.fixedOpex)} less),
                  resulting in a lower break-even threshold.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">All Sites Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 px-2 text-left">Site</th>
                      <th className="py-2 px-2 text-right">Sq Ft</th>
                      <th className="py-2 px-2 text-right">CapEx</th>
                      <th className="py-2 px-2 text-right">Monthly OpEx</th>
                      <th className="py-2 px-2 text-right">Break-Even</th>
                      <th className="py-2 px-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sites).map(([key, site]) => (
                      <tr key={key} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{site.name}</td>
                        <td className="py-2 px-2 text-right">{formatNumber(site.sqft)}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].totalCapex)}</td>
                        <td className="py-2 px-2 text-right">{formatCurrency(calculations.sites[key].fixedOpex)}</td>
                        <td className="py-2 px-2 text-right">{formatNumber(calculations.sites[key].breakEvenOrders)}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            site.status === 'live' ? 'bg-green-100 text-green-700' :
                            site.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {site.status === 'live' ? 'Live' : site.status === 'in_progress' ? 'In Progress' : 'Planning'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td className="py-2 px-2">TOTAL (All 5)</td>
                      <td className="py-2 px-2 text-right">{formatNumber(Object.values(sites).reduce((sum, s) => sum + s.sqft, 0))}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(Object.keys(sites).reduce((sum, k) => sum + calculations.sites[k].totalCapex, 0))}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(Object.keys(sites).reduce((sum, k) => sum + calculations.sites[k].fixedOpex, 0))}</td>
                      <td className="py-2 px-2 text-right">{formatNumber(Object.keys(sites).reduce((sum, k) => sum + calculations.sites[k].breakEvenOrders, 0))}</td>
                      <td className="py-2 px-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Expansion Capital Requirement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border rounded">
                  <div className="text-xs text-gray-500">Total Capital</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(cash.onHand + cash.vcFunding)}</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-xs text-gray-500">Chicago + Dallas (Committed)</div>
                  <div className="text-lg font-bold text-red-600">{formatCurrency(calculations.sites.chicago.totalCapex + calculations.sites.dallas.totalCapex)}</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-xs text-gray-500">Remaining for Expansion</div>
                  <div className="text-lg font-bold">{formatCurrency((cash.onHand + cash.vcFunding) - calculations.sites.chicago.totalCapex - calculations.sites.dallas.totalCapex)}</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-xs text-gray-500">Sites 3-5 CapEx Needed</div>
                  <div className="text-lg font-bold">{formatCurrency(calculations.sites.newjersey.totalCapex + calculations.sites.losangeles.totalCapex + calculations.sites.phoenix.totalCapex)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
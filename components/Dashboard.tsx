
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Transaction } from '../types';
import { CHART_COLORS } from '../constants';
import { getFinancialInsight } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [aiInsight, setAiInsight] = useState<string>("กำลังประมวลผลคำแนะนำจาก AI...");

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;
    return { income, expenses, net, savingsRate };
  }, [transactions]);

  const expenseBreakdown = useMemo(() => {
    const groups: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const barData = [
    { name: 'Jan', income: 10000, expenses: 8000 },
    { name: 'Feb', income: 11000, expenses: 9000 },
    { name: 'Mar', income: 12500, expenses: 8200 },
    { name: 'Apr', income: 11500, expenses: 7500 },
    { name: 'May', income: 12000, expenses: 9500 },
    { name: 'Jun', income: stats.income, expenses: stats.expenses },
  ];

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = `Income: ฿${stats.income}, Expenses: ฿${stats.expenses}, Net: ฿${stats.net}, Savings: ${stats.savingsRate}%`;
      const result = await getFinancialInsight(summary);
      setAiInsight(result || "พร้อมให้คำปรึกษาทางการเงินกับคุณเสมอ");
    };
    fetchInsight();
  }, [stats]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6 lg:gap-8">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="รายรับเดือนนี้ (Income)" value={`฿${stats.income.toLocaleString()}`} change="+5%" icon="account_balance_wallet" color="green" />
        <StatCard title="รายจ่ายเดือนนี้ (Expenses)" value={`฿${stats.expenses.toLocaleString()}`} change="+2%" icon="credit_card" color="orange" />
        <StatCard title="เงินคงเหลือสุทธิ (Net)" value={`฿${stats.net.toLocaleString()}`} change="+12%" icon="savings" color="blue" isHighlighted />
        <StatCard title="สัดส่วนออม (%)" value={`${stats.savingsRate}%`} change="+1%" icon="percent" color="purple" progress={stats.savingsRate} />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-card-light dark:bg-card-dark border border-primary/20 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Income vs Expenses</h3>
              <p className="text-text-sub-light dark:text-text-sub-dark text-sm">Yearly View • Last 6 Months</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="income" fill="#19e619" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-primary/20 shadow-sm flex flex-col">
          <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold mb-1">Expense Breakdown</h3>
          <p className="text-text-sub-light dark:text-text-sub-dark text-sm mb-6">By Category</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold">฿{(stats.expenses / 1000).toFixed(1)}k</span>
              <span className="text-xs text-text-sub-light">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {expenseBreakdown.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                  <span className="text-text-main-light dark:text-text-main-dark">{item.name}</span>
                </div>
                <span className="font-semibold">฿{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insight Card */}
      <section className="w-full">
        <div className="w-full rounded-xl border border-primary/20 bg-gradient-to-r from-background-light to-[#f0fdf4] dark:from-card-dark dark:to-green-950/20 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <span className="material-symbols-outlined absolute right-0 bottom-[-20px] text-[180px] text-primary/5 pointer-events-none rotate-12">health_and_safety</span>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10">
            <div className="relative size-20 flex-shrink-0">
               <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="3"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">85</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Financial Health Score</h3>
                <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs px-2 py-0.5 rounded-full font-bold">Very Good</span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0">smart_toy</span>
                <p className="text-text-main-light dark:text-text-main-dark text-base leading-relaxed">
                  <span className="font-semibold text-primary-dark dark:text-primary">AI Analyst:</span> {aiInsight}
                </p>
              </div>
            </div>
          </div>
          <button className="z-10 group flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-md hover:bg-green-500 transition-all w-full md:w-auto">
            View Full Analysis
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  icon: string; 
  color: string; 
  isHighlighted?: boolean;
  progress?: number;
}> = ({ title, value, change, icon, color, isHighlighted, progress }) => {
  const colorMap: any = {
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className={`p-6 rounded-xl bg-card-light dark:bg-card-dark border border-primary/20 shadow-sm flex flex-col gap-2 relative overflow-hidden group ${isHighlighted ? 'ring-1 ring-primary/30' : ''}`}>
      <div className="flex items-center justify-between z-10">
        <p className="text-text-sub-light dark:text-text-sub-dark text-sm font-medium">{title}</p>
        <div className={`p-1.5 rounded-md ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <p className="text-text-main-light dark:text-text-main-dark text-3xl font-bold tracking-tight z-10">{value}</p>
      <div className="flex items-center gap-1 z-10">
        <span className="material-symbols-outlined text-primary text-[16px]">trending_up</span>
        <p className="text-primary text-sm font-semibold">{change}</p>
        <span className="text-text-sub-light/60 dark:text-text-sub-dark/60 text-xs ml-1">vs last month</span>
      </div>
      {progress !== undefined && (
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
    </div>
  );
};

export default Dashboard;

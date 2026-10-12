import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Receipt,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Tags,
  BarChart3,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  FolderOpen
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  type: 'income' | 'expense';
  amount: number;
  transactionDate: string;
  description: string;
}

export interface Category {
  id: number;
  userId: number | null; // null for system defaults
  name: string;
  type: 'income' | 'expense';
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, userId: null, name: 'Salary', type: 'income' },
  { id: 2, userId: null, name: 'Freelance / Projects', type: 'income' },
  { id: 3, userId: null, name: 'Allowance / Stipend', type: 'income' },
  { id: 4, userId: null, name: 'Investments', type: 'income' },
  { id: 5, userId: null, name: 'Other Income', type: 'income' },
  { id: 6, userId: null, name: 'Food & Dining', type: 'expense' },
  { id: 7, userId: null, name: 'Transportation', type: 'expense' },
  { id: 8, userId: null, name: 'Shopping', type: 'expense' },
  { id: 9, userId: null, name: 'Education & Books', type: 'expense' },
  { id: 10, userId: null, name: 'Entertainment', type: 'expense' },
  { id: 11, userId: null, name: 'Bills & Utilities', type: 'expense' },
  { id: 12, userId: null, name: 'Healthcare', type: 'expense' },
  { id: 13, userId: null, name: 'Rent & Housing', type: 'expense' },
  { id: 14, userId: null, name: 'Other Expense', type: 'expense' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, userId: 1, categoryId: 1, type: 'income', amount: 3500.00, transactionDate: '2026-10-01', description: 'Monthly College Stipend' },
  { id: 2, userId: 1, categoryId: 2, type: 'income', amount: 850.00, transactionDate: '2026-10-04', description: 'Frontend Web Design Project' },
  { id: 3, userId: 1, categoryId: 6, type: 'expense', amount: 420.00, transactionDate: '2026-10-03', description: 'Monthly Mess & Groceries' },
  { id: 4, userId: 1, categoryId: 7, type: 'expense', amount: 185.00, transactionDate: '2026-10-05', description: 'Metro Pass Recharge' },
  { id: 5, userId: 1, categoryId: 9, type: 'expense', amount: 120.00, transactionDate: '2026-10-06', description: 'DBMS & Cloud Computing Textbooks' },
  { id: 6, userId: 1, categoryId: 11, type: 'expense', amount: 145.00, transactionDate: '2026-10-08', description: 'Broadband Internet & Mobile' },
  { id: 7, userId: 1, categoryId: 10, type: 'expense', amount: 95.00, transactionDate: '2026-10-10', description: 'Weekend Cinema with Friends' },
  { id: 8, userId: 1, categoryId: 8, type: 'expense', amount: 210.00, transactionDate: '2026-09-18', description: 'Semester Stationery & Supplies' },
  { id: 9, userId: 1, categoryId: 1, type: 'income', amount: 3500.00, transactionDate: '2026-09-01', description: 'September Stipend' },
  { id: 10, userId: 1, categoryId: 6, type: 'expense', amount: 390.00, transactionDate: '2026-09-12', description: 'Cafeteria & Dining' },
  { id: 11, userId: 1, categoryId: 7, type: 'expense', amount: 160.00, transactionDate: '2026-09-20', description: 'Local Transit' },
];

export const LiveAppDemo: React.FC = () => {
  // Navigation tabs inside simulator
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'categories' | 'reports' | 'profile'>('dashboard');

  // Stored state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pet_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pet_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Rahul Sharma',
    email: 'student@college.edu',
  });

  // Selected date filter
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Flash alert
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'info'; text: string } | null>({
    type: 'info',
    text: 'Simulator running with live SQLite/PDO-equivalent state in your browser! Any edits here are persisted.'
  });

  // Modal states for Add/Edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form states
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formCategoryId, setFormCategoryId] = useState<number>(6);
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('2026-10-12');
  const [formDescription, setFormDescription] = useState<string>('');

  // Transactions ledger filter states
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('');
  const [ledgerCategoryFilter, setLedgerCategoryFilter] = useState<string>('');
  const [ledgerStartDate, setLedgerStartDate] = useState<string>('');
  const [ledgerEndDate, setLedgerEndDate] = useState<string>('');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [ledgerPage, setLedgerPage] = useState<number>(1);
  const PAGE_SIZE = 8;

  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'income' | 'expense'>('expense');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pet_categories', JSON.stringify(categories));
  }, [categories]);

  // Flash alert auto-dismiss
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Category map helper
  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);

  // Filtered categories according to selected form type
  const availableFormCategories = useMemo(() => {
    return categories.filter(c => c.type === formType);
  }, [categories, formType]);

  // Keep formCategoryId synchronized if user toggles type
  useEffect(() => {
    if (availableFormCategories.length > 0) {
      const currentValid = availableFormCategories.some(c => c.id === formCategoryId);
      if (!currentValid) {
        setFormCategoryId(availableFormCategories[0].id);
      }
    }
  }, [formType, availableFormCategories, formCategoryId]);

  // Monthly summary calculations
  const monthlySummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    let count = 0;

    transactions.forEach(t => {
      const d = new Date(t.transactionDate);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();

      if (m === selectedMonth && y === selectedYear) {
        count++;
        if (t.type === 'income') {
          income += t.amount;
        } else {
          expense += t.amount;
        }
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      count
    };
  }, [transactions, selectedMonth, selectedYear]);

  // 6-Month Trend Data for Bar Chart
  const trendChartData = useMemo(() => {
    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(selectedYear, selectedMonth - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      labels.push(monthLabel);

      let mInc = 0;
      let mExp = 0;
      transactions.forEach(t => {
        const td = new Date(t.transactionDate);
        if (td.getMonth() + 1 === m && td.getFullYear() === y) {
          if (t.type === 'income') mInc += t.amount;
          else mExp += t.amount;
        }
      });

      incomeData.push(mInc);
      expenseData.push(mExp);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#10b981',
          borderRadius: 6,
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: '#ef4444',
          borderRadius: 6,
        }
      ]
    };
  }, [transactions, selectedMonth, selectedYear]);

  // Category Doughnut Data
  const categoryChartData = useMemo(() => {
    const catTotals: Record<string, number> = {};

    transactions.forEach(t => {
      const d = new Date(t.transactionDate);
      if (t.type === 'expense' && d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear) {
        const catName = categoryMap.get(t.categoryId)?.name || 'Other';
        catTotals[catName] = (catTotals[catName] || 0) + t.amount;
      }
    });

    const labels = Object.keys(catTotals);
    const data = Object.values(catTotals);

    return {
      labels,
      data,
      hasData: data.length > 0
    };
  }, [transactions, selectedMonth, selectedYear, categoryMap]);

  // Ledger Filtered Transactions
  const filteredLedgerTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (ledgerTypeFilter && t.type !== ledgerTypeFilter) return false;
      if (ledgerCategoryFilter && t.categoryId !== Number(ledgerCategoryFilter)) return false;
      if (ledgerStartDate && t.transactionDate < ledgerStartDate) return false;
      if (ledgerEndDate && t.transactionDate > ledgerEndDate) return false;
      if (ledgerSearch && !t.description.toLowerCase().includes(ledgerSearch.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [transactions, ledgerTypeFilter, ledgerCategoryFilter, ledgerStartDate, ledgerEndDate, ledgerSearch]);

  const paginatedTransactions = useMemo(() => {
    const start = (ledgerPage - 1) * PAGE_SIZE;
    return filteredLedgerTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredLedgerTransactions, ledgerPage]);

  const totalPages = Math.ceil(filteredLedgerTransactions.length / PAGE_SIZE) || 1;

  // Handlers
  const handleOpenAdd = (type?: 'income' | 'expense') => {
    setEditingTransaction(null);
    setFormType(type || 'expense');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setFormType(t.type);
    setFormCategoryId(t.categoryId);
    setFormAmount(t.amount.toString());
    setFormDate(t.transactionDate);
    setFormDescription(t.description);
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAlert({ type: 'danger', text: 'Please enter a valid amount greater than $0.00' });
      return;
    }
    if (!formDescription.trim()) {
      setAlert({ type: 'danger', text: 'Description cannot be empty.' });
      return;
    }

    if (editingTransaction) {
      setTransactions(prev => prev.map(item => item.id === editingTransaction.id ? {
        ...item,
        type: formType,
        categoryId: formCategoryId,
        amount: parsedAmount,
        transactionDate: formDate,
        description: formDescription.trim(),
      } : item));
      setAlert({ type: 'success', text: `Transaction #${editingTransaction.id} successfully updated.` });
    } else {
      const newTx: Transaction = {
        id: Date.now(),
        userId: 1,
        type: formType,
        categoryId: formCategoryId,
        amount: parsedAmount,
        transactionDate: formDate,
        description: formDescription.trim(),
      };
      setTransactions(prev => [newTx, ...prev]);
      setAlert({ type: 'success', text: `New ${formType} transaction of $${parsedAmount.toFixed(2)} recorded!` });
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setAlert({ type: 'success', text: 'Transaction was deleted.' });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const exists = categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase() && c.type === newCatType);
    if (exists) {
      setAlert({ type: 'danger', text: `Category "${newCatName}" already exists for ${newCatType}!` });
      return;
    }

    const newCat: Category = {
      id: Date.now(),
      userId: 1,
      name: newCatName.trim(),
      type: newCatType
    };

    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    setAlert({ type: 'success', text: `Custom category "${newCat.name}" added successfully.` });
  };

  const handleDeleteCategory = (catId: number, name: string) => {
    const isUsed = transactions.some(t => t.categoryId === catId);
    if (isUsed) {
      setAlert({ type: 'danger', text: `Cannot delete "${name}" because it is currently linked to existing transactions.` });
      return;
    }
    if (window.confirm(`Delete custom category "${name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== catId));
      setAlert({ type: 'success', text: `Category "${name}" removed.` });
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Date', 'Type', 'Category', 'Amount ($)', 'Description']
    ];

    filteredLedgerTransactions.forEach(t => {
      rows.push([
        t.id.toString(),
        t.transactionDate,
        t.type.toUpperCase(),
        categoryMap.get(t.categoryId)?.name || 'Unknown',
        t.amount.toFixed(2),
        `"${t.description.replace(/"/g, '""')}"`
      ]);
    });

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_export_${selectedYear}_${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setAlert({ type: 'success', text: 'CSV ledger file downloaded successfully.' });
  };

  const resetToSampleData = () => {
    if (window.confirm('Reset all transactions and categories to default college sample data?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setCategories(DEFAULT_CATEGORIES);
      localStorage.removeItem('pet_transactions');
      localStorage.removeItem('pet_categories');
      setAlert({ type: 'info', text: 'Simulator data reset to original seed data.' });
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col md:flex-row">
      {/* Dark Navy Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">ExpenseTracker</div>
              <div className="text-xs text-slate-400">Personal Finance v1.0</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 px-3 py-1 tracking-wider">
            Core Modules
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports & Analytics</span>
          </button>

          <div className="text-[10px] uppercase font-semibold text-slate-400 px-3 pt-4 pb-1 tracking-wider">
            Account & Security
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>User Profile</span>
          </button>
        </nav>

        {/* Mini project badge */}
        <div className="p-3 m-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
            <span>PHP & MySQL Applet</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-slate-400 text-[11px] leading-tight mb-2">
            Simulates the exact PDO, session auth, and DB logic on port 3000.
          </p>
          <button
            onClick={resetToSampleData}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 text-[11px] font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset Seed Data
          </button>
        </div>
      </aside>

      {/* Main App Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' && 'Financial Overview'}
              {activeTab === 'transactions' && 'Transactions Ledger'}
              {activeTab === 'categories' && 'Expense & Income Categories'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'profile' && 'User Profile & Security'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-right">
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{userProfile.name}</div>
                <div className="text-[11px] text-slate-500">{userProfile.email}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {userProfile.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Global Alert Notification */}
        {alert && (
          <div className="mx-6 mt-4">
            <div
              className={`p-3 rounded-lg border text-sm flex items-center justify-between ${
                alert.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : alert.type === 'danger'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{alert.text}</span>
              </div>
              <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Date & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Monthly Snapshot</h2>
                  <p className="text-xs text-slate-500">
                    Displaying records for{' '}
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>
                        {new Date(2026, m - 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[2027, 2026, 2025, 2024].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleOpenAdd('income')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Income</span>
                  </button>

                  <button
                    onClick={() => handleOpenAdd('expense')}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Expense</span>
                  </button>
                </div>
              </div>

              {/* 4 Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">Total Income</div>
                    <div className="text-xl font-bold text-slate-900">${monthlySummary.income.toFixed(2)}</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Selected month total</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">Total Expenses</div>
                    <div className="text-xl font-bold text-slate-900">${monthlySummary.expense.toFixed(2)}</div>
                    <div className="text-[11px] text-rose-600 font-medium">Selected month outflows</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">Net Balance</div>
                    <div className={`text-xl font-bold ${monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                      ${monthlySummary.balance.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Income minus Expenses</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">Transactions</div>
                    <div className="text-xl font-bold text-slate-900">{monthlySummary.count} entries</div>
                    <div className="text-[11px] text-slate-500 font-medium">In selected month</div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Income vs Expense Trend</h3>
                      <p className="text-xs text-slate-500">Last 6 months cash flow breakdown</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                      Chart.js
                    </span>
                  </div>
                  <div className="h-64">
                    <Bar
                      data={trendChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' as const }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { callback: v => `$${v}` }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Expense by Category</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'short', year: 'numeric' })} breakdown
                      </p>
                    </div>
                  </div>
                  <div className="h-64 flex-1 flex items-center justify-center">
                    {categoryChartData.hasData ? (
                      <Doughnut
                        data={{
                          labels: categoryChartData.labels,
                          datasets: [{
                            data: categoryChartData.data,
                            backgroundColor: [
                              '#ef4444', '#f97316', '#f59e0b', '#10b981',
                              '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
                            ],
                            borderWidth: 2,
                            borderColor: '#ffffff',
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'bottom' as const }
                          }
                        }}
                      />
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No expense records found for this month.</p>
                        <button
                          onClick={() => handleOpenAdd('expense')}
                          className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                        >
                          + Record an expense
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions List */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
                    <p className="text-xs text-slate-500">Last 5 activity items across all dates</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 5).map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{t.transactionDate}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                t.type === 'income'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {t.type === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {categoryMap.get(t.categoryId)?.name || 'General'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{t.description}</td>
                          <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 mr-1"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Transactions Ledger</h2>
                  <p className="text-xs text-slate-500">
                    Filter, sort, search, and manage all your historical entries
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => handleOpenAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Search Description</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={ledgerSearch}
                        onChange={e => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
                        placeholder="Keyword..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Type</label>
                    <select
                      value={ledgerTypeFilter}
                      onChange={e => { setLedgerTypeFilter(e.target.value); setLedgerPage(1); }}
                      className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expense Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
                    <select
                      value={ledgerCategoryFilter}
                      onChange={e => { setLedgerCategoryFilter(e.target.value); setLedgerPage(1); }}
                      className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">From Date</label>
                    <input
                      type="date"
                      value={ledgerStartDate}
                      onChange={e => { setLedgerStartDate(e.target.value); setLedgerPage(1); }}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
                    <input
                      type="date"
                      value={ledgerEndDate}
                      onChange={e => { setLedgerEndDate(e.target.value); setLedgerPage(1); }}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Full Ledger Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm font-medium text-slate-600">No transactions match your filter criteria.</p>
                            <button
                              onClick={() => {
                                setLedgerSearch('');
                                setLedgerTypeFilter('');
                                setLedgerCategoryFilter('');
                                setLedgerStartDate('');
                                setLedgerEndDate('');
                              }}
                              className="text-xs text-blue-600 hover:underline mt-2 font-semibold"
                            >
                              Clear all filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        paginatedTransactions.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{t.transactionDate}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                  t.type === 'income'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                {t.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                                {categoryMap.get(t.categoryId)?.name || 'General'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">{t.description}</td>
                            <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEdit(t)}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 mr-1"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      Page <span className="font-bold text-slate-800">{ledgerPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span> ({filteredLedgerTransactions.length} total records)
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={ledgerPage <= 1}
                        onClick={() => setLedgerPage(p => p - 1)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-medium hover:bg-slate-100"
                      >
                        Previous
                      </button>
                      <button
                        disabled={ledgerPage >= totalPages}
                        onClick={() => setLedgerPage(p => p + 1)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-medium hover:bg-slate-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Add Custom Category</h3>
                <p className="text-xs text-slate-500 mb-4">Create your personalized income or expense tags</p>

                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      placeholder="e.g. Gym & Fitness, Tech Gadgets"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Type</label>
                    <select
                      value={newCatType}
                      onChange={e => setNewCatType(e.target.value as 'income' | 'expense')}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="expense">Expense Category (Money Out)</option>
                      <option value="income">Income Category (Money In)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expense Categories List */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <ArrowUpRight className="w-4 h-4 text-rose-500" /> Expense Categories
                    </span>
                    <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                      {categories.filter(c => c.type === 'expense').length}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {categories.filter(c => c.type === 'expense').map(c => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{c.name}</span>
                          {c.userId === null ? (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border">Default</span>
                          ) : (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">Custom</span>
                          )}
                        </div>
                        {c.userId !== null && (
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Income Categories List */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> Income Categories
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      {categories.filter(c => c.type === 'income').length}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {categories.filter(c => c.type === 'income').map(c => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{c.name}</span>
                          {c.userId === null ? (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border">Default</span>
                          ) : (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">Custom</span>
                          )}
                        </div>
                        {c.userId !== null && (
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Analytics & Cash Flow Reports</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive performance for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Report</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Summary Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Monthly Income</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">${monthlySummary.income.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total inflows for cycle</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Monthly Expenses</div>
                  <div className="text-2xl font-bold text-rose-600 mt-1">${monthlySummary.expense.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total disbursements</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Net Monthly Savings</div>
                  <div className={`text-2xl font-bold mt-1 ${monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    ${monthlySummary.balance.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Savings Rate: {monthlySummary.income > 0 ? `${((monthlySummary.balance / monthlySummary.income) * 100).toFixed(1)}%` : '0%'}
                  </div>
                </div>
              </div>

              {/* Annual 12-Month Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Full Annual Flow ({selectedYear})</h3>
                    <p className="text-xs text-slate-500">12-Month aggregate income vs expenses</p>
                  </div>
                </div>
                <div className="h-72">
                  <Bar
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                      datasets: [
                        {
                          label: 'Income',
                          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                            return transactions
                              .filter(t => t.type === 'income' && new Date(t.transactionDate).getMonth() + 1 === m && new Date(t.transactionDate).getFullYear() === selectedYear)
                              .reduce((acc, curr) => acc + curr.amount, 0);
                          }),
                          backgroundColor: '#10b981',
                          borderRadius: 4,
                        },
                        {
                          label: 'Expense',
                          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                            return transactions
                              .filter(t => t.type === 'expense' && new Date(t.transactionDate).getMonth() + 1 === m && new Date(t.transactionDate).getFullYear() === selectedYear)
                              .reduce((acc, curr) => acc + curr.amount, 0);
                          }),
                          backgroundColor: '#ef4444',
                          borderRadius: 4,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { callback: v => `$${v}` }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">User Profile</h3>
                <p className="text-xs text-slate-500 mb-6">Manage your account information and demonstration settings</p>

                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm">
                    {userProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{userProfile.name}</h4>
                    <p className="text-xs text-slate-500">{userProfile.email}</p>
                    <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                      Role: Student Account &middot; College Project
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setAlert({ type: 'success', text: 'Profile name successfully saved.' });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={userProfile.email}
                      className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">Password & Security</h3>
                <p className="text-xs text-slate-500 mb-4">Emulates PHP bcrypt password hashing and verification</p>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-4">
                  Default viva demo password in MySQL: <code className="font-mono font-bold">password123</code>.
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAlert({ type: 'success', text: 'Password hash successfully verified and updated.' })}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Add or Edit Transaction */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTransaction ? `Edit Transaction #${editingTransaction.id}` : 'Record New Transaction'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('expense')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                      formType === 'expense'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Expense (Out)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('income')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                      formType === 'income'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Income (In)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={formCategoryId}
                  onChange={e => setFormCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {availableFormCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="e.g. Hostel Mess, Books, Freelance"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium text-white shadow-xs transition-colors"
                >
                  {editingTransaction ? 'Save Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Wallet,
  Receipt,
  PlusCircle,
  Tags,
  BarChart3,
  User,
  LogOut,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  ChevronDown,
  Lock,
  Mail,
  ShieldCheck,
  FileSpreadsheet,
  FolderDown
} from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES } from './data/projectFiles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  type: 'income' | 'expense';
  amount: number;
  transactionDate: string;
  description: string;
}

interface Category {
  id: number;
  userId: number | null;
  name: string;
  type: 'income' | 'expense';
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, userId: null, name: 'Salary', type: 'income' },
  { id: 2, userId: null, name: 'Freelance & Projects', type: 'income' },
  { id: 3, userId: null, name: 'Allowance & Stipend', type: 'income' },
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
  { id: 1, userId: 1, categoryId: 1, type: 'income', amount: 3500.00, transactionDate: '2026-10-01', description: 'Monthly Internship Stipend' },
  { id: 2, userId: 1, categoryId: 2, type: 'income', amount: 850.00, transactionDate: '2026-10-04', description: 'Frontend Web Development Freelance' },
  { id: 3, userId: 1, categoryId: 6, type: 'expense', amount: 420.00, transactionDate: '2026-10-03', description: 'Hostel Mess & Groceries' },
  { id: 4, userId: 1, categoryId: 7, type: 'expense', amount: 185.00, transactionDate: '2026-10-05', description: 'Metro Pass Recharge' },
  { id: 5, userId: 1, categoryId: 9, type: 'expense', amount: 120.00, transactionDate: '2026-10-06', description: 'Database & Cloud Computing Textbooks' },
  { id: 6, userId: 1, categoryId: 11, type: 'expense', amount: 145.00, transactionDate: '2026-10-08', description: 'Broadband Internet & Mobile' },
  { id: 7, userId: 1, categoryId: 10, type: 'expense', amount: 95.00, transactionDate: '2026-10-10', description: 'Weekend Cinema with Friends' },
  { id: 8, userId: 1, categoryId: 8, type: 'expense', amount: 210.00, transactionDate: '2026-09-18', description: 'Semester Stationery & Supplies' },
  { id: 9, userId: 1, categoryId: 1, type: 'income', amount: 3500.00, transactionDate: '2026-09-01', description: 'September Stipend' },
  { id: 10, userId: 1, categoryId: 6, type: 'expense', amount: 390.00, transactionDate: '2026-09-12', description: 'Cafeteria & Dining' },
  { id: 11, userId: 1, categoryId: 7, type: 'expense', amount: 160.00, transactionDate: '2026-09-20', description: 'Local Transit' },
];

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('student@college.edu');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'categories' | 'reports' | 'profile'>('dashboard');

  // Mobile sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // User menu dropdown in top bar
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  // Stored state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('app_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('app_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Rahul Sharma',
    email: 'student@college.edu',
  });

  // Selected date filter
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Feedback Toast alert
  const [toast, setToast] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Add/Edit Transaction Modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formCategoryId, setFormCategoryId] = useState<number>(6);
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('2026-10-12');
  const [formDescription, setFormDescription] = useState<string>('');

  // Transaction Ledger Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 8;

  // New Category form
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('app_categories', JSON.stringify(categories));
  }, [categories]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (type: 'success' | 'danger', text: string) => {
    setToast({ type, text });
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, Category>();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);

  const availableFormCategories = useMemo(() => {
    return categories.filter(c => c.type === formType);
  }, [categories, formType]);

  useEffect(() => {
    if (availableFormCategories.length > 0) {
      const currentValid = availableFormCategories.some(c => c.id === formCategoryId);
      if (!currentValid) {
        setFormCategoryId(availableFormCategories[0].id);
      }
    }
  }, [formType, availableFormCategories, formCategoryId]);

  // Monthly Calculations
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
      count,
    };
  }, [transactions, selectedMonth, selectedYear]);

  // 6-Month Bar Chart
  const trendChartData = useMemo(() => {
    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(selectedYear, selectedMonth - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      labels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }));

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
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#ef4444',
          borderRadius: 6,
        },
      ],
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
      hasData: data.length > 0,
    };
  }, [transactions, selectedMonth, selectedYear, categoryMap]);

  // Filtered Ledger Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterType && t.type !== filterType) return false;
        if (filterCategory && t.categoryId !== Number(filterCategory)) return false;
        if (filterStartDate && t.transactionDate < filterStartDate) return false;
        if (filterEndDate && t.transactionDate > filterEndDate) return false;
        if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [transactions, filterType, filterCategory, filterStartDate, filterEndDate, searchQuery]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;

  // Handlers
  const handleOpenAddModal = (type?: 'income' | 'expense') => {
    setEditingTransaction(null);
    setFormType(type || 'expense');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setFormType(t.type);
    setFormCategoryId(t.categoryId);
    setFormAmount(t.amount.toString());
    setFormDate(t.transactionDate);
    setFormDescription(t.description);
    setModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);

    if (isNaN(amountVal) || amountVal <= 0) {
      showToast('danger', 'Please enter a valid amount greater than $0.00');
      return;
    }

    if (!formDescription.trim()) {
      showToast('danger', 'Please enter a description for this transaction.');
      return;
    }

    if (editingTransaction) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === editingTransaction.id
            ? {
                ...t,
                type: formType,
                categoryId: formCategoryId,
                amount: amountVal,
                transactionDate: formDate,
                description: formDescription.trim(),
              }
            : t
        )
      );
      showToast('success', `Transaction #${editingTransaction.id} updated successfully.`);
    } else {
      const newTx: Transaction = {
        id: Date.now(),
        userId: currentUser.id,
        type: formType,
        categoryId: formCategoryId,
        amount: amountVal,
        transactionDate: formDate,
        description: formDescription.trim(),
      };
      setTransactions(prev => [newTx, ...prev]);
      showToast('success', `${formType === 'income' ? 'Income' : 'Expense'} of $${amountVal.toFixed(2)} recorded!`);
    }

    setModalOpen(false);
  };

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('success', 'Transaction was successfully deleted.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const exists = categories.some(
      c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase() && c.type === newCategoryType
    );
    if (exists) {
      showToast('danger', `Category "${newCategoryName}" already exists for ${newCategoryType}!`);
      return;
    }

    const newCat: Category = {
      id: Date.now(),
      userId: currentUser.id,
      name: newCategoryName.trim(),
      type: newCategoryType,
    };

    setCategories(prev => [...prev, newCat]);
    setNewCategoryName('');
    showToast('success', `Category "${newCat.name}" added successfully.`);
  };

  const handleDeleteCategory = (catId: number, name: string) => {
    const isUsed = transactions.some(t => t.categoryId === catId);
    if (isUsed) {
      showToast('danger', `Cannot delete "${name}" because it is currently linked to transactions.`);
      return;
    }

    if (window.confirm(`Delete custom category "${name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== catId));
      showToast('success', `Category "${name}" removed.`);
    }
  };

  const handleExportCSV = () => {
    const rows = [['ID', 'Date', 'Type', 'Category', 'Amount ($)', 'Description']];

    filteredTransactions.forEach(t => {
      rows.push([
        t.id.toString(),
        t.transactionDate,
        t.type.toUpperCase(),
        categoryMap.get(t.categoryId)?.name || 'General',
        t.amount.toFixed(2),
        `"${t.description.replace(/"/g, '""')}"`,
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
    showToast('success', 'CSV export file downloaded successfully.');
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('expense-tracker');

      PROJECT_FILES.forEach(file => {
        rootFolder?.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense-tracker.zip';
      link.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Full project ZIP downloaded for your XAMPP installation!');
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to generate ZIP archive.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('danger', 'Please enter email and password.');
      return;
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    showToast('success', `Welcome back, ${currentUser.name}!`);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      showToast('danger', 'Please fill in all registration fields.');
      return;
    }
    if (registerPassword.length < 6) {
      showToast('danger', 'Password must be at least 6 characters.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      showToast('danger', 'Password confirmation does not match.');
      return;
    }

    setCurrentUser({
      id: Date.now(),
      name: registerName,
      email: registerEmail,
    });
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    showToast('success', `Account created! Welcome, ${registerName}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserMenuOpen(false);
    setAuthView('login');
    showToast('success', 'You have been signed out.');
  };

  // -------------------------------------------------------------
  // RENDER: AUTH SCREENS (WHEN LOGGED OUT)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Expense Tracker</h1>
            <p className="text-xs text-slate-500 mt-1">
              {authView === 'login' ? 'Sign in to access your financial ledger' : 'Create an account to start tracking'}
            </p>
          </div>

          {toast && (
            <div
              className={`p-3 rounded-lg text-xs font-medium mb-4 flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
              <span>{toast.text}</span>
            </div>
          )}

          {authView === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs shadow-sm transition-colors mt-2"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginEmail('student@college.edu');
                  setLoginPassword('password123');
                  setIsAuthenticated(true);
                  setActiveTab('dashboard');
                  showToast('success', 'Logged in as Rahul Sharma');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg text-xs border border-slate-200 transition-colors"
              >
                Demo Sign In (Rahul Sharma)
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthView('register')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Create account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs shadow-sm transition-colors mt-2"
              >
                Register Now
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN APPLICATION (AUTHENTICATED)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Dark Navy Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">ExpenseTracker</div>
              <div className="text-xs text-slate-400">Personal Finance</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 px-3 py-1 tracking-wider">
            Main Menu
          </div>

          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
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
            onClick={() => { setActiveTab('transactions'); setSidebarOpen(false); }}
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
            onClick={() => { handleOpenAddModal(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
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
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
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
            Settings
          </div>

          <button
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 m-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'transactions' && 'Transactions Ledger'}
              {activeTab === 'categories' && 'Expense & Income Categories'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'profile' && 'User Profile & Security'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleOpenAddModal('income')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>
              <button
                onClick={() => handleOpenAddModal('expense')}
                className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{currentUser.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-800">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  </div>

                  <button
                    onClick={() => { setActiveTab('profile'); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { handleExportCSV(); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download CSV Ledger</span>
                  </button>

                  <button
                    onClick={() => { handleDownloadZip(); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-blue-600 font-semibold flex items-center gap-2 border-t border-slate-100"
                  >
                    <FolderDown className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export Project Source (.ZIP)</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toast && (
          <div className="mx-4 sm:mx-6 mt-4">
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between shadow-xs ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{toast.text}</span>
              </div>
              <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="p-4 sm:p-6 space-y-6 flex-1">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header row with Month/Year selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Monthly Overview</h2>
                  <p className="text-xs text-slate-500">
                    Showing finances for{' '}
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 outline-none"
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
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[2027, 2026, 2025, 2024].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400">Total Income</div>
                    <div className="text-xl font-extrabold text-slate-900">${monthlySummary.income.toFixed(2)}</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Monthly receipts</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400">Total Expenses</div>
                    <div className="text-xl font-extrabold text-slate-900">${monthlySummary.expense.toFixed(2)}</div>
                    <div className="text-[11px] text-rose-600 font-medium">Monthly outflows</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400">Net Balance</div>
                    <div className={`text-xl font-extrabold ${monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                      ${monthlySummary.balance.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Remaining funds</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400">Transactions</div>
                    <div className="text-xl font-extrabold text-slate-900">{monthlySummary.count}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Entries this month</div>
                  </div>
                </div>
              </div>

              {/* 2 Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Income vs Expense Trend</h3>
                      <p className="text-xs text-slate-500">6-Month historical cash flow</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <Bar
                      data={trendChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' as const } },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { callback: v => `$${v}` },
                          },
                        },
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
                          datasets: [
                            {
                              data: categoryChartData.data,
                              backgroundColor: [
                                '#ef4444', '#f97316', '#f59e0b', '#10b981',
                                '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
                              ],
                              borderWidth: 2,
                              borderColor: '#ffffff',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: 'bottom' as const } },
                        }}
                      />
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No expenses recorded for this month.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Transactions Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
                    <p className="text-xs text-slate-500">Latest activity records</p>
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
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200 font-medium">
                              {categoryMap.get(t.categoryId)?.name || 'General'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{t.description}</td>
                          <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditModal(t)}
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
            </div>
          )}

          {/* 2. TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Transactions Ledger</h2>
                  <p className="text-xs text-slate-500">Browse, filter, and export all recorded entries</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Transaction</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Search Description</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Keyword..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Type</label>
                    <select
                      value={filterType}
                      onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
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
                      value={filterCategory}
                      onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
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
                      value={filterStartDate}
                      onChange={e => { setFilterStartDate(e.target.value); setCurrentPage(1); }}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={e => { setFilterEndDate(e.target.value); setCurrentPage(1); }}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
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
                          <td colSpan={6} className="py-10 text-center text-slate-400">
                            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-semibold text-slate-600">No transactions match your search filter.</p>
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
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200 font-medium">
                                {categoryMap.get(t.categoryId)?.name || 'General'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">{t.description}</td>
                            <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditModal(t)}
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

                {totalPages > 1 && (
                  <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span> ({filteredTransactions.length} items)
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 disabled:opacity-40 font-medium hover:bg-slate-100"
                      >
                        Previous
                      </button>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
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

          {/* 3. CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Create Custom Category</h3>
                <p className="text-xs text-slate-500 mb-4">Add your own personalized spending tags</p>

                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Gym & Fitness, Tech Gadgets"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Type</label>
                    <select
                      value={newCategoryType}
                      onChange={e => setNewCategoryType(e.target.value as 'income' | 'expense')}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="expense">Expense (Outflow)</option>
                      <option value="income">Income (Inflow)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expense Categories */}
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
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Income Categories */}
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
                            title="Delete"
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

          {/* 4. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Financial Reports & Analytics</h2>
                  <p className="text-xs text-slate-500">
                    Performance metrics for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Report</span>
                </button>
              </div>

              {/* Metric Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase">Monthly Income</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">${monthlySummary.income.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total earnings in cycle</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase">Monthly Expenses</div>
                  <div className="text-2xl font-extrabold text-rose-600 mt-1">${monthlySummary.expense.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total outflows</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs font-bold text-slate-400 uppercase">Net Monthly Savings</div>
                  <div className={`text-2xl font-extrabold mt-1 ${monthlySummary.balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    ${monthlySummary.balance.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Savings Rate: {monthlySummary.income > 0 ? `${((monthlySummary.balance / monthlySummary.income) * 100).toFixed(1)}%` : '0%'}
                  </div>
                </div>
              </div>

              {/* Annual Bar Chart */}
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
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { callback: v => `$${v}` },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">Personal Profile</h3>
                <p className="text-xs text-slate-500 mb-6">Manage your account information and preferences</p>

                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{currentUser.name}</h4>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                      Active User Account
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    showToast('success', 'Profile information updated successfully.');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={currentUser.name}
                      onChange={e => setCurrentUser(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-1">Change Password</h3>
                <p className="text-xs text-slate-500 mb-4">Ensure your account remains safe and protected</p>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min. 6 chars)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => showToast('success', 'Password updated successfully!')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-xs transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTransaction ? `Edit Transaction #${editingTransaction.id}` : 'Record New Transaction'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
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
                    <span>Expense (Outflow)</span>
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
                    <span>Income (Inflow)</span>
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
                  placeholder="e.g. Monthly Grocery, Books, Freelance"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors"
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
}

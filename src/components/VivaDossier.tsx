import React, { useState } from 'react';
import { BookOpen, HelpCircle, Layers, CheckSquare, Search, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { VIVA_QUESTIONS, TEST_CASES, VivaQuestion } from '../data/vivaDossier';

export const VivaDossier: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'viva' | 'report' | 'architecture' | 'tests'>('viva');
  const [vivaSearch, setVivaSearch] = useState<string>('');
  const [vivaCategory, setVivaCategory] = useState<string>('All');
  const [expandedQId, setExpandedQId] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['All', 'PHP', 'MySQL', 'Security', 'Architecture', 'Frontend'];

  const filteredViva = VIVA_QUESTIONS.filter(q => {
    const matchesCat = vivaCategory === 'All' || q.category === vivaCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      q.answer.toLowerCase().includes(vivaSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyAnswer = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-slate-800">
      {/* Header */}
      <div>
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mb-2">
          Academic Dossier & Exam Preparation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Project Report & Viva Voce Master Center
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Complete project documentation, architecture diagrams, data flow models, testing tables, and 25 viva questions with answers.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('viva')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSection === 'viva'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>25 Viva Voce Q&A ({filteredViva.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('report')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSection === 'report'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Project Synopsis & Abstract</span>
        </button>

        <button
          onClick={() => setActiveSection('architecture')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSection === 'architecture'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture & DFD Diagrams</span>
        </button>

        <button
          onClick={() => setActiveSection('tests')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSection === 'tests'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Testing Checklist & Matrix</span>
        </button>
      </div>

      {/* SECTION 1: VIVA Q&A */}
      {activeSection === 'viva' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={vivaSearch}
                onChange={e => setVivaSearch(e.target.value)}
                placeholder="Search viva questions (e.g., PDO, CSRF, bcrypt, index)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setVivaCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    vivaCategory === cat
                      ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredViva.map(q => {
              const isExpanded = expandedQId === q.id;
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-50/70"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-xs font-semibold uppercase text-purple-600 block mb-0.5 tracking-wider">
                          {q.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{q.question}</h3>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                      <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
                        <strong className="text-slate-900 block mb-1">Examiner Answer:</strong>
                        {q.answer}
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => handleCopyAnswer(q.id, q.answer)}
                          className="text-[11px] text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                        >
                          {copiedId === q.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === q.id ? 'Copied Answer' : 'Copy Answer'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: PROJECT SYNOPSIS & REPORT */}
      {activeSection === 'report' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs leading-relaxed">
          <div>
            <h2 className="font-bold text-slate-900 text-base mb-2">1. Project Abstract</h2>
            <p className="text-slate-600">
              The <strong>Personal Expense Tracker</strong> is a full-stack web application developed to empower individuals to record, categorize, and monitor their daily financial transactions. Using native Core PHP, MySQL with PDO, Bootstrap 5, and Chart.js, the system offers an intuitive, responsive interface with session-based authentication, parameterized queries to prevent SQL Injection, CSRF token validation, dynamic monthly cash-flow trend analysis, and CSV export capabilities.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base mb-2">2. Problem Statement</h2>
            <p className="text-slate-600">
              Many students and professionals struggle to keep track of micro-spending across hostel messes, commute passes, books, utilities, and daily purchases. Traditional paper notebooks and complex accounting tools are either inconvenient or unintuitive. A dedicated, lightweight, and offline-compatible local web system solves this challenge by providing instant balance calculations and visual feedback.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base mb-2">3. Objectives</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Enable secure multi-user registration and authentication with Bcrypt hashing.</li>
              <li>Provide instant monthly calculation of Total Income, Total Expenses, and Net Balance from MySQL records.</li>
              <li>Facilitate comprehensive CRUD operations for transactions with validation guards.</li>
              <li>Segregate global default categories and user-defined custom categories.</li>
              <li>Deliver interactive visual analytics using Chart.js bar and doughnut charts.</li>
              <li>Enable one-click CSV export compatible with Microsoft Excel.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base mb-2">4. Existing System vs. Proposed System</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-200 p-2.5">Feature</th>
                    <th className="border border-slate-200 p-2.5">Existing (Manual / Excel)</th>
                    <th className="border border-slate-200 p-2.5 text-purple-700">Proposed Web Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border font-medium">Data Entry</td>
                    <td className="p-2 border text-slate-600">Manual cell formatting, prone to formula errors</td>
                    <td className="p-2 border text-slate-800">Validated HTML5 forms with backend PDO guards</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Security & Access</td>
                    <td className="p-2 border text-slate-600">Unencrypted spreadsheets on desktop</td>
                    <td className="p-2 border text-slate-800">Session auth, Bcrypt passwords, CSRF protection</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Visual Analytics</td>
                    <td className="p-2 border text-slate-600">Manual chart creation required</td>
                    <td className="p-2 border text-slate-800">Automated Chart.js dynamic bar & doughnut charts</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Portability</td>
                    <td className="p-2 border text-slate-600">Single device file dependency</td>
                    <td className="p-2 border text-slate-800">Browser-accessible across desktop, tablet, and mobile</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ARCHITECTURE & DFD */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base">3-Tier System Architecture</h2>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              {`+-------------------------------------------------------------+
|              CLIENT TIER (Presentation Layer)               |
|   HTML5 + CSS3 (Bootstrap 5) + JavaScript + Chart.js Canvas |
+-------------------------------------------------------------+
                              |  HTTP / HTTPS (GET/POST with CSRF)
                              v
+-------------------------------------------------------------+
|             APPLICATION TIER (Core PHP 8.x)                 |
|   Apache Web Server                                         |
|   * includes/auth.php      - Session Authentication Guard   |
|   * includes/csrf.php      - Anti-CSRF Validation           |
|   * actions/*.php          - Business Logic & Input Sanity  |
|   * config/database.php    - PDO Connection Singleton       |
+-------------------------------------------------------------+
                              |  PDO Prepared Statements (TCP 3306)
                              v
+-------------------------------------------------------------+
|              DATABASE TIER (MySQL / MariaDB)                |
|   Database: expense_tracker                                 |
|   * Table: users        - [id, name, email, password, ...]  |
|   * Table: categories   - [id, user_id, name, type]         |
|   * Table: transactions - [id, user_id, category_id, ...]   |
+-------------------------------------------------------------+`}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Data Flow Diagram (DFD Level 0 & Level 1)</h2>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              {`[ USER ]  ----( 1. Credentials )----> [ Auth Controller ] ----( Verify )----> [ users Table ]
   |                                            |
   |                                       ( Session ID )
   v                                            v
[ USER ]  ----( 2. Transaction Form )-> [ save-transaction.php ]
   |                                            |
   |                                 ( Validate & Sanitize )
   |                                            |
   |                                 ( INSERT via PDO )
   v                                            v
[ USER ]  <---( 3. Render Dashboard )-- [ transactions Table ] + [ categories Table ]
                ( Totals & Chart.js )`}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: TESTING MATRIX */}
      {activeSection === 'tests' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Software Testing Checklist & Results</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              12 / 12 Tests Passed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-200 p-2 text-center">Test ID</th>
                  <th className="border border-slate-200 p-2">Module</th>
                  <th className="border border-slate-200 p-2">Test Description</th>
                  <th className="border border-slate-200 p-2">Input Data</th>
                  <th className="border border-slate-200 p-2">Expected Outcome</th>
                  <th className="border border-slate-200 p-2 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEST_CASES.map(tc => (
                  <tr key={tc.id} className="hover:bg-slate-50">
                    <td className="p-2 border font-mono text-center font-bold text-slate-700">{tc.id}</td>
                    <td className="p-2 border font-semibold text-slate-900">{tc.module}</td>
                    <td className="p-2 border text-slate-800">{tc.description}</td>
                    <td className="p-2 border text-slate-600">{tc.input}</td>
                    <td className="p-2 border text-slate-700">{tc.expected}</td>
                    <td className="p-2 border text-center font-bold text-emerald-600 bg-emerald-50/50">
                      {tc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

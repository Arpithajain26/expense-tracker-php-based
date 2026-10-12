import React from 'react';
import { CheckCircle2, AlertTriangle, Terminal, Monitor, Database, ExternalLink, HelpCircle } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-slate-800">
      <div>
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-2">
          Step-by-Step Tutorial
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          How to Run Personal Expense Tracker on Windows with XAMPP
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Complete beginner-friendly instructions to set up Apache, MySQL, import the database in phpMyAdmin, and open the project in VS Code.
        </p>
      </div>

      {/* Prerequisites Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h2 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-600" /> System Prerequisites
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">Operating System</span>
            <span className="text-slate-600">Windows 10 or Windows 11 (64-bit)</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">Local Server</span>
            <span className="text-slate-600">XAMPP (PHP 8.0, 8.1, or 8.2)</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">Code Editor</span>
            <span className="text-slate-600">Visual Studio Code (or Notepad++)</span>
          </div>
        </div>
      </div>

      {/* 8 Setup Steps */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">Execution Steps</h2>

        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            1
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Download and Start XAMPP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you do not have XAMPP installed, download it from <a href="https://www.apachefriends.org" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">apachefriends.org</a>.
              Once installed, open <strong>XAMPP Control Panel</strong> from the Windows Start Menu. Click <strong>Start</strong> next to both <strong>Apache</strong> and <strong>MySQL</strong>. Both modules should turn green.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            2
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Extract Project into XAMPP htdocs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Navigate to your XAMPP installation folder (typically <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">C:\xampp\htdocs\</code>).
              Click the green <strong>"Download expense-tracker.zip"</strong> button in this app, then extract the downloaded ZIP folder into:
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-xs mt-2">
              C:\xampp\htdocs\expense-tracker\
            </div>
            <p className="text-[11px] text-slate-500">
              Inside <code className="font-mono">C:\xampp\htdocs\expense-tracker\</code>, you should immediately see <code className="font-mono">index.php</code>, <code className="font-mono">dashboard.php</code>, <code className="font-mono">config/</code>, and <code className="font-mono">database/</code>.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            3
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Create Database in phpMyAdmin</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open your browser and visit <a href="http://localhost/phpmyadmin/" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">http://localhost/phpmyadmin/</a>.
              Click the <strong>Databases</strong> tab at the top. In the "Create database" box, type <code className="bg-slate-100 px-1 rounded font-mono font-bold">expense_tracker</code> and click <strong>Create</strong>.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            4
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Import expense_tracker.sql</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click on the newly created <code className="font-bold">expense_tracker</code> database on the left sidebar.
              Click on the <strong>Import</strong> tab in the top navigation.
              Click <strong>Choose File</strong> (or Browse) and select:
            </p>
            <div className="bg-slate-100 text-slate-800 p-2 rounded-lg font-mono text-xs border border-slate-200">
              C:\xampp\htdocs\expense-tracker\database\expense_tracker.sql
            </div>
            <p className="text-xs text-slate-600">
              Scroll to the bottom and click the <strong>Import</strong> button. You should see a green success banner: <em>"Import has been successfully finished"</em>.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            5
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Launch Application in Browser</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open Google Chrome, Edge, or Firefox and go to:
            </p>
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg font-mono text-sm font-bold flex items-center justify-between">
              <span>http://localhost/expense-tracker/</span>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600">
              You will be greeted with the landing page and sign-in screen!
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
            6
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Demo Login Credentials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the pre-seeded demo user or register a brand new account:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div><strong>Email:</strong> <code className="font-mono text-blue-600">student@college.edu</code></div>
              <div><strong>Password:</strong> <code className="font-mono text-blue-600">password123</code></div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" /> Troubleshooting Common XAMPP / Windows Errors
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <span className="font-bold text-amber-900 block mb-0.5">1. MySQL fails to start (Port 3306 in use):</span>
            <p className="text-amber-800 leading-relaxed">
              Another MySQL instance (such as MySQL Workbench or MySQL80 service) is running on port 3306.
              Open Windows <strong>Services</strong> (<code className="font-mono">services.msc</code>), find <strong>MySQL80</strong>, right-click and click <strong>Stop</strong>, then restart MySQL in XAMPP.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-0.5">2. "Database Connection Failed" message:</span>
            <p className="text-slate-600 leading-relaxed">
              Check <code className="font-mono font-semibold">config/database.php</code>. By default, XAMPP root user has NO password (<code className="font-mono">DB_PASS = ''</code>). If you set a root password during setup, ensure you enter it there.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-0.5">3. 404 Not Found error on localhost:</span>
            <p className="text-slate-600 leading-relaxed">
              Verify that the folder name in <code className="font-mono">htdocs</code> matches exactly: <code className="font-mono">expense-tracker</code> (case-sensitive in some environments). Ensure there isn't an extra nested folder like <code className="font-mono">expense-tracker/expense-tracker/index.php</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

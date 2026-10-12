import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, Copy, Check, FileCode, Folder, Database, FileText, ChevronRight, File, ShieldCheck } from 'lucide-react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';

export const CodeExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('database/expense_tracker.sql');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>('');

  const selectedFile = PROJECT_FILES.find(f => f.path === selectedFilePath) || PROJECT_FILES[0];

  const handleCopyCode = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Root folder in zip: expense-tracker
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
    } catch (err) {
      console.error('Failed to create zip file:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const filteredFiles = PROJECT_FILES.filter(f =>
    f.path.toLowerCase().includes(filterSearch.toLowerCase()) ||
    f.name.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-6 flex flex-col space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Full Project Codebase &middot; 25 Files
            </span>
            <span className="text-slate-400 text-xs">Zero Placeholders</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Source Code Inspector & Exporter</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Inspect every single PHP, PDO, MySQL SQL script, CSS, JS, and configuration file. 
            Download the complete ready-to-run ZIP archive to extract directly into your XAMPP <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-300">htdocs</code> directory.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Packaging Project ZIP...' : 'Download expense-tracker.zip'}</span>
        </button>
      </div>

      {/* Main Dual-Pane Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Pane: File Tree */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Folder className="w-4 h-4 text-amber-400" />
              <span>htdocs / expense-tracker</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{PROJECT_FILES.length} files</span>
          </div>

          <input
            type="text"
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map(file => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.category === 'sql' && <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    {file.category === 'php' && <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    {file.category === 'css' && <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {file.category === 'js' && <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {file.category === 'docs' && <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span className="truncate">{file.path}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* File Toolbar */}
          <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-slate-400">Path:</span>
              <span className="text-emerald-400 font-bold">{selectedFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="p-4 max-h-[640px] overflow-auto font-mono text-xs leading-relaxed">
            <pre className="text-slate-300">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

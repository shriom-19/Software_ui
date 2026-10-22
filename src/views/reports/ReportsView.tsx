import React, { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Filter,
  Layers,
  FileSpreadsheet,
  PieChart,
  Calendar,
  CheckCircle2,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { CURRENT_ELECTION_CONTEXT, MOCK_BOOTHS } from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<'PREDEFINED' | 'CUSTOM'>('PREDEFINED');
  const [selectedPredefinedId, setSelectedPredefinedId] = useState('rep-1');

  // Custom Builder State
  const [dataset, setDataset] = useState('Voters Database');
  const [dimension, setDimension] = useState('Caste Composition');
  const [geography, setGeography] = useState('Prabhaag 12 - Kothrud West');
  const [format, setFormat] = useState<'ANALYTICAL_PDF' | 'RAW_CSV'>('ANALYTICAL_PDF');

  const predefinedReports = [
    {
      id: 'rep-1',
      title: 'Constituency Voter Demographics & Age Analysis',
      category: 'Demographics',
      desc: 'Age-wise, gender ratio, and demographic clusters across 8 assembly segments.',
      metrics: '21.54 L Records • 8 Wards',
      type: 'ANALYTICAL_PDF'
    },
    {
      id: 'rep-2',
      title: 'Booth Turnout Projection & Vulnerability Report',
      category: 'Operations',
      desc: 'Comparative model of 2019 turnout vs 2024 door-to-door survey estimates.',
      metrics: '2,045 Polling Booths',
      type: 'ANALYTICAL_PDF'
    },
    {
      id: 'rep-3',
      title: 'Voter Information Slip Distribution Audit',
      category: 'Field Cadre',
      desc: 'Comprehensive summary of digital WhatsApp dispatches and printed slips delivered.',
      metrics: '84.6% Current Progress',
      type: 'RAW_CSV'
    },
    {
      id: 'rep-4',
      title: 'Constituency Grievance Resolution Dossier',
      category: 'Office & Governance',
      desc: 'Departmental breakdown of public complaints resolved across water, roads, electricity.',
      metrics: '42 Tickets Logged',
      type: 'ANALYTICAL_PDF'
    }
  ];

  const handleExport = (title: string, type: string) => {
    showToast(`Generating ${type === 'RAW_CSV' ? 'Raw Data CSV' : 'Formatted Analytical PDF Dossier'} for "${title}".`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
              Analytical Reports
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Reports & Dossier Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access pre-calculated executive election briefs or assemble custom cross-tabulation datasets.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button
            onClick={() => setReportType('PREDEFINED')}
            className={`px-4 py-2 rounded-lg transition-all ${
              reportType === 'PREDEFINED' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Predefined Executive Reports
          </button>
          <button
            onClick={() => setReportType('CUSTOM')}
            className={`px-4 py-2 rounded-lg transition-all ${
              reportType === 'CUSTOM' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Custom Report Builder
          </button>
        </div>
      </div>

      {reportType === 'PREDEFINED' ? (
        <div className="space-y-6">
          {/* Predefined Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedPredefinedId(r.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPredefinedId === r.id
                    ? 'border-brand-600 bg-brand-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {r.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    r.type === 'ANALYTICAL_PDF' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {r.type === 'ANALYTICAL_PDF' ? 'Formatted Analytical PDF' : 'Raw CSV Export'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">{r.metrics}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(r.title, r.type);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tabular Preview of Selected Report */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Live Tabular Preview: {predefinedReports.find(r => r.id === selectedPredefinedId)?.title}
                </h3>
                <p className="text-xs text-slate-500">Sample aggregation rendered in browser before file export.</p>
              </div>
              <button
                onClick={() => handleExport(predefinedReports.find(r => r.id === selectedPredefinedId)!.title, 'PDF')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-brand-600" />
                <span>Export Dossier</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase text-[11px]">
                    <th className="py-2.5 px-3">Segment / Unit</th>
                    <th className="py-2.5 px-3">Total Electors</th>
                    <th className="py-2.5 px-3">Male Electors</th>
                    <th className="py-2.5 px-3">Female Electors</th>
                    <th className="py-2.5 px-3">Sex Ratio</th>
                    <th className="py-2.5 px-3">Projected Turnout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">214 - Kothrud Assembly Segment</td>
                    <td className="py-2.5 px-3">4,12,400</td>
                    <td className="py-2.5 px-3">2,14,200</td>
                    <td className="py-2.5 px-3">1,98,200</td>
                    <td className="py-2.5 px-3 font-semibold text-brand-700">925 / 1000</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">68.4%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">215 - Shivajinagar Assembly Segment</td>
                    <td className="py-2.5 px-3">3,20,100</td>
                    <td className="py-2.5 px-3">1,68,000</td>
                    <td className="py-2.5 px-3">1,52,100</td>
                    <td className="py-2.5 px-3 font-semibold text-brand-700">905 / 1000</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">59.8%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">212 - Parvati Assembly Segment</td>
                    <td className="py-2.5 px-3">3,89,500</td>
                    <td className="py-2.5 px-3">2,02,100</td>
                    <td className="py-2.5 px-3">1,87,400</td>
                    <td className="py-2.5 px-3 font-semibold text-brand-700">927 / 1000</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">62.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: Custom Report Builder */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Assemble Custom Electoral Report</h3>
            <p className="text-xs text-slate-500">Select source dataset, analytical dimensions, geographic scope, and export profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source Dataset</label>
              <select
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="Voters Database">Voters Database</option>
                <option value="Karyakarta Survey Responses">Karyakarta Survey Responses</option>
                <option value="Booth Turnout History">Booth Turnout History</option>
                <option value="Office Grievance Records">Office Grievance Records</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cross-Dimension</label>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="Caste Composition">Caste Composition</option>
                <option value="Age Bracket Breakdown">Age Bracket Breakdown</option>
                <option value="Welfare Scheme Beneficiaries">Welfare Scheme Beneficiaries</option>
                <option value="Political Leaning Sentiment">Political Leaning Sentiment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Geographic Filter</label>
              <select
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="All Parliamentary Segments">All Parliamentary Segments</option>
                <option value="Prabhaag 12 - Kothrud West">Prabhaag 12 - Kothrud West</option>
                <option value="Prabhaag 13 - Erandwane">Prabhaag 13 - Erandwane</option>
                <option value="Prabhaag 14 - Shivajinagar">Prabhaag 14 - Shivajinagar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="ANALYTICAL_PDF">Formatted Analytical PDF Dossier</option>
                <option value="RAW_CSV">Raw Tabular CSV Export</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Report Parameters Validated</span>
              <span className="text-slate-500">
                {dataset} × {dimension} in {geography} ({format === 'ANALYTICAL_PDF' ? 'Analytical charts included' : 'Clean tabular data'})
              </span>
            </div>
            <button
              onClick={() => handleExport(`Custom_${dimension}_${geography}`, format)}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Export Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

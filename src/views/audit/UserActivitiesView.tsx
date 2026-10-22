import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Calendar,
  X,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { AuditLog } from '../../types';
import { useToast } from '../../components/common/Toast';

export const UserActivitiesView: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');

  // Selected Log Detail Modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter;
    return matchSearch && matchModule && matchOutcome;
  });

  const handleExportAuditCSV = () => {
    const headers = ["Event ID", "Timestamp", "Actor", "Role", "Module", "Action", "Related Record", "IP", "Outcome", "Details"];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.role,
      l.module,
      l.action,
      `"${l.relatedRecord}"`,
      l.ipAddress,
      l.outcome,
      `"${l.details}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Indata_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredLogs.length} audit log events to CSV.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Compliance & Security
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
              Sample Audit Events
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            User Activities & Security Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking voter lookups, CSV downloads, ticket assignments, and administrative actions.
          </p>
        </div>

        <button
          onClick={handleExportAuditCSV}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, IP, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Modules</option>
            <option value="Total Voters">Total Voters</option>
            <option value="Office & Issues">Office & Issues</option>
            <option value="Campaign Control">Campaign Control</option>
            <option value="Users & Karyakarta">Users & Karyakarta</option>
            <option value="Live Field Map">Live Field Map</option>
          </select>
        </div>

        <div className="w-full md:w-44">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed / Blocked</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Actor</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action / Event</th>
                <th className="py-3 px-4">Related Record</th>
                <th className="py-3 px-4">IP & Device</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{log.actor}</span>
                    <span className="text-[10px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-brand-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {log.relatedRecord}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                    <span className="block font-mono">{log.ipAddress}</span>
                    <span className="text-[10px] text-slate-400">{log.device}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.outcome === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.outcome === 'FAILED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Inspect Event Payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Event Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{selectedLog.id}</span>
                <h3 className="font-bold text-slate-900 text-base">Security Audit Event Record</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Actor:</span>
                  <span className="font-bold text-slate-900">{selectedLog.actor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="font-mono text-slate-800">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Module:</span>
                  <span className="font-bold text-brand-700">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Outcome:</span>
                  <span className="font-bold text-emerald-700">{selectedLog.outcome}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Action Identifier:</span>
                <p className="font-mono bg-slate-100 p-2 rounded-lg text-slate-800">{selectedLog.action}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Related Record Context:</span>
                <p className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">{selectedLog.relatedRecord}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Payload Audit Details:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                  {selectedLog.details}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Client Signature: {selectedLog.ipAddress} • {selectedLog.device}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

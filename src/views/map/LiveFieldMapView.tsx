import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  Users,
  Vote,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Printer,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  X,
  Phone,
  ChevronRight,
  Smartphone,
  Calendar,
  Check,
  Search,
  MessageSquare
} from 'lucide-react';
import { MOCK_BOOTHS, MOCK_KARYAKARTAS, MOCK_TICKETS } from '../../data/mockData';
import { Booth, Karyakarta, OfficeTicket } from '../../types';
import { useToast } from '../../components/common/Toast';

interface SlipDeliveryEvent {
  id: string;
  voterName: string;
  epicNumber: string;
  boothNumber: number;
  prabhaag: string;
  slipType: 'DIGITAL_WHATSAPP' | 'PRINTED_THERMAL';
  deliveredBy: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING';
  dateRange: 'TODAY' | 'LAST_3_DAYS' | 'THIS_WEEK';
  mobile: string;
  x: number;
  y: number;
  notes: string;
}

// Realistic Field Voter Slip Delivery Telemetry
const MOCK_SLIP_DELIVERIES: SlipDeliveryEvent[] = [
  {
    id: 'SLIP-DEL-101',
    voterName: 'Sunita Ravindra Kulkarni',
    epicNumber: 'MH34098231',
    boothNumber: 101,
    prabhaag: 'Prabhaag 12 - Kothrud West',
    slipType: 'PRINTED_THERMAL',
    deliveredBy: 'Sanjay Deshmukh',
    timestamp: '10:14 AM Today',
    status: 'COMPLETED',
    dateRange: 'TODAY',
    mobile: '+91 98221 44510',
    x: 230,
    y: 290,
    notes: 'Handed over 58mm printed slip with candidate symbol. Supporter confirmed family of 4.'
  },
  {
    id: 'SLIP-DEL-102',
    voterName: 'Amit Suresh Joshi',
    epicNumber: 'MH34088192',
    boothNumber: 101,
    prabhaag: 'Prabhaag 12 - Kothrud West',
    slipType: 'DIGITAL_WHATSAPP',
    deliveredBy: 'Sanjay Deshmukh',
    timestamp: '11:22 AM Today',
    status: 'COMPLETED',
    dateRange: 'TODAY',
    mobile: '+91 98223 90123',
    x: 270,
    y: 260,
    notes: 'Delivered official PDF slip via WhatsApp Business API. Verified QR code scanned.'
  },
  {
    id: 'SLIP-DEL-103',
    voterName: 'Prashant Baban Kamble',
    epicNumber: 'MH34015670',
    boothNumber: 103,
    prabhaag: 'Prabhaag 12 - Kothrud West',
    slipType: 'PRINTED_THERMAL',
    deliveredBy: 'Pooja Gaikwad',
    timestamp: '09:45 AM Today',
    status: 'COMPLETED',
    dateRange: 'TODAY',
    mobile: '+91 97645 22019',
    x: 420,
    y: 220,
    notes: 'Printed thermal slip handed at rickshaw stand. Rickshaw union coordinator verified.'
  },
  {
    id: 'SLIP-DEL-104',
    voterName: 'Mohammad Irfan Shaikh',
    epicNumber: 'MH34029810',
    boothNumber: 104,
    prabhaag: 'Prabhaag 13 - Erandwane',
    slipType: 'DIGITAL_WHATSAPP',
    deliveredBy: 'Rahul More',
    timestamp: 'Yesterday 04:30 PM',
    status: 'COMPLETED',
    dateRange: 'LAST_3_DAYS',
    mobile: '+91 99220 33451',
    x: 580,
    y: 260,
    notes: 'Sent digital slip via WhatsApp with booth navigation map link.'
  },
  {
    id: 'SLIP-DEL-105',
    voterName: 'Dr. Ashutosh Shrikant Ranade',
    epicNumber: 'MH34033418',
    boothNumber: 105,
    prabhaag: 'Prabhaag 13 - Erandwane',
    slipType: 'PRINTED_THERMAL',
    deliveredBy: 'Rahul More',
    timestamp: 'Yesterday 06:15 PM',
    status: 'COMPLETED',
    dateRange: 'LAST_3_DAYS',
    mobile: '+91 98900 11223',
    x: 510,
    y: 340,
    notes: 'Delivered at residence clinic. Requested BLO contact clarification.'
  },
  {
    id: 'SLIP-DEL-106',
    voterName: 'Kavita Nitin Shinde',
    epicNumber: 'MH34044590',
    boothNumber: 106,
    prabhaag: 'Prabhaag 14 - Shivajinagar',
    slipType: 'DIGITAL_WHATSAPP',
    deliveredBy: 'Sachin Thorat',
    timestamp: 'Pending Handover',
    status: 'PENDING',
    dateRange: 'THIS_WEEK',
    mobile: '+91 98811 77665',
    x: 740,
    y: 220,
    notes: 'Door locked during 1st visit. Scheduled for digital WhatsApp push + evening callback.'
  },
  {
    id: 'SLIP-DEL-107',
    voterName: 'Vikram Madhavrao Jadhav',
    epicNumber: 'MH34055601',
    boothNumber: 107,
    prabhaag: 'Prabhaag 14 - Shivajinagar',
    slipType: 'PRINTED_THERMAL',
    deliveredBy: 'Sachin Thorat',
    timestamp: '2 days ago',
    status: 'COMPLETED',
    dateRange: 'LAST_3_DAYS',
    mobile: '+91 97633 44556',
    x: 790,
    y: 280,
    notes: 'Delivered printed slip with Ladki Bahin guidance brochure.'
  }
];

export const LiveFieldMapView: React.FC = () => {
  const { showToast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'KARYAKARTAS' | 'BOOTHS' | 'SLIPS' | 'ISSUES' | 'ALL'>('ALL');

  // Filter States
  const [selectedPrabhaag, setSelectedPrabhaag] = useState('ALL');
  const [selectedBoothFilter, setSelectedBoothFilter] = useState('ALL');
  const [selectedActivityType, setSelectedActivityType] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<'ALL' | 'TODAY' | 'LAST_3_DAYS' | 'THIS_WEEK'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'PENDING'>('ALL');
  const [selectedSlipType, setSelectedSlipType] = useState<'ALL' | 'DIGITAL_WHATSAPP' | 'PRINTED_THERMAL'>('ALL');

  // Selected Marker Info Drawer
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'karyakarta' | 'booth' | 'issue' | 'slip';
    data: any;
  } | null>(null);

  // Filtered Booths
  const filteredBooths = MOCK_BOOTHS.filter(b => {
    if (selectedBoothFilter !== 'ALL' && b.boothNumber.toString() !== selectedBoothFilter) return false;
    if (selectedPrabhaag !== 'ALL' && !b.prabhaag.toLowerCase().includes(selectedPrabhaag.toLowerCase())) return false;
    return true;
  });

  // Filtered Karyakartas
  const filteredKaryakartas = MOCK_KARYAKARTAS.filter(k => {
    if (selectedBoothFilter !== 'ALL' && k.assignedBooth.toString() !== selectedBoothFilter) return false;
    if (selectedPrabhaag !== 'ALL' && !k.prabhaag.toLowerCase().includes(selectedPrabhaag.toLowerCase())) return false;
    if (selectedStatus === 'ACTIVE' && !k.isOnline) return false;
    return true;
  });

  // Filtered Issues
  const filteredIssues = MOCK_TICKETS.filter(t => {
    if (selectedStatus === 'COMPLETED' && t.status !== 'RESOLVED') return false;
    if (selectedStatus === 'PENDING' && t.status !== 'OPEN') return false;
    return true;
  });

  // Filtered Slip Deliveries
  const filteredSlips = MOCK_SLIP_DELIVERIES.filter(s => {
    if (selectedBoothFilter !== 'ALL' && s.boothNumber.toString() !== selectedBoothFilter) return false;
    if (selectedPrabhaag !== 'ALL' && !s.prabhaag.toLowerCase().includes(selectedPrabhaag.toLowerCase())) return false;
    if (selectedDateRange !== 'ALL' && s.dateRange !== selectedDateRange) return false;
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (selectedSlipType !== 'ALL' && s.slipType !== selectedSlipType) return false;
    return true;
  });

  const handleMarkerClick = (type: 'karyakarta' | 'booth' | 'issue' | 'slip', data: any) => {
    setSelectedMarker({ type, data });
  };

  const shouldShowBooths = activeLayer === 'ALL' || activeLayer === 'BOOTHS';
  const shouldShowKaryakartas = (activeLayer === 'ALL' || activeLayer === 'KARYAKARTAS') && selectedActivityType !== 'SLIPS' && selectedActivityType !== 'ISSUES';
  const shouldShowSlips = (activeLayer === 'ALL' || activeLayer === 'SLIPS') && (selectedActivityType === 'ALL' || selectedActivityType === 'SLIPS');
  const shouldShowIssues = (activeLayer === 'ALL' || activeLayer === 'ISSUES') && (selectedActivityType === 'ALL' || selectedActivityType === 'ISSUES');

  const totalVisibleMarkers = 
    (shouldShowBooths ? filteredBooths.length : 0) +
    (shouldShowKaryakartas ? filteredKaryakartas.length : 0) +
    (shouldShowSlips ? filteredSlips.length : 0) +
    (shouldShowIssues ? filteredIssues.length : 0);

  return (
    <div className="space-y-4 pb-12 animate-fade-in flex flex-col h-[calc(100vh-5.5rem)]">
      {/* Top Map Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                GIS Operations & Field Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Mock Illustrative Map Telemetry
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 mt-0.5">
              Live Field Map & Voter Slip Delivery Monitor
            </h1>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('KARYAKARTAS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'KARYAKARTAS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Karyakartas ({filteredKaryakartas.length})
            </button>
            <button
              onClick={() => setActiveLayer('SLIPS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'SLIPS' ? 'bg-white text-brand-700 shadow-xs font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              Voter Slips ({filteredSlips.length})
            </button>
            <button
              onClick={() => setActiveLayer('BOOTHS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'BOOTHS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Booths ({filteredBooths.length})
            </button>
            <button
              onClick={() => setActiveLayer('ISSUES')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'ISSUES' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Issues ({filteredIssues.length})
            </button>
          </div>
        </div>

        {/* Multi-Dimensional Filter Toolbar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {/* Prabhaag Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prabhaag</label>
            <select
              value={selectedPrabhaag}
              onChange={(e) => setSelectedPrabhaag(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Prabhaags</option>
              <option value="Kothrud">Prabhaag 12 - Kothrud West</option>
              <option value="Erandwane">Prabhaag 13 - Erandwane</option>
              <option value="Shivajinagar">Prabhaag 14 - Shivajinagar</option>
            </select>
          </div>

          {/* Booth Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Booth Number</label>
            <select
              value={selectedBoothFilter}
              onChange={(e) => setSelectedBoothFilter(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All 8 Booths</option>
              {MOCK_BOOTHS.map(b => (
                <option key={b.boothNumber} value={b.boothNumber.toString()}>
                  Booth #{b.boothNumber} ({b.locality})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Activity Type</label>
            <select
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Activities</option>
              <option value="SLIPS">Slip Deliveries Only</option>
              <option value="ISSUES">Grievances Only</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date Range</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as any)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today (Live)</option>
              <option value="LAST_3_DAYS">Last 3 Days</option>
              <option value="THIS_WEEK">This Week</option>
            </select>
          </div>

          {/* Delivery Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active / Online</option>
              <option value="COMPLETED">Delivered / Resolved</option>
              <option value="PENDING">Pending Handover</option>
            </select>
          </div>

          {/* Voter Slip Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slip Format</label>
            <select
              value={selectedSlipType}
              onChange={(e) => setSelectedSlipType(e.target.value as any)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Slip Types</option>
              <option value="DIGITAL_WHATSAPP">WhatsApp Digital QR Slip</option>
              <option value="PRINTED_THERMAL">58mm Thermal Printed Slip</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden flex shadow-inner">
        {/* SVG Vector Map Container */}
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Stylized GIS Grid */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* Ward Boundaries & Roads vector paths */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Background Constituency Silhouette */}
            <polygon
              points="100,80 340,40 680,60 920,180 840,480 520,560 220,510 80,320"
              fill="rgba(30, 58, 138, 0.15)"
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* Major Arterial Roads (Karve Road, FC Road, Paud Road) */}
            <path d="M 120 400 Q 350 300 550 250 T 880 180" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
            <path d="M 280 80 Q 400 240 540 380 T 680 540" fill="none" stroke="#334155" strokeWidth="4" />
            <path d="M 450 120 Q 560 280 720 340 T 910 460" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="4,4" />

            {/* Booth Polygons */}
            <polygon
              points="140,240 280,210 260,340 130,320"
              fill="rgba(37, 99, 235, 0.15)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <polygon
              points="290,200 450,170 470,300 300,320"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="#10b981"
              strokeWidth="2"
            />
            <polygon
              points="470,180 640,150 660,280 480,290"
              fill="rgba(245, 158, 11, 0.15)"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <polygon
              points="660,160 820,140 840,300 670,310"
              fill="rgba(239, 68, 68, 0.15)"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>

          {/* Interactive Markers Layer */}

          {/* 1. Booth Markers */}
          {shouldShowBooths && filteredBooths.map((b, idx) => {
            const x = 200 + (idx % 4) * 180;
            const y = 180 + Math.floor(idx / 4) * 160;
            return (
              <div
                key={b.boothNumber}
                onClick={() => handleMarkerClick('booth', b)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className={`p-2 rounded-2xl border flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-transform group-hover:scale-110 ${
                  b.grade === 'A'
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500'
                    : b.grade === 'B'
                    ? 'bg-blue-950/90 text-blue-300 border-blue-500'
                    : 'bg-amber-950/90 text-amber-300 border-amber-500'
                }`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Booth #{b.boothNumber}</span>
                </div>
              </div>
            );
          })}

          {/* 2. Karyakarta Live Pins */}
          {shouldShowKaryakartas && filteredKaryakartas.map((k, idx) => {
            const x = 240 + idx * 160;
            const y = 230 + (idx % 2) * 100;
            return (
              <div
                key={k.id}
                onClick={() => handleMarkerClick('karyakarta', k)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className="relative flex flex-col items-center">
                  {k.isOnline && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-400/40 animate-ping absolute"></span>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white ${
                    k.isOnline ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-slate-200'
                  }`}>
                    {k.name[0]}
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-bold border border-slate-700 whitespace-nowrap shadow-md">
                    {k.name} ({k.surveysCompleted} surveys)
                  </span>
                </div>
              </div>
            );
          })}

          {/* 3. Voter Slip Delivery Pins (Digital WhatsApp vs Printed Thermal) */}
          {shouldShowSlips && filteredSlips.map((s) => (
            <div
              key={s.id}
              onClick={() => handleMarkerClick('slip', s)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${s.x}px`, top: `${s.y}px` }}
            >
              <div className="flex flex-col items-center transition-transform group-hover:scale-110">
                {s.slipType === 'PRINTED_THERMAL' ? (
                  /* 58mm Thermal Printed Slip Pin */
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-400/50">
                    <Printer className="w-4 h-4" />
                  </div>
                ) : (
                  /* WhatsApp Digital Slip Pin */
                  <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-cyan-400/50">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                )}
                <span className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap shadow-md border ${
                  s.slipType === 'PRINTED_THERMAL'
                    ? 'bg-emerald-950/95 text-emerald-300 border-emerald-500'
                    : 'bg-cyan-950/95 text-cyan-300 border-cyan-500'
                }`}>
                  {s.voterName.split(' ')[0]} ({s.slipType === 'PRINTED_THERMAL' ? '58mm Print' : 'WhatsApp QR'})
                </span>
              </div>
            </div>
          ))}

          {/* 4. Issue Hotspots */}
          {shouldShowIssues && filteredIssues.map((t, idx) => {
            const x = 320 + idx * 170;
            const y = 200 + (idx % 2) * 120;
            return (
              <div
                key={t.id}
                onClick={() => handleMarkerClick('issue', t)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[9px] font-bold border border-slate-700 whitespace-nowrap">
                    {t.id}: {t.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Overlay Controls (Zoom & Legend) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-md transition-colors"
            title="Reset Center"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Left Map Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[10px] text-slate-300 space-y-1.5 z-30 shadow-xl max-w-xs">
          <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1 mb-1">
            <span>Map Legend ({totalVisibleMarkers} Visible)</span>
            <span className="text-[9px] text-brand-400 font-normal">Live GPS</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Online Karyakarta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Polling Station</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Digital WhatsApp Slip</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>58mm Thermal Print Slip</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Citizen Grievance Hotspot</span>
            </div>
          </div>
        </div>

        {/* Selected Marker Detail Slide-over Panel */}
        {selectedMarker && (
          <div className="absolute top-4 right-16 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 text-xs animate-slide-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {selectedMarker.type === 'booth'
                  ? 'Polling Station Dossier'
                  : selectedMarker.type === 'karyakarta'
                  ? 'Karyakarta Live Telemetry'
                  : selectedMarker.type === 'slip'
                  ? 'Voter Slip Delivery Record'
                  : 'Grievance Pin'}
              </span>
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Booth Dossier */}
            {selectedMarker.type === 'booth' && (
              <div className="space-y-2 text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm">
                  Booth #{selectedMarker.data.boothNumber} - {selectedMarker.data.name}
                </h4>
                <p className="text-slate-500 text-[11px]">{selectedMarker.data.locality}</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Total Electors:</span>
                    <span className="font-bold text-slate-900">{selectedMarker.data.totalVoters}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Slips Delivered:</span>
                    <span className="font-bold text-emerald-600">{selectedMarker.data.slipsDeliveredPercent}%</span>
                  </div>
                </div>
                <div className="bg-brand-50 p-2 rounded-lg border border-brand-200">
                  <span className="text-[10px] text-brand-900 font-bold block">Designated BLO:</span>
                  <span className="font-semibold text-brand-800">{selectedMarker.data.bloName}</span>
                  <span className="text-[10px] text-brand-600 block">{selectedMarker.data.bloPhone}</span>
                </div>
              </div>
            )}

            {/* Karyakarta Dossier */}
            {selectedMarker.type === 'karyakarta' && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {selectedMarker.data.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedMarker.data.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Active in Field</span>
                  </div>
                </div>
                <p className="text-slate-600">Assigned: Booth #{selectedMarker.data.assignedBooth} ({selectedMarker.data.prabhaag})</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Surveys Completed:</span>
                    <span className="font-bold text-slate-900">{selectedMarker.data.surveysCompleted}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Slips Handed:</span>
                    <span className="font-bold text-slate-900">{selectedMarker.data.voterSlipsDelivered}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Voter Slip Delivery Dossier */}
            {selectedMarker.type === 'slip' && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-700">{selectedMarker.data.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedMarker.data.slipType === 'PRINTED_THERMAL'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-cyan-100 text-cyan-800'
                  }`}>
                    {selectedMarker.data.slipType === 'PRINTED_THERMAL' ? '58mm Thermal Slip' : 'Digital WhatsApp Slip'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedMarker.data.voterName}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">EPIC: {selectedMarker.data.epicNumber}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivered By:</span>
                    <span className="font-bold text-slate-800">{selectedMarker.data.deliveredBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booth & Ward:</span>
                    <span className="font-medium text-slate-800">Booth #{selectedMarker.data.boothNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-medium text-slate-800">{selectedMarker.data.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-medium text-slate-800">{selectedMarker.data.mobile}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                  {selectedMarker.data.notes}
                </p>
                <button
                  onClick={() => {
                    showToast(`Direct ping sent to ${selectedMarker.data.voterName} (${selectedMarker.data.mobile}).`, 'success');
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] transition-colors"
                >
                  Send Follow-up Greeting
                </button>
              </div>
            )}

            {/* Grievance Dossier */}
            {selectedMarker.type === 'issue' && (
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-700">{selectedMarker.data.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {selectedMarker.data.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedMarker.data.category}</h4>
                <p className="text-slate-600 text-[11px]">{selectedMarker.data.description}</p>
                <p className="text-slate-500 text-[10px]">Visitor: {selectedMarker.data.visitorName}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

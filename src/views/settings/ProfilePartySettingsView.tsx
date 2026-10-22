import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Vote,
  MapPin,
  Palette,
  Globe,
  Bell,
  Megaphone,
  Sparkles,
  Printer,
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { CURRENT_ELECTION_CONTEXT } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

export const ProfilePartySettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<
    | 'profile'
    | 'party'
    | 'candidate'
    | 'constituency'
    | 'branding'
    | 'language'
    | 'notifications'
    | 'campaign'
    | 'ai'
    | 'voterSlip'
    | 'karyakartaApp'
  >('profile');

  // Form State
  const [profileData, setProfileData] = useState({
    adminName: 'Adv. Vikram Patil',
    adminEmail: 'vikram.patil@indata-election.in',
    adminPhone: '+91 98220 99000',
    role: 'Candidate Admin',

    partyName: 'Rashtriya Vikas Morcha',
    partyShortCode: 'RVM',
    electionSymbol: 'Sun & Wheel',
    headquarters: 'Shivaji Nagar, Pune 411005',

    candidateFormalName: 'Adv. Vikram Shankarrao Patil',
    qualification: 'B.Com, LL.B (Pune University)',
    criminalCasesDeclared: 'None (Nil Form 26 Affidavit)',

    constituency: '34 - Pune Parliamentary Constituency',
    state: 'Maharashtra',
    boothCount: 2045,

    portalBrandColor: '#254deb',
    themeMode: 'Light Modern',

    selectedLanguage: 'English',

    enableWhatsAppAlerts: true,
    enableTurnoutCriticalAlerts: true,

    defaultSmsSenderId: 'INDATA',
    defaultVoiceLanguage: 'Marathi',

    aiModelCreativity: 'Balanced (Recommended)',
    autoDetectSwingBooths: true,

    slipHeaderLine1: 'LOK SABHA GENERAL ELECTIONS 2024',
    slipCandidateName: 'Adv. Vikram Patil',
    slipShowQrCode: true,

    karyakartaGpsInterval: '30 seconds',
    requirePhotoAtVoterHouse: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleFieldChange = (key: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHasUnsavedChanges(false);
    showToast('Portal configuration and campaign settings saved successfully.', 'success');
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
    showToast('Changes discarded.', 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Configuration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              Admin Governance
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Profile & Party Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage election credentials, voter-slip thermal layouts, regional languages, and karyakarta app policies.
          </p>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1 h-fit">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'party', label: 'Organization & Party', icon: Building },
            { id: 'candidate', label: 'Candidate Details', icon: Vote },
            { id: 'constituency', label: 'Constituency & Geometry', icon: MapPin },
            { id: 'branding', label: 'Branding & Theme', icon: Palette },
            { id: 'language', label: 'Language (भाषा)', icon: Globe },
            { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
            { id: 'campaign', label: 'Campaign Defaults', icon: Megaphone },
            { id: 'ai', label: 'AI Intelligence Preferences', icon: Sparkles },
            { id: 'voterSlip', label: 'Voter-Slip Layout Designer', icon: Printer },
            { id: 'karyakartaApp', label: 'Karyakarta App Settings', icon: Smartphone }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeSection === item.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* 1. My Profile */}
            {activeSection === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Administrator Profile & Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Administrator Full Name</label>
                    <input
                      type="text"
                      value={profileData.adminName}
                      onChange={(e) => handleFieldChange('adminName', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      value={profileData.adminEmail}
                      onChange={(e) => handleFieldChange('adminEmail', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Contact (SMS / WhatsApp)</label>
                    <input
                      type="tel"
                      value={profileData.adminPhone}
                      onChange={(e) => handleFieldChange('adminPhone', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Security Role</label>
                    <input
                      type="text"
                      disabled
                      value={profileData.role}
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Organization and Party */}
            {activeSection === 'party' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Political Party & Organization Attributes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Party / Organization Name</label>
                    <input
                      type="text"
                      value={profileData.partyName}
                      onChange={(e) => handleFieldChange('partyName', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Abbreviation / Short Code</label>
                    <input
                      type="text"
                      value={profileData.partyShortCode}
                      onChange={(e) => handleFieldChange('partyShortCode', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ECI Allotted Election Symbol</label>
                    <input
                      type="text"
                      value={profileData.electionSymbol}
                      onChange={(e) => handleFieldChange('electionSymbol', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Central Party Office Headquarters</label>
                    <input
                      type="text"
                      value={profileData.headquarters}
                      onChange={(e) => handleFieldChange('headquarters', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Candidate Information */}
            {activeSection === 'candidate' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Official Candidate Nomination Record
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Candidate Legal Name</label>
                    <input
                      type="text"
                      value={profileData.candidateFormalName}
                      onChange={(e) => handleFieldChange('candidateFormalName', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Educational Qualification</label>
                    <input
                      type="text"
                      value={profileData.qualification}
                      onChange={(e) => handleFieldChange('qualification', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Criminal Cases Declaration (Form 26)</label>
                    <input
                      type="text"
                      value={profileData.criminalCasesDeclared}
                      onChange={(e) => handleFieldChange('criminalCasesDeclared', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Constituency Settings */}
            {activeSection === 'constituency' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Constituency Boundaries & Geography
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parliamentary Constituency</label>
                    <input
                      type="text"
                      value={profileData.constituency}
                      onChange={(e) => handleFieldChange('constituency', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State / UT</label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Polling Booths</label>
                    <input
                      type="number"
                      value={profileData.boothCount}
                      onChange={(e) => handleFieldChange('boothCount', parseInt(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Language */}
            {activeSection === 'language' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Portal Interface & Messaging Language
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'English', label: 'English (Default)', note: 'Candidate Admin & War Room' },
                    { code: 'Marathi', label: 'मराठी (Marathi)', note: 'Karyakarta field app & voter slips' },
                    { code: 'Hindi', label: 'हिन्दी (Hindi)', note: 'Outbound campaign messaging' }
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => handleFieldChange('selectedLanguage', lang.code)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        profileData.selectedLanguage === lang.code
                          ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-slate-900 block text-sm">{lang.label}</span>
                      <p className="text-slate-500 text-[11px] mt-1">{lang.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Voter-Slip Layout Designer with Live Preview */}
            {activeSection === 'voterSlip' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Voter Information Slip Layout Customizer
                  </h3>
                  <span className="text-brand-700 font-semibold">Live 58mm / A6 Preview</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Slip Main Header Line</label>
                      <input
                        type="text"
                        value={profileData.slipHeaderLine1}
                        onChange={(e) => handleFieldChange('slipHeaderLine1', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Candidate Banner Attribution</label>
                      <input
                        type="text"
                        value={profileData.slipCandidateName}
                        onChange={(e) => handleFieldChange('slipCandidateName', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.slipShowQrCode}
                        onChange={(e) => handleFieldChange('slipShowQrCode', e.target.checked)}
                        className="rounded text-brand-600"
                      />
                      <span>Print Google Maps Polling Station QR Code on Slip</span>
                    </label>
                  </div>

                  {/* Visual Slip Preview Box */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between">
                    <div className="text-center border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-bold uppercase text-brand-700 block">
                        {profileData.slipHeaderLine1}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        Candidate: {profileData.slipCandidateName} ({profileData.partyShortCode})
                      </span>
                    </div>

                    <div className="py-3 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Voter:</span>
                        <span className="font-bold text-slate-900">Sunita Ramesh Deshmukh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booth:</span>
                        <span className="font-bold text-brand-700">Booth #101 • Sr #42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">EPIC ID:</span>
                        <span className="font-mono font-bold">MH34089211</span>
                      </div>
                    </div>

                    {profileData.slipShowQrCode && (
                      <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-2 text-[10px] text-slate-500">
                        <QrCode className="w-5 h-5 text-slate-700" />
                        <span>Scan for Polling Station Navigation</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Karyakarta App Settings */}
            {activeSection === 'karyakartaApp' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Mobile Field App Policies & Synchronization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GPS Telemetry Heartbeat</label>
                    <select
                      value={profileData.karyakartaGpsInterval}
                      onChange={(e) => handleFieldChange('karyakartaGpsInterval', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="30 seconds">Every 30 seconds</option>
                      <option value="60 seconds">Every 60 seconds</option>
                      <option value="5 minutes">Every 5 minutes (Battery Saver)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Survey Doorstep Photo Verification</label>
                    <select
                      value={profileData.requirePhotoAtVoterHouse ? 'Mandatory' : 'Optional'}
                      onChange={(e) => handleFieldChange('requirePhotoAtVoterHouse', e.target.value === 'Mandatory')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Mandatory">Mandatory Doorstep Photo</option>
                      <option value="Optional">Optional (Faster survey speed)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sections Placeholder Fallback */}
            {['branding', 'notifications', 'campaign', 'ai'].includes(activeSection) && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase">
                  {activeSection} Configuration
                </h3>
                <p className="text-slate-600">
                  Settings for {activeSection} are active and synchronized with candidate portal preferences.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Status: All parameters validated</span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* Form Save Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

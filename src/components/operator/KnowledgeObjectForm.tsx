'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeObject, EnvironmentAffinity } from '@/lib/content/schema';
import { useContent } from '@/lib/content/ContentEngine';
import { GitBranch, Plus, Trash2, Search, Loader2, Save, X, RotateCcw, AlertTriangle, Info } from 'lucide-react';
import { fetchGithubRepoData } from '@/lib/utils/github';
import { Tooltip } from '@/components/common/Tooltip';
import { useAudio } from '@/lib/audio/AudioEngine';
import { motion } from 'framer-motion';

interface KnowledgeObjectFormProps {
  onSubmit: (obj: KnowledgeObject) => void;
  initialData?: KnowledgeObject | null;
  onCancel?: () => void;
}

const DEFAULT_METADATA = {
  type: '',
  description: '',
  tags: '',
  dangerLevel: 1,
  signalStrength: 0.4,
  renderProfile: 'default'
};

const DEFAULT_INFLUENCE = {
  tension: 0.1,
  entropy: 0.1,
  anomaly: 0
};

const TEMPLATES = {
  osint: {
    label: 'NODE_ALPHA',
    status: 'MONITORING',
    environmentAffinity: 'osint' as EnvironmentAffinity,
    influence: { tension: 0.1, entropy: 0.05, anomaly: 0 },
    metadata: { ...DEFAULT_METADATA, type: 'SIGNAL', description: 'OSINT Data Node', dangerLevel: 1, renderProfile: 'default' }
  },
  cyber: {
    label: 'THREAT_VECTOR',
    status: 'ACTIVE',
    environmentAffinity: 'cyber' as EnvironmentAffinity,
    influence: { tension: 0.3, entropy: 0.15, anomaly: 0.05 },
    metadata: { ...DEFAULT_METADATA, type: 'VULNERABILITY', description: 'System Vulnerability Marker', dangerLevel: 5, renderProfile: 'unstable' }
  },
  github: {
    label: 'REPO_SYNC',
    status: 'CONNECTED',
    environmentAffinity: 'github' as EnvironmentAffinity,
    influence: { tension: 0.05, entropy: 0.02, anomaly: 0 },
    metadata: { ...DEFAULT_METADATA, type: 'REPOSITORY', description: 'Technical Infrastructure Node', dangerLevel: 0, renderProfile: 'high-vis' }
  }
};

export default function KnowledgeObjectForm({ onSubmit, initialData, onCancel }: KnowledgeObjectFormProps) {
  const { objects } = useContent();
  const { playFeedback } = useAudio();

  const [formData, setFormData] = useState<Partial<KnowledgeObject>>({
    id: '',
    label: '',
    value: '',
    status: '',
    environmentAffinity: 'osint',
    influence: { ...DEFAULT_INFLUENCE },
    metadata: { ...DEFAULT_METADATA },
    lastObserved: Date.now(),
  });

  const [metadataEntries, setMetadataEntries] = useState<[string, string][]>([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[key];
    setFormData(prev => ({
      ...prev,
      ...template,
      influence: { ...prev.influence, ...template.influence },
      metadata: { ...prev.metadata, ...template.metadata }
    }));
    playFeedback('click');
  };

  const handleParseRepo = async () => {
    if (!repoUrl) return;
    setIsParsing(true);
    const data = await fetchGithubRepoData(repoUrl);
    if (data) {
      setFormData(prev => ({
        ...prev,
        label: data.label,
        value: data.value,
        status: data.status,
        environmentAffinity: 'github',
        metadata: {
            ...prev.metadata,
            ...data.metadata
        }
      }));
      setMetadataEntries(Object.entries(data.metadata).map(([k, v]) => [k, String(v)]));
      playFeedback('click');
    }
    setIsParsing(false);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
          ...initialData,
          influence: { ...DEFAULT_INFLUENCE, ...initialData.influence },
          metadata: { ...DEFAULT_METADATA, ...initialData.metadata }
      });
      const explicitFields = ['type', 'description', 'tags', 'dangerLevel', 'signalStrength', 'renderProfile'];
      const filteredMetadata = Object.entries(initialData.metadata)
        .filter(([k]) => !explicitFields.includes(k))
        .map(([k, v]) => [k, String(v)] as [string, string]);
      setMetadataEntries(filteredMetadata);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label || !formData.value) {
      playFeedback('anomaly');
      return;
    }

    if (!initialData && objects.some(o => o.id === formData.id)) {
      playFeedback('anomaly');
      return;
    }

    const metadata = {
      ...formData.metadata,
      ...Object.fromEntries(metadataEntries.filter(([k]) => k.trim() !== ''))
    };

    onSubmit({
      ...formData as KnowledgeObject,
      id: formData.id || `obj-${Math.random().toString(36).substr(2, 9)}`,
      metadata,
      lastObserved: Date.now()
    });
    playFeedback('click');
  };

  const addMetadata = () => {
    setMetadataEntries([...metadataEntries, ['', '']]);
    playFeedback('hover');
  };

  const removeMetadata = (index: number) => {
    setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
    playFeedback('click');
  };

  const updateMetadata = (index: number, key: string, value: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index] = [key, value];
    setMetadataEntries(newEntries);
  };

  const isDestabilizing = (formData.influence?.anomaly || 0) > 0.6 || (formData.influence?.tension || 0) > 0.8;

  return (
    <div className="space-y-10 font-mono">
      {/* Header Actions */}
      <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyber-blue">
          {initialData ? 'Modification Protocol' : 'Injection Sequence'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="p-2 border border-cyber-blue/20 text-cyber-blue/40 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all">
              <X size={14} />
            </button>
          )}
          <button type="button" onClick={() => {
              setFormData({
                id: '',
                label: '',
                value: '',
                status: '',
                environmentAffinity: 'osint',
                influence: { ...DEFAULT_INFLUENCE },
                metadata: { ...DEFAULT_METADATA },
                lastObserved: Date.now(),
              });
              setMetadataEntries([]);
              playFeedback('click');
          }} className="p-2 border border-cyber-blue/20 text-cyber-blue/40 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {isDestabilizing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-cyber-red/10 border border-cyber-red/40 text-cyber-red text-[9px] uppercase tracking-widest flex items-center gap-4 font-bold"
          >
            <AlertTriangle size={18} />
            <div>
                <p>Warning: Destabilizing Atmospheric Influence</p>
                <p className="opacity-60 font-normal mt-1 text-[8px]">High Anomaly/Tension values may cause global UI recoil and session glitches.</p>
            </div>
          </motion.div>
      )}

      {/* Templates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
            <label className="text-[9px] uppercase opacity-40 font-bold">Environmental Templates</label>
            <Tooltip content="Select a template to auto-populate atmospheric parameters for common entity types." />
        </div>
        <div className="grid grid-cols-3 gap-3">
            {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map(key => (
                <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    className="p-4 border border-cyber-blue/10 bg-cyber-blue/5 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 transition-all text-[9px] uppercase tracking-[0.2em] text-center font-bold"
                >
                    {key}
                </button>
            ))}
        </div>
      </div>

      {/* GitHub Auto-Parser */}
      <div className="p-5 bg-cyber-blue/5 border border-cyber-blue/20 space-y-4">
        <div className="flex items-center gap-2">
            <label className="text-[10px] opacity-40 font-bold uppercase tracking-widest flex items-center gap-2">
                <GitBranch size={12} /> GitHub Auto-Injection
            </label>
            <Tooltip content="Paste a repository URL to automatically sync technical metadata and repository health stats." />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            className="flex-1 bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue outline-none focus:border-cyber-cyan text-[10px] uppercase tracking-widest"
            placeholder="HTTPS://GITHUB.COM/OWNER/REPO"
          />
          <button
            type="button"
            onClick={handleParseRepo}
            disabled={isParsing}
            className="px-6 bg-cyber-blue/10 border border-cyber-blue/40 hover:bg-cyber-blue hover:text-cyber-black transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
          >
            {isParsing ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Parse
          </button>
        </div>
      </div>

    <form onSubmit={handleSubmit} className="space-y-8 text-[10px] uppercase tracking-widest">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Signal ID</label>
            <Tooltip content="Unique ecosystem identifier. Used for neural mapping and relationship propagation." />
          </div>
          <input
            type="text"
            value={formData.id || ''}
            onChange={e => setFormData({ ...formData, id: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
            placeholder="AUTO_GENERATE"
          />
          <p className="text-[8px] opacity-30 italic leading-relaxed">Unique ID used in propagation graph logic.</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Affinity</label>
            <Tooltip content="The primary environmental dimension where this entity will manifest." />
          </div>
          <select
            value={formData.environmentAffinity || 'osint'}
            onChange={e => setFormData({ ...formData, environmentAffinity: e.target.value as EnvironmentAffinity })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all cursor-pointer"
          >
            <option value="osint">OSINT Layer (Drifting / Investigation)</option>
            <option value="cyber">Cybersecurity (Aggressive / Tactical)</option>
            <option value="github">GitHub Signals (Precise / Technical)</option>
            <option value="global">Global Influence (System-Wide)</option>
          </select>
          <p className="text-[8px] opacity-30 italic leading-relaxed">Determines the visual rendering engine to be used.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="opacity-40 font-bold">Primary Label</label>
          <input
            required
            type="text"
            value={formData.label || ''}
            onChange={e => setFormData({ ...formData, label: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
            placeholder="E.G. TARGET_ALPHA"
          />
          <p className="text-[8px] opacity-30 italic">Visible name in the ecosystem.</p>
        </div>
        <div className="space-y-3">
          <label className="opacity-40 font-bold">Data Value</label>
          <input
            required
            type="text"
            value={formData.value || ''}
            onChange={e => setFormData({ ...formData, value: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
            placeholder="E.G. 192.168.0.1"
          />
          <p className="text-[8px] opacity-30 italic font-bold text-cyber-cyan">Payload or technical address.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Status Marker</label>
            <Tooltip content="Real-time operational status of the entity. Affects pulse frequency." />
          </div>
          <input
            type="text"
            value={formData.status || ''}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
            placeholder="E.G. MONITORING"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Entity Type</label>
            <Tooltip content="Semantic category of the entity (e.g. Threat Actor, Registry, Tool)." />
          </div>
          <input
            type="text"
            value={(formData.metadata?.type as string) || ''}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, type: e.target.value } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
            placeholder="E.G. THREAT_ACTOR"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="opacity-40 font-bold uppercase tracking-widest">Atmospheric Description</label>
        <textarea
          value={(formData.metadata?.description as string) || ''}
          onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, description: e.target.value } })}
          className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none h-24 resize-none font-mono text-[9px] leading-relaxed tracking-widest uppercase"
          placeholder="DETAILED ENVIRONMENTAL CONTEXT AND SYSTEMIC ROLE..."
        />
        <p className="text-[8px] opacity-30 italic">Detailed context for dimension-specific onboarding.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Danger Level (1-10)</label>
            <Tooltip content="Determines systemic threat priority and visual urgency. Values > 7 trigger high-tension color shifts." />
          </div>
          <input
            type="number"
            min="1" max="10"
            value={(formData.metadata?.dangerLevel as number) || 1}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, dangerLevel: parseInt(e.target.value) } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all"
          />
          <p className="text-[8px] opacity-30 italic">Recommended: 1-4 for stable nodes, 5-10 for anomalies.</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Render Profile</label>
            <Tooltip content="Specific visual shader and interaction logic to apply to this entity." />
          </div>
          <select
            value={(formData.metadata?.renderProfile as string) || 'default'}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, renderProfile: e.target.value } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-cyber-blue focus:border-cyber-cyan outline-none transition-all cursor-pointer"
          >
            <option value="default">Default Atmospheric</option>
            <option value="high-vis">High Visibility (Glow)</option>
            <option value="stealth">Stealth / Minimalist</option>
            <option value="unstable">Unstable / Glitch (Reactive)</option>
          </select>
        </div>
      </div>

      {/* Influence Parameters */}
      <div className="space-y-6 pt-6 border-t border-cyber-blue/10">
        <div className="flex items-center gap-3">
            <label className="opacity-40 font-bold block uppercase tracking-[0.3em] flex items-center gap-2">
                Systemic World-State Influence
            </label>
            <Tooltip content="Defines how this entity physically mutates the global atmospheric world-state." />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className={`space-y-4 p-5 bg-cyber-blue/5 border transition-colors ${(formData.influence?.tension || 0) > 0.8 ? 'border-cyber-red/60 bg-cyber-red/5' : 'border-cyber-blue/20'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[9px]">Tension</span>
                <span className={`font-mono font-bold ${(formData.influence?.tension || 0) > 0.8 ? 'text-cyber-red' : 'text-cyber-cyan'}`}>{(formData.influence?.tension || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.tension || 0}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, tension: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <div className="space-y-2">
                <p className="text-[7px] opacity-40 uppercase font-bold">Stiffness / Damping</p>
                <p className="text-[7px] opacity-20 leading-relaxed uppercase">Increases visual recoil. Rec: 0.1 - 0.5</p>
            </div>
          </div>

          <div className={`space-y-4 p-5 bg-cyber-blue/5 border transition-colors ${(formData.influence?.entropy || 0) > 0.7 ? 'border-amber-500/60' : 'border-cyber-blue/20'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[9px]">Entropy</span>
                <span className={`font-mono font-bold ${(formData.influence?.entropy || 0) > 0.7 ? 'text-amber-500' : 'text-cyber-cyan'}`}>{(formData.influence?.entropy || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.entropy || 0}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, entropy: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <div className="space-y-2">
                <p className="text-[7px] opacity-40 uppercase font-bold">Randomness / Jitter</p>
                <p className="text-[7px] opacity-20 leading-relaxed uppercase">Drives motion chaos. Rec: 0.0 - 0.3</p>
            </div>
          </div>

          <div className={`space-y-4 p-5 bg-cyber-blue/5 border transition-colors ${(formData.influence?.anomaly || 0) > 0.6 ? 'border-cyber-red/60 bg-cyber-red/5' : 'border-cyber-blue/20'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[9px]">Anomaly</span>
                <span className={`font-mono font-bold ${(formData.influence?.anomaly || 0) > 0.6 ? 'text-cyber-red' : 'text-cyber-cyan'}`}>{(formData.influence?.anomaly || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.anomaly || 0}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, anomaly: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <div className="space-y-2">
                <p className="text-[7px] opacity-40 uppercase font-bold">Rare Events / Flash</p>
                <p className="text-[7px] opacity-20 leading-relaxed uppercase">Triggers glitches. Rec: 0.0 - 0.2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Editor */}
      <div className="space-y-6 pt-6 border-t border-cyber-blue/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold uppercase tracking-[0.3em]">Extended Technical Metadata</label>
            <Tooltip content="Additional dimension-specific key-value pairs for technical integration." />
          </div>
          <button type="button" onClick={addMetadata} className="text-cyber-cyan hover:bg-cyber-cyan/10 p-2 border border-cyber-cyan/20 transition-all flex items-center gap-2">
            <Plus size={14} />
            <span className="text-[8px] font-bold">Register Key</span>
          </button>
        </div>
        <div className="grid gap-3">
          {metadataEntries.map(([k, v], i) => (
            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <input type="text" value={k || ''} onChange={e => updateMetadata(i, e.target.value, v)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-3 text-cyber-blue outline-none focus:border-cyber-cyan transition-all uppercase tracking-widest text-[9px]" placeholder="SYSTEM_KEY" />
              <input type="text" value={v || ''} onChange={e => updateMetadata(i, k, e.target.value)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-3 text-cyber-blue outline-none focus:border-cyber-cyan transition-all uppercase tracking-widest text-[9px]" placeholder="SYSTEM_VALUE" />
              <button type="button" onClick={() => removeMetadata(i)} className="p-3 text-cyber-red/40 hover:text-cyber-red hover:bg-cyber-red/10 border border-cyber-red/10 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {metadataEntries.length === 0 && (
              <div className="text-center py-6 border border-dashed border-cyber-blue/10 opacity-20 text-[8px] uppercase tracking-[0.4em]">
                  NO EXTENDED METADATA ENTRIES REGISTERED
              </div>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-cyber-blue/10 flex flex-col gap-4">
        <div className="flex items-start gap-4 p-4 bg-cyber-cyan/5 border border-cyber-cyan/20">
            <Info size={20} className="text-cyber-cyan mt-1 shrink-0" />
            <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase text-cyber-cyan">Injection Preparedness</h4>
                <p className="text-[8px] opacity-40 leading-relaxed uppercase tracking-tighter">
                    Executing this protocol will persist the entity to the central ecosystem registry.
                    Influence will propagate across linked neural paths immediately.
                </p>
            </div>
        </div>

        <button
            type="submit"
            className="w-full py-5 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan font-bold hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(6,182,212,0.1)] active:scale-[0.98]"
        >
            <Save size={20} />
            {initialData ? 'Commit Modification Protocol' : 'Execute System Injection'}
        </button>
      </div>
    </form>
    </div>
  );
}

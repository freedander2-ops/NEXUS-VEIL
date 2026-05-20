'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeObject, EnvironmentAffinity } from '@/lib/content/schema';
import { useContent } from '@/lib/content/ContentEngine';
import { GitBranch, Plus, Trash2, Search, Loader2, Save, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { fetchGithubRepoData } from '@/lib/utils/github';
import { Tooltip } from '@/components/common/Tooltip';
import { useAudio } from '@/lib/audio/AudioEngine';
import { motion } from 'framer-motion';

interface KnowledgeObjectFormProps {
  onSubmit: (obj: KnowledgeObject) => void;
  initialData?: KnowledgeObject | null;
  onCancel?: () => void;
}

const TEMPLATES = {
  osint: {
    label: 'NODE_ALPHA',
    status: 'MONITORING',
    environmentAffinity: 'osint' as EnvironmentAffinity,
    influence: { tension: 0.1, entropy: 0.05, anomaly: 0 },
    metadata: { type: 'SIGNAL', description: 'OSINT Data Node', dangerLevel: 1, renderProfile: 'default' }
  },
  cyber: {
    label: 'THREAT_VECTOR',
    status: 'ACTIVE',
    environmentAffinity: 'cyber' as EnvironmentAffinity,
    influence: { tension: 0.3, entropy: 0.15, anomaly: 0.05 },
    metadata: { type: 'VULNERABILITY', description: 'System Vulnerability Marker', dangerLevel: 5, renderProfile: 'unstable' }
  },
  github: {
    label: 'REPO_SYNC',
    status: 'CONNECTED',
    environmentAffinity: 'github' as EnvironmentAffinity,
    influence: { tension: 0.05, entropy: 0.02, anomaly: 0 },
    metadata: { type: 'REPOSITORY', description: 'Technical Infrastructure Node', dangerLevel: 0, renderProfile: 'high-vis' }
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
    influence: { tension: 0.1, entropy: 0.1, anomaly: 0 },
    metadata: {
      type: '',
      description: '',
      tags: '',
      dangerLevel: 1,
      signalStrength: 1,
      renderProfile: 'default'
    },
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
      setFormData(initialData);
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
    <div className="space-y-8 font-mono">
      {/* Header Actions */}
      <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyber-blue">
          {initialData ? 'Modification Protocol' : 'Injection Sequence'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <button onClick={onCancel} className="p-2 border border-cyber-blue/20 text-cyber-blue/40 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all">
              <X size={14} />
            </button>
          )}
          <button onClick={() => {
              setFormData({
                id: '',
                label: '',
                value: '',
                status: '',
                environmentAffinity: 'osint',
                influence: { tension: 0.1, entropy: 0.1, anomaly: 0 },
                metadata: { type: '', description: '', tags: '', dangerLevel: 1, signalStrength: 1, renderProfile: 'default' },
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
            className="p-3 bg-cyber-red/10 border border-cyber-red/40 text-cyber-red text-[9px] uppercase tracking-widest flex items-center gap-3 font-bold"
          >
            <AlertTriangle size={14} />
            Warning: High atmospheric influence detected. Session destabilization possible.
          </motion.div>
      )}

      {/* Templates */}
      <div className="space-y-3">
        <label className="text-[9px] uppercase opacity-40 font-bold flex items-center gap-2">
          Environmental Templates
        </label>
        <div className="grid grid-cols-3 gap-3">
            {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map(key => (
                <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    className="p-3 border border-cyber-blue/10 bg-cyber-blue/5 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/5 transition-all text-[9px] uppercase tracking-widest text-center"
                >
                    {key}
                </button>
            ))}
        </div>
      </div>

      {/* GitHub Auto-Parser */}
      <div className="p-4 bg-cyber-blue/5 border border-cyber-blue/20 space-y-3">
        <label className="text-[10px] opacity-40 font-bold flex items-center gap-2 uppercase tracking-widest">
          <GitBranch size={12} /> GitHub Auto-Injection
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            className="flex-1 bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue outline-none focus:border-cyber-cyan text-[10px]"
            placeholder="HTTPS://GITHUB.COM/OWNER/REPO"
          />
          <button
            type="button"
            onClick={handleParseRepo}
            disabled={isParsing}
            className="px-4 bg-cyber-blue/10 border border-cyber-blue/40 hover:bg-cyber-blue hover:text-cyber-black transition-all flex items-center gap-2 text-[10px] uppercase font-bold"
          >
            {isParsing ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Parse
          </button>
        </div>
      </div>

    <form onSubmit={handleSubmit} className="space-y-6 text-[10px] uppercase tracking-widest">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Signal ID</label>
            <Tooltip content="Unique ecosystem identifier. Leave blank for auto-generation." />
          </div>
          <input
            type="text"
            value={formData.id}
            onChange={e => setFormData({ ...formData, id: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="AUTO_GENERATE"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Affinity</label>
            <Tooltip content="The primary environmental dimension where this entity will manifest." />
          </div>
          <select
            value={formData.environmentAffinity}
            onChange={e => setFormData({ ...formData, environmentAffinity: e.target.value as EnvironmentAffinity })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
          >
            <option value="osint">OSINT Layer</option>
            <option value="cyber">Cybersecurity</option>
            <option value="github">GitHub Signals</option>
            <option value="global">Global Influence</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="opacity-40 font-bold">Label</label>
          <input
            required
            type="text"
            value={formData.label}
            onChange={e => setFormData({ ...formData, label: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="E.G. TARGET_ALPHA"
          />
        </div>
        <div className="space-y-2">
          <label className="opacity-40 font-bold">Value</label>
          <input
            required
            type="text"
            value={formData.value}
            onChange={e => setFormData({ ...formData, value: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="E.G. 192.168.0.1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Status Marker</label>
            <Tooltip content="Real-time operational status of the entity." />
          </div>
          <input
            type="text"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="E.G. MONITORING"
          />
        </div>
        <div className="space-y-2">
          <label className="opacity-40 font-bold">Type (Metadata)</label>
          <input
            type="text"
            value={formData.metadata?.type as string}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, type: e.target.value } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="E.G. THREAT_ACTOR"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="opacity-40 font-bold">Description</label>
        <textarea
          value={formData.metadata?.description as string}
          onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, description: e.target.value } })}
          className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none h-20 resize-none font-mono text-[9px]"
          placeholder="DETAILED ENVIRONMENTAL CONTEXT..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Danger Level (1-10)</label>
            <Tooltip content="Determines systemic threat priority and visual urgency." />
          </div>
          <input
            type="number"
            min="1" max="10"
            value={formData.metadata?.dangerLevel as number}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, dangerLevel: parseInt(e.target.value) } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Render Profile</label>
            <Tooltip content="Specific visual shader and interaction logic to apply to this entity." />
          </div>
          <select
            value={formData.metadata?.renderProfile as string}
            onChange={e => setFormData({ ...formData, metadata: { ...formData.metadata!, renderProfile: e.target.value } })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
          >
            <option value="default">Default Atmospheric</option>
            <option value="high-vis">High Visibility</option>
            <option value="stealth">Stealth / Minimal</option>
            <option value="unstable">Unstable / Glitch</option>
          </select>
        </div>
      </div>

      {/* Influence Parameters */}
      <div className="space-y-4 pt-4 border-t border-cyber-blue/10">
        <label className="opacity-40 font-bold block uppercase tracking-widest flex items-center gap-2">
            Environmental Influence
            <Tooltip content="Defines how this entity mutates the global atmospheric world-state." />
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div className={`space-y-2 p-3 bg-cyber-blue/5 border ${(formData.influence?.tension || 0) > 0.8 ? 'border-cyber-red/40' : 'border-cyber-blue/10'}`}>
            <div className="flex justify-between text-[9px] mb-2">
                <span className="font-bold">Tension</span>
                <span className={(formData.influence?.tension || 0) > 0.8 ? 'text-cyber-red' : 'text-cyber-cyan'}>{(formData.influence?.tension || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.tension}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, tension: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <p className="text-[7px] opacity-30 mt-1">STIFFNESS / DAMPING</p>
          </div>
          <div className="space-y-2 p-3 bg-cyber-blue/5 border border-cyber-blue/10">
            <div className="flex justify-between text-[9px] mb-2">
                <span className="font-bold">Entropy</span>
                <span className="text-cyber-cyan">{(formData.influence?.entropy || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.entropy}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, entropy: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <p className="text-[7px] opacity-30 mt-1">RANDOMNESS / JITTER</p>
          </div>
          <div className={`space-y-2 p-3 bg-cyber-blue/5 border ${(formData.influence?.anomaly || 0) > 0.6 ? 'border-cyber-red/40' : 'border-cyber-blue/10'}`}>
            <div className="flex justify-between text-[9px] mb-2">
                <span className="font-bold">Anomaly</span>
                <span className={(formData.influence?.anomaly || 0) > 0.6 ? 'text-cyber-red' : 'text-cyber-cyan'}>{(formData.influence?.anomaly || 0).toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={formData.influence?.anomaly}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, anomaly: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
            <p className="text-[7px] opacity-30 mt-1">RARE EVENTS / FLASHES</p>
          </div>
        </div>
      </div>

      {/* Metadata Editor */}
      <div className="space-y-4 pt-4 border-t border-cyber-blue/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="opacity-40 font-bold">Extended Metadata Registry</label>
            <Tooltip content="Additional dimension-specific key-value pairs." />
          </div>
          <button type="button" onClick={addMetadata} className="text-cyber-cyan hover:bg-cyber-cyan/10 p-1 transition-colors"><Plus size={14} /></button>
        </div>
        <div className="space-y-2">
          {metadataEntries.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={k} onChange={e => updateMetadata(i, e.target.value, v)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-2 text-cyber-blue outline-none focus:border-cyber-cyan" placeholder="KEY" />
              <input type="text" value={v} onChange={e => updateMetadata(i, k, e.target.value)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-2 text-cyber-blue outline-none focus:border-cyber-cyan" placeholder="VALUE" />
              <button type="button" onClick={() => removeMetadata(i)} className="p-2 text-cyber-red/40 hover:text-cyber-red transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
          {metadataEntries.length === 0 && (
              <div className="text-center py-4 border border-dashed border-cyber-blue/10 opacity-20 text-[8px]">
                  NO EXTENDED METADATA ENTRIES
              </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue font-bold hover:bg-cyber-blue hover:text-cyber-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
      >
        <Save size={18} />
        {initialData ? 'Update System Registry' : 'Execute Injection Protocol'}
      </button>
    </form>
    </div>
  );
}

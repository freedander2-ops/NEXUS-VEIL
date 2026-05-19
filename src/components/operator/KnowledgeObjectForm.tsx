'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeObject, EnvironmentAffinity } from '@/lib/content/schema';
import { useContent } from '@/lib/content/ContentEngine';
import { GitBranch, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { fetchGithubRepoData } from '@/lib/utils/github';

interface KnowledgeObjectFormProps {
  onSubmit: (obj: KnowledgeObject) => void;
  initialData?: KnowledgeObject | null;
}

export default function KnowledgeObjectForm({ onSubmit, initialData }: KnowledgeObjectFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { objects } = useContent();
  const [formData, setFormData] = useState<Partial<KnowledgeObject>>({
    id: '',
    label: '',
    value: '',
    status: '',
    environmentAffinity: 'osint',
    influence: { tension: 0.1, entropy: 0.1, anomaly: 0 },
    metadata: {},
    lastObserved: Date.now(),
  });

  const [metadataEntries, setMetadataEntries] = useState<[string, string][]>([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);

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
        environmentAffinity: 'github'
      }));
      setMetadataEntries(Object.entries(data.metadata).map(([k, v]) => [k, String(v)]));
    }
    setIsParsing(false);
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setMetadataEntries(Object.entries(initialData.metadata).map(([k, v]) => [k, String(v)]));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metadata = Object.fromEntries(metadataEntries.filter(([k]) => k.trim() !== ''));
    onSubmit({
      ...formData as KnowledgeObject,
      id: formData.id || `obj-${Math.random().toString(36).substr(2, 9)}`,
      metadata,
      lastObserved: Date.now()
    });
  };

  const addMetadata = () => setMetadataEntries([...metadataEntries, ['', '']]);
  const removeMetadata = (index: number) => setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
  const updateMetadata = (index: number, key: string, value: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index] = [key, value];
    setMetadataEntries(newEntries);
  };

  return (
    <div className="space-y-8">
      {/* GitHub Auto-Parser */}
      <div className="p-4 bg-cyber-blue/5 border border-cyber-blue/20 space-y-3">
        <label className="text-[10px] opacity-40 font-bold flex items-center gap-2">
          <GitBranch size={12} /> GitHub Auto-Injection
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            className="flex-1 bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue outline-none focus:border-cyber-cyan"
            placeholder="https://github.com/owner/repo"
          />
          <button
            type="button"
            onClick={handleParseRepo}
            disabled={isParsing}
            className="px-4 bg-cyber-blue/10 border border-cyber-blue/40 hover:bg-cyber-blue hover:text-cyber-black transition-all flex items-center gap-2"
          >
            {isParsing ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Parse
          </button>
        </div>
      </div>

    <form onSubmit={handleSubmit} className="space-y-6 text-xs uppercase tracking-widest">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="opacity-40 font-bold">Signal ID</label>
          <input
            type="text"
            value={formData.id}
            onChange={e => setFormData({ ...formData, id: e.target.value })}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
            placeholder="AUTO_GENERATE"
          />
        </div>
        <div className="space-y-2">
          <label className="opacity-40 font-bold">Affinity</label>
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
            placeholder="e.g. TARGET_ALPHA"
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
            placeholder="e.g. 192.168.0.1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="opacity-40 font-bold">Status Marker</label>
        <input
          type="text"
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:border-cyber-cyan outline-none"
          placeholder="e.g. MONITORING"
        />
      </div>

      {/* Influence Parameters */}
      <div className="space-y-4 pt-4 border-t border-cyber-blue/10">
        <label className="opacity-40 font-bold block">Environmental Influence</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[9px]"><span>Tension</span><span>{formData.influence?.tension}</span></div>
            <input type="range" min="0" max="1" step="0.05" value={formData.influence?.tension}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, tension: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px]"><span>Entropy</span><span>{formData.influence?.entropy}</span></div>
            <input type="range" min="0" max="1" step="0.05" value={formData.influence?.entropy}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, entropy: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px]"><span>Anomaly</span><span>{formData.influence?.anomaly}</span></div>
            <input type="range" min="0" max="1" step="0.05" value={formData.influence?.anomaly}
              onChange={e => setFormData({ ...formData, influence: { ...formData.influence!, anomaly: parseFloat(e.target.value) } })}
              className="w-full accent-cyber-blue" />
          </div>
        </div>
      </div>

      {/* Metadata Editor */}
      <div className="space-y-4 pt-4 border-t border-cyber-blue/10">
        <div className="flex justify-between items-center">
          <label className="opacity-40 font-bold">Metadata Registry</label>
          <button type="button" onClick={addMetadata} className="text-cyber-cyan hover:bg-cyber-cyan/10 p-1"><Plus size={14} /></button>
        </div>
        <div className="space-y-2">
          {metadataEntries.map(([k, v], i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={k} onChange={e => updateMetadata(i, e.target.value, v)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-1 text-cyber-blue outline-none" placeholder="KEY" />
              <input type="text" value={v} onChange={e => updateMetadata(i, k, e.target.value)}
                className="flex-1 bg-cyber-black border border-cyber-blue/10 p-1 text-cyber-blue outline-none" placeholder="VALUE" />
              <button type="button" onClick={() => removeMetadata(i)} className="p-1 hover:text-cyber-red"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue font-bold hover:bg-cyber-blue hover:text-cyber-black transition-all"
      >
        Execute Injection Protocol
      </button>
    </form>
    </div>
  );
}

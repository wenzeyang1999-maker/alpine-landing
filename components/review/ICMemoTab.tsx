"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import type { DemoApi } from "@/lib/demo-api-factory";
import type { MemoSection } from "@/lib/ridgeline-data";

export function ICMemoTab({ reviewId, api }: { reviewId: string; api: DemoApi }) {
  const [sections, setSections] = useState<MemoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [historySection, setHistorySection] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const data = await api.getMemoSections(reviewId);
      setSections(data.sections || data);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, [reviewId, api]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const handleEdit = (section: MemoSection) => {
    const latest = section.versions?.[0];
    setEditingSection(section.id);
    setEditContent(latest?.content || "");
    setChangeSummary("");
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      await api.editMemoSection(editingSection, editContent, changeSummary || undefined);
      setEditingSection(null);
      await fetchSections();
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  };

  const handleShowHistory = async (sectionId: string) => {
    if (historySection === sectionId) {
      setHistorySection(null);
      return;
    }
    try {
      const data = await api.getSectionHistory(sectionId);
      setHistoryData(data.versions || data);
      setHistorySection(sectionId);
    } catch {
      /* noop */
    }
  };

  const handleRevert = async (sectionId: string, versionNum: number) => {
    try {
      await api.revertMemoSection(sectionId, versionNum);
      await fetchSections();
      setHistorySection(null);
    } catch {
      /* noop */
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-alpine-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-heading font-semibold text-br-text-primary">IC Memo</h2>
          <p className="text-[12px] text-br-text-muted mt-0.5">{sections.length} sections · Version history enabled</p>
        </div>
      </div>

      {sections.map((section) => {
        const latest = section.versions?.[0];
        const isEditing = editingSection === section.id;
        const isShowingHistory = historySection === section.id;

        return (
          <div key={section.id} className="bg-br-card border border-br rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-br flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-br-surface px-1.5 py-0.5 rounded text-br-text-muted">
                  {section.section_id}
                </span>
                <h3 className="text-[13px] font-heading font-semibold text-br-text-primary">{section.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-br-text-muted">v{section.current_version}</span>
                <button
                  onClick={() => handleShowHistory(section.id)}
                  className="text-[11px] text-br-text-muted hover:text-br-text-primary transition-colors"
                >
                  {isShowingHistory ? "Hide History" : "History"}
                </button>
                <button
                  onClick={() => handleEdit(section)}
                  className="text-[11px] text-alpine-violet hover:text-alpine-violet-light transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="p-4 space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-[200px] bg-br-surface border border-br rounded-lg p-3 text-[12px] font-body text-br-text-primary resize-y focus:outline-none focus:ring-1 focus:ring-alpine-violet"
                />
                <input
                  type="text"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="Change summary (optional)"
                  className="w-full bg-br-surface border border-br rounded-lg px-3 py-2 text-[12px] font-body text-br-text-primary placeholder:text-br-text-muted focus:outline-none focus:ring-1 focus:ring-alpine-violet"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg bg-alpine-violet text-white text-[12px] font-medium hover:bg-alpine-violet-light transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save Version"}
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-3 py-1.5 rounded-lg bg-br-surface border border-br text-br-text-secondary text-[12px] hover:text-br-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-[12px] font-body text-br-text-secondary whitespace-pre-wrap leading-relaxed">
                  {latest?.content || <span className="text-br-text-muted italic">No content</span>}
                </div>
              </div>
            )}

            {isShowingHistory && historyData.length > 0 && (
              <div className="border-t border-br bg-br-surface">
                <div className="px-4 py-2">
                  <span className="text-[10px] font-heading font-semibold text-br-text-muted uppercase tracking-wider">Version History</span>
                </div>
                <div className="divide-y divide-br">
                  {historyData.map((version: any, idx: number) => (
                    <div key={version.id || `v-${version.version_num}-${idx}`} className="px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-br-text-primary">v{version.version_num}</span>
                        {version.change_summary && (
                          <span className="text-[11px] text-br-text-muted ml-2">— {version.change_summary}</span>
                        )}
                        <span className="text-[10px] text-br-text-muted/60 ml-2">
                          {new Date(version.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {version.version_num < section.current_version && (
                        <button
                          onClick={() => handleRevert(section.id, version.version_num)}
                          className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Revert
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

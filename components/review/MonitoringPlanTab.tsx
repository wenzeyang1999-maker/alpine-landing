"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoApi } from "@/lib/demo-api-factory";
import type { MonitoringTask } from "@/lib/ridgeline-data";

export function MonitoringPlanTab({ reviewId, api }: { reviewId: string; api: DemoApi }) {
  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      const [rawTasks, s] = await Promise.all([
        api.getMonitoringTasks(reviewId),
        api.getMonitoringSummary(reviewId),
      ]);
      const flat: MonitoringTask[] = [];
      if (Array.isArray(rawTasks)) {
        flat.push(...rawTasks);
      } else {
        for (const [, items] of Object.entries(rawTasks)) {
          if (Array.isArray(items)) flat.push(...(items as MonitoringTask[]));
        }
      }
      setTasks(flat);
      setSummary(s);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, [reviewId, api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      await api.updateMonitoringTask(reviewId, taskId, { override_status: status });
      await fetchData();
    } catch {
      /* noop */
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((t) => t.category === activeFilter);
  }, [tasks, activeFilter]);

  const categories = useMemo(() => {
    const cats = new Set(tasks.map((t) => t.category));
    return ["all", ...Array.from(cats)];
  }, [tasks]);

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400 bg-emerald-500/10";
      case "completed": return "text-blue-400 bg-blue-500/10";
      case "deferred": return "text-amber-400 bg-amber-500/10";
      default: return "text-br-text-muted bg-br-surface";
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
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active", value: summary.active, color: "text-emerald-400" },
            { label: "Completed", value: summary.completed, color: "text-blue-400" },
            { label: "Deferred", value: summary.deferred, color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-br-card border border-br rounded-xl px-4 py-3 text-center">
              <p className={`text-[18px] font-mono font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-br-text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-[2px] bg-br-card rounded-lg p-[2px] w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors capitalize ${
              activeFilter === cat
                ? "bg-br-surface text-br-text-primary"
                : "text-br-text-muted hover:text-br-text-secondary"
            }`}
          >
            {cat === "all" ? "All" : cat.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="bg-br-card border border-br rounded-xl overflow-hidden divide-y divide-br/50">
        {filtered.map((task, idx) => {
          const effectiveStatus = task.override_status || task.status;
          return (
            <div key={task.id || task.task_id || idx} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-br-text-muted">{task.task_id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(effectiveStatus)}`}>
                      {effectiveStatus.toUpperCase()}
                    </span>
                    {task.frequency && (
                      <span className="text-[10px] text-br-text-muted/60">{task.frequency}</span>
                    )}
                  </div>
                  <p className="text-[12px] font-medium text-br-text-primary mt-1">{task.title}</p>
                  {task.description && (
                    <p className="text-[11px] text-br-text-muted mt-0.5">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {effectiveStatus !== "completed" && (
                    <button
                      onClick={() => handleStatusUpdate(task.task_id, "completed")}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {effectiveStatus !== "deferred" && (
                    <button
                      onClick={() => handleStatusUpdate(task.task_id, "deferred")}
                      className="text-[10px] text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                    >
                      Defer
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

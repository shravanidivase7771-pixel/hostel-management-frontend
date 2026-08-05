import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5 border border-slate-800 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-slate-800" />
      <div className="w-12 h-4 rounded-lg bg-slate-800" />
    </div>
    <div className="space-y-2">
      <div className="w-24 h-4 rounded-lg bg-slate-800" />
      <div className="w-32 h-6 rounded-lg bg-slate-800" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-card rounded-2xl p-4 border border-slate-800 animate-pulse space-y-3">
    <div className="h-8 bg-slate-800 rounded-xl w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-slate-800/50 rounded-xl w-full" />
    ))}
  </div>
);

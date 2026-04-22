import { Handle, Position, NodeProps } from '@xyflow/react';
import { memo } from 'react';

const ActionNode = ({ data, selected }: NodeProps) => {
  const isProcessing = data.isProcessing;

  const typeMap: any = {
    Start: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    End: { bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-100' },
    Approval: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    Automation: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
    Task: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' }
  };
  
  const styles = typeMap[data.type as string] || typeMap.Task;

  return (
    <div className={`px-5 py-4 shadow-2xl rounded-[20px] border-2 transition-all min-w-[200px] relative ${styles.bg} ${styles.border} ${
      selected ? 'ring-4 ring-indigo-100 scale-105' : ''
    } ${isProcessing ? 'ring-4 ring-indigo-500 animate-pulse' : ''}`}>
      
      {data.type !== 'Start' && (
        <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-slate-400 border-2 border-white" />
      )}
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          {/* ICON */}
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shadow-inner border border-slate-50">
            {data.icon}
          </div>

          <div>
            {/* ONLY ONE LABEL HERE - NO MORE DOUBLE TEXT */}
            <p className={`text-base font-bold tracking-tight ${data.type === 'End' ? 'text-white' : 'text-slate-800'}`}>
              {data.label}
            </p>
          </div>
        </div>

        {/* DESCRIPTION AREA */}
        {data.description && data.description !== 'Click to add details...' && (
          <div className="mt-2 pt-2 border-t border-black/5">
            <p className={`text-[11px] leading-relaxed italic ${data.type === 'End' ? 'text-slate-400' : 'text-slate-500'}`}>
              {data.description}
            </p>
          </div>
        )}
      </div>

      {data.type !== 'End' && (
        <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-slate-400 border-2 border-white" />
      )}
    </div>
  );
};

export default memo(ActionNode);
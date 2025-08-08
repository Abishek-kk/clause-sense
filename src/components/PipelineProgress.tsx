import { CheckCircle2, Loader2 } from "lucide-react";

interface Step { key: string; label: string }
const steps: Step[] = [
  { key: 'parse', label: 'Parse' },
  { key: 'retrieve', label: 'Retrieve' },
  { key: 'evaluate', label: 'Evaluate' },
  { key: 'render', label: 'Render' },
];

export function PipelineProgress({ current }: { current: Step["key"] }) {
  const index = steps.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-4">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${i < index ? 'bg-primary text-primary-foreground' : i === index ? 'bg-secondary' : ''}`}>
            {i < index ? <CheckCircle2 className="h-4 w-4" /> : i === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">{i+1}</span>}
          </div>
          <span className={i <= index ? 'font-medium' : 'text-muted-foreground'}>{s.label}</span>
          {i < steps.length-1 && <div className="w-8 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}

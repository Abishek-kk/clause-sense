import { DecisionResult } from "@/mockApi/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { downloadJSON } from "@/utils/download";
import { Link } from "react-router-dom";
import { FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, string> = {
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    pending: 'badge-pending',
    needs_manual_review: 'badge-pending',
  };
  const cls = map[decision] || 'badge-pending';
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>{decision.replace(/_/g,' ')}</span>;
}

export function DecisionCard({ data }: { data: DecisionResult }) {
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideDecision, setOverrideDecision] = useState<string>(data.decision);

  const merged = useMemo<DecisionResult>(() => ({
    ...data,
    decision: overrideReason ? overrideDecision : data.decision,
    manual_override: overrideReason ? { by: "agent.alex", reason: overrideReason, at: new Date().toISOString() } : data.manual_override,
  }), [data, overrideReason, overrideDecision]);

  return (
    <Card className="shadow-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-3">
            <DecisionBadge decision={merged.decision} />
            <span className="text-base font-normal text-muted-foreground">Decision result</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">Audit ID: {merged.audit_id}</div>
          {merged.manual_override && (
            <div className="text-xs">Manual override by <strong>{merged.manual_override.by}</strong> — {merged.manual_override.reason}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => downloadJSON(`audit_${merged.audit_id}.json`, merged)}>
            <FileDown className="h-4 w-4 mr-2" /> Download audit JSON
          </Button>
          <Button size="sm" onClick={() => setOverrideOpen(true)}>Override decision</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="text-2xl font-semibold">{merged.amount ? `${merged.currency} ${merged.amount.toLocaleString()}` : '—'}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Confidence</div>
            <div className="text-2xl font-semibold">{Math.round(merged.confidence*100)}%</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Clauses considered</div>
            <div className="text-2xl font-semibold">{merged.clauses_considered.length}</div>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="just">
            <AccordionTrigger className="text-base">Justification (clause-level)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {merged.justification.map((j, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{j.document} • p.{j.page}</div>
                      <Badge variant="outline">{j.clause_id.split('::')[1]}</Badge>
                    </div>
                    <blockquote className="mt-2 text-sm">“{j.quote}”</blockquote>
                    <p className="mt-2 text-sm text-muted-foreground">{j.reason}</p>
                    <div className="mt-2">
                      <Button asChild variant="link" className="px-0">
                        <Link to={`/documents/${j.clause_id.split('::')[0]}?clause=${encodeURIComponent(j.clause_id)}`}>Open in Document Viewer</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override decision</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>New decision</Label>
                <Input value={overrideDecision} onChange={(e)=>setOverrideDecision(e.target.value)} placeholder="approved | rejected | needs_manual_review" />
              </div>
              <div>
                <Label>Justification & reason code</Label>
                <Input value={overrideReason} onChange={(e)=>setOverrideReason(e.target.value)} placeholder="e.g., Medical director approval (R-104)" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setOverrideOpen(false)}>Cancel</Button>
              <Button onClick={()=> setOverrideOpen(false)}>Apply override</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

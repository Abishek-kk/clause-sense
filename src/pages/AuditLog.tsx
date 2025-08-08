import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useAppData } from "@/context/AppDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { downloadJSON } from "@/utils/download";

export default function AuditLogPage() {
  const { audits, reloadAudits } = useAppData();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => { reloadAudits(); }, []);

  const current = audits.find(a => a.audit_id === openId);

  return (
    <AppLayout>
      <SEO title="Audit Trail — LLM Document Processor" description="Every decision is reproducible with full prompts and outputs." />
      <div className="container py-8">
        <h1 className="text-2xl font-semibold mb-4">Audit trail — every decision is reproducible.</h1>
        <div className="grid gap-3">
          {audits.map(a => (
            <Card key={a.audit_id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{a.decision_summary}</CardTitle>
                  <div className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()} • {a.user}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadJSON(`audit_${a.audit_id}.json`, a.result_json)}>Download JSON</Button>
                  <Dialog open={openId===a.audit_id} onOpenChange={(v)=> setOpenId(v? a.audit_id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm">View details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Audit details — {a.audit_id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <section>
                          <div className="text-sm font-medium">LLM Prompts</div>
                          <pre className="mt-1 p-3 rounded bg-muted overflow-auto text-xs"><code>{a.prompts.parser}</code></pre>
                          <pre className="mt-1 p-3 rounded bg-muted overflow-auto text-xs"><code>{a.prompts.retriever}</code></pre>
                          <pre className="mt-1 p-3 rounded bg-muted overflow-auto text-xs"><code>{a.prompts.evaluator}</code></pre>
                        </section>
                        <section>
                          <div className="text-sm font-medium">Result JSON</div>
                          <pre className="mt-1 p-3 rounded bg-muted overflow-auto text-xs"><code>{JSON.stringify(a.result_json, null, 2)}</code></pre>
                        </section>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/context/AppDataProvider";
import { PipelineProgress } from "@/components/PipelineProgress";
import { DecisionCard } from "@/components/DecisionCard";

export default function QueryPage() {
  const { runQuery, audits, reloadAudits } = useAppData();
  const [q, setQ] = useState("46-year-old, knee surgery, Pune, 3-month policy");
  const [opts, setOpts] = useState({ explain: true, excerpts: true, full_json: true });
  const [stage, setStage] = useState<"idle" | "parse" | "retrieve" | "evaluate" | "render">("idle");
  const [result, setResult] = useState<any>(null);

  useEffect(() => { reloadAudits(); }, []);

  const go = async () => {
    setResult(null);
    setStage("parse"); await new Promise(r=>setTimeout(r, 500));
    setStage("retrieve"); await new Promise(r=>setTimeout(r, 700));
    setStage("evaluate");
    const r = await runQuery(q, "agent.alex");
    setStage("render"); await new Promise(r2=>setTimeout(r2, 300));
    setResult(r);
    setStage("idle");
  };

  return (
    <AppLayout>
      <SEO title="Query — LLM Document Processor" description="Ask natural-language questions and get clause-cited decisions." />
      <div className="container py-8 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask a question about the documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Example: “46M, knee surgery, Pune, 3-month policy”.</p>
              <Textarea value={q} onChange={(e)=>setQ(e.target.value)} className="mt-3 min-h-28" placeholder="Type your query in plain language..." />
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label>Explain reasoning</Label>
                  <Switch checked={opts.explain} onCheckedChange={(v)=>setOpts(o=>({...o, explain: v}))} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label>Return clause excerpts</Label>
                  <Switch checked={opts.excerpts} onCheckedChange={(v)=>setOpts(o=>({...o, excerpts: v}))} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label>Return full audit JSON</Label>
                  <Switch checked={opts.full_json} onCheckedChange={(v)=>setOpts(o=>({...o, full_json: v}))} />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={go}>Run query</Button>
                <Button variant="outline" onClick={()=>setQ("")}>Clear</Button>
              </div>
              {stage !== 'idle' && (
                <div className="mt-6">
                  <PipelineProgress current={stage} />
                  <p className="text-xs text-muted-foreground mt-2">Parsing query… Retrieving relevant clauses… Evaluating rules…</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <div>
              <DecisionCard data={result} />
            </div>
          )}
        </div>
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent decisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {audits.slice(0,5).map((a) => (
                <div key={a.audit_id} className="border rounded-md p-3">
                  <div className="text-sm font-medium">{a.decision_summary}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

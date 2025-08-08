import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useAppData } from "@/context/AppDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClauseItem } from "@/mockApi/types";

export default function DocumentViewerPage() {
  const { docId } = useParams();
  const [params] = useSearchParams();
  const clauseParam = params.get('clause') || undefined;
  const { documents, listClauses } = useAppData();
  const doc = documents.find(d => d.doc_id === docId);
  const [clauses, setClauses] = useState<ClauseItem[]>([]);
  const [selected, setSelected] = useState<string | undefined>(clauseParam);

  useEffect(() => { if (docId) listClauses(docId).then(setClauses); }, [docId]);
  useEffect(() => { if (clauseParam) setSelected(clauseParam); }, [clauseParam]);

  const selClause = useMemo(() => clauses.find(c => c.clause_id === selected), [clauses, selected]);

  return (
    <AppLayout>
      <SEO title={`Document Viewer — ${doc?.filename ?? docId}`} description="Inspect clause splits and metadata." />
      <div className="container py-6 grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview — Page {selClause?.page ?? 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[3/4] rounded-md border bg-muted">
                {selClause?.bbox && (
                  <div
                    className="absolute border-2 border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/20 rounded-sm animate-pulse"
                    style={{
                      left: `${selClause.bbox.x*100}%`,
                      top: `${selClause.bbox.y*100}%`,
                      width: `${selClause.bbox.w*100}%`,
                      height: `${selClause.bbox.h*100}%`,
                    }}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Highlight shows approximate clause extent on the page (simulated).</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Clauses — {doc?.filename}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clauses.map((c) => (
                <button key={c.clause_id} onClick={() => setSelected(c.clause_id)} className={`w-full text-left border rounded-md p-3 hover:bg-muted/50 ${selected===c.clause_id ? 'ring-2 ring-ring' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{c.clause_id.split('::')[1]}</span>
                    <span className="text-xs text-muted-foreground">p.{c.page} • conf {Math.round(c.confidence*100)}%</span>
                  </div>
                  <p className="mt-1 text-sm line-clamp-3">{c.text}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>Doc ID: <span className="text-muted-foreground">{doc?.doc_id}</span></div>
              <div>Pages: <span className="text-muted-foreground">{doc?.pages}</span></div>
              <div>Status: <span className="capitalize text-muted-foreground">{doc?.status}</span></div>
              {selClause && (
                <div className="pt-2 border-t">
                  <div className="font-medium">Selected Clause</div>
                  <div className="text-xs text-muted-foreground">{selClause.clause_id}</div>
                  <div className="mt-2 space-x-2">
                    <Button size="sm" variant="outline">Pin clause</Button>
                    <Button size="sm" variant="outline">Edit text</Button>
                    <Button size="sm" variant="ghost">Disable from index</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

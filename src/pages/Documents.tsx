import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useAppData } from "@/context/AppDataProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { api } from "@/mockApi/api";
import { downloadJSON } from "@/utils/download";
import { toast } from "@/hooks/use-toast";

export default function DocumentsPage() {
  const { documents, reloadDocuments, listClauses } = useAppData();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => { reloadDocuments(); }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return documents.filter(d =>
      d.filename.toLowerCase().includes(t) || d.type.includes(t) || d.status.includes(t)
    );
  }, [q, documents]);

  const reindex = async (id: string) => {
    await api.reindex(id);
    toast({ title: "Re-index triggered", description: `Document ${id} scheduled.` });
  };

  const exportClauses = async (id: string) => {
    const cls = await listClauses(id);
    downloadJSON(`${id}_clauses.json`, cls);
  };

  return (
    <AppLayout>
      <SEO title="Indexed Documents — LLM Document Processor" description="Browse and manage indexed documents." />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Indexed Documents</h1>
          <Input placeholder="Search by name, type, status" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.doc_id}>
                  <TableCell className="font-medium">{d.filename}</TableCell>
                  <TableCell className="uppercase text-xs">{d.type}</TableCell>
                  <TableCell>{new Date(d.upload_date).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{d.source}</TableCell>
                  <TableCell>{d.pages}</TableCell>
                  <TableCell>{d.size_kb} KB</TableCell>
                  <TableCell className="capitalize">{d.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/documents/${d.doc_id}`)}>Preview</Button>
                    <Button size="sm" variant="outline" onClick={() => reindex(d.doc_id)}>Re-index</Button>
                    <Button size="sm" variant="ghost" onClick={() => window.alert('Downloading original is stubbed in prototype')}>Download</Button>
                    <Button size="sm" variant="ghost" onClick={() => exportClauses(d.doc_id)}>Export clauses</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}

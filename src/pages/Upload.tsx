import { useRef, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppData } from "@/context/AppDataProvider";
import { toast } from "@/hooks/use-toast";

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useAppData();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [opts, setOpts] = useState({ ocr: true, clause_split: true, manual_review: true });

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fls = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...fls]);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const onUpload = async () => {
    setBusy(true);
    try {
      await uploadFiles(files, opts);
      toast({ title: "Indexing complete", description: "Your documents are indexed. Try a sample query!" });
      setFiles([]);
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" as any });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <SEO title="Upload Documents — LLM Document Processor" description="Upload PDF, DOCX, EML; extract clauses and index them semantically." />
      <div className="container py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Upload documents (PDF, DOCX, EML)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="rounded-lg border border-dashed p-8 text-center bg-muted/40"
              >
                <p className="text-sm text-muted-foreground">Drag & drop files here, or</p>
                <Button onClick={() => inputRef.current?.click()} variant="secondary" className="mt-3">Browse files</Button>
                <input ref={inputRef} type="file" multiple onChange={onPick} className="hidden" accept=".pdf,.docx,.eml" />
                <p className="text-xs text-muted-foreground mt-3">Supported types: PDF, DOCX, EML • Max 20MB each</p>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Files to upload</h3>
                  <ul className="space-y-2 text-sm">
                    {files.map((f, i) => (
                      <li key={i} className="flex justify-between border rounded p-2 bg-background">
                        <span>{f.name}</span>
                        <span className="text-muted-foreground">{Math.round(f.size/1024)} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <Label>Run OCR if needed</Label>
                    <p className="text-xs text-muted-foreground">Applies OCR when no text layer found</p>
                  </div>
                  <Switch checked={opts.ocr} onCheckedChange={(v) => setOpts(o => ({ ...o, ocr: v }))} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <Label>Auto-extract clauses</Label>
                    <p className="text-xs text-muted-foreground">Split by headings & lists</p>
                  </div>
                  <Switch checked={opts.clause_split} onCheckedChange={(v) => setOpts(o => ({ ...o, clause_split: v }))} />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <Label>Manual review</Label>
                    <p className="text-xs text-muted-foreground">Review clause splits after upload</p>
                  </div>
                  <Switch checked={opts.manual_review} onCheckedChange={(v) => setOpts(o => ({ ...o, manual_review: v }))} />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={onUpload} disabled={busy || files.length === 0}>
                  {busy ? "Indexing…" : "Index & continue"}
                </Button>
                <Button variant="outline" onClick={() => setFiles([])} disabled={busy}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Extraction & indexing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Extract text and OCR when needed</p>
              <p>• Split into clauses with headings & list detection</p>
              <p>• Compute embeddings and index with metadata</p>
              <p>• Ready to query in seconds</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

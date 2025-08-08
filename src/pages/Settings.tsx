import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SettingsPage() {
  const [model, setModel] = useState("gpt-4.1");
  const [embed, setEmbed] = useState("text-embedding-3-large");
  const [chunk, setChunk] = useState(800);
  const [overlap, setOverlap] = useState(120);
  const [schedule, setSchedule] = useState("daily");
  const [retention, setRetention] = useState("90d");
  const [pii, setPii] = useState(true);
  const [open, setOpen] = useState(false);

  const apply = () => setOpen(true);
  const confirmApply = () => { setOpen(false); /* stub: trigger index rebuild */ };

  return (
    <AppLayout>
      <SEO title="Settings — LLM Document Processor" description="Configure models, indexing, and retention policies." />
      <div className="container py-8 grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Models</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Embedding model</Label>
              <Select value={embed} onValueChange={setEmbed}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                  <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>LLM model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4.1">gpt-4.1</SelectItem>
                  <SelectItem value="claude-sonnet-4">claude-sonnet-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Indexing</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Chunk size</Label>
              <Input type="number" value={chunk} onChange={(e)=>setChunk(parseInt(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label>Overlap</Label>
              <Input type="number" value={overlap} onChange={(e)=>setOverlap(parseInt(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label>Index schedule</Label>
              <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Retention</Label>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="365d">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex items-center justify-between rounded-md border p-3">
              <div>
                <Label>PII redaction</Label>
                <p className="text-xs text-muted-foreground">Redact sensitive fields in UI by default</p>
              </div>
              <Switch checked={pii} onCheckedChange={setPii} />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={apply}>Apply changes</Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rebuild index with new settings?</DialogTitle>
              <DialogDescription>Changing chunk size or embedding model will require re-indexing documents. Continue?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button onClick={confirmApply}>Rebuild index</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

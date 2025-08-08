import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppData } from "@/context/AppDataProvider";
import { NavLink } from "react-router-dom";

const KPI = ({ title, value, sub }: { title: string; value: string | number; sub?: string }) => (
  <Card className="shadow-elevated">
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </CardContent>
  </Card>
);

const Index = () => {
  const { stats } = useAppData();
  return (
    <AppLayout>
      <SEO title="Dashboard — LLM Document Processor" description="Upload policies, run queries, and get auditable, clause-level decisions." />
      <section className="bg-gradient-subtle border-b">
        <div className="container py-12 lg:py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">LLM Document Processor — Decisions with Clause-Level Explainability</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl">Upload policy documents, ask natural-language questions, and get auditable decisions with exact clause references.</p>
          <div className="mt-6 flex gap-3">
            <Button asChild variant="hero" size="lg">
              <NavLink to="/query">New query</NavLink>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <NavLink to="/upload">Upload document</NavLink>
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="container py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI title="Documents indexed" value={stats?.docs ?? 0} />
          <KPI title="Queries today" value={stats?.queries_today ?? 0} />
          <KPI title="Index size (clauses)" value={stats?.index_size ?? 0} />
          <KPI title="Avg latency" value={`${Math.round((stats?.avg_latency_ms ?? 0)/100)/10}s`} />
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;

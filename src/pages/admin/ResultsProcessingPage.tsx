import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Play, CheckCircle2, Clock, Search, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react";

interface ServiceOrder {
  id: string;
  ordem_servico_ssgen: number | null;
  nome_produto: string | null;
  etapa_atual: string | null;
  client_id: string;
  client_name: string;
  result_file_path: string | null;
  numero_amostras: number | null;
  liberacao_n_amostras: number | null;
  created_at: string;
  processed_count: number;
  is_processed: boolean;
}

interface ProcessResult {
  success: boolean;
  genomic_results_inserted: number;
  females_proofs_updated: number;
  females_not_found: number;
  total_rows: number;
  mapped_columns?: string[];
  errors?: string[];
}

export default function ResultsProcessingPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ProcessResult>>({});
  const [filter, setFilter] = useState<"all" | "pending" | "processed">("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-process-results/orders", {
        method: "GET",
      });
      if (error) throw error;
      setOrders(data?.data ?? []);
    } catch (err) {
      toast.error(`Erro ao carregar ordens: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const processOrder = async (order: ServiceOrder) => {
    if (!order.result_file_path || !order.client_id) return;

    setProcessing((prev) => ({ ...prev, [order.id]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("admin-process-results/process", {
        body: {
          service_order_id: order.id,
          file_path: order.result_file_path,
          client_id: order.client_id,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResults((prev) => ({ ...prev, [order.id]: data }));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, is_processed: true, processed_count: data.genomic_results_inserted }
            : o
        )
      );

      toast.success(
        `OS ${order.ordem_servico_ssgen}: ${data.genomic_results_inserted} resultados inseridos, ${data.females_proofs_updated} femeas atualizadas`
      );
    } catch (err) {
      toast.error(`Erro OS ${order.ordem_servico_ssgen}: ${(err as Error).message}`);
    } finally {
      setProcessing((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  const processAllPending = async () => {
    const pending = filteredOrders.filter((o) => !o.is_processed && o.result_file_path);
    if (pending.length === 0) {
      toast.info("Nenhuma OS pendente para processar");
      return;
    }

    toast.info(`Processando ${pending.length} OS...`);
    for (const order of pending) {
      await processOrder(order);
    }
    toast.success("Batch concluido!");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      (o.client_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      String(o.ordem_servico_ssgen ?? "").includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !o.is_processed) ||
      (filter === "processed" && o.is_processed);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    processed: orders.filter((o) => o.is_processed).length,
    pending: orders.filter((o) => !o.is_processed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Processar Resultados Genomicos</h2>
          <p className="text-muted-foreground">
            Upload e processamento de resultados CDCB/Neogen
          </p>
        </div>
        <Button
          onClick={processAllPending}
          disabled={stats.pending === 0}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Processar Pendentes ({stats.pending})
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OS</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.processed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou OS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "processed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Todas" : f === "pending" ? "Pendentes" : "Processadas"}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
          Atualizar
        </Button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">OS</th>
                    <th className="px-4 py-3 text-left font-medium">Cliente</th>
                    <th className="px-4 py-3 text-center font-medium">Amostras</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Resultado</th>
                    <th className="px-4 py-3 text-right font-medium">Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const result = results[order.id];
                    const isProcessing = processing[order.id];
                    return (
                      <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium">
                          {order.ordem_servico_ssgen ?? "-"}
                        </td>
                        <td className="px-4 py-3 max-w-[250px] truncate" title={order.client_name}>
                          {order.client_name}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.numero_amostras ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.is_processed ? (
                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {order.processed_count} resultados
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              Pendente
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-xs">
                          {result ? (
                            <span className="text-emerald-600">
                              {result.genomic_results_inserted} GR / {result.females_proofs_updated} fem
                              {result.females_not_found > 0 && (
                                <span className="text-amber-600"> / {result.females_not_found} nf</span>
                              )}
                            </span>
                          ) : null}
                          {result?.errors && (
                            <div className="text-red-500 mt-1">
                              <AlertCircle className="inline h-3 w-3 mr-1" />
                              {result.errors.length} erro(s)
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant={order.is_processed ? "outline" : "default"}
                            onClick={() => processOrder(order)}
                            disabled={isProcessing || !order.result_file_path}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : order.is_processed ? (
                              "Reprocessar"
                            ) : (
                              <>
                                <Play className="mr-1 h-3 w-3" />
                                Processar
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Nenhuma OS encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

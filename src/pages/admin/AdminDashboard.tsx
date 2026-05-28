import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Database, RefreshCcw, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreateUsersButton } from "@/components/admin/CreateUsersButton";
import { useTranslation } from "@/hooks/useTranslation";

interface SupportTicketSummary {
  id: string;
  subject: string;
  status: string;
  updated_at: string;
}

interface TicketStats {
  total: number;
  open: number;
  resolved: number;
  averageResponseMinutes: number | null;
}

interface StorageFile {
  name: string;
  updated_at: string;
  created_at: string;
  id?: string;
  metadata?: Record<string, any> | null;
}

const ADMIN_BUCKET = import.meta.env.VITE_SUPABASE_ADMIN_BUCKET ?? "admin-files";
const EDGE_FUNCTION_NAME = import.meta.env.VITE_SUPABASE_ADMIN_EDGE_FUNCTION ?? "check-admin-role";

const normalizeTicketStats = (value: Record<string, any>): TicketStats => ({
  total: Number(value.total ?? value.total_tickets ?? 0),
  open: Number(value.open ?? value.open_tickets ?? value.pending ?? 0),
  resolved: Number(value.resolved ?? value.closed ?? value.closed_tickets ?? 0),
  averageResponseMinutes:
    typeof value.averageResponseMinutes === "number"
      ? value.averageResponseMinutes
      : typeof value.average_response_minutes === "number"
      ? value.average_response_minutes
      : null
});

export function AdminDashboard() {
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const { role, isAdmin, isLoading: roleLoading, refetch } = useUserRole();
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<SupportTicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [edgeResult, setEdgeResult] = useState<string | null>(null);
  const [edgeLoading, setEdgeLoading] = useState(false);
  const [noteSubject, setNoteSubject] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      loadDashboard();
      loadStorageFiles();
    }
  }, [isAdmin, roleLoading]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const { data: ticketStats, error: statsError } = await supabase.rpc("admin_ticket_stats" as any);

      if (statsError) {
        // admin_ticket_stats unavailable, falling back to client-side aggregation
      }

      const statsResult: TicketStats | null = ticketStats
        ? Array.isArray(ticketStats)
          ? normalizeTicketStats((ticketStats[0] ?? {}) as Record<string, any>)
          : normalizeTicketStats(ticketStats as unknown as Record<string, any>)
        : null;

      if (!statsResult) {
        const { data, error } = await supabase
          .from("support_tickets")
          .select("id, subject, status, created_at, updated_at")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const total = data?.length ?? 0;
        const open = data?.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed").length ?? 0;
        const resolved = data?.filter((ticket) => ticket.status === "resolved" || ticket.status === "closed").length ?? 0;

        setStats({
          total,
          open,
          resolved,
          averageResponseMinutes: null
        });

        setRecentTickets(
          (data ?? []).slice(0, 5).map((ticket) => ({
            id: ticket.id,
            subject: ticket.subject,
            status: ticket.status,
            updated_at: ticket.updated_at ?? ticket.created_at
          }))
        );
      } else {
        setStats(statsResult);
      }

      if (statsResult) {
        const { data: recent, error: recentError } = await supabase
          .from("support_tickets")
          .select("id, subject, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5);

        if (recentError) {
          console.error("Erro ao carregar tickets recentes", recentError);
        }

        setRecentTickets(recent ?? []);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dashboard administrativo", error);
      toast.error(error?.message ?? (isEs ? "No fue posible cargar las métricas administrativas" : isEn ? "Could not load admin metrics" : "Não foi possível carregar as métricas administrativas"));
      setStats(null);
      setRecentTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStorageFiles = async () => {
    try {
      setStorageLoading(true);
      setStorageError(null);

      const { data, error } = await supabase.storage.from(ADMIN_BUCKET).list(undefined, {
        limit: 20,
        sortBy: { column: "created_at", order: "desc" }
      });

      if (error) {
        throw error;
      }

      setStorageFiles(data ?? []);
    } catch (error: any) {
      // Error loading files from admin bucket
      setStorageError(error?.message ?? (isEs ? "No fue posible acceder al bucket configurado." : isEn ? "Could not access the configured bucket." : "Não foi possível acessar o bucket informado."));
      setStorageFiles([]);
    } finally {
      setStorageLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStorageLoading(true);
      setStorageError(null);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(isEs ? "Usuario no autenticado" : isEn ? "User not authenticated" : "Usuário não autenticado");
      }

      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(ADMIN_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: true
      });

      if (error) {
        throw error;
      }

      toast.success(isEs ? "Archivo enviado con éxito" : isEn ? "File uploaded successfully" : "Arquivo enviado com sucesso");
      loadStorageFiles();
    } catch (error: any) {
      console.error("Erro ao enviar arquivo", error);
      setStorageError(error?.message ?? (isEs ? "No fue posible enviar el archivo" : isEn ? "Could not upload the file" : "Não foi possível enviar o arquivo"));
    } finally {
      setStorageLoading(false);
      event.target.value = "";
    }
  };

  const handleEdgeFunctionCall = async () => {
    try {
      setEdgeLoading(true);
      setEdgeResult(null);

      const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_NAME, {
        body: {
          action: "check",
          role: "admin"
        }
      });

      if (error) {
        throw error;
      }

      setEdgeResult(JSON.stringify(data, null, 2));
      toast.success(isEs ? "Función Edge ejecutada con éxito" : isEn ? "Edge function executed successfully" : "Função Edge executada com sucesso");
    } catch (error: any) {
      // Optional edge function unavailable
      setEdgeResult(error?.message ?? (isEs ? "No fue posible ejecutar la función configurada" : isEn ? "Could not execute the configured function" : "Não foi possível executar a função configurada"));
    } finally {
      setEdgeLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!noteSubject.trim() || !noteContent.trim()) {
      setNoteError(isEs ? "Informe asunto y contenido para registrar un comunicado interno" : isEn ? "Please provide subject and content for the internal notice" : "Informe assunto e conteúdo para registrar um comunicado interno");
      return;
    }

    try {
      setNoteLoading(true);
      setNoteError(null);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(isEs ? "Usuario no autenticado" : isEn ? "User not authenticated" : "Usuário não autenticado");
      }

      const { error } = await (supabase as any).from("admin_notes").insert({
        subject: noteSubject.trim(),
        content: noteContent.trim(),
        created_by: user.id
      });

      if (error) {
        throw error;
      }

      toast.success(isEs ? "Comunicado registrado con éxito" : isEn ? "Notice registered successfully" : "Comunicado registrado com sucesso");
      setNoteSubject("");
      setNoteContent("");
    } catch (error: any) {
      // Optional admin_notes table unavailable
      setNoteError(error?.message ?? (isEs ? "No fue posible registrar el comunicado. Verifique si la tabla admin_notes existe." : isEn ? "Could not register the notice. Check if the admin_notes table exists." : "Não foi possível registrar o comunicado. Verifique se a tabela admin_notes existe."));
    } finally {
      setNoteLoading(false);
    }
  };

  const statsContent = useMemo(() => {
    if (!stats) return null;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isEs ? "Tickets totales" : isEn ? "Total tickets" : "Tickets totais"}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{isEs ? "Cantidad total de tickets registrados" : isEn ? "Total registered tickets" : "Quantidade total de tickets registrados"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isEs ? "En atención" : isEn ? "In progress" : "Em atendimento"}</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">{isEs ? "Tickets con estado diferente a resuelto/cerrado" : isEn ? "Tickets not resolved or closed" : "Tickets com status diferente de resolvido/fechado"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isEs ? "Resueltos" : isEn ? "Resolved" : "Resolvidos"}</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">{isEs ? "Tickets marcados como resueltos o cerrados" : isEn ? "Tickets marked as resolved or closed" : "Tickets marcados como resolvidos ou fechados"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit">{isEs ? "Rol actual" : isEn ? "Current role" : "Role atual"}: {role ?? (isEs ? "desconocido" : isEn ? "unknown" : "desconhecido")}</Badge>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{isEs ? "Bienvenido al panel de administración" : isEn ? "Welcome to the admin panel" : "Bem-vindo ao painel administrativo"}</h2>
            <p className="text-muted-foreground max-w-2xl mt-2">
              {isEs
                ? <>Todas las llamadas a continuación utilizan el cliente oficial <code>@supabase/supabase-js</code>, demostrando cómo combinar autenticación, RPC, tablas, Storage y funciones Edge con Supabase.</>
                : isEn
                ? <>All calls below use the official <code>@supabase/supabase-js</code> client, demonstrating how to combine authentication, RPC, tables, Storage and Edge functions with Supabase.</>
                : <>Todas as chamadas abaixo utilizam o cliente oficial <code>@supabase/supabase-js</code>, demonstrando como combinar autenticação, RPC, tabelas, Storage e funções Edge com o Supabase.</>}
            </p>
          </div>
          <CreateUsersButton />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
              {isEs ? "Cargando métricas…" : isEn ? "Loading metrics…" : "Carregando métricas…"}
            </div>
          </CardContent>
        </Card>
      ) : (
        statsContent
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isEs ? "Tickets recientes" : isEn ? "Recent tickets" : "Tickets recentes"}</CardTitle>
            <CardDescription>
              {isEs
                ? <>Datos cargados directamente de la tabla <code>support_tickets</code> con políticas de RLS aplicadas en Supabase.</>
                : isEn
                ? <>Data loaded directly from the <code>support_tickets</code> table with RLS policies applied in Supabase.</>
                : <>Dados carregados diretamente da tabela <code>support_tickets</code> com políticas de RLS aplicadas no Supabase.</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">{isEs ? "No se encontraron tickets recientes." : isEn ? "No recent tickets found." : "Nenhum ticket recente encontrado."}</p>
            ) : (
              recentTickets.map((ticket) => {
                const lastUpdated = ticket.updated_at ?? new Date().toISOString();
                return (
                  <div key={ticket.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{ticket.subject}</span>
                      <Badge variant="secondary">{ticket.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isEs ? "Actualizado" : isEn ? "Updated" : "Atualizado"} {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true, locale: isEn ? undefined : ptBR })}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEs ? "Función RPC de rol" : isEn ? "Role RPC function" : "Função RPC de papel"}</CardTitle>
            <CardDescription>
              {isEs
                ? <>La verificación utiliza la función <code>has_role_v2</code>. Utilice el botón a continuación para volver a verificar.</>
                : isEn
                ? <>Verification uses the <code>has_role_v2</code> function. Use the button below to recheck.</>
                : <>A verificação utiliza a função <code>has_role_v2</code>. Utilize o botão abaixo para refazer a checagem.</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              {isAdmin
                ? (isEs ? "Usted tiene derechos administrativos." : isEn ? "You have administrative rights." : "Você possui direitos administrativos.")
                : (isEs ? "No se confirmó un rol administrativo." : isEn ? "No administrative role confirmed." : "Nenhuma role administrativa confirmada.")}
            </p>
            <Button variant="outline" onClick={() => refetch()} disabled={roleLoading}>
              {isEs ? "Revalidar rol vía RPC" : isEn ? "Revalidate role via RPC" : "Revalidar role via RPC"}
            </Button>
            {roleLoading && <p className="text-xs text-muted-foreground">{isEs ? "Validando…" : isEn ? "Validating…" : "Validando…"}</p>}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEs ? "Carga segura de archivos" : isEn ? "Secure file upload" : "Upload seguro de arquivos"}</CardTitle>
            <CardDescription>
              {isEs
                ? <>Archivos almacenados en el bucket <code>{ADMIN_BUCKET}</code>. Asegúrese de otorgar permisos de lectura/escritura vía RLS/Storage Policies.</>
                : isEn
                ? <>Files stored in bucket <code>{ADMIN_BUCKET}</code>. Make sure to grant read/write permissions via RLS/Storage Policies.</>
                : <>Arquivos armazenados no bucket <code>{ADMIN_BUCKET}</code>. Certifique-se de conceder permissão de leitura/escrita via RLS/Storage Policies.</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" onChange={handleFileUpload} disabled={storageLoading} />
            {storageError && (
              <div className="flex items-start gap-2 rounded-md border border-dashed border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{storageError}</span>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{isEs ? "Archivos recientes" : isEn ? "Recent files" : "Arquivos recentes"}</h3>
              {storageLoading ? (
                <p className="text-xs text-muted-foreground">{isEs ? "Cargando lista…" : isEn ? "Loading list…" : "Carregando lista…"}</p>
              ) : storageFiles.length === 0 ? (
                <p className="text-xs text-muted-foreground">{isEs ? "No se encontraron archivos en el bucket configurado." : isEn ? "No files found in the configured bucket." : "Nenhum arquivo encontrado no bucket configurado."}</p>
              ) : (
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {storageFiles.map((file) => (
                    <li key={file.id ?? file.name} className="flex items-center justify-between gap-2 rounded border bg-muted/30 px-3 py-2">
                      <span className="truncate font-medium text-foreground">{file.name}</span>
                      <span>
                        {formatDistanceToNow(new Date(file.updated_at ?? file.created_at), {
                          addSuffix: true,
                          locale: isEn ? undefined : ptBR
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEs ? "Registrar comunicado interno" : isEn ? "Register internal notice" : "Registrar comunicado interno"}</CardTitle>
            <CardDescription>
              {isEs
                ? <>Ejemplo de escritura en tabla protegida (se espera una tabla <code>admin_notes</code> con política RLS apropiada).</>
                : isEn
                ? <>Example of writing to a protected table (expects an <code>admin_notes</code> table with appropriate RLS policy).</>
                : <>Exemplo de escrita em tabela protegida (espera-se uma tabela <code>admin_notes</code> com política RLS apropriada).</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder={isEs ? "Asunto del comunicado" : isEn ? "Notice subject" : "Assunto do comunicado"}
              value={noteSubject}
              onChange={(event) => setNoteSubject(event.target.value)}
            />
            <Textarea
              placeholder={isEs ? "Detalles y próximos pasos" : isEn ? "Details and next steps" : "Detalhes e próximos passos"}
              value={noteContent}
              onChange={(event) => setNoteContent(event.target.value)}
              rows={4}
            />
            {noteError && <p className="text-xs text-destructive">{noteError}</p>}
            <Button onClick={handleCreateNote} disabled={noteLoading}>
              {isEs ? "Registrar comunicado" : isEn ? "Register notice" : "Registrar comunicado"}
            </Button>
            <p className="text-xs text-muted-foreground">
              {isEs
                ? "Si la tabla no existe, un mensaje amigable indicará la necesidad de crearla en Supabase."
                : isEn
                ? "If the table does not exist, a friendly message will indicate the need to create it in Supabase."
                : "Caso a tabela não exista, uma mensagem amigável indicará a necessidade de criá-la no Supabase."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEs ? "Función Edge opcional" : isEn ? "Optional Edge function" : "Função Edge opcional"}</CardTitle>
          <CardDescription>
            {isEs
              ? <>Demostración de llamada a <code>{EDGE_FUNCTION_NAME}</code>. Configure una Edge Function para ejecutar verificaciones sensibles con la Service Key.</>
              : isEn
              ? <>Demo call to <code>{EDGE_FUNCTION_NAME}</code>. Configure an Edge Function to run sensitive checks with the Service Key.</>
              : <>Demonstração de chamada para <code>{EDGE_FUNCTION_NAME}</code>. Configure uma Edge Function para executar verificações sensíveis com a Service Key.</>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="secondary" onClick={handleEdgeFunctionCall} disabled={edgeLoading}>
            {isEs ? "Ejecutar función Edge" : isEn ? "Execute Edge function" : "Executar função Edge"}
          </Button>
          {edgeLoading && <p className="text-xs text-muted-foreground">{isEs ? "Llamando función Edge…" : isEn ? "Calling Edge function…" : "Chamando função Edge…"}</p>}
          {edgeResult && (
            <pre className="max-h-60 overflow-auto rounded-md bg-muted/50 p-3 text-xs">
              {edgeResult}
            </pre>
          )}
          <p className="text-xs text-muted-foreground">
            {isEs
              ? "Utilice la respuesta para habilitar flujos que requieren privilegios elevados sin exponer la Service Role al cliente."
              : isEn
              ? "Use the response to enable flows that require elevated privileges without exposing the Service Role to the client."
              : "Utilize a resposta para habilitar fluxos que exigem privilégios elevados sem expor a Service Role ao cliente."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteFarmAG, getFarmAG } from "./api";

const Field: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm">{value?.trim() ? value : "—"}</div>
  </div>
);

const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: farm, isLoading, error } = useQuery({
    queryKey: ["farms_ag", farmId],
    queryFn: () => getFarmAG(farmId!),
    enabled: !!farmId,
  });

  const del = useMutation({
    mutationFn: () => deleteFarmAG(farmId!),
    onSuccess: () => {
      toast({ title: "Fazenda excluída." });
      qc.invalidateQueries({ queryKey: ["farms_ag"] });
      navigate("/farms");
    },
    onError: (e: any) =>
      toast({
        title: "Erro ao excluir",
        description: e.message ?? String(e),
        variant: "destructive",
      }),
  });

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/farms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{farm?.name ?? "Fazenda"}</h1>
        </div>
        {farm && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/farms/${farm.id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Excluir
            </Button>
          </div>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando...</p>}
      {error && <p className="text-destructive">Erro: {(error as Error).message}</p>}

      {farm && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Nome" value={farm.name} />
              <Field label="Código" value={farm.code} />
              <Field label="País" value={farm.country} />
              <Field label="Estado" value={farm.state} />
              <Field label="Cidade" value={farm.city} />
              <Field label="Endereço" value={farm.address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Field label="Nome" value={farm.contact_name} />
              <Field label="E-mail" value={farm.contact_email} />
              <Field label="Telefone" value={farm.contact_phone} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {farm.notes?.trim() ? farm.notes : "—"}
              </p>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Criada em {new Date(farm.created_at).toLocaleString()} · Última alteração{" "}
            {new Date(farm.updated_at).toLocaleString()} · ID {farm.id}
          </div>
        </>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fazenda?</AlertDialogTitle>
            <AlertDialogDescription>
              A fazenda <strong>{farm?.name}</strong> e todas as fêmeas vinculadas serão
              removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => del.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FarmDetailPage;

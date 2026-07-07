import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteFarmAG, listFarmsAG } from "./api";
import type { FarmAG } from "./types";

const FarmsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<FarmAG | null>(null);

  const { data: farms = [], isLoading, error } = useQuery({
    queryKey: ["farms_ag"],
    queryFn: listFarmsAG,
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFarmAG(id),
    onSuccess: () => {
      toast({ title: "Fazenda excluída." });
      qc.invalidateQueries({ queryKey: ["farms_ag"] });
      setPendingDelete(null);
    },
    onError: (e: any) =>
      toast({
        title: "Erro ao excluir",
        description: e.message ?? String(e),
        variant: "destructive",
      }),
  });

  const filtered = farms.filter((f) => {
    const s = search.trim().toLowerCase();
    if (!s) return true;
    return [f.name, f.code, f.city, f.state, f.contact_name]
      .filter(Boolean)
      .some((v) => (v as string).toLowerCase().includes(s));
  });

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Fazendas (AG)</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os clientes / fazendas Accelerated Genetics.
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/farms/new")}>
          <Plus className="h-4 w-4 mr-2" /> Nova fazenda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de fazendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por nome, código, cidade, contato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {isLoading && <p className="text-muted-foreground">Carregando...</p>}
          {error && (
            <p className="text-destructive">Erro: {(error as Error).message}</p>
          )}

          {!isLoading && !error && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Cidade / Estado</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma fazenda encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">
                        <Link to={`/farms/${f.id}`} className="hover:underline">
                          {f.name}
                        </Link>
                      </TableCell>
                      <TableCell>{f.code ?? "—"}</TableCell>
                      <TableCell>
                        {[f.city, f.state].filter(Boolean).join(" / ") || "—"}
                      </TableCell>
                      <TableCell>{f.contact_name ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/farms/${f.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/farms/${f.id}/edit`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setPendingDelete(f)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fazenda?</AlertDialogTitle>
            <AlertDialogDescription>
              A fazenda <strong>{pendingDelete?.name}</strong> e todas as fêmeas
              vinculadas serão removidas permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && del.mutate(pendingDelete.id)}
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

export default FarmsListPage;

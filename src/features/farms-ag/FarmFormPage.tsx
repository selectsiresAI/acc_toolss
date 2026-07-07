import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createFarmAG, getFarmAG, updateFarmAG } from "./api";
import { FarmFormFields, emptyFarmAG } from "./FarmFormFields";
import type { FarmAGInput } from "./types";

interface Props {
  mode: "create" | "edit";
}

const FarmFormPage: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { farmId } = useParams<{ farmId: string }>();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [value, setValue] = useState<FarmAGInput>(emptyFarmAG);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["farms_ag", farmId],
    queryFn: () => getFarmAG(farmId!),
    enabled: mode === "edit" && !!farmId,
  });

  useEffect(() => {
    if (existing) {
      const { id, created_at, updated_at, created_by, ...rest } = existing;
      setValue(rest);
    }
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      if (mode === "create") return createFarmAG(value);
      return updateFarmAG(farmId!, value);
    },
    onSuccess: (farm) => {
      toast({ title: mode === "create" ? "Fazenda criada." : "Fazenda atualizada." });
      qc.invalidateQueries({ queryKey: ["farms_ag"] });
      navigate(`/farms/${farm.id}`);
    },
    onError: (e: any) =>
      toast({
        title: "Erro ao salvar",
        description: e.message ?? String(e),
        variant: "destructive",
      }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.name.trim()) {
      toast({ title: "Nome é obrigatório.", variant: "destructive" });
      return;
    }
    save.mutate();
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Nova fazenda" : "Editar fazenda"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da fazenda</CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "edit" && isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <FarmFormFields value={value} onChange={setValue} disabled={save.isPending} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={save.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {save.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmFormPage;

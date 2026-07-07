import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FarmAGInput } from "./types";

interface Props {
  value: FarmAGInput;
  onChange: (next: FarmAGInput) => void;
  disabled?: boolean;
}

const set = <K extends keyof FarmAGInput>(v: FarmAGInput, k: K, val: FarmAGInput[K]): FarmAGInput => ({
  ...v,
  [k]: val,
});

export const FarmFormFields: React.FC<Props> = ({ value, onChange, disabled }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label htmlFor="name">Nome da fazenda *</Label>
        <Input
          id="name"
          required
          value={value.name}
          onChange={(e) => onChange(set(value, "name", e.target.value))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          value={value.code ?? ""}
          onChange={(e) => onChange(set(value, "code", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="country">País</Label>
        <Input
          id="country"
          value={value.country ?? ""}
          onChange={(e) => onChange(set(value, "country", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="state">Estado</Label>
        <Input
          id="state"
          value={value.state ?? ""}
          onChange={(e) => onChange(set(value, "state", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          value={value.city ?? ""}
          onChange={(e) => onChange(set(value, "city", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={value.address ?? ""}
          onChange={(e) => onChange(set(value, "address", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="contact_name">Contato</Label>
        <Input
          id="contact_name"
          value={value.contact_name ?? ""}
          onChange={(e) => onChange(set(value, "contact_name", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="contact_email">E-mail</Label>
        <Input
          id="contact_email"
          type="email"
          value={value.contact_email ?? ""}
          onChange={(e) => onChange(set(value, "contact_email", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="contact_phone">Telefone</Label>
        <Input
          id="contact_phone"
          value={value.contact_phone ?? ""}
          onChange={(e) => onChange(set(value, "contact_phone", e.target.value || null))}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          rows={3}
          value={value.notes ?? ""}
          onChange={(e) => onChange(set(value, "notes", e.target.value || null))}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export const emptyFarmAG: FarmAGInput = {
  name: "",
  code: null,
  country: null,
  state: null,
  city: null,
  address: null,
  contact_name: null,
  contact_email: null,
  contact_phone: null,
  notes: null,
};

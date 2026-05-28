import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "@/hooks/useTranslation";

const supportSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  category: z.enum(["bug", "feature", "question", "other"]),
  subject: z.string().trim().min(5, "Assunto deve ter no mínimo 5 caracteres").max(200),
  message: z.string().trim().min(20, "Mensagem deve ter no mínimo 20 caracteres").max(2000),
});

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "question" as const,
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validated = supportSchema.parse(formData);
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("support_tickets").insert({
        user_id: user?.id,
        name: validated.name,
        email: validated.email,
        category: validated.category,
        subject: validated.subject,
        message: validated.message,
      });

      if (error) {
        console.error("Erro ao inserir support_ticket:", error);
        throw error;
      }

      toast({
        title: isEs ? "¡Mensaje enviado!" : isEn ? "Message sent!" : "Mensagem enviada!",
        description: isEs ? "Nuestro equipo responderá pronto por correo electrónico." : isEn ? "Our team will respond shortly via email." : "Nossa equipe responderá em breve por email.",
      });

      setFormData({
        name: "",
        email: "",
        category: "question",
        subject: "",
        message: "",
      });
      onOpenChange(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: isEs ? "Error al enviar" : isEn ? "Error sending" : "Erro ao enviar",
          description: isEs ? "Intente nuevamente en unos instantes." : isEn ? "Please try again shortly." : "Tente novamente em alguns instantes.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {isEs ? "Hablar con Soporte" : isEn ? "Talk to Support" : "Falar com Suporte"}
          </DialogTitle>
          <DialogDescription>
            {isEs ? "Describa su duda, problema o sugerencia. Responderemos por correo electrónico." : isEn ? "Describe your question, issue or suggestion. We'll reply by email." : "Descreva sua dúvida, problema ou sugestão. Responderemos por email."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{isEs ? "Nombre" : isEn ? "Name" : "Nome"}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isEs ? "Su nombre" : isEn ? "Your name" : "Seu nome"}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{isEs ? "Categoría" : isEn ? "Category" : "Categoria"}</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              disabled={loading}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">{isEs ? "Pregunta" : isEn ? "Question" : "Dúvida"}</SelectItem>
                <SelectItem value="bug">{isEs ? "Reportar Bug" : isEn ? "Report Bug" : "Reportar Bug"}</SelectItem>
                <SelectItem value="feature">{isEs ? "Sugerencia de Funcionalidad" : isEn ? "Feature Suggestion" : "Sugestão de Funcionalidade"}</SelectItem>
                <SelectItem value="other">{isEs ? "Otro" : isEn ? "Other" : "Outro"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{isEs ? "Asunto" : isEn ? "Subject" : "Assunto"}</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder={isEs ? "Resuma su solicitud en una línea" : isEn ? "Summarize your request in one line" : "Resuma seu pedido em uma linha"}
              disabled={loading}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{isEs ? "Mensaje" : isEn ? "Message" : "Mensagem"}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={isEs ? "Describa detalladamente su solicitud..." : isEn ? "Describe your request in detail..." : "Descreva detalhadamente sua solicitação..."}
              rows={6}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/2000 {isEs ? "caracteres" : isEn ? "characters" : "caracteres"}
            </p>
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {isEs ? "Cancelar" : isEn ? "Cancel" : "Cancelar"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEs ? "Enviando..." : isEn ? "Sending..." : "Enviando..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isEs ? "Enviar" : isEn ? "Send" : "Enviar"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

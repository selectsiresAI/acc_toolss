import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, X, Sparkles } from "lucide-react";
import { z } from "zod";
import { calculateEngagementScore } from "@/utils/engagementScore";
import { useTranslation } from "@/hooks/useTranslation";

const surveySchema = z.object({
  overall_rating: z.number().min(1).max(5),
  appearance_rating: z.number().min(1).max(5),
  charts_rating: z.number().min(1).max(5),
  clarity_rating: z.number().min(1).max(5),
  feedback: z.string().trim().max(500).optional(),
});

interface SatisfactionSurveyProps {
  forceVisible?: boolean;
  onClose?: () => void;
}

// Para DEV: 10 segundos | Para PROD: 5 minutos
const SURVEY_DELAY = import.meta.env.DEV ? 10 * 1000 : 5 * 60 * 1000;
const DISMISSAL_COUNT_KEY = "survey_dismissal_count";
const LAST_SHOWN_KEY = "satisfaction_survey_last_shown";

export function SatisfactionSurvey({ forceVisible = false, onClose }: SatisfactionSurveyProps = {}) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"qualification" | "rating" | "details">("qualification");
  const { toast } = useToast();
  const { locale } = useTranslation();
  const isEn = locale === "en-US";
  const isEs = locale === "es";
  const [user, setUser] = useState<any>(null);
  
  const [ratings, setRatings] = useState({
    overall_rating: 0,
    appearance_rating: 0,
    charts_rating: 0,
    clarity_rating: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [engagementScore, setEngagementScore] = useState<number | null>(null);
  const [dismissalCount, setDismissalCount] = useState(0);

  useEffect(() => {
    // Carregar usuário atual
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  useEffect(() => {
    // Se forceVisible está ativo, mostrar imediatamente
    if (forceVisible) {
      setVisible(true);
      setStep('qualification');
      return;
    }

    if (!user) return;

    const dismissals = parseInt(localStorage.getItem(DISMISSAL_COUNT_KEY) || '0');
    setDismissalCount(dismissals);

    // Calcular engagement score se já teve 2+ dispensas (COM FALLBACK)
    if (dismissals >= 2) {
      calculateEngagementScore(user.id)
        .then(setEngagementScore)
        .catch((error) => {
          console.debug('Failed to calculate engagement score, using 0%', error);
          setEngagementScore(0); // Permite avaliar mesmo sem tracking
        });
    }

    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    const now = Date.now();
    
    let showDelay: number;

    // Lógica de timing baseada no número de dispensas
    if (!lastShown) {
      // 1ª vez: após delay configurado
      showDelay = SURVEY_DELAY;
    } else if (dismissals === 1) {
      // 2ª vez: após 3 dias
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      const timeSinceLastShown = now - parseInt(lastShown);
      if (timeSinceLastShown < threeDays) {
        return;
      }
      showDelay = SURVEY_DELAY;
    } else {
      // 3ª+ vez: após 7 dias
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const timeSinceLastShown = now - parseInt(lastShown);
      if (timeSinceLastShown < sevenDays) {
        return;
      }
      showDelay = SURVEY_DELAY;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, showDelay);
    
    return () => clearTimeout(timer);
  }, [user, forceVisible]);

  const handleRatingClick = (category: keyof typeof ratings, value: number) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleAcceptQualification = async () => {
    // Verificar se tem engajamento suficiente (mínimo 30%)
    if (dismissalCount >= 2 && engagementScore !== null && engagementScore < 30) {
      toast({
        variant: "destructive",
        title: isEs ? "Experiencia insuficiente" : isEn ? "Insufficient experience" : "Experiência insuficiente",
        description: isEs
          ? "Por favor, use más la plataforma antes de calificar. Su uso actual: " + engagementScore + "%"
          : isEn
          ? "Please use the platform more before rating. Your current usage: " + engagementScore + "%"
          : "Por favor, use mais a plataforma antes de avaliar. Seu uso atual: " + engagementScore + "%",
      });
      handleDismissQualification("not_ready");
      return;
    }
    setStep("rating");
  };

  const handleDismissQualification = async (reason: string = "not_interested") => {
    const newCount = dismissalCount + 1;
    localStorage.setItem(DISMISSAL_COUNT_KEY, newCount.toString());
    localStorage.setItem(LAST_SHOWN_KEY, Date.now().toString());

    // Registrar dispensa no banco
    if (user) {
      await supabase.from("survey_dismissals").insert({
        user_id: user.id,
        dismissal_count: newCount,
        reason: reason,
      });
    }

    setVisible(false);
    onClose?.();
  };

  const handleNext = () => {
    if (ratings.overall_rating === 0) {
      toast({
        variant: "destructive",
        description: isEs ? "Por favor, califique la plataforma antes de continuar." : isEn ? "Please rate the platform before continuing." : "Por favor, avalie a plataforma antes de continuar.",
      });
      return;
    }
    setStep("details");
  };

  const handleSubmit = async () => {
    try {
      const validated = surveySchema.parse({
        ...ratings,
        feedback: feedback || undefined,
      });

      const { error } = await supabase.from("satisfaction_surveys").insert({
        overall_rating: validated.overall_rating,
        appearance_rating: validated.appearance_rating,
        charts_rating: validated.charts_rating,
        clarity_rating: validated.clarity_rating,
        feedback: validated.feedback,
      });

      if (error) throw error;

      toast({
        title: isEs ? "¡Gracias por sus comentarios!" : isEn ? "Thank you for your feedback!" : "Obrigado pelo feedback!",
        description: isEs ? "Sus opiniones nos ayudan a mejorar continuamente." : isEn ? "Your opinions help us improve continuously." : "Suas opiniões nos ajudam a melhorar continuamente.",
      });

      // Registrar como completado
      if (user) {
        await supabase.from("survey_dismissals").insert({
          user_id: user.id,
          dismissal_count: dismissalCount + 1,
          reason: "completed",
        });
      }

      localStorage.setItem(LAST_SHOWN_KEY, Date.now().toString());
      localStorage.setItem(DISMISSAL_COUNT_KEY, (dismissalCount + 1).toString());
      setVisible(false);
      onClose?.();
    } catch (err) {
      toast({
        variant: "destructive",
        title: isEs ? "Error al enviar" : isEn ? "Error sending" : "Erro ao enviar",
        description: isEs ? "Intente nuevamente." : isEn ? "Please try again." : "Tente novamente.",
      });
    }
  };

  const handleDismiss = () => {
    handleDismissQualification("dismissed");
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{isEs ? "¿Cómo es su experiencia?" : isEn ? "How is your experience?" : "Como está sendo sua experiência?"}</h3>
                <p className="text-sm text-muted-foreground">
                  {isEs ? "Sus comentarios nos ayudan a mejorar" : isEn ? "Your feedback helps us improve" : "Sua opinião nos ajuda a melhorar"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === "qualification" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{isEs ? "¿Le gustaría calificar la plataforma?" : isEn ? "Would you like to rate the platform?" : "Você gostaria de avaliar a plataforma?"}</h4>
                <p className="text-sm text-muted-foreground">
                  {isEs ? "Para dar una calificación útil, necesita haber usado la plataforma lo suficiente." : isEn ? "To give a useful rating, you need to have used the platform enough." : "Para dar uma avaliação útil, você precisa ter usado a plataforma o suficiente."}
                </p>
              </div>

              {dismissalCount >= 2 && engagementScore !== null && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg space-y-3">
                  <p className="text-sm font-medium">{isEs ? "Su nivel de uso de la plataforma:" : isEn ? "Your platform usage level:" : "Seu nível de uso da plataforma:"}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-green-500 transition-all duration-500"
                        style={{ width: `${engagementScore}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold tabular-nums min-w-[60px] text-right">
                      {engagementScore}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isEs ? "Basado en: tiempo de uso, páginas visitadas y funcionalidades utilizadas" : isEn ? "Based on: usage time, pages visited and features used" : "Baseado em: tempo de uso, páginas visitadas e funcionalidades utilizadas"}
                  </p>
                  {engagementScore < 30 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      {isEs ? "⚠️ Recomendamos usar más la plataforma antes de calificar (mínimo 30%)" : isEn ? "⚠️ We recommend using the platform more before rating (minimum 30%)" : "⚠️ Recomendamos usar mais a plataforma antes de avaliar (mínimo 30%)"}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDismissQualification("not_ready")}
                  className="flex-1"
                >
                  {isEs ? "Todavía no" : isEn ? "Not yet" : "Ainda não"}
                </Button>
                <Button
                  onClick={handleAcceptQualification}
                  className="flex-1"
                >
                  {isEs ? "Sí, quiero calificar" : isEn ? "Yes, I want to rate" : "Sim, quero avaliar"}
                </Button>
              </div>
            </div>
          )}

          {step === "rating" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">{isEs ? "Calificación General" : isEn ? "Overall Rating" : "Avaliação Geral"}</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick("overall_rating", value)}
                      className="group"
                    >
                      <Star
                        className={`h-10 w-10 transition-all ${
                          value <= ratings.overall_rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 group-hover:text-yellow-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("qualification")}
                  className="flex-1"
                >
                  {isEs ? "Volver" : isEn ? "Back" : "Voltar"}
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  {isEs ? "Continuar" : isEn ? "Continue" : "Continuar"}
                </Button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">{isEs ? "Apariencia" : isEn ? "Appearance" : "Aparência"}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick("appearance_rating", value)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= ratings.appearance_rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{isEs ? "Gráficos" : isEn ? "Charts" : "Gráficos"}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick("charts_rating", value)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= ratings.charts_rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{isEs ? "Claridad" : isEn ? "Clarity" : "Clareza"}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick("clarity_rating", value)}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= ratings.clarity_rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">{isEs ? "¿Qué podemos mejorar? (opcional)" : isEn ? "What can we improve? (optional)" : "O que podemos melhorar? (opcional)"}</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={isEs ? "Su sugerencia es muy importante..." : isEn ? "Your suggestion is very important..." : "Sua sugestão é muito importante..."}
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {feedback.length}/500
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("rating")}
                  className="flex-1"
                >
                  {isEs ? "Volver" : isEn ? "Back" : "Voltar"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                >
                  {isEs ? "Enviar Calificación" : isEn ? "Submit Rating" : "Enviar Avaliação"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

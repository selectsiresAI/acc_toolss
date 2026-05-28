import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/providers/I18nProvider";

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  
  const langMap = { 'pt-BR': '🇧🇷 PT', 'en-US': '🇺🇸 EN', 'es': '🇪🇸 ES' } as const;
  const flagMap = { 'pt-BR': '🇧🇷', 'en-US': '🇺🇸', 'es': '🇪🇸' } as const;
  const currentLanguage = langMap[locale] ?? '🇧🇷 PT';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="h-10 gap-2 px-3 font-medium">
          <Globe className="h-5 w-5" />
          <span className="hidden sm:inline">{currentLanguage}</span>
          <span className="sm:hidden">{flagMap[locale] ?? '🇧🇷'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setLocale('pt-BR')}
          className={`cursor-pointer ${locale === 'pt-BR' ? 'bg-accent font-semibold' : ''}`}
        >
          <span className="mr-2 text-lg">🇧🇷</span>
          <span>Português (BR)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('en-US')}
          className={`cursor-pointer ${locale === 'en-US' ? 'bg-accent font-semibold' : ''}`}
        >
          <span className="mr-2 text-lg">🇺🇸</span>
          <span>English (US)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('es')}
          className={`cursor-pointer ${locale === 'es' ? 'bg-accent font-semibold' : ''}`}
        >
          <span className="mr-2 text-lg">🇪🇸</span>
          <span>Español</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
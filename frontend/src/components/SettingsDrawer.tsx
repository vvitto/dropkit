import {useTranslation} from 'react-i18next';
import {Check, Globe} from 'lucide-react';
import {CardGlass} from '@/components/ui/card';
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle,} from '@/components/ui/drawer';
import {saveLanguage} from '@/i18n';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'English' },
] as const;

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    saveLanguage(langCode);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('settings.title')}</DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="size-4" />
              {t('settings.language')}
            </div>
            <div className="space-y-2">
              {LANGUAGES.map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <CardGlass
                    key={lang.code}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50 active:scale-[0.98]'
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{lang.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="size-5 text-primary" />
                      )}
                    </div>
                  </CardGlass>
                );
              })}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

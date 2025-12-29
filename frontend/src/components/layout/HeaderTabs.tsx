import {useTranslation} from 'react-i18next';
import {routes} from '@/navigation/routes';
import {useLocation, useNavigate} from 'react-router-dom';
import {cn} from '@/lib/utils';
import {Package, Wallet} from 'lucide-react';

export function HeaderTabs() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: routes.root, label: t('header.myProducts'), icon: Package },
    { path: routes.income, label: t('header.income'), icon: Wallet },
  ];

  return (
    <header className="sticky top-0 z-10 glass-subtle border-b border-border/50 safe-area-top">
      <div className="flex gap-2 p-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 touch-manipulation active:scale-[0.98] cursor-pointer',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="size-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

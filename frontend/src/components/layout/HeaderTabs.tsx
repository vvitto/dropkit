import {routes} from '@/navigation/routes';
import {useLocation, useNavigate} from "react-router-dom";
import {cn} from "@/lib/utils.ts";

const tabs = [
  {path: routes.root, label: 'My Products'},
  {path: routes.income, label: 'Income'},
];

export function HeaderTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="p-4 border-b">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              'text-xl font-semibold transition-colors',
              location.pathname === tab.path
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}

import {HeaderTabs} from '@/components/layout/HeaderTabs';

export function IncomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderTabs />
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground">Раздел в разработке</p>
      </div>
    </div>
  );
}

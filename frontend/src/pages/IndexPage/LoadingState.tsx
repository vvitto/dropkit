import { Card } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl skeleton shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-5 skeleton rounded-lg w-3/4" />
              <div className="h-4 skeleton rounded-full w-20" />
            </div>
            <div className="w-5 h-5 skeleton rounded shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
}

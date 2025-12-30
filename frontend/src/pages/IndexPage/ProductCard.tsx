import {generatePath, useNavigate} from 'react-router-dom';
import {ChevronRight, FileText, Star} from 'lucide-react';
import type {Product} from '@/types/product';
import {routes} from "@/navigation/routes.tsx";
import {CardGlass} from "@/components/ui/card.tsx";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <CardGlass
      onClick={() => navigate(generatePath(routes.product, { id: product.id })) }
      className="p-4 duration-200 cursor-pointer hover:border-primary/20 active:scale-[0.99] touch-manipulation"
    >
      <div className="flex items-center gap-4">
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={product.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{backgroundImage: 'url(/mini-placeholder.svg)', backgroundSize: 'cover'}}>
            <FileText className="size-6 text-primary" color={'white'}/>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate mb-1">{product.title}</h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10">
              <Star className="size-4 text-warning fill-warning" />
              <span className="text-sm font-semibold text-warning">
                {product.price_stars}
              </span>
            </div>
          </div>
        </div>

        <ChevronRight className="size-5 text-muted-foreground shrink-0" />
      </div>
    </CardGlass>
  );
}

import {generatePath, useNavigate} from 'react-router-dom';
import {ChevronRight, FileImage, Star, User} from 'lucide-react';
import type {PurchasedProduct} from '@/api/products';
import {routes} from "@/navigation/routes.tsx";
import {CardGlass} from "@/components/ui/card.tsx";

interface PurchasedProductCardProps {
  purchase: PurchasedProduct;
}

export function PurchasedProductCard({ purchase }: PurchasedProductCardProps) {
  const navigate = useNavigate();
  const { product, seller } = purchase;

  return (
    <CardGlass
        onClick={() => navigate(generatePath(routes.productOverview, { id: product.id })) }
      className="p-4"
    >
      <div className="flex items-center gap-4">
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={product.title}
            className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
            <FileImage className="size-7 text-primary/60" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate mb-1.5">{product.title}</h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
            <User className="size-4" />
            <span className="truncate">
              {seller.first_name}
              {seller.username && (
                <span className="text-primary ml-1">@{seller.username}</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 w-fit">
            <Star className="size-4 text-warning fill-warning" />
            <span className="text-sm font-semibold text-warning">
              {product.price_stars}
            </span>
          </div>
        </div>

        <ChevronRight className="size-5 text-muted-foreground shrink-0" />
      </div>
    </CardGlass>
  );
}

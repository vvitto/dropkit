import { useNavigate } from 'react-router-dom';
import { FileImage, Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PurchasedProduct } from '@/api/products';

interface PurchasedProductCardProps {
  purchase: PurchasedProduct;
}

export function PurchasedProductCard({ purchase }: PurchasedProductCardProps) {
  const navigate = useNavigate();
  const { product, seller } = purchase;

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/p/${product.id}`)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {product.cover_url ? (
            <img
              src={product.cover_url}
              alt={product.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <FileImage className="w-6 h-6 text-primary/50" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{product.title}</h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">
                {seller.first_name}
                {seller.username && (
                  <span className="text-primary ml-1">@{seller.username}</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600">
                {product.price_stars}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

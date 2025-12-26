import { CheckCircle2, FileImage, Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PublicProduct } from '@/api/products';

interface ProductCardProps {
  product: PublicProduct;
  hasAccess: boolean;
  isOwner: boolean;
}

export function ProductCard({ product, hasAccess, isOwner }: ProductCardProps) {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <ProductImage coverUrl={product.cover_url} title={product.title} />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>

          {product.description && (
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
              {product.description}
            </p>
          )}

          <ProductPrice
            priceStars={product.price_stars}
            hasAccess={hasAccess}
            isOwner={isOwner}
          />

          <ProductSeller seller={product.seller} />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductImage({ coverUrl, title }: { coverUrl?: string; title: string }) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
    );
  }

  return (
    <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
      <FileImage className="w-16 h-16 text-primary/50" />
    </div>
  );
}

interface ProductPriceProps {
  priceStars: number;
  hasAccess: boolean;
  isOwner: boolean;
}

function ProductPrice({ priceStars, hasAccess, isOwner }: ProductPriceProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10">
        <Star className="w-5 h-5 text-amber-500" />
        <span className="font-semibold text-amber-600">{priceStars}</span>
      </div>
      {hasAccess && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isOwner ? 'Ваш товар' : 'Куплено'}
          </span>
        </div>
      )}
    </div>
  );
}

interface ProductSellerProps {
  seller: {
    first_name: string;
    username?: string;
  };
}

function ProductSeller({ seller }: ProductSellerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <User className="w-4 h-4" />
      <span>
        Продавец: {seller.first_name}
        {seller.username && (
          <span className="text-primary ml-1">@{seller.username}</span>
        )}
      </span>
    </div>
  );
}

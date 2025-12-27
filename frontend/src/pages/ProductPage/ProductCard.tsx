import { CheckCircle2, FileImage, Star, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PublicProduct } from '@/api/products';

interface ProductCardProps {
  product: PublicProduct;
  hasAccess: boolean;
  isOwner: boolean;
}

export function ProductCard({ product, hasAccess, isOwner }: ProductCardProps) {
  return (
    <Card className="mb-4 overflow-hidden">
      <ProductImage coverUrl={product.cover_url} title={product.title} />
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ProductPrice priceStars={product.price_stars} />
          {hasAccess && <AccessBadge isOwner={isOwner} />}
        </div>

        <ProductSeller seller={product.seller} />
      </div>
    </Card>
  );
}

function ProductImage({ coverUrl, title }: { coverUrl?: string; title: string }) {
  if (coverUrl) {
    return (
      <div className="relative">
        <img
          src={coverUrl}
          alt={title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <FileImage className="size-10 text-primary/50" />
      </div>
    </div>
  );
}

function ProductPrice({ priceStars }: { priceStars: number }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10">
      <Star className="size-5 text-warning fill-warning" />
      <span className="font-bold text-warning">{priceStars}</span>
    </div>
  );
}

function AccessBadge({ isOwner }: { isOwner: boolean }) {
  return (
    <Badge variant="success" size="lg" className="gap-1.5">
      <CheckCircle2 className="size-4" />
      {isOwner ? 'Ваш товар' : 'Куплено'}
    </Badge>
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
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="size-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Продавец</p>
        <p className="font-medium">
          {seller.first_name}
          {seller.username && (
            <span className="text-primary ml-1">@{seller.username}</span>
          )}
        </p>
      </div>
    </div>
  );
}

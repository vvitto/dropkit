import {useTranslation} from 'react-i18next';
import {CheckCircle2, FileImage, Star, User} from 'lucide-react';
import {CardGlass} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import type {Product} from '@/api/products';

interface ProductOverviewCardProps {
  product: Product;
  hasAccess: boolean;
}

export function ProductOverviewCard({ product, hasAccess }: ProductOverviewCardProps) {
  const { t } = useTranslation();

  return (
    <CardGlass className="mb-4 overflow-hidden">
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
          {hasAccess && <AccessBadge t={t} />}
        </div>

        {product.seller && <ProductSeller seller={product.seller} t={t} />}
      </div>
    </CardGlass>
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

function AccessBadge({ t }: { t: (key: string) => string }) {
  return (
    <Badge variant="success" size="lg" className="gap-1.5">
      <CheckCircle2 className="size-4" />
      {t('productOverview.purchased')}
    </Badge>
  );
}

interface ProductSellerProps {
  seller: {
    first_name: string;
    username?: string;
  };
  t: (key: string) => string;
}

function ProductSeller({ seller, t }: ProductSellerProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="size-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{t('productOverview.seller')}</p>
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

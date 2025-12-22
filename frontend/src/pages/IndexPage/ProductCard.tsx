import {useNavigate} from 'react-router-dom';
import {FileText, Star} from 'lucide-react';
import {Card, CardContent} from '@/components/ui/card';
import type {Product} from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({product}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/p/${product.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {product.cover_url ? (
            <img
              src={product.cover_url}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{product.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {product.price_stars}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

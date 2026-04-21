import { NextResponse } from 'next/server';
import { recipes, products } from '@/lib/repo';

export async function GET() {
  const list = recipes.list().map((r) => ({
    ...r,
    ingredients: r.ingredients.map((ing) => ({
      ...ing,
      product: products.get(ing.productId),
    })),
  }));
  return NextResponse.json({ recipes: list });
}

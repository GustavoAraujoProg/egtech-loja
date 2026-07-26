// Esse tipo espelha o modelo Product do prisma/schema.prisma.
// Usamos um tipo próprio (em vez de importar `Product` de "@prisma/client")
// nos componentes de UI para não depender do client gerado nesses arquivos.
export type ProdutoCompleto = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  oldPriceCents: number | null;
  imageUrl: string;
  images: string[];
  stock: number;
  active: boolean;
};

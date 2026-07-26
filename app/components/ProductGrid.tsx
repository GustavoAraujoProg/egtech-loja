import Link from "next/link";
import { FiStar, FiShoppingCart, FiInbox } from "react-icons/fi";
import { formatarPreco } from "@/lib/format";
import type { ProdutoCompleto } from "@/lib/types";

export default function ProductGrid({
  products,
  emptyTitle = "Nenhum produto por aqui ainda.",
  emptySubtitle = "Assim que cadastrarmos produtos, eles aparecem nesta página.",
}: {
  products: ProdutoCompleto[];
  emptyTitle?: string;
  emptySubtitle?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
        <FiInbox size={40} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">{emptyTitle}</p>
        <p className="text-gray-400 text-sm mt-1">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((produto: ProdutoCompleto) => (
        <div
          key={produto.id}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
        >
          <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={produto.imageUrl}
              alt={produto.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            {produto.stock <= 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Esgotado
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex text-yellow-400 mb-3 gap-0.5">
              <FiStar fill="currentColor" size={14} />
              <FiStar fill="currentColor" size={14} />
              <FiStar fill="currentColor" size={14} />
              <FiStar fill="currentColor" size={14} />
              <FiStar fill="currentColor" size={14} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
              {produto.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
              {produto.description}
            </p>

            <div className="mt-auto">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-2xl font-black text-blue-600">
                  {formatarPreco(produto.priceCents)}
                </span>
                {produto.oldPriceCents && (
                  <span className="text-sm text-gray-400 line-through mb-1">
                    {formatarPreco(produto.oldPriceCents)}
                  </span>
                )}
              </div>
              <Link
                href={`/produto/${produto.slug}`}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <FiShoppingCart size={18} /> Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

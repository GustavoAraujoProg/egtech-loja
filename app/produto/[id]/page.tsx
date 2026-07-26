import Link from 'next/link';
import { getProductBySlug } from '@/lib/products';
import ProdutoInterativo from '../../components/ProdutoInterativo';

export const dynamic = 'force-dynamic';

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const produto = await getProductBySlug(id);

    if (!produto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Produto não encontrado</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Voltar para a página inicial</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* BREADCRUMB */}
                <nav className="text-sm text-gray-500 mb-8 flex gap-2">
                    <Link href="/" className="hover:text-blue-600">Início</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{produto.category}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{produto.name}</span>
                </nav>

                <ProdutoInterativo
                    produto={{
                        id: produto.id,
                        slug: produto.slug,
                        name: produto.name,
                        category: produto.category,
                        description: produto.description,
                        priceCents: produto.priceCents,
                        oldPriceCents: produto.oldPriceCents,
                        imageUrl: produto.imageUrl,
                        images: produto.images,
                        stock: produto.stock,
                    }}
                />
            </div>
        </main>
    );
}

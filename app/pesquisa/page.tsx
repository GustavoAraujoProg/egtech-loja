'use client';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ProductGrid from '../components/ProductGrid';
import type { ProdutoCompleto } from '@/lib/types';

export default function PesquisaPage() {
    const [termo, setTermo] = useState('');
    const [produtos, setProdutos] = useState<ProdutoCompleto[]>([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (!termo.trim()) {
            setProdutos([]);
            return;
        }

        setCarregando(true);
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(termo)}`);
                const data = await res.json();
                setProdutos(data.produtos ?? []);
            } catch {
                setProdutos([]);
            } finally {
                setCarregando(false);
            }
        }, 300); // debounce: espera parar de digitar antes de buscar

        return () => clearTimeout(timeout);
    }, [termo]);

    return (
        <main className="bg-gray-50 min-h-screen pb-20 pt-10 font-sans">
            <div className="max-w-6xl mx-auto px-4">

                {/* BARRA DE PESQUISA CENTRAL */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">O que você está procurando hoje?</h1>
                    <div className="relative flex items-center">
                        <FiSearch className="absolute left-4 text-gray-400" size={24} />
                        <input
                            type="text"
                            value={termo}
                            onChange={(e) => setTermo(e.target.value)}
                            placeholder="Digite o nome do produto, categoria ou palavra-chave (ex: fone, 4k, carregador)..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 pl-14 pr-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder-gray-400"
                        />
                    </div>
                    {termo && (
                        <p className="text-sm text-gray-500 mt-3">
                            {carregando ? 'Buscando...' : (
                                <>Resultados para: <span className="font-bold text-gray-900">&quot;{termo}&quot;</span></>
                            )}
                        </p>
                    )}
                </div>

                {termo.trim() ? (
                    <ProductGrid
                        products={produtos}
                        emptyTitle="Nenhum produto encontrado"
                        emptySubtitle='Tente buscar por palavras mais simples como "drone" ou "fone".'
                    />
                ) : (
                    <div className="text-center py-16 text-gray-400 font-medium">
                        Digite algo acima para começar a busca.
                    </div>
                )}

            </div>
        </main>
    );
}

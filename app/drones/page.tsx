import Link from 'next/link';
import { FiFilter } from 'react-icons/fi';
import ProductGrid from '../components/ProductGrid';
import { getProductsByCategory } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function DronesPage() {
    const produtos = await getProductsByCategory('drones');

    return (
        <main className="bg-gray-50 min-h-screen pb-20">
            
            {/* CABEÇALHO DA CATEGORIA */}
            <header className="bg-zinc-900 text-white py-16 border-b border-zinc-800 relative overflow-hidden">
                <img 
                    src="https://images9.kabum.com.br/produtos/fotos/sync_mirakl/612329/Drone-Profissional-E88-Pro-Dual-C-meras-4K-HD-Mobilidade-Facilitada_1728926278_gg.jpg" 
                    alt="Fundo Drones" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Drones</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Capture o mundo por um novo ângulo. Drones de alta performance com gravação em 4K e estabilização profissional.
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
                
                {/* (Filtros) */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 text-lg border-b border-gray-200 pb-4">
                        <FiFilter size={20} /> Filtros
                    </div>
                    
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-4">Categorias</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/drones" className="font-bold text-blue-600">Drones Profissionais</Link></li>
                            <li><Link href="/drones" className="hover:text-blue-600 transition-colors">Para Iniciantes</Link></li>
                            <li><Link href="/drones" className="hover:text-blue-600 transition-colors">Mini Drones</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Preço</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Até R$ 999</label></li>
                            <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> R$ 1.000 - R$ 2.999</label></li>
                            <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Acima de R$ 3.000</label></li>
                        </ul>
                    </div>
                </aside>

                {/* GRID DE PRODUTOS */}
                <section className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-gray-500 text-sm font-medium">Mostrando <span className="font-bold text-gray-900">{produtos.length}</span> produto(s)</p>
                        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer">
                            <option>Mais Populares</option>
                            <option>Menor Preço</option>
                            <option>Maior Preço</option>
                            <option>Lançamentos</option>
                        </select>
                    </div>

                    <ProductGrid products={produtos} />
                </section>
            </div>
        </main>
    );
}
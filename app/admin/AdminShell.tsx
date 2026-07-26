'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBarChart2, FiBox, FiShoppingBag, FiTruck, FiSettings } from 'react-icons/fi';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans text-zinc-950">
            {/* BARRA LATERAL (SIDEBAR FIXA) */}
            <aside className="w-full md:w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between p-6 md:sticky md:top-0 md:h-screen">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-6 border-b border-zinc-800">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div>
                            <h2 className="text-white font-black text-lg tracking-tight">EGTech Admin</h2>
                            <p className="text-xs text-zinc-500">Painel de Controle</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${pathname === '/admin' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-900 hover:text-white'}`}>
                            <FiBarChart2 size={18} className={pathname === '/admin' ? 'text-blue-500' : ''} />
                            Dashboard
                        </Link>
                        <Link href="/admin/produtos" className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${pathname === '/admin/produtos' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-900 hover:text-white'}`}>
                            <FiBox size={18} className={pathname === '/admin/produtos' ? 'text-blue-500' : ''} />
                            Produtos
                        </Link>
                        <Link href="/admin/pedidos" className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${pathname === '/admin/pedidos' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-900 hover:text-white'}`}>
                            <FiShoppingBag size={18} className={pathname === '/admin/pedidos' ? 'text-blue-500' : ''} />
                            Pedidos
                        </Link>
                        <Link href="/admin/integracao" className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${pathname === '/admin/integracao' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-900 hover:text-white'}`}>
                            <FiTruck size={18} className={pathname === '/admin/integracao' ? 'text-blue-500' : ''} />
                            Fornecedores
                        </Link>
                    </nav>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 hover:text-white font-semibold rounded-xl transition-all">
                        <FiSettings size={18} />
                        Configurações
                    </Link>
                </div>
            </aside>

            {/* ÁREA ONDE O CONTEÚDO DAS PÁGINAS VAI RENDERIZAR */}
            <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiUser, FiBox, FiChevronDown, FiX, FiLogOut, FiSettings } from 'react-icons/fi';
import { useCart } from '@/lib/cart-context';
import { logoutAction } from '../actions/auth';

type NavbarUser = { name: string; role: 'CUSTOMER' | 'ADMIN' } | null;

export default function Navbar({ user }: { user: NavbarUser }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [menuCategoriasAberto, setMenuCategoriasAberto] = useState(false);
    const [buscaAberta, setBuscaAberta] = useState(false);
    const { totalItems } = useCart();

    return (
        <nav className="bg-white border-b border-zinc-200 relative z-50">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex-shrink-0 flex items-center">
                    <img
                        src="/Logo.png"
                        alt="EGTech Logo"
                        className="h-16 w-auto object-contain scale-125 ml-4"
                    />
                </Link>

                {/* MENU CENTRAL */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Início</Link>

                    <div
                        className="relative"
                        onMouseEnter={() => setMenuCategoriasAberto(true)}
                        onMouseLeave={() => setMenuCategoriasAberto(false)}
                    >
                        <button
                            onClick={() => setMenuCategoriasAberto(!menuCategoriasAberto)}
                            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold cursor-pointer transition-colors py-2"
                        >
                            Categorias <FiChevronDown size={16} className={`mt-0.5 transition-transform duration-200 ${menuCategoriasAberto ? 'rotate-180' : ''}`} />
                        </button>

                        {menuCategoriasAberto && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50 animate-fadeIn">
                                <div className="flex flex-col py-2">
                                    <Link href="/celular" className="px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">Celulares</Link>
                                    <Link href="/fones" className="px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">Fones de Ouvido</Link>
                                    <Link href="/drones" className="px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">Drones</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/sobre" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">Sobre Nós</Link>
                </div>

                {/* MENU DIREITO (LOGIN/AVATAR + BUSCA + CARRINHO) */}
                <div className="flex items-center gap-5">

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setMenuAberto(!menuAberto)}
                                className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 hover:border-blue-600 hover:text-blue-600 text-zinc-500 flex items-center justify-center overflow-hidden transition-all cursor-pointer"
                            >
                                <FiUser size={20} />
                            </button>

                            {menuAberto && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50 animate-fadeIn">
                                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/80">
                                        <p className="text-sm font-bold text-zinc-900">Olá, {user.name}</p>
                                        <p className="text-xs text-zinc-500">{user.role === 'ADMIN' ? 'Administrador' : 'Sua conta'}</p>
                                    </div>
                                    <div className="p-2 flex flex-col">
                                        <Link href="/minha-conta" onClick={() => setMenuAberto(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                            <FiBox size={16} /> Minhas compras
                                        </Link>
                                        <Link href="/meu-perfil" onClick={() => setMenuAberto(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                            <FiUser size={16} /> Meu perfil
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin" onClick={() => setMenuAberto(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                                <FiSettings size={16} /> Painel admin
                                            </Link>
                                        )}

                                        <div className="h-px bg-zinc-100 my-1 mx-2"></div>
                                        <form action={logoutAction}>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <FiLogOut size={16} /> Sair
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/cadastro" className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors">
                                Crie sua conta
                            </Link>
                            <Link
                                href="/login"
                                className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer inline-block"
                            >
                                Entre
                            </Link>
                        </div>
                    )}

                    <div className="w-px h-6 bg-zinc-300 hidden sm:block mx-1"></div>

                    <div className="flex items-center gap-5">
                        <Link href="/pesquisa" className="text-zinc-700 hover:text-blue-600 transition-colors">
                            <FiSearch size={22} />
                        </Link>

                        <Link href="/carrinho" className="relative text-zinc-700 hover:text-blue-600 transition-colors">
                            <FiShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}

'use client';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShield, FiTruck } from 'react-icons/fi';
import { useCart, formatarPreco } from '@/lib/cart-context';

export default function CarrinhoPage() {
    const { items, setQuantity, removeItem, totalCents } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <div className="p-6 bg-white rounded-full shadow-sm mb-6 border border-gray-100">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Seu carrinho está vazio</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Explore nosso catálogo de alta performance e encontre o setup ideal para você.</p>
                <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md">
                    Voltar para a Loja
                </Link>
            </div>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Carrinho de Compras</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* LISTA DE PRODUTOS */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.productId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                                        <p className="text-blue-600 font-black text-xl mt-2">{formatarPreco(item.priceCents)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                    <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg p-1">
                                        <button onClick={() => setQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-white rounded-md text-gray-500 transition-colors">
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="px-4 font-bold text-gray-800 text-sm">{item.quantity}</span>
                                        <button onClick={() => setQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-white rounded-md text-gray-500 transition-colors">
                                            <FiPlus size={14} />
                                        </button>
                                    </div>

                                    <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500 p-2 transition-colors" title="Remover produto">
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RESUMO DO PEDIDO */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

                            <div className="space-y-4 text-sm text-gray-600 pb-6 border-b border-gray-100">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">{formatarPreco(totalCents)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Frete</span>
                                    <span className="text-green-600 font-bold">Grátis</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-6 mb-8">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-black text-blue-600 tracking-tight">{formatarPreco(totalCents)}</span>
                            </div>

                            <Link href="/checkout" className="w-full bg-zinc-900 hover:bg-black text-white text-center font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg group">
                                Finalizar Compra <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Selos de Confiança */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <FiShield className="text-blue-600 shrink-0" size={18} />
                                <span><strong>Compra Protegida:</strong> Seus dados financeiros são totalmente criptografados.</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <FiTruck className="text-blue-600 shrink-0" size={18} />
                                <span><strong>Envio Garantido:</strong> Código de rastreio enviado automaticamente por e-mail e WhatsApp.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

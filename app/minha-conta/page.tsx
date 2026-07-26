import Link from 'next/link';
import { FiBox, FiUser, FiSettings, FiPackage } from 'react-icons/fi';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatarPreco } from '@/lib/format';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, { texto: string; cor: string }> = {
    PENDING: { texto: 'Aguardando pagamento', cor: 'bg-amber-50 text-amber-600' },
    CONFIRMED: { texto: 'Pagamento confirmado', cor: 'bg-blue-50 text-blue-600' },
    PAID: { texto: 'Pago', cor: 'bg-emerald-50 text-emerald-600' },
    DECLINED: { texto: 'Pagamento recusado', cor: 'bg-red-50 text-red-600' },
    CANCELED: { texto: 'Cancelado', cor: 'bg-gray-100 text-gray-500' },
    REFUNDED: { texto: 'Estornado', cor: 'bg-gray-100 text-gray-500' },
};

export default async function MinhaContaPage() {
    const user = await getCurrentUser();
    if (!user) return null; // o proxy já redireciona antes de chegar aqui

    const pedidos = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
    });

    const iniciais = user.name.split(' ').slice(0, 2).map((p: string) => p[0]).join('').toUpperCase();

    return (
        <main className="bg-gray-50 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-zinc-950 p-6 rounded-3xl text-white mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mb-4">{iniciais}</div>
                        <h2 className="font-bold text-lg">{user.name}</h2>
                        <p className="text-zinc-400 text-sm">{user.email}</p>
                    </div>
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 bg-white text-blue-600 font-bold p-4 rounded-2xl shadow-sm border border-blue-100 transition-all"><FiBox size={20}/> Meus Pedidos</button>
                        <Link href="/meu-perfil" className="w-full flex items-center gap-3 text-gray-600 hover:bg-white hover:shadow-sm p-4 rounded-2xl transition-all font-medium"><FiUser size={20}/> Meu Perfil</Link>
                        {user.role === 'ADMIN' && (
                            <Link href="/admin" className="w-full flex items-center gap-3 text-gray-600 hover:bg-white hover:shadow-sm p-4 rounded-2xl transition-all font-medium"><FiSettings size={20}/> Painel Admin</Link>
                        )}
                    </nav>
                </aside>

                <section className="flex-1 space-y-6">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Pedidos</h1>

                    {pedidos.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center">
                            <FiPackage size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Você ainda não fez nenhum pedido.</p>
                            <Link href="/" className="text-blue-600 font-bold hover:underline text-sm mt-2 inline-block">Ir às compras</Link>
                        </div>
                    ) : (
                        pedidos.map((pedido: {
                            id: string;
                            status: string;
                            items: { productName: string }[];
                            createdAt: Date;
                            totalCents: number;
                        }) => {
                            const status = STATUS_LABEL[pedido.status] ?? STATUS_LABEL.PENDING;
                            return (
                                <Link
                                    key={pedido.id}
                                    href={`/pedido/${pedido.id}`}
                                    className="block bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                Pedido #{pedido.id.slice(-8).toUpperCase()}
                                            </p>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {pedido.items.map((i) => i.productName).join(', ')}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${status.cor}`}>
                                            {status.texto}
                                        </span>
                                    </div>
                                    <p className="text-xl font-black text-blue-600">{formatarPreco(pedido.totalCents)}</p>
                                </Link>
                            );
                        })
                    )}
                </section>

            </div>
        </main>
    );
}

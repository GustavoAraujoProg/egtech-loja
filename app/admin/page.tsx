import Link from 'next/link';
import { FiDollarSign, FiShoppingBag, FiClock, FiArrowUpRight, FiTrendingUp } from 'react-icons/fi';
import { prisma } from '@/lib/prisma';
import { formatarPreco } from '@/lib/format';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
    PENDING: 'Aguardando pagamento',
    CONFIRMED: 'Confirmado',
    PAID: 'Pago',
    DECLINED: 'Recusado',
    CANCELED: 'Cancelado',
    REFUNDED: 'Estornado',
};

export default async function AdminDashboard() {
    const [pedidosPagos, pedidosPendentes, ultimosPedidos] = await Promise.all([
        prisma.order.findMany({ where: { status: { in: ['PAID', 'CONFIRMED'] } }, select: { totalCents: true } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 8,
            include: { user: { select: { name: true } } },
        }),
    ]);

    const faturamento = pedidosPagos.reduce((soma: number, p: { totalCents: number }) => soma + p.totalCents, 0);
    const ticketMedio = pedidosPagos.length > 0 ? Math.round(faturamento / pedidosPagos.length) : 0;

    return (
        <div className="animate-fadeIn">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Visão Geral</h1>
                    <p className="text-zinc-500 mt-1">Métricas da sua loja em tempo real.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Faturamento</span>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FiDollarSign size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900">{formatarPreco(faturamento)}</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">Pedidos pagos ou confirmados</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Ticket Médio</span>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><FiTrendingUp size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-black text-emerald-600">{formatarPreco(ticketMedio)}</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">Por pedido pago</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Pedidos Pagos</span>
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><FiShoppingBag size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900">{pedidosPagos.length}</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">Confirmados ou pagos</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Aguardando Pagamento</span>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><FiClock size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900">{pedidosPendentes}</h3>
                    <p className="text-xs text-amber-600 font-semibold mt-1">Ex: PIX gerado, não pago ainda</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900">Últimos Pedidos</h2>
                        <p className="text-sm text-zinc-500">Os 8 pedidos mais recentes da loja.</p>
                    </div>
                    <Link href="/admin/pedidos" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                        Ver todos <FiArrowUpRight />
                    </Link>
                </div>

                {ultimosPedidos.length === 0 ? (
                    <div className="h-40 flex items-center justify-center bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                        <p className="text-zinc-400 font-medium">Assim que a primeira venda acontecer, ela aparece aqui.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-100">
                                    <th className="py-3 px-2">Cliente</th>
                                    <th className="py-3 px-2">Total</th>
                                    <th className="py-3 px-2">Status</th>
                                    <th className="py-3 px-2">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
                                {ultimosPedidos.map((pedido: { id: string; user: { name: string }; totalCents: number; status: string; createdAt: Date }) => (
                                    <tr key={pedido.id}>
                                        <td className="py-3 px-2 font-semibold text-zinc-900">{pedido.user.name}</td>
                                        <td className="py-3 px-2">{formatarPreco(pedido.totalCents)}</td>
                                        <td className="py-3 px-2">{STATUS_LABEL[pedido.status] ?? pedido.status}</td>
                                        <td className="py-3 px-2 text-zinc-500">{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}

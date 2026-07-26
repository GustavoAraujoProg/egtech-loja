import Link from 'next/link';
import { FiEye } from 'react-icons/fi';
import { prisma } from '@/lib/prisma';
import { formatarPreco } from '@/lib/format';
import EnviarFornecedorButton from './EnviarFornecedorButton';

export const dynamic = 'force-dynamic';

const STATUS_INFO: Record<string, { texto: string; cor: string }> = {
    PENDING: { texto: 'Aguardando pagamento', cor: 'bg-amber-100 text-amber-700' },
    CONFIRMED: { texto: 'Confirmado', cor: 'bg-blue-100 text-blue-700' },
    PAID: { texto: 'Pago', cor: 'bg-green-100 text-green-700' },
    DECLINED: { texto: 'Recusado', cor: 'bg-red-100 text-red-700' },
    CANCELED: { texto: 'Cancelado', cor: 'bg-zinc-200 text-zinc-600' },
    REFUNDED: { texto: 'Estornado', cor: 'bg-zinc-200 text-zinc-600' },
};

const FILTROS = [
    { value: '', label: 'Todos' },
    { value: 'PENDING', label: 'Aguardando' },
    { value: 'PAID', label: 'Pagos' },
    { value: 'DECLINED', label: 'Recusados' },
];

export default async function AdminPedidos({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;

    const pedidos = await prisma.order.findMany({
        where: status ? { status: status as any } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true, phone: true } },
            items: { select: { productName: true, quantity: true, unitPriceCents: true } },
        },
        take: 100,
    });

    return (
        <div className="animate-fadeIn">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Gestão de Pedidos</h1>
                    <p className="text-zinc-500 mt-1">Acompanhe as vendas e o status de pagamento.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {FILTROS.map((f) => (
                    <Link
                        key={f.value}
                        href={f.value ? `/admin/pedidos?status=${f.value}` : '/admin/pedidos'}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                            (status ?? '') === f.value
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                    >
                        {f.label}
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-100">
                                <th className="py-4 px-6">Pedido</th>
                                <th className="py-4 px-6">Data</th>
                                <th className="py-4 px-6">Cliente</th>
                                <th className="py-4 px-6">Total</th>
                                <th className="py-4 px-6">Forma</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
                            {pedidos.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-zinc-400">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            )}
                            {pedidos.map((pedido: {
                                id: string;
                                createdAt: Date;
                                user: { name: string; email: string; phone: string | null };
                                totalCents: number;
                                paymentMethod: string;
                                status: string;
                                addressSnapshot: {
                                    street: string;
                                    number: string;
                                    complement?: string;
                                    neighborhood: string;
                                    city: string;
                                    state: string;
                                    cep: string;
                                };
                                items: { productName: string; quantity: number; unitPriceCents: number }[];
                            }) => {
                                const info = STATUS_INFO[pedido.status] ?? STATUS_INFO.PENDING;
                                return (
                                    <tr key={pedido.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="py-4 px-6 font-black text-zinc-900">#{pedido.id.slice(-6).toUpperCase()}</td>
                                        <td className="py-4 px-6 font-medium text-zinc-500">
                                            {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-4 px-6 font-semibold">
                                            {pedido.user.name}
                                            <div className="text-xs text-zinc-400 font-normal">{pedido.user.email}</div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-zinc-900">{formatarPreco(pedido.totalCents)}</td>
                                        <td className="py-4 px-6 text-zinc-500">
                                            {pedido.paymentMethod === 'PIX' ? 'PIX' : 'Cartão'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.cor}`}>{info.texto}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <EnviarFornecedorButton
                                                    pedidoId={pedido.id}
                                                    clienteNome={pedido.user.name}
                                                    clienteTelefone={pedido.user.phone}
                                                    endereco={pedido.addressSnapshot}
                                                    items={pedido.items}
                                                />
                                                <Link href={`/pedido/${pedido.id}`} className="text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer inline-block">
                                                    <FiEye size={20} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

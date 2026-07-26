import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCheckCircle, FiClock, FiXCircle, FiCopy, FiTruck } from 'react-icons/fi';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { formatarPreco } from '@/lib/format';
import StatusPoller from '../../components/StatusPoller';

export const dynamic = 'force-dynamic';

const STATUS_INFO: Record<string, { label: string; cor: string; icone: React.ReactNode }> = {
  PENDING: { label: 'Aguardando pagamento', cor: 'text-amber-600 bg-amber-50', icone: <FiClock /> },
  CONFIRMED: { label: 'Pagamento confirmado', cor: 'text-blue-600 bg-blue-50', icone: <FiCheckCircle /> },
  PAID: { label: 'Pagamento recebido', cor: 'text-emerald-600 bg-emerald-50', icone: <FiCheckCircle /> },
  DECLINED: { label: 'Pagamento recusado', cor: 'text-red-600 bg-red-50', icone: <FiXCircle /> },
  CANCELED: { label: 'Cancelado', cor: 'text-gray-600 bg-gray-100', icone: <FiXCircle /> },
  REFUNDED: { label: 'Estornado', cor: 'text-gray-600 bg-gray-100', icone: <FiXCircle /> },
};

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 text-center px-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Entre na sua conta para ver este pedido</h1>
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">Fazer login</Link>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== user.id) {
    notFound();
  }

  const info = STATUS_INFO[order.status] ?? STATUS_INFO.PENDING;
  const endereco = order.addressSnapshot as {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <StatusPoller orderId={order.id} statusAtual={order.status} />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-400 font-medium">Pedido</p>
              <h1 className="text-2xl font-black text-gray-900">#{order.id.slice(-8).toUpperCase()}</h1>
            </div>
            <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${info.cor}`}>
              {info.icone} {info.label}
            </span>
          </div>

          {order.status === 'PENDING' && order.paymentMethod === 'PIX' && order.pixQrCodeImage && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center mb-6">
              <p className="text-sm text-zinc-600 mb-4">
                Ainda não identificamos o pagamento. Escaneie o QR Code ou copie o código abaixo — assim que o PIX cair, esta página atualiza sozinha.
              </p>
              <img
                src={`data:image/png;base64,${order.pixQrCodeImage}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto mb-4 border border-zinc-100 rounded-xl"
              />
              {order.pixCopiaECola && (
                <p className="text-xs bg-white border border-zinc-200 rounded-lg p-3 break-all text-zinc-500 flex items-center gap-2 justify-center">
                  <FiCopy className="shrink-0" /> {order.pixCopiaECola}
                </p>
              )}
            </div>
          )}

          {order.status === 'DECLINED' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-sm text-red-700">
              {order.declineReason ?? 'O pagamento foi recusado.'}
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 space-y-4">
            {order.items.map((item: { id: string; quantity: number; productName: string; unitPriceCents: number }) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.productName}</span>
                <span className="font-semibold text-gray-900">{formatarPreco(item.unitPriceCents * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-blue-600">{formatarPreco(order.totalCents)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiTruck className="text-blue-600" /> Endereço de entrega</h2>
          <p className="text-sm text-gray-600">
            {endereco.street}, {endereco.number} {endereco.complement ? `- ${endereco.complement}` : ''}<br />
            {endereco.neighborhood} - {endereco.city}/{endereco.state}<br />
            CEP {endereco.cep}
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/minha-conta" className="text-blue-600 font-semibold hover:underline">Ver todos os meus pedidos</Link>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiTruck, FiCopy, FiMessageCircle, FiX } from 'react-icons/fi';
import { formatarPreco } from '@/lib/format';

type ItemPedido = {
    productName: string;
    quantity: number;
    unitPriceCents: number;
};

type EnderecoPedido = {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
};

export default function EnviarFornecedorButton({
    pedidoId,
    clienteNome,
    clienteTelefone,
    endereco,
    items,
}: {
    pedidoId: string;
    clienteNome: string;
    clienteTelefone: string | null;
    endereco: EnderecoPedido;
    items: ItemPedido[];
}) {
    const [aberto, setAberto] = useState(false);

    const texto = [
        `📦 Novo pedido EGTech #${pedidoId.slice(-8).toUpperCase()}`,
        '',
        'Produtos:',
        ...items.map((i) => `• ${i.quantity}x ${i.productName} — ${formatarPreco(i.unitPriceCents * i.quantity)}`),
        '',
        'Enviar para:',
        clienteNome,
        `${endereco.street}, ${endereco.number}${endereco.complement ? ` - ${endereco.complement}` : ''}`,
        `${endereco.neighborhood} - ${endereco.city}/${endereco.state}`,
        `CEP: ${endereco.cep}`,
        clienteTelefone ? `Telefone: ${clienteTelefone}` : '',
    ].filter(Boolean).join('\n');

    const copiar = () => {
        navigator.clipboard.writeText(texto);
        toast.success('Texto copiado!');
    };

    const abrirWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
    };

    return (
        <>
            <button
                onClick={() => setAberto(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-blue-600 transition-colors border border-zinc-200 hover:border-blue-200 rounded-lg px-3 py-1.5"
            >
                <FiTruck size={14} /> Enviar ao fornecedor
            </button>

            {aberto && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAberto(false)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-zinc-900 text-lg">Pedido pronto pro fornecedor</h3>
                            <button onClick={() => setAberto(false)} className="text-zinc-400 hover:text-zinc-600">
                                <FiX size={20} />
                            </button>
                        </div>

                        <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 whitespace-pre-wrap mb-4 max-h-64 overflow-y-auto font-sans">
                            {texto}
                        </pre>

                        <div className="flex gap-3">
                            <button
                                onClick={copiar}
                                className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-3 rounded-xl transition-colors"
                            >
                                <FiCopy size={16} /> Copiar texto
                            </button>
                            <button
                                onClick={abrirWhatsApp}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                <FiMessageCircle size={16} /> Abrir no WhatsApp
                            </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-4">
                            Isso não envia nada sozinho — só monta o texto pra você mandar pro fornecedor (WhatsApp, e-mail, ou onde preferir).
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

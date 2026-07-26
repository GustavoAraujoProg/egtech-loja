'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiShield, FiCreditCard, FiSmartphone, FiTruck, FiLoader, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { useCart, formatarPreco } from '@/lib/cart-context';

export default function Checkout() {
    const router = useRouter();
    const { items, totalCents, clear } = useCart();

    const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix'>('cartao');
    const [enviando, setEnviando] = useState(false);

    const [cpfCnpj, setCpfCnpj] = useState('');
    const [telefone, setTelefone] = useState('');

    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [buscandoCep, setBuscandoCep] = useState(false);

    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeCartao, setNomeCartao] = useState('');
    const [validade, setValidade] = useState('');
    const [cvv, setCvv] = useState('');

    const [pix, setPix] = useState<{ qrCodeImage: string; copiaECola: string } | null>(null);
    const [pedidoId, setPedidoId] = useState<string | null>(null);

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        setCep(valor);

        const cepLimpo = valor.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            setBuscandoCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setRua(data.logradouro);
                    setBairro(data.bairro);
                    setCidade(data.localidade);
                    setEstado(data.uf);
                } else {
                    toast.error('CEP não encontrado.');
                }
            } catch {
                toast.error('Erro ao buscar o CEP.');
            } finally {
                setBuscandoCep(false);
            }
        }
    };

    const copiarCodigoPix = () => {
        if (!pix) return;
        navigator.clipboard.writeText(pix.copiaECola);
        toast.success('Código copiado!');
    };

    const handleFinalizarPedido = async () => {
        if (items.length === 0) {
            toast.error('Seu carrinho está vazio.');
            return;
        }
        if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
            toast.error('Preencha o endereço de entrega completo.');
            return;
        }
        if (!cpfCnpj || !telefone) {
            toast.error('Informe seu CPF/CNPJ e telefone.');
            return;
        }
        if (metodoPagamento === 'cartao' && (!numeroCartao || !nomeCartao || !validade || !cvv)) {
            toast.error('Preencha todos os dados do cartão.');
            return;
        }

        setEnviando(true);
        try {
            const [mes, anoCurto] = validade.split('/');
            const ano = anoCurto?.length === 2 ? `20${anoCurto}` : anoCurto;

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                    address: {
                        cep: cep.replace(/\D/g, ''),
                        street: rua,
                        number: numero,
                        complement: complemento || undefined,
                        neighborhood: bairro,
                        city: cidade,
                        state: estado.toUpperCase(),
                    },
                    cpfCnpj: cpfCnpj.replace(/\D/g, ''),
                    phone: telefone.replace(/\D/g, ''),
                    paymentMethod: metodoPagamento === 'cartao' ? 'CREDIT_CARD' : 'PIX',
                    card:
                        metodoPagamento === 'cartao'
                            ? {
                                  holderName: nomeCartao,
                                  number: numeroCartao.replace(/\D/g, ''),
                                  expiryMonth: mes,
                                  expiryYear: ano,
                                  ccv: cvv,
                              }
                            : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? 'Não foi possível finalizar o pedido.');
                return;
            }

            if (data.status === 'DECLINED') {
                toast.error(data.error ?? 'Pagamento recusado. Confira os dados do cartão.');
                return;
            }

            if (data.status === 'CONFIRMED') {
                clear();
                toast.success('Pagamento aprovado!');
                router.push(`/pedido/${data.orderId}`);
                return;
            }

            if (data.pix) {
                clear();
                setPedidoId(data.orderId);
                setPix({ qrCodeImage: data.pix.qrCodeImage, copiaECola: data.pix.copiaECola });
            }
        } catch {
            toast.error('Erro de conexão. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    if (pix && pedidoId) {
        return (
            <div className="bg-zinc-50 min-h-screen py-16 px-4 flex items-center justify-center">
                <div className="bg-white max-w-md w-full rounded-3xl border border-zinc-200 shadow-sm p-8 text-center">
                    <FiCheckCircle className="mx-auto text-emerald-500 mb-4" size={40} />
                    <h1 className="text-2xl font-black text-zinc-900 mb-2">Escaneie para pagar</h1>
                    <p className="text-zinc-500 text-sm mb-6">
                        Abra o app do seu banco, escolha pagar com PIX e escaneie o QR Code abaixo.
                    </p>
                    <img
                        src={`data:image/png;base64,${pix.qrCodeImage}`}
                        alt="QR Code PIX"
                        className="w-56 h-56 mx-auto mb-6 border border-zinc-100 rounded-xl"
                    />
                    <button
                        onClick={copiarCodigoPix}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-3 rounded-xl transition-colors mb-4"
                    >
                        <FiCopy size={16} /> Copiar código Pix Copia e Cola
                    </button>
                    <a
                        href={`/pedido/${pedidoId}`}
                        className="text-blue-600 font-semibold text-sm hover:underline"
                    >
                        Já paguei, ver status do pedido
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-200">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Finalizar Compra</h1>
                        <p className="text-zinc-500 mt-1">Quase lá! Preencha os dados abaixo.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium text-sm">
                        <FiShield size={20} />
                        Ambiente 100% Seguro
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-6">

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <FiTruck className="text-blue-600" /> Endereço de Entrega
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                <div className="md:col-span-4 relative">
                                    <label className="text-sm font-semibold text-zinc-700">CEP</label>
                                    <input
                                        type="text"
                                        maxLength={9}
                                        value={cep}
                                        onChange={handleCepChange}
                                        placeholder="00000-000"
                                        className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                    {buscandoCep && (
                                        <div className="absolute right-3 top-10 text-blue-600 animate-spin">
                                            <FiLoader size={20} />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-8">
                                    <label className="text-sm font-semibold text-zinc-700">Rua / Avenida</label>
                                    <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="text-sm font-semibold text-zinc-700">Número</label>
                                    <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="1000" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-8">
                                    <label className="text-sm font-semibold text-zinc-700">Complemento (Opcional)</label>
                                    <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto, Bloco, Casa 2" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-5">
                                    <label className="text-sm font-semibold text-zinc-700">Bairro</label>
                                    <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-5">
                                    <label className="text-sm font-semibold text-zinc-700">Cidade</label>
                                    <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-zinc-700">UF</label>
                                    <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all uppercase" />
                                </div>

                                <div className="md:col-span-6">
                                    <label className="text-sm font-semibold text-zinc-700">CPF ou CNPJ</label>
                                    <input type="text" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} placeholder="000.000.000-00" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>

                                <div className="md:col-span-6">
                                    <label className="text-sm font-semibold text-zinc-700">Telefone / WhatsApp</label>
                                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <FiShield className="text-blue-600" /> Pagamento
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setMetodoPagamento('cartao')}
                                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${metodoPagamento === 'cartao' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-zinc-200 hover:border-blue-300 text-zinc-500'}`}
                                >
                                    <FiCreditCard size={24} />
                                    <span className="font-bold text-sm">Cartão de Crédito</span>
                                </button>
                                <button
                                    onClick={() => setMetodoPagamento('pix')}
                                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all cursor-pointer ${metodoPagamento === 'pix' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zinc-200 hover:border-emerald-300 text-zinc-500'}`}
                                >
                                    <FiSmartphone size={24} />
                                    <span className="font-bold text-sm">PIX (Aprovação na hora)</span>
                                </button>
                            </div>

                            {metodoPagamento === 'cartao' && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div>
                                        <label className="text-sm font-semibold text-zinc-700">Número do Cartão</label>
                                        <input type="text" value={numeroCartao} onChange={(e) => setNumeroCartao(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-zinc-700">Nome Impresso no Cartão</label>
                                        <input type="text" value={nomeCartao} onChange={(e) => setNomeCartao(e.target.value.toUpperCase())} placeholder="CARLOS S ARAUJO" className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all uppercase" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-zinc-700">Validade (MM/AA)</label>
                                            <input type="text" value={validade} onChange={(e) => setValidade(e.target.value)} placeholder="12/30" maxLength={5} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-zinc-700">CVV</label>
                                            <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" maxLength={4} className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {metodoPagamento === 'pix' && (
                                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 text-center animate-fadeIn">
                                    <FiSmartphone size={40} className="mx-auto text-emerald-500 mb-4" />
                                    <h3 className="font-bold text-zinc-900 mb-2">Pagamento Rápido e Seguro</h3>
                                    <p className="text-sm text-zinc-500">
                                        Ao finalizar a compra, você verá o <strong>QR Code</strong> e o código <strong>Copia e Cola</strong>. O pagamento é aprovado em segundos!
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 sticky top-28">
                            <h2 className="text-xl font-bold text-zinc-900 mb-6">Resumo</h2>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between items-center gap-2">
                                        <span className="text-zinc-600 text-sm">{item.quantity}x {item.name}</span>
                                        <span className="font-semibold text-zinc-900 whitespace-nowrap">{formatarPreco(item.priceCents * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-100 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-zinc-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatarPreco(totalCents)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-500 text-sm">
                                    <span>Frete (Expresso)</span>
                                    <span className="text-green-600 font-bold">Grátis</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-zinc-900">Total</span>
                                    <span className="text-2xl font-black text-blue-600">{formatarPreco(totalCents)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFinalizarPedido}
                                disabled={enviando || items.length === 0}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 cursor-pointer text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {enviando && <FiLoader className="animate-spin" size={20} />}
                                {enviando ? 'Processando...' : 'Finalizar Pedido'}
                            </button>

                            <p className="text-xs text-center text-zinc-400 mt-4">
                                Seus dados estão protegidos com criptografia de ponta a ponta.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

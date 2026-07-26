import Link from 'next/link';
import { FiClock, FiGlobe, FiCheckCircle } from 'react-icons/fi';

export default function IntegracaoFornecedores() {
    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Integração com Fornecedores</h1>
                <p className="text-zinc-500 mt-1">Importação automática de produtos e envio de pedidos direto pro fornecedor.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm max-w-3xl text-center">
                <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                    <FiClock size={28} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Em breve</h2>
                <p className="text-zinc-500 max-w-md mx-auto mb-8">
                    A integração automática com a <strong>CJ Dropshipping</strong> (importar catálogo, sincronizar
                    preço/estoque e enviar pedidos automaticamente) está no planejamento. Assim que estiver pronta, ela aparece aqui.
                </p>

                <div className="text-left bg-zinc-50 rounded-2xl p-6 border border-zinc-100 max-w-md mx-auto">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Enquanto isso, você já pode:</p>
                    <div className="space-y-3 text-sm text-zinc-600">
                        <div className="flex items-start gap-2">
                            <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>Cadastrar produtos manualmente (AliExpress, Jhon Variedades ou qualquer fornecedor) em <Link href="/admin/produtos" className="text-blue-600 font-semibold hover:underline">Meus Produtos</Link></span>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiGlobe className="text-blue-500 mt-0.5 shrink-0" size={16} />
                            <span>Gerar o pedido pronto pra enviar ao fornecedor direto na tela de <Link href="/admin/pedidos" className="text-blue-600 font-semibold hover:underline">Pedidos</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { FiFileText, FiShield } from 'react-icons/fi';

export default function PoliticaPrivacidade() {
    return (
        <div className="bg-zinc-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
                
                {/* MENU LATERAL DE NAVEGAÇÃO LEGAL */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4 sticky top-28">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 px-4">Institucional</h3>
                        <nav className="flex flex-col gap-1">
                            <Link href="/termos" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-blue-600 font-medium rounded-xl transition-colors">
                                <FiFileText size={18} />
                                Termos de Uso
                            </Link>
                            <Link href="/privacidade" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl transition-colors">
                                <FiShield size={18} />
                                Política de Privacidade
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* CONTEÚDO DA POLÍTICA */}
                <main className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 md:p-12">
                        
                        <div className="mb-10 pb-8 border-b border-zinc-100">
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Política de Privacidade</h1>
                            <p className="text-zinc-500 mt-2">Última atualização: [INSERIR DATA AQUI]</p>
                        </div>

                        <div className="space-y-8 text-zinc-600 leading-relaxed">
                            
                            {/* BLOCO DE TEXTO 1 */}
                            <section>
                                <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Coleta de Dados</h2>
                                <p>[INSERIR TEXTO ] </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>[INSERIR DADO COLETADO 1]</li>
                                    <li>[INSERIR DADO COLETADO 2]</li>
                                    <li>[INSERIR DADO COLETADO 3]</li>
                                </ul>
                            </section>

                            {/* BLOCO DE TEXTO 2 */}
                            <section>
                                <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Uso das Informações</h2>
                                <p>[INSERIR TEXTO] </p>
                            </section>

                            {/* BLOCO DE TEXTO 3 */}
                            <section>
                                <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Compartilhamento com Terceiros</h2>
                                <p>[INSERIR TEXTO ]</p>
                            </section>

                            {/* BLOCO DE TEXTO 4 */}
                            <section>
                                <h2 className="text-xl font-bold text-zinc-900 mb-4">4. Seus Direitos (LGPD)</h2>
                                <p>[INSERIR TEXTO] </p>
                            </section>

                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}
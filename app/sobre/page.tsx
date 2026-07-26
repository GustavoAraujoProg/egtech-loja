import Link from 'next/link';
import { FiTarget, FiCpu, FiGlobe, FiUsers, FiArrowRight, FiMapPin, FiTruck, FiBox } from 'react-icons/fi';

export default function SobrePage() {
    return (
        <main className="bg-gray-50 min-h-screen pb-0 font-sans">
            
            {/* CABEÇALHO HERO */}
            <header className="bg-zinc-950 text-white py-24 lg:py-32 relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop" 
                    alt="Background EGTech"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-blue-950/40 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-4 block">Sobre a EGTech</span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">Tecnologia de verdade, sem intermediário abusivo.</h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        A EGTech nasceu pra conectar você direto aos melhores produtos de tecnologia, com preço justo e um atendimento que resolve.
                    </p>
                </div>
            </header>

            {/* (Visão Geral) */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Tecnologia de ponta não precisa custar o triplo.
                        </h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                            <p>
                                A gente acredita que ter acesso a bons produtos de tecnologia não deveria depender de pagar o preço inflado das grandes redes de varejo. Por isso cuidamos de cada etapa: da escolha dos fornecedores até a entrega na sua casa.
                            </p>
                            <p>
                                Aqui, todo pagamento passa por uma plataforma homologada (Asaas), com aprovação rápida e seus dados sempre protegidos — seja no cartão ou no PIX.
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-video bg-zinc-900">
                            <img 
                                src="https://images.pexels.com/photos/11297769/pexels-photo-11297769.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                                alt="Loja EGTech" 
                                className="absolute inset-0 w-full h-full object-cover opacity-90"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGÍSTICA E INFRAESTRUTURA */}
            <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Operação sem fronteiras</h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Nossa infraestrutura digital conecta os melhores fornecedores asiáticos e norte-americanos diretamente ao Brasil.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm text-center">
                            <FiGlobe className="mx-auto text-blue-500 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Fornecimento global</h3>
                            <p className="text-zinc-400 text-sm">Filtramos fábricas parceiras auditadas para garantir qualidade premium.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm text-center">
                            <FiBox className="mx-auto text-blue-500 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Estoque Inteligente</h3>
                            <p className="text-zinc-400 text-sm">Operação just-in-time que elimina custos de armazenagem desnecessários.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm text-center">
                            <FiTruck className="mx-auto text-blue-500 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Entrega Expressa</h3>
                            <p className="text-zinc-400 text-sm">Rotas de frete otimizadas com código de rastreio integrado ao sistema.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* (Linha do Tempo) */}
            <section className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">A nossa jornada</h2>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 before:to-transparent">
                    
                    {/* Ano 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <FiTarget size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">A Ideação</h3>
                                <span className="font-black text-blue-600">Fase 1</span>
                            </div>
                            <p className="text-gray-600 text-sm">Tudo começou com uma pergunta simples: por que a tecnologia boa custa tão caro no Brasil? Foi aí que a ideia da EGTech nasceu.</p>
                        </div>
                    </div>

                    {/* Ano 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <FiGlobe size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">Parcerias Globais</h3>
                                <span className="font-black text-blue-600">Fase 2</span>
                            </div>
                            <p className="text-gray-600 text-sm">Estruturamos toda a operação: pagamentos seguros, logística e um catálogo pensado pra atender quem quer tecnologia boa sem complicação.</p>
                        </div>
                    </div>

                    {/* Ano 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <FiCpu size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-white text-lg">O Futuro</h3>
                                <span className="font-black text-blue-200">Hoje</span>
                            </div>
                            <p className="text-blue-100 text-sm">Estamos abrindo as portas da loja e expandindo o catálogo toda semana. É só o começo — e você faz parte dessa história.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* OS FUNDADORES  */}
            <section className="bg-white py-24 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Quem está por trás da EGTech</h2>
                        <p className="text-gray-500 mt-4">Uma equipe apaixonada por engenharia e inovação.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {/* Perfil 1 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full mb-6 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-black">
                                EG
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Gustavo Araújo</h3>
                            <p className="text-blue-600 text-sm font-medium mb-4 uppercase tracking-wider">CEO & Desenvolvedor</p>
                            <p className="text-gray-600 text-sm">Idealizador da EGTech, cuida de toda a parte de tecnologia e operação da loja.</p>
                        </div>

                        {/* Perfil 2 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full mb-6 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-black">
                                EG
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Cofundadora</h3>
                            <p className="text-blue-600 text-sm font-medium mb-4 uppercase tracking-wider">COO & Operações</p>
                            <p className="text-gray-600 text-sm">Responsável por garantir que cada cliente tenha a melhor experiência de compra.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL */}
            <section className="bg-blue-600 text-white py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Eleve o nível do seu hardware.</h2>
                <Link href="/cadastro" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Explorar Catálogo <FiArrowRight />
                </Link>
            </section>

        </main>
    );
}
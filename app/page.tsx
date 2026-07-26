import HeroCarousel from "./components/HeroCarousel";
import { FiTruck, FiCreditCard, FiShield, FiStar, FiChevronDown } from 'react-icons/fi';
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatarPreco } from "@/lib/format";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const produtoDestaque = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="bg-gray-50 text-gray-900 pb-0">
      
      {/* BANNER ROTATIVO */}
      <HeroCarousel />

      {/* BARRA DE CONFIANÇA */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-gray-600">
                <FiTruck size={24} className="text-gray-900" />
                <div>
                    <p className="font-bold text-sm tracking-wide">FRETE NACIONAL</p>
                    <p className="text-xs text-gray-500">Entrega garantida no Brasil</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
                <FiCreditCard size={24} className="text-gray-900" />
                <div>
                    <p className="font-bold text-sm tracking-wide">PAGAMENTO FACILITADO</p>
                    <p className="text-xs text-gray-500">Parcele em até 12x no cartão</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
                <FiShield size={24} className="text-gray-900" />
                <div>
                    <p className="font-bold text-sm tracking-wide">AMBIENTE SEGURO</p>
                    <p className="text-xs text-gray-500">Criptografia de ponta a ponta</p>
                </div>
            </div>
        </div>
      </section>

      {/* PRODUTO PROMOCIONAL */}
      {produtoDestaque ? (
        <section className="max-w-7xl mx-auto py-32 px-4">
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

              <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-[600px] bg-zinc-900 flex items-center justify-center">
                  <img
                      src={produtoDestaque.imageUrl}
                      alt={produtoDestaque.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm">
                      Lançamento Exclusivo
                  </div>
              </div>

              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
                  <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3">Destaque da Semana</span>

                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                      {produtoDestaque.name}
                  </h2>

                  <p className="text-gray-600 text-lg mb-10 leading-relaxed line-clamp-4">
                    {produtoDestaque.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                      <div>
                          {produtoDestaque.oldPriceCents && (
                              <p className="text-sm text-gray-400 line-through font-medium">{formatarPreco(produtoDestaque.oldPriceCents)}</p>
                          )}
                          <p className="text-4xl font-black text-gray-900">{formatarPreco(produtoDestaque.priceCents)}</p>
                      </div>

                      <Link
                          href={`/produto/${produtoDestaque.slug}`}
                          className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-4 px-10 rounded-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-center tracking-wide"
                      >
                          Ver Produto
                      </Link>
                  </div>
              </div>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto py-24 px-4">
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <p className="text-gray-400 font-medium">Assim que você cadastrar o primeiro produto no painel admin, ele aparece aqui em destaque.</p>
          </div>
        </section>
      )}

      {/* HISTÓRIA */}
      <section className="bg-zinc-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2">
                <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-4 block">Sobre a EGTech</span>
                <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
                    Desafiando o mercado tradicional de tecnologia.
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    Nós não somos apenas mais uma vitrine virtual. A EGTech foi fundada com um propósito claro: eliminar os intermediários abusivos que inflacionam o preço dos eletrônicos no Brasil.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  Trabalhamos direto com fornecedores e cuidamos de cada etapa da compra — do pagamento até a entrega — pra você ter a mesma qualidade das grandes lojas, sem pagar a mais por isso.
                </p>
                
                <div className="w-full h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-white/5">
                    <img 
                        src="https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop" //IMAGEM DA LOJA VIRTUAL 
                        alt="Ambiente Virtual 3D" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                    <p className="text-4xl font-black text-white mb-2">+0</p>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Pedidos Entregues</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                    <p className="text-4xl font-black text-white mb-2">100%</p>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Clientes Satisfeitos</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                    <p className="text-4xl font-black text-white mb-2">0</p>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Meses de Garantia</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                    <p className="text-4xl font-black text-white mb-2">24h</p>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Suporte Dedicado</p>
                </div>
            </div>

        </div>
      </section>

      {/* NOSSOS VALORES E PROVA SOCIAL */}
      <section className="max-w-7xl mx-auto py-32 px-4">
        <div className="text-center mb-20">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">O Padrão EGTech</h3>
            <p className="text-gray-500 mt-4 text-lg">A excelência que nos separa da concorrência.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-8">
                    <FiShield size={24} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4">Inspeção Rigorosa</h4>
                <p className="text-gray-600 leading-relaxed">Cada lote passa por um controle de qualidade inflexível antes de ser catalogado. Nós só vendemos o que nós mesmos usaríamos.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-8">
                    <FiTruck size={24} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4">Logística Expressa</h4>
                <p className="text-gray-600 leading-relaxed">Nossa integração direta com fornecedores reduz o tempo de trânsito em até 40% comparado ao mercado tradicional.</p> 
            </div>

            <div className="bg-zinc-50 p-10 rounded-2xl border border-zinc-200">
                <div className="flex text-yellow-500 mb-6 gap-1">
                    <FiStar fill="currentColor" size={20} /><FiStar fill="currentColor" size={20} /><FiStar fill="currentColor" size={20} /><FiStar fill="currentColor" size={20} /><FiStar fill="currentColor" size={20} />
                </div>
                <p className="text-gray-700 italic mb-8 leading-relaxed font-medium">"Nosso compromisso é simples: produtos de verdade, preço justo e um suporte que responde de verdade quando você precisa."</p>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">EG</div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Equipe EGTech</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Nosso compromisso com você</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="bg-gray-100 py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Categorias em Destaque</h3>
                <p className="text-gray-500 mt-4 text-lg">Navegue pelas categorias e descubra produtos que acompanham sua evolução.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Celulares */}
                <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-zinc-900 border border-gray-200">
                    <img src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Celulares" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <h4 className="text-3xl font-bold text-white mb-2">Celulares</h4>
                        <Link href="/celular" className="mt-8 bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-lg text-sm uppercase tracking-wide">
                            Ver Celulares
                        </Link>
                    </div>
                </div>

                {/* Fones de Ouvido */}
                <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-zinc-900 border border-gray-200">
                    <img src="https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fones de Ouvido" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <h4 className="text-3xl font-bold text-white mb-2">Fones de Ouvido</h4>
                        <Link href="/fones" className="mt-8 bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-lg text-sm uppercase tracking-wide">
                            Ver Fones
                        </Link>
                    </div>
                </div>

                {/* Drones */}
                <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-zinc-900 border border-gray-200">
                    <img src="https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Drones" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <h4 className="text-3xl font-bold text-white mb-2">Drones</h4>
                        <Link href="/drones" className="mt-8 bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-lg text-sm uppercase tracking-wide">
                            Ver Drones
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ DE ALTA CONVERSÃO */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Perguntas Frequentes</h3>
                <p className="text-gray-500 mt-4 text-lg">Estamos aqui para facilitar sua experiência. Consulte as respostas para as dúvidas mais frequentes.</p>
            </div>
            
            <div className="space-y-4">
                <details className="group bg-gray-50 p-6 rounded-xl border border-gray-100 cursor-pointer">
                    <summary className="flex justify-between items-center font-bold text-gray-900 text-lg list-none">
                        Quais formas de pagamento vocês aceitam?
                        <span className="transition group-open:rotate-180 text-blue-600">
                            <FiChevronDown size={24} />
                        </span>
                    </summary>
                    <p className="text-gray-600 mt-4 leading-relaxed">
                        Aceitamos cartão de crédito e PIX, com aprovação em segundos através da Asaas, uma das maiores plataformas de pagamento do Brasil. Seus dados ficam sempre protegidos e criptografados.
                    </p>
                </details>

                <details className="group bg-gray-50 p-6 rounded-xl border border-gray-100 cursor-pointer">
                    <summary className="flex justify-between items-center font-bold text-gray-900 text-lg list-none">
                        Em quanto tempo meu pedido chega?
                        <span className="transition group-open:rotate-180 text-blue-600">
                            <FiChevronDown size={24} />
                        </span>
                    </summary>
                    <p className="text-gray-600 mt-4 leading-relaxed">
                        O prazo varia de acordo com o produto e a sua região, mas trabalhamos com frete nacional expresso para garantir que seu pedido chegue o quanto antes. Assim que despachado, você recebe o código de rastreio por e-mail.
                    </p>
                </details>

                <details className="group bg-gray-50 p-6 rounded-xl border border-gray-100 cursor-pointer">
                    <summary className="flex justify-between items-center font-bold text-gray-900 text-lg list-none">
                        Como acompanho o status do meu pedido?
                        <span className="transition group-open:rotate-180 text-blue-600">
                            <FiChevronDown size={24} />
                        </span>
                    </summary>
                    <p className="text-gray-600 mt-4 leading-relaxed">
                        Basta acessar "Minha Conta" no menu do site. Lá você vê o status atualizado de cada pedido, desde a confirmação do pagamento até a entrega.
                    </p>
                </details>
            </div>
        </div>
      </section>

      {/* CLUBE VIP EGTECH */}
      <section className="bg-blue-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Clube VIP EGTech</h3>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                O Clube VIP foi criado para quem busca inovação, economia e benefícios exclusivos em cada compra.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto text-left">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">🎁</span>
                    <span className="text-sm font-semibold">Ofertas Exclusivas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">⚡</span>
                    <span className="text-sm font-semibold">Promoções Antecipadas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">💰</span>
                    <span className="text-sm font-semibold">Descontos Especiais</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">🚚</span>
                    <span className="text-sm font-semibold">Benefícios em Entregas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">⭐</span>
                    <span className="text-sm font-semibold">Novidades em Primeira Mão</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-xl">🔐</span>
                    <span className="text-sm font-semibold">Vantagens para Membros</span>
                </div>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    className="w-full sm:w-2/3 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400/50 placeholder-gray-400 font-medium"
                />
                <button 
                    type="button" 
                    className="w-full sm:w-1/3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    Quero Fazer Parte
                </button>
            </form>
        </div>
      </section>

    </main>
  );
}
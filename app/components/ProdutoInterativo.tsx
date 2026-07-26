'use client';
import { useState, useRef } from 'react';
import { FiStar, FiTruck, FiShield, FiCheckCircle, FiUploadCloud, FiMessageSquare, FiX, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart, formatarPreco } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

type ProdutoView = {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    priceCents: number;
    oldPriceCents: number | null;
    imageUrl: string;
    images: string[];
    stock: number;
};

export default function ProdutoInterativo({ produto }: { produto: ProdutoView }) {
    const { addItem } = useCart();
    const router = useRouter();

    const galeria = [produto.imageUrl, ...produto.images].filter(Boolean);
    const [imagemAtiva, setImagemAtiva] = useState(galeria[0]);

    // As avaliações abaixo ainda são só de demonstração (não são salvas no banco).
    const [avaliacoes, setAvaliacoes] = useState([
        {
            id: 1,
            nome: "Cliente EGTech",
            texto: "Seja o primeiro a avaliar este produto!",
            midiaUrl: "",
            tipoMidia: "",
        },
    ]);
    const [novoTexto, setNovoTexto] = useState("");
    const [previewMidia, setPreviewMidia] = useState<{ url: string; tipo: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMidiaSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const urlTemporaria = URL.createObjectURL(file);
            const tipo = file.type.startsWith('video/') ? 'video' : 'image';
            setPreviewMidia({ url: urlTemporaria, tipo });
        }
    };

    const handleEnviarAvaliacao = () => {
        if (!novoTexto.trim()) return;
        setAvaliacoes([
            {
                id: Date.now(),
                nome: "Você",
                texto: novoTexto,
                midiaUrl: previewMidia?.url || "",
                tipoMidia: previewMidia?.tipo || "",
            },
            ...avaliacoes,
        ]);
        setNovoTexto("");
        setPreviewMidia(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleAdicionarAoCarrinho = () => {
        addItem({
            productId: produto.id,
            slug: produto.slug,
            name: produto.name,
            priceCents: produto.priceCents,
            imageUrl: produto.imageUrl,
        });
        toast.success('Produto adicionado ao carrinho!');
    };

    const handleComprarAgora = () => {
        handleAdicionarAoCarrinho();
        router.push('/checkout');
    };

    const semEstoque = produto.stock <= 0;

    return (
        <>
            {/* BLOCO SUPERIOR: FOTOS E COMPRA */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-12">
                <div className="md:w-1/2 p-8 flex flex-col gap-4 border-r border-gray-100">
                    <div className="w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
                        <img src={imagemAtiva} alt={produto.name} className="w-full h-full object-cover" />
                    </div>
                    {galeria.length > 1 && (
                        <div className="flex gap-4">
                            {galeria.map((img, i) => (
                                <button
                                    key={i}
                                    onMouseEnter={() => setImagemAtiva(img)}
                                    className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-600 transition-all"
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`${produto.name} miniatura ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
                    <div className="flex text-yellow-400 mb-3 gap-1">
                        <FiStar fill="currentColor" size={18} /><FiStar fill="currentColor" size={18} /><FiStar fill="currentColor" size={18} /><FiStar fill="currentColor" size={18} /><FiStar fill="currentColor" size={18} />
                        <span className="text-gray-500 text-sm ml-2 font-medium">({avaliacoes.length} avaliações)</span>
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{produto.name}</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">{produto.description}</p>

                    <div className="mb-8">
                        {produto.oldPriceCents && (
                            <p className="text-sm text-gray-400 line-through font-medium">{formatarPreco(produto.oldPriceCents)}</p>
                        )}
                        <p className="text-5xl font-black text-blue-600 tracking-tight">{formatarPreco(produto.priceCents)}</p>
                    </div>

                    {semEstoque ? (
                        <div className="w-full bg-gray-200 text-gray-500 text-center font-bold py-5 px-8 rounded-xl mb-6 text-lg uppercase tracking-wide">
                            Fora de estoque
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <button
                                onClick={handleAdicionarAoCarrinho}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-gray-50 font-bold py-5 px-6 rounded-xl transition-all uppercase tracking-wide"
                            >
                                <FiShoppingCart size={20} /> Adicionar
                            </button>
                            <button
                                onClick={handleComprarAgora}
                                className="flex-1 bg-zinc-900 hover:bg-black text-white text-center font-bold py-5 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-lg uppercase tracking-wide"
                            >
                                Comprar Agora
                            </button>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                            <FiTruck className="text-blue-600" size={20} /> Frete Nacional Expresso
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                            <FiShield className="text-blue-600" size={20} /> Compra 100% Segura
                        </div>
                    </div>
                </div>
            </div>

            {/* DESCRIÇÃO E AVALIAÇÕES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Visão Geral</h2>
                    <div className="prose text-gray-600 leading-relaxed space-y-4">
                        <p>{produto.description}</p>
                        <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Por que comprar na EGTech</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-blue-600" /> Qualidade de construção superior</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-blue-600" /> Design ergonômico e moderno</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-blue-600" /> Garantia total contra defeitos de fábrica</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <FiMessageSquare /> Avaliações
                    </h2>

                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                        {avaliacoes.map((aval) => (
                            <div key={aval.id} className="pb-6 border-b border-gray-100 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-900">{aval.nome}</span>
                                    <div className="flex text-yellow-400"><FiStar fill="currentColor" size={14} /><FiStar fill="currentColor" size={14} /><FiStar fill="currentColor" size={14} /><FiStar fill="currentColor" size={14} /><FiStar fill="currentColor" size={14} /></div>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{aval.texto}</p>

                                {aval.midiaUrl && aval.tipoMidia === 'image' && (
                                    <img src={aval.midiaUrl} className="w-20 h-20 object-cover rounded-lg border border-gray-200" alt="Review" />
                                )}
                                {aval.midiaUrl && aval.tipoMidia === 'video' && (
                                    <video src={aval.midiaUrl} className="w-32 h-20 object-cover rounded-lg border border-gray-200" controls muted />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto bg-gray-50 p-5 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm">Deixe sua avaliação</h3>

                        <div className="flex flex-col gap-3">
                            <textarea
                                value={novoTexto}
                                onChange={(e) => setNovoTexto(e.target.value)}
                                placeholder="O que achou do produto?"
                                className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm resize-none h-24"
                            ></textarea>

                            {previewMidia && (
                                <div className="relative w-fit mt-2">
                                    {previewMidia.tipo === 'image' ? (
                                        <img src={previewMidia.url} className="w-20 h-20 object-cover rounded-lg border border-blue-200 shadow-sm" alt="Preview" />
                                    ) : (
                                        <video src={previewMidia.url} className="w-20 h-20 object-cover rounded-lg border border-blue-200 shadow-sm" autoPlay muted loop />
                                    )}
                                    <button
                                        onClick={() => setPreviewMidia(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        title="Remover mídia"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                                <label className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium transition-colors">
                                    <FiUploadCloud size={20} />
                                    <span>Adicionar Foto/Vídeo</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        ref={fileInputRef}
                                        onChange={handleMidiaSelecionada}
                                    />
                                </label>

                                <button
                                    onClick={handleEnviarAvaliacao}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                    disabled={!novoTexto.trim()}
                                >
                                    Postar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

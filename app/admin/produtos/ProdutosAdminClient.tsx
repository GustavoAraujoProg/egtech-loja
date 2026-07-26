'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import type { ProdutoCompleto } from '@/lib/types';
import { createProduct, updateProduct, deleteProduct, toggleProductActive, type ProductInput } from '../../actions/products';
import { formatarPreco } from '@/lib/format';

const CATEGORIAS = [
  { value: 'celular', label: 'Para Celular' },
  { value: 'fones', label: 'Fones de Ouvido' },
  { value: 'drones', label: 'Drones' },
];

type FormState = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string; // em reais, como string pro input
  oldPrice: string;
  imageUrl: string;
  imagesText: string; // uma URL por linha
  stock: string;
  active: boolean;
};

const FORM_VAZIO: FormState = {
  slug: '',
  name: '',
  category: 'celular',
  description: '',
  price: '',
  oldPrice: '',
  imageUrl: '',
  imagesText: '',
  stock: '0',
  active: true,
};

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProdutosAdminClient({ initialProducts }: { initialProducts: ProdutoCompleto[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => setProducts(initialProducts), [initialProducts]);

  const abrirNovo = () => {
    setForm(FORM_VAZIO);
    setFormAberto(true);
  };

  const abrirEdicao = (produto: ProdutoCompleto) => {
    setForm({
      id: produto.id,
      slug: produto.slug,
      name: produto.name,
      category: produto.category,
      description: produto.description,
      price: (produto.priceCents / 100).toString(),
      oldPrice: produto.oldPriceCents ? (produto.oldPriceCents / 100).toString() : '',
      imageUrl: produto.imageUrl,
      imagesText: produto.images.join('\n'),
      stock: produto.stock.toString(),
      active: produto.active,
    });
    setFormAberto(true);
  };

  const handleSalvar = async () => {
    const priceCents = Math.round(parseFloat(form.price.replace(',', '.')) * 100);
    if (!form.name.trim() || !form.slug.trim() || !form.imageUrl.trim() || isNaN(priceCents)) {
      toast.error('Preencha nome, slug, imagem e preço corretamente.');
      return;
    }

    const input: ProductInput = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category as ProductInput['category'],
      description: form.description.trim(),
      priceCents,
      oldPriceCents: form.oldPrice.trim()
        ? Math.round(parseFloat(form.oldPrice.replace(',', '.')) * 100)
        : null,
      imageUrl: form.imageUrl.trim(),
      images: form.imagesText.split('\n').map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock, 10) || 0,
      active: form.active,
    };

    setSalvando(true);
    const resultado = form.id
      ? await updateProduct(form.id, input)
      : await createProduct(input);
    setSalvando(false);

    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }

    toast.success(form.id ? 'Produto atualizado!' : 'Produto criado!');
    setFormAberto(false);
    router.refresh();
  };

  const handleExcluir = async (produto: ProdutoCompleto) => {
    if (!confirm(`Excluir "${produto.name}"? Essa ação não pode ser desfeita.`)) return;
    const resultado = await deleteProduct(produto.id);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    toast.success('Produto excluído.');
    router.refresh();
  };

  const handleToggleAtivo = async (produto: ProdutoCompleto) => {
    const resultado = await toggleProductActive(produto.id, !produto.active);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="animate-fadeIn">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Meus Produtos</h1>
          <p className="text-zinc-500 mt-1">Gerencie seu estoque, preços e catálogo da loja.</p>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
        >
          <FiPlus size={18} />
          Novo Produto
        </button>
      </div>

      {formAberto && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-900 text-lg">{form.id ? 'Editar produto' : 'Novo produto'}</h2>
            <button onClick={() => setFormAberto(false)} className="text-zinc-400 hover:text-zinc-600">
              <FiX size={22} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-zinc-700">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: f.id ? f.slug : slugify(name) }));
                }}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-700">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-700">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-700">Estoque</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-700">Preço (R$)</label>
              <input
                type="text"
                placeholder="299,90"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-700">Preço antigo (opcional, pra mostrar desconto)</label>
              <input
                type="text"
                placeholder="399,90"
                value={form.oldPrice}
                onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-zinc-700">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-700">URL da imagem principal</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-700">Imagens extras (uma URL por linha)</label>
              <textarea
                value={form.imagesText}
                onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 h-16 resize-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="rounded text-blue-600"
              />
              <label htmlFor="ativo" className="text-sm font-semibold text-zinc-700">Produto visível na loja</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setFormAberto(false)} className="px-5 py-2.5 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-100">
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar produto'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="py-4 px-6">Produto</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Preço</th>
                <th className="py-4 px-6">Estoque</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-zinc-400">
                    Nenhum produto cadastrado ainda. Clique em &quot;Novo Produto&quot; pra começar.
                  </td>
                </tr>
              )}
              {products.map((produto: ProdutoCompleto) => (
                <tr key={produto.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-zinc-900 flex items-center gap-3">
                    <img src={produto.imageUrl} className="w-10 h-10 object-cover bg-zinc-200 rounded-lg border border-zinc-300" alt="" />
                    {produto.name}
                  </td>
                  <td className="py-4 px-6 font-medium text-zinc-500">
                    {CATEGORIAS.find((c) => c.value === produto.category)?.label ?? produto.category}
                  </td>
                  <td className="py-4 px-6 font-semibold">{formatarPreco(produto.priceCents)}</td>
                  <td className={`py-4 px-6 font-medium ${produto.stock <= 3 ? 'text-red-500' : ''}`}>
                    {produto.stock} un.
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleAtivo(produto)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${produto.active ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}
                    >
                      {produto.active ? 'Ativo' : 'Oculto'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => abrirEdicao(produto)} className="text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleExcluir(produto)} className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

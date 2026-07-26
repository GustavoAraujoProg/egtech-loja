'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiCamera } from 'react-icons/fi';
import { updateProfile } from '../actions/profile';

type PerfilUser = {
  name: string;
  email: string;
  cpfCnpj: string | null;
  phone: string | null;
};

export default function PerfilFormClient({ user }: { user: PerfilUser }) {
  const [nome, setNome] = useState(user.name);
  const [cpf, setCpf] = useState(user.cpfCnpj ?? '');
  const [telefone, setTelefone] = useState(user.phone ?? '');
  const [salvando, setSalvando] = useState(false);

  const iniciais = user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();

  const handleSalvar = async () => {
    setSalvando(true);
    const resultado = await updateProfile({ name: nome, cpfCnpj: cpf, phone: telefone });
    setSalvando(false);
    if (resultado.error) {
      toast.error(resultado.error);
      return;
    }
    toast.success('Dados atualizados!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">

      <div className="flex items-center gap-6 mb-10 pb-10 border-b border-zinc-100">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center border-2 border-zinc-200 overflow-hidden text-2xl font-black text-zinc-500">
            {iniciais || <FiUser size={40} className="text-zinc-400" />}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
          <p className="text-zinc-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">E-mail</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-zinc-100 border border-zinc-200 text-zinc-500 px-4 py-3 rounded-xl outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Celular</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSalvar}
            disabled={salvando}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

    </div>
  );
}

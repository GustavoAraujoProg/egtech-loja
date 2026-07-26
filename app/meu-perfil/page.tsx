import { FiUser, FiMapPin, FiCreditCard, FiLock } from 'react-icons/fi';
import { getCurrentUser } from '@/lib/auth';
import PerfilFormClient from '../components/PerfilFormClient';

export const dynamic = 'force-dynamic';

export default async function MeuPerfil() {
    const user = await getCurrentUser();
    if (!user) return null; // proxy já redireciona antes de chegar aqui

    return (
        <div className="bg-zinc-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Minha Conta</h1>
                    <p className="text-zinc-500 mt-1">Gerencie seus dados pessoais, endereços e segurança.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    <aside className="w-full md:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                            <nav className="flex flex-col">
                                <span className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold">
                                    <FiUser size={20} />
                                    Dados Pessoais
                                </span>
                                <span className="flex items-center gap-3 px-6 py-4 text-zinc-400 border-l-4 border-transparent cursor-not-allowed">
                                    <FiMapPin size={20} />
                                    Meus Endereços <em className="text-xs not-italic ml-auto">em breve</em>
                                </span>
                                <span className="flex items-center gap-3 px-6 py-4 text-zinc-400 border-l-4 border-transparent cursor-not-allowed">
                                    <FiCreditCard size={20} />
                                    Cartões Salvos <em className="text-xs not-italic ml-auto">em breve</em>
                                </span>
                                <span className="flex items-center gap-3 px-6 py-4 text-zinc-400 border-l-4 border-transparent border-t border-zinc-100 cursor-not-allowed">
                                    <FiLock size={20} />
                                    Segurança e Senha <em className="text-xs not-italic ml-auto">em breve</em>
                                </span>
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <PerfilFormClient
                            user={{
                                name: user.name,
                                email: user.email,
                                cpfCnpj: user.cpfCnpj,
                                phone: user.phone,
                            }}
                        />
                    </main>

                </div>
            </div>
        </div>
    );
}

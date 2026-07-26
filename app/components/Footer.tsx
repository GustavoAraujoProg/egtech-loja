import Link from 'next/link';
import { FiMail, FiPhone, FiInstagram, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 text-gray-300 pt-16 pb-8 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-black text-white mb-6">EGTech.</h2>
                        <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
                            Redefinindo o padrão de tecnologia e performance. Produtos exclusivos direto para a sua casa com segurança e agilidade.
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="https://www.instagram.com/egtech.oficial/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-zinc-900 hover:bg-blue-600 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                            >
                                <FiInstagram size={20} className="text-white" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navegação</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/" className="hover:text-blue-500 transition-colors">Início</Link></li>
                            <li><Link href="/fones" className="hover:text-blue-500 transition-colors">Fones de Ouvido</Link></li>
                            <li><Link href="/celular" className="hover:text-blue-500 transition-colors">Para Celular</Link></li>
                            <li><Link href="/drones" className="hover:text-blue-500 transition-colors">Drones</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contato</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-blue-500" size={18} />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-blue-500" size={18} />
                                <span>contato@egtech.com.br</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMapPin className="text-blue-500" size={18} />
                                <span>São Paulo, SP - Brasil</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
                    <p>&copy; {new Date().getFullYear()} EGTech. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
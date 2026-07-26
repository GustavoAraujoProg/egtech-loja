import Link from 'next/link';
import { FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="bg-zinc-50 min-h-[70vh] flex items-center justify-center py-20">
            <div className="text-center px-4 animate-fadeIn">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiAlertCircle size={48} />
                </div>
                <h1 className="text-7xl font-black text-zinc-900 mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-zinc-700 mb-4">Putz! Página não encontrada.</h2>
                <p className="text-zinc-500 mb-10 max-w-md mx-auto">
                    Parece que você se perdeu ou o produto que você estava procurando saiu do ar.
                </p>
                <Link href="/" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 inline-block">
                    Voltar para a Loja
                </Link>
            </div>
        </div>
    );
}
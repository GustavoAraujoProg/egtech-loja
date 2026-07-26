'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { loginAction } from '../actions/auth';

export default function Login() {
    const [state, formAction, pending] = useActionState(loginAction, undefined);

    return (
        <div className="bg-zinc-50 min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 animate-fadeIn">

                {/* Logo e Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="EGTech" className="h-12 w-auto object-contain scale-125" />
                    </div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Bem-vindo de volta</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Acesse sua conta para continuar</p>
                </div>

                {/* Botão do Google */}
                <a
                    href="/api/auth/google"
                    className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-700 font-semibold py-3 px-4 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer mb-6"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25C22.56 11.47 22.49 10.73 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.68 17.59V20.34H19.25C21.34 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                        <path d="M12 23C14.97 23 17.46 22.02 19.25 20.34L15.68 17.59C14.71 18.24 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.18H2.23V17.04C4.03 20.61 7.71 23 12 23Z" fill="#34A853"/>
                        <path d="M5.92 14.18C5.7 13.52 5.57 12.78 5.57 12C5.57 11.22 5.7 10.48 5.92 9.82V6.96H2.23C1.49 8.44 1.05 10.15 1.05 12C1.05 13.85 1.49 15.56 2.23 17.04L5.92 14.18Z" fill="#FBBC05"/>
                        <path d="M12 5.34C13.62 5.34 15.07 5.9 16.22 6.99L19.33 3.88C17.45 2.12 14.97 1 12 1C7.71 1 4.03 3.39 2.23 6.96L5.92 9.82C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335"/>
                    </svg>
                    Continuar com o Google
                </a>

                {/* Divisória */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-zinc-200"></div>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Ou com e-mail</span>
                    <div className="flex-1 h-px bg-zinc-200"></div>
                </div>

                {state?.error && (
                    <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                        <FiAlertCircle className="shrink-0" /> {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                            <FiMail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Seu e-mail"
                            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                            <FiLock size={18} />
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Sua senha"
                            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 cursor-pointer mt-2 disabled:opacity-60"
                    >
                        {pending ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-sm mt-8">
                    Ainda não tem conta?{' '}
                    <Link href="/cadastro" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

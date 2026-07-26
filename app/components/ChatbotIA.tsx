'use client';
import { useState } from 'react';
import { FiX, FiSend, FiCpu } from 'react-icons/fi';

export default function ChatbotIA() {
    const [aberto, setAberto] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [historico, setHistorico] = useState([
        { autor: 'ia', texto: 'Olá! Sou o assistente virtual da EGTech. Posso te ajudar a escolher um equipamento ou tirar dúvidas sobre o seu pedido?' }
    ]);

    const enviarMensagem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mensagem.trim()) return;

        const novasMensagens = [...historico, { autor: 'user', texto: mensagem }];
        setHistorico(novasMensagens);
        setMensagem("");

        // Simulção provisória
        setTimeout(() => {
            setHistorico(prev => [...prev, { 
                autor: 'ia', 
                texto: 'Como ainda estou em fase de testes, não consigo consultar o banco de dados. Mas em breve estarei conectado ao catálogo completo!' 
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            
            {/* BOTÃO*/}
            {!aberto && (
                <button 
                    onClick={() => setAberto(true)}
                    className="relative flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all cursor-pointer"
                >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping pointer-events-none"></span>
                    <FiCpu size={28} className="relative z-10 pointer-events-none" />
                </button>
            )}

            {/*CHATBOT */}
            {aberto && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] max-h-[80vh] animate-fadeIn">
                    
                    {/* Cabeçalho do Chat */}
                    <div className="bg-zinc-950 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <FiCpu size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">EGTech AI</h3>
                                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setAberto(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {historico.map((msg, index) => (
                            <div key={index} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.autor === 'ia' ? 'bg-white border border-gray-200 text-gray-700 self-start rounded-tl-none shadow-sm' : 'bg-blue-600 text-white self-end rounded-tr-none shadow-md'}`}>
                                {msg.texto}
                            </div>
                        ))}
                    </div>

                    {/* Campo de Digitação */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={enviarMensagem} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 pl-4">
                            <input 
                                type="text" 
                                value={mensagem}
                                onChange={(e) => setMensagem(e.target.value)}
                                placeholder="Pergunte algo..." 
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                            />
                            <button type="submit" className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 cursor-pointer">
                                <FiSend size={14} className="-ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
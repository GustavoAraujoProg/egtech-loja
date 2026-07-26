'use client'; 
import { useState, useEffect } from 'react';

const imagensOriginais = [
    "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=1920", 
    "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1920", 
    "https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=1920" 
];

const imagens = [...imagensOriginais, imagensOriginais[0]];

export default function HeroCarousel() {
    const [imagemAtual, setImagemAtual] = useState(0);
    const [temTransicao, setTemTransicao] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTemTransicao(true); 
            setImagemAtual((prev) => prev + 1);
        }, 3000); 

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (imagemAtual === imagens.length - 1) {
            const timeout = setTimeout(() => {
                setTemTransicao(false); 
                setImagemAtual(0);      
            }, 1000);
            
            return () => clearTimeout(timeout);
        }
    }, [imagemAtual]);

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">

            <div 
                className={`flex w-full h-full ${temTransicao ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${imagemAtual * 100}%)` }} 
            >
                {imagens.map((img, index) => (
                    <img 
                        key={index}
                        src={img} 
                        alt={`Banner ${index}`} 
                        className="min-w-full h-full object-cover"
                    />
                ))}
            </div>
            
            {/*Fundo */}

            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
                    Tecnologia que inspira. <span className="text-blue-500">Qualidade que surpreende.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md">
                    Sua referência em tecnologia e inovação.
                </p>

                <a 
                    href="#produtos" 
                    className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 px-8 rounded-full transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-1"
                >
                    Ver Produtos
                </a>

            </div>

        </div>
    );
}
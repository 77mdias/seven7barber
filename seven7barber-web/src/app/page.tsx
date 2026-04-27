import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderAuth } from "@/components/header-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#111] border-b-2 border-[#732F3B]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-white">SEVEN</span>
            <span className="font-heading text-2xl font-bold text-[#732F3B]">7</span>
            <span className="font-heading text-2xl font-bold text-white">BARBER</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#servicos" className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">Serviços</a>
            <a href="#sobre" className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">Sobre</a>
            <a href="#contato" className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">Contato</a>
          </nav>
          <HeaderAuth />
        </div>
      </header>

      {/* Hero with Halftone */}
      <section className="relative flex-1 flex items-center justify-center py-32 overflow-hidden">
        {/* Halftone Background */}
        <div className="absolute inset-0 bg-[#732F3B]">
          <div
            className="absolute top-0 right-0 w-3/4 h-full"
            style={{
              backgroundImage: `radial-gradient(#111 20%, transparent 20%), radial-gradient(#111 20%, transparent 20%)`,
              backgroundPosition: '0 0, 5px 5px',
              backgroundSize: '10px 10px',
              transform: 'skewX(-12deg) translateX(25%)',
              borderLeft: '4px solid #000'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container max-w-6xl grid md:grid-cols-2 gap-12 items-center px-8">
          {/* Left Content */}
          <div className="animate-enter-left">
            <div className="inline-block bg-[#111] text-white px-4 py-2 -skew-x-12 mb-6">
              <span className="font-heading text-sm tracking-widest uppercase">Premium Barber Shop</span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-bold leading-none mb-6" style={{ transform: 'skewY(-3deg)' }}>
              <span className="text-[#111] bg-white px-2">Estilo</span>
              <br />
              <span className="text-white">que </span>
              <span className="text-[#732F3B]">define</span>
              <br />
              <span className="text-white">você</span>
            </h1>
            <p className="font-sans text-lg text-[#d1d5db] mb-8 -rotate-1">
              Barbearia premium com profissionais experientes, ambiente sofisticado
              e o cuidado que você merece.
            </p>
            <button
              onClick={() => router.push('/booking')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-[#111] translate-x-2 translate-y-2 clip-slant-right z-0" />
              <div className="relative bg-[#732F3B] text-white px-10 py-5 clip-slant-right border-2 border-black font-heading text-xl uppercase tracking-wider flex items-center gap-3 hover:bg-white hover:text-[#732F3B] transition-colors z-10">
                Agendar Horário
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>

          {/* Right Visual */}
          <div className="animate-enter-right flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white border-4 border-black shadow-hard rotate-3 p-2">
                <div className="w-full h-full bg-[#732F3B] clip-slant-right flex items-center justify-center">
                  <span className="font-heading text-white text-9xl font-bold">7</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#111] clip-jagged animate-pulse-slow" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#732F3B] rotate-45" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="py-24 px-4 bg-[#f9f9f9]">
        <div className="container max-w-6xl">
          <h2 className="font-heading text-5xl font-bold text-center mb-4">
            Nossos <span className="text-[#732F3B]">Serviços</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Escolha o serviço perfeito para você</p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="card-esports text-white text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="font-heading text-2xl font-semibold mb-2 uppercase">{service.title}</h3>
                <p className="text-[#9ca3af] mb-4">{service.description}</p>
                <p className="text-[#732F3B] font-bold text-2xl">{service.price}</p>
                <button className="mt-4 px-6 py-2 border-2 border-[#732F3B] text-[#732F3B] font-heading uppercase tracking-wider hover:bg-[#732F3B] hover:text-white transition-colors">
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 bg-halftone opacity-50" />
        <div className="container max-w-4xl text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Pronto para mudar seu visual?
          </h2>
          <p className="text-[#9ca3af] mb-8">Agende seu horário agora e venha conhecer nosso espaço.</p>
          <button className="relative group inline-block">
            <div className="absolute inset-0 bg-[#732F3B] translate-x-2 translate-y-2 clip-slant-right z-0" />
            <div className="relative bg-white text-[#111] px-10 py-5 clip-slant-right border-2 border-black font-heading text-xl uppercase tracking-wider hover:bg-[#732F3B] hover:text-white transition-colors z-10">
              Agendar Agora
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#111] border-t-4 border-[#732F3B]">
        <div className="container max-w-6xl text-center">
          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="social-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.226 1.51 4.027 3.493 4.464-.647.375-1.319.575-2.006.575-.488 0-.963-.047-1.426-.143 1.007 2.931 3.946 5.049 7.379 5.118-2.548 1.995-5.771 3.178-9.264 3.178-.604 0-1.197-.036-1.769-.109.623 1.945 2.424 3.364 4.554 3.405-1.679 1.312-3.798 2.099-6.109 2.099-.398 0-.79-.023-1.175-.068 2.167 1.386 4.725 2.196 7.482 2.196 8.984 0 13.93-7.441 13.93-13.93 0-.21 0-.419-.015-.626.955-.689 1.786-1.547 2.444-2.522z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
          </div>
          <p className="font-heading text-lg text-white mb-2">SEVEN<span className="text-[#732F3B]">7</span>BARBER</p>
          <p className="text-sm text-[#666]">© 2026 Seven7Barber. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

const services = [
  { title: "Corte", description: "Corte personalizado com acabamento premium", price: "R$ 45", icon: "✂" },
  { title: "Barba", description: "Modelagem e tratamento completo da barba", price: "R$ 35", icon: "🧔" },
  { title: "Combo", description: "Corte + barba com desconto especial", price: "R$ 70", icon: "✨" },
];
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderAuth } from "@/components/header-auth";
import { Scissors, User, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#111] border-b-2 border-[#732F3B]">
        <div className="container mx-auto max-w-7xl flex h-18 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo77barber.png"
              alt="Seven7Barber"
              width={160}
              height={48}
              className="max-h-12 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="text-sm font-medium text-gray-300 hover:text-[#732F3B] uppercase tracking-wider transition-colors">
              Serviços
            </a>
            <a href="#sobre" className="text-sm font-medium text-gray-300 hover:text-[#732F3B] uppercase tracking-wider transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-sm font-medium text-gray-300 hover:text-[#732F3B] uppercase tracking-wider transition-colors">
              Contato
            </a>
          </nav>
          
          <HeaderAuth />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4.5rem)] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/51943c9b3f3aed1120454f188d1dc47c.jpg"
            alt="Seven7Barber Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/85 to-[#111]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#732F3B] text-white px-4 py-2 rounded-md mb-6">
              <span className="font-heading text-sm tracking-widest uppercase">Premium Barber Shop</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Estilo que
              <br />
              <span className="text-[#732F3B]">define</span> você
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
              Barbearia premium com profissionais experientes, ambiente sofisticado
              e o cuidado que você merece.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button className="bg-[#732F3B] hover:bg-[#401021] text-white px-8 py-6 text-lg font-heading uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-105">
                  Agendar Horário
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              
              <a href="#servicos">
                <Button className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[#111] px-8 py-6 text-lg font-heading uppercase tracking-wider rounded-lg transition-all duration-300 backdrop-blur-sm">
                  Nossos Serviços
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#111] mb-4">
              Nossos <span className="text-[#732F3B]">Serviços</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Escolha o serviço perfeito para você. Qualidade e estilo em cada atendimento.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col"
              >
                {/* Card Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <service.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-2xl font-semibold text-[#111] mb-2 uppercase">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[#732F3B] font-bold text-3xl font-heading">
                      {service.price}
                    </span>
                    <Link href="/booking">
                      <Button className="bg-[#111] hover:bg-[#732F3B] text-white px-6 py-2 font-heading uppercase tracking-wider rounded-lg transition-colors duration-300">
                        Agendar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/download.png"
            alt="Seven7Barber Ambiente"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#111]/90" />
        </div>
        
        <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Sobre a <span className="text-[#732F3B]">Seven7Barber</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Somos uma barbearia premium localizada no coração da cidade. 
                Nossa equipe de profissionais experientes oferece cortes modernos 
                e clássicos, sempre com atenção aos detalhes.
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Venha conhecer nosso espaço sofisticado e viver uma experiência 
                única de cuidado pessoal.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-heading text-3xl md:text-4xl font-bold text-[#732F3B] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Equipment Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/maquininhas.jpeg"
                alt="Equipamentos Premium"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#111] mb-4">
              Como <span className="text-[#732F3B]">Funciona</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Agende seu horário de forma rápida e fácil
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center group">
                <div className="w-16 h-16 bg-[#732F3B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-heading font-bold group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#111] mb-2 uppercase">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="contato" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/passo_1.webp"
            alt="Seven7Barber"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#111]/85" />
        </div>
        
        <div className="relative z-10 container mx-auto max-w-4xl text-center px-4 md:px-8">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Pronto para mudar seu visual?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Agende seu horário agora e venha conhecer nosso espaço. 
            Qualidade e estilo em cada atendimento.
          </p>
          <Link href="/booking">
            <Button className="bg-[#732F3B] hover:bg-[#401021] text-white px-10 py-6 text-xl font-heading uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-105">
              Agendar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#111] border-t-4 border-[#732F3B]">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <Image
                  src="/images/logo77barber.png"
                  alt="Seven7Barber Logo"
                  width={140}
                  height={44}
                  className="max-h-10 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 leading-relaxed">
                Barbearia premium com os melhores profissionais da cidade.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-white mb-4 uppercase">Links</h4>
              <ul className="space-y-2">
                <li><a href="#servicos" className="text-gray-400 hover:text-[#732F3B] transition-colors">Serviços</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-[#732F3B] transition-colors">Sobre</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-[#732F3B] transition-colors">Contato</a></li>
                <li><Link href="/booking" className="text-gray-400 hover:text-[#732F3B] transition-colors">Agendar</Link></li>
              </ul>
            </div>
            
            {/* Social */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-white mb-4 uppercase">Redes Sociais</h4>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 bg-white text-[#111] rounded-lg flex items-center justify-center hover:bg-[#732F3B] hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 Seven7Barber. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const services = [
  {
    title: "Corte",
    description: "Corte personalizado com acabamento premium. Estilo moderno ou clássico.",
    price: "R$ 45",
    icon: Scissors,
    image: "/images/c001fb2632bc52f5bae3b95d6a39f4c2.jpg",
  },
  {
    title: "Barba",
    description: "Modelagem e tratamento completo da barba. Toalha quente e produtos premium.",
    price: "R$ 35",
    icon: User,
    image: "/images/972695398256212.jpg",
  },
  {
    title: "Combo",
    description: "Corte + barba com desconto especial. A experiência completa.",
    price: "R$ 70",
    icon: Sparkles,
    image: "/images/fotos-oficina-da-barba-piracicaba-un-oagmenos (9).jpg",
  },
];

const stats = [
  { value: "5+", label: "Anos" },
  { value: "10k+", label: "Clientes" },
  { value: "4.9", label: "Avaliação" },
];

const steps = [
  { title: "Escolha", description: "Selecione o serviço desejado" },
  { title: "Agende", description: "Escolha data e horário" },
  { title: "Confirme", description: "Receba a confirmação" },
  { title: "Relaxe", description: "Aproveite o atendimento" },
];

const socials = [
  {
    name: "Twitter",
    url: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.226 1.51 4.027 3.493 4.464-.647.375-1.319.575-2.006.575-.488 0-.963-.047-1.426-.143 1.007 2.931 3.946 5.049 7.379 5.118-2.548 1.995-5.771 3.178-9.264 3.178-.604 0-1.197-.036-1.769-.109.623 1.945 2.424 3.364 4.554 3.405-1.679 1.312-3.798 2.099-6.109 2.099-.398 0-.79-.023-1.175-.068 2.167 1.386 4.725 2.196 7.482 2.196 8.984 0 13.93-7.441 13.93-13.93 0-.21 0-.419-.015-.626.955-.689 1.786-1.547 2.444-2.522z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
];

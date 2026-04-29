import Link from "next/link";

import { ServiceCard } from "@/components/services/service-card";
import { Service } from "@/components/services/service-card";

// Server action to fetch services
async function getServices(category?: string, search?: string): Promise<Service[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/services?${params.toString()}`, {
    next: { revalidate: 300 }, // Cache for 5 min
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.services || data || [];
}

// Categories for filter
const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'haircut', label: 'Corte' },
  { id: 'beard', label: 'Barba' },
  { id: 'combo', label: 'Combo' },
  { id: 'treatment', label: 'Tratamento' },
];

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const search = params.search || '';

  const services = await getServices(
    category === 'all' ? undefined : category,
    search || undefined
  );

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#111] border-b-2 border-[#732F3B]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-white">SEVEN</span>
            <span className="font-heading text-2xl font-bold text-[#732F3B]">7</span>
            <span className="font-heading text-2xl font-bold text-white">BARBER</span>
          </div>
          <Link href="/" className="text-sm font-medium text-[#732F3B] hover:text-white uppercase tracking-wide transition-colors">
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-[#1a1a1a] py-16 border-b border-[#272727]">
        <div className="container">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Nossos <span className="text-[#732F3B]">Serviços</span>
          </h1>
          <p className="text-[#bababa] text-lg max-w-2xl">
            Serviços profissionais de barbearia com produtos premium e atendimento personalizado.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-[#1a1a1a] py-6 sticky top-16 z-40 border-b border-[#272727]">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services${cat.id === 'all' ? '' : `?category=${cat.id}`}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (category === cat.id || (cat.id === 'all' && !category))
                      ? 'bg-[#732F3B] text-white'
                      : 'bg-[#272727] text-[#bababa] hover:bg-[#732F3B]/20 hover:text-white'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <form className="relative w-full md:w-72">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Buscar serviço..."
                className="w-full bg-[#272727] text-white placeholder-[#bababa] px-4 py-2 pr-10 rounded-lg border border-[#111] focus:border-[#732F3B] focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bababa] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                  <path strokeWidth="2" d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-12">
        <div className="container">
          {services.length === 0 ? (
            // Empty state
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#272727] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#bababa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl text-white mb-2">Nenhum serviço encontrado</h3>
              <p className="text-[#bababa]">
                {search ? `Não encontramos resultados para "${search}"` : 'Volte em breve para ver nossos serviços'}
              </p>
            </div>
          ) : (
            // Loading state (for suspense - actual loading shows skeleton)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-8 border-t border-[#272727] mt-auto">
        <div className="container text-center text-[#bababa] text-sm">
          <p>© 2026 Seven7Barber. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  category?: string;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const price = typeof service.price === 'string'
    ? parseFloat(service.price)
    : service.price;

  return (
    <div className="group relative bg-[#272727] rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-[#732F3B]/20">
      {/* Halftone accent on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(#732F3B 15%, transparent 15%), radial-gradient(#732F3B 15%, transparent 15%)`,
          backgroundPosition: '0 0, 4px 4px',
          backgroundSize: '8px 8px',
          transform: 'skewX(-12deg) translateX(30%)',
        }}
      />

      <div className="p-6 relative z-10">
        {/* Category badge */}
        {service.category && (
          <span className="inline-block bg-[#732F3B]/20 text-[#732F3B] text-xs px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {service.category}
          </span>
        )}

        {/* Service name */}
        <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-[#732F3B] transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        {service.description && (
          <p className="text-[#bababa] text-sm mb-4 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#111]">
          <div className="flex items-center gap-4 text-sm text-[#bababa]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeWidth="2" d="M12 6v6l4 2"/>
              </svg>
              {service.duration} min
            </span>
          </div>

          {/* Price */}
          <span className="font-heading text-2xl font-bold text-white">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Book button - appears on hover */}
        <button className="w-full mt-4 bg-[#732F3B] text-white py-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium uppercase tracking-wide hover:bg-[#401021]">
          Agendar
        </button>
      </div>
    </div>
  );
}
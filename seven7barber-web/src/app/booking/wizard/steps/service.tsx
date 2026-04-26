'use client';

import { useState } from 'react';

interface ServiceStepProps {
  onSelect: (id: string, name: string) => void;
  selectedId: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: string;
}

// Mock data for development
const MOCK_SERVICES: Service[] = [
  { id: 'svc-1', name: 'Corte Masculino', description: 'Corte clássico com acabamento impecável', duration: 30, price: '35.00' },
  { id: 'svc-2', name: 'Barba Completa', description: 'Barba com toalha quente e acabamento', duration: 20, price: '25.00' },
  { id: 'svc-3', name: 'Corte + Barba', description: 'Combo completo para o homem moderno', duration: 50, price: '55.00' },
  { id: 'svc-4', name: 'Sobrancelha', description: 'Design de sobrancelha masculina', duration: 10, price: '15.00' },
  { id: 'svc-5', name: 'Tratamento Capilar', description: 'Hidratação profunda para cabelos', duration: 30, price: '40.00' },
];

export function Service({ onSelect, selectedId }: ServiceStepProps) {
  const [services] = useState<Service[]>(MOCK_SERVICES);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-6">Escolha seu serviço</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id, service.name)}
            className={`
              bg-[#272727] p-4 rounded-lg text-left transition-all hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-[#732F3B]/20
              ${selectedId === service.id ? 'ring-2 ring-[#732F3B]' : ''}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading text-lg font-bold text-white">{service.name}</h3>
              <span className="font-heading text-xl font-bold text-[#732F3B]">R$ {service.price}</span>
            </div>
            <p className="text-[#bababa] text-sm mb-2">{service.description}</p>
            <span className="text-[#732F3B] text-xs">{service.duration} min</span>
          </button>
        ))}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

interface BarbersStepProps {
  onSelect: (id: string | null, name: string | null) => void;
  selectedId: string | null;
}

interface Barber {
  id: string;
  name: string;
  image: string;
  specialties: string[];
}

const MOCK_BARBERS: Barber[] = [
  { id: 'barber-1', name: 'João Silva', image: '', specialties: ['Corte', 'Barba'] },
  { id: 'barber-2', name: 'Maria Costa', image: '', specialties: ['Tratamento', 'Sobrancelha'] },
  { id: 'barber-3', name: 'Pedro Santos', image: '', specialties: ['Corte Clássico'] },
];

export function Barbers({ onSelect, selectedId }: BarbersStepProps) {
  const [barbers] = useState<Barber[]>(MOCK_BARBERS);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-6">Escolha seu barbeiro (opcional)</h2>
      <p className="text-[#bababa] mb-6">Selecione um barbeiro específico ou deixe livre para o próximo disponível.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Any barber option */}
        <button
          onClick={() => onSelect(null, null)}
          className={`
            bg-[#272727] p-4 rounded-lg text-center transition-all hover:bg-[#1a1a1a]
            ${selectedId === null ? 'ring-2 ring-[#732F3B]' : ''}
          `}
        >
          <div className="w-16 h-16 rounded-full bg-[#111] mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white">Qualquer um</h3>
          <p className="text-[#bababa] text-sm">Próximo disponível</p>
        </button>

        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id, barber.name)}
            className={`
              bg-[#272727] p-4 rounded-lg text-center transition-all hover:bg-[#1a1a1a]
              ${selectedId === barber.id ? 'ring-2 ring-[#732F3B]' : ''}
            `}
          >
            <div className="w-16 h-16 rounded-full bg-[#111] mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">💇</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">{barber.name}</h3>
            <p className="text-[#732F3B] text-xs">{barber.specialties.join(', ')}</p>
          </button>
        ))}
      </div>

      {/* Skip button */}
      <div className="mt-6 text-center">
        <button onClick={() => onSelect(selectedId, barbers.find(b => b.id === selectedId)?.name || null)} className="text-[#bababa] hover:text-white text-sm">
          Continuar →
        </button>
      </div>
    </div>
  );
}
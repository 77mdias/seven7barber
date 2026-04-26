'use client';

import { useState, useEffect } from 'react';

interface DateTimeStepProps {
  onSelect: (id: string, time: string, date: string) => void;
  selectedId: string | null;
  serviceIds: (string | null)[];
}

interface Slot {
  id: string;
  time: string;
  date: string;
  barberId: string;
  barberName: string;
}

const MOCK_SLOTS: Slot[] = [
  { id: 'slot-1', time: '09:00', date: '2026-04-27', barberId: 'barber-1', barberName: 'João Silva' },
  { id: 'slot-2', time: '09:30', date: '2026-04-27', barberId: 'barber-1', barberName: 'João Silva' },
  { id: 'slot-3', time: '10:00', date: '2026-04-27', barberId: 'barber-1', barberName: 'João Silva' },
  { id: 'slot-4', time: '10:30', date: '2026-04-27', barberId: 'barber-2', barberName: 'Maria Costa' },
  { id: 'slot-5', time: '11:00', date: '2026-04-27', barberId: 'barber-2', barberName: 'Maria Costa' },
  { id: 'slot-6', time: '14:00', date: '2026-04-27', barberId: 'barber-1', barberName: 'João Silva' },
  { id: 'slot-7', time: '14:30', date: '2026-04-27', barberId: 'barber-1', barberName: 'João Silva' },
  { id: 'slot-8', time: '15:00', date: '2026-04-27', barberId: 'barber-3', barberName: 'Pedro Santos' },
];

export function DateTime({ onSelect, selectedId, serviceIds }: DateTimeStepProps) {
  const [slots] = useState<Slot[]>(MOCK_SLOTS);
  const [selectedDate, setSelectedDate] = useState('2026-04-27');

  const filteredSlots = slots.filter(s => s.date === selectedDate);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-6">Escolha o horário</h2>

      {/* Date selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30'].map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${selectedDate === date ? 'bg-[#732F3B] text-white' : 'bg-[#272727] text-[#bababa] hover:bg-[#333]'}
            `}
          >
            {new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filteredSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelect(slot.id, slot.time, slot.date)}
            className={`
              bg-[#272727] p-3 rounded-lg text-center transition-all hover:bg-[#1a1a1a]
              ${selectedId === slot.id ? 'ring-2 ring-[#732F3B]' : ''}
            `}
          >
            <div className="font-heading text-lg font-bold text-white">{slot.time}</div>
            <div className="text-[#bababa] text-xs">{slot.barberName}</div>
          </button>
        ))}
      </div>

      {filteredSlots.length === 0 && (
        <div className="text-center py-8 text-[#bababa]">
          Nenhum horário disponível neste dia.
        </div>
      )}
    </div>
  );
}
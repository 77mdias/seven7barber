'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Appointment {
  id: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  price: string;
}

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', serviceName: 'Corte Masculino', barberName: 'João Silva', date: '2026-04-27', time: '10:00', status: 'SCHEDULED', price: '35.00' },
  { id: '2', serviceName: 'Barba Completa', barberName: 'Maria Costa', date: '2026-04-20', time: '14:30', status: 'COMPLETED', price: '25.00' },
  { id: '3', serviceName: 'Corte + Barba', barberName: 'João Silva', date: '2026-04-13', time: '09:00', status: 'COMPLETED', price: '55.00' },
  { id: '4', serviceName: 'Sobrancelha', barberName: 'Pedro Santos', date: '2026-03-30', time: '11:00', status: 'CANCELLED', price: '15.00' },
];

const STATUS_CONFIG = {
  SCHEDULED: { label: 'Agendado', color: 'bg-yellow-500/20 text-yellow-400', dot: 'bg-yellow-400' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400', dot: 'bg-blue-400' },
  COMPLETED: { label: 'Concluído', color: 'bg-green-500/20 text-green-400', dot: 'bg-green-400' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', dot: 'bg-red-400' },
  NO_SHOW: { label: 'Faltou', color: 'bg-gray-500/20 text-gray-400', dot: 'bg-gray-400' },
};

type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    setCancellingId(id);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Update local state to reflect cancellation
        window.location.reload();
      } else {
        alert('Erro ao cancelar agendamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['SCHEDULED', 'CONFIRMED'].includes(apt.status);
    if (filter === 'completed') return apt.status === 'COMPLETED';
    if (filter === 'cancelled') return ['CANCELLED', 'NO_SHOW'].includes(apt.status);
    return true;
  });

  const canCancel = (apt: Appointment) => {
    const appointmentDate = new Date(`${apt.date}T${apt.time}`);
    const now = new Date();
    const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil > 24 && ['SCHEDULED', 'CONFIRMED'].includes(apt.status);
  };

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

      {/* Content */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-white">Meus Agendamentos</h1>
          <Link
            href="/booking"
            className="bg-[#732F3B] text-white px-4 py-2 rounded font-medium hover:bg-[#401021] transition-colors"
          >
            + Novo Agendamento
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'upcoming', label: 'Próximos' },
            { id: 'completed', label: 'Concluídos' },
            { id: 'cancelled', label: 'Cancelados' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-[#732F3B] text-white' : 'bg-[#272727] text-[#bababa] hover:bg-[#333]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Appointments list */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#272727] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#bababa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-white mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-[#bababa] mb-6">
              {filter !== 'all' ? 'Tente cambiar o filtro para ver mais resultados.' : 'Você ainda não tem agendamentos.'}
            </p>
            <Link href="/booking" className="text-[#732F3B] hover:text-white font-medium">
              Agendar primeiro serviço →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const statusConfig = STATUS_CONFIG[apt.status];
              return (
                <div key={apt.id} className="bg-[#272727] rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-lg font-bold text-white">{apt.serviceName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-[#bababa]">
                        <span>👤 {apt.barberName}</span>
                        <span>📅 {new Date(apt.date).toLocaleDateString('pt-BR')}</span>
                        <span>🕐 {apt.time}</span>
                      </div>
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-2xl font-bold text-white">
                        R$ {parseFloat(apt.price).toFixed(2).replace('.', ',')}
                      </span>

                      {apt.status === 'COMPLETED' && (
                        <Link
                          href={`/dashboard/reviews/${apt.id}`}
                          className="text-[#732F3B] hover:text-white text-sm font-medium"
                        >
                          Avaliar →
                        </Link>
                      )}

                      {canCancel(apt) && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          disabled={cancellingId === apt.id}
                          className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50"
                        >
                          {cancellingId === apt.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
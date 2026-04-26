'use client';

import { BookingState } from './wizard';

interface ConfirmStepProps {
  state: BookingState;
  onBack: () => void;
  onSubmit: () => void;
}

export function Confirm({ state, onBack, onSubmit }: ConfirmStepProps) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-white mb-6">Confirme seu agendamento</h2>

      <div className="bg-[#272727] rounded-lg p-6 mb-6">
        <h3 className="font-heading text-lg font-bold text-[#732F3B] mb-4">Resumo</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[#bababa]">Serviço:</span>
            <span className="text-white font-medium">{state.serviceName || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#bababa]">Barbeiro:</span>
            <span className="text-white font-medium">{state.barberName || 'Qualquer um'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#bababa]">Data:</span>
            <span className="text-white font-medium">
              {state.slotDate ? new Date(state.slotDate).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#bababa]">Horário:</span>
            <span className="text-white font-medium">{state.slotTime || '-'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-[#272727] text-white py-3 rounded font-medium hover:bg-[#333] transition-colors"
        >
          ← Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={state.isSubmitting}
          className="flex-1 bg-[#732F3B] text-white py-3 rounded font-medium hover:bg-[#401021] transition-colors disabled:opacity-50"
        >
          {state.isSubmitting ? 'Aguarde...' : 'Confirmar Agendamento'}
        </button>
      </div>
    </div>
  );
}
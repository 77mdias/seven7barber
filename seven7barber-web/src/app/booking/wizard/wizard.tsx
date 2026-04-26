'use client';

import { useState, useCallback } from 'react';
import { Service, Barbers, DateTime, Confirm } from './steps';
import { StepIndicator } from './step-indicator';

export interface BookingState {
  currentStep: number;
  serviceId: string | null;
  serviceName: string | null;
  barberId: string | null;
  barberName: string | null;
  slotId: string | null;
  slotTime: string | null;
  slotDate: string | null;
  isSubmitting: boolean;
}

const WIZARD_STEPS = [
  { id: 'service', label: 'Serviço' },
  { id: 'barber', label: 'Barbeiro' },
  { id: 'datetime', label: 'Horário' },
  { id: 'confirm', label: 'Confirmação' },
];

const createInitialState = (): BookingState => ({
  currentStep: 0,
  serviceId: null,
  serviceName: null,
  barberId: null,
  barberName: null,
  slotId: null,
  slotTime: null,
  slotDate: null,
  isSubmitting: false,
});

export function BookingWizard() {
  const [state, setState] = useState<BookingState>(createInitialState);

  const canAdvance = useCallback((toStep: number) => {
    if (toStep > state.currentStep + 1) return false;
    if (toStep < state.currentStep) return true;
    if (toStep === state.currentStep + 1) {
      if (state.currentStep === 0) return state.serviceId !== null;
      if (state.currentStep === 2) return state.slotId !== null;
      return true;
    }
    return true;
  }, [state]);

  const goToStep = useCallback((step: number) => {
    if (canAdvance(step)) {
      setState(s => ({ ...s, currentStep: step }));
    }
  }, [canAdvance]);

  const selectService = useCallback((id: string, name: string) => {
    setState(s => ({ ...s, serviceId: id, serviceName: name }));
    goToStep(1);
  }, [goToStep]);

  const selectBarber = useCallback((id: string | null, name: string | null) => {
    setState(s => ({ ...s, barberId: id, barberName: name }));
    goToStep(2);
  }, [goToStep]);

  const selectSlot = useCallback((id: string, time: string, date: string) => {
    setState(s => ({ ...s, slotId: id, slotTime: time, slotDate: date }));
    goToStep(3);
  }, [goToStep]);

  const submitBooking = useCallback(async () => {
    setState(s => ({ ...s, isSubmitting: true }));
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceId: state.serviceId,
          barberId: state.barberId,
          slotId: state.slotId,
          dateTime: state.slotDate && state.slotTime
            ? `${state.slotDate}T${state.slotTime}`
            : undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro ao criar agendamento' }));
        throw new Error(error.message || 'Erro ao criar agendamento');
      }

      alert('Agendamento realizado com sucesso!');
      setState(createInitialState());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      alert(message);
    } finally {
      setState(s => ({ ...s, isSubmitting: false }));
    }
  }, [state.serviceId, state.barberId, state.slotId, state.slotDate, state.slotTime]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <Service onSelect={selectService} selectedId={state.serviceId} />;
      case 1:
        return <Barbers onSelect={selectBarber} selectedId={state.barberId} />;
      case 2:
        return <DateTime onSelect={selectSlot} selectedId={state.slotId} serviceIds={[state.serviceId].filter(Boolean)} />;
      case 3:
        return <Confirm
          state={state}
          onBack={() => goToStep(2)}
          onSubmit={submitBooking}
        />;
      default:
        return null;
    }
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
        </div>
      </header>

      {/* Progress indicator */}
      <div className="bg-[#1a1a1a] py-4 border-b border-[#272727]">
        <div className="container">
          <StepIndicator steps={WIZARD_STEPS} currentStep={state.currentStep} onStepClick={(i) => canAdvance(i) && goToStep(i)} />
        </div>
      </div>

      {/* Step content */}
      <div className="container py-8">
        {renderStep()}
      </div>
    </div>
  );
}
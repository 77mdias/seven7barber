'use client';

import Link from 'next/link';

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = isComplete || index === currentStep + 1;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all
                ${isCurrent ? 'bg-[#732F3B] text-white' : ''}
                ${isComplete ? 'bg-[#732F3B]/20 text-[#732F3B] cursor-pointer hover:bg-[#732F3B]/30' : ''}
                ${!isComplete && !isCurrent ? 'bg-[#272727] text-[#bababa]' : ''}
                ${isClickable && !isCurrent ? 'cursor-pointer' : ''}
              `}
            >
              {/* Step number */}
              <span className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${isCurrent ? 'bg-white text-[#732F3B]' : ''}
                ${isComplete ? 'bg-[#732F3B] text-white' : ''}
                ${!isComplete && !isCurrent ? 'bg-[#111] text-[#bababa]' : ''}
              `}>
                {isComplete ? '✓' : index + 1}
              </span>
              <span>{step.label}</span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${isComplete ? 'bg-[#732F3B]' : 'bg-[#272727]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
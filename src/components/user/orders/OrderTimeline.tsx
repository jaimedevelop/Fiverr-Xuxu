import React from 'react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date?: Date;
  completed: boolean;
  current: boolean;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ steps }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map((step, stepIdx) => (
          <li key={step.id}>
            <div className="relative pb-8">
              {stepIdx !== steps.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-saffron-300 to-persian-pink-300"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white transition-all duration-300 ${
                      step.completed
                        ? 'bg-gradient-mint shadow-mint'
                        : step.current
                        ? 'bg-gradient-saffron shadow-saffron animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="h-5 w-5 text-emerald-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.current ? (
                      <div className="h-3 w-3 bg-orange-800 rounded-full animate-pulse" />
                    ) : (
                      <div className="h-2.5 w-2.5 bg-white rounded-full" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className={`text-sm font-semibold transition-colors duration-200 ${
                      step.current ? 'text-saffron-800' : 
                      step.completed ? 'text-emerald-800' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-sm mt-1 ${
                      step.current ? 'text-saffron-600' :
                      step.completed ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                    
                    {/* Status indicator */}
                    {step.current && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-saffron text-orange-900 shadow-saffron">
                          En progreso
                        </span>
                      </div>
                    )}
                    
                    {step.completed && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-mint text-emerald-800 shadow-mint">
                          Completado
                        </span>
                      </div>
                    )}
                  </div>
                  {step.date && (
                    <div className="text-right text-sm whitespace-nowrap">
                      <div className={`font-medium ${
                        step.current ? 'text-saffron-700' :
                        step.completed ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        {step.date.toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.date.toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
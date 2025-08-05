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
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      step.completed
                        ? 'bg-green-500'
                        : step.current
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.current ? (
                      <div className="h-2.5 w-2.5 bg-white rounded-full" />
                    ) : (
                      <div className="h-2.5 w-2.5 bg-white rounded-full" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className={`text-sm font-medium ${
                      step.current ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {step.date && (
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {step.date.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
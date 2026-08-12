import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PublicLayout } from '../../components/layout/PublicLayout';

export const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: '01',
      title: 'Customer',
      desc: 'Customer is selected.',
    },
    {
      num: '02',
      title: 'Sales Order',
      desc: 'Products and quantities are added.',
    },
    {
      num: '03',
      title: 'Sales Challan',
      desc: 'A challan is created and assigned a number.',
    },
    {
      num: '04',
      title: 'Stock Check',
      desc: 'The system checks whether enough stock is available.',
      highlight: true,
    },
    {
      num: '05',
      title: 'Inventory Updated',
      desc: 'Stock is reduced only after confirmation.',
    },
    {
      num: '06',
      title: 'Movement Recorded',
      desc: 'The stock movement is saved for reference.',
    },
  ];

  return (
    <PublicLayout>
      <section className="relative z-10 py-12 px-6 max-w-5xl mx-auto">
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Everything is connected.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            A sale starts with a customer and ends with an updated inventory record. The system keeps each step connected so stock changes are not missed.
          </p>
        </div>

        {/* 6 Step Visual Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                step.highlight
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200/90 shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                      step.highlight ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    STEP {step.num}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className={`text-xs ${step.highlight ? 'text-slate-400' : 'text-slate-400'}`}>
                      ↓
                    </span>
                  )}
                </div>
                <h2
                  className={`text-lg font-bold mb-2 ${
                    step.highlight ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </h2>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    step.highlight ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200/80">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
          >
            <span>Test the Challan Stock Validation</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
};

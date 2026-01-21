'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGemini } from '@/hooks/useGemini';

const roiSchema = z.object({
  industry: z.enum(['healthcare', 'manufacturing', 'bfsi', 'professional-services']),
  employees: z.number().min(500).max(5000),
  annualRevenue: z.number().min(1000000),
  currentProcessingTime: z.number().min(1),
  transactionVolume: z.number().min(100),
});

type ROIFormData = z.infer<typeof roiSchema>;

interface ROIResults {
  estimatedSavings: number;
  roi: number;
  paybackMonths: number;
  timeReduction: number;
}

export default function ROICalculator() {
  const [results, setResults] = useState<ROIResults | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const { messages, isLoading, sendMessage } = useGemini({ stream: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ROIFormData>({
    resolver: zodResolver(roiSchema),
    defaultValues: {
      industry: 'healthcare',
      employees: 1000,
      annualRevenue: 10000000,
      currentProcessingTime: 10,
      transactionVolume: 1000,
    },
  });

  const onSubmit = async (data: ROIFormData) => {
    // Simple ROI calculation
    const hourlyLaborCost = 50; // Average cost per hour
    const automationEfficiency = 0.70; // 70% time reduction
    const implementationCost = 150000; // Base implementation cost

    const timeReduction = data.currentProcessingTime * automationEfficiency;
    const annualHoursSaved = (data.transactionVolume * timeReduction * 12);
    const estimatedSavings = annualHoursSaved * hourlyLaborCost;
    const roi = ((estimatedSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = (implementationCost / (estimatedSavings / 12));

    setResults({
      estimatedSavings: Math.round(estimatedSavings),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths),
      timeReduction: Math.round(timeReduction),
    });

    // Get AI insights
    const prompt = `Based on these automation parameters, provide 3 specific recommendations for a ${data.industry} company with ${data.employees} employees:
    - Annual Revenue: $${data.annualRevenue.toLocaleString()}
    - Transaction Volume: ${data.transactionVolume}/month
    - Current Processing Time: ${data.currentProcessingTime} hours/transaction
    - Estimated ROI: ${Math.round(roi)}%
    - Payback Period: ${Math.round(paybackMonths)} months
    
    Keep recommendations concise and actionable.`;

    await sendMessage(prompt);
    setShowAIInsights(true);
  };

  const formData = watch();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interactive ROI Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your potential return on investment with AI automation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Business Profile</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                {...register('industry')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="bfsi">BFSI (Banking, Financial Services)</option>
                <option value="professional-services">Professional Services</option>
              </select>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Employees
              </label>
              <input
                type="number"
                {...register('employees', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.employees && (
                <p className="text-red-500 text-sm mt-1">{errors.employees.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Annual Revenue ($)
              </label>
              <input
                type="number"
                {...register('annualRevenue', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.annualRevenue && (
                <p className="text-red-500 text-sm mt-1">{errors.annualRevenue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Current Processing Time (hours per transaction)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('currentProcessingTime', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.currentProcessingTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentProcessingTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Transaction Volume
              </label>
              <input
                type="number"
                {...register('transactionVolume', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.transactionVolume && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.transactionVolume.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
            >
              Calculate ROI
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Estimated Results</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Annual Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${results.estimatedSavings.toLocaleString()}
                  </p>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Return on Investment</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {results.roi}%
                  </p>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payback Period</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {results.paybackMonths} months
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved per Transaction</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {results.timeReduction} hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights */}
          {showAIInsights && messages.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🤖</span>
                <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
              </div>
              
              {isLoading ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {messages
                    .filter(m => m.role === 'model')
                    .map((message, idx) => (
                      <p key={idx} className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

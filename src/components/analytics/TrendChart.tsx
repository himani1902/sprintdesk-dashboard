import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CompletionTrendData } from '../../types/analytics';

export interface TrendChartProps {
  data: CompletionTrendData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-96 min-h-[380px] bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
      <div className="mb-4">
        <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Completion Trend</h3>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Cumulative task completion progression over time</p>
      </div>

      <div className="w-full flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
            <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
            <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '10px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
              }}
              itemStyle={{ color: '#f8fafc', fontWeight: 500 }}
              labelStyle={{ color: '#fdba74', fontWeight: 700, marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeCompleted"
              name="Cumulative Completed"
              stroke="#ea580c"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTrend)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

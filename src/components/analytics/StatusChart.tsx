import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatusDistributionData } from '../../types/analytics';

export interface StatusChartProps {
  data: StatusDistributionData[];
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  return (
    <div className="w-full h-96 min-h-[380px] bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700">
      <div className="mb-2">
        <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Task Status Distribution</h3>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">Share of tasks across active board columns</p>
      </div>

      <div className="w-full flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '8px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import { ArrowLeft, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from '../lib/database.types';

interface AnalyticsProps {
  activities: Activity[];
  selectedDate: string;
  onBack: () => void;
}

const CATEGORY_COLORS_CHART: Record<string, string> = {
  Work: '#3B82F6',
  Study: '#06B6D4',
  Sleep: '#6366F1',
  Exercise: '#10B981',
  Entertainment: '#EC4899',
  Social: '#F97316',
  Meals: '#EAB308',
  Commute: '#6B7280',
  Hobbies: '#14B8A6',
  Other: '#64748B',
};

export default function Analytics({ activities, selectedDate, onBack }: AnalyticsProps) {
  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No Data Available</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
              You haven't logged any activities for {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} yet.
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-lg shadow-blue-200"
            >
              Start Logging Your Day
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalMinutes = activities.reduce((sum, act) => sum + act.duration_minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const categoryData = activities.reduce((acc, activity) => {
    const existing = acc.find((item) => item.category === activity.category);
    if (existing) {
      existing.minutes += activity.duration_minutes;
    } else {
      acc.push({
        category: activity.category,
        minutes: activity.duration_minutes,
      });
    }
    return acc;
  }, [] as { category: string; minutes: number }[]);

  const pieData = categoryData.map((item) => ({
    name: item.category,
    value: item.minutes,
    percentage: ((item.minutes / totalMinutes) * 100).toFixed(1),
  }));

  const barData = categoryData.map((item) => ({
    category: item.category,
    hours: parseFloat((item.minutes / 60).toFixed(1)),
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Analytics</h2>
            <p className="text-gray-600">{formatDate(selectedDate)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-blue-700" />
                <p className="text-sm text-blue-700 font-medium">Total Time Tracked</p>
              </div>
              <p className="text-4xl font-bold text-blue-900">{totalHours}h</p>
              <p className="text-sm text-blue-600 mt-1">{totalMinutes} minutes</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-green-700" />
                <p className="text-sm text-green-700 font-medium">Total Activities</p>
              </div>
              <p className="text-4xl font-bold text-green-900">{activities.length}</p>
              <p className="text-sm text-green-600 mt-1">logged today</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-cyan-700" />
                <p className="text-sm text-cyan-700 font-medium">Categories</p>
              </div>
              <p className="text-4xl font-bold text-cyan-900">{categoryData.length}</p>
              <p className="text-sm text-cyan-600 mt-1">different types</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Time Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: unknown) => {
                    const { name, percentage } = props as { name: string; percentage: string };
                    return `${name} ${percentage}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS_CHART[entry.name] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${Math.floor(value / 60)}h ${value % 60}m`,
                    'Duration',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value: number) => [`${value}h`, 'Duration']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((item) => (
              <div
                key={item.category}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{item.category}</span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS_CHART[item.category] || '#64748B' }}
                  ></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(item.minutes / 60)}h {item.minutes % 60}m
                </p>
                <p className="text-sm text-gray-500">
                  {((item.minutes / totalMinutes) * 100).toFixed(1)}% of your day
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

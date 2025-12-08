import { Edit2, Trash2, Clock } from 'lucide-react';
import { Activity } from '../lib/database.types';

interface ActivityListProps {
  activities: Activity[];
  loading: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Work: 'bg-blue-100 text-blue-800 border-blue-200',
  Study: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Sleep: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Exercise: 'bg-green-100 text-green-800 border-green-200',
  Entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
  Social: 'bg-orange-100 text-orange-800 border-orange-200',
  Meals: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Commute: 'bg-gray-100 text-gray-800 border-gray-200',
  Hobbies: 'bg-teal-100 text-teal-800 border-teal-200',
  Other: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function ActivityList({ activities, loading, onEdit, onDelete }: ActivityListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Activities Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your day by adding your first activity. Every minute counts towards understanding your time better.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>1440 minutes available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>24 hours to track</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Activities</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {activity.activity_name}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.Other
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(activity.duration_minutes / 60)}h {activity.duration_minutes % 60}m
                    <span className="text-gray-400 ml-1">
                      ({activity.duration_minutes} minutes)
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(activity)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit activity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this activity?')) {
                      onDelete(activity.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

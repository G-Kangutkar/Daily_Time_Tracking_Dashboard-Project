import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity } from '../lib/database.types';

const CATEGORIES = [
  'Work',
  'Study',
  'Sleep',
  'Exercise',
  'Entertainment',
  'Social',
  'Meals',
  'Commute',
  'Hobbies',
  'Other',
];

interface ActivityFormProps {
  date: string;
  activity: Activity | null;
  remainingMinutes: number;
  onClose: () => void;
}

export default function ActivityForm({ date, activity, remainingMinutes, onClose }: ActivityFormProps) {
  const { user } = useAuth();
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState('Work');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activity) {
      setActivityName(activity.activity_name);
      setCategory(activity.category);
      setDurationMinutes(activity.duration_minutes.toString());
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const minutes = parseInt(durationMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    if (!activity && minutes > remainingMinutes) {
      setError(`Duration exceeds remaining minutes (${remainingMinutes} min available)`);
      return;
    }

    if (activity && minutes > remainingMinutes + activity.duration_minutes) {
      setError(`Duration exceeds available minutes (${remainingMinutes + activity.duration_minutes} min available)`);
      return;
    }

    setLoading(true);

    if (activity) {
      const { error: updateError } = await supabase
        .from('activities')
        .update({
          activity_name: activityName,
          category,
          duration_minutes: minutes,
          updated_at: new Date().toISOString(),
        } as never)
        .eq('id', activity.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('activities')
        .insert({
          user_id: user!.id,
          date,
          activity_name: activityName,
          category,
          duration_minutes: minutes,
        } as never);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Activity Name
            </label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Morning workout"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="60"
              min="1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {activity ? remainingMinutes + activity.duration_minutes : remainingMinutes} minutes
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              {loading ? 'Saving...' : activity ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

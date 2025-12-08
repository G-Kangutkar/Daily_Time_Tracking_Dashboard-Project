import { useState, useEffect } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity } from '../lib/database.types';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList';
import Analytics from './Analytics';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [selectedDate]);

  const loadActivities = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', selectedDate)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setActivities(data);
    }
    setLoading(false);
  };

  const totalMinutes = activities.reduce((sum, act) => sum + act.duration_minutes, 0);
  const remainingMinutes = 1440 - totalMinutes;
  const canAnalyze = totalMinutes > 0;

  const handleAddActivity = () => {
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
    loadActivities();
  };

  const handleDeleteActivity = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (!error) {
      loadActivities();
    }
  };

  const handleAnalyze = () => {
    setShowAnalytics(true);
  };

  if (showAnalytics) {
    return (
      <Analytics
        activities={activities}
        selectedDate={selectedDate}
        onBack={() => setShowAnalytics(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">TimeTrack</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Activity Tracker</h2>
              <p className="text-gray-600">Log and analyze how you spend your 24 hours</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-700 font-medium mb-1">Total Logged</p>
              <p className="text-3xl font-bold text-blue-900">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </p>
            </div>
            <div className={`rounded-xl p-4 border ${
              remainingMinutes >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            }`}>
              <p className={`text-sm font-medium mb-1 ${
                remainingMinutes >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                Remaining
              </p>
              <p className={`text-3xl font-bold ${
                remainingMinutes >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {Math.floor(Math.abs(remainingMinutes) / 60)}h {Math.abs(remainingMinutes) % 60}m
              </p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
              <p className="text-sm text-cyan-700 font-medium mb-1">Activities</p>
              <p className="text-3xl font-bold text-cyan-900">{activities.length}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddActivity}
              disabled={remainingMinutes <= 0}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              Add Activity
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-200"
            >
              Analyze Day
            </button>
          </div>
        </div>

        <ActivityList
          activities={activities}
          loading={loading}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
        />
      </div>

      {showForm && (
        <ActivityForm
          date={selectedDate}
          activity={editingActivity}
          remainingMinutes={remainingMinutes}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

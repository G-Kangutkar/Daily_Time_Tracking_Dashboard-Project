import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, set, get, remove } from 'firebase/database';
import { format } from 'date-fns';
import './Dashboard.css';

const categories = [
  'Work',
  'Study',
  'Sleep',
  'Exercise',
  'Entertainment',
  'Meals',
  'Commute',
  'Social',
  'Hobbies',
  'Other'
];

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activities, setActivities] = useState([]);
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadActivities();
  }, [selectedDate, currentUser]);

  useEffect(() => {
    const total = activities.reduce((sum, activity) => sum + activity.duration, 0);
    setTotalMinutes(total);
  }, [activities]);

  async function loadActivities() {
    if (!currentUser) return;

    try {
      const activitiesRef = ref(database, `users/${currentUser.uid}/days/${selectedDate}/activities`);
      const snapshot = await get(activitiesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const activitiesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setActivities(activitiesArray);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    if (editingId) {
      const existingActivity = activities.find(a => a.id === editingId);
      const newTotal = totalMinutes - existingActivity.duration + durationNum;

      if (newTotal > 1440) {
        alert(`Cannot add activity. Would exceed 24 hours. You have ${1440 - totalMinutes + existingActivity.duration} minutes remaining.`);
        return;
      }
    } else {
      if (totalMinutes + durationNum > 1440) {
        alert(`Cannot add activity. Would exceed 24 hours. You have ${1440 - totalMinutes} minutes remaining.`);
        return;
      }
    }

    setLoading(true);
    try {
      const activityId = editingId || Date.now().toString();
      const activityData = {
        name: activityName,
        category: category,
        duration: durationNum,
        timestamp: Date.now()
      };

      const activityRef = ref(database, `users/${currentUser.uid}/days/${selectedDate}/activities/${activityId}`);
      await set(activityRef, activityData);

      setActivityName('');
      setDuration('');
      setCategory(categories[0]);
      setEditingId(null);
      loadActivities();
    } catch (error) {
      alert('Error saving activity: ' + error.message);
    }
    setLoading(false);
  }

  async function handleDelete(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const activityRef = ref(database, `users/${currentUser.uid}/days/${selectedDate}/activities/${activityId}`);
      await remove(activityRef);
      loadActivities();
    } catch (error) {
      alert('Error deleting activity: ' + error.message);
    }
  }

  function handleEdit(activity) {
    setActivityName(activity.name);
    setCategory(activity.category);
    setDuration(activity.duration.toString());
    setEditingId(activity.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setActivityName('');
    setDuration('');
    setCategory(categories[0]);
    setEditingId(null);
  }

  function handleAnalyze() {
    navigate('/analytics?date=' + selectedDate);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const remainingMinutes = 1440 - totalMinutes;
  const canAnalyze = totalMinutes === 1440;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="navbar-brand">
            <span>⏱️</span>
            Daily Time Tracker
          </div>
          <div className="navbar-user">
            <span className="user-email">{currentUser?.email}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <div className="dashboard-grid">
          <div className="activity-form-section">
            <div className="card">
              <h2>{editingId ? 'Edit Activity' : 'Add Activity'}</h2>

              <form onSubmit={handleSubmit} className="activity-form">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="activityName">Activity Name</label>
                  <input
                    type="text"
                    id="activityName"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="e.g., Morning workout"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 60"
                    min="1"
                    max="1440"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {editingId ? 'Update' : 'Add'} Activity
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="card stats-card">
              <div className="stat-item">
                <div className="stat-label">Total Time Logged</div>
                <div className="stat-value">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Remaining</div>
                <div className="stat-value" style={{ color: remainingMinutes === 0 ? 'var(--success)' : 'var(--warning)' }}>
                  {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(totalMinutes / 1440) * 100}%` }}
                ></div>
              </div>
              <button
                onClick={handleAnalyze}
                className="btn btn-success btn-full"
                disabled={!canAnalyze}
                style={{ marginTop: '1rem' }}
              >
                {canAnalyze ? 'Analyze Day' : `Add ${remainingMinutes} more minutes to analyze`}
              </button>
            </div>
          </div>

          <div className="activities-list-section">
            <div className="card">
              <h2>Activities for {format(new Date(selectedDate), 'MMMM d, yyyy')}</h2>

              {activities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No activities logged yet</p>
                  <p className="empty-subtitle">Start by adding your first activity</p>
                </div>
              ) : (
                <div className="activities-list">
                  {activities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-info">
                        <div className="activity-header">
                          <span className="activity-name">{activity.name}</span>
                          <span className="activity-duration">
                            {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                          </span>
                        </div>
                        <span className="activity-category">{activity.category}</span>
                      </div>
                      <div className="activity-actions">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="btn-icon"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          className="btn-icon"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

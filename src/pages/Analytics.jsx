import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { format } from 'date-fns';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadActivities();
  }, [selectedDate, currentUser]);

  async function loadActivities() {
    if (!currentUser) return;

    setLoading(true);
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
    setLoading(false);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);

  const categoryData = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {});

  const categoryColors = {
    'Work': '#FF6B6B',
    'Study': '#4ECDC4',
    'Sleep': '#45B7D1',
    'Exercise': '#10B981',
    'Entertainment': '#F59E0B',
    'Meals': '#F97316',
    'Commute': '#8B5CF6',
    'Social': '#EC4899',
    'Hobbies': '#14B8A6',
    'Other': '#6B7280'
  };

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map(cat => categoryColors[cat] || '#6B7280'),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: activities.map(a => a.name),
    datasets: [
      {
        label: 'Duration (minutes)',
        data: activities.map(a => a.duration),
        backgroundColor: activities.map(a => categoryColors[a.category] || '#6B7280'),
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter',
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="container navbar-content">
            <div className="navbar-brand">
              <span>⏱️</span>
              Daily Time Tracker
            </div>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (activities.length === 0 || totalMinutes !== 1440) {
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
          <div className="no-data-container">
            <div className="no-data-card card">
              <div className="no-data-icon">📊</div>
              <h2>No Data Available</h2>
              <p className="no-data-text">
                {totalMinutes === 0
                  ? `No activities logged for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`
                  : `Only ${totalMinutes} minutes logged. Complete 24 hours (1440 minutes) to analyze your day.`
                }
              </p>

              <div className="date-selector">
                <label htmlFor="analyticsDate">Select a different date:</label>
                <input
                  type="date"
                  id="analyticsDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Start Logging Activities
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="analytics-header">
          <div>
            <h1>Analytics Dashboard</h1>
            <p className="analytics-subtitle">
              Detailed breakdown for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="header-actions">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="date-input"
            />
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-label">Total Time</div>
              <div className="stat-value">24 Hours</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-label">Activities</div>
              <div className="stat-value">{activities.length}</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Categories</div>
              <div className="stat-value">{Object.keys(categoryData).length}</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-label">Top Activity</div>
              <div className="stat-value-small">
                {Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0][0]}
              </div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card card">
            <h3>Time Distribution by Category</h3>
            <div className="chart-container">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-card card">
            <h3>Activity Durations</h3>
            <div className="chart-container">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Category Breakdown</h3>
          <div className="category-breakdown">
            {Object.entries(categoryData)
              .sort((a, b) => b[1] - a[1])
              .map(([category, minutes]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <div
                      className="category-color"
                      style={{ backgroundColor: categoryColors[category] }}
                    ></div>
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="category-stats">
                    <span className="category-time">
                      {Math.floor(minutes / 60)}h {minutes % 60}m
                    </span>
                    <span className="category-percentage">
                      {((minutes / 1440) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;

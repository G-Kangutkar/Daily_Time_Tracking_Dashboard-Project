# Daily Time Tracking & Analytics Dashboard

A comprehensive web application for tracking daily activities and analyzing time spent across different categories. Built with React, Vite, and Firebase.

## Features

- **User Authentication**: Secure email/password and Google sign-in
- **Activity Logging**: Track activities with categories and duration in minutes
- **24-Hour Validation**: Ensures total logged time doesn't exceed 1440 minutes
- **Date-Based Tracking**: Log and view activities for specific dates
- **Analytics Dashboard**: Visualize time distribution with interactive charts
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Data**: Firebase Realtime Database for instant updates

## Setup Instructions

### 1. Firebase Configuration

Before running the application, you need to update the Firebase configuration with your credentials:

1. Open `src/firebase.js`
2. Replace the placeholder values with your Firebase project credentials:
   - `apiKey`: Your Firebase API key
   - `authDomain`: Your Firebase auth domain
   - `projectId`: Your Firebase project ID
   - `storageBucket`: Your Firebase storage bucket
   - `messagingSenderId`: Your Firebase messaging sender ID
   - `appId`: Your Firebase app ID

The database URL is already configured: `https://ai-project-36184-default-rtdb.asia-southeast1.firebasedatabase.app/`

### 2. Firebase Authentication Setup

In your Firebase Console:

1. Enable Email/Password authentication
2. Optionally enable Google authentication
3. Configure your domain in Firebase Authentication settings

### 3. Firebase Database Rules

Set up these database rules in your Firebase Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## Usage Guide

### Logging Activities

1. Sign up or log in to your account
2. Select a date using the date picker
3. Add activities with:
   - Activity name
   - Category (Work, Study, Sleep, etc.)
   - Duration in minutes
4. Track your progress with the time remaining counter
5. Edit or delete activities as needed

### Analyzing Your Day

1. Log activities until you reach exactly 1440 minutes (24 hours)
2. Click the "Analyze Day" button
3. View comprehensive analytics including:
   - Time distribution by category (Pie chart)
   - Individual activity durations (Bar chart)
   - Category breakdown with percentages
   - Summary statistics

### No Data Available View

If no data exists for a selected date, you'll see a beautiful "No data available" screen with:
- Clear messaging
- Date selector to check other dates
- Quick access to start logging activities

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Charts**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **Styling**: CSS with CSS Variables

## Color Theme

- Primary (Red): #FF6B6B
- Success (Green): #10B981
- Warning (Orange): #F59E0B

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.jsx       # Authentication context
├── pages/
│   ├── Login.jsx             # Login/Signup page
│   ├── Login.css
│   ├── Dashboard.jsx         # Activity logging page
│   ├── Dashboard.css
│   ├── Analytics.jsx         # Analytics dashboard
│   └── Analytics.css
├── App.jsx                   # Main app component
├── App.css
├── firebase.js               # Firebase configuration
├── index.css                 # Global styles
└── main.jsx                  # App entry point
```

## Key Features Explained

### Activity Validation

- Prevents logging more than 1440 minutes per day
- Shows remaining time in real-time
- Validates during both adding and editing activities

### Analytics Dashboard

- Only accessible when exactly 1440 minutes are logged
- Interactive pie chart for category distribution
- Bar chart showing individual activities
- Detailed category breakdown with time and percentages
- Summary statistics cards

### Responsive Design

- Mobile-first approach
- Breakpoints for tablets and desktops
- Optimized layouts for all screen sizes
- Touch-friendly interface elements

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

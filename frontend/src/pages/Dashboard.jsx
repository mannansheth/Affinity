import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthOverview from '../components/HealthOverview';
import SignalTags from '../components/SignalTags';
import MemorySection from '../components/MemorySection';
import MetricsSection from '../components/MetricsSection';
import ActionSection from '../components/ActionSection';
import ReminderSection from '../components/ReminderSection';
import '../styles/dashboard.css';

// Mock API data for testing
const mockData = {
  "status": "success",
  "features": {
    "avgResponseDelay": 10628.12749003984,
    "avgMessageLength": 33.128,
    "avgSentiment": -0.098,
    "sentimentTrend": -0.036000000000000004,
    "lengthTrend": 6.376000000000001,
    "vulnerabilityMentions": 0,
    "conflictSignals": 0,
    "planningSignals": 12,
    "initiationCount": {
      "Mannan": 126,
      "Uday": 126
    }
  },
  "drift": {
    "driftScore": 26,
    "state": "Stable"
  },
  "memory": {
    "interests": [
      "Gym",
      "Football",
      "Statistics",
      "Data Analysis"
    ],
    "important_events": [
      "Tuesday presentation",
      "College task search"
    ],
    "goals": [
      "Complete phone map UI",
      "Complete desktop UI map",
      "Add more reports to phone UI",
      "Add reshared reports",
      "Add filter to phone map UI",
      "Complete civic issue dismissal feature",
      "Understand statistical concepts"
    ],
    "stress_points": [
      "Difficulty understanding statistical concepts",
      "Time constraints",
      "Urgent tasks",
      "Leg pain"
    ],
    "unresolved_topics": [
      "Clarification on statistical calculations",
      "Details of Tuesday presentation",
      "Specifics of college task"
    ],
    "recurring_themes": [
      "Meeting scheduling",
      "Task completion",
      "Collaboration on a project (civic issue reporting app)",
      "Time management"
    ],
    "shared_interests": [
      "Project collaboration (civic issue reporting app)"
    ]
  },
  "reminders": [
    {
      "topic": "Details of Tuesday presentation",
      "urgency": "medium",
      "suggested_message": "hi, just checking on the tuesday presentation. kya updates hain?"
    }
  ],
  "relationshipReport": {
    "healthScore": 100,
    "riskLevel": "Strong",
    "keySignals": [
      "Pending unresolved topics",
      "Strong shared interests detected",
      "Active future planning observed"
    ],
    "primaryRecommendation": "Maintain current engagement rhythm"
  },
  "orchestratedActions": {
    "primaryAction": {
      "type": "reel_suggestion",
      "reel_suggestion": [
        "Gym",
        "Football",
        "Statistics",
        "Data Analysis",
        "Project collaboration (civic issue reporting app)"
      ]
    },
    "secondaryAction": null,
    "reasoning": "Healthy connection — maintain engagement"
  }
};

function Dashboard({ data }) {
  const navigate = useNavigate();
  const displayData = data || mockData;

  if (!displayData) {
    return (
      <div className="dashboard-container">
        <div className="no-data">
          <p>No data provided. Please upload a JSON file.</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className="dashboard-title">Relationship Intelligence Report</h1>
        <div></div>
      </header>

      {/* Dashboard Content */}
      <main className="dashboard-content">
        {/* Section 1: Health Overview */}
        <HealthOverview report={displayData.relationshipReport} drift={displayData.drift} />

        {/* Section 2: Key Signals */}
        <SignalTags signals={displayData.relationshipReport.keySignals} />

        {/* Section 3: Memory Insights */}
        <MemorySection memory={displayData.memory} />

        {/* Section 4: Behavioral Metrics */}
        <MetricsSection features={displayData.features} drift={displayData.drift} />

        {/* Section 5: Suggested Actions */}
        <ActionSection action={displayData.orchestratedActions} />

        {/* Section 6: Reminders */}
        {displayData.reminders && displayData.reminders.length > 0 && (
          <ReminderSection reminders={displayData.reminders} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;

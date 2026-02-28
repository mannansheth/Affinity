import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthOverview from '../components/HealthOverview';
import SignalTags from '../components/SignalTags';
import MemorySection from '../components/MemorySection';
import MetricsSection from '../components/MetricsSection';
import ActionSection from '../components/ActionSection';
import ReminderSection from '../components/ReminderSection';
import '../styles/dashboard.css';
import TrendSection from '../components/TrendSection';


function Dashboard({ data }) {
  const navigate = useNavigate();
  if (!data || data === null || data === undefined) {
    navigate("/")
  }
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
        <TrendSection
  timeSeries={data.timeSeries}
  trendPhysics={data.trendPhysics}
  recommendations={data.recommendations}
  narrative={data.narrative}
  volatilitySpikes={data.volatilitySpikes}
  attachmentStyle={data.attachmentType}
/>
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

# Affinity

Affinity is a multi-layer conversational intelligence system that analyzes WhatsApp chat exports to model emotional dynamics, relational health, memory structures, and behavioral patterns.

It moves beyond sentiment analysis into temporal, psychological, and proactive conversational modeling.

---

# 🚀 Quick Start (Run in 3 Terminals)

## Prerequisites

- Node.js (v16+ recommended)
- npm
- Python 3.9+
- pip

Clone the repository:

```bash
git clone https://github.com/mannansheth/Affinity.git
cd Affinity
```

---

Configure environment variables in backend (check .env.example)


## 🟢 Terminal 1 — Python Backend (Flask)

```bash
cd backend-py
pip install -r requirements.txt
python main.py
```

Runs on: http://localhost:8000

---

## 🔵 Terminal 2 — Node Backend (Express)

```bash
cd backend
npm install
npx nodemon server.js
```

Runs on: http://localhost:5000

---

## 🟣 Terminal 3 — Frontend (React)

```bash
cd frontend
npm install
npm start
```

Runs on: http://localhost:3000

---

# 🧠 System Capabilities

## 1️⃣ Chat Parsing & Normalization
- WhatsApp export parsing
- Multi-format timestamp handling
- Sender normalization
- Structured message extraction

## 2️⃣ Sentiment Intelligence
- Message-level sentiment scoring
- Average sentiment
- Sentiment trend analysis
- Rolling time-series modeling

## 3️⃣ Behavioral Feature Extraction
- Average response delay
- Message length modeling
- Vulnerability signal detection
- Conflict signal detection
- Planning signal detection
- Initiation balance tracking

## 4️⃣ Relationship Drift Detection
- Drift score computation
- Stability classification
- Cooling / Stable state detection

## 5️⃣ Conversational Memory Modeling
- Interest extraction
- Shared interests
- Important events
- Goals tracking
- Stress point identification
- Recurring themes
- Unresolved topics

## 6️⃣ Stale Topic Detection
- Identifies unresolved conversational loops
- Detects pending goals
- Flags inactive discussion threads

## 7️⃣ User Style Modeling
- Interaction behavior profiling
- Tone pattern detection
- Communication style inference

## 8️⃣ Temporal Trend Physics Engine
- Linear regression slope
- Emotional volatility (std deviation)
- Acceleration detection
- Regime shift detection
- Phase classification (Growth / Cooling / Stable)
- Projection direction
- Confidence scoring
- Narrative interpretation

## 9️⃣ Volatility Spike Detection
- Identifies emotional outlier windows
- Highlights spike events on graph

## 🔟 Attachment Pattern Modeling
- Secure leaning
- Avoidant tendencies
- Anxious reactivity
- Balanced classification

## 11️⃣ Reminder Strategy Engine
- Personalized communication nudges
- Drift-aware intervention suggestions

## 12️⃣ Relationship Report Generator
- High-level relational summary
- Integrated feature synthesis

## 13️⃣ Action Orchestrator
- Combines:
  - Relationship insights
  - Stale topics
  - Reminder strategies
  - Interest-based suggestions
- Produces structured action recommendations

---

# 📊 What You See In The Dashboard

- Emotional trend graph
- Regime shift markers
- Volatility spike highlights
- Narrative interpretation layer
- Attachment pattern inference
- Agent recommendations
- Reminder strategies
- Draft message impact analysis

---

# 🏗 Architecture Overview

Affinity/
│
├── frontend/      → React + Recharts (Visualization Layer)
├── backend/       → Node.js + Express (Orchestration & Modeling)
├── backend-py/    → Python + Flask (Parsing & Sentiment Engine)
└── README.md

---

---

# 👨‍💻 Author

Mannan Sheth  
GitHub: https://github.com/mannansheth
# InfraSight AI (PAIMANA-AI)
### AI-Powered Predictive Analytics & Early Warning System for Infrastructure Project Monitoring

**Smart India Hackathon 2026 — Problem Statement ID: SIH26103**  
**Organization**: Ministry of Statistics and Programme Implementation (MoSPI)  
**Division**: Infrastructure & Project Monitoring Division (IPMD), Khurshid Lal Bhawan, Janpath, New Delhi  
**Reference Portal**: [PAIMANA (MoSPI)](https://paimana-proj.mospi.gov.in/)  
**Lead Developer**: Bhojanapu Deva Raj (B.Tech CSE, Madanapalle Institute of Technology & Science — MITS, JNTUA)

---

## 🏛️ Core Vision: Intelligence Layer on top of PAIMANA

The Government of India tracks **1,981 ongoing Central Sector infrastructure projects worth ₹42.78+ Lakh Crore** through the **PAIMANA / OCMS** portal. 

While PAIMANA excels at collecting monthly Common Upload Form (CUF) progress and expenditure data, it is inherently **descriptive** — reporting delays after they have already occurred.

**InfraSight AI** acts as the **predictive and prescriptive decision-support intelligence layer** on top of PAIMANA. It answers the **five essential questions** required by policymakers:

```text
               GOVERNMENT'S EXISTING SYSTEM (PAIMANA / OCMS)
                                │
                      Project monitoring data
                                │
                                ▼
              ┌──────────────────────────────────┐
              │           InfraSight AI          │
              │                                  │
              │  1. Which projects going wrong?  │
              │  2. Which likely to go wrong?    │
              │  3. Why is project risky? (XAI)  │
              │  4. What to look at first?       │
              │  5. What might happen next?      │
              └─────────────────┬────────────────┘
                                │
                                ▼
                     Government Decision Maker
```

---

## 🚀 The 5 Core Decision-Support Questions

1. **Which projects are going wrong?**
   - 1,981 projects continuously evaluated into a 4-tier risk classification:
     - 🔴 **87 Critical Risk** (>90% risk)
     - 🟠 **214 High Risk** (70–90% risk)
     - 🟡 **426 Medium Risk** (45–70% risk)
     - 🟢 **1,254 Low Risk** (<45% risk)

2. **Which projects are likely to go wrong before it's official?**
   - Detects **early progress-expenditure divergence gaps** (e.g., Financial Expenditure spent = 74.1% while Physical Progress = 48.0%), flagging high-probability future delays **months before** an official DOC slippage is declared.

3. **Why is the project risky? (Explainable AI / SHAP)**
   - Decomposes predictions into quantifiable feature attribution vectors:
     - Schedule slippage (+31%)
     - Physical vs. Financial progress gap (+24%)
     - Expenditure drawdown bottlenecks (+18%)
     - Material inflation (steel/cement) (+12%)
     - Regional weather & geological factors (+5%)

4. **What should the government look at first? (Executive Priority Matrix)**
   - Prioritizes interventions by **Financial Capital Value (₹ Cr) × AI Risk Score (%)** so monitoring officers immediately see the top projects requiring urgent escalation.

5. **What might happen next? (Predictive Forecast)**
   - **Cost Trajectory**: Original Approved Cost → Current Revised Sanction → **Predicted Final Cost (ML Regressor)** [+Expected Additional Cost].
   - **Schedule Trajectory**: Official DOC Target → **Predicted Completion Date (AI Delay Model)** [+Expected Delay Months].

---

## 📊 SIH26103 Key Evaluation Highlights

### Statistical Baseline vs. AI/ML Benchmarking
- **OLS Regression**: 28.4% RMSE (Cost Overrun) | F1-Score: 0.59
- **ARIMA Milestone Model**: 24.1% RMSE | F1-Score: 0.65
- **XGBoost (CUF Fields Only)**: 16.8% RMSE | F1-Score: 0.78
- **LightGBM (CUF + Extended Variables)**: **9.2% RMSE (Best)** | **F1-Score: 0.90 (90%)**

### Incremental Predictive Power: CUF vs. Extended Variables (Dimension c)
Incorporating 4 external signals (monsoon stoppage days, steel/cement commodity indices, land acquisition litigation, contractor liquidity stress) provides a **+34.2% accuracy lift** and expands early warning lead time from **1.8 months to 5.4 months** in advance.

---

## 🛠️ Technology Stack (100% Open-Source)

- **Frontend Application Layer**: React 19, Vite, Tailwind CSS
- **Visualizations**: Recharts, Lucide Icons
- **GIS Basemaps**: Leaflet.js with CARTO Voyager Light Tiles
- **Predictive Engine**: Python, Scikit-learn, XGBoost, LightGBM, SHAP
- **LLM Intelligence Assistant**: Retrieval-Augmented Generation (RAG) over project database and MoSPI flash reports

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/hari-reddy1/InfraSight-AI.git
cd InfraSight-AI

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🏛️ Official Alignment & Attribution
Aligned with the **Infrastructure & Project Monitoring Division (IPMD)**, Ministry of Statistics & Programme Implementation (MoSPI), Government of India.

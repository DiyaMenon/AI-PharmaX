# AI-PharmaX
Agentic AI system for pharmaceutical drug repurposing

AI-PharmaX is an **Agentic AI–driven research intelligence prototype** designed to accelerate pharmaceutical drug repurposing by autonomously orchestrating multiple domain-specific AI agents.

Live Demo: https://ai-pharmax-6470828746.us-west1.run.app/

---

## 🧠 Problem Context

Pharmaceutical organizations invest significant time and resources in identifying new therapeutic uses for approved molecules.  
Today, this process involves **manual, fragmented analysis** across scientific literature, clinical trial registries, patent databases, and market intelligence platforms - often taking **weeks to months per molecule**.

This slows innovation, increases R&D costs, and limits the number of opportunities teams can evaluate.

---

## 💡 Solution Overview

AI-PharmaX addresses this challenge by introducing an **Agentic AI orchestration model**, where a central **Master Agent** decomposes complex research queries and coordinates multiple **Worker Agents** to perform parallel, domain-specific analysis.

The system enables researchers to submit a single prompt and receive **structured, explainable, and decision-ready insights** within minutes.

---

## ⚙️ Key Capabilities

- Agentic task decomposition and orchestration  
- Parallel analysis across clinical, patent, market, and trade domains  
- Transparent, agent-wise reasoning for explainability  
- Visual dashboards with charts, tables, and decision matrices  
- Automated report generation and portfolio-level scoring  

---

## 🏗️ System Architecture (High Level)

**Frontend**
- React + TypeScript (Vite)
- Component-driven UI for agent insights and visuals

**Agentic AI Layer**
- Agent orchestration inspired by CrewAI / LangGraph principles
- Master Agent coordinating multiple Worker Agents

**AI Models**
- Gemini / OpenRouter-based LLMs for reasoning and synthesis

**Data & Visualization**
- Simulated integrations with IQVIA, USPTO, ClinicalTrials.gov
- Charts, matrices, and structured reports for decision support

> Note: External data sources are intentionally simulated in this prototype to demonstrate system behavior and feasibility.

---

## Running the Project Locally

### Prerequisites
- Node.js **v18+**
- npm

### Installation
```bash
npm install
```
## Environment Setup

Create a `.env` file in the project root and add one of the following API keys:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```
or
```env
VITE_OPENROUTER_API_KEY=your_api_key_here
```

## Run the App

Start the development server:

```bash
npm run dev
```
Open the app in your browser:
```
http://localhost:5173
```

## Prototype Scope (EY Techathon)

This repository represents a **working prototype** focused on:

- Agent orchestration logic  
- Visual analytics and explainability  
- Automated reporting workflows  

Backend services such as databases, authentication, and production APIs are **abstracted at this stage** and designed for seamless integration in a full deployment.

---

## Live Demo

**Deployed Application:**  
https://ai-pharmax-6470828746.us-west1.run.app/


## Future Extensions

- Live integrations with proprietary and public pharmaceutical data sources  
- Advanced portfolio comparison across multiple molecules  
- Role-based access control and team collaboration  
- Deployment as a scalable SaaS platform  

---

## Author

**Diya Satish Kumar**  
B.Tech Computer Science and Engineering  
Sardar Vallabhbhai National Institute of Technology, Surat  

---

## License

This project is licensed under the **MIT License**.

# 🌾 RythuSandhi AI 

> **Pre-Harvest Buyer Discovery & Decision Support Platform for Smallholder Farmers**

RythuSandhi AI is a conversational, guidance-first pre-cultivation decision agent built on Google Cloud serverless infrastructure. It helps smallholder farmers (0.5 to 10 acres) in Andhra Pradesh and Telangana discover verified corporate buyers, market requirements, and contract options **before sowing or planting**, bringing market clarity and eliminating mediator fraud.

---

## 📋 Table of Contents

- [Executive Summary & Core Philosophy](#-executive-summary--core-philosophy)
- [Supported MVP Crops & Agronomic Rules](#-supported-mvp-crops--agronomic-rules)
- [Land Scale & Aggregation Framework](#-land-scale--aggregation-framework)
- [Safety & Fraud Prevention Boundaries](#-safety--fraud-prevention-boundaries)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [API Reference & Specifications](#-api-reference--specifications)
- [Known Limitations & Next Steps](#-known-limitations--next-steps)
- [Local Setup & Deployment Guide](#-local-setup--deployment-guide)

---

## 💡 Executive Summary & Core Philosophy

### The Gap in Smallholder Agriculture

Small farmers often have land and willingness to cultivate high-value cash crops (such as Aloe Vera, Mushrooms, or Microgreens) but face critical market uncertainty before investing capital:

- *Who will buy my harvest?*
- *Is my plot size sufficient for corporate minimum delivery thresholds?*
- *What quality standards and processing windows are required?*
- *How do I avoid fake buyers and advance-payment fraud?*

### Guidance-First vs. Post-Harvest Marketplace

Traditional agricultural marketplaces focus on **post-harvest listing** (farmers list harvested produce and negotiate manually). **RythuSandhi AI operates on a pre-harvest guidance model**:

- **On-Demand Pull Strategy:** Answers farmer queries dynamically without initiating unsolicited profiling questions.
- **Pre-Sowing Decision Support:** Advises on minimum quantity realities, land preparation, processing constraints, and buyer contract readiness before planting begins.
- **Consent-Based Buyer Matching:** Triggers event-driven alerts via Cloud Pub/Sub and Firestore without exposing raw farmer contacts to unverified agents.

---

## 🌱 Supported MVP Crops & Agronomic Rules

RythuSandhi AI enforces strict agronomic bounds and regional suitability rules across 4 high-value MVP crops:

| Crop | Cultivation Setup | Key Field & Scale Guidelines |
| :--- | :--- | :--- |
| 🌱 **Aloe Vera** | Open-Field (0.5 – 10 acres) | Requires well-drained sandy loam soil. Leaves must be processed within **6 hours** of harvest to preserve gel quality. |
| 🍄 **Oyster & Button Mushrooms** | Indoor Shed / Dark Room | Requires 22–25°C dark rooms with 85–90% humidity. Rapid **25-day harvest cycles**. |
| 🌿 **Microgreens** | Indoor Vertical Racks | Fast **10–14 day turnaround** supplying hotel, restaurant, and culinary buyers. |
| 🌸 **Saffron (Kumkum Puvvu)** | Indoor Climate-Controlled Vertical Chambers **ONLY** | ⚠️ **Strict Regional Climate Warning:** Open-field cultivation is **NOT suitable** for the warm plains of AP/Telangana. Restricted exclusively to automated indoor cooling setups. |

---

## 🚜 Land Scale & Aggregation Framework

Corporate buyers typically require a minimum delivery batch of **5 tonnes** for direct farm-gate truck pickup. RythuSandhi AI dynamically categorizes land scale:

1. **Small Parcels (< 2 Acres)**
   - Harvest volume from selective picking falls below direct corporate batch minimums.
   - **Advisory Action:** Recommends aggregation via local FPO clusters (e.g., *Anantha Raithu Organic FPO*) to aggregate volume for bulk corporate contracts.

2. **Direct Delivery Parcels (2 to 10 Acres)**
   - Expected seasonal yield meets or exceeds the 5-tonne corporate threshold.
   - **Advisory Action:** Qualifies the plot for direct corporate farm-gate truck pickup (e.g., *Naturals Bio-Tech Labs*, requiring 5 Tonnes/month).

---

## 🛡️ Safety & Fraud Prevention Boundaries

To protect smallholder farmers from financial exploitation, RythuSandhi AI strictly enforces the following trust boundaries:

- **❌ Zero Profit Guarantees:** Explicitly clarifies that agricultural yields, market prices, weather conditions, and buyer contract specifications fluctuate based on real-time market dynamics.
- **❌ Zero Advance Fees:** Strictly warns farmers **never to pay upfront registration or advance processing fees** to unverified buyers or agents.
- **🔒 Written Agreements:** Advises farmers to secure formal buyback agreements and verify buyer GST registration before sowing.

---

## 🏗️ System Architecture & Tech Stack

RythuSandhi AI is engineered on a cost-effective, **scale-to-zero serverless architecture** on Google Cloud:

```text
[ React Frontend (a.run.app) ]
       │ (HTTPS / REST)
       ▼
[ Cloud Run Backend (Flask / Python) ] ── IAM Auth ──► [ Vertex AI / Gemini 1.5 Flash ]
       │                                                      │
       ├──► [ Cloud Firestore ] (Buyer Profiles & Demands) ◄──┘
       └──► [ Cloud Pub/Sub ] (Event-Driven Matching Alerts)
```

- **Runtime Environment:** Google Cloud Run (Dockerized Flask + Gunicorn).
- **Intelligence Engine:** Google Vertex AI (`gemini-1.5-flash`) authenticated natively via Cloud IAM Service Accounts (Zero API keys in source code).
- **Database & Messaging:** Google Cloud Firestore & Cloud Pub/Sub.

---

## 🔌 API Reference & Specifications

### 📡 1. Pre-Harvest Chat & Buyer Discovery

**`POST /api/chat`**

Main endpoint processing farmer land queries, land-size scale evaluation (< 2 acres → FPO aggregation vs. ≥ 2 acres → direct corporate pickup), and verified buyer discovery.

#### 📤 Request Payload Structure

```json
{
  "message": "I have 3 acres of land, whats the best crop to grow where I get good returns",
  "history": [
    { "sender": "user", "text": "Hello" }
  ]
}
```

#### 📑 Request Fields

| JSON Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `message` | string | Yes | The active prompt or query sent by the user/farmer. |
| `history` | array[object] | No | Previous chat messages containing `sender` and `text` properties. |

#### 📥 Response Payload Structure

```json
{
  "response": "**Namaste! Regarding 3 acres, here is our pre-harvest decision guidance...**",
  "cropDetected": "MVP Crops Directory",
  "buyerMatches": [
    "• Naturals Bio-Tech Labs: Needs 5 Tonnes/month (Anantapur, AP)",
    "• Anantha Raithu Organic FPO: Aggregating smallholder plots (<2 acres) for bulk lab contracts"
  ],
  "fpoAdvisory": false,
  "citations": []
}
```

#### 📑 Response Fields

| JSON Field | Type | Description |
| :--- | :--- | :--- |
| `response` | string | Primary advisory text formatted with markdown headers, scale analysis, and safety rules. |
| `cropDetected` | string | Identified crop entity (Aloe Vera, Mushroom, Microgreens, Saffron, or MVP Crops Directory). |
| `buyerMatches` | array[string] | Matching verified corporate buyers and regional FPO aggregator contacts. |
| `fpoAdvisory` | boolean | Set to `true` when land size is < 2 acres, recommending local FPO cluster aggregation. |
| `citations` | array | Citation references for retrieved data points. |

---

### 🏥 2. Health & Container Status Check

**`GET /health`**

#### 📥 Response Payload Structure

```json
{
  "status": "healthy",
  "service": "RythuSandhi-api",
  "version": "10.2"
}
```

---

## 📌 Known Limitations & Next Steps

- **Failing Queries:** Multi-turn follow-up questions (e.g., "Who will buy my crop") following a land-size prompt occasionally re-triggered generic decision guides instead of buyer listings, while null values in chat history payloads caused fallback exception errors.
- **Root Cause:** Prompt routing relied on deterministic keyword/regex priority order rather than intent classification, alongside strict string-joining assumptions on input history arrays.
- **Next Steps:** Migrate routing to dynamic Vertex AI (Gemini 1.5 Flash) session orchestration with Pydantic request payload validation and Firestore vector search (RAG) for real-time buyer directory lookup.

---

## 🚀 Local Setup & Deployment Guide

### Prerequisites

- Python 3.12+
- Google Cloud SDK (`gcloud`)

### Quickstart

**1. Clone Repository:**

```bash
git clone https://github.com/your-username/RythuSandhi_AI.git
cd RythuSandhi_AI
```

**2. Install Dependencies:**

```bash
pip install -r requirements.txt
```

**3. Run Backend Locally:**

```bash
python main.py
```

**4. Deploy to Google Cloud Run:**

```bash
gcloud run deploy RythuSandhi-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --clear-base-image \
  --set-env-vars GCP_PROJECT_ID="your-project-id",GCP_LOCATION="us-central1"
```

---

*Developed for the Google Cloud Pachamama Initiative.*

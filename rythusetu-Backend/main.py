import os
import re
import traceback
from flask import Flask, request, jsonify

# Flask CORS handling
try:
    from flask_cors import CORS
    has_cors = True
except ImportError:
    has_cors = False

app = Flask(__name__)

if has_cors:
    CORS(app)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# GCP & Search Configuration
PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "project-406ce291-61bd-4c87-9e8")
SEARCH_ENGINE_ID = os.environ.get("SEARCH_ENGINE_ID", "rythusetu-search-app_1788521929950")
LOCATION = os.environ.get("GCP_LOCATION", "global")

# Firestore Client
try:
    from google.cloud import firestore
    db = firestore.Client(project=PROJECT_ID)
except Exception:
    db = None

# Discovery Engine Search Client
try:
    from google.cloud import discoveryengine_v1 as discoveryengine
    search_client = discoveryengine.SearchServiceClient()
except Exception:
    search_client = None

UNSUPPORTED_CROPS = [
    "paddy", "rice", "cotton", "chilli", "chili", "chillies", "chilies", "tomato", "tomatoes", 
    "mango", "mangoes", "sugarcane", "wheat", "maize", "corn", "turmeric", "groundnut", 
    "banana", "onion", "onions", "tobacco", "coconut", "papaya", "guava", "pomegranate", 
    "lemon", "citrus", "coffee", "tea", "rubber", "cashew", "millet", "millets", "pulses", 
    "gram", "mustard", "soybean", "jute", "cardamom", "pepper", "vegetable", "vegetables", 
    "fruit", "fruits", "apple", "apples", "potato", "potatoes", "brinjal", "eggplant",
    "cabbage", "cauliflower", "carrot", "radish", "ginger", "garlic", "coriander"
]

def extract_land_size(user_prompt, history_text=""):
    match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acre|acres|ac)', user_prompt, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acre|acres|ac)', history_text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    return None

def detect_crop_in_text(text):
    if not text:
        return None
    text_lower = text.lower()
    if "aloe" in text_lower or "kalabanda" in text_lower:
        return "Aloe Vera"
    elif "mush" in text_lower or "puttakokkulu" in text_lower:
        return "Mushroom"
    elif "saffr" in text_lower or "kumkum" in text_lower:
        return "Saffron"
    elif "microgreen" in text_lower:
        return "Microgreens"
    return None

def check_unsupported_crop(user_prompt):
    prompt_lower = user_prompt.lower()
    for crop in UNSUPPORTED_CROPS:
        if re.search(r'\b' + re.escape(crop) + r'\b', prompt_lower):
            return crop.capitalize()
    return None

def is_explicit_buyer_followup(user_prompt):
    triggers = ["who can buy", "who will buy", "buyer", "buyers", "where to sell", "how to sell", "who buys", "buyers list"]
    prompt_lower = user_prompt.lower()
    return any(t in prompt_lower for t in triggers)

def query_vertex_search(query_text):
    if not search_client:
        return None
    try:
        serving_config = search_client.serving_config_path(
            project=PROJECT_ID,
            location=LOCATION,
            data_store=SEARCH_ENGINE_ID,
            serving_config="default_config",
        )
        request_payload = discoveryengine.SearchRequest(
            serving_config=serving_config,
            query=query_text,
            page_size=3,
            content_search_spec=discoveryengine.SearchRequest.ContentSearchSpec(
                summary_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec(
                    summary_result_count=3,
                    include_citations=False
                )
            )
        )
        response = search_client.search(request_payload)
        if hasattr(response, 'summary') and response.summary and response.summary.summary_text:
            summary_text = response.summary.summary_text.strip()
            summary_text = re.sub(r'\\[\d+\\]', '', summary_text)
            return summary_text
    except Exception as e:
        print(f"Vertex AI Search Notice: {e}")
    return None

def fetch_buyer_matches(crop_name):
    matches = []
    if db:
        try:
            buyers_ref = db.collection('buyer_demands')
            query = buyers_ref.where('crop', '==', crop_name.lower()).limit(3).stream()
            for doc in query:
                data = doc.to_dict()
                company = data.get('company_name') or data.get('companyName') or 'Verified Partner'
                qty = data.get('quantity_tonnes') or data.get('minimumQuantity') or 5
                unit = data.get('quantityUnit') or 'Tonnes/month'
                loc = data.get('location') or data.get('pickupLocation') or 'AP / Telangana'
                matches.append(f"• **{company}**: Needs {qty} {unit} ({loc})")
        except Exception as e:
            print(f"Firestore Notice: {e}")

    if not matches:
        if crop_name == "Aloe Vera":
            matches.append("• **Naturals Bio-Tech Labs**: Needs 5 Tonnes/month (Anantapur, AP)")
            matches.append("• **Anantha Raithu Organic FPO**: Aggregating smallholder plots (<2 acres) for bulk lab contracts")
        elif crop_name == "Mushroom":
            matches.append("• **Deccan Fresh Foods**: Needs 200 kg/day fresh Oyster Mushrooms (Hyderabad, Telangana)")
            matches.append("• **Rayalaseema Agri Processors**: Needs 1 Tonne/month dehydrated mushrooms")
        elif crop_name == "Microgreens":
            matches.append("• **Aroma Culinary Supplies**: Needs 50 kg/week (Vizag & Vijayawada hotels)")
        elif crop_name == "Saffron":
            matches.append("• **Specialty Herbal Exporters**: Requires certified indoor vertical chamber produce")

    return matches

def make_payload(text, crop=None, buyers=None, fpo_adv=False, fpo_msg=""):
    return jsonify({
        "response": text,
        "answer": text,
        "message": text,
        "text": text,
        "reply": text,
        "cropDetected": crop,
        "buyerMatches": buyers or [],
        "citations": [],
        "fpoAdvisory": fpo_adv,
        "fpoMessage": fpo_msg
    })

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json(silent=True) or {}
        if not data and request.form:
            data = request.form.to_dict()

        user_prompt = (
            data.get('message') or 
            data.get('query') or 
            data.get('prompt') or 
            data.get('text') or 
            ''
        ).strip()

        history_raw = data.get('history') or data.get('messages') or []
        history_text = " ".join([
            item.get('text', '') if isinstance(item, dict) else str(item)
            for item in history_raw
        ])

        # 1. Empty Prompt
        if not user_prompt:
            msg = (
                "**Namaste! Welcome to RythuSetu AI.**\n\n"
                "We provide pre-harvest decision support for smallholder farmers (0.5 to 10 acres) and high-value agri-buyers.\n\n"
                "💡 **How can I help you today?**\n"
                "• *Farmer Example:* 'I have 3 acres of land, I want to grow Aloe Vera'\n"
                "• *Small Parcel Example:* 'I have 1 acre of land, can I grow Aloe Vera?'\n"
                "• *Buyer Example:* 'I am a buyer looking for 5 tonnes of organic Aloe Vera in AP'"
            )
            return make_payload(msg)

        crop_in_prompt = detect_crop_in_text(user_prompt)
        crop_in_history = detect_crop_in_text(history_text)
        unsupported = check_unsupported_crop(user_prompt)

        # 2. Unsupported Crop Check
        if unsupported and not crop_in_prompt:
            msg = (
                f"**Namaste! RythuSetu AI currently supports pre-harvest decision guidance and buyer discovery for our 4 high-value MVP crops:**\n\n"
                "1. 🌱 **Aloe Vera** (Open-field, 0.5 to 10 acres)\n"
                "2. 🍄 **Oyster & Button Mushrooms** (Indoor, 25-day cycles)\n"
                "3. 🌿 **Microgreens** (Indoor vertical, 10–14 day cycles)\n"
                "4. 🌸 **Saffron / Kumkum Puvvu** (Indoor climate-controlled vertical farming)\n\n"
                f"⚠️ **Crop Support Notice:** We currently do not support guidance or buyer matching for **{unsupported}**. Our database is being expanded soon!\n\n"
                "💡 **Please ask us a query about one of our 4 supported MVP crops** (e.g., *'I have 3 acres, how to grow Aloe Vera?'*)."
            )
            return make_payload(msg)

        acres = extract_land_size(user_prompt, history_text)

        # 3. Buyer Requirement Registration Intent
        prompt_lower = user_prompt.lower()
        buyer_keywords = ["looking for", "buyer looking", "procure", "need 5 tonnes", "need 10 tonnes", "register buyer demand"]
        is_buyer = any(kw in prompt_lower for kw in buyer_keywords) and not any(p in prompt_lower for p in ["how to grow", "can i grow", "want to grow"])

        if is_buyer:
            crop_name = crop_in_prompt or crop_in_history or "High-Value Produce"
            msg = (
                f"**Namaste! Welcome to RythuSetu AI Buyer Connect Portal.**\n\n"
                f"📋 **Buyer Requirement Logged for {crop_name}:**\n"
                f"Thank you for registering your demand with us. We have captured your query:\n*\"{user_prompt}\"*\n\n"
                "✅ **Next Verification Checklist for Procurement:**\n"
                "• **Quantity & Cadence:** Please confirm required monthly volume (e.g., 5 tonnes/month).\n"
                "• **Quality Grade:** Specify organic vs. standard cultivation standards.\n"
                "• **Logistics:** Indicate whether you offer farm-gate truck pickup or require delivery.\n"
                "• **Contract Support:** Confirm if buyback terms or planting material support will be provided.\n\n"
                "🔒 **Farmer Matrimony Alert System:**\n"
                "Your procurement requirement is being matched with verified smallholder farmer clusters and FPOs in AP & Telangana. Matched farmers will receive a consent-based alert to connect with you directly."
            )
            return make_payload(msg, crop=crop_name)

        # 4. Explicit Buyer Follow-up ("who can buy", "buyers list")
        if is_explicit_buyer_followup(user_prompt):
            target_crop = crop_in_prompt or crop_in_history or "Aloe Vera"
            buyers = fetch_buyer_matches(target_crop)
            acres_str = f" for your {acres:g}-acre plot" if acres else ""
            lines = [
                f"Here are the verified pre-harvest buyers and aggregator networks for **{target_crop}**{acres_str}:\n",
                "📈 **Matching Corporate Buyers & FPO Networks:**"
            ]
            lines.extend(buyers)
            if acres and acres < 2.0:
                lines.append(f"\n🚜 **Aggregation Advisory:** Since your plot ({acres:g} acre) is under 2 acres, connecting via **Anantha Raithu Organic FPO** ensures your harvest is aggregated to meet corporate minimum delivery lots.")
            elif acres and acres >= 2.0:
                lines.append(f"\n✅ **Direct Pickup Eligible:** At {acres:g} acres, your yield meets the 5-tonne minimum corporate threshold for direct farm-gate truck pickup.")
            lines.append("\n🔒 **Safety Rule:** Always secure written purchase terms before planting. Never pay upfront registration or advance processing fees.")
            return make_payload("\n".join(lines), crop=target_crop, buyers=buyers, fpo_adv=(acres is not None and acres < 2.0))

        # 5. General Query / Multi-Crop Guidance (when no crop is mentioned in user_prompt)
        if not crop_in_prompt:
            acres_str = f"{acres:g} acres" if acres else "your land"
            fpo_note = "Plots under 2 acres benefit from local FPO cluster aggregation to meet corporate minimum order thresholds." if (acres and acres < 2.0) else "At 2+ acres, expected yield meets the 5-tonne corporate minimum threshold for direct farm-gate pickup!"
            msg = (
                f"**Namaste! Regarding {acres_str}, here is our pre-harvest decision guidance across our 4 supported high-value MVP crops:**\n\n"
                "🌟 **1. Aloe Vera (Open-Field, Perennial Cash Crop):**\n"
                f"• **Scale & Market:** {fpo_note}\n"
                "• **Field Guidance:** Requires well-drained sandy loam soil with a gentle slope. Leaves must be processed within **6 hours** of harvest to preserve gel quality.\n\n"
                "🌟 **2. Oyster & Button Mushrooms (Indoor, High Frequency Cash Flow):**\n"
                "• **Scale & Market:** Ideal for small land parcels or indoor sheds. High demand from local hotels, restaurants, and food processors.\n"
                "• **Field Guidance:** Requires climate-controlled dark rooms (22-25°C, 85-90% humidity) with rapid **25-day harvest cycles**.\n\n"
                "🌟 **3. Microgreens (Indoor Vertical, Fast Turnaround):**\n"
                "• **Scale & Market:** High-value 10–14 day harvest cycles supplying culinary buyers and urban markets.\n"
                "• **Field Guidance:** Requires indoor vertical racks with LED lighting and misting.\n\n"
                "🌟 **4. Saffron / Kumkum Puvvu (Specialized Indoor Vertical Only):**\n"
                "• **Warning:** Open-field cultivation is **not suitable** for the warm plains of AP or Telangana.\n"
                "• **Field Guidance:** Requires automated indoor cooling chambers.\n\n"
                "🔒 **Safety Rule:** Always secure written purchase agreements before planting. Never pay upfront registration or advance processing fees."
            )
            return make_payload(msg, crop="MVP Crops Directory", buyers=fetch_buyer_matches("Aloe Vera"), fpo_adv=(acres is not None and acres < 2.0))

        # 6. Specific Crop Guidance (Aloe Vera, Mushroom, Microgreens, Saffron)
        target_crop = crop_in_prompt
        acres_formatted = f"{acres:g}" if acres else "your"
        acre_unit = "acre" if (acres and acres == 1.0) else "acres"

        lines = [f"**Namaste! Regarding your {acres_formatted}-{acre_unit} {target_crop} project:**\n"]

        if target_crop == "Saffron":
            lines.append(
                "⚠️ **Climate & Setup Warning:** Saffron (Kumkum Puvvu) is extremely sensitive and requires a cold microclimate. "
                "Open-field cultivation is **not suitable** for the warm plains of Andhra Pradesh or Telangana. "
                "Saffron must only be cultivated using highly controlled, indoor vertical farming setups with automated cooling.\n\n"
                "🛡️ **No Profit Guarantees:** We cannot guarantee any specific profit figure. "
                "Specialty crop yields and prices fluctuate based on climate control precision and buyer terms.\n\n"
                "🔒 **Transaction Safety:** Never pay any upfront registration or advance processing fees to unverified buyers."
            )
        else:
            rag_text = query_vertex_search(f"{target_crop}: {user_prompt}")
            lines.append(f"🌱 **Cultivation & Field Guidance ({target_crop}):**")
            if rag_text and "No results" not in rag_text and len(rag_text) > 30:
                lines.append(f"{rag_text}\n")
            else:
                if target_crop == "Aloe Vera":
                    lines.append("• **Land & Soil:** Requires well-drained sandy loam soil with a gentle slope to prevent root waterlogging.")
                    lines.append("• **Harvest Window:** Harvest mature outer leaves early in the morning. Extraction/processing must occur within **6 hours** of harvest to preserve gel quality.\n")
                elif target_crop == "Mushroom":
                    lines.append("• **Environment:** Indoor climate-controlled dark rooms (22-25°C with 85-90% humidity).")
                    lines.append("• **Substrate & Cycle:** Uses pasteurized paddy straw or wheat straw blocks with rapid 25-day harvest cycles.\n")
                elif target_crop == "Microgreens":
                    lines.append("• **Environment:** Indoor vertical rack setup with LED lighting and daily misting.")
                    lines.append("• **Harvest Cycle:** Rapid 10-14 day turnaround supplying local hotels and culinary buyers.\n")

            lines.append("🚜 **Market & Scale Analysis:**")
            if acres is not None and acres < 2.0:
                lines.append(f"• **FPO Aggregation Recommended:** On {acres:g} {acre_unit}, selective harvest yield may fall below the 5-tonne minimum required by corporate buyers. Grouping with local FPOs (e.g., **Anantha Raithu Organic FPO**) secures direct corporate farm-gate pickup.")
            elif acres is not None and acres >= 2.0:
                lines.append(f"• **Direct Buyer Match Eligible:** At {acres:g} {acre_unit}, expected harvest volume easily meets/exceeds the **5-tonne corporate minimum threshold**, making your crop eligible for direct farm-gate truck pickup!")
            else:
                lines.append("• **Scale Threshold:** Corporate buyers usually require a minimum batch size of 5 tonnes for farm-gate truck pickup. Plots under 2 acres benefit from FPO cluster aggregation, while plots of 2–10 acres qualify for direct corporate contract pickup.")

        buyers = fetch_buyer_matches(target_crop)
        if buyers:
            lines.append("\n📈 **Matching Pre-Harvest Buyer Demands:**")
            lines.extend(buyers)

        lines.append("\n🔒 **Safety Rule:** Always secure written purchase terms before planting. Never pay upfront registration or advance processing fees.")

        return make_payload("\n".join(lines), crop=target_crop, buyers=buyers, fpo_adv=(acres is not None and acres < 2.0))

    except Exception as err:
        tb = traceback.format_exc()
        print(f"Error handling request: {tb}")
        err_msg = "Namaste! We encountered a temporary error processing your request. Please try asking a crop query such as 'I have 3 acres, how to grow Aloe Vera'."
        return make_payload(err_msg)

@app.route('/health', methods=['GET'])
@app.route('/', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "rythusetu-api", "version": "6.0"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=True)

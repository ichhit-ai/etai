import json
import os
import urllib.request

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

class RegulatoryRAG:
    def __init__(self, data_path):
        with open(data_path, 'r') as f:
            self.rules = json.load(f)

    def search_rules(self, query):
        query_lower = query.lower()
        results = []
        for r in self.rules:
            if any(k in r["title"].lower() or k in r["text"].lower() or k in r["standard"].lower() for k in query_lower.split()):
                results.append(r)
        return results if results else self.rules[:3]

    def query_gemini(self, prompt, context_rules, active_telemetry=None):
        rules_formatted = "\n".join([f"• [{r['standard']} {r['section']}] {r['title']}: {r['text']}" for r in context_rules])
        
        system_instruction = (
            "You are SentinAI — the lead AI Safety Officer & Regulatory Compliance Intelligence System for heavy industrial plants.\n\n"
            "ABOUT SENTINAI PROJECT & DATA:\n"
            "• Purpose: Predict real-time compound industrial risks before accidents happen (e.g. Visakhapatnam steel plant disaster).\n"
            "• Core Math: Fuses gas sensors, vessel pressure, worker BLE locations, digital permits (PTW), and shift change windows into a Compound Risk Score R(z,t).\n"
            "• Active Plant Layout: 4 Zones — Coke Oven Battery 4 (Z1), Gas Recovery Plant (Z2), Blast Furnace 2 (Z3), Chemical Storage Tank Farm (Z4).\n"
            "• Data Standards: Trained & indexed on Indian statutory safety regulations (OISD-STD-105 for Hot Work, The Factories Act 1948 Section 36/37 for toxic fumes/confined spaces, DGMS Rules for SIMOPS simultaneous operations).\n"
            "• Value Proposition: Single sensors are 'lonely' and report normal baseline readings. SentinAI correlates multiple low-level signals to give a 2-hour early warning lead time.\n\n"
            "INSTRUCTIONS FOR RESPONDING:\n"
            "- If the user asks about the project, what you do, how it works, what data is used, or general greetings: Explain clearly, confidently, and conversationally with specific details about SentinAI, its 4 zones, compound risk formula, and safety regulations.\n"
            "- If the user asks a safety/compliance question: Give a direct ruling (PROHIBITED, PERMITTED, or CONDITIONAL) and cite the exact regulatory clauses below.\n"
            "- Keep answers clear, professional, structured, and easy to read.\n\n"
            f"STATUTORY REGULATORY CONTEXT:\n{rules_formatted}\n\n"
            f"CURRENT LIVE SCADA TELEMETRY:\n{json.dumps(active_telemetry or {})}\n\n"
            f"USER QUERY: {prompt}"
        )

        payload = {
            "contents": [{"parts": [{"text": system_instruction}]}],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 400
            }
        }

        # Query Gemini API models in fallback sequence
        models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"]
        for m in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={GEMINI_API_KEY}"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=6) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    text = result['candidates'][0]['content']['parts'][0]['text']
                    if text and len(text.strip()) > 0:
                        return text
            except Exception:
                continue

        # Clean fallback synthesis if API rate limit occurs
        return (
            f"SentinAI Safety Intelligence System:\n\n"
            f"I monitor 4 plant zones (Coke Oven, Gas Recovery, Blast Furnace, Tank Farm) using real-time SCADA telemetry, PTW permits, and Indian statutory codes (OISD-STD-105, Factories Act 1948, DGMS).\n\n"
            f"{rules_formatted}"
        )

    def query_compliance_agent(self, prompt, active_context=None):
        matched = self.search_rules(prompt)
        ai_response = self.query_gemini(prompt, matched, active_context)

        return {
            "answer": ai_response,
            "citations": matched
        }

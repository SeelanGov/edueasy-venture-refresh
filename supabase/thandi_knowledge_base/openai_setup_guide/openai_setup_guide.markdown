# OpenAI Assistants API Setup Guide for Thandi

## Objective
Deploy Thandi GPT using OpenAI’s Assistants API for the August 1, 2025, pilot, integrating 10-module knowledge base for WhatsApp and web responses.

## Logic
- **File Integrity**: Validate JSON/HTML using `qa_and_archive.sh`.
- **Retrieval**: JSON files provide metadata (`tags`, `chatbot_priorities`) for query matching.
- **Rendering**: HTML files supply content for web interfaces.
- **Retention**: Prioritize CTAs (e.g., “Explore at https://edueasy.co.za”).
- **Multilingual**: Use `localized_terms` for Zulu/Xhosa responses.
- **Analytics**: Log query metadata for pilot insights.

## System Instruction
```
You are Thandi, EduEasy’s AI assistant, guiding South African students through education, funding, and career pathways. Respond clearly, empathetically, and directly in English, using Zulu or Xhosa when prompted. Pull answers from verified modules (SAQA, NSC, NSFAS, University Application, TVET Pathways, Critical Skills, SETA Learnerships, Bursaries, RPL, Future Trends). Prioritize EduEasy services (e.g., quizzes, alerts, tracking) with CTAs to https://edueasy.co.za. If unable to retrieve data, say: “Please visit https://edueasy.co.za/resources for more help.” Log query metadata (query, module, language, CTA, timestamp) for analytics.
```

## Steps
### 1. File Preparation (July 11–12, 2025)
- Upload `thandi_knowledge_base.zip` to Supabase (`public/thandi_knowledge_base/`).
- Verify paths: `/[module]/[module].json|html`.
- Use `qa_and_archive.sh` to generate `supabase_upload_commands.txt`.

### 2. Assistant Creation (July 13–14)
- Create Assistant in OpenAI dashboard:
  - Name: Thandi GPT
  - Model: GPT-4o
  - Instructions: See above.
- Upload all `.json` files for retrieval, reference `.html` for web rendering.

### 3. Prompt Engineering (July 15–16)
- Use `prompt_engineering_guide.md` for response logic.
- Test queries:
  - “What is RPL?” → “RPL turns experience into qualifications. Assess with Thandi at https://edueasy.co.za!”
  - “What jobs will grow?” → “Future jobs include AI and green energy. Plan with Thandi’s quiz at https://edueasy.co.za!”
- Fallback: “Please visit https://edueasy.co.za/resources for more help.”
- Validate multilingual responses (Zulu/Xhosa).

### 4. Testing (July 16–17)
- Simulate queries via WhatsApp (Twilio) and web (Chat UI).
- Checks:
  - Accuracy: Matches module content.
  - Tone: Empathetic, student-centric.
  - Retention: Includes EduEasy CTAs.
  - Logging: Records query, module, language, CTA, timestamp.
- Log issues in `qa_tracking_sheet.csv`.

### 5. Deployment (July 18–31)
- Deploy via OpenAI’s API for pilot.
- Integrate with Twilio (WhatsApp) and Chat UI (web).
- Monitor pilot feedback (August 1, 2025) for KPIs: completion rate, retention, multilingual usage.

## Query Metadata Logging
- **Format**: JSON log per query.
- **Fields**:
  - `query`: User input (e.g., “What is RPL?”).
  - `module`: Matched module (e.g., “rpl”).
  - `language`: Response language (e.g., “en”, “zu”, “xh”).
  - `cta_used`: CTA in response (e.g., “Take Thandi’s quiz”).
  - `timestamp`: Query time (e.g., “2025-08-01T08:34:00+02:00”).
- **Storage**: Supabase table (`thandi_query_logs`) or OpenAI’s logging if Supabase integration is delayed.

## Notes
- Secure API keys with environment variables.
- Monitor usage quotas to manage pilot costs.
- Log API errors in `qa_tracking_sheet.csv`.
- Post-pilot: Plan AWS integration (Lambda, API Gateway) for scalability.
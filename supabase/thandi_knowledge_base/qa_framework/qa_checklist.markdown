# QA Checklist for Thandi Knowledge Base
## Objective
Validate all 10 modules for consistency, quality, and API readiness before August 1, 2025, pilot.

## Checklist
### 1. Metadata Consistency (JSON Files)
- [ ] `id`: Unique UUID across all modules.
- [ ] `title`: Matches HTML file and module purpose.
- [ ] `tags`: Include relevant keywords (e.g., “Careers,” “EduEasy”).
- [ ] `source_links`: All URLs are active and dated (2024–2025).
- [ ] `localized_terms`: Include Zulu/Xhosa translations for key terms (e.g., “Funding,” “Skills”).
- [ ] `chatbot_priorities`: Keywords and responses align with module goals.

### 2. Interlinking
- [ ] CTAs (e.g., “Ask Thandi,” “Take quiz”) link to edueasy.co.za.
- [ ] Cross-module references (e.g., SAQA, NSFAS) are consistent and functional.
- [ ] Language for CTAs is uniform (e.g., “Explore with Thandi”).

### 3. Multilingual Completeness
- [ ] Key terms translated in Zulu/Xhosa (e.g., “Funding,” “Industry,” “RPL”).
- [ ] No missing translations for critical concepts.

### 4. Source Accuracy
- [ ] All external URLs (e.g., DHET, NSFAS) are active and relevant.
- [ ] Sources dated 2024–2025, with prompts to check for updates.

### 5. API Readiness
- [ ] JSON schemas valid for OpenAI Assistants API.
- [ ] HTML files mobile-friendly and error-free.

### 6. Retention Hooks
- [ ] CTAs (e.g., “Take quiz,” “Join alerts”) present in all HTML files.
- [ ] Freemium hooks (e.g., “EduEasy Premium”) consistent and compelling.

## Timeline
- **July 11–13**: Review all modules against checklist.
- **July 14**: Log fixes (if any) in tracking sheet.
- **July 15**: Finalize and re-save updated files.

## Tracking Sheet
Create a Google Sheet or CSV with columns: Module, Issue, Fix, Status.
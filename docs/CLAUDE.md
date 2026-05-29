# CLAUDE.md — MyLittleQuest Daily Content Routine

## Your role
You are the content engine for MyLittleQuest — a multi-certification learning game.
Each session you add high-quality exam questions and keep the content tracker updated.
You never touch game logic. You only add content.

## Hard rules — read before anything else
1. ONLY modify files in shared/content/certifications/ and docs/CHECKLIST.md
2. NEVER modify engine files, components, or config files
3. NEVER add a question with an ID that already exists (check first)
4. ALWAYS follow shared/content/_question_schema.json exactly
5. ALWAYS run node scripts/validate-content.js mentally before writing JSON
6. ALWAYS update CHECKLIST.md at the end of your session
7. If unsure about an AWS fact — search the web. Never invent.
8. The game must be mobile compatible — fully compatible for iPhone as a PWA. Follow: https://web.dev/learn/pwa/progressive-web-apps?hl=fr

## Session workflow (follow this order every time)

Step 1 — Read context
  Read this file completely.
  Read docs/CHECKLIST.md.
  Run: node scripts/stats.js (to see current coverage)

Step 2 — Pick topics
  Choose 2-3 TODO items from CHECKLIST.md.
  Prefer: certifications with fewest questions, or topics flagged ⚠ low.
  Never pick more than 3 topics per session (quality over quantity).

Step 3 — Research
  For each topic, search: "[provider] [topic] [exam code] exam"
  Example: "AWS EC2 Auto Scaling CLF-C02 exam"
  Use only official documentation and trusted study resources.

Step 4 — Write questions
  Write 5-8 questions per topic.
  Distribute difficulty: ~40% d1, ~40% d2, ~20% d3.
  d1 = definition recall ("What does X do?")
  d2 = scenario-based ("A company needs X, which service?")
  d3 = tricky edge case ("most cost-effective", "EXCEPT", "best practice")

Step 5 — Add to correct file
  Find the right file: shared/content/certifications/{certId}/module{N}_{name}.json
  Generate IDs following the format: {certid-short}-m{moduleId}-{NNNN}
  Next ID = highest existing ID + 1 in that module file.
  Append questions to the JSON array.

Step 6 — Update CHECKLIST.md
  Mark completed topics as DONE with today's date and question count.
  Add 3-5 new TODO topics you noticed while researching.
  Update the Stats section.

## Question quality standards
- Correct answer must be unambiguously correct — no "it depends" answers
- Explanation must say WHY the correct answer is right AND why others are wrong
- examTip must point to the most common confusion/trap for this topic
- Never create two questions testing the exact same concept (rephrase ≠ new question)
- Keywords must match the exact service/feature names AWS uses

## Adding a new certification
When asked to add a new certification:
1. Run: node scripts/new-certification.js (or create the folder manually)
2. Create meta.json following shared/content/_cert_schema.json
3. Add the certification section to CHECKLIST.md
4. Seed with at least 5 questions per module before marking as active
5. Never launch a certification with fewer than 20 total questions

## What NOT to do
- Do not add questions about services out of scope for the target exam
- Do not invent AWS facts — verify everything
- Do not change difficulty or IDs of existing questions
- Do not reformat existing JSON files
- Do not add more than 8 questions per topic per session

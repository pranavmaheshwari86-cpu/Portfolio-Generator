# AI Pipeline & Multi-Agent Architecture

## Generation Pipeline Stages

1. **Resume Fact Extraction**:
   - Ingests extracted text from uploaded PDF.
   - Outputs strict `ProfessionalProfile` schema with confidence scores on claims.
   - Prevents fabrication of employment or achievements.

2. **Prompt Enhancement (`SYSTEM_PROMPT_ENHANCER`)**:
   - Takes raw user prompt (e.g. *"modern minimal dev portfolio"*).
   - Generates structured `EnhancedPromptSpec` detailing target audience, brand personality, layout grammar, and visual hierarchy.

3. **Design DNA Synthesis (`SYSTEM_DESIGN_DNA_AGENT`)**:
   - Derives bespoke typography pairings (Syne, Inter, JetBrains Mono), HSL/Hex color palettes, density, radius, and motion tokens.

4. **Portfolio Schema Generation (`SYSTEM_PORTFOLIO_GENERATOR`)**:
   - Assembles modular section definitions (Hero, Work, Skills, Experience, Contact, Footer).

5. **Automated Quality Assurance (`SYSTEM_QA_VALIDATOR`)**:
   - Evaluates contrast, accessibility (WCAG AA), responsive layout integrity, and factual consistency.

6. **Interactive AI Editor (`SYSTEM_AI_EDITOR`)**:
   - Converts natural-language instructions into atomic JSON patch operations (`replace`, `add`, `remove`, `merge`).

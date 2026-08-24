export function parseAndCleanJson<T = unknown>(rawText: string): T {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty text received from model');
  }

  // 1. Remove thinking/reasoning blocks (e.g. from DeepSeek, Qwen)
  let clean = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Strip markdown code fences
  clean = clean.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();

  // 3. Try direct parse
  try {
    return JSON.parse(clean) as T;
  } catch {}

  // 4. Balanced brace / bracket extraction
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let startIdx = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx !== -1) {
    const isObj = clean[startIdx] === '{';
    const openChar = isObj ? '{' : '[';
    const closeChar = isObj ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = startIdx; i < clean.length; i++) {
      const char = clean[i];

      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === openChar) depth++;
        else if (char === closeChar) {
          depth--;
          if (depth === 0) {
            const candidate = clean.slice(startIdx, i + 1);
            try {
              return JSON.parse(candidate) as T;
            } catch {}
          }
        }
      }
    }
  }

  // 5. Fallback regex extraction
  const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) {
    try {
      return JSON.parse(match[0]) as T;
    } catch {}
  }

  throw new Error(`Failed to parse valid JSON from AI response. Received:\n${rawText.slice(0, 300)}`);
}

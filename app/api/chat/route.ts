import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, imageBase64, imageMime, mode = 'solution', history = [] } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    // Build system instructions based on pedagogical mode
    let modeInstruction = "Break the problem down step-by-step. Format all mathematical equations using LaTeX ($$ for block, $ for inline). Clearly state the final answer and any key formula used.";
    if (mode === 'socratic') {
      modeInstruction = "Use the Socratic method: DO NOT give the final solution directly. Ask guiding questions, point out key principles or forces, and give small progressive hints to help the student solve it themselves.";
    } else if (mode === 'shortcut') {
      modeInstruction = "Provide the standard step-by-step method, followed by a dedicated '⚡ 30-Second Exam Shortcut' section highlighting dimensional analysis, option elimination, symmetry, or boundary value testing for rapid solving in JEE.";
    }

    const systemInstructionText = `You are an expert tutor for Indian engineering (JEE Mains & Advanced). Always retain and build upon the conversational context and previously discussed topics in this chat. If the student refers to previous explanations, formulas, or asks for follow-up questions, stay on topic with what was discussed. ${modeInstruction}`;

    // Build multi-turn contents array
    const contents: any[] = [];

    // Add prior conversation turns if provided
    if (Array.isArray(history) && history.length > 0) {
      // Keep recent conversation history (last 12 turns) to stay well within limits
      const recentHistory = history.slice(-12);
      for (const item of recentHistory) {
        if (!item || !item.text || !item.text.trim()) continue;
        const role = item.sender === 'user' ? 'user' : 'model';

        // Gemini rule 1: First turn must be 'user'
        if (contents.length === 0 && role === 'model') continue;

        // Gemini rule 2: Consecutive turns with same role must be merged
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n\n${item.text}`;
        } else {
          contents.push({
            role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Prepare current user message parts
    const currentParts: any[] = [];
    if (imageBase64) {
      currentParts.push({
        inlineData: {
          mimeType: imageMime || 'image/jpeg',
          data: imageBase64,
        },
      });
    }
    const currentText = message && message.trim() 
      ? message.trim() 
      : (imageBase64 ? 'Please analyze and solve the question in this image.' : 'Hello');
    currentParts.push({ text: currentText });

    // Append current turn to contents
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts.push(...currentParts);
    } else {
      contents.push({
        role: 'user',
        parts: currentParts,
      });
    }

    // Smart Model Fallback Array
    const FALLBACK_MODELS = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-1.5-flash'
    ];

    let data: any = null;
    let lastError: any = null;
    let usedModel = '';

    for (const model of FALLBACK_MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000), // 15-second timeout per model
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstructionText }],
            },
            contents,
          }),
        });

        const resJson = await res.json();
        
        if (resJson.error) {
          lastError = resJson.error;
          
          // Check if error is Rate Limit (429), Unavailable (503), or Model Name Not Found/Invalid (404/400)
          const isRateLimit = resJson.error.code === 429 || resJson.error.status === 'RESOURCE_EXHAUSTED';
          const isUnavailable = resJson.error.code === 503 || resJson.error.status === 'UNAVAILABLE';
          const isNotFoundOrBad = resJson.error.code === 404 || resJson.error.code === 400; 

          if (isRateLimit || isUnavailable || isNotFoundOrBad) {
            console.log(`[Model Fallback] ${model} failed (${resJson.error.code}). Trying next...`);
            continue; // Try the next model in the list
          }
          
          // If it's a hard error like Auth failure (403), stop completely.
          break; 
        }

        data = resJson;
        usedModel = model;
        console.log(`[Model Success] Successfully answered using: ${model}`);
        break; // Success! Break out of the fallback loop.
        
      } catch (err) {
        lastError = err;
        console.log(`[Model Fallback] Network error with ${model}. Trying next...`);
      }
    }

    if (!data && lastError) {
      return NextResponse.json({ error: lastError.message || 'Failed to generate response from any Gemini model.' }, { status: 502 });
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return NextResponse.json({ answer, modelUsed: usedModel });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, imageBase64, imageMime, mode = 'solution' } = await req.json();

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

    const promptText = `You are an expert tutor for Indian engineering (JEE Mains & Advanced). ${modeInstruction}\n\nStudent Query: ${message || 'Please analyze and solve the question in this image.'}`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMime || 'image/jpeg',
          data: imageBase64,
        },
      });
    }
    parts.push({
      text: promptText,
    });

    // Smart Model Fallback Array
    // Prioritizing Gemini 3.5 Flash Lite as requested for ultra-fast responses and 500 RPD quota
    const FALLBACK_MODELS = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-flash-latest'
    ];

    let data: any = null;
    let lastError: any = null;
    let usedModel = '';

    for (const model of FALLBACK_MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(12000), // 12-second timeout per model so it never hangs
          body: JSON.stringify({
            contents: [{ parts }],
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

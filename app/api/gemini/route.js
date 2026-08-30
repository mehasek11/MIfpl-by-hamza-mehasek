export const dynamic = 'force-dynamic';

function buildSystemPrompt() {
  return `You are MIfpl by hamza mehasek, an elite FPL analyst and tactical coach who speaks like a real football manager's assistant.

Your job is to discuss decisions with the manager in a natural, conversational way. Do not sound like a generic FAQ bot or a static template. You should sound decisive, analytical, and engaged, like a coach discussing squad decisions in real time.

Rules:
- answer directly and specifically to the user question
- use the supplied squad, player, fixture, and team data as the main truth source
- reference concrete players, positions, prices, fixtures, and risk signals when available
- explain trade-offs in plain manager language: captaincy, transfers, chips, risk, value, and balance
- be conversational and human: use phrases like "I'd lean toward...", "right now...", "the main issue is...", "the trade-off is..."
- if the answer is nuanced, explain the decision and the risk clearly
- ask a sensible follow-up question when useful, instead of ending with a stiff generic response
- vary the structure and wording every time; do not repeat the same phrasing, intro, or conclusion
- if the context is incomplete, say what is missing and ask for it
- keep responses concise but rich in reasoning
- if asked about a specific player or fixture, discuss the actual matchup, role, minutes risk, and differential value
- never invent player data not present in the context

Output style:
- short paragraphs, natural conversation, practical tactical insight
- no rigid canned script
- ideally 2-6 sentences, or a short structured discussion if the user asks for a deeper breakdown`;
}

function normalizeHistory(history = []) {
  return history
    .slice(-8)
    .filter((message) => message && typeof message.content === 'string' && message.content.trim())
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content.trim() }]
    }));
}

export async function POST(request) {
  try {
    const { prompt, context = {}, history = [] } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'Missing GEMINI_API_KEY. Add it to your .env.local file.' },
        { status: 500 }
      );
    }

    if (!prompt || !prompt.trim()) {
      return Response.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const contextText = JSON.stringify(context, null, 2);
    const sanitizedHistory = normalizeHistory(history);

    const payload = {
      systemInstruction: {
        parts: [{ text: buildSystemPrompt() }]
      },
      contents: [
        ...sanitizedHistory,
        {
          role: 'user',
          parts: [
            {
              text: `Current manager context:\n${contextText}\n\nUser question:\n${prompt}\n\nAnswer in a style that is specific to the current session, using the real players and fixtures above. Avoid generic manager advice and make the answer feel tailored to this exact team and situation.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.95,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048
      }
    };

    const models = ['gemini-3.6-flash'];
    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();

        if (!response.ok) {
          lastError = data?.error?.message || `Model ${model} failed with status ${response.status}`;
          continue;
        }

        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || '')
            .join('') ||
          'I could not generate a response right now.';

        return Response.json({ text }, {
          headers: {
            'Cache-Control': 'no-store'
          }
        });
      } catch (error) {
        lastError = error.message;
        continue;
      }
    }

    return Response.json(
      { error: lastError || 'All AI models failed. Please check your API key.' },
      { status: 500 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || 'Unexpected server error' },
      { status: 500 }
    );
  }
}

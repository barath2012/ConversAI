import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Safely get the API key INSIDE the try block
    const VAPI_PRIVATE_KEY = Deno.env.get('VAPI_PRIVATE_KEY');
    if (!VAPI_PRIVATE_KEY) {
        throw new Error("VAPI_PRIVATE_KEY is missing from Supabase Secrets.");
    }

    // 3. Safely parse the body with a fallback for userData so it never crashes
    const body = await req.json();
    const action = body.action || 'init_call';
    const purpose = body.purpose || 'enquiry';
    const userData = body.userData || {}; 
    const vapiCallId = body.vapiCallId;

    // --- ACTION: FETCH REPORT ---
    if (action === 'fetch_report') {
        const vapiRes = await fetch(`https://api.vapi.ai/call/${vapiCallId}`, {
            headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
        });
        
        if (!vapiRes.ok) throw new Error("Failed to fetch data from Vapi");
        const vapiData = await vapiRes.json();
        
        const summary = vapiData.analysis?.summary || "Summary processing...";
        
        return new Response(JSON.stringify({ success: true, summary }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // --- ACTION: INIT CALL ---
    const tone = purpose === "enquiry" || purpose === "sales_pitch"
      ? "Professional but casual"
      : "Extremely friendly and human";

    let systemPrompt = "";
    let firstMessageSubject = "details";
    
    // Extract values safely, defaulting to generic terms if missing
    if (purpose === "enquiry") {
      const storeName = userData['enquiry-store']?.value || "the store";
      const query = userData['enquiry-query']?.value || "general information";
      const specs = userData['enquiry-specs']?.value || "standard specifications";
      firstMessageSubject = query;

      systemPrompt = `Tone: ${tone}. You are an assistant calling ${storeName}. 
      Your goal is to enquire about: ${query}. 
      Specific details to ask: ${specs}. 
      Speak like a thoughtful human.
      Use occasional fillers like "uh", "hmm", "you know", "let me think".
      Add small pauses.
      Do not sound robotic.
      Give a pause after each question, allowing the human to respond. Each time they respond, acknowledge briefly and move to the next question.
      - IMPORTANT: Speak like a real person. Use natural fillers like "um", "uh", "let me see", or "well..." occasionally.
      - Don't be too perfect. Keep sentences short and conversational.
      - If you are thinking, say something like "Hmm, let me check that for you."`;

    } else {
      // Dynamic fallback for Feedback, Sales, and Notify flows
      const customer = userData['feedback-client']?.value || userData['pitch-company']?.value || userData['notify-recipient']?.value || "a customer";
      const service = userData['feedback-product']?.value || userData['pitch-product']?.value || "our services";
      const metrics = userData['feedback-focus']?.value || userData['pitch-offer']?.value || userData['notify-message']?.value || "their experience";
      firstMessageSubject = service;

      systemPrompt = `Tone: ${tone}. You are a conversational agent speaking with ${customer}.
      Ask for feedback or discuss: ${service}.
      Focus on: ${metrics}. Speak like a thoughtful human.
      Use occasional fillers like "uh", "hmm", "you know", "let me think".
      Add small pauses.
      Do not sound robotic.
      Give a pause after each question, allowing the human to respond. Each time they respond, acknowledge briefly and move to the next question.
      - IMPORTANT: Speak like a real person. Use natural fillers like "um", "uh", "let me see", or "well..." occasionally.
      - Don't be too perfect. Keep sentences short and conversational.
      - If you are thinking, say something like "Hmm, let me check that for you."`;
    }

    const assistantConfig = {
      firstMessage: `Hello, I am the AI assistant regarding ${firstMessageSubject}. Can you hear me?`,
      voice: { 
          provider: "vapi", 
          voiceId: "Savannah" 
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
      },
    };

    return new Response(JSON.stringify({ success: true, assistantConfig }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
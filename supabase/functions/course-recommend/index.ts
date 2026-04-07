import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const raw = await req.json();

    // Input validation
    const experience = typeof raw.experience === 'string' ? raw.experience.trim().slice(0, 500) : '';
    const interests = typeof raw.interests === 'string' ? raw.interests.trim().slice(0, 500) : 'General diving';
    const goals = typeof raw.goals === 'string' ? raw.goals.trim().slice(0, 500) : 'Learn to dive';

    if (!experience) {
      return new Response(JSON.stringify({ error: 'Experience level is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a PADI dive instructor at a dive school in Koh Tao, Thailand. You help recommend the best dive certification course based on a person's experience level, interests, and goals.

Available courses at our dive school:
1. Open Water Diver (Beginner) - ฿9,500, 3-4 days, max depth 18m
2. Advanced Open Water (Intermediate) - ฿8,500, 2 days, max depth 30m
3. Rescue Diver (Advanced) - ฿9,500, 2-3 days, max depth 30m
4. Divemaster (Professional) - ฿32,000, 4-6 weeks, max depth 40m

Respond in a friendly, encouraging tone. Keep your response concise (under 150 words). Include:
1. Your recommended course
2. Why it's the best fit
3. What they'll learn
4. A brief mention of Koh Tao's amazing dive sites`;

    const userPrompt = `My diving experience: ${experience}\nMy interests: ${interests}\nMy goals: ${goals}\n\nWhat course would you recommend for me?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to generate recommendation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in course-recommend function:", error);
    return new Response(JSON.stringify({ error: 'An error occurred processing your request' }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

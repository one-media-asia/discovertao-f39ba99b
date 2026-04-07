import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
    const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 100) : '';
    const email = typeof raw.email === 'string' ? raw.email.trim().slice(0, 255) : '';
    const item_title = typeof raw.item_title === 'string' ? raw.item_title.trim().slice(0, 200) : 'Unknown';

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const phone = typeof raw.phone === 'string' ? raw.phone.trim().slice(0, 20) : 'N/A';
    const preferred_date = typeof raw.preferred_date === 'string' ? raw.preferred_date.slice(0, 10) : 'N/A';
    const experience_level = typeof raw.experience_level === 'string' ? raw.experience_level.trim().slice(0, 50) : 'N/A';
    const message = typeof raw.message === 'string' ? raw.message.trim().slice(0, 1000) : 'No message';
    const deposit_amount = typeof raw.deposit_amount === 'number' ? raw.deposit_amount : 0;
    const payment_choice = raw.payment_choice === 'now' ? 'Pay deposit now via PayPal' : 'Pay later (inquire only)';

    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST") || "",
        port: Number(Deno.env.get("SMTP_PORT") || "587"),
        tls: false,
        auth: {
          username: Deno.env.get("SMTP_USER") || "",
          password: Deno.env.get("SMTP_PASS") || "",
        },
      },
    });

    const body = `New Booking Inquiry

Course/Dive: ${item_title}
Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Date: ${preferred_date}
Experience Level: ${experience_level}
Deposit Amount: ฿${deposit_amount}
Payment Choice: ${payment_choice}

Message:
${message}`;

    await client.send({
      from: Deno.env.get("SMTP_USER") || "contact@divinginasia.com",
      to: "payments@divinginasia.com",
      subject: `New Booking Inquiry: ${item_title}`,
      content: body,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

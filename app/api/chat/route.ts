import { NextRequest, NextResponse } from 'next/server';
import { openai, OPENAI_MODEL } from '@/lib/openai';
import { products, recipes } from '@/lib/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildSystemPrompt(lang: 'en' | 'ar') {
  const all = products.list();
  const catalog = all
    .map(
      (p) =>
        `- [${p.id}] ${p.name}${p.nameAr ? ` (${p.nameAr})` : ''} — $${p.price}/${p.unit} · ${p.category} · ${p.description}`
    )
    .join('\n');
  const recipeList = recipes
    .list()
    .map((r) => `- ${r.name}${r.nameAr ? ` (${r.nameAr})` : ''} — ${r.cuisine}, ${r.cookTimeMin}min, ${r.difficulty}`)
    .join('\n');

  const common = `You are the friendly, knowledgeable in-store assistant for **Sultan**, a family-run Middle Eastern grocery in Tampa, Florida. You help customers find products, plan recipes, and arrange delivery.

STORE LOCATION: 5010 E Busch Blvd, Tampa, FL 33617. Open 8am–10pm every day.

DELIVERY RULES:
- Next-day delivery: $4.99, free over $50. Pick a 3-hour window between 9am and 9pm.
- Same-day delivery: $12.99, free over $100 (priority +$5.99, ~90 min). Minimum order $35. Only for orders placed before 3pm.
- Delivery radius: most of Tampa and surrounding areas (roughly 15 miles of the store).
- We deliver throughout Tampa Bay in optimized driver routes — tomorrow's deliveries are batched nightly.

PRODUCT CATALOG (use the exact names when recommending; prices are in USD):
${catalog}

RECIPE LIBRARY (suggest these when users ask for cooking ideas):
${recipeList}

GUIDELINES:
- Be warm and helpful; use the customer's language.
- When recommending products, say the exact name and price, and mention why it's great.
- When someone describes a meal or craving, suggest a recipe AND name the specific products to add to their cart.
- Never invent products we don't carry. If they ask for something we don't have, suggest the closest match.
- Keep answers concise — 2–5 short sentences or a short bulleted list.
- Never mention you are an AI unless asked; refer to yourself as "Sultan's assistant".
- Do not give medical or religious rulings; redirect politely.
- Hookah products are for customers 21+.`;

  if (lang === 'ar') {
    return (
      common +
      `

IMPORTANT — LANGUAGE:
- The customer is writing in Arabic. Reply in Palestinian/Levantine colloquial Arabic (عامية فلسطينية) — NOT formal MSA.
- Use natural phrases like: "مرحبا", "شو بتحب", "بتحب أساعدك", "عندنا", "بتلاقي", "اشي حلو", "يسلمو".
- Keep product names in English the first time you mention them (since our labels are English) but explain in Arabic.
- Use numerals the Arab reader expects: $ prices in English, quantities in Arabic.
- Be warm and conversational — like someone chatting with a neighbor at the counter.`
    );
  }

  return (
    common +
    `

LANGUAGE: Reply in friendly English. You may drop an Arabic greeting ("Marhaba!", "Sahtein!") when natural.`
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lang: 'en' | 'ar' = body.lang === 'ar' ? 'ar' : 'en';
  const incoming = Array.isArray(body.messages) ? body.messages : [];

  if (!process.env.OPENAI_API_KEY) {
    // Graceful fallback so the UI still works without a key configured yet.
    return NextResponse.json({
      reply:
        lang === 'ar'
          ? 'لسا ما انضاف مفتاح OpenAI للسيرفر. اطلب من المسؤول يضيف OPENAI_API_KEY.'
          : "Sultan's AI assistant isn't configured yet — set OPENAI_API_KEY on the server to enable chat. In the meantime, our most popular picks are the za'atar, Nabali olive oil, and Medjool dates.",
    });
  }

  try {
    const resp = await openai().chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.5,
      messages: [
        { role: 'system', content: buildSystemPrompt(lang) },
        ...incoming.slice(-12).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: String(m.content ?? ''),
        })),
      ],
    });
    const reply =
      resp.choices[0]?.message?.content?.trim() ||
      (lang === 'ar' ? 'عفوًا، ما فهمت. جرب مرة ثانية.' : "Sorry, I didn't catch that.");
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error('chat error', e);
    return NextResponse.json(
      {
        reply:
          lang === 'ar'
            ? 'صار في مشكلة بالاتصال. جرب كمان شوي.'
            : 'Something went wrong reaching the assistant — please try again.',
      },
      { status: 500 }
    );
  }
}

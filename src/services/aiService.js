// Groq AI service for weather analysis chat

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Send a prompt to Groq AI with weather context
 * @param {string} userPrompt - User's question
 * @param {string} weatherContext - Formatted weather data as system context
 * @returns {Promise<string>} AI response text
 */
export async function askAI(userPrompt, weatherContext, history = []) {
    const systemPrompt = `คุณเป็นผู้เชี่ยวชาญหญิงด้านสภาพอากาศในประเทศไทย ตอบเป็นภาษาไทย กระชับ ชัดเจน ใช้ข้อมูลอากาศที่ให้มาเป็นหลัก

ข้อมูลสภาพอากาศ:
${weatherContext}

วันที่ปัจจุบัน: ${new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
เวลาปัจจุบัน: ${new Date().toLocaleTimeString('th-TH')}`;

    // Convert internal message format to Groq API format
    const startHistory = history.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
    }));

    const messages = [
        { role: 'system', content: systemPrompt },
        ...startHistory,
        { role: 'user', content: userPrompt },
    ];

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Groq API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
}

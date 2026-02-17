import { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/aiService';
import { Bot, Send } from 'lucide-react';

/**
 * AIChatBox - chat interface for AI weather analysis
 */
export default function AIChatBox({ weatherContext }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const prompt = input.trim();
        if (!prompt || loading) return;

        // Add user message
        setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
        setInput('');
        setLoading(true);

        try {
            const response = await askAI(prompt, weatherContext);
            setMessages((prev) => [...prev, { role: 'ai', content: response }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'ai', content: `เกิดข้อผิดพลาด: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col min-h-[280px]">
            <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                <Bot size={20} className="inline-block mr-2 align-middle" />
                ถาม AI เกี่ยวกับอากาศ
            </div>

            <div className="flex-1 overflow-y-auto mb-4 max-h-[200px]">
                {messages.length === 0 && !loading && (
                    <div className="flex-1 flex items-center justify-center text-text-muted text-sm text-center p-5">
                        ลองถามอะไรก็ได้เกี่ยวกับสภาพอากาศ<br />
                        เช่น &quot;วันนี้ตอนเย็นฝนจะตกไหม?&quot;
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`py-3 px-4 rounded-[var(--radius-md)] text-sm leading-relaxed text-text-primary mb-2 whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-accent-light text-accent-hover text-right'
                                : 'bg-bg'
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 py-3 px-4 text-text-secondary text-sm">
                        <span
                            className="inline-block w-1.5 h-1.5 bg-text-muted rounded-full"
                            style={{ animation: 'aiDotPulse 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}
                        />
                        <span
                            className="inline-block w-1.5 h-1.5 bg-text-muted rounded-full"
                            style={{ animation: 'aiDotPulse 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}
                        />
                        <span
                            className="inline-block w-1.5 h-1.5 bg-text-muted rounded-full"
                            style={{ animation: 'aiDotPulse 1.4s infinite ease-in-out both' }}
                        />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 py-2.5 px-4 border border-border-default rounded-[var(--radius-sm)] text-sm font-[inherit] bg-bg text-text-primary outline-none transition-colors duration-200 focus:border-accent placeholder:text-text-muted"
                    type="text"
                    placeholder="ถามเกี่ยวกับสภาพอากาศ..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button
                    className="py-2.5 px-5 bg-text-primary text-surface border-none rounded-[var(--radius-sm)] text-sm font-medium font-[inherit] cursor-pointer transition-opacity duration-200 whitespace-nowrap hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    {loading ? 'กำลังคิด...' : 'ส่ง'}
                </button>
            </div>
        </div>
    );
}

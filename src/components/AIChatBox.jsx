import { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/aiService';

/**
 * AIChatBox - chat interface for AI weather analysis
 */
export default function AIChatBox({ weatherContext }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);



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
        <div className="card ai-chat-box">
            <div className="card-title">🤖 ถาม AI เกี่ยวกับอากาศ</div>

            <div className="ai-chat-messages">
                {messages.length === 0 && !loading && (
                    <div className="ai-placeholder">
                        ลองถามอะไรก็ได้เกี่ยวกับสภาพอากาศ<br />
                        เช่น "วันนี้ตอนเย็นฝนจะตกไหม?"
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`ai-message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div className="ai-loading">
                        <span className="ai-loading-dot"></span>
                        <span className="ai-loading-dot"></span>
                        <span className="ai-loading-dot"></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="ai-input-group">
                <input
                    className="ai-input"
                    type="text"
                    placeholder="ถามเกี่ยวกับสภาพอากาศ..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button
                    className="ai-send-btn"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    {loading ? 'กำลังคิด...' : 'ส่ง'}
                </button>
            </div>
        </div>
    );
}

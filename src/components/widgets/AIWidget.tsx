import { aiService, type Message } from '../../services/aiService';
import { useState } from 'react';
import type { MarketChart } from '../../services/cryptoApi';

interface AIWidgetProps {
    chartData: MarketChart;
    cryptoName: string;
}

function AIWidget({ chartData, cryptoName }: AIWidgetProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
    const DEBOUNCE_DELAY = 2000; // Debounce if submission within 2 seconds

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const now = Date.now();
        if (now - lastSubmitTime < DEBOUNCE_DELAY) {
            console.log('Please wait before submitting again!');
            return;
        }
        setLastSubmitTime(now);

        const userMessage = input.trim();
        setIsLoading(true);
        setInput('');

        setMessages((prev) => [...prev, { role: 'user', content: input }]);

        try {
            const response = await aiService.chat(userMessage, chartData, cryptoName);

            setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { 
                role: 'assistant', 
                content: `Sorry, I encountered an error. Please try again. Error: ${error}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md col-span-3 h-80"> 
            <h3 className="text-lg font-semibold mb-4">AI Crypto Assistant: ${cryptoName}</h3>
            {messages.map((message, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${
                    message.role === 'user'
                        ? 'bg-blue-100 ml-8'
                        : 'bg-gray-100 mr-8'
                }`}>
                    {message.content}
                </div>
            ))}
            {isLoading && <div className="text-gray-500 italic">AI is thinking...💭</div> }

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the selected crypto's data..."
                    className="flex-1 p-2 border rounded"
                    disabled={isLoading}
                ></input>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={isLoading}
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default AIWidget;
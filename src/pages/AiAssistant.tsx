import React, { useState } from 'react';
import axios from 'axios';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // පණිවිඩය එකතු කිරීම
    const newMessages = [...messages, { sender: 'Farmer', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      // Backend එකට යැවීම
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      setMessages([...newMessages, { sender: 'AI', text: response.data.reply }]);
   } catch (error: any) {
      console.error("Frontend Error:", error.response?.data || error.message); // මේක පේනවා
      setMessages([...newMessages, { sender: 'AI', text: 'Error: ' + (error.response?.data?.message || 'Server Error') }]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">🤖 AI Farming Assistant</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 border p-4 rounded-lg bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.sender === 'Farmer' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'Farmer' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          className="flex-1 border p-2 rounded-lg" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage} className="bg-emerald-700 text-white px-6 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
};

export default AIAssistantPage;
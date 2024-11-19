'use client';

import { SchemaViewer } from '@/components/SchemaViewer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import useChatDataStore from '@/store/useChatDataStore';
import { FormEvent, useEffect, useRef, useState } from 'react';
type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { queries, addQuery } = useChatDataStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message:
            '$' +
            userMessage.text +
            '$' +
            ' ' +
            'Following this is the user query history, or the queries the user previously wrote, return only the query to users when asked and prefix the query with "sql:" (Refer Rule 1a) - the queries history are as follows: ' +
            queries.join(','),
        }),
      });

      const { data, error } = await response.json();
      console.log('DATA IS ', data.rows);
      console.log('Erorr is ', error);
      console.log('QUERIES IS', queries.join(', '));
      if (!error) {
        const botMessage: Message = {
          id: Date.now() + 1,
          sender: 'bot',
          text: JSON.stringify(data.isSql ? data.rows : data.chatResponse),
        };
        console.log('data chatresponse is', data.chatResponse);
        console.log('data suggested query is', data.suggestedQuery);
        if (data.isSql) {
          if (data.chatResponse) {
            addQuery(`${queries.length + 1}: ${data.chatResponse}`);
          }
        } else if (data.suggestedQuery) {
          addQuery(`${queries.length + 1}: ${data.suggestedQuery}`);
        }

        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          sender: 'bot',
          text: error || 'Something went wrong',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'An unexpected error occured',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <SchemaViewer />
      <main className="flex">
        <div className="flex justify-center items-center max-w-[50px] bg-white border-none">
          <SidebarTrigger className="text-slate-700" />
        </div>
        <div className="flex flex-col h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Virtual Query Interface
            </h1>
            <h3 className="text-slate-400">
              https://github.com/EngelbertTeh/llama-chat.git
            </h3>
          </header>

          {/* Chat Box */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {typeof msg.text === 'string'
                    ? msg.text
                    : 'An error has occurred, please try with a new prompt'}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex space-x-1">
                  <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pule"></span>
                  <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
                  <span className="block w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* <h3 className="text-slate-700">
        {' '}
        &nbsp;{' '}
        {`P.S. If I am returning you the same query you have written, then
              probably your query isn't quite correct (check for spelling mistakes and try using postgresql
              dialect instead :D )`}
      </h3> */}
          {/* Input Box */}
          <form
            className="flex items-center p-4 bg-white border-t border-gray-300"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg text-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </SidebarProvider>
  );
}

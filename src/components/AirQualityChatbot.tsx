import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  Wind,
  MapPin,
  Activity,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/hooks/useLocation';
import { chatbotService, ChatMessage } from '@/services/chatbotService';

const SUGGESTIONS = [
  'What is the air quality in Delhi right now?',
  'Is it safe to exercise outdoors in Delhi?',
  'What is the air quality right now?',
  'Air quality in Tokyo today?',
  'Air quality in London right now?',
  'Should I open my windows for ventilation?',
  'What is PM2.5 and why does it matter?',
];

export default function AirQualityChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { location } = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 **Hello! I am your AI Air Quality Assistant.**\n\n' +
        'I provide real-time atmospheric intelligence and health advice for **any location worldwide**. Ask me about AQI, outdoor exercise safety, pollutant levels, or recommendations for sensitive groups!',
      timestamp: 'Just now',
      modelUsed: 'Open-Source Offline LLM Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-4)
        .map((m) => ({ role: m.role, content: m.content }));

      const botResponse = await chatbotService.sendMessage(query, {
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.locationName,
        history,
      });

      setMessages((prev) => [...prev, botResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ I encountered an issue processing that query. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          '🧹 **Conversation reset.**\n\nAsk me about air quality, weather, or health precautions for any location!',
        timestamp: 'Just now',
        modelUsed: 'Open-Source Offline LLM Engine',
      },
    ]);
  };

  const getAqiBadgeColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'good':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'unhealthy for sensitive groups':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'unhealthy':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'very unhealthy':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group p-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-2xl shadow-cyan-500/30 flex items-center justify-center border border-white/20 glow-primary cursor-pointer"
              title="Open AI Air Quality Assistant"
            >
              <div className="relative">
                <Bot className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
              </div>
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out group-hover:ml-3 font-semibold text-sm">
                Ask AI Assistant
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300 ${
              isExpanded
                ? 'w-[95vw] sm:w-[650px] h-[88vh]'
                : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Wind className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">AirWatch AI</h3>
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5" /> Offline LLM
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Live Multi-Source Telemetry
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full hidden sm:flex"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current Context Pill */}
            <div className="px-4 py-1.5 bg-slate-950/70 border-b border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1 truncate max-w-[240px]">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {location.locationName || 'Current Location'}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API Grounded
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-800/80 border border-white/10 text-gray-100 rounded-bl-xs'
                    }`}
                  >
                    {/* Live Telemetry Card if available */}
                    {msg.telemetry && (
                      <div className="mb-3 p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-cyan-400" />
                            {msg.telemetry.locationName}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${getAqiBadgeColor(
                              msg.telemetry.category
                            )}`}
                          >
                            AQI {msg.telemetry.aqi} • {msg.telemetry.category}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-gray-300 border-t border-white/5">
                          {msg.telemetry.pm25 !== undefined && (
                            <div>PM2.5: <span className="font-semibold text-cyan-300">{msg.telemetry.pm25}</span></div>
                          )}
                          {msg.telemetry.pm10 !== undefined && (
                            <div>PM10: <span className="font-semibold text-cyan-300">{msg.telemetry.pm10}</span></div>
                          )}
                          {msg.telemetry.temperature !== undefined && (
                            <div>Temp: <span className="font-semibold text-cyan-300">{msg.telemetry.temperature}°C</span></div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Formatted Markdown Content */}
                    <div className="space-y-1.5 whitespace-pre-line break-words">
                      {msg.content.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] text-gray-400">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <span className="italic text-gray-400 font-mono">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-gray-200" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-cyan-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Analyzing atmospheric telemetry & generating response...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Pills */}
            <div className="px-3 py-2 bg-slate-950/40 border-t border-white/5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              {SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(item)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 text-[11px] rounded-full bg-slate-800/70 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about air quality, cities, health..."
                  disabled={isLoading}
                  className="bg-slate-900/80 border-white/15 focus:border-cyan-400 text-white placeholder:text-gray-400 rounded-xl text-sm"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shrink-0 cursor-pointer shadow-md disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


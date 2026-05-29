import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';
import { Send, Circle } from 'lucide-react';

export function MessagesPage() {
  const { user } = useAuth();
  const socket = useMemo(() => getSocket(), []);
  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/messages/conversations');
      setConversations(data.conversations);
      if (!active && data.conversations[0]) setActive(data.conversations[0]);
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    socket.auth = { token: localStorage.getItem('bridgecn_token') };
    socket.connect();

    const onNew = (message: any) => {
      setActive((current: any) => current && current.id === message.conversationId
        ? { ...current, messages: [...(current.messages || []), message] }
        : current);
      setConversations((prev) => prev.map((c) => c.id === message.conversationId ? { ...c, messages: [message], updatedAt: new Date().toISOString() } : c));
    };

    const onTyping = (payload: any) => {
      if (payload.conversationId === active?.id && payload.userId !== user.id) setTyping(payload.isTyping);
    };

    socket.on('message:new', onNew);
    socket.on('message:typing', onTyping);
    return () => {
      socket.off('message:new', onNew);
      socket.off('message:typing', onTyping);
    };
  }, [socket, user, active?.id]);

  useEffect(() => {
    if (active?.id) socket.emit('conversation:join', active.id);
  }, [active, socket]);

  const send = async () => {
    if (!active || !draft.trim()) return;
    socket.emit('message:send', { conversationId: active.id, content: draft });
    setDraft('');
  };

  const other = (conversation: any) => conversation.participantAId === user?.id ? conversation.participantB : conversation.participantA;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[2rem] bg-white p-4 shadow-soft">
        <h1 className="px-2 py-2 text-2xl font-black">Messages</h1>
        <div className="mt-2 space-y-2">
          {conversations.map((conversation) => {
            const target = other(conversation);
            return (
              <button key={conversation.id} onClick={() => setActive(conversation)} className={`w-full rounded-2xl p-4 text-left ${active?.id === conversation.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{target.fullName}</div>
                    <div className="text-sm text-slate-500">{conversation.messages?.[0]?.content || 'No messages yet'}</div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600"><Circle className="h-2 w-2 fill-current" /> {target.online ? 'Online' : 'Offline'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white shadow-soft">
        {active ? (
          <div className="flex h-[70vh] flex-col">
            <div className="border-b border-slate-200 p-5">
              <div className="font-bold">{other(active).fullName}</div>
              <div className="text-sm text-slate-500">{typing ? 'Typing...' : ' '}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {(active.messages || []).map((message: any) => (
                  <div key={message.id} className={`max-w-[75%] rounded-3xl px-4 py-3 ${message.senderId === user?.id ? 'ml-auto bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
                    {message.content}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-full border border-slate-200 px-4 py-3"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    socket.emit('message:typing', { conversationId: active.id, isTyping: !!e.target.value });
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Write a message..."
                />
                <button onClick={send} className="rounded-full bg-slate-900 px-5 py-3 text-white">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid h-[70vh] place-items-center text-slate-500">Select a conversation</div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

export function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await api.get('/posts');
    setPosts(data.posts);
  };

  useEffect(() => { load(); }, []);

  const createPost = async () => {
    await api.post('/posts', { content, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });
    setContent('');
    setTags('');
    load();
  };

  const like = async (id: string) => {
    await api.post(`/posts/${id}/like`);
    load();
  };

  const comment = async (id: string) => {
    const text = commentMap[id]?.trim();
    if (!text) return;
    await api.post(`/posts/${id}/comments`, { content: text });
    setCommentMap((prev) => ({ ...prev, [id]: '' }));
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h1 className="text-3xl font-black">Community feed</h1>
            <div className="mt-4 grid gap-3">
              <textarea className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3" placeholder="Share something with your network..." value={content} onChange={(e) => setContent(e.target.value)} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Tags, comma separated" value={tags} onChange={(e) => setTags(e.target.value)} />
              <button onClick={createPost} className="ml-auto rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Post</button>
            </div>
          </div>

          {posts.map((post) => (
            <div key={post.id} className="rounded-[2rem] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <img src={post.author.avatarUrl || 'https://placehold.co/80x80'} className="h-12 w-12 rounded-full" />
                <div>
                  <div className="font-semibold">{post.author.fullName}</div>
                  <div className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <p className="mt-4 leading-7 text-slate-700">{post.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(post.tagsJson) ? post.tagsJson : []).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tag}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
                <button onClick={() => like(post.id)} className="inline-flex items-center gap-2"><Heart className="h-4 w-4" /> {post.likesCount}</button>
                <span className="inline-flex items-center gap-2"><MessageSquare className="h-4 w-4" /> {post.commentsCount}</span>
                <span className="inline-flex items-center gap-2"><Share2 className="h-4 w-4" /> Share</span>
              </div>

              <div className="mt-4 space-y-2">
                {(post.comments || []).map((comment: any) => (
                  <div key={comment.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <span className="font-semibold">{comment.author.fullName}: </span>{comment.content}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  className="flex-1 rounded-full border border-slate-200 px-4 py-3"
                  placeholder="Write a comment"
                  value={commentMap[post.id] || ''}
                  onChange={(e) => setCommentMap((prev) => ({ ...prev, [post.id]: e.target.value }))}
                />
                <button onClick={() => comment(post.id)} className="rounded-full bg-slate-900 px-5 py-3 text-white">Send</button>
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black">Tips</h2>
          <p className="mt-2 text-slate-600">Use the feed to share opportunities, study groups, and event highlights.</p>
        </aside>
      </div>
    </div>
  );
}

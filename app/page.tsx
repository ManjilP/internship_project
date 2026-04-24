"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post, ApiResponse } from "./types/blog";
import { cleanHtml } from "./utils/cleanHtml";

const API_URL = "https://api.blogapiservice.com/api/v1/";
const API_KEY = "JthbZhc8-CuaqR4JMLR9gw5Qlmv-q2VCQlI3DOdZnKM";

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    console.log("[Blog] Starting fetch with 30s timeout...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}posts/?cb=${Date.now()}`, {
        headers: { "x-api-key": API_KEY },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data: ApiResponse<Post[]> = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const shapedPosts = data.data
          .sort((a, b) => b.id - a.id)
          .map(post => ({
            ...post,
            description: cleanHtml(post.description || "")
          }));
        setPosts(shapedPosts);
      } else {
        throw new Error(data.message || "Failed to load posts.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error("[Blog] Fetch timed out.");
      } else {
        console.error("[Blog] Fetch failed:", err.message);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All Posts", ...new Set(posts.map(p => p.category_details?.name || "Uncategorized"))];
  const getCategoryCount = (name: string) => name === "All Posts" ? posts.length : posts.filter(p => (p.category_details?.name || "Uncategorized") === name).length;

  const filteredPosts = selectedCategory === "All Posts"
    ? posts
    : posts.filter(p => (p.category_details?.name || "Uncategorized") === selectedCategory);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorUI message={error} retry={fetchPosts} />;

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-12 text-[#1f2937]">
      <header className="max-w-[1400px] mx-auto mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up">
        <h1 className="text-8xl font-black tracking-tighter text-slate-900 mb-6" style={{ fontFamily: 'var(--font-elms)' }}>Blogs</h1>
        <div className="flex items-center gap-4 text-slate-400">
          {/* Placeholder for header links if needed */}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 📄 MAIN CONTENT */}
        <section className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => {
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.08)] transition-all duration-500 border border-slate-100 flex flex-col group animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {post.image && (
                    <Link href={`/posts/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                  )}
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-indigo-100/50" style={{ fontFamily: 'var(--font-elms)' }}>
                        {post.category_details?.name || "General"}
                      </span>
                    </div>

                    <Link href={`/posts/${post.slug}`} className="mb-6 block">
                      <h2 className="text-2xl font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-elms)' }}>
                        {post.title}
                      </h2>
                    </Link>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-elms)' }}>
                        {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(',', '') : "Apr 23 2026"}
                      </p>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 💡 SIDEBAR */}
        <aside className="lg:col-span-4 space-y-10">
          {/* Categories Widget */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight" style={{ fontFamily: 'var(--font-elms)' }}>Categories</h3>
            <div className="divide-y divide-slate-100/80">
              {categories.map((cat) => {
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-black text-sm transition-all group
                      ${selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 my-1'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                    style={{ fontFamily: 'var(--font-elms)' }}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${selectedCategory === cat ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`} style={{ fontFamily: 'var(--font-elms)' }}>
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}

// ── Components ───────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-wrap justify-center items-center gap-12 py-20 px-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-full max-w-sm h-[500px] bg-white rounded-4xl animate-pulse shadow-sm" />
      ))}
    </div>
  );
}

function ErrorUI({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h2 className="text-2xl font-black mb-2 text-gray-900">Oops! Failed to load</h2>
      <p className="text-gray-500 mb-8 max-w-xs">{message}</p>
      <button
        onClick={retry}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-200"
      >
        Retry Fetch
      </button>
    </div>
  );
}
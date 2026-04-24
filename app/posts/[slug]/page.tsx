"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Post, ApiResponse } from "../../types/blog";
import { cleanHtml } from "../../utils/cleanHtml";

const API_URL = "https://api.blogapiservice.com/api/v1/";
const API_KEY = "JthbZhc8-CuaqR4JMLR9gw5Qlmv-q2VCQlI3DOdZnKM";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default function PostDetail({ params }: PostPageProps) {
  // Correctly unwrapping params in Next.js 15 Client Component
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<{id: string, text: string}[]>([]);

  const fetchPost = async () => {
    console.log(`[PostDetail] Fetching details for slug: ${slug} (30s timeout)`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}posts/${slug}/?cb=${Date.now()}`, {
        method: "GET",
        headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      const currentPost = data?.success && data?.data ? (Array.isArray(data.data) ? data.data[0] : data.data) : (data?.slug ? data : null);

      if (currentPost) {
        setPost(currentPost);

        const listRes = await fetch(`${API_URL}posts/?cb=${Date.now()}`, {
          headers: { "x-api-key": API_KEY }
        });
        const listData = await listRes.json();

        if (listData?.success && Array.isArray(listData.data)) {
          const others = listData.data
            .filter((p: Post) => p.slug !== slug)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          setRelatedPosts(others);
        }
      } else {
        throw new Error("Could not find post data.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error("[Blog] Detail fetch timed out.");
      } else {
        console.error("[Blog] Detail fetch failed:", err.message);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post?.content) {
      // Parse headers for TOC after content is loaded
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanHtml(post.content);
      const foundHeaders = Array.from(tempDiv.querySelectorAll('h1, h2, h3, h4'))
        .filter(h => h.id && h.textContent?.trim())
        .map(h => ({
          id: h.id,
          text: h.textContent?.trim() || ""
        }));
      setHeaders(foundHeaders);
    }
  }, [post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height === 0) return;
      const scrolled = (winScroll / height);
      const bar = document.getElementById('reading-bar');
      if (bar) bar.style.transform = `scaleX(${scrolled})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) return <DetailSkeleton />;
  if (error || !post) return <DetailError message={error || "Post not found"} retry={fetchPost} />;

  return (
    <main className="min-h-screen bg-white relative scroll-smooth">
      {/* 📈 READING PROGRESS */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left scale-x-0 z-50 transition-transform duration-200" id="reading-bar" />


      {/* Social Links Top Right */}
      <div className="absolute top-8 right-6 flex items-center gap-5 z-20">
        <a href="https://linkedin.com" target="_blank" className="text-gray-300 hover:text-blue-600 transition-all hover:scale-110" aria-label="LinkedIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
        </a>
        <a href="https://x.com" target="_blank" className="text-gray-300 hover:text-black transition-all hover:scale-110" aria-label="X">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </a>
        <a href="https://github.com/ManjilP/internship_project" target="_blank" className="text-gray-300 hover:text-black transition-all hover:scale-110" aria-label="GitHub">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
        </a>
      </div>

      {/* ⬅️ BACK TO BLOG - Top Left */}
      <div className="absolute top-8 left-6 z-20">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100/30 hover:-translate-y-0.5"
          style={{ fontFamily: 'var(--font-elms)' }}
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">Back</span>
        </Link>
      </div>

      {/* 🏷️ HEADER: Title → Dates → Image */}
      <header className="max-w-5xl mx-auto px-6 pt-24">
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8 animate-fade-up" style={{ fontFamily: 'var(--font-elms)' }}>
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[13px] text-slate-500 font-bold mb-12" style={{ fontFamily: 'var(--font-elms)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Published {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(',', '') : "Apr 21 2026"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(',', '') : "Apr 21 2026"}</span>
          </div>
        </div>

        {post.image && (
          <div className="w-full mb-16 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100/50" 
            />
          </div>
        )}
      </header>

      {/* 🛠️ NAVIGATION & UTILITIES */}
      <div className="max-w-5xl mx-auto px-6 mb-16 flex items-center justify-start">
        <span className="px-6 py-2 bg-slate-100 text-slate-900 text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-200 shadow-sm" style={{ fontFamily: 'var(--font-elms)' }}>
          {post.category_details?.name || "General"}
        </span>
      </div>

      <article className="pb-32">
        {/* 📊 EDITORIAL METADATA & TOC SECTION */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="flex flex-wrap items-center gap-12 text-sm text-slate-800 font-bold mb-10 pb-8 border-b border-slate-100" style={{ fontFamily: 'var(--font-elms)' }}>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] uppercase tracking-widest text-slate-400">Duration</span>
               <span className="text-xl font-black">{Math.ceil((post.content?.split(' ').length || 0) / 200)} MIN READ</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] uppercase tracking-widest text-slate-400">Complexity</span>
               <span className="text-xl font-black">{(post.content?.split(' ').length || 0).toLocaleString()} WORDS</span>
             </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-elms)' }}>Key Takeaway</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">
              {post.description?.replace(/<[^>]*>/g, '') || "In-depth analysis of modern engineering principles and the future of AI-driven collaborative design."}
            </p>
          </div>

          {/* 📍 IN-CONTENT TABLE OF CONTENTS (Teal Box) */}
          <div className="bg-teal-50/50 border-2 border-teal-100/50 rounded-[3rem] p-10 md:p-14 mb-16 relative shadow-sm shadow-teal-100/20 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-black italic text-teal-900 mb-10 tracking-tight" style={{ fontFamily: 'var(--font-elms)' }}>Table of Contents</h3>
            
            <ul className="space-y-5">
              {headers.length > 0 ? (
                headers.map((h, i) => (
                  <li key={i} className="flex items-start gap-5 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={() => scrollToSection(h.id)}
                      className="text-slate-900 font-black hover:text-indigo-600 text-left transition-all cursor-pointer leading-snug text-lg group-hover:translate-x-1"
                      style={{ fontFamily: 'var(--font-elms)' }}
                    >
                      {h.text}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-teal-700/50 font-bold italic" style={{ fontFamily: 'var(--font-elms)' }}>Synchronizing article structure...</li>
              )}
            </ul>
          </div>
        </div>


        {/* 📄 MAIN CONTENT with Editorial Styling */}
        <div
          id="insights"
          className="max-w-5xl mx-auto px-6 text-2xl leading-loose text-gray-700 space-y-14 
                     prose prose-indigo 
                     first-letter:text-7xl first-letter:font-black first-letter:text-indigo-600 
                     first-letter:mr-3 first-letter:float-left 
                     [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-600 [&>blockquote]:bg-indigo-50/30 [&>blockquote]:py-6 [&>blockquote]:px-8 [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:text-indigo-900"
          style={{ letterSpacing: '-0.011em' }}
          dangerouslySetInnerHTML={{ __html: cleanHtml(post.content) }}
        />

        {/* 📚 DISCOVERY GRID */}
        <footer id="discovery" className="max-w-7xl mx-auto px-6 mt-32 pt-20 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-16 text-center justify-center">
            <div className="h-px w-20 bg-gray-100" />
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-900" style={{ fontFamily: 'var(--font-elms)' }}>Other Blogs</h3>
            <div className="h-px w-20 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((related) => (
              <article 
                key={related.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-300 border border-slate-100 flex flex-col group"
              >
                {related.image && (
                  <Link href={`/posts/${related.slug}`} className="relative aspect-video overflow-hidden">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                  </Link>
                )}
                <div className="p-8 flex flex-col flex-1">
                   <div className="mb-4">
                     <span className="px-5 py-2 bg-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-200" style={{ fontFamily: 'var(--font-elms)' }}>
                        {related.category_details?.name || "General"}
                     </span>
                   </div>

                   <Link href={`/posts/${related.slug}`} className="mb-6 block">
                     <h2 className="text-2xl font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-elms)' }}>
                       {related.title}
                     </h2>
                   </Link>

                   <p className="text-[12px] font-black text-slate-400 mt-auto uppercase tracking-widest" style={{ fontFamily: 'var(--font-elms)' }}>
                     {related.published_at ? new Date(related.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(',', '') : "Apr 23 2026"}
                   </p>
                </div>
              </article>
            ))}
          </div>
        </footer>
      </article>
    </main>
  );
}

// ── Components ───────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
        <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-20 w-full bg-gray-50 rounded-2xl animate-pulse" />
        <div className="h-10 w-2/3 bg-gray-50 rounded-xl animate-pulse" />
        <div className="h-[400px] w-full bg-gray-50 rounded-[2.5rem] animate-pulse" />
      </div>
    </div>
  );
}

function DetailError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Something went wrong</h2>
      <p className="text-gray-500 mb-10 max-w-sm font-medium">{message}</p>
      <button
        onClick={retry}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-100 transition-all"
      >
        Retry Page
      </button>
    </div>
  );
}


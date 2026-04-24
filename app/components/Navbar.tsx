"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems = [
    { label: "Blogs", href: "/", hasDropdown: true },
  ];

  const blogMenu = [
    { title: "Blogs", desc: "Explore our collection of expert articles, insights. Stay up-to-date...", href: "/" },
    { title: "News", desc: "Get the latest news and updates on our services, industry trends, and...", href: "#" },
    { title: "Forum", desc: "Join our community of like-minded individuals and share your...", href: "#" },
    { title: "Notice", desc: "Get the latest news and updates on our services, industry trends, and...", href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" style={{ fontFamily: 'var(--font-elms)' }}>
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-center">
        <ul className="flex items-center gap-10">
          {navItems.map((item) => (
            <li 
              key={item.label} 
              className="relative py-7 group cursor-pointer"
              onMouseEnter={() => item.hasDropdown && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div className="flex items-center gap-1.5 font-bold text-[15px] text-gray-800 hover:text-indigo-600 transition-colors">
                <Link href={item.href}>{item.label}</Link>
                {item.hasDropdown && (
                  <svg className={`w-3 h-3 transition-transform duration-300 ${openMenu === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>

              {/* Mega Dropdown for Blogs */}
              {item.label === "Blogs" && openMenu === "Blogs" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-white shadow-2xl rounded-3xl border border-gray-100 p-10 animate-fade-up">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    {blogMenu.map((subItem) => (
                      <Link 
                        key={subItem.title} 
                        href={subItem.href}
                        className="group/item flex flex-col gap-2"
                      >
                        <h4 className="font-black text-gray-900 group-hover/item:text-indigo-600 transition-colors text-lg italic">
                          {subItem.title}
                        </h4>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">
                          {subItem.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

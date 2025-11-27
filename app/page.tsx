"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  image_url: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const backgroundImageUrl = "/hero-background.jpg";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories", {
          cache: "no-store",
        });

        const result = await res.json();
        setCategories(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Failed fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* HERO */}
      <header
        className="relative h-screen"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay diganti lebih soft */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

        <div className="relative z-10">
          <Navbar />
        </div>

        <div className="relative z-10 flex items-center justify-center md:justify-start h-full">
          <div className="container mx-auto px-6 text-center md:text-left">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Let's Rent Sport Equipment
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Rentletics memudahkan kamu menyewa alat olahraga tanpa harus membeli.
              </p>

              <Link
                href="/register"
                className="mt-8 inline-block bg-[#FFB84D] hover:bg-[#FFD580] text-black font-bold py-3 px-8 rounded-full transition duration-300"
              >
                SIGN UP NOW
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-6 py-20">
        <section>
          <h2 className="text-3xl font-bold text-[#0C2E4E] text-center mb-10">
            Popular Categories
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada kategori tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.name}`}
                  className="group block relative overflow-hidden rounded-lg border border-gray-200 shadow-md"
                >
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <h3 className="text-black text-xl font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

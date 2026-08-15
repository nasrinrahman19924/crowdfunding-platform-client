"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Turn Your Ideas Into Reality",
    description:
      "Launch your campaign and get the support you need to make your idea happen.",
    button: "Explore Campaigns",
    href: "/campaigns",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Support Ideas That Matter",
    description:
      "Discover meaningful campaigns and use your credits to support projects you believe in.",
    button: "Explore Campaigns",
    href: "/campaigns",
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Together We Can Make an Impact",
    description:
      "Join our community of creators and supporters and help build a better future.",
    button: "Get Started",
    href: "/register",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const currentSlide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[550px] overflow-hidden text-white">
      {/* Background Image */}
      <div
        key={currentSlide.image}
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url("${currentSlide.image}")`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[550px] max-w-7xl items-center px-6 py-20 md:px-10 lg:px-16">
        <div
          key={activeSlide}
          className="max-w-3xl animate-[fadeIn_0.6s_ease-in-out]"
        >
          {/* Badge */}
          <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            Crowdfunding Platform
          </span>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
            {currentSlide.description}
          </p>

          {/* CTA Button */}
          <Link
            href={currentSlide.href}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg"
          >
            {currentSlide.button}
          </Link>
        </div>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur transition hover:bg-white/25 md:left-6"
      >
        ←
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur transition hover:bg-white/25 md:right-6"
      >
        →
      </button>

      {/* Indicators */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

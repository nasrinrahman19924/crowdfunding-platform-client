"use client";

import Link from "next/link";
import { ArrowRight, Heart, Rocket } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:px-12 lg:px-20">
          {/* Soft Decorative Background */}
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-pink-100/70 blur-3xl" />

          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Heart Icon */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">
              <Heart className="h-7 w-7 text-pink-500" fill="currentColor" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Ready to Make an Impact?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Whether you have an idea worth supporting or want to help someone
              in need, FundNest makes it simple to create change and make a
              meaningful difference.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* Start Campaign */}
              <Link
                href="/dashboard/add-campaign"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-lg"
              >
                <Rocket className="h-5 w-5" />
                Start a Campaign
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {/* Explore Campaigns */}
              <Link
                href="/campaigns"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                Explore Campaigns
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Bottom Text */}
            <p className="mt-6 text-sm text-slate-500">
              Start today. Inspire others. Make a difference. ❤️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

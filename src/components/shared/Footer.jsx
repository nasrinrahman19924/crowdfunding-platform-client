"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-xl font-bold"
            >
              FundNest
            </Link>

            <p className="mt-2 max-w-sm text-sm text-default-500">
              Empowering ideas, supporting dreams, and building
              stronger communities together.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="YOUR_FACEBOOK_URL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-default-100"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="YOUR_LINKEDIN_URL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-default-100"
            >
              <FaLinkedinIn size={16} />
            </a>

            <a
              href="YOUR_GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-default-100"
            >
              <FaGithub size={17} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-default-500">
          © {new Date().getFullYear()} FundNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
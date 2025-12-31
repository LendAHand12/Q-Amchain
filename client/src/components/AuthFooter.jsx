import { Link } from "react-router-dom";
import { Send, Twitter, Instagram, FileText } from "lucide-react";

export default function AuthFooter() {
  return (
    <footer className="mt-12">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 rounded-lg bg-gray-800/90 sm:flex-row">
        {/* Left side - Links */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
          <Link to="/terms" className="transition-colors hover:text-white">
            Terms and condition
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/faq" className="transition-colors hover:text-white">
            Help & support
          </Link>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://t.me/qamchain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-colors hover:text-white"
            aria-label="Telegram"
          >
            <Send className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/qamchain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-colors hover:text-white"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/qamchain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-colors hover:text-white"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="/docs"
            className="text-gray-300 transition-colors hover:text-white"
            aria-label="Documentation"
          >
            <FileText className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}


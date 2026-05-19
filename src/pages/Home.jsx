import React from "react";
import { Link } from "react-router-dom";
import { Zap, Shield, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8 animate-fade-in">
          <Zap size={14} className="fill-current" />
          <span>Powered by Groq LPU™ technology</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          The Future of Chat is <br className="hidden md:block" />
          <span className="text-blue-600 dark:text-blue-500">Blazing Fast</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Experience near-instantaneous responses with Groq's high-performance AI inference.
          The smartest conversations at the speed of thought.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to={user ? "/chat" : "/auth"}
            className="px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-zinc-200 dark:shadow-none"
          >
            Start Chatting Now
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-50/50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="text-blue-600 dark:text-blue-400" />}
            title="Ultra Low Latency"
            description="Responses generated in milliseconds using the world's fastest AI inference engine."
          />
          <FeatureCard
            icon={<Shield className="text-blue-600 dark:text-blue-400" />}
            title="Private & Secure"
            description="Your conversations are encrypted and your data privacy is our top priority."
          />
          <FeatureCard
            icon={<MessageSquare className="text-blue-600 dark:text-blue-400" />}
            title="Multi-Chat Support"
            description="Organize your thoughts across multiple chat sessions with seamless history tracking."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <span className="font-bold text-xl tracking-tight">GroqAI</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            The next generation of AI communication. Built for speed.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Home;

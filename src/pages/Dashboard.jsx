import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MessageSquare, Clock, Shield, Star, Settings } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${color} mb-4`}>
      <Icon size={20} />
    </div>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold dark:text-white mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const savedChats = JSON.parse(localStorage.getItem(`conversations_${user?.id}`) || '[]');

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Account Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'User'}</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all">
            <Settings size={20} />
            Account Settings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={MessageSquare}
            label="Total Chats"
            value={savedChats.length}
            color="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={Clock}
            label="Avg Response"
            value="140ms"
            color="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Shield}
            label="Privacy Level"
            value="Enterprise"
            color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={Star}
            label="Usage Limit"
            value="Unlimited"
            color="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
              <h2 className="text-xl font-bold dark:text-white mb-6">Recent Activity</h2>
              {savedChats.length > 0 ? (
                <div className="space-y-4">
                  {savedChats.slice(0, 5).map(chat => (
                    <div key={chat.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                          <MessageSquare size={18} className="text-indigo-600" />
                        </div>
                        <span className="font-medium dark:text-gray-200 truncate">{chat.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No chats found. Start your first conversation!</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Get access to advanced models, priority support, and infinite message history storage.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                Coming Soon
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
              <h2 className="text-xl font-bold dark:text-white mb-6">Profile</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-600">
                  <User size={32} />
                </div>
                <div>
                  <p className="font-bold dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

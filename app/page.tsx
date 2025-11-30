'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface AgentStatus {
  isRunning: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  topicsFound: number;
  contentGenerated: number;
  postsScheduled: number;
  errors: string[];
}

interface Statistics {
  total: number;
  byPlatform: { [key: string]: number };
  byStatus: { [key: string]: number };
  successRate: string;
}

interface ScheduledPost {
  id: string;
  platform: string;
  scheduledTime: string;
  status: string;
  content: {
    title: string;
    content: string;
  };
}

interface Topic {
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

export default function Home() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'topics'>('dashboard');

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('/api/agent/status');
      if (response.data.success) {
        setAgentStatus(response.data.status);
        setStatistics(response.data.statistics.scheduler);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/topics');
      if (response.data.success) {
        setTopics(response.data.topics);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAgent = async () => {
    setLoading(true);
    try {
      await axios.post('/api/agent/start');
      await fetchStatus();
      alert('Agent started successfully!');
    } catch (error) {
      alert('Failed to start agent');
    } finally {
      setLoading(false);
    }
  };

  const stopAgent = async () => {
    setLoading(true);
    try {
      await axios.post('/api/agent/stop');
      await fetchStatus();
      alert('Agent stopped successfully!');
    } catch (error) {
      alert('Failed to stop agent');
    } finally {
      setLoading(false);
    }
  };

  const triggerRun = async () => {
    setLoading(true);
    try {
      await axios.post('/api/agent/trigger');
      await fetchStatus();
      alert('Agent run triggered successfully!');
    } catch (error) {
      alert('Failed to trigger agent run');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'topics') {
      fetchTopics();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Social Media Agent
              </h1>
              <p className="text-gray-400 mt-1">Autonomous content generation & posting</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startAgent}
                disabled={loading || agentStatus?.isRunning}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Start Agent
              </button>
              <button
                onClick={stopAgent}
                disabled={loading || !agentStatus?.isRunning}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Stop Agent
              </button>
              <button
                onClick={triggerRun}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Trigger Run
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-4 border-b border-purple-500/30">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-purple-400 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-400 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Scheduled Posts
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'topics'
                ? 'border-b-2 border-purple-400 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending Topics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${agentStatus?.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                Agent Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-2xl font-bold">{agentStatus?.isRunning ? 'Running' : 'Stopped'}</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Topics Found</p>
                  <p className="text-2xl font-bold">{agentStatus?.topicsFound || 0}</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Content Generated</p>
                  <p className="text-2xl font-bold">{agentStatus?.contentGenerated || 0}</p>
                </div>
              </div>
              {agentStatus?.lastRun && (
                <div className="mt-4 text-sm text-gray-400">
                  Last run: {new Date(agentStatus.lastRun).toLocaleString()}
                </div>
              )}
              {agentStatus?.nextRun && (
                <div className="text-sm text-gray-400">
                  Next run: {new Date(agentStatus.nextRun).toLocaleString()}
                </div>
              )}
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Posts</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Posted</p>
                    <p className="text-2xl font-bold">{statistics.byStatus.posted || 0}</p>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold">{statistics.byStatus.pending || 0}</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold">{statistics.successRate}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">By Platform</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(statistics.byPlatform).map(([platform, count]) => (
                    <div key={platform} className="bg-purple-500/5 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">{platform}</p>
                      <p className="text-xl font-bold">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Automation Services */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-3">AI Automation Services</h2>
              <p className="text-gray-300 mb-4">
                Transform your business with custom AI automation solutions. Zero upfront investment, results-driven pricing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">What We Offer:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>✅ Social media automation</li>
                    <li>✅ Content generation systems</li>
                    <li>✅ Customer service AI bots</li>
                    <li>✅ Data analysis automation</li>
                    <li>✅ Process optimization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Why Choose Us:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>💰 No upfront investment</li>
                    <li>📈 ROI-based pricing</li>
                    <li>🆓 Free consultation</li>
                    <li>⚡ Quick implementation</li>
                    <li>🔧 Custom solutions</li>
                  </ul>
                </div>
              </div>
              <button className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition-all transform hover:scale-105">
                Get Free Consultation
              </button>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Scheduled Posts ({posts.length})</h2>
              {loading ? (
                <p className="text-gray-400">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-400">No posts scheduled yet. Start the agent to generate content.</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-purple-500/10 rounded-lg p-4 hover:bg-purple-500/20 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold">{post.platform}</span>
                          <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                            post.status === 'posted' ? 'bg-green-600' : post.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(post.scheduledTime).toLocaleString()}
                        </p>
                      </div>
                      <h3 className="font-semibold mb-2">{post.content.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-3">{post.content.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Trending AI Topics ({topics.length})</h2>
              {loading ? (
                <p className="text-gray-400">Loading topics...</p>
              ) : topics.length === 0 ? (
                <p className="text-gray-400">No topics loaded. Click the button to fetch trending topics.</p>
              ) : (
                <div className="space-y-3">
                  {topics.map((topic, index) => (
                    <div key={index} className="bg-purple-500/10 rounded-lg p-4 hover:bg-purple-500/20 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-semibold">{topic.source}</span>
                        <p className="text-sm text-gray-400">
                          {new Date(topic.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <h3 className="font-semibold mb-2">{topic.title}</h3>
                      <a
                        href={topic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Read more →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 mt-12 py-8 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>AI Social Media Agent - Autonomous content generation for 7 platforms</p>
          <p className="mt-2 text-sm">Goal: 10M followers in 3-6 months through consistent, data-driven content</p>
        </div>
      </footer>
    </div>
  );
}

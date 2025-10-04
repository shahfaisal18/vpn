
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ServerList } from './components/ServerList';
import { ConnectionDisplay } from './components/ConnectionDisplay';
import { SecurityAssistant } from './components/SecurityAssistant';
import type { Server, ConnectionStatus } from './types';
import { Status } from './types';
import { SERVERS } from './constants';
import { SecurityAssistantIcon } from './components/icons/SecurityAssistantIcon';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedServer, setSelectedServer] = useState<Server | null>(SERVERS[0]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(Status.DISCONNECTED);
  const [connectedInfo, setConnectedInfo] = useState<{ ip: string; dataUsage: { up: number; down: number } } | null>(null);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (connectionStatus === Status.CONNECTED) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setConnectedInfo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            dataUsage: {
              up: prev.dataUsage.up + Math.random() * 0.1,
              down: prev.dataUsage.down + Math.random() * 0.5
            }
          }
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
      setTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionStatus]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const generateRandomIp = () => {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
  };

  const handleConnect = useCallback(() => {
    if (!selectedServer) return;
    setConnectionStatus(Status.CONNECTING);
    setTimeout(() => {
      setConnectionStatus(Status.CONNECTED);
      setConnectedInfo({
        ip: generateRandomIp(),
        dataUsage: { up: 0, down: 0 }
      });
    }, 2000);
  }, [selectedServer]);

  const handleDisconnect = useCallback(() => {
    setConnectionStatus(Status.DISCONNECTED);
    setConnectedInfo(null);
    setTimer(0);
  }, []);

  const handleServerSelect = (server: Server) => {
    if (connectionStatus === Status.DISCONNECTED) {
      setSelectedServer(server);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ConnectionDisplay
            status={connectionStatus}
            selectedServer={selectedServer}
            connectedInfo={connectedInfo}
            duration={timer}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          <ServerList
            servers={SERVERS}
            selectedServer={selectedServer}
            onSelect={handleServerSelect}
            connectionStatus={connectionStatus}
          />
        </div>
      </main>
      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label="Open Security Assistant"
      >
        <SecurityAssistantIcon />
      </button>
      <SecurityAssistant isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}


import React from 'react';
import type { Server, ConnectionStatus } from '../types';
import { Status } from '../types';
import { PowerIcon } from './icons/PowerIcon';

interface ConnectionDisplayProps {
  status: ConnectionStatus;
  selectedServer: Server | null;
  connectedInfo: { ip: string; dataUsage: { up: number; down: number } } | null;
  duration: number;
  onConnect: () => void;
  onDisconnect: () => void;
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes.toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(2)} GB`;
};

const StatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const statusConfig = {
    [Status.DISCONNECTED]: { text: 'Disconnected', color: 'bg-red-500' },
    [Status.CONNECTING]: { text: 'Connecting...', color: 'bg-yellow-500' },
    [Status.CONNECTED]: { text: 'Connected', color: 'bg-green-500' },
  };

  const { text, color } = statusConfig[status];

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className={`h-3 w-3 rounded-full ${color} animate-pulse`}></span>
      <span className="font-semibold text-lg">{text}</span>
    </div>
  );
};


export const ConnectionDisplay: React.FC<ConnectionDisplayProps> = ({
  status,
  selectedServer,
  connectedInfo,
  duration,
  onConnect,
  onDisconnect,
}) => {
  const isConnected = status === Status.CONNECTED;
  const isConnecting = status === Status.CONNECTING;

  const handleButtonClick = () => {
    if (isConnected) {
      onDisconnect();
    } else if (status === Status.DISCONNECTED) {
      onConnect();
    }
  };

  const buttonClass = isConnected
    ? 'bg-emerald-500 animate-glow-green'
    : 'bg-blue-600 animate-glow-blue';

  return (
    <div className="flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 p-8 rounded-2xl shadow-lg h-full">
      <StatusIndicator status={status} />
      
      <button
        onClick={handleButtonClick}
        disabled={isConnecting || (!selectedServer && !isConnected)}
        className={`w-48 h-48 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${buttonClass}`}
      >
        <PowerIcon className="w-24 h-24" />
      </button>

      <div className="text-center mt-6 h-24">
        {isConnected && connectedInfo && selectedServer ? (
          <>
            <p className="text-xl font-bold">{selectedServer.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{connectedInfo.ip}</p>
            <p className="font-mono text-lg mt-2">{formatDuration(duration)}</p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold">{selectedServer?.name || 'No Server Selected'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isConnecting ? 'Establishing secure connection...' : 'Ready to connect'}
            </p>
          </>
        )}
      </div>

       <div className="w-full mt-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
                <span>↓ Download</span>
                <span>{formatBytes(connectedInfo?.dataUsage.down ?? 0)}</span>
            </div>
            <div className="flex justify-between mt-1">
                <span>↑ Upload</span>
                <span>{formatBytes(connectedInfo?.dataUsage.up ?? 0)}</span>
            </div>
        </div>
    </div>
  );
};

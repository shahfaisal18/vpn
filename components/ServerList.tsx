
import React from 'react';
import type { Server, ConnectionStatus } from '../types';
import { Status } from '../types';
import { WifiIcon } from './icons/WifiIcon';

interface ServerListProps {
  servers: Server[];
  selectedServer: Server | null;
  onSelect: (server: Server) => void;
  connectionStatus: ConnectionStatus;
}

const ServerCard: React.FC<{
  server: Server;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled: boolean;
}> = ({ server, isSelected, onSelect, isDisabled }) => {
  const ringClass = isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-slate-300 dark:ring-slate-700';
  const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/50';

  return (
    <li
      onClick={isDisabled ? undefined : onSelect}
      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${ringClass} ${disabledClass}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{server.flag}</span>
        <div>
          <p className="font-semibold text-lg">{server.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <WifiIcon />
        <span>{server.ping}ms</span>
      </div>
    </li>
  );
};

export const ServerList: React.FC<ServerListProps> = ({ servers, selectedServer, onSelect, connectionStatus }) => {
  const isDisabled = connectionStatus !== Status.DISCONNECTED;
  
  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Select Server</h2>
      <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {servers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            isSelected={selectedServer?.id === server.id}
            onSelect={() => onSelect(server)}
            isDisabled={isDisabled}
          />
        ))}
      </ul>
    </div>
  );
};

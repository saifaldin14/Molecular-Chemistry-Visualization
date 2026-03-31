import type { CollabUser } from '../types';

interface CollaboratorBarProps {
  collaborators: CollabUser[];
  connected: boolean;
}

export default function CollaboratorBar({ collaborators, connected }: CollaboratorBarProps) {
  return (
    <div className="collaborator-bar">
      <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
        <span className="status-dot" />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="collaborator-list">
        <span className="collaborator-count">
          {collaborators.length} online
        </span>
        {collaborators.map((user) => (
          <div
            key={user.id}
            className="collaborator-avatar"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

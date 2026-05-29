import { io } from 'socket.io-client';

// In local dev mode, Vite proxies '/socket.io' and '/api' to 'http://localhost:3000'
// In cross-device Wi-Fi mode, we will connect directly using the current window.location.host
export const socket = io(window.location.origin);

let queueListeners = [];

// Listen to Socket.io queue updates and trigger callbacks
socket.on('queue_updated', (updatedQueue) => {
  queueListeners.forEach(listener => {
    try {
      listener(updatedQueue);
    } catch (err) {
      console.error('Error executing queue listener callback:', err);
    }
  });
});

export const kt = {
  entities: {
    QueueEntry: {
      // List queue entries from Express API
      list: async (sortField = 'position', limit = 50) => {
        try {
          const res = await fetch('/api/queue');
          if (!res.ok) throw new Error('Failed to fetch queue');
          return await res.json();
        } catch (err) {
          console.error('Error listing queue entries:', err);
          return null;
        }
      },

      // Create new queue entry
      create: async (data) => {
        try {
          const res = await fetch('/api/queue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return { error: errData.error || 'Failed to create queue entry' };
          }
          return await res.json();
        } catch (err) {
          console.error('Error creating queue entry:', err);
          return { error: err.message || 'Failed to create queue entry' };
        }
      },

      // Update existing queue entry status, frame, photo, etc.
      update: async (id, data) => {
        try {
          const res = await fetch(`/api/queue/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('Failed to update queue entry');
          return await res.json();
        } catch (err) {
          console.error('Error updating queue entry:', err);
          return null;
        }
      },

      // Filter entries locally or via simple query
      filter: async (criteria = {}, sortField = 'position', limit = 100) => {
        try {
          const entries = await kt.entities.QueueEntry.list(sortField, limit);
          return entries.filter(entry => {
            for (const key of Object.keys(criteria)) {
              if (entry[key] !== criteria[key]) return false;
            }
            return true;
          });
        } catch (err) {
          console.error('Error filtering queue entries:', err);
          return [];
        }
      },

      // Reset all queue entries (Clear queue)
      reset: async () => {
        try {
          const res = await fetch('/api/queue/reset', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to reset queue');
          return await res.json();
        } catch (err) {
          console.error('Error resetting queue:', err);
          return null;
        }
      },

      // Subscribe to changes (WebSockets real-time sync)
      subscribe: (callback) => {
        queueListeners.push(callback);
        // Force an initial update immediately on subscription
        kt.entities.QueueEntry.list().then(callback);
        
        // Return unsubscribe function
        return () => {
          queueListeners = queueListeners.filter(listener => listener !== callback);
        };
      }
    }
  }
};

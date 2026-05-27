import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Trash2 } from 'lucide-react';

/**
 * QueueItem (SL) - Individual row in the queue sidebar
 */
export function QueueItem({ entry, isActive, index, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.05 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/20"
          : "bg-secondary/60 border border-border"
      }`}
    >
      {/* Icon Circle */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <User className="w-4 h-4" />
      </div>

      {/* Name */}
      <span className={`font-heading font-semibold text-sm truncate flex-1 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {entry.display_name}
      </span>

      {/* Status Badge */}
      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium uppercase tracking-wider shrink-0"
        >
          En cours
        </motion.span>
      )}

      {/* Delete button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(entry.id, entry.display_name);
          }}
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-destructive/30 shrink-0"
          title="Supprimer de la file"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

/**
 * QueueSidebar (bL) - Renders the scrollable queue list sidebar
 */
export function QueueSidebar({ queue, onRemove }) {
  // Filter out users who are already done with their photo session
  const activeQueue = queue.filter(item => item.status !== 'done');

  return (
    <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6 w-full max-w-sm shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-foreground">File d'attente</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
          {activeQueue.length} en attente
        </span>
      </div>

      {/* Queue Body list */}
      {activeQueue.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8 italic">
          Aucune personne en attente
        </p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {activeQueue.map((entry, index) => (
              <QueueItem
                key={entry.id}
                entry={entry}
                isActive={entry.status === 'active'}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

'use client ';

import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import ListItem from './ListItem';
import { Item } from '../types';

type Props = {
  items: Item[];
  loading: boolean;
  editMode: boolean;
  onSave: (changed: Record<string, { text: string }>) => Promise<void> | void;
  onCancel: () => void;
  onDeleted: (id: string) => Promise<void> | void;
  onToggle: (id: string, next: boolean) => void | Promise<void>;
};

const List = ({
  items,
  loading,
  editMode,
  onDeleted,
  onSave,
  onCancel,
  onToggle,
}: Props) => {
  // drafts mirror the list when entering edit mode
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  // Build an initial map from items → text (memoized to avoid recomputation, but ALWAYS called)
  const initialMap = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i.text])),
    [items],
  );

  // When entering edit mode, seed drafts once from current items
  useEffect(() => {
    if (editMode) setDrafts(initialMap);
  }, [editMode, initialMap]);

  // NON-HOOK derived data — safe to compute conditionally
  const changed: Record<string, { text: string }> = {};
  if (editMode) {
    for (const i of items) {
      const d = drafts[i.id];
      if (d !== undefined && d !== i.text) {
        changed[i.id] = { text: d };
      }
    }
  }

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No items.</p>;

  return (
    <div className="p-4 w-[50%]">
      {editMode && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(changed)}
            disabled={Object.keys(changed).length === 0}
            className="text-xs px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          >
            Save changes
          </button>
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1 rounded border"
          >
            Cancel
          </button>
          <span className="text-xs text-gray-600">
            {Object.keys(changed).length} modified
          </span>
        </div>
      )}
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          editMode={editMode}
          onDeleted={() => onDeleted(item.id)}
          drafts={drafts}
          setDrafts={setDrafts}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default List;

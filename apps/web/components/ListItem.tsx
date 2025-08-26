import React from 'react';
import { Item } from '../types';
import { FaTrash } from 'react-icons/fa';
import { Checkbox } from '@/components/components/ui/checkbox';
import { useState } from 'react';

const ListItem = ({
  item,
  onDeleted,
  editMode,
  drafts,
  setDrafts,
  onToggle,
}: {
  item: Item;
  onDeleted: () => void;
  editMode: boolean;
  drafts: Record<string, string>;
  setDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onToggle: (id: string, next: boolean) => void | Promise<void>;
}) => {
  const [checked, setChecked] = useState(item.isChecked);
  const [pending, setPending] = useState(false);

  const onCheckedChange = async (v: boolean | 'indeterminate') => {
    const next = Boolean(v);
    setPending(true);
    try {
      await onToggle(item.id, next); // ← bubbles up to pages.tsx
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex  border-b-2 border-black bg-white p-2 mx-auto w-[80%]">
      {editMode ? (
        <>
          <input
            value={drafts[item.id] ?? ''}
            onChange={(e) =>
              setDrafts((d) => ({ ...d, [item.id]: e.target.value }))
            }
            className="flex-1 mr-3 border rounded px-2 py-1"
          />
          <button
            onClick={() => onDeleted()}
            className="px-2 py-1 rounded bg-red-600 text-white text-sm"
          >
            <FaTrash />
          </button>
        </>
      ) : (
        <div className="flex flex-row items-center justify-between gap-10">
          <Checkbox
            checked={item.isChecked}
            onCheckedChange={onCheckedChange}
            disabled={pending}
          />
          <span className={item.isChecked ? 'line-through text-gray-500' : ''}>
            {item.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default ListItem;

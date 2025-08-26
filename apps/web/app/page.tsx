'use client';

import { useState, useEffect } from 'react';
import AddForm from '../components/AddForm';
import List from '../components/List';
import { Item } from '../types';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`);
    const data: Item[] = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Save only changed drafts (sent from child)
  const saveChanges = async (changed: Record<string, { text: string }>) => {
    // naive: sequential PATCH; you can batch on your API if you prefer
    for (const [idStr, payload] of Object.entries(changed)) {
      const id = idStr;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    await fetchItems();
    setEditMode(false);
  };

  const deleteOne = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    await fetchItems();
  };

  const handleToggle = async (id: string, next: boolean) => {
    // optional optimistic update
    setItems((xs) =>
      xs.map((x) => (x.id === id ? { ...x, isChecked: next } : x)),
    );

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isChecked: next }),
    });

    // hard refresh from backend to stay in sync
    await fetchItems();
  };

  return (
    <>
      <div className="flex flex-col items-center py-6 h-screen  w-[90%] mx-auto ">
        <h1 className="text-2xl font-bold pb-2">To-Do List</h1>
        <div className="flex flex-col">
          <AddForm onCreated={fetchItems} />
          <button
            onClick={() => setEditMode((v) => !v)}
            className="text-sm bg-blue-600 hover:bg-blue-400 transition-colors duration-200 text-white px-3 rounded mb-4"
          >
            {editMode ? 'Exit' : 'Edit'}
          </button>
        </div>

        <List
          items={items}
          loading={loading}
          editMode={editMode}
          onSave={saveChanges}
          onCancel={() => setEditMode(false)}
          onDeleted={deleteOne}
          onToggle={handleToggle}
        />
      </div>
    </>
  );
}

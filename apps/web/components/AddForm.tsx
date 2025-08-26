import React from 'react';
import { useState } from 'react';

const AddForm = ({ onCreated }: { onCreated: () => void }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, isChecked: false }),
      });

      if (!response.ok) {
        console.log(
          `Failed to add item: ${response.status} ${response.statusText}`,
        );
      }

      setText('');
      onCreated();
    } catch (error) {
      console.log('Error adding item:', error);
    }
  };

  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-400 transition-colors duration-200 text-white">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddForm;

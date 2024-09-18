import { useState } from 'react';

export const useSearch = <T extends { title: string; description: string }>(items: T[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = items.filter((item) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredItems };
};
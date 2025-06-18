import React, { createContext, useState, useContext } from 'react';

// Create the context
const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Function to update the search query
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    setIsSearching(query.trim() !== '');
  };

  // Search function that can be used across components
  const searchTreks = (treks, query) => {
    if (!query.trim()) return treks;
    
    const lowercaseQuery = query.toLowerCase().trim();
    
    return treks.filter(trek => {
      // Search in multiple fields
      return (
        (trek.title && trek.title.toLowerCase().includes(lowercaseQuery)) ||
        (trek.description && trek.description.toLowerCase().includes(lowercaseQuery)) ||
        (trek.location && trek.location.toLowerCase().includes(lowercaseQuery)) ||
        (trek.country && trek.country.toLowerCase().includes(lowercaseQuery)) ||
        (trek.difficulty && trek.difficulty.toLowerCase().includes(lowercaseQuery)) ||
        (trek.duration && trek.duration.toString().includes(lowercaseQuery))
      );
    });
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      updateSearchQuery, 
      isSearching, 
      searchTreks
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Create a custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default SearchContext;

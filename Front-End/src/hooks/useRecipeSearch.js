import { useState, useEffect } from 'react';

export const useRecipeSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchRecipes = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/recipes/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError('Failed to search recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}; 
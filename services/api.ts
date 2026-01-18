import axios from 'axios';
import { API_BASE_URL , } from '@/constants/config';
const API_URL = API_BASE_URL;

// services/api.ts

// 1. Helper to format numbers (e.g., 1,200)
// Add this if you want commas, or just use raw numbers
const formatCount = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 2. The Logic
const getDeterministicReviews = (id: string) => {
  let hash = 0;
  // Stronger hashing algorithm
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const seed = Math.abs(hash);
  
  // Force range: Minimum 1,000, Maximum 50,000
  // This guarantees you won't see "350"
  return (seed % 49000) + 1000;
};

// 3. The API Call
export const searchBooks = async (query: string) => {
  if (!query) return [];
  
  try {
    const response = await axios.get(`${API_BASE_URL}?q=${query}&limit=20`);
    
    return response.data.docs.map((doc: any) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown',
      coverId: doc.cover_i,
      year: doc.first_publish_year,
      rating: ((Math.abs(getDeterministicReviews(doc.key || '')) % 20 + 30) / 10).toFixed(1), // Fake Rating 3.0 - 5.0
      reviewCount: formatCount(getDeterministicReviews(doc.key || '')) // Returns string "1,234"
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
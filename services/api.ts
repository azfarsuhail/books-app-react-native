// services/api.ts
import axios from 'axios';
import { API_BASE_URL, GOOGLE_BOOKS_API_URL } from '@/constants/config';

// --- Existing Helper for Reviews (Keep this as is) ---
const getDeterministicReviews = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  return (seed % 49000) + 1000;
};

const formatCount = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// --- Existing Search Function (Keep this as is) ---
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
      // Default fallback ratings for the list view
      rating: ((Math.abs(getDeterministicReviews(doc.key || '')) % 20 + 30) / 10).toFixed(1),
      reviewCount: formatCount(getDeterministicReviews(doc.key || ''))
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

// services/api.ts
// ... (Keep your searchBooks function here) ...
export const getBookDetails = async (title: string, author: string) => {
  try {
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    
    const response = await axios.get(
      `${GOOGLE_BOOKS_API_URL}?q=${query}&maxResults=1`
    );

    // 1. Check if "items" exists (The API returns "totalItems: 0" if nothing matches)
    const items = response.data.items;
    if (!items || items.length === 0) return null;

    const bookData = items[0].volumeInfo;

    // 2. Safely extract data. 
    // If averageRating is missing (like in your JSON), this returns null.
    return {
      rating: bookData.averageRating || null, 
      count: bookData.ratingsCount || null,   
      description: bookData.description || "No description available for this title.", 
    };
  } catch (error) {
    console.error("Error fetching details from Google:", error);
    return null;
  }
};

export const getAuthorDetails = async (authorName: string) => {
  try {
    // 1. Search for the author by name to get their unique ID (Key)
    const searchUrl = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`;
    const searchRes = await axios.get(searchUrl);
    
    const authorDoc = searchRes.data?.docs?.[0];
    if (!authorDoc || !authorDoc.key) return null;

    // 2. Fetch the detailed profile using that Key
    const detailsUrl = `https://openlibrary.org/authors/${authorDoc.key}.json`;
    const detailsRes = await axios.get(detailsUrl);

    let bio = detailsRes.data?.bio;

    // Open Library sometimes returns bio as a string, sometimes as an object
    if (typeof bio === 'object' && bio.value) {
      bio = bio.value;
    }
    
    return bio || null;
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
};
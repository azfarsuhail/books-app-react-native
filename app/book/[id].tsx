import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COVERS_URL } from '@/constants/config';
// FIX: Import the new author function
import { getBookDetails, getAuthorDetails } from '@/services/api'; 

// PASTE YOUR BASE64 STRING HERE
const base64Placeholder = ""; 

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 1. Setup State
  const [rating, setRating] = useState(params.rating || '4.5');
  const [reviewCount, setReviewCount] = useState(params.reviewCount || '100');
  
  // Description State
  const [description, setDescription] = useState(
    `This is where the detailed plot summary for "${params.title}" resides. Fetching latest data...`
  );
  
  // Author Bio State (New)
  const authorName = typeof params.author === 'string' ? params.author : 'Unknown Author';
  const [aboutAuthorText, setAboutAuthorText] = useState(
    `${authorName} is a celebrated writer. Fetching biography...`
  );

  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const bookTitle = typeof params.title === 'string' ? params.title : 'Unknown Title';

  const coverUrl = params.coverId
    ? `${COVERS_URL}/${params.coverId}-L.jpg`
    : 'https://blog.udemy.com/wp-content/uploads/2014/06/bigstock-Stack-of-colorful-real-books-o-19498535.jpg';

  // 2. Fetch Real Data (Book + Author)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Run both API calls in parallel for speed
        const [bookData, authorBio] = await Promise.all([
          getBookDetails(bookTitle, authorName),
          getAuthorDetails(authorName)
        ]);
        
        // Update Book Details
        if (bookData) {
          if (bookData.rating) setRating(bookData.rating.toString());
          if (bookData.count) setReviewCount(bookData.count.toString());
          setDescription(bookData.description || "No detailed overview available.");
        } else {
          setDescription("No detailed overview available.");
        }

        // Update Author Bio
        if (authorBio) {
          setAboutAuthorText(authorBio);
        } else {
          setAboutAuthorText(`${authorName} is a writer known for this work. No detailed biography is currently available.`);
        }

      } catch (e) {
        console.error("Failed to load details", e);
        setDescription("Could not load book details.");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.iconButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/')} 
          style={styles.iconButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverContainer}>
          <View style={styles.shadowWrapper}>
            <Image
              source={{ uri: coverUrl }}
              style={styles.coverImage}
              contentFit="cover"
              transition={500}
              placeholder={{ uri: base64Placeholder }}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{bookTitle}</Text>
          <Text style={styles.author}>{authorName}</Text>
          <Text style={styles.year}>Published in {params.year || 'N/A'}</Text>

          {/* DYNAMIC RATING */}
          <View style={styles.ratingContainer}>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(Number(rating)) ? "star" : "star-outline"}
                  size={18}
                  color="#FBBF24"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating} <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {isLoadingDetails ? (
            <ActivityIndicator size="small" color="#34D399" style={{ alignSelf: 'flex-start', marginTop: 10 }} />
          ) : (
            <Text style={styles.sectionText}>{description}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the author</Text>
          {isLoadingDetails ? (
            <ActivityIndicator size="small" color="#34D399" style={{ alignSelf: 'flex-start', marginTop: 10 }} />
          ) : (
            <Text style={styles.sectionText}>{aboutAuthorText}</Text>
          )}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="checkmark"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Book Read</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 100,      
    elevation: 50,    
    backgroundColor: '#fff', 
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  coverContainer: { alignItems: 'center', marginVertical: 20 },
  shadowWrapper: {
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  coverImage: { width: 180, height: 270, borderRadius: 8 },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#111827',
  },
  author: { fontSize: 18, color: '#6B7280', marginBottom: 4 },
  year: { fontSize: 14, color: '#9CA3AF', marginBottom: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { marginLeft: 8, fontWeight: 'bold', color: '#1F2937' },
  reviewCount: { fontWeight: 'normal', color: '#9CA3AF' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionText: { fontSize: 16, color: '#6B7280', lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  button: {
    backgroundColor: '#34D399',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COVERS_URL } from '@/constants/config';

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Fallback Logic: If params are missing, use the "Design Mock" text
  const authorName = params.author || 'Unknown Author';
  const bookTitle = params.title || 'Unknown Title';
  const rating = params.rating || '4.5';

  // FIX: This ensures the text ALWAYS appears, even if API data is empty
  const aboutAuthorText = `${authorName} is a celebrated writer, best known for their literary works. Before this publication, ${authorName} published several short stories in literary magazines.`;

  const overviewText = `This is where the detailed plot summary for "${bookTitle}" resides. Since the Open Library Search API provides limited details, we are using this placeholder text to demonstrate the layout structure required by the design specifications.`;

  const coverUrl = params.coverId
    ? `${COVERS_URL}/${params.coverId}-L.jpg`
    : 'https://blog.udemy.com/wp-content/uploads/2014/06/bigstock-Stack-of-colorful-real-books-o-19498535.jpg';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.dismissAll()}
          style={{ padding: 5 }}
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
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{bookTitle}</Text>
          <Text style={styles.author}>{authorName}</Text>
          <Text style={styles.year}>Published in {params.year || 'N/A'}</Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={18}
                color="#FBBF24"
                style={{ marginRight: 2 }}
              />
            ))}
            <Ionicons name="star" size={18} color="#E5E7EB" />
            <Text style={styles.ratingText}>
              {rating} <Text style={styles.reviewCount}>({params.reviewCount} reviews)</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the author</Text>
          <Text style={styles.sectionText}>{aboutAuthorText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.sectionText}>{overviewText}</Text>
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
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
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

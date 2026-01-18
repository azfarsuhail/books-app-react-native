import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import {SEARCH_DEBOUNCE_MS} from '../constants/config';
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const { data: books, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const handlePress = (item: any) => {
    const { id, ...bookData } = item;

    const cleanId = id.replace('/works/', '');

    router.push({
      pathname: `/book/${cleanId}` as any,
      params: bookData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Back')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Book</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Book title or author"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#10B981"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handlePress(item)}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>by {item.author}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  resultItem: { marginBottom: 20 },
  bookTitle: {
    color: '#10B981',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookAuthor: { color: '#9CA3AF', fontSize: 15 },
});

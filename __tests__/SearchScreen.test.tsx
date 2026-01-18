import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchScreen from '../app/index';


jest.mock('../services/api', () => ({
  searchBooks: jest.fn(() => Promise.resolve([
    { id: '/works/123', title: 'Test Book', author: 'Test Author', coverId: 100, year: 2020 }
  ])),
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));


const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};


describe('SearchScreen Integration', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the search input correctly', () => {
    const { getByPlaceholderText } = render(<SearchScreen />, { wrapper: createTestWrapper() });
    const input = getByPlaceholderText('Book title or author');
    expect(input).toBeTruthy();
  });

  it('updates input value when typing', () => {
    const { getByPlaceholderText } = render(<SearchScreen />, { wrapper: createTestWrapper() });
    const input = getByPlaceholderText('Book title or author');
    fireEvent.changeText(input, 'Harry Potter');
    expect(input.props.value).toBe('Harry Potter');
  });

  it('navigates to the detail screen when a book is clicked', async () => {
    const { getByText, getByPlaceholderText } = render(<SearchScreen />, { wrapper: createTestWrapper() });
    const input = getByPlaceholderText('Book title or author');
    fireEvent.changeText(input, 'Harry');

    await waitFor(() => {
      expect(getByText('Test Book')).toBeTruthy();
    });

    fireEvent.press(getByText('Test Book'));

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/book/123' })
    );
  });
});
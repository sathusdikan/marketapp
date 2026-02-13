import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, Grid3X3, List } from 'lucide-react-native';
import { router } from 'expo-router';
import ShopCard from '@/components/ShopCard';
import Colors from '@/constants/colors';
import { mockShops, mockProducts } from '@/mocks/data';

export default function ShopsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(false);

  const approvedShops = mockShops.filter(s => s.status === 'approved');
  
  const filteredShops = approvedShops.filter(shop =>
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductCount = (shopId: string) => 
    mockProducts.filter(p => p.shopId === shopId).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Explore Shops</Text>
        <Text style={styles.subtitle}>{filteredShops.length} shops available</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shops..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[styles.toggleBtn, !isGridView && styles.toggleBtnActive]}
          onPress={() => setIsGridView(false)}
        >
          <List size={18} color={!isGridView ? Colors.textInverse : Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, isGridView && styles.toggleBtnActive]}
          onPress={() => setIsGridView(true)}
        >
          <Grid3X3 size={18} color={isGridView ? Colors.textInverse : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredShops.map(shop => (
          <ShopCard
            key={shop.id}
            shop={shop}
            productCount={getProductCount(shop.id)}
            onPress={() => router.push(`/shop/${shop.id}`)}
          />
        ))}
        
        {filteredShops.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No shops found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 8,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

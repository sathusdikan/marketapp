import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star, ChevronRight, Package, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Shop } from '@/types';

interface ShopCardProps {
  shop: Shop;
  onPress: () => void;
  productCount?: number;
}

export default function ShopCard({ shop, onPress, productCount = 0 }: ShopCardProps) {
  const getShopImage = (shopName: string) => {
    if (shopName.toLowerCase().includes('electronic')) {
      return 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400';
    }
    if (shopName.toLowerCase().includes('grocer')) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
  };

  const rating = 4.5 + Math.random() * 0.4;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: getShopImage(shop.shopName) }} style={styles.image} />
        <View style={styles.ratingBadge}>
          <Star size={10} color={Colors.gold} fill={Colors.gold} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{shop.shopName}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.owner} numberOfLines={1}>{shop.ownerName}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={Colors.textLight} />
            <Text style={styles.metaText} numberOfLines={1}>
              {shop.address.split(',')[0]}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.statBadge}>
            <Package size={11} color={Colors.shopAccent} />
            <Text style={styles.statText}>{productCount} products</Text>
          </View>
          <View style={styles.statBadge}>
            <Clock size={11} color={Colors.success} />
            <Text style={styles.statText}>Open Now</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={Colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    transform: [{ translateX: -24 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  owner: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chevronContainer: {
    padding: 4,
  },
});

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onPress?: () => void;
}

export default function ProductCard({ product, onAddToCart, onPress }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{product.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {onAddToCart && (
            <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
              <Plus size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {product.stock <= 5 && (
        <View style={styles.lowStockBadge}>
          <Text style={styles.lowStockText}>Only {product.stock} left</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.surfaceSecondary,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    color: Colors.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
    lineHeight: 18,
  },
  description: {
    fontSize: 11,
    color: Colors.textLight,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});

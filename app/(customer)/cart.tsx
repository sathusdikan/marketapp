import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, Minus, Plus, Trash2, CreditCard, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { mockProducts, mockShops } from '@/mocks/data';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentCustomer } = useAuth();
  const customer = getCurrentCustomer();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[4], quantity: 2 },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getShopName = (shopId: string) => {
    return mockShops.find(s => s.id === shopId)?.shopName || 'Unknown Shop';
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  const canAfford = customer ? subtotal <= customer.creditAvailable : false;

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (!canAfford) {
      Alert.alert(
        'Insufficient Credit',
        'You don\'t have enough credit available for this purchase.',
        [{ text: 'OK' }]
      );
      return;
    }
    Alert.alert(
      'Order Placed!',
      `Your order of ${formatCurrency(subtotal)} has been placed successfully.`,
      [{ text: 'OK', onPress: () => setCartItems([]) }]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>My Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <ShoppingBag size={48} color={Colors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse shops to find products</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(customer)/shops')}
          >
            <Text style={styles.browseButtonText}>Browse Shops</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
      </View>

      {!canAfford && (
        <View style={styles.warningBanner}>
          <AlertCircle size={18} color={Colors.danger} />
          <Text style={styles.warningText}>
            Cart total exceeds your available credit of {formatCurrency(customer?.creditAvailable || 0)}
          </Text>
        </View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.map(item => (
          <View key={item.product.id} style={styles.cartItem}>
            <Image source={{ uri: item.product.imageUrl }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.shopName}>{getShopName(item.product.shopId)}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={styles.productPrice}>{formatCurrency(item.product.price)}</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.product.id, -1)}
              >
                <Minus size={16} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.product.id, 1)}
              >
                <Plus size={16} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.removeBtn}
              onPress={() => removeItem(item.product.id)}
            >
              <Trash2 size={18} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.checkoutContainer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.creditRow}>
          <CreditCard size={14} color={Colors.textSecondary} />
          <Text style={styles.creditText}>
            Available: {formatCurrency(customer?.creditAvailable || 0)}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutButton, !canAfford && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={!canAfford}
        >
          <LinearGradient
            colors={canAfford ? [Colors.primary, Colors.primaryLight] : [Colors.textLight, Colors.textLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutText}>Pay with Credit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  itemCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: Colors.danger,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 200,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSecondary,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  shopName: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  creditText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  checkoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});

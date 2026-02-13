import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { ShoppingCart, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Transaction } from '@/types';

interface TransactionCardProps {
  transaction: Transaction;
  showCustomer?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function TransactionCard({ 
  transaction, 
  showCustomer = false,
  onPress,
}: TransactionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.accent + '15' }]}>
            <ShoppingCart size={20} color={Colors.accent} />
          </View>
          <View style={styles.info}>
            <Text style={styles.id}>{transaction.id}</Text>
            <Text style={styles.date}>
              {new Date(transaction.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
            {transaction.status}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.amount}>{formatAmount(transaction.totalAmount)}</Text>
        <Text style={styles.shopName}>{transaction.shopName}</Text>
        {showCustomer && (
          <View style={styles.customerRow}>
            <User size={14} color={Colors.textSecondary} />
            <Text style={[styles.customerName, { marginLeft: 6 }]}>{transaction.customerName}</Text>
          </View>
        )}
      </View>

      <View style={styles.products}>
        {transaction.products.slice(0, 2).map((product, index) => (
          <Text key={index} style={styles.productText}>
            {product.quantity}x {product.productName}
          </Text>
        ))}
        {transaction.products.length > 2 && (
          <Text style={styles.moreText}>+{transaction.products.length - 2} more</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  id: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  customerName: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  products: {
    marginTop: 4,
  },
  productText: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  moreText: {
    fontSize: 12,
    color: Colors.accent,
    fontStyle: 'italic',
  },
});

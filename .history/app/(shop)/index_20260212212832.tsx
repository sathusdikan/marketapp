import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, TrendingUp, Package, ShoppingCart, Wallet, ArrowUpRight, Plus, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import TransactionCard from '@/components/TransactionCard';
import Colors from '@/constants/colors';
import { mockTransactions, mockProducts, mockShops } from '@/mocks/data';

export default function ShopDashboard() {
  const insets = useSafeAreaInsets();
  const { getCurrentShop } = useAuth();
  const shop = getCurrentShop() || mockShops[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shopTransactions = mockTransactions.filter(t => t.shopId === shop.id);
  const shopProducts = mockProducts.filter(p => p.shopId === shop.id);

  const totalSales = shopTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const todaySales = 12500;
  const salesGrowth = 15.2;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.shopAccent, '#FF8C42']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.shopName}>{shop.shopName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <View style={styles.earningsCard}>
            <LinearGradient
              colors={['#1E2433', '#2A3142']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsGradient}
            >
              <View style={styles.earningsPattern}>
                {[...Array(4)].map((_, i) => (
                  <View key={i} style={[styles.patternDot, { 
                    right: 20 + i * 25,
                    top: 20 + (i % 2) * 40,
                  }]} />
                ))}
              </View>
              
              <View style={styles.earningsHeader}>
                <View>
                  <Text style={styles.earningsLabel}>Total Earnings</Text>
                  <Text style={styles.earningsValue}>{formatCurrency(shop.totalEarnings)}</Text>
                </View>
                <View style={styles.growthBadge}>
                  <ArrowUpRight size={14} color={Colors.success} />
                  <Text style={styles.growthText}>+{salesGrowth}%</Text>
                </View>
              </View>
              
              <View style={styles.earningsDivider} />
              
              <View style={styles.earningsFooter}>
                <View style={styles.earningsItem}>
                  <View style={styles.earningsIconContainer}>
                    <Wallet size={16} color={Colors.warning} />
                  </View>
                  <View>
                    <Text style={styles.earningsItemLabel}>Pending</Text>
                    <Text style={styles.earningsItemValue}>{formatCurrency(shop.pendingBalance)}</Text>
                  </View>
                </View>
                <View style={styles.earningsItem}>
                  <View style={styles.earningsIconContainer}>
                    <TrendingUp size={16} color={Colors.accent} />
                  </View>
                  <View>
                    <Text style={styles.earningsItemLabel}>Today</Text>
                    <Text style={styles.earningsItemValue}>{formatCurrency(todaySales)}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Products"
              value={shopProducts.length.toString()}
              subtitle="Active listings"
              icon={Package}
              iconColor={Colors.customerAccent}
              iconBgColor={Colors.customerLight}
              trend={8}
            />
            <StatCard
              title="Orders"
              value={shopTransactions.length.toString()}
              subtitle="This month"
              icon={ShoppingCart}
              iconColor={Colors.shopAccent}
              iconBgColor={Colors.shopLight}
              trend={12}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.success + '15', Colors.success + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.successLight }]}>
                    <Plus size={22} color={Colors.success} />
                  </View>
                  <Text style={styles.actionText}>Add Product</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.warning + '15', Colors.warning + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.warningLight }]}>
                    <BarChart3 size={22} color={Colors.warning} />
                  </View>
                  <Text style={styles.actionText}>Analytics</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={[Colors.customerAccent + '15', Colors.customerAccent + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.customerLight }]}>
                    <Wallet size={22} color={Colors.customerAccent} />
                  </View>
                  <Text style={styles.actionText}>Settlements</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {shopTransactions.length > 0 ? (
              <View style={styles.ordersList}>
                {shopTransactions.slice(0, 5).map(txn => (
                  <TransactionCard 
                    key={txn.id} 
                    transaction={txn} 
                    showCustomer 
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <ShoppingCart size={32} color={Colors.textLight} />
                </View>
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptySubtitle}>Orders will appear here</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  shopName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textInverse,
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: -60,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  earningsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  earningsGradient: {
    padding: 24,
    overflow: 'hidden',
  },
  earningsPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
    fontWeight: '500',
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -1,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  earningsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  earningsFooter: {
    flexDirection: 'row',
    gap: 24,
  },
  earningsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  earningsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsItemLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
    fontWeight: '500',
  },
  earningsItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  seeAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.shopLight,
    borderRadius: 10,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.shopAccent,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  ordersList: {
    gap: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textLight,
  },
});

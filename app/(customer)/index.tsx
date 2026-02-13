import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ArrowRight, TrendingUp, Wallet, Sparkles, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CreditCard from '@/components/CreditCard';
import TransactionCard from '@/components/TransactionCard';
import ShopCard from '@/components/ShopCard';
import Colors from '@/constants/colors';
import { mockTransactions, mockShops, mockProducts } from '@/mocks/data';

export default function CustomerDashboard() {
  const insets = useSafeAreaInsets();
  const { getCurrentCustomer } = useAuth();
  const customer = getCurrentCustomer();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const recentTransactions = mockTransactions
    .filter(t => t.customerId === customer?.id)
    .slice(0, 3);

  const approvedShops = mockShops.filter(s => s.status === 'approved').slice(0, 2);

  const getProductCount = (shopId: string) => 
    mockProducts.filter(p => p.shopId === shopId).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!customer) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{customer.name.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={22} color={Colors.textInverse} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.cardContainer}>
            <CreditCard
              name={customer.name}
              employeeId={customer.employeeId}
              creditLimit={customer.creditLimit}
              creditUsed={customer.creditUsed}
              creditAvailable={customer.creditAvailable}
            />
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[Colors.accent + '20', Colors.accent + '10']}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <TrendingUp size={20} color={Colors.accent} />
                </View>
                <Text style={styles.quickActionValue}>{formatCurrency(customer.creditAvailable)}</Text>
                <Text style={styles.quickActionLabel}>Available</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[Colors.warning + '20', Colors.warning + '10']}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Wallet size={20} color={Colors.warning} />
                </View>
                <Text style={styles.quickActionValue}>{formatCurrency(customer.creditUsed)}</Text>
                <Text style={styles.quickActionLabel}>This Month</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.promoCard}>
            <LinearGradient
              colors={[Colors.customerAccent, Colors.customerAccent + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promoGradient}
            >
              <View style={styles.promoContent}>
                <View style={styles.promoIconContainer}>
                  <Sparkles size={24} color={Colors.textInverse} />
                </View>
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>Credit Limit Increase</Text>
                  <Text style={styles.promoSubtitle}>You're eligible for ₹10,000 more!</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Clock size={18} color={Colors.text} />
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
              </View>
              <TouchableOpacity 
                style={styles.seeAllBtn}
                onPress={() => router.push('/(customer)/transactions')}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={14} color={Colors.customerAccent} />
              </TouchableOpacity>
            </View>
            {recentTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {recentTransactions.map(txn => (
                  <TransactionCard key={txn.id} transaction={txn} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Clock size={32} color={Colors.textLight} />
                </View>
                <Text style={styles.emptyTitle}>No transactions yet</Text>
                <Text style={styles.emptySubtitle}>Start shopping at verified stores</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Shops</Text>
              <TouchableOpacity 
                style={styles.seeAllBtn}
                onPress={() => router.push('/(customer)/shops')}
              >
                <Text style={styles.seeAllText}>Browse All</Text>
                <ArrowRight size={14} color={Colors.customerAccent} />
              </TouchableOpacity>
            </View>
            {approvedShops.map(shop => (
              <ShopCard
                key={shop.id}
                shop={shop}
                productCount={getProductCount(shop.id)}
                onPress={() => router.push(`/shop/${shop.id}`)}
              />
            ))}
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
    paddingBottom: 60,
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
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textInverse,
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.danger,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
    marginTop: -50,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  cardContainer: {
    marginTop: 0,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  promoCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.customerAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  promoGradient: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  promoButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  promoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.customerAccent,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.customerLight,
    borderRadius: 10,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.customerAccent,
    fontWeight: '600',
  },
  transactionsList: {
    paddingHorizontal: 16,
  },
  emptyState: {
    marginHorizontal: 16,
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

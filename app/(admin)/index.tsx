import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Bell, Users, Store, ShoppingCart, IndianRupee, 
  TrendingUp, AlertCircle, CheckCircle2, Clock, Shield, ArrowRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import Colors from '@/constants/colors';
import { 
  mockCustomers, mockShops, mockTransactions, 
  mockMonthlyStatements, mockVerificationRequests 
} from '@/mocks/data';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const pendingVerifications = mockVerificationRequests.length;
  const totalCustomers = mockCustomers.length;
  const approvedCustomers = mockCustomers.filter(c => c.status === 'approved').length;
  const totalShops = mockShops.length;
  const approvedShops = mockShops.filter(s => s.status === 'approved').length;
  const totalTransactions = mockTransactions.length;
  
  const totalPendingPayments = mockMonthlyStatements
    .filter(s => s.paymentStatus === 'pending')
    .reduce((sum, s) => sum + s.totalDue, 0);

  const totalCollected = mockMonthlyStatements
    .filter(s => s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.paidAmount, 0);

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
        colors={[Colors.adminAccent, '#9F67FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <View>
            <View style={styles.adminBadge}>
              <Shield size={12} color={Colors.textInverse} />
              <Text style={styles.adminLabel}>ADMIN PANEL</Text>
            </View>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={22} color={Colors.textInverse} />
            {pendingVerifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingVerifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#1E2433', '#2A3142']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.overviewGradient}
            >
              <View style={styles.overviewPattern}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={[styles.patternCircle, { 
                    right: -20 + i * 30,
                    top: -20 + (i % 2) * 60,
                  }]} />
                ))}
              </View>
              
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Financial Overview</Text>
                <View style={styles.periodBadge}>
                  <Text style={styles.periodText}>This Month</Text>
                </View>
              </View>
              
              <View style={styles.overviewStats}>
                <View style={styles.overviewItem}>
                  <View style={styles.overviewIconContainer}>
                    <TrendingUp size={18} color={Colors.accent} />
                  </View>
                  <Text style={styles.overviewLabel}>Collected</Text>
                  <Text style={styles.overviewValue}>{formatCurrency(totalCollected)}</Text>
                </View>
                <View style={styles.overviewDivider} />
                <View style={styles.overviewItem}>
                  <View style={styles.overviewIconContainer}>
                    <Clock size={18} color={Colors.warning} />
                  </View>
                  <Text style={styles.overviewLabel}>Pending</Text>
                  <Text style={[styles.overviewValue, { color: Colors.warning }]}>
                    {formatCurrency(totalPendingPayments)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {pendingVerifications > 0 && (
            <TouchableOpacity 
              style={styles.alertCard}
              onPress={() => router.push('/(admin)/verifications')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.warningLight, Colors.warning + '10']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.alertGradient}
              >
                <View style={styles.alertIconContainer}>
                  <AlertCircle size={24} color={Colors.warning} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Pending Verifications</Text>
                  <Text style={styles.alertSubtitle}>{pendingVerifications} requests awaiting review</Text>
                </View>
                <View style={styles.alertBadge}>
                  <Text style={styles.alertBadgeText}>{pendingVerifications}</Text>
                </View>
                <ArrowRight size={18} color={Colors.warning} />
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.statsGrid}>
            <StatCard
              title="Customers"
              value={totalCustomers.toString()}
              subtitle={`${approvedCustomers} verified`}
              icon={Users}
              iconColor={Colors.customerAccent}
              iconBgColor={Colors.customerLight}
              onPress={() => router.push('/(admin)/users')}
            />
            <StatCard
              title="Shops"
              value={totalShops.toString()}
              subtitle={`${approvedShops} verified`}
              icon={Store}
              iconColor={Colors.shopAccent}
              iconBgColor={Colors.shopLight}
              onPress={() => router.push('/(admin)/users')}
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Transactions"
              value={totalTransactions.toString()}
              subtitle="This month"
              icon={ShoppingCart}
              iconColor={Colors.primary}
              iconBgColor={Colors.surfaceSecondary}
              trend={18}
            />
            <StatCard
              title="Revenue"
              value={formatCurrency(totalCollected)}
              subtitle="Collected"
              icon={TrendingUp}
              iconColor={Colors.success}
              iconBgColor={Colors.successLight}
              trend={12}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/(admin)/verifications')}
              >
                <LinearGradient
                  colors={[Colors.warning + '15', Colors.warning + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.warningLight }]}>
                    <Clock size={22} color={Colors.warning} />
                  </View>
                  <Text style={styles.actionText}>Review</Text>
                  <Text style={styles.actionSubtext}>Pending</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/(admin)/settlements')}
              >
                <LinearGradient
                  colors={[Colors.success + '15', Colors.success + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.successLight }]}>
                    <IndianRupee size={22} color={Colors.success} />
                  </View>
                  <Text style={styles.actionText}>Process</Text>
                  <Text style={styles.actionSubtext}>Settlements</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/(admin)/users')}
              >
                <LinearGradient
                  colors={[Colors.adminAccent + '15', Colors.adminAccent + '05']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.adminLight }]}>
                    <Users size={22} color={Colors.adminAccent} />
                  </View>
                  <Text style={styles.actionText}>Manage</Text>
                  <Text style={styles.actionSubtext}>Users</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.statusText}>Payment Gateway</Text>
                </View>
                <View style={styles.statusBadge}>
                  <CheckCircle2 size={14} color={Colors.success} />
                  <Text style={styles.statusValue}>Active</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.statusText}>Credit System</Text>
                </View>
                <View style={styles.statusBadge}>
                  <CheckCircle2 size={14} color={Colors.success} />
                  <Text style={styles.statusValue}>Active</Text>
                </View>
              </View>
              <View style={[styles.statusRow, { borderBottomWidth: 0 }]}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                  <Text style={styles.statusText}>Document Verification</Text>
                </View>
                <View style={styles.statusBadge}>
                  <CheckCircle2 size={14} color={Colors.success} />
                  <Text style={styles.statusValue}>Active</Text>
                </View>
              </View>
            </View>
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  adminLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.adminAccent,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  scrollView: {
    flex: 1,
    marginTop: -60,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  overviewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  overviewGradient: {
    padding: 24,
    overflow: 'hidden',
  },
  overviewPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  periodBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  overviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewDivider: {
    width: 1,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  overviewLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.accent,
  },
  alertCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  alertGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
    borderRadius: 18,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  alertBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  alertBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
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
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
});

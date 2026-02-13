import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IndianRupee, Calendar, CheckCircle, Clock, Store, User, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { mockMonthlyStatements, mockShopSettlements } from '@/mocks/data';

export default function SettlementsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'customers' | 'shops'>('customers');

  const pendingCustomerPayments = mockMonthlyStatements.filter(s => s.paymentStatus === 'pending');
  const pendingShopSettlements = mockShopSettlements.filter(s => s.status === 'pending');

  const totalPendingFromCustomers = pendingCustomerPayments.reduce((sum, s) => sum + s.totalDue, 0);
  const totalPendingToShops = pendingShopSettlements.reduce((sum, s) => sum + s.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const handleMarkPaid = (customerName: string) => {
    Alert.alert(
      'Mark as Paid',
      `Confirm payment received from ${customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Success', 'Payment marked as received.') },
      ]
    );
  };

  const handleSettleShop = (shopName: string) => {
    Alert.alert(
      'Process Settlement',
      `Process settlement for ${shopName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Process', onPress: () => Alert.alert('Success', 'Settlement processed successfully.') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Settlements</Text>
      </View>

      <LinearGradient
        colors={[Colors.success, '#34D399']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>To Collect</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPendingFromCustomers)}</Text>
            <Text style={styles.summarySubtext}>from customers</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>To Pay</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPendingToShops)}</Text>
            <Text style={styles.summarySubtext}>to shops</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'customers' && styles.tabActive]}
          onPress={() => setActiveTab('customers')}
        >
          <User size={16} color={activeTab === 'customers' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'customers' && styles.tabTextActive]}>
            Customers ({pendingCustomerPayments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shops' && styles.tabActive]}
          onPress={() => setActiveTab('shops')}
        >
          <Store size={16} color={activeTab === 'shops' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'shops' && styles.tabTextActive]}>
            Shops ({pendingShopSettlements.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'customers' ? (
          pendingCustomerPayments.length > 0 ? (
            pendingCustomerPayments.map(statement => (
              <View key={statement.id} style={styles.settlementCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarText}>
                        {statement.customerName.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{statement.customerName}</Text>
                      <View style={styles.monthBadge}>
                        <Calendar size={12} color={Colors.textSecondary} />
                        <Text style={styles.monthText}>{formatMonth(statement.month)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <Clock size={14} color={Colors.warning} />
                    <Text style={styles.statusPending}>Pending</Text>
                  </View>
                </View>

                <View style={styles.amountRow}>
                  <View>
                    <Text style={styles.amountLabel}>Amount Due</Text>
                    <Text style={styles.amountValue}>{formatCurrency(statement.totalDue)}</Text>
                  </View>
                  <View>
                    <Text style={styles.amountLabel}>Due Date</Text>
                    <Text style={styles.dueDateValue}>
                      {new Date(statement.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleMarkPaid(statement.customerName)}
                >
                  <Text style={styles.actionBtnText}>Mark as Paid</Text>
                  <ArrowRight size={16} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color={Colors.success} />
              <Text style={styles.emptyTitle}>All payments collected!</Text>
              <Text style={styles.emptySubtitle}>No pending customer payments</Text>
            </View>
          )
        ) : (
          pendingShopSettlements.length > 0 ? (
            pendingShopSettlements.map(settlement => (
              <View key={settlement.id} style={styles.settlementCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <View style={[styles.avatarSmall, { backgroundColor: Colors.shopAccent }]}>
                      <Store size={16} color={Colors.textInverse} />
                    </View>
                    <View>
                      <Text style={styles.userName}>{settlement.shopName}</Text>
                      <View style={styles.monthBadge}>
                        <Calendar size={12} color={Colors.textSecondary} />
                        <Text style={styles.monthText}>{formatMonth(settlement.month)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <Clock size={14} color={Colors.warning} />
                    <Text style={styles.statusPending}>Pending</Text>
                  </View>
                </View>

                <View style={styles.amountRow}>
                  <View>
                    <Text style={styles.amountLabel}>Settlement Amount</Text>
                    <Text style={styles.amountValue}>{formatCurrency(settlement.amount)}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: Colors.shopAccent }]}
                  onPress={() => handleSettleShop(settlement.shopName)}
                >
                  <Text style={styles.actionBtnText}>Process Settlement</Text>
                  <ArrowRight size={16} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color={Colors.success} />
              <Text style={styles.emptyTitle}>All shops settled!</Text>
              <Text style={styles.emptySubtitle}>No pending shop settlements</Text>
            </View>
          )
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
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  summarySubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSecondary,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.adminAccent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textInverse,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  settlementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.customerAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusPending: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  amountLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  dueDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

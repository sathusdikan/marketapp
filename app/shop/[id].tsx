import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Download, TrendingUp, IndianRupee } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import TransactionCard from '@/components/TransactionCard';
import Colors from '@/constants/colors';
import { mockTransactions, mockShopSettlements, mockShops } from '@/mocks/data';

export default function SalesScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentShop } = useAuth();
  const shop = getCurrentShop() || mockShops[0];
  const [activeTab, setActiveTab] = useState<'orders' | 'settlements'>('orders');

  const shopTransactions = mockTransactions.filter(t => t.shopId === shop.id);
  const shopSettlements = mockShopSettlements.filter(s => s.shopId === shop.id);

  const totalSales = shopTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

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
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Sales</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Download size={20} color={Colors.shopAccent} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <TrendingUp size={20} color={Colors.success} />
            <View>
              <Text style={styles.summaryLabel}>Total Sales</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalSales)}</Text>
            </View>
          </View>
          <View style={styles.summaryItem}>
            <IndianRupee size={20} color={Colors.warning} />
            <View>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>{formatCurrency(shop.pendingBalance)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders ({shopTransactions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settlements' && styles.tabActive]}
          onPress={() => setActiveTab('settlements')}
        >
          <Text style={[styles.tabText, activeTab === 'settlements' && styles.tabTextActive]}>
            Settlements ({shopSettlements.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'orders' ? (
          shopTransactions.length > 0 ? (
            shopTransactions.map(txn => (
              <TransactionCard key={txn.id} transaction={txn} showCustomer />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>Customer orders will appear here</Text>
            </View>
          )
        ) : (
          shopSettlements.length > 0 ? (
            shopSettlements.map(settlement => (
              <View key={settlement.id} style={styles.settlementCard}>
                <View style={styles.settlementHeader}>
                  <View style={styles.monthContainer}>
                    <Calendar size={16} color={Colors.shopAccent} />
                    <Text style={styles.monthText}>{formatMonth(settlement.month)}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: settlement.status === 'settled' ? Colors.successLight : Colors.warningLight }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: settlement.status === 'settled' ? Colors.success : Colors.warning }
                    ]}>
                      {settlement.status === 'settled' ? 'Settled' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <View style={styles.settlementBody}>
                  <View style={styles.settlementRow}>
                    <Text style={styles.settlementLabel}>Amount</Text>
                    <Text style={styles.settlementValue}>{formatCurrency(settlement.amount)}</Text>
                  </View>
                  {settlement.settledAt && (
                    <View style={styles.settlementRow}>
                      <Text style={styles.settlementLabel}>Settled On</Text>
                      <Text style={styles.settlementValue}>
                        {new Date(settlement.settledAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No settlements yet</Text>
              <Text style={styles.emptySubtitle}>Monthly settlements will appear here</Text>
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
  exportBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.shopAccent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    padding: 16,
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.shopAccent,
  },
  tabText: {
    fontSize: 14,
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
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settlementBody: {
    gap: 8,
  },
  settlementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  settlementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
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

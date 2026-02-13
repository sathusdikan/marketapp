import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Filter } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import TransactionCard from '@/components/TransactionCard';
import Colors from '@/constants/colors';
import { mockTransactions, mockMonthlyStatements } from '@/mocks/data';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentCustomer } = useAuth();
  const customer = getCurrentCustomer();
  const [activeTab, setActiveTab] = useState<'transactions' | 'statements'>('transactions');

  const customerTransactions = mockTransactions.filter(
    t => t.customerId === customer?.id
  );

  const customerStatements = mockMonthlyStatements.filter(
    s => s.customerId === customer?.id
  );

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
        <Text style={styles.title}>History</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.tabActive]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.tabTextActive]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'statements' && styles.tabActive]}
          onPress={() => setActiveTab('statements')}
        >
          <Text style={[styles.tabText, activeTab === 'statements' && styles.tabTextActive]}>
            Statements
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'transactions' ? (
          customerTransactions.length > 0 ? (
            customerTransactions.map(txn => (
              <TransactionCard key={txn.id} transaction={txn} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>Your purchases will appear here</Text>
            </View>
          )
        ) : (
          customerStatements.length > 0 ? (
            customerStatements.map(stmt => (
              <View key={stmt.id} style={styles.statementCard}>
                <View style={styles.statementHeader}>
                  <View style={styles.monthContainer}>
                    <Calendar size={16} color={Colors.primary} />
                    <Text style={styles.monthText}>{formatMonth(stmt.month)}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: stmt.paymentStatus === 'paid' ? Colors.successLight : Colors.warningLight }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: stmt.paymentStatus === 'paid' ? Colors.success : Colors.warning }
                    ]}>
                      {stmt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <View style={styles.statementBody}>
                  <View style={styles.statementRow}>
                    <Text style={styles.statementLabel}>Total Due</Text>
                    <Text style={styles.statementValue}>{formatCurrency(stmt.totalDue)}</Text>
                  </View>
                  <View style={styles.statementRow}>
                    <Text style={styles.statementLabel}>Paid Amount</Text>
                    <Text style={styles.statementValue}>{formatCurrency(stmt.paidAmount)}</Text>
                  </View>
                  <View style={styles.statementRow}>
                    <Text style={styles.statementLabel}>Due Date</Text>
                    <Text style={styles.statementValue}>
                      {new Date(stmt.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                {stmt.paymentStatus !== 'paid' && (
                  <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No statements yet</Text>
              <Text style={styles.emptySubtitle}>Monthly statements will appear here</Text>
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
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.primary,
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
  statementCard: {
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
  statementHeader: {
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
  statementBody: {
    gap: 8,
  },
  statementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statementLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  payButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

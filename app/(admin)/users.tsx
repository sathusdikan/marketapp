import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, User, Store, CheckCircle2, Clock, XCircle, ChevronRight, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { mockCustomers, mockShops } from '@/mocks/data';

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'customers' | 'shops'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShops = mockShops.filter(s =>
    s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={14} color={Colors.success} />;
      case 'pending':
        return <Clock size={14} color={Colors.warning} />;
      case 'rejected':
        return <XCircle size={14} color={Colors.danger} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.success;
      case 'pending': return Colors.warning;
      case 'rejected': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Users</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'customers' && styles.tabActive]}
          onPress={() => setActiveTab('customers')}
        >
          <User size={16} color={activeTab === 'customers' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'customers' && styles.tabTextActive]}>
            Customers ({mockCustomers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shops' && styles.tabActive]}
          onPress={() => setActiveTab('shops')}
        >
          <Store size={16} color={activeTab === 'shops' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'shops' && styles.tabTextActive]}>
            Shops ({mockShops.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'customers' ? (
          filteredCustomers.map(customer => (
            <TouchableOpacity key={customer.id} style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: Colors.customerAccent }]}>
                  <Text style={styles.avatarText}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{customer.name}</Text>
                <Text style={styles.userSubtitle}>{customer.employeeId}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.statusBadge}>
                    {getStatusIcon(customer.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(customer.status) }]}>
                      {customer.status}
                    </Text>
                  </View>
                  <Text style={styles.creditText}>
                    Credit: {formatCurrency(customer.creditLimit)}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))
        ) : (
          filteredShops.map(shop => (
            <TouchableOpacity key={shop.id} style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: Colors.shopAccent, borderRadius: 14 }]}>
                  <Store size={20} color={Colors.textInverse} />
                </View>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{shop.shopName}</Text>
                <Text style={styles.userSubtitle}>{shop.ownerName}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.statusBadge}>
                    {getStatusIcon(shop.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(shop.status) }]}>
                      {shop.status}
                    </Text>
                  </View>
                  <Text style={styles.creditText}>
                    Earnings: {formatCurrency(shop.totalEarnings)}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))
        )}

        {((activeTab === 'customers' && filteredCustomers.length === 0) ||
          (activeTab === 'shops' && filteredShops.length === 0)) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
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
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  userSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  creditText: {
    fontSize: 12,
    color: Colors.textLight,
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

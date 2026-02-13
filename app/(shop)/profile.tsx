import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Store, Phone, MapPin, FileText, Hash, 
  ChevronRight, LogOut, Settings, HelpCircle, CheckCircle2 
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { mockShops } from '@/mocks/data';

export default function ShopProfileScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentShop, logout } = useAuth();
  const shop = getCurrentShop() || mockShops[0];

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

  const menuItems = [
    { icon: Settings, label: 'Shop Settings', onPress: () => {} },
    { icon: FileText, label: 'Documents', onPress: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Shop Profile</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.shopIconContainer}>
            <View style={styles.shopIcon}>
              <Store size={36} color={Colors.textInverse} />
            </View>
            {shop.status === 'approved' && (
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={14} color={Colors.textInverse} fill={Colors.success} />
              </View>
            )}
          </View>
          <Text style={styles.shopName}>{shop.shopName}</Text>
          <Text style={styles.ownerName}>{shop.ownerName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {shop.status === 'approved' ? 'Verified Merchant' : 'Pending Verification'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Summary</Text>
          <View style={styles.earningsCard}>
            <View style={styles.earningsRow}>
              <View style={styles.earningsItem}>
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsValue}>{formatCurrency(shop.totalEarnings)}</Text>
              </View>
              <View style={styles.earningsItem}>
                <Text style={styles.earningsLabel}>Pending</Text>
                <Text style={[styles.earningsValue, { color: Colors.warning }]}>
                  {formatCurrency(shop.pendingBalance)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Hash size={18} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>License Number</Text>
                <Text style={styles.detailValue}>{shop.licenseNumber}</Text>
              </View>
            </View>
            {shop.gst && (
              <View style={styles.detailRow}>
                <FileText size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>GST Number</Text>
                  <Text style={styles.detailValue}>{shop.gst}</Text>
                </View>
              </View>
            )}
            <View style={styles.detailRow}>
              <Phone size={18} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{shop.phone}</Text>
              </View>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <MapPin size={18} color={Colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{shop.address}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.menuItem,
                    index === menuItems.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={item.onPress}
                >
                  <Icon size={20} color={Colors.textSecondary} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={18} color={Colors.textLight} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  shopIconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  shopIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.shopAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  shopName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.successLight,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  earningsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.dangerLight,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger,
  },
});

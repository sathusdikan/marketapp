import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  User, Mail, Phone, MapPin, Briefcase, Building2, 
  FileText, CreditCard, ChevronRight, LogOut, Settings, 
  HelpCircle, Shield, Bell, Wallet
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentCustomer, logout } = useAuth();
  const customer = getCurrentCustomer();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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

  if (!customer) return null;

  const menuItems = [
    { icon: Bell, label: 'Notifications', subtitle: '3 new', onPress: () => {} },
    { icon: Settings, label: 'Account Settings', subtitle: 'Privacy, Security', onPress: () => {} },
    { icon: FileText, label: 'Documents', subtitle: 'ID Cards, Certificates', onPress: () => {} },
    { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQ, Contact Us', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.customerAccent, Colors.customerAccent + 'CC']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[Colors.customerAccent, Colors.customerAccent + '80']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color={Colors.textInverse} />
                </View>
              </View>
              <Text style={styles.name}>{customer.name}</Text>
              <Text style={styles.employeeId}>{customer.employeeId}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Verified Employee</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credit Overview</Text>
            <View style={styles.creditCard}>
              <LinearGradient
                colors={['#1E2433', '#2A3142']}
                style={styles.creditGradient}
              >
                <View style={styles.creditRow}>
                  <View style={styles.creditItem}>
                    <View style={[styles.creditIcon, { backgroundColor: Colors.success + '20' }]}>
                      <Wallet size={18} color={Colors.success} />
                    </View>
                    <View>
                      <Text style={styles.creditLabel}>Available</Text>
                      <Text style={[styles.creditValue, { color: Colors.accent }]}>
                        {formatCurrency(customer.creditAvailable)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.creditDivider} />
                  <View style={styles.creditItem}>
                    <View style={[styles.creditIcon, { backgroundColor: Colors.warning + '20' }]}>
                      <CreditCard size={18} color={Colors.warning} />
                    </View>
                    <View>
                      <Text style={styles.creditLabel}>Used</Text>
                      <Text style={[styles.creditValue, { color: Colors.warning }]}>
                        {formatCurrency(customer.creditUsed)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.limitSection}>
                  <Text style={styles.limitLabel}>Total Credit Limit</Text>
                  <Text style={styles.limitValue}>{formatCurrency(customer.creditLimit)}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.customerLight }]}>
                  <Mail size={16} color={Colors.customerAccent} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{customer.email}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.successLight }]}>
                  <Phone size={16} color={Colors.success} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{customer.phone}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.adminLight }]}>
                  <Building2 size={16} color={Colors.adminAccent} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Department</Text>
                  <Text style={styles.detailValue}>{customer.department}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.shopLight }]}>
                  <Briefcase size={16} color={Colors.shopAccent} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Salary</Text>
                  <Text style={styles.detailValue}>{formatCurrency(customer.salary)}/month</Text>
                </View>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.detailIcon, { backgroundColor: Colors.warningLight }]}>
                  <MapPin size={16} color={Colors.warning} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>{customer.address}</Text>
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
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: Colors.surfaceSecondary }]}>
                      <Icon size={18} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                    <ChevronRight size={18} color={Colors.textLight} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <View style={styles.logoutIcon}>
              <LogOut size={20} color={Colors.danger} />
            </View>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textInverse,
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
    marginTop: -40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 14,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 14,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  creditCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  creditGradient: {
    padding: 20,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  creditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  creditIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
    fontWeight: '500',
  },
  creditValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  creditDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  limitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  limitLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  limitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.dangerLight,
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.danger + '20',
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.danger,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: Colors.textLight,
  },
});

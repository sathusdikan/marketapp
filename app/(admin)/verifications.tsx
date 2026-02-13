import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Store, CheckCircle, XCircle, FileText, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockVerificationRequests, mockCustomers, mockShops } from '@/mocks/data';

export default function VerificationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [requests, setRequests] = useState(mockVerificationRequests);

  const pendingRequests = requests;
  const completedRequests: typeof mockVerificationRequests = [];

  const handleApprove = (id: string, name: string) => {
    Alert.alert(
      'Approve Verification',
      `Approve ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== id));
            Alert.alert('Success', `${name} has been approved.`);
          }
        },
      ]
    );
  };

  const handleReject = (id: string, name: string) => {
    Alert.alert(
      'Reject Verification',
      `Reject ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== id));
            Alert.alert('Rejected', `${name} has been rejected.`);
          }
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Verifications</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pendingRequests.length} pending</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Clock size={16} color={activeTab === 'pending' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <CheckCircle size={16} color={activeTab === 'completed' ? Colors.textInverse : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'pending' ? (
          pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={[
                    styles.typeIcon,
                    { backgroundColor: request.type === 'customer' ? Colors.customerAccent + '20' : Colors.shopAccent + '20' }
                  ]}>
                    {request.type === 'customer' ? (
                      <User size={20} color={Colors.customerAccent} />
                    ) : (
                      <Store size={20} color={Colors.shopAccent} />
                    )}
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{request.name}</Text>
                    <Text style={styles.requestType}>
                      {request.type === 'customer' ? 'Customer Verification' : 'Shop Verification'}
                    </Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{formatDate(request.submittedAt)}</Text>
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  {Object.entries(request.details).map(([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{key}</Text>
                      <Text style={styles.detailValue}>{value}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.documentBtn}>
                  <FileText size={16} color={Colors.primary} />
                  <Text style={styles.documentBtnText}>View Documents</Text>
                </TouchableOpacity>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.rejectBtn}
                    onPress={() => handleReject(request.id, request.name)}
                  >
                    <XCircle size={18} color={Colors.danger} />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.approveBtn}
                    onPress={() => handleApprove(request.id, request.name)}
                  >
                    <CheckCircle size={18} color={Colors.textInverse} />
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color={Colors.success} />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>No pending verifications</Text>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No completed verifications</Text>
            <Text style={styles.emptySubtitle}>Completed verifications will appear here</Text>
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
  countBadge: {
    backgroundColor: Colors.adminAccent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.adminAccent,
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
  requestCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  requestName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  requestType: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  documentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    marginBottom: 12,
  },
  documentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.dangerLight,
    borderRadius: 10,
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.success,
    borderRadius: 10,
  },
  approveBtnText: {
    fontSize: 14,
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

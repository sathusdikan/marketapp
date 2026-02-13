import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wifi, CreditCard as CreditCardIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import Colors from '@/constants/colors';

interface CreditCardProps {
  name: string;
  employeeId: string;
  creditLimit: number;
  creditUsed: number;
  creditAvailable: number;
}

export default function CreditCard({ 
  name, 
  employeeId, 
  creditLimit, 
  creditUsed, 
  creditAvailable 
}: CreditCardProps) {
  const usagePercent = (creditUsed / creditLimit) * 100;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#1E2433', '#2A3142', '#1E2433']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Animated.View 
          style={[
            styles.shimmer,
            { opacity: shimmerOpacity }
          ]} 
        />
        
        <View style={styles.cardPattern}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.patternCircle, { 
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 2) * 60}%`,
              opacity: 0.03 + (i * 0.01),
            }]} />
          ))}
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <CreditCardIcon size={18} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.brandText}>GovCredit</Text>
              <Text style={styles.brandSubtext}>PREMIUM</Text>
            </View>
          </View>
          <View style={styles.contactlessIcon}>
            <Wifi size={20} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
        </View>

        <View style={styles.chipSection}>
          <View style={styles.chip}>
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
          </View>
        </View>

        <View style={styles.cardMiddle}>
          <Text style={styles.employeeId}>{employeeId}</Text>
          <Text style={styles.name}>{name.toUpperCase()}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.creditStats}>
            <View style={styles.creditStatItem}>
              <Text style={styles.creditStatLabel}>AVAILABLE</Text>
              <Text style={styles.creditStatValue}>{formatCurrency(creditAvailable)}</Text>
            </View>
            <View style={styles.creditStatDivider} />
            <View style={styles.creditStatItem}>
              <Text style={styles.creditStatLabel}>USED</Text>
              <Text style={[styles.creditStatValue, styles.usedValue]}>{formatCurrency(creditUsed)}</Text>
            </View>
            <View style={styles.creditStatDivider} />
            <View style={styles.creditStatItem}>
              <Text style={styles.creditStatLabel}>LIMIT</Text>
              <Text style={styles.creditStatValue}>{formatCurrency(creditLimit)}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Credit Utilization</Text>
              <Text style={styles.progressPercent}>{usagePercent.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={usagePercent > 80 ? [Colors.danger, Colors.dangerDark] : [Colors.accent, Colors.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.min(usagePercent, 100)}%` }]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    minHeight: 220,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 201, 167, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 201, 167, 0.3)',
  },
  brandText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandSubtext: {
    color: Colors.accent,
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 3,
  },
  contactlessIcon: {
    padding: 4,
  },
  chipSection: {
    marginBottom: 16,
  },
  chip: {
    width: 50,
    height: 38,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 6,
    justifyContent: 'space-between',
  },
  chipLine: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 2,
  },
  cardMiddle: {
    marginBottom: 20,
  },
  employeeId: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 4,
    fontWeight: '500',
  },
  name: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardFooter: {
    gap: 16,
  },
  creditStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  creditStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  creditStatLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '600',
  },
  creditStatValue: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  usedValue: {
    color: Colors.warning,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  progressPercent: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

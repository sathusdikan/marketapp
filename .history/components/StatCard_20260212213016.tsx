import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: number;
  onPress?: () => void;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  iconColor = Colors.accent,
  iconBgColor = Colors.accent + '15',
  trend,
  onPress,
}: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
        {trend !== undefined && (
          <View style={[
            styles.trendBadge, 
            { backgroundColor: isPositiveTrend ? Colors.successLight : Colors.dangerLight }
          ]}>
            {isPositiveTrend ? (
              <TrendingUp size={10} color={Colors.success} />
            ) : (
              <TrendingDown size={10} color={Colors.danger} />
            )}
            <Text style={[
              styles.trendText,
              { color: isPositiveTrend ? Colors.success : Colors.danger }
            ]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
});

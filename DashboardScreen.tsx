import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch from API
      // Simulated data
      setStats({
        totalClicks: 1250,
        totalConversions: 45,
        conversionRate: 3.6,
        totalEarnings: 1350.75,
        pendingEarnings: 250.5,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>مرحباً بك! 👋</Text>
        <Text style={styles.welcomeSubtitle}>إليك ملخص أدائك اليوم</Text>
      </View>

      {/* Main Stats */}
      {stats && (
        <>
          {/* Earnings Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>إجمالي الأرباح</Text>
              <Text style={styles.cardEmoji}>💰</Text>
            </View>
            <Text style={styles.earnings}>${stats.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.earningsSubtitle}>
              بانتظار السحب: ${stats.pendingEarnings.toFixed(2)}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Clicks */}
            <View style={[styles.statCard, { backgroundColor: '#1e3a8a' }]}>
              <Text style={styles.statEmoji}>👆</Text>
              <Text style={styles.statValue}>{stats.totalClicks}</Text>
              <Text style={styles.statLabel}>النقرات</Text>
            </View>

            {/* Conversions */}
            <View style={[styles.statCard, { backgroundColor: '#15803d' }]}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{stats.totalConversions}</Text>
              <Text style={styles.statLabel}>التحويلات</Text>
            </View>

            {/* Conversion Rate */}
            <View style={[styles.statCard, { backgroundColor: '#7c3aed' }]}>
              <Text style={styles.statEmoji}>📊</Text>
              <Text style={styles.statValue}>{stats.conversionRate.toFixed(2)}%</Text>
              <Text style={styles.statLabel}>معدل التحويل</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
            <View style={styles.actionButtons}>
              <View style={[styles.actionButton, { backgroundColor: '#14b8a6' }]}>
                <Text style={styles.actionEmoji}>🔗</Text>
                <Text style={styles.actionText}>إنشاء رابط</Text>
              </View>
              <View style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.actionEmoji}>💵</Text>
                <Text style={styles.actionText}>طلب سحب</Text>
              </View>
              <View style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}>
                <Text style={styles.actionEmoji}>📈</Text>
                <Text style={styles.actionText}>الإحصائيات</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>النشاط الأخير</Text>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>{i % 2 === 0 ? '✅' : '👆'}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {i % 2 === 0 ? 'تحويل جديد' : 'نقرة جديدة'}
                  </Text>
                  <Text style={styles.activityTime}>قبل {i} ساعات</Text>
                </View>
                <Text style={styles.activityAmount}>
                  {i % 2 === 0 ? '+$50' : '-'}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  welcomeSection: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  card: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardEmoji: {
    fontSize: 24,
  },
  earnings: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginBottom: 8,
  },
  earningsSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
});


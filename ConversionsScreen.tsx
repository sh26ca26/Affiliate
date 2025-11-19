import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

interface Conversion {
  id: number;
  orderId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  date: string;
}

export default function ConversionsScreen() {
  const [conversions, setConversions] = useState<Conversion[]>([
    {
      id: 1,
      orderId: 'ORD-001',
      amount: 150.0,
      status: 'approved',
      date: '2024-01-20',
    },
    {
      id: 2,
      orderId: 'ORD-002',
      amount: 75.5,
      status: 'pending',
      date: '2024-01-19',
    },
    {
      id: 3,
      orderId: 'ORD-003',
      amount: 200.0,
      status: 'approved',
      date: '2024-01-18',
    },
    {
      id: 4,
      orderId: 'ORD-004',
      amount: 50.0,
      status: 'rejected',
      date: '2024-01-17',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#15803d';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#dc2626';
      case 'refunded':
        return '#6366f1';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'موافق عليه';
      case 'pending':
        return 'قيد الانتظار';
      case 'rejected':
        return 'مرفوض';
      case 'refunded':
        return 'مسترجع';
      default:
        return status;
    }
  };

  const filteredConversions = conversions.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const totalApproved = conversions
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPending = conversions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  const renderConversion = ({ item }: { item: Conversion }) => (
    <View style={styles.conversionCard}>
      <View style={styles.conversionHeader}>
        <View>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.conversionFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryScroll}
        contentContainerStyle={styles.summaryContent}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>إجمالي التحويلات</Text>
          <Text style={styles.summaryValue}>{conversions.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>الموافق عليه</Text>
          <Text style={[styles.summaryValue, { color: '#15803d' }]}>
            ${totalApproved.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>قيد الانتظار</Text>
          <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>
            ${totalPending.toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <View
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onTouchEnd={() => setFilter(f as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === 'all'
                ? 'الكل'
                : f === 'pending'
                ? 'قيد الانتظار'
                : f === 'approved'
                ? 'موافق عليه'
                : 'مرفوض'}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Conversions List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      ) : filteredConversions.length > 0 ? (
        <FlatList
          data={filteredConversions}
          renderItem={renderConversion}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>لا توجد تحويلات</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  summaryScroll: {
    paddingVertical: 10,
  },
  summaryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    minWidth: 140,
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterButtonActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  filterText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  conversionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  conversionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  conversionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
  },
});


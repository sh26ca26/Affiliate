import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

interface Payout {
  id: number;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  processedDate?: string;
}

export default function PayoutsScreen() {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: 1,
      amount: 500.0,
      method: 'bank_transfer',
      status: 'completed',
      requestDate: '2024-01-15',
      processedDate: '2024-01-17',
    },
    {
      id: 2,
      amount: 250.0,
      method: 'paypal',
      status: 'processing',
      requestDate: '2024-01-18',
    },
    {
      id: 3,
      amount: 150.0,
      method: 'stripe',
      status: 'pending',
      requestDate: '2024-01-20',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  const availableBalance = 1250.75;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#15803d';
      case 'processing':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'processing':
        return 'قيد المعالجة';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فشل';
      default:
        return status;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      default:
        return method;
    }
  };

  const handleRequestPayout = () => {
    if (!requestAmount) {
      Alert.alert('خطأ', 'يرجى إدخال المبلغ');
      return;
    }

    const amount = parseFloat(requestAmount);
    if (amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    if (amount > availableBalance) {
      Alert.alert('خطأ', 'المبلغ يتجاوز الرصيد المتاح');
      return;
    }

    Alert.alert('نجح', `تم طلب سحب ${amount.toFixed(2)} بنجاح`);
    setShowRequestModal(false);
    setRequestAmount('');
  };

  const renderPayout = ({ item }: { item: Payout }) => (
    <View style={styles.payoutCard}>
      <View style={styles.payoutHeader}>
        <View>
          <Text style={styles.payoutAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.payoutMethod}>{getMethodLabel(item.method)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <View style={styles.payoutFooter}>
        <Text style={styles.payoutDate}>طلب: {item.requestDate}</Text>
        {item.processedDate && (
          <Text style={styles.payoutDate}>معالج: {item.processedDate}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>الرصيد المتاح للسحب</Text>
        <Text style={styles.balanceAmount}>${availableBalance.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => setShowRequestModal(true)}
        >
          <Text style={styles.requestButtonText}>طلب سحب</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>إجمالي المسحوب</Text>
          <Text style={styles.summaryValue}>$500.00</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>قيد المعالجة</Text>
          <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>
            $400.00
          </Text>
        </View>
      </View>

      {/* Payouts List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      ) : payouts.length > 0 ? (
        <FlatList
          data={payouts}
          renderItem={renderPayout}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>لا توجد طلبات سحب</Text>
        </View>
      )}

      {/* Request Payout Modal */}
      <Modal
        visible={showRequestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>طلب سحب جديد</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>المبلغ</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#64748b"
                  value={requestAmount}
                  onChangeText={setRequestAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.availableText}>
                المتاح: ${availableBalance.toFixed(2)}
              </Text>
            </View>

            {/* Payment Method */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>طريقة الدفع</Text>
              {['bank_transfer', 'paypal', 'stripe'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodOption,
                    selectedMethod === method && styles.methodOptionSelected,
                  ]}
                  onPress={() => setSelectedMethod(method)}
                >
                  <View
                    style={[
                      styles.methodCheckbox,
                      selectedMethod === method && styles.methodCheckboxSelected,
                    ]}
                  />
                  <Text style={styles.methodText}>{getMethodLabel(method)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleRequestPayout}
              >
                <Text style={styles.submitButtonText}>طلب السحب</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  balanceCard: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
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
  listContent: {
    paddingHorizontal: 20,
  },
  payoutCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginBottom: 4,
  },
  payoutMethod: {
    fontSize: 12,
    color: '#94a3b8',
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
  payoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  payoutDate: {
    fontSize: 12,
    color: '#64748b',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  availableText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  methodOptionSelected: {
    borderColor: '#14b8a6',
    backgroundColor: '#14b8a6/10',
  },
  methodCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#334155',
    marginRight: 12,
  },
  methodCheckboxSelected: {
    borderColor: '#14b8a6',
    backgroundColor: '#14b8a6',
  },
  methodText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});


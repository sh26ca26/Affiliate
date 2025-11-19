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
  Share,
} from 'react-native';

interface AffiliateLink {
  id: number;
  title: string;
  url: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export default function LinksScreen() {
  const [links, setLinks] = useState<AffiliateLink[]>([
    {
      id: 1,
      title: 'منتج رائع',
      url: 'https://aff.example.com/link/abc123',
      clicks: 150,
      conversions: 12,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'عرض خاص',
      url: 'https://aff.example.com/link/def456',
      clicks: 89,
      conversions: 5,
      createdAt: '2024-01-14',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleShare = async (link: AffiliateLink) => {
    try {
      await Share.share({
        message: `تحقق من هذا المنتج الرائع: ${link.url}`,
        title: link.title,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyLink = (url: string) => {
    // TODO: Copy to clipboard
    Alert.alert('تم النسخ', 'تم نسخ الرابط بنجاح');
  };

  const renderLink = ({ item }: { item: AffiliateLink }) => (
    <View style={styles.linkCard}>
      <View style={styles.linkHeader}>
        <Text style={styles.linkTitle}>{item.title}</Text>
        <Text style={styles.linkDate}>{item.createdAt}</Text>
      </View>

      <View style={styles.linkStats}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>👆</Text>
          <Text style={styles.statText}>{item.clicks} نقرات</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={styles.statText}>{item.conversions} تحويلات</Text>
        </View>
      </View>

      <View style={styles.linkActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#14b8a6' }]}
          onPress={() => handleCopyLink(item.url)}
        >
          <Text style={styles.actionButtonText}>📋 نسخ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
          onPress={() => handleShare(item)}
        >
          <Text style={styles.actionButtonText}>📤 مشاركة</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
        >
          <Text style={styles.actionButtonText}>🗑️ حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الروابط الخاصة بي</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ رابط جديد</Text>
        </TouchableOpacity>
      </View>

      {/* Links List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      ) : links.length > 0 ? (
        <FlatList
          data={links}
          renderItem={renderLink}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>لا توجد روابط بعد</Text>
          <Text style={styles.emptySubtext}>
            انقر على "رابط جديد" لإنشاء رابط تسويقي
          </Text>
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
  header: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  linkCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  linkDate: {
    fontSize: 12,
    color: '#64748b',
  },
  linkStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statEmoji: {
    fontSize: 16,
  },
  statText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  linkActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});


import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Notice = { id: string; title: string; body?: string; ts?: string };

export default function NotificationsScreen() {
  const [items] = useState<Notice[]>([
  ]);

  if (items.length === 0) {
    return (
      <View style={s.center}>
        <Text style={s.title}>No notifications</Text>
        <Text style={s.muted}>You’ll see your updates here.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.cardTitle}>{item.title}</Text>
          {!!item.body && <Text style={s.cardBody}>{item.body}</Text>}
          {!!item.ts && <Text style={s.cardTs}>{item.ts}</Text>}
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  muted: { color: '#6b7280' },
  card: { backgroundColor: '#F6F7F9', borderRadius: 12, padding: 12 },
  cardTitle: { fontWeight: '800' },
  cardBody: { color: '#374151', marginTop: 4 },
  cardTs: { color: '#9CA3AF', marginTop: 6, fontSize: 12 },
});

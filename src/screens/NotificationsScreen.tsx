import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedView, ThemedText, ThemedCard } from '../ui/Themed';

type Notice = { id: string; title: string; body?: string; ts?: string };

export default function NotificationsScreen() {
  const [items] = useState<Notice[]>([]);

  if (items.length === 0) {
    return (
      <ThemedView style={s.center}>
        <ThemedText style={s.title}>No notifications</ThemedText>
        <ThemedText style={{ opacity:0.7 }}>You’ll see your updates here.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <ThemedCard style={s.card}>
          <ThemedText style={s.cardTitle}>{item.title}</ThemedText>
          {!!item.body && <ThemedText style={{ marginTop: 4 }}>{item.body}</ThemedText>}
          {!!item.ts && <ThemedText style={{ opacity:0.7, marginTop: 6, fontSize: 12 }}>{item.ts}</ThemedText>}
        </ThemedCard>
      )}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  card: { borderRadius: 12, padding: 12 },
  cardTitle: { fontWeight: '800' },
});

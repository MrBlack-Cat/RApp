import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useNotifications } from '../notifications/NotificationsContext';

function Item({ id, title, body, read, receivedAt, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 14, backgroundColor: read ? '#fff' : '#eef6ff', borderRadius: 12 }}>
      <Text style={{ fontWeight: '600' }}>{title}</Text>
      {!!body && <Text style={{ marginTop: 4, color: '#374151' }}>{body}</Text>}
      <Text style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
        {new Date(receivedAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { items, unread, setRead, setAllRead, reset } = useNotifications();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 12, padding: 12, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Notifications ({unread} unread)</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={setAllRead}><Text style={{ color: '#2563eb' }}>Mark all read</Text></TouchableOpacity>
        <TouchableOpacity onPress={reset}><Text style={{ color: '#ef4444' }}>Clear</Text></TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Item
            {...item}
            onPress={() => setRead(item.id, !item.read)}
          />
        )}
      />
    </View>
  );
}

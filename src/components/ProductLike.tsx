import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Heart from '../../assets/icons/heart.svg';
import Heart2 from '../../assets/icons/heart2.svg';

export default function ProductLike({
  liked, onPress,
}: { liked: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.likeBtn} hitSlop={8}>
      <View style={[s.likeBadge, liked && s.likeBadgeOn]}>
        {liked ? <Heart2 width={16} height={16}/> : <Heart width={16} height={16}/>}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  likeBtn: { position: 'absolute', top: 4, right: 4 },
  likeBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  likeBadgeOn: { backgroundColor: '#FFE4E6' },
});

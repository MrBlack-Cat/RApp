import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function SearchBar({
  value, onChange,
}:{value:string; onChange:(t:string)=>void}) {
  return (
    <View style={s.box}>
      <View style={s.inputWrap}>
        <TextInput
          placeholder="Search products…"
          value={value}
          onChangeText={onChange}
          style={s.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={() => {}}
        />
        {!!value && (
          <TouchableOpacity onPress={() => onChange('')} style={s.clearBtn}>
            <Text style={s.clearTxt}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  box:{ marginVertical:16, paddingHorizontal:16 },
  inputWrap:{ position:'relative' },
  input:{ backgroundColor:'#F5F5F7', borderRadius:12, paddingHorizontal:16, paddingVertical:10, fontSize:15, paddingRight:36 },
  clearBtn:{ position:'absolute', right:8, top:0, bottom:0, justifyContent:'center', paddingHorizontal:6 },
  clearTxt:{ fontSize:22, lineHeight:22, color:'#888' },
});

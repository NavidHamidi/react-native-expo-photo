import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Top menu camera options : flashmode, timer,autofocus, aspect ratio, settings
function CameraOption(props) {
  const iconName = props.iconName;
  const color = props.enabled ? 'yellow' : 'white';
  const onPress = () => props.setEnabled(!props.enabled);

  return (
    <View style={styles.icon}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={onPress}>
          <MaterialIcons
            name={iconName}
            size={32}
            color={color}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default CameraOption;

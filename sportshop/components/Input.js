import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export const Input = forwardRef(({ icon, style, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}

      <TextInput
        ref={ref}
        style={[
          styles.input,
          icon ? { paddingLeft: 40 } : {},
          style
        ]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    padding: 12,
    borderRadius: 8,
  },
});

Input.displayName = 'Input';
import { useEffect, useRef } from 'react';

import { StyleSheet, View, Animated, Easing } from 'react-native';

export function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style = null,
  duration = 300,
}) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const contentHeight = useRef(0);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? contentHeight.current : 0,
      duration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: false,
    }).start();
  }, [isExpanded, duration]);

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[
        styles.animatedView,
        { height: animatedHeight },
        style
      ]}>
      <View
        onLayout={(e) => {
          contentHeight.current = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
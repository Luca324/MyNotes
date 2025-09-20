import { useEffect, useRef, useState } from 'react';

import { StyleSheet, View, Animated, Easing } from 'react-native';

export function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style = null,
  duration = 300,
}) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [contentRendered, setContentRendered] = useState(false);
  const contentHeight = useRef(0);

  useEffect(() => {
    if (isExpanded) {
      setContentRendered(true);
    } else {
      // Закрываем анимацию
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (contentRendered && contentHeight.current > 0 && isExpanded) {
      // Открываем анимацию после рендера контента
      Animated.timing(animatedHeight, {
        toValue: contentHeight.current,
        duration,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: false,
      }).start();
    }
  }, [contentRendered, contentHeight.current, isExpanded]);

  const handleLayout = (event) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0) {
      contentHeight.current = height;
    }
  };

  return (
    <Animated.View
      style={[
        styles.animatedView,
        { height: animatedHeight },
        style
      ]}
    >
      <View
        onLayout={handleLayout}
        style={styles.wrapper}
        collapsable={false}
      >
        {contentRendered && children}
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
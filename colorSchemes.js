export const colorSchemes = {
    // Пыльно-лавандовая схема (по умолчанию)
    dustyLavender: {
      depth0: '#f8fafc',
      depth1: '#e0e7ff',
      depth2: '#c7d2fe',
      depth3: '#a5b4fc',
      depth4: '#818cf8',
      depth5: '#6366f1',
      textLight: '#374151',
      textDark: '#ffffff'
    },
  
    // Нежная мятная схема
    mint: {
      depth0: '#f0fffa',
      depth1: '#daffe8',
      depth2: '#bfffd6',
      depth3: '#99ffbd',
      depth4: '#70ffa1',
      depth5: '#5ce68a',
      textLight: '#374151',
      textDark: '#1f2937'
    },
  
    // Теплая персиковая схема
    peach: {
      depth0: '#fff8f0',
      depth1: '#ffedd5',
      depth2: '#fed7aa',
      depth3: '#fdba74',
      depth4: '#fb923c',
      depth5: '#f97316',
      textLight: '#374151',
      textDark: '#ffffff'
    },
  
    // Приглушенная терракотовая схема
    terracotta: {
      depth0: '#fff7ed',
      depth1: '#ffedd5',
      depth2: '#fed7aa',
      depth3: '#fdba74',
      depth4: '#fb923c',
      depth5: '#ea580c',
      textLight: '#374151',
      textDark: '#ffffff'
    }
  };
  
  // Функция для получения цвета по глубине
  export const getDepthColor = (depth, scheme = 'dustyLavender') => {
    const colors = colorSchemes[scheme];
    switch(depth) {
      case 0: return colors.depth0;
      case 1: return colors.depth1;
      case 2: return colors.depth2;
      case 3: return colors.depth3;
      case 4: return colors.depth4;
      case 5: return colors.depth5;
      default: return colors.depth5; // для глубины больше 5
    }
  };
  
  // Функция для определения цвета текста
  export const getTextColor = (depth, scheme = 'dustyLavender') => {
    const colors = colorSchemes[scheme];
    // Для светлых фонов - темный текст, для темных - светлый
    return depth <= 2 ? colors.textLight : colors.textDark;
  };
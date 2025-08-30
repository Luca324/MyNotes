module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
        },
      ],
      'nativewind/babel',
    ],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          // @/components это путь к компонентам gluestack
          // @components это путь к моим компонентам. 
          alias: {
            'tailwind.config': './tailwind.config.js',
            '@': './',
            '@src': './src',
            '@database': './src/database',
            '@components': './src/components',
            '@utils': './src/utils',
            '@shared': './src/shared'
          }
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

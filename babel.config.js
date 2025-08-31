// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@database': './src/database',
            '@components': './src/components',
            '@utils': './src/utils',
            '@shared': './src/shared'
          }
        }
      ]
    ]
  };
};
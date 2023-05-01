module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@api': './api',
            '@assets': './src/assets',
            '@constants': './constants',
            '@context': './context',
            '@hooks': './hooks',
            '@utils': './utils',
          },
        },
      ],
    ],
  };
};

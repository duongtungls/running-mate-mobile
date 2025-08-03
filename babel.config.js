module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/app': './app',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/assets': './assets',
            '@/constants': './constants',
            '@/utils': './utils',
            '@/types': './types',
            '@/services': './services',
            '@/store': './store',
            '@/shared': '../shared',
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
          ],
        },
      ],
    ],
  };
};

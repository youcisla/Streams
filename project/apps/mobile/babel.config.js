module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for the optional-chaining syntax used by React Native web
      '@babel/plugin-proposal-optional-chaining',
      // Required for the nullish-coalescing syntax
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  };
};
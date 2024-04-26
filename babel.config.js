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
            "@": "./src", // Alias "@" is set to reference the "src" directory
          }
        },
      ],
    ],
  };
};

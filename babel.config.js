module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    "@babel/preset-env"
  ],
  // Явно включаем трансформации для ?. и ??, чтобы гарантировать совместимость с Chrome 78
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};

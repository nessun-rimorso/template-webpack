module.exports = {
  development: {
    mode: 'development',
    devTools: 'source-map',
    isMinificationJS: false,
    isMinifyHTML: false,
    isSourceMapCSS: true,
    isImageOptimize: false,
    isShowErrors: true,
    innerGraph: true,
    env: {
      'process.env.NODE_ENV': '"development"',
    }
  },
  production: {
    mode: 'production',
    devTools: false,
    isMinificationJS: true,
    isMinifyHTML: true,
    isSourceMapCSS: false,
    isImageOptimize: true,
    isShowErrors: false,
    innerGraph: false,
    env: {
      'process.env.NODE_ENV': '"production"',
    }
  }
}

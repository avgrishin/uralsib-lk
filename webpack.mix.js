const { mix } = require('laravel-mix');

mix.setPublicPath('/');

mix.js('src/main.js', 'dist/build.js')
    .options({
        postCss: [
            require('autoprefixer')()
        ],
        processCssUrls: false
    }).sourceMaps(false, 'source-map');
mix.webpackConfig({
    node: {
        fs: "empty"
    },
});

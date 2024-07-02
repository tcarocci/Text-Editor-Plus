const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
  return {
    mode: 'production',
    entry: {
      main: path.resolve(__dirname, 'src/js/index.js'), // Entry point for main bundle
      install: path.resolve(__dirname, 'src/js/install.js'), // Entry point for install bundle
    },
    output: {
      filename: '[name].bundle.js', // Output bundled files with their names
      path: path.resolve(__dirname, 'dist'), // Output directory
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'), // Template for generating HTML file
        title: 'Text Editor',
      }),
      new InjectManifest({
        swSrc: path.resolve(__dirname, 'src-sw.js'), // Source service worker file
        swDest: 'service-worker.js', // Destination service worker file
      }),
      new WebpackPwaManifest({
        name: 'Text Editor',
        short_name: 'TextEditor',
        description: 'A simple text editor',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        start_url: '.',
        publicPath: '.',
        icons: [
          {
            src: path.resolve(__dirname, 'src/images/logo.png'), // Path to icon image
            sizes: [96, 128, 192, 256, 384, 512], // Sizes of the icon
            destination: path.join('assets', 'icons'), // Destination directory for icons
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'favicon.ico'), to: path.resolve(__dirname, 'dist') } // Copy favicon to dist
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i, // Rule for CSS files
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i, // Rule for image files
          type: 'asset/resource',
        },
        {
          test: /\.m?js$/, // Rule for JavaScript files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        },
      ],
    },
  };
};

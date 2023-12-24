const path = require('path') 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const ImageMinimizerPlugin =  require('image-minimizer-webpack-plugin') 

module.exports = {
    entry:'./src/main.jsx',
    mode:'production',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist' ),
        publicPath:'/'
    },
    optimization: {
      minimize: true, // Disable minification
      minimizer: [
        "...",
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              // Lossless optimization with custom option
              // Feel free to experiment with options for better result for you
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                  "svgo",
                  {
                    plugins: [
                      {
                        name: "preset-default",
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: "http://www.w3.org/2000/svg" },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ]
    },
    plugins:[
      new HtmlWebpackPlugin({
          template:'./index.html',
          filename:'index.html',
          inject:true
      })
    ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.(js|jsx|json)$/,
            exclude: /amplify/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.(png|jpe?g|gif|ico|json)$/i,
            type:'asset/resource', 
            generator:{
              filename:'images/[name][ext]',
              publicPath:'/'

            },
          },
          {
            test:/\.css$/, 
            use:['style-loader','css-loader']
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },

    
}
import path from 'path';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader',
          },
          {
            loader: path.resolve(__dirname, '../src/injection-loader.js'),
            options,
          }
        ]
      }]
    }
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
}

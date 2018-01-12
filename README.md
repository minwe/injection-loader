# Injection Loader

A loader for webpack that lets you inject content to file.

## Install

```bash
npm install --save-dev injection-loader raw-loader
```

## Usage

Use the loader either via your webpack config, CLI or inline.

**Note**: Injection loader just INJECTION ([guidelines](https://webpack.js.org/contribute/writing-a-loader/#guidelines)), you can use it with `raw-loader` to require non-js file.

`webpack.config.js`:

```javascript
module.exports = {
  module: {
    rules: [{
      test: /\.md$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'injection-loader',
          options: {
            // default pattern
            pattern: /__INCLUE_FILE\('(.+)'\)/,
          },
        }
      ]
    }]
  }
}
```

In your application

```javascript
import md from 'some.md';
```

`some.md`:

```
# Title

## Sub title

- list 1
- list 1

__INCLUE_FILE('./injection.txt')
```

**Note**: `__INCLUE_FILE` path (`./injection.txt`) should RELATIVE to `some.md`.

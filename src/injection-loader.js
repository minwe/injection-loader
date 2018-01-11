import path from 'path';
import fs from 'fs';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const LOADER_NAME = 'Injection Loader';
const schema = {
  type: 'object',
  properties: {
    pattern: {
      "anyOf": [
        { "type": "string" },
        { "instanceof": "RegExp" }
      ]
    }
  },
  "additionalProperties": false
};

const DEFAULT_OPTIONS = {
  pattern: /__INCLUE_FILE\('(.+)'\)/,
};

export default function injectionLoader(source) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, LOADER_NAME);

  const pattern = options.pattern || DEFAULT_OPTIONS.pattern;
  const regexString = pattern instanceof RegExp ? pattern.source : pattern;
  const regexWithoutFlag = new RegExp(regexString);
  const matches = source.match(new RegExp(regexString, 'mg'));
  const resourceDir = path.parse(this.resourcePath).dir;

  if (!matches) {
    return this.callback(null, source);
  }

  matches.forEach((item) => {
    const matchPath = regexWithoutFlag.exec(item);

    if (matchPath && matchPath[1]) {
      const filePath = path.resolve(resourceDir, matchPath[1]);

      if (fs.existsSync(filePath)) {
        this.addDependency(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        source = source.replace(item, fileContent);
      }
    }
  });

  this.callback(null, source);
}

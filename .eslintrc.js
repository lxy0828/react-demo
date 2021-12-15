module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        'airbnb',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:unicorn/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
        'prettier/unicorn',
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "settings": {
        'import/resolver': {
          node: {
            extensions: ['.tsx', '.ts', '.js', '.json'],
            typescript: {},
          },
        },
    },
    "plugins": ['react', 'unicorn', 'promise', '@typescript-eslint'],
    "rules": {
        'import/extensions': [
            ERROR,
            'ignorePackages',
            {
              ts: 'never',
              tsx: 'never',
              json: 'never',
              js: 'never',
            },
        ],
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }]
    }
};

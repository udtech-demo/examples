module.exports = {
    "env": {
        "node": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": 'babel-eslint',
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": 'module'
    },
    "rules": {
    }
}

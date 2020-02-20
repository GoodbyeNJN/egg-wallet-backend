module.exports = {
    root: true,
    // extends: '@react-native-community',
    /*
     * 通用规则
     *
     * 安装依赖：
     * npm install --save-dev eslint babel-eslint eslint-config-alloy
     * 或：
     * yarn add --dev eslint babel-eslint eslint-config-alloy
     */
    // extends: ["alloy"],

    /*
     * Vue 专用规则
     *
     * 安装依赖：
     * npm install --save-dev eslint babel-eslint vue-eslint-parser@5.0.0 eslint-plugin-vue eslint-config-alloy
     * 或：
     * yarn add --dev eslint babel-eslint vue-eslint-parser@5.0.0 eslint-plugin-vue eslint-config-alloy
     */
    // extends: ["alloy", "alloy/vue"],

    /*
     * React 专用规则
     *
     * 安装依赖：
     * npm install --save-dev eslint babel-eslint eslint-plugin-react eslint-config-alloy
     * 或：
     * yarn add --dev eslint babel-eslint eslint-plugin-react eslint-config-alloy
     */
    // extends: ["alloy", "alloy/react"],

    /*
     * TypeScript 专用规则
     *
     * 安装依赖：
     * npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
     * 或：
     * yarn add --dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
     */
    extends: ["alloy", "alloy/typescript", "eslint-config-egg/typescript"],

    /*
     * TypeScript React 专用规则
     *
     * 安装依赖：
     * npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-alloy
     * 或：
     * yarn add --dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-config-alloy
     */
    // extends: ["alloy", "alloy/react", "alloy/typescript"],

    globals: {},
    rules: {},
    parserOptions: {
        project: "./tsconfig.json",
    },
};

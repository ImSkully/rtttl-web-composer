import globals from "globals";
import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.jquery,
				...globals.es2022,
			}
		}
	},
	{
		rules: {
			"quotes": ["error", "double"],
			semi: "error",
			"no-undef": "error",
			"no-unused-vars": "warn",
		}
	},
];

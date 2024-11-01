import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";

enum Theme {
	Dark = "theme-dark",
	Light = "theme-light",
}

const ThemeStorageKey = "rtttl_theme";
const DefaultTheme = Theme.Dark;

export default function ThemeButton() {
	const [theme, setTheme] = useState<Theme>(IS_BROWSER ? localStorage.getItem(ThemeStorageKey) as Theme || DefaultTheme : DefaultTheme);

	useEffect(() => {
		document.body.className = theme;
		localStorage.setItem(ThemeStorageKey, theme);
	}, [theme]);

	return (
		<a
			onClick={() => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)}
			class="nav-link px-0"
			data-bs-toggle="tooltip"
			data-bs-placement="bottom"
			data-bs-original-title={`Switch to ${theme === Theme.Dark ? "light" : "dark"} theme`}
		>
			<i class={`icon ti ${theme === Theme.Dark ? "ti-sun" : "ti-moon"}`}></i>
		</a>
	);
}

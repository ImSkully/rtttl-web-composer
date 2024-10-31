import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

enum Theme {
	Dark = "theme-dark",
	Light = "theme-light",
}

const ThemeStorageKey = "rtttl_theme";
const DefaultTheme = Theme.Dark;

export default function ThemeButton() {
	const theme = useSignal<Theme>(localStorage.getItem(ThemeStorageKey) as Theme || DefaultTheme);

	useEffect(() => {
		document.body.className = theme.value;
		localStorage.setItem(ThemeStorageKey, theme.value);
	}, [theme.value]);

	return (
		<a
			onClick={() => theme.value = theme.value === Theme.Dark ? Theme.Light : Theme.Dark}
			class="nav-link px-0"
			data-bs-toggle="tooltip"
			data-bs-placement="bottom"
			data-bs-original-title={`Switch to ${theme.value === Theme.Dark ? "light" : "dark"} theme`}
		>
			<i class={`icon ti ${theme.value === Theme.Dark ? "ti-sun" : "ti-moon"}`}></i>
		</a>
	);
}

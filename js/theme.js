/*	  ____  ______ ______ ______ __		  ______
*	 / __ \/_  __//_  __//_  __// /		 / ____/____   ____ ___   ____   ____   _____ ___   _____
*	/ /_/ / / /    / /    / /  / /		/ /    / __ \ / __ `__ \ / __ \ / __ \ / ___// _ \ / ___/
*  / _, _/ / /    / /    / /  / /___   / /___ / /_/ // / / / / // /_/ // /_/ /(__  )/  __// /
* /_/ |_| /_/    /_/    /_/  /_____/   \____/ \____//_/ /_/ /_// .___/ \____//____/ \___//_/
*			https://github.com/ImSkully/rtttl-web-composer	  /_*/

(function (factory) { typeof define === "function" && define.amd ? define(factory) : factory(); })((function () {
	"use strict";
	const DEFAULT_THEME = "dark";
	const themeStorageKey = "ui_selected_theme";
	let selectedTheme;

	let params = new Proxy(new URLSearchParams(window.location.search), {
		get: function get(searchParams, prop) {
			return searchParams.get(prop);
		}
	});

	if (params.theme) {
		localStorage.setItem(themeStorageKey, params.theme);
		selectedTheme = params.theme;
	} else {
		const storedTheme = localStorage.getItem(themeStorageKey);
		selectedTheme = storedTheme ? storedTheme : DEFAULT_THEME;
	}

	document.body.classList.remove("theme-dark", "theme-light");
	document.body.classList.add("theme-".concat(selectedTheme));
}));

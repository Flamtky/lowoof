export let currentLanguage: "EN" | "DE" = 'EN';
export const setLanguage = (lang: "EN" | "DE") => {
	currentLanguage = lang;
};
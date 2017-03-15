// Check if string is empty or just whitespace
export function isStringEmpty(string) {
    return !(/\S/.test(string)) || string === '';
}
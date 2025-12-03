export function convertCelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
}

export function convertFahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
}

export function convertKelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
}
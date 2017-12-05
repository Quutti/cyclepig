export interface Rgb {
    r: number;
    g: number;
    b: number;
}

/**
 * @see https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
export function hexToRgb(hex: string): Rgb {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function isDarkColor(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) {
        return false;
    }

    const { r, g, b } = rgb;
    return ((r + g + b) / 3) < (255 / 2);
}
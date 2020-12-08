
function getDeltaE(x1, x2) {
    return Math.sqrt(
        Math.pow(x2.L - x1.L, 2) +
        Math.pow(x2.A - x1.A, 2) +
        Math.pow(x2.B - x1.B, 2)
    );
}

function hexToLab(hex) {
    return xyzToLab(rgbToXyz(hexToRgb(hex)));
}

function hexToRgb(hex) {
    var color = hex.charAt(0) === "#" ? hex.substring(1, 7) : hex;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : {
            r: r,
            g: g,
            b: b
        };
}

function rgbToXyz(rgb) {
    let r = pivotRgb(rgb.r / 255.0);
    let g = pivotRgb(rgb.g / 255.0);
    let b = pivotRgb(rgb.b / 255.0);

    // Observer. = 2°, Illuminant = D65
    return {
        X: r * 0.4124 + g * 0.3576 + b * 0.1805,
        Y: r * 0.2126 + g * 0.7152 + b * 0.0722,
        Z: r * 0.0193 + g * 0.1192 + b * 0.9505
    };
}

function xyzToLab(xyz) {
    const REF_X = 95.047; // Observer= 2°, Illuminant= D65
    const REF_Y = 100.0;
    const REF_Z = 108.883;

    let x = pivotXyz(xyz.X / REF_X);
    let y = pivotXyz(xyz.Y / REF_Y);
    let z = pivotXyz(xyz.Z / REF_Z);

    return {
        L: 116 * y - 16,
        A: 500 * (x - y),
        B: 200 * (y - z)
    };
}

function pivotRgb(n) {
    return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100.0;
}

function pivotXyz(n) {
    let i = Math.cbrt(n);
    return n > 0.008856 ? i : 7.787 * n + 16 / 116;
}

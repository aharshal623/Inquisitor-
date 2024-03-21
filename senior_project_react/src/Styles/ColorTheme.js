import tinycolor from 'tinycolor2';

export const COLORS = {
    primary: tinycolor("#E82121").lighten(10).toString(), // Adjust the percentage as needed
    inquisitor: "#E82121",
    darkerShadeofRed: tinycolor('#E82121').darken(10).toString(),
    lighterShadeofRed: tinycolor('#E82121').lighten(10).toString(),
    shade1: tinycolor('#E82121').darken(10).toString(),
    shade2: tinycolor('#E82121').darken(5).toString(),
    shade3: tinycolor('#E82121').lighten(5).toString(),
    shade4: tinycolor('#E82121').lighten(10).toString(),
    shade5: tinycolor('#E82121').saturate(10).toString(),
    shade6: tinycolor('#E82121').desaturate(10).toString(),
    grey:"#D3D3D3" ,
    lowScore: "#FFCDD2",
    middleScore: "#FFF9C4",
    highScore: "#C8E6C9" 
};


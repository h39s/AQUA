// Primary
export enum PrimaryColorEnum {
  DARK = '#1c313a',
  DEFAULT = '#455a64',
  LIGHT = '#718792',
  LIGHTER = '#a0b7c2',
}

// Secondary
export enum SecondaryColorEnum {
  DARKER = 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #0093c4',
  DARK = '#0093c4',
  DEFAULT = '#4fc3f7',
  LIGHT = '#8bf6ff',
}

export enum ColorEnum {
  // Complementary
  COMPLEMENTARY = '#f7844f',

  // Triadic
  TRIADIC1 = '#844ff7',
  TRIADIC2 = '#f74fc2',

  // Analogous
  ANALOGOUS1 = '#4f6ef7',
  ANALOGOUS2 = '#4ff7d8',
}

export enum GrayScaleEnum {
  BLACK = '#000000',
  WHITE = '#ffffff',
}

export const getColor = (index: number) => {
  const colors = Object.values(ColorEnum);
  return colors[index % colors.length];
};

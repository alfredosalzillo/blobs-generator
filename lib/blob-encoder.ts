import { Blob } from './blob';

export const encoderVersion = 'v1';

export const encodeBlob = (blob: Blob) => {
  const {
    id,
    x,
    y,
    width,
    height,
    body,
    eyes,
    colors,
  } = blob;
  const {
    primary,
    dark,
    light,
  } = colors
  return [
    id,
    x,
    y,
    width,
    height,
    body.map(({ x, y }) => [x, y].join('-')).join(','),
    eyes.map(({ x, y, size }) => [x, y, size].join('-')).join(','),
    [primary, dark, light].map((color) => color.replace('hsl(', '').replace(')', '') ).join('-')
  ].join('|')
}

export const decodeBlob = (descriptor: string): Blob => {
  const [
    id,
    x,
    y,
    width,
    height,
    body,
    eyes,
    colors,
  ] = descriptor.split('|');
  return {
    id,
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
    body: body.split(',')
      .map(p => p.split('-').map(Number))
      .map(([x, y]) => ({ x, y })),
    eyes: eyes.split(',')
      .map((e) => e.split('-').map(Number))
      .map(([x, y, size]) => ({ x, y, size })),
    colors: [colors.split('-').map((color) => `hsl(${color})`)]
      .map(([primary, dark, light]) => ({
        primary, dark, light,
      }))[0],
  }
}

import type { Blob, Eye, Palette } from '@/lib/blob';
import { spline } from '@/lib/spline';

const SvgBlobEye = (props: Eye & { colors: Palette }) => {
  const { x, y, size, colors } = props
  return (
    <g
      transform={`matrix(1,0,0,1,${x},${y})`}
    >
      <circle
        r={size}
        cx="0"
        cy="0"
        strokeWidth="2"
        stroke={colors.dark}
        fill={colors.light}
      />
      <circle
        r={size / 2}
        cx="0"
        cy="0"
        fill={colors.dark}
      />
    </g>
  )
}
const animations = ['eye-roll', 'eye-roll-reverse', 'eye-converge', 'eye-converge-reverse'];
export type SvgBlobProps = Blob;
const SvgBlob = ({
   width,
   height,
   body,
   eyes,
   colors,
 }: SvgBlobProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      <path
        d={spline(body as any[], 1, true)}
        strokeWidth={2}
        stroke={colors.dark}
        fill={colors.primary}
      />
      <g>
        {eyes.map((eye, index) => <SvgBlobEye key={index} {...eye} colors={colors}/>)}
      </g>
    </svg>
  )
}

export default SvgBlob

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function LogoIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 20V4h6a4 4 0 0 1 0 8H4" />
      <path d="M4 12h7a4 4 0 0 1 0 8H4" />
    </svg>
  );
}

export function BlogIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 4h13a2 2 0 0 1 2 2v14l-4-3-3 3-3-3-4 3V6a2 2 0 0 1 2-2z" />
      <path d="M8 8h7" />
      <path d="M8 12h7" />
    </svg>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function ImagesIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

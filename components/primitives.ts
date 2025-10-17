export function title(...additionalClasses: Array<string | false | undefined | null>): string {
  const baseClasses = [
    'text-4xl',
    'md:text-5xl',
    'font-bold',
    'tracking-tight',
    'text-foreground',
  ];

  const extra = additionalClasses.filter(Boolean) as string[];
  return [...baseClasses, ...extra].join(' ');
}



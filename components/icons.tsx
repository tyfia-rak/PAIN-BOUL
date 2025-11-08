import * as React from 'react';

import { IconSvgProps } from "@/lib/types";
import Image from 'next/image';

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <Image src="/images/pain-boul.jpg" alt="Pain Boulangerie" width={100} height={30} />
);

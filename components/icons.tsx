import * as React from "react";

import { IconSvgProps } from "@/types";
import Image from "next/image";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
      <Image src="/pain-boul.jpg" alt="Pain Boulangerie" width={100} height={30}/>
);

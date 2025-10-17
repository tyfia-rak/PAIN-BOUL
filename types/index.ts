import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Session {
  user: {
    name: string;
    email: string;
    id?: string;
    role?: string;
  };
}

export interface DashboardProps {
  session: Session;
}

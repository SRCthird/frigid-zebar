import { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

const Center = ({children}: Props) => {
  return <div className="center">{children}</div>
}

export default Center;

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

const Left = ({children}: Props) => {
  return <div className="left">{children}</div>
}

export default Left;

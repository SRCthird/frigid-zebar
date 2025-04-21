import { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

const Right = ({children}: Props) => {
  return <div className="right">{children}</div>
}

export default Right;

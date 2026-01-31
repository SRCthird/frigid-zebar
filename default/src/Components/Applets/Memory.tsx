import { MemoryOutput } from "zebar"

type Props = {
  memory: MemoryOutput | null
}

const Memory = ({ memory }: Props) => {
  if (memory) {
    return (
      <div className="memory">
        <i className="nf nf-fae-chip"></i>
        {String(Math.round(memory.usage)).padStart(2, '0')}%
      </div>
    )
  } else {
    return <></>
  }
}

export default Memory;

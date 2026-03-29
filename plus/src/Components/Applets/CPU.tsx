import { CpuOutput } from "zebar"

type Props = {
  cpu: CpuOutput | null
}

const CPU = ({ cpu }: Props) => {
  if (cpu) {
    return (
      <div className="cpu">
        <i className="nf nf-oct-cpu"></i>
        <span
          className={cpu.usage > 85 ? 'high-usage' : ''}
        >
          {String(Math.round(cpu.usage)).padStart(2, '0')}%
        </span>
      </div>
    )
  } else {
    return <></>
  }
}

export default CPU;

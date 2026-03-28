import { BatteryOutput, shellExec } from "zebar"

type Props = {
  battery: BatteryOutput | null
}

const getBatteryIcon = (batteryOutput: BatteryOutput) => {
  if (batteryOutput.chargePercent > 90)
    return <i className="nf nf-fa-battery_4"></i>;
  if (batteryOutput.chargePercent > 70)
    return <i className="nf nf-fa-battery_3"></i>;
  if (batteryOutput.chargePercent > 40)
    return <i className="nf nf-fa-battery_2"></i>;
  if (batteryOutput.chargePercent > 20)
    return <i className="nf nf-fa-battery_1"></i>;
  return <i className="nf nf-fa-battery_0"></i>;
}

const Battery = ({ battery }: Props) => {
  if (battery) {
    return (
      <button 
        className="interactive battery"
        onClick={() => {shellExec('powershell', '-Command Start-Process ms-settings:powersleep')}}
      >
        {battery.isCharging && (
          <i className="nf nf-md-power_plug charging-icon"></i>
        )}
        {getBatteryIcon(battery)}
        {Math.round(battery.chargePercent)}%
      </button>
    )
  } else {
    return <></>
  }
}

export default Battery;

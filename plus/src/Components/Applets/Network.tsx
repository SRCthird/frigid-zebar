import { NetworkOutput, shellExec } from "zebar";

type Props = {
  network: NetworkOutput | null
}

const getNetworkIcon = (networkOutput: NetworkOutput) => {
  switch (networkOutput?.defaultInterface?.type) {
    case 'ethernet':
      return <i className="nf nf-md-ethernet_cable"></i>;
    case 'wifi':
      if (networkOutput.defaultGateway?.signalStrength || 0 >= 80) {
      return <i className="nf nf-md-wifi_strength_4"></i>;
    } else if (
      networkOutput.defaultGateway?.signalStrength || 0 >= 65
    ) {
      return <i className="nf nf-md-wifi_strength_3"></i>;
    } else if (
      networkOutput.defaultGateway?.signalStrength || 0 >= 40
    ) {
      return <i className="nf nf-md-wifi_strength_2"></i>;
    } else if (
      networkOutput.defaultGateway?.signalStrength || 0 >= 25
    ) {
      return <i className="nf nf-md-wifi_strength_1"></i>;
    } else {
      return <i className="nf nf-md-wifi_strength_outline"></i>;
    }
    default:
      return (
        <i className="nf nf-md-wifi_strength_off_outline"></i>
    );
  }
}

const Network = ({ network }: Props) => {
  if (network) {
    return (
      <button 
      onClick={() => {
        shellExec('powershell', '-Command Start-Process ms-settings:network-status');
      }}
        className="interactive"
      >
        {getNetworkIcon(network)}
        {network.defaultGateway?.ssid}
      </button>
    )
  } else {
    return <></>
  }
}

export default Network;

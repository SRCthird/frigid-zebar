import { GlazeWmOutput } from "zebar";

type Props = {
  glazewm: GlazeWmOutput | null
}
const BindingMode = ({ glazewm }: Props) => {
  if (glazewm) return (
    <>
      {glazewm?.bindingModes.map(bindingMode => (
        <button
          className="binding-mode"
          key={bindingMode.name}
          onClick={() =>
            glazewm?.runCommand(
              `wm-disable-binding-mode --name ${bindingMode.name}`,
            )
          }
        >
          {bindingMode.displayName ?? bindingMode.name}
        </button>
      ))}

      <button
        className={`tiling-direction nf ${glazewm?.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'}`}
        onClick={() =>
          glazewm?.runCommand('toggle-tiling-direction')
        }
      ></button>
    </>
  )
  return <></>
}

export default BindingMode;

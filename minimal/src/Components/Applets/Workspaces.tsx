import { GlazeWmOutput } from "zebar";

type Props = {
  glazewm: GlazeWmOutput | null,
  fontFamily: string
}

const Workspaces = ({glazewm, fontFamily}: Props) => {
  return (
    <>
      <i className="logo nf nf-fa-windows"></i>
      {glazewm && (
        <div className="workspaces" style={{ fontFamily }}>
          {glazewm.currentWorkspaces.map(workspace => (
            <button
              className={`workspace ${workspace.hasFocus && 'focused'} ${workspace.isDisplayed && 'displayed'}`}
              onClick={() =>
                glazewm?.runCommand(
                  `focus --workspace ${workspace.name}`,
                )
              }
              key={workspace.name}
            >
              {workspace.displayName ?? workspace.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default Workspaces;

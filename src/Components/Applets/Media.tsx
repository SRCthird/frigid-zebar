import { MediaOutput } from "zebar"

type Props = {
  media: MediaOutput | null;
  onClick: () => void;
}

const Media = ({ media, onClick }: Props) => {
  const handleParentClick = () => { onClick() };

  const handlePreviousClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    media?.previous();
  };
  const handlePauseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    media?.togglePlayPause();
  };
  const handleNextClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    media?.next();
  };
  if (media && media.currentSession?.title) {
    return (
      <button className="interactive" onClick={handleParentClick}>
        <button onClick={handlePreviousClick}>
          <i className="nf nf-md-skip_previous"></i>
        </button>

        <button onClick={handlePauseClick}>
          <i className={`nf ${media.currentSession?.isPlaying ? 'nf-md-pause' : 'nf-md-play'}`}></i>
        </button>

        <button onClick={handleNextClick} >
          <i className="nf nf-md-skip_next"></i>
        </button>

        <span className="song-title">
          {media.currentSession?.title} {media.currentSession?.artist ? ` - ${media.currentSession?.artist}` : ''}
        </span>
      </button>
    )
  } else {
    return <></>
  }
}

export default Media;

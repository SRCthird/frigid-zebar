import React, { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { MediaOutput } from "zebar";

type Props = {
  media: MediaOutput | null;
  onClick: () => void;
};

const FALLBACK_ART =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="18" fill="#1b1f2a"/>
      <circle cx="80" cy="80" r="42" fill="#2a3142"/>
      <circle cx="80" cy="80" r="10" fill="#7382af"/>
    </svg>
  `);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function useAlbumArt(
  title?: string | null,
  artist?: string | null,
  albumTitle?: string | null,
) {
  const [artUrl, setArtUrl] = useState<string>(FALLBACK_ART);

  const queryKey = useMemo(
    () => [title ?? "", artist ?? "", albumTitle ?? ""].join("||"),
    [title, artist, albumTitle],
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!title && !artist && !albumTitle) {
        setArtUrl(FALLBACK_ART);
        return;
      }

      try {
        const term = [artist, title, albumTitle].filter(Boolean).join(" ");
        const url =
          `https://itunes.apple.com/search?media=music&entity=song&limit=1&term=${encodeURIComponent(term)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Album art lookup failed");

        const data = await res.json();
        const result = data?.results?.[0];

        if (!cancelled && result?.artworkUrl100) {
          setArtUrl(String(result.artworkUrl100).replace("100x100bb", "300x300bb"));
        } else if (!cancelled) {
          setArtUrl(FALLBACK_ART);
        }
      } catch {
        if (!cancelled) setArtUrl(FALLBACK_ART);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [queryKey, title, artist, albumTitle]);

  return artUrl;
}

function usePlaybackTiming(media: MediaOutput | null) {
  const session = media?.currentSession;
  const [, setTick] = useState(0);

  const anchorRef = useRef({
    basePosition: 0,
    anchoredAtMs: Date.now(),
    isPlaying: false,
    key: "",
  });

  const startTime = session?.startTime ?? 0;
  const endTime = session?.endTime ?? 0;
  const durationSeconds = Math.max(0, endTime - startTime);
  const rawPosition = session?.position ?? startTime;

  useEffect(() => {
    const key = [
      session?.title ?? "",
      session?.artist ?? "",
      session?.albumTitle ?? "",
      startTime,
      endTime,
    ].join("::");

    anchorRef.current = {
      basePosition: rawPosition,
      anchoredAtMs: Date.now(),
      isPlaying: !!session?.isPlaying,
      key,
    };
  }, [
    session?.title,
    session?.artist,
    session?.albumTitle,
    session?.isPlaying,
    rawPosition,
    startTime,
    endTime,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((n) => n + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const estimatedPosition = useMemo(() => {
    if (!session) {
      return 0;
    }

    const anchor = anchorRef.current;
    let pos = anchor.basePosition;

    if (anchor.isPlaying) {
      const elapsedWallSeconds = (Date.now() - anchor.anchoredAtMs) / 1000;
      pos += elapsedWallSeconds;
    }

    if (durationSeconds > 0) {
      return clamp(pos, startTime, endTime);
    }

    return Math.max(0, pos);
  }, [session, startTime, endTime, durationSeconds]);

  const elapsedSeconds = Math.max(0, estimatedPosition - startTime);
  const progressPercent =
    durationSeconds > 0 ? clamp((elapsedSeconds / durationSeconds) * 100, 0, 100) : 0;

  return {
    elapsedText: formatTime(elapsedSeconds),
    durationText: formatTime(durationSeconds),
    progressPercent,
  };
}

const Media = ({ media, onClick }: Props) => {
  const session = media?.currentSession;

  const albumArt = useAlbumArt(
    session?.title,
    session?.artist,
    session?.albumTitle,
  );

  const { elapsedText, durationText, progressPercent } = usePlaybackTiming(media);

  const handlePreviousClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    media?.previous();
  };

  const handlePauseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    media?.togglePlayPause();
  };

  const handleNextClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    media?.next();
  };

  if (!session?.title) return null;

  return (
    <div
      className="media-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="media-art-shell">
        <div className="media-art-glow" />
        <img
          className="media-art-large"
          src={albumArt}
          alt={`${session.title} album art`}
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_ART;
          }}
        />
      </div>

      <div className="media-info">
        <div className="media-title" title={session.title}>
          {session.title}
        </div>

        {!!session.artist && (
          <div className="media-artist" title={session.artist}>
            {session.artist}
          </div>
        )}

        {!!session.albumTitle && (
          <div className="media-album" title={session.albumTitle}>
            <i className="nf nf-md-album" />
            <span>{session.albumTitle}</span>
          </div>
        )}
      </div>

      <div className="media-progress-block">
        <div className="media-progress">
          <div
            className="media-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="media-times">
          <span>{elapsedText}</span>
          <span>{durationText}</span>
        </div>
      </div>

      <div className="media-controls">
        <button
          type="button"
          className="media-control"
          onClick={handlePreviousClick}
          aria-label="Previous track"
        >
          <i className="nf nf-md-skip_previous" />
        </button>

        <button
          type="button"
          className="media-control media-control-primary"
          onClick={handlePauseClick}
          aria-label={session.isPlaying ? "Pause" : "Play"}
        >
          <i className={`nf ${session.isPlaying ? "nf-md-pause" : "nf-md-play"}`} />
        </button>

        <button
          type="button"
          className="media-control"
          onClick={handleNextClick}
          aria-label="Next track"
        >
          <i className="nf nf-md-skip_next" />
        </button>
      </div>

      <div className="media-status-row">
        <span className={`media-status ${session.isPlaying ? "playing" : "paused"}`}>
          <i
            className={`nf ${
              session.isPlaying
                ? "nf-md-volume_high"
                : "nf-md-pause_circle_outline"
            }`}
          />
          {session.isPlaying ? "Playing" : "Paused"}
        </span>
      </div>
    </div>
  );
};

export default Media;

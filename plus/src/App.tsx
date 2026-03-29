import { useState, useEffect, useRef } from 'react';
import { createProviderGroup, shellExec } from 'zebar';

import { Left, Right, Center } from './Components';
import { Battery, BindingMode, CPU, Media, Memory, Network, Weather, Workspaces } from './Components/Applets';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { LogicalSize } from '@tauri-apps/api/dpi';

const tauriWindow = getCurrentWindow();

const providers = createProviderGroup({
  audio: { type: 'audio' },
  network: { type: 'network' },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu' },
  date: { type: 'date', formatting: 'EEE dd-MMM t' },
  battery: { type: 'battery' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  media: { type: 'media' },
});

const COLLAPSED_HEIGHT = 40;
const EXPANDED_HEIGHT = 400;

type LogicalGeometry = {
  width: number;
  height: number;
};

const App = () => {
  const [output, setOutput] = useState(providers.outputMap);
  const [mediaState, setMediaState] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const mediaContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  useEffect(() => {
    const loadWindowSize = async () => {
      try {
        const size = await tauriWindow.outerSize();
        const logical = size.toLogical(window.devicePixelRatio) as LogicalGeometry;
        setWindowWidth(logical.width);
      } catch (err) {
        console.error('Failed to get initial window size:', err);
      }
    };

    void loadWindowSize();
  }, []);

  const resizeBar = async (height: number) => {
    try {
      let width = windowWidth;

      if (!width) {
        const size = await tauriWindow.outerSize();
        const logical = size.toLogical(window.devicePixelRatio) as LogicalGeometry;
        width = logical.width;
        setWindowWidth(logical.width);
      }

      await tauriWindow.setSize(new LogicalSize(width, height));
    } catch (err) {
      console.error('Resize failed:', err);
    }
  };

  const openMedia = async () => {
    await resizeBar(EXPANDED_HEIGHT);
    setMediaState(true);
  };

  const closeMedia = async () => {
    await resizeBar(COLLAPSED_HEIGHT);
    setMediaState(false);
  };

  const toggleMedia = async () => {
    if (mediaState) {
      await closeMedia();
    } else {
      await openMedia();
    }
  };

  // Close when clicking inside the window but outside the Media area
  useEffect(() => {
    if (!mediaState) return;

    const handleMouseDown = (event: MouseEvent) => {
      const container = mediaContainerRef.current;
      if (!container) return;

      if (event.target instanceof Node && !container.contains(event.target)) {
        void closeMedia();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [mediaState, windowWidth]);

  // Close when clicking outside the window / losing focus
  useEffect(() => {
    let unlisten: null | (() => void) = null;

    const setup = async () => {
      unlisten = await tauriWindow.onFocusChanged(({ payload: focused }) => {
        if (!focused && mediaState) {
          void closeMedia();
        }
      });
    };

    void setup();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [mediaState, windowWidth]);

  return (
    <div className="app">
      <Left>
        <i className="logo nf nf-fa-windows"></i>
        <Workspaces
          glazewm={output.glazewm}
          fontFamily='NerdFontsSymbols Nerd Font'
        />
      </Left>

      <Center>
        <div ref={mediaContainerRef}>
          {mediaState ? (
            <Media
              media={output.media}
              onClick={toggleMedia}
            />
          ) : (
            <button 
              className="interactive" 
              onClick={toggleMedia}
            >
              {output.date?.formatted}
            </button>
          )}
        </div>
      </Center>
      <Right>
        <BindingMode glazewm={output.glazewm} />
        <Network network={output.network} />
        <button
          className='interactive'
          onClick={() => shellExec('powershell', '-Command Start-Process taskmgr')}
        >
          <Memory memory={output.memory} />
          <CPU cpu={output.cpu} />
        </button>
        <Battery battery={output.battery} />
        <Weather weather={output.weather} />
      </Right>
    </div>
  );
}

export default App

import { useState, useEffect } from 'react';
import { createProviderGroup, shellExec } from 'zebar';

import { Left, Right, Center } from './Components';
import { Battery, BindingMode, CPU, Media, Memory, Network, Weather, Workspaces } from './Components/Applets';

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

const App = () => {
  const [output, setOutput] = useState(providers.outputMap);
  const [mediaState, setMediaState] = useState(true);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  return (
    <div className="app">
      <Left>
        <Workspaces
          glazewm={output.glazewm}
          fontFamily='NerdFontsSymbols Nerd Font'
        />
      </Left>

      <Center>
        {mediaState ? (
          <button className='interactive' onClick={() => setMediaState(false)}>
            {output.date?.formatted}
          </button>
        ) : (
          <Media
            media={output.media}
            onClick={() => {
              setMediaState(true);
            }}
          />
        )}

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

# Zebar Display UI (Vite + React + TypeScript)

This project is a lightweight, customizable Zebar widget display built with Vite, React, and TypeScript. It uses Nerd Fonts for iconography and provides quick access to system settings and media controls through an interactive bar UI.

## Features

- **Workspace display** via GlazeWM integration.
- **Media toggle**: Click the datetime in the center to reveal/hide the media player.
- **System shortcuts**:
  - **Network Status**: Opens Windows Network Settings.
  - **Weather**: Opens Bing Weather.
  - **CPU & Memory**: Opens Task Manager.
  - **Battery**: Opens Windows Power & Sleep Settings.
- **Icon support**: Uses Nerd Fonts to render icons cleanly.

## Components Overview

- `Left`: Displays GlazeWM workspaces.
- `Center`: Displays formatted datetime or the media player depending on state.
- `Right`: Includes bindings, network status, memory/CPU info, battery level, and weather.

## Interactions

| Component          | Action (on click)                                         |
|--------------------|-----------------------------------------------------------|
| **Workstations**   | Switches between active workstations                      |
| **Datetime**       | Toggles between displaying date and current media session |
| **Network**        | Opens: `ms-settings:network-status`                       |
| **Weather**        | Opens: `bingweather://`                                   |
| **CPU & Memory**   | Opens: `taskmgr`                                          |
| **Battery**        | Opens: `ms-settings:powersleep`                           |

## Build

### With NPM
1. **Clone the main branch**
    ```bash
    git clone https://github.com/srcthird/frigid-zebar.git
    ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the vite in watch mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### As static (no dependecies)
1. **Clone the build branch**
    ```bash
    git clone https://github.com/srcthird/frigid-zebar.git -b build
    ```

## Setup

1. **Move the build to your zebar location**
    ```bash
    Move-Item -Path .\frigid-zebar -Destination ~\.glzwm\zebar
    ```

2. **Edit default zebar config**
    ```bash
    nvim ~\.glzwm\zebar\settings.json
    ```

3. **Change the default to frigid-zebar**
    ```json
    {
      "$schema": "https://github.com/glzr-io/zebar/raw/v2.4.0/resources/settings-schema.json",
      "startupConfigs": [
        {
          "path": "frigid-zebar/primary.zebar.json",
          "preset": "default"
        }
      ]
    }
    ```

## Requirements

- **Windows**: System shortcuts rely on PowerShell to launch Windows settings.
- **Zebar**: Must be configured to load this React app into a widget layer.

## Notes

- Media toggle state is preserved while the app is running, defaulting to datetime view.
- All clickable elements use the `interactive` class and respond to user interaction for accessibility and consistency.

## License

Apache License

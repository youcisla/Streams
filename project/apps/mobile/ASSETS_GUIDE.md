# Mobile App Assets Setup

## Required Assets (to add later):

Create the following image files in `apps/mobile/assets/`:

### 1. App Icon (`icon.png`)
- Size: 1024x1024 pixels
- Format: PNG with transparent background
- Purpose: Main app icon

### 2. Splash Screen (`splash.png`) 
- Size: 1242x2436 pixels (or larger)
- Format: PNG
- Purpose: Loading screen image
- Background: Dark (#000000)

### 3. Favicon (`favicon.png`)
- Size: 32x32 pixels
- Format: PNG
- Purpose: Web browser favicon

### 4. Android Adaptive Icon (`adaptive-icon.png`)
- Size: 1024x1024 pixels
- Format: PNG
- Purpose: Android adaptive icon foreground

### 5. Notification Icon (`notification-icon.png`)
- Size: 256x256 pixels  
- Format: PNG
- Purpose: Push notification icon

## Temporary Solution
For now, I've removed these asset references from `app.json` so the app can run without them. 

## To Add Assets Later:
1. Create the image files listed above
2. Place them in `apps/mobile/assets/`
3. Uncomment the asset references in `app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png"
        }
      ]
    ]
  }
}
```

## Typography Assets

- The pixel/blocky typeface is provided by the [`@expo-google-fonts/press-start-2p`](https://fonts.google.com/specimen/Press+Start+2P) package (SIL Open Font License 1.1). Install dependencies after pulling changes with:

```bash
pnpm install
```

- No manual font files are required—Expo bundles the font at build time. For non-Expo platforms, be sure to include the same font family (e.g., via Google Fonts or `@fontsource/press-start-2p`).

### Adding Extra Google Fonts

1. Install the desired font package, e.g. `pnpm add @expo-google-fonts/press-start-2p`.
2. Import the font in `app/_layout.tsx` (or another central layout) and add it to the `useFonts` map alongside `PressStart2P_400Regular`.
3. Extend `packages/ui/src/theme.ts` to expose a new typography token (or override an existing one) so shared components can reference the additional family.
4. If only specific screens need the font, apply it via `StyleSheet.create` using the `fontFamily` returned from the hook. Remember to provide a sensible fallback for web environments the same way we do for `Press Start 2P`.

### Splash Screen Customization

- Splash colors and imagery are controlled from `apps/mobile/app.json` under the `expo.splash` block. Update `backgroundColor` to tweak the backdrop and point `image` to a PNG asset (drop it into `apps/mobile/assets/`).
- For higher pixel-art fidelity, create a `1242x2436` PNG with transparent borders, save it as `assets/splash.png`, and set `"resizeMode": "contain"` to prevent stretching.
- The splash screen stays visible until fonts finish loading (see `SplashScreen.preventAutoHideAsync()` in `app/_layout.tsx`). If you add additional async startup work, hide the splash manually only after all resources are ready to avoid flashing unstyled UI.
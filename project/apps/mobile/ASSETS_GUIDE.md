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
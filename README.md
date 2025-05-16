# Grand Prix Weather Mobile

A React Native app providing weather updates for Grand Prix events.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/grand-prix-weather-mobile.git
    cd grand-prix-weather-mobile/GrandPrixWeather
    ```

2. Install dependencies:
    ```sh
    yarn install
    # or
    npm install
    ```

### Running the App

#### Android

1. Start the Metro bundler:
    ```sh
    npx react-native start
    ```

2. In a new terminal, run the app:
    ```sh
    npx react-native run-android
    ```

#### iOS

> _Note: iOS development requires a Mac with Xcode installed._

1. Install CocoaPods dependencies:
    ```sh
    cd ios && pod install && cd ..
    ```

2. Run the app:
    ```sh
    npx react-native run-ios
    ```

## Additional Notes

- Ensure an Android emulator or device is connected for Android builds.
- For troubleshooting, see the [React Native documentation](https://reactnative.dev/docs/environment-setup).

## License

MIT
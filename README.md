# Document Processor App

A powerful React Native mobile application built with Expo for document processing and management with intuitive tab-based navigation.

## Features

- **Document Processing**: Advanced document processing capabilities with text extraction and manipulation
- **Batch Operations**: Process multiple documents simultaneously for improved efficiency
- **Storage Management**: Secure local storage with data persistence
- **Roman Numeral Conversion**: Built-in utility for roman numeral conversions
- **History Tracking**: Keep track of all processed documents and operations
- **Profile Management**: User profile and settings management
- **Cross-Platform**: Runs on both iOS and Android devices

## Tech Stack

- **Framework**: Expo SDK with React Native
- **Language**: TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **Styling**: React Native StyleSheet
- **Code Quality**: ESLint, Prettier
- **Development**: Hot reloading with Expo CLI

## Project Structure

```
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # Home screen
│   │   ├── batch.tsx      # Batch processing
│   │   ├── history.tsx    # Document history
│   │   └── profile.tsx    # User profile
│   ├── utils/             # Utility functions
│   │   ├── documentProcessor.ts
│   │   ├── storage.ts
│   │   └── romanConverter.ts
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── assets/                # Static assets
│   └── images/           # App icons and images
├── hooks/                 # Custom React hooks
└── expo/                 # Expo configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-processor-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

4. **Run on specific platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Available Scripts

- `npm run start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code linting

## Development

### Code Style

This project uses Prettier and ESLint to maintain consistent code style. Configuration files:
- `.prettierrc` - Prettier configuration
- `eslint.config.js` - ESLint configuration

### TypeScript

The project is fully typed with TypeScript. Type definitions are located in:
- `expo-env.d.ts` - Expo environment types
- `tsconfig.json` - TypeScript configuration

## Build and Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
expo build:android --release-channel production
expo build:ios --release-channel production
```

## Key Components

### Document Processor (`app/utils/documentProcessor.ts`)
Handles all document processing operations including text extraction, formatting, and manipulation.

### Storage Manager (`app/utils/storage.ts`)
Manages local data persistence and retrieval with secure storage practices.

### Roman Converter (`app/utils/romanConverter.ts`)
Utility for converting between roman numerals and decimal numbers.

## Navigation Structure

The app uses Expo Router with a tab-based navigation system:

- **Home**: Main dashboard and quick actions
- **Batch**: Bulk document processing interface
- **History**: View previously processed documents
- **Profile**: User settings and app configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes before submitting

## Performance Considerations

- Optimized for mobile performance
- Efficient memory management for document processing
- Lazy loading for improved startup times
- Proper cleanup of resources and event listeners

## Security

- Secure local storage implementation
- Input validation for document processing
- Safe handling of user data
- Regular dependency updates for security patches

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS build errors**: Ensure Xcode is updated to latest version
3. **Android build errors**: Check Android SDK and build tools versions
4. **TypeScript errors**: Run `npx tsc --noEmit` to check for type issues

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Documentation](https://reactnative.dev/docs/getting-started)
- Open an issue in this repository for project-specific problems

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [React Native](https://reactnative.dev/)
- Icons and assets from [Expo Vector Icons](https://icons.expo.fyi/)

---

**Happy Coding!** 🚀

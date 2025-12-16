# Stud3D

This project generates 3D walls for timber frame houses. [You can test it here](http://fgleyze.com/stud3d/)

## Tech Stack

- **React 18** with Vite
- **Three.js** via @react-three/fiber and @react-three/drei
- **Tailwind CSS 3**

## Development

```bash
# Install dependencies
npm install

# Start development server (port 3006)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the build configuration:

- Build command: `npm run build`
- Publish directory: `dist`

Simply connect your repository to Netlify and it will automatically deploy on push.

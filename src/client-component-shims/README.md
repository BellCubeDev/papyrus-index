# Papyrus Index - React Client Component Shims

This folder exists because, occasionally, some libraries that provide React client components may not have been designed with React's SSR model in mind. As such, they do not mark their components as client components. To work around this, we create shims that explicitly mark these components as client components so they can be used in our SSR environment without issues.

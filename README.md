# Analytics Dashboard built with React and Cube.js

This example project contains a demo dashboard built with [Cube.js](https://github.com/statsbotco/cubejs-client) and Flatlogic from the [Building Analytics React Dashboard with Cube.js](https://statsbot.co/blog/building-analytics-react-dashboard-with-cube.js) tutorial. 


## Develop and verify

Use Node.js 22.12 or newer and npm. `npm ci` installs the canonical
`package-lock.json`; `npm run build` creates the production `build` directory.
`npm start` serves development at `/cubejs-dashboard/`; `npm run preview`
serves the production build. `npm test` runs Chrome against the production
build, and `PLAYWRIGHT_DEV=1 npm test` checks the development server.

The Cube SDK uses the original demo URL/token by default. Set `VITE_CUBE_API_URL`
and `VITE_CUBE_TOKEN` for your Cube backend. These values are browser-visible
configuration. The SDK adapter keeps the existing queries and data layout;
connection errors are displayed in the dashboard.

The browser regression checks all five Cube queries through HTTP fixtures,
four plotted series, ten order rows, the Widgster collapse/expand API, visible
API errors and the existing local demo login/logout behavior. It does not
exercise a live Cube backend. This remains a public dashboard demo with local
sample authentication.

Vite replaces the ejected Webpack/node-sass toolchain. Unused template libraries
and the obsolete, unconfigured Enzyme scaffold test are removed; the real
browser checks cover the rendered dashboard instead.

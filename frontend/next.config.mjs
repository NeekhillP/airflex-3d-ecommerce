import { backendOrigin } from "./lib/backend.mjs";

export default {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendOrigin}/api/auth/:path*`,
      },
    ];
  },
};

const backendOrigin = process.env.BACKEND_ORIGIN || "http://127.0.0.1:3000";

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

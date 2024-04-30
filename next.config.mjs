/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
    prependData: `@import "variables";`,
  },
};

export default nextConfig;

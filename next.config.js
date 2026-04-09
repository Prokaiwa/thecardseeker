/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'limitlesstcg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
      },
      {
        protocol: 'https',
        hostname: 'pkmncards.com',
      },
      {
        protocol: 'https',
        hostname: '*.pokemonpricetracker.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.tcgdex.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {},
};

module.exports = nextConfig;

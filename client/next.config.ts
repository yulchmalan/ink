import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ["inkdyplom.s3.eu-central-1.amazonaws.com"],
  },
};

export default withNextIntl(nextConfig);

/* eslint-disable @next/next/no-img-element */

export default function ProductImage({ src, alt, className, style, fallback }) {
  if (!src) {
    return fallback ?? null;
  }

  return <img src={src} alt={alt} className={className} style={style} />;
}


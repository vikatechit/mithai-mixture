import { useState } from 'react'

export default function SmartImg({ src, fallback, alt, ...rest }) {
  const [current, setCurrent] = useState(src || fallback)
  return (
    <img
      src={current}
      alt={alt}
      {...rest}
      onError={() => {
        if (fallback && current !== fallback) setCurrent(fallback)
      }}
    />
  )
}

import { useEffect } from 'react'

export default function Seo({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title
    const tag = document.querySelector('meta[name="description"]')
    if (tag && description) tag.setAttribute('content', description)
    let robots = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, nofollow')
    } else if (robots) {
      robots.setAttribute('content', 'index, follow')
    }
  }, [title, description, noindex])
  return null
}

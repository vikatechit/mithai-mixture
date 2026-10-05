import { useEffect } from 'react'

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title
    const tag = document.querySelector('meta[name="description"]')
    if (tag && description) tag.setAttribute('content', description)
  }, [title, description])
  return null
}

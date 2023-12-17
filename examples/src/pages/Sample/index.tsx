import { HELLO } from "whisper-live"

export const metadata = {
  title: 'Sample',
  route: 'sample',
}

export default function Sample() {
  return (
    <div>
      <h1>Hello {HELLO}</h1>
    </div>
  )
}
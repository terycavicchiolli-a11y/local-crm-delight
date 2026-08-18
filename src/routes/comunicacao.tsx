import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/comunicacao')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/comunicacao"!</div>
}

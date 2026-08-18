import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/processos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/processos"!</div>
}

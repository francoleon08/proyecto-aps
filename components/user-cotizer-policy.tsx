"use client"

interface UserCotizerPolicyProps {
  onBack: () => void
}

export default function UserCotizerPolicy({ onBack }: UserCotizerPolicyProps) {
  return (
    <div>
      <h1>hola</h1>
      <button onClick={onBack}>Volver</button>
    </div>
  )
}

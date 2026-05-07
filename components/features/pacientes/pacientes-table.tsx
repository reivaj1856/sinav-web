import React from 'react'

type Paciente = { id: string; nombre: string; edad?: number }

export default function PacientesTable({ items = [] }: { items?: Paciente[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Edad</th>
        </tr>
      </thead>
      <tbody>
        {items.map(p => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>{p.edad ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

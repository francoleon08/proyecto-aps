import type { Request } from '@/types/custom'

export const REQUESTS_MOCK: Request[] = [
  {
    id: 1,
    client: 'Juan Pérez',
    event: 'Siniestro auto',
    date: '2025-10-15',
    state: 'pendiente',
    description: 'Colisión en intersección con daños en parachoques delantero y faro izquierdo.',
    amount: '$2,500',
  },
  {
    id: 2,
    client: 'Ana Gómez',
    event: 'Robo de vivienda',
    date: '2025-10-14',
    state: 'pendiente',
    description: 'Robo de electrodomésticos y objetos de valor durante ausencia del hogar.',
    amount: '$8,000',
  },
  {
    id: 3,
    client: 'Carlos Díaz',
    event: 'Accidente laboral',
    date: '2025-10-10',
    state: 'pendiente',
    description: 'Lesión en mano derecha durante operación de maquinaria industrial.',
    amount: '$3,200',
  },
  {
    id: 4,
    client: 'María López',
    event: 'Daño por agua',
    date: '2025-10-12',
    state: 'pendiente',
    description: 'Filtración de tubería causó daños en piso y muebles del baño.',
    amount: '$1,800',
  },
  {
    id: 5,
    client: 'Roberto Sánchez',
    event: 'Incendio parcial',
    date: '2025-10-08',
    state: 'pendiente',
    description: 'Incendio en cocina por cortocircuito eléctrico.',
    amount: '$5,500',
  },
]

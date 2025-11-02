import CompletedCarts from '../CompletedCarts'

export default function CompletedCartsExample() {
  const mockCarts = [
    {
      id: '1',
      cartNumber: 1,
      destination: 'AALSMEER (N.11)',
      tag: 'TAG5 (GIALLO)',
      bucketType: 'BLACK BUCKETS',
      totalPackages: 72,
      completedAt: new Date(),
      packages: [
        { id: '1', variety: 'MATTH IRON APRICOT', length: 60, quantity: 20 },
        { id: '2', variety: 'MATTH IRON PINK', length: 65, quantity: 30 },
        { id: '3', variety: 'MATTH GEM', length: 70, quantity: 22 },
      ]
    },
    {
      id: '2',
      cartNumber: 2,
      destination: 'NAALDWIJK (N.10)',
      tag: 'TAG5 (VERDE)',
      bucketType: 'PROCONA',
      totalPackages: 72,
      completedAt: new Date(),
      packages: [
        { id: '4', variety: 'MATTH YELLOW', length: 55, quantity: 35 },
        { id: '5', variety: 'MATTH WHITE', length: 60, quantity: 37 },
      ]
    }
  ]

  return <CompletedCarts carts={mockCarts} />
}

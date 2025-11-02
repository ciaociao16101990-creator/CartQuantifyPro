import PackageList from '../PackageList'

export default function PackageListExample() {
  const mockPackages = [
    { id: '1', variety: 'MATTH IRON APRICOT', length: 60, quantity: 5 },
    { id: '2', variety: 'MATTH IRON PINK', length: 65, quantity: 8 },
    { id: '3', variety: 'MATTH GEM', length: 70, quantity: 3 },
    { id: '4', variety: 'MATTH WHITE', length: 55, quantity: 2 },
  ]

  return (
    <PackageList
      packages={mockPackages}
      onEdit={(pkg) => console.log('Edit package:', pkg)}
      onDelete={(id) => console.log('Delete package:', id)}
    />
  )
}

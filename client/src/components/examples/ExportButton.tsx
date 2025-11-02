import ExportButton from '../ExportButton'

export default function ExportButtonExample() {
  return (
    <div className="h-96 relative">
      <ExportButton
        cartCount={3}
        onExport={async () => {
          console.log('Exporting all carts...')
          await new Promise(resolve => setTimeout(resolve, 1500))
          console.log('Export complete!')
        }}
      />
    </div>
  )
}

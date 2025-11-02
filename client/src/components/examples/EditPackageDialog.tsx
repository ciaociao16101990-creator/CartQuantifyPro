import { useState } from 'react'
import EditPackageDialog from '../EditPackageDialog'
import { Button } from '@/components/ui/button'

export default function EditPackageDialogExample() {
  const [open, setOpen] = useState(false)
  const mockPackage = { 
    id: '1', 
    variety: 'MATTH IRON APRICOT', 
    length: 60, 
    quantity: 5 
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Edit Dialog</Button>
      <EditPackageDialog
        open={open}
        onOpenChange={setOpen}
        package={mockPackage}
        onSave={(pkg) => {
          console.log('Package saved:', pkg)
          setOpen(false)
        }}
      />
    </>
  )
}

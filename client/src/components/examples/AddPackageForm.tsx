import AddPackageForm from '../AddPackageForm'

export default function AddPackageFormExample() {
  return (
    <AddPackageForm
      onAddPackage={(pkg) => console.log('Package added:', pkg)}
      disabled={false}
    />
  )
}

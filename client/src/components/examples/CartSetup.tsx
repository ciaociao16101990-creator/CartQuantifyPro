import CartSetup from '../CartSetup'

export default function CartSetupExample() {
  return (
    <CartSetup
      onStartCart={(setup) => console.log('Cart started with:', setup)}
    />
  )
}

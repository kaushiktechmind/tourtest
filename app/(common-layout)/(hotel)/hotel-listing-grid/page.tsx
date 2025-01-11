import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('./Abc'),
  { ssr: false }
)
 
export default function Page() {
  return (
      <DynamicComponentWithNoSSR />
  )
}
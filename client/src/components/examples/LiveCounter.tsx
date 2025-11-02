import LiveCounter from '../LiveCounter'

export default function LiveCounterExample() {
  return (
    <div className="space-y-4">
      <LiveCounter 
        current={18} 
        total={72} 
        cartNumber={1}
        destination="AALSMEER (N.11)"
        tag="TAG5 (GIALLO)"
        bucketType="BLACK BUCKETS"
      />
      <LiveCounter 
        current={65} 
        total={72} 
        cartNumber={2}
        destination="NAALDWIJK (N.10)"
        tag="TAG5 (VERDE)"
        bucketType="PROCONA"
      />
      <LiveCounter 
        current={72} 
        total={72} 
        cartNumber={3}
        destination="RIJNSBURG (N.9)"
        tag="TAG5 (GIALLO)"
        bucketType="CUSTOM-5"
      />
    </div>
  )
}

import type { PracticeDetail } from '../../../types/practice.types'
import { formatAmount } from '../../../utils/formatters'

type PracticeAmountsCardProps = {
  practice: PracticeDetail
}

export function PracticeAmountsCard({ practice }: PracticeAmountsCardProps) {
  return (
    <section className="detail-card">
      <h2>Importi</h2>
      <div className="detail-grid">
        <div className="detail-field">
          <span>Richiesto</span>
          <strong>{formatAmount(practice.requestedAmount, 'Non inserito')}</strong>
        </div>
        <div className="detail-field">
          <span>Concesso</span>
          <strong>{formatAmount(practice.grantedAmount, 'Non inserito')}</strong>
        </div>
        <div className="detail-field">
          <span>Fatturato</span>
          <strong>{formatAmount(practice.invoicedAmount, 'Non inserito')}</strong>
        </div>
        <div className="detail-field">
          <span>Liquidato</span>
          <strong>{formatAmount(practice.liquidatedAmount, 'Non inserito')}</strong>
        </div>
      </div>
    </section>
  )
}

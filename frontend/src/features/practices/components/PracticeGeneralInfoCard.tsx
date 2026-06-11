import type { PracticeDetail } from '../../../types/practice.types'
import { formatDate, formatText } from '../../../utils/formatters'

type PracticeGeneralInfoCardProps = {
  practice: PracticeDetail
}

export function PracticeGeneralInfoCard({ practice }: PracticeGeneralInfoCardProps) {
  return (
    <section className="detail-card">
      <h2>Dati principali</h2>
      <div className="detail-grid">
        <div className="detail-field">
          <span>Tipologia attivita</span>
          <strong>{formatText(practice.activityType, 'Non inserito')}</strong>
        </div>
        <div className="detail-field">
          <span>Data interrogatorio/udienza</span>
          <strong>{formatDate(practice.hearingDate, 'Non inserita')}</strong>
        </div>
        <div className="detail-field">
          <span>Data deposito</span>
          <strong>{formatDate(practice.depositDate, 'Non inserita')}</strong>
        </div>
        <div className="detail-field">
          <span>Competenza / ufficio</span>
          <strong>{formatText(practice.office, 'Non inserito')}</strong>
        </div>
        <div className="detail-field">
          <span>Autorita giudiziaria</span>
          <strong>{formatText(practice.judicialAuthority, 'Non inserito')}</strong>
        </div>
      </div>
      <div className="detail-field">
        <span>Note</span>
        <p>{formatText(practice.notes, 'Nessuna nota inserita.')}</p>
      </div>
    </section>
  )
}

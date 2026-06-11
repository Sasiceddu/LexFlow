import type { PracticeDetail } from '../../../types/practice.types'

type PracticePeopleCardProps = {
  practice: PracticeDetail
}

export function PracticePeopleCard({ practice }: PracticePeopleCardProps) {
  return (
    <section className="detail-card">
      <h2>Soggetti collegati</h2>
      <div className="detail-grid">
        <div className="detail-field">
          <span>Collaboratore di giustizia</span>
          <strong>{practice.collaborator?.displayName ?? 'Non assegnato'}</strong>
        </div>
        <div className="detail-field">
          <span>Professionista</span>
          <strong>{practice.professional?.displayName ?? 'Non assegnato'}</strong>
        </div>
      </div>
    </section>
  )
}

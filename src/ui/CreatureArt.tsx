import type { EnemyId } from '../data/enemies';

/** 敵の共通図版。戦闘スプライトと同じ種族画像を使う。 */
export function CreatureArt({ id, className = '' }: { id: EnemyId; className?: string }) {
  return <span className={`creature-art creature-${id} ${className}`} aria-hidden="true"><img src={`/assets/battle/${id}-v1.png`} alt="" draggable={false} /></span>;
}

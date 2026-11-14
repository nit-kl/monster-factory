import type { BodyId } from '../data/parts';
import type { EnemyId } from '../data/enemies';

/** 素体・敵の共通図版。装備の違いは隣の設計情報と3Dモデルで表示する。 */
export function CreatureArt({ id, className = '' }: { id: BodyId | EnemyId; className?: string }) {
  return <span className={`creature-art creature-${id} ${className}`} aria-hidden="true"><img src={`/assets/battle/${id}-v1.png`} alt="" draggable={false} /></span>;
}

import { useEffect, useRef } from 'react';
import type { StaffId } from '../data/staff';
import { Conversation } from './StoryView';

export function ConversationDialog({ selected, onClose }: { selected: StaffId; onClose: () => void }) {
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const element = dialog.current!;
  const previous = document.activeElement as HTMLElement | null;
  element.showModal();
  element.querySelector<HTMLElement>('h3')?.focus();
  return () => { element.close(); previous?.focus(); };
 }, []);
 return <dialog ref={dialog} className="conversation-dialog" aria-label="担当者との相談" onCancel={event => { event.preventDefault(); onClose(); }}>
  <div className="conversation-dialog-header"><span>工場での相談</span><button onClick={onClose}>会話を閉じる</button></div>
  <Conversation selected={selected} onNavigate={onClose}/>
 </dialog>;
}

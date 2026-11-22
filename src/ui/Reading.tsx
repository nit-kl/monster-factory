/** Keep the same readings in dialogue, choices and the conversation log. */
const readings: Record<string,string> = {
  中央製造棟:'ちゅうおうせいぞうとう', 製造棟:'せいぞうとう', 培養:'ばいよう', 煙突:'えんとつ', 一騎打ち:'いっきうち', 複製:'ふくせい', 部族:'ぶぞく', 魔導師:'まどうし', 宰相:'さいしょう', 陛下:'へいか', 侍女:'じじょ', 玉座:'ぎょくざ', 辺境:'へんきょう',
  影武者:'かげむしゃ', 四天王:'してんのう', 密命:'みつめい', 培養槽:'ばいようそう',
  配合台:'はいごうだい', 格納庫:'かくのうこ', 換気塔:'かんきとう', 迎撃:'げいげき',
  模擬戦:'もぎせん', 蒸留:'じょうりゅう', 斥候:'せっこう', 共鳴:'きょうめい',
  護衛:'ごえい', 療養棟:'りょうようとう', 素体:'そたい', 戦況:'せんきょう',
  侵攻:'しんこう', 偵察:'ていさつ', 監査:'かんさ', 監察官:'かんさつかん', 封印:'ふういん',
};
const terms = new RegExp('('+Object.keys(readings).join('|')+')(?!（)','g');
export function Reading({text}:{text:string}){
  return <>{text.split(terms).map((part,i)=>i%2
    ? <ruby key={i}>{part}<rt>{readings[part]}</rt></ruby>
    : part)}</>;
}


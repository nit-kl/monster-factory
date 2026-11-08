# Game design — current working concept

## Core loop
1. **Briefing:** hero enemy composition/constraints and available materials.
2. **Design:** choose a **base body** (slime, golem, beast in prototype), attack organ, defense organ; later support organ and mental core.
3. **Manufacture:** resources → body cultivation → organ attachment → mind tuning / quality check → dispatch. Process variants impact performance and cost; line layout/optimization grows later.
4. **Autobattle:** encounter hero units with recognizable counterplay; player chooses design and deployment rather than direct action controls.
5. **Analyze:** show specific loss reasons (e.g., self-inflicted fire damage) with a combat log and damage breakdown.
6. **Improve:** edit organs, add process enhancements, retrain survivors, repeat.

## Example prototype mechanics
- Body examples: **Slime** (flexible/fast/light), **Golem** (tough/slow), **Beast** (agile/aggressive).
- Attack organs: fire sac (high damage, can self-burn), claws, venom gland.
- Defensive organs: stone shell (resistant but heavy), regeneration core, light armor.
- Concrete tactical puzzle: fire organ causes self-burn on vulnerable bodies; stone shell or heat-resistant manufacturing step prevents it, at cost of speed, resources, or capacity.
- Opponents: swordsman, mage, archer initially; later healer, paladin, hero. Different battles make different combinations useful.
- Factory process examples: rapid culture (faster but less durable), high-temperature culture (heat protection / cold weakness), group culture (cooperation), long culture (more tactical initiative / slower production).
- Survivors can gain combat history and behavior traits; a mentor/training role later allows them to teach new units.
- **Important:** Don't implement procedural permutations that look different but feel identical. Visible behavior changes must follow parts/process modifications.

## Five-minute exhibition vertical slice (proposed)
- 0:00–0:45: Lisette introduces factory crisis; an invading hero team is imminent.
- 0:45–1:30: choose body + organs, watch birth animation.
- 1:30–2:30: first automatic fight; fire creature loses because of self-burn, with humorous staff reactions.
- 2:30–3:30: add cooling/heat-resistance stage; manufacture improved creature.
- 3:30–4:30: win rematch in visually clear fight.
- 4:30–5:00: small created slime Pluru unexpectedly speaks a meaningful human phrase, hinting at larger mystery.
This is a scripted onboarding demo so everyone experiences the 'aha' moment; later levels should allow broader experimentation.

## Alpha scope (proposed)
- 1 small factory map; 3 bodies; 3 attack organs; 3 defense organs; 3 basic manufacturing devices; 3 enemy kinds; 2 battle scenarios; 5 main onscreen staff/creatures; intro story; save/load; 15–20 minutes of content.
- Exclude multiplayer, backend, account, extensive tech trees, genetic simulation, and large-scale Factorio-style free construction.

## Story arc
Setting: a nearly bankrupt remote demon army factory (the Seventh Monster Manufacturing Plant) in a centuries-long war between demon and hero armies. A new manager arrives and struggles to meet quotas with oddball colleagues.
- Ch.1: save the factory, build trust in a colorful workplace.
- Ch.2: an apparently defective manufactured creature holds memories it shouldn't; clashes about whether created monsters are tools or persons.
- Ch.3: hero invasions and battle records repeat uncannily; suspicion that the war itself is maintained by an underlying system.
- Ch.4: hidden 'Factory Zero', links between hero and demon manufacturing technologies; conflicting moral claims.
- Finale: refit the factory for continued war **or** transform its production line to sustain life and end the cycle (possible endings; not locked).
Never presume **all** monsters are manufactured. Natural species, ancient creatures, magical life, and factory-grown monsters coexist. The theme is the value of life independent of its origin.

## Character-driven gameplay
Each major worker specializes in a real factory or combat system; collaboration/trust may unlock machines or research. Avoid punitive relationship meters that make beloved characters unusable. Staff choices should involve genuine trade-offs, not one obvious correct morality answer.

import { Condition, Encounter, Player, StatBlock } from "@/types";
import { randomRange } from "@/utils";
import { v4 } from 'uuid'
import encounterStore from "./encounterStore";
import { DEFAULT_STORE } from "@/constants";

export default class EncounterStateHandler {
    timeoutId?: number
    onUpdateEncounter: (encounter: Encounter) => Promise<void>

    constructor(encounter: Encounter, onUpdateEncounter: (encounter: Encounter) => Promise<void>) {
        encounterStore.set(encounter)
        this.onUpdateEncounter = onUpdateEncounter;
    }

    async updateEncounter(encounter: Encounter) {
        encounter.combatants.sort((a, b) => b.initiative - a.initiative)
        encounterStore.set(encounter)
        await this.onUpdateEncounter(encounter)
    }

    updateEncounterDeferred(curr: Encounter, encounter: Encounter) {
        const prevEncounter = structuredClone(curr)
        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(async () => {
            try {
                this.updateEncounter(encounter)
            } catch (e) {
                encounterStore.set(prevEncounter)
            }
        }, 1000) as unknown as number
    }

    public addPlayer(curr: Encounter, player: Player) {
        const encounterClone = structuredClone(curr) as Encounter
        
        encounterClone.combatants.push({
            id: v4(),
            initiative: 20,
            player,
        })

        this.updateEncounter(encounterClone)
    }

    public addMonster(curr: Encounter, monster: StatBlock) {
        const encounterClone = structuredClone(curr) as Encounter
        
        encounterClone.combatants.push({
            id: v4(),
            initiative: randomRange(1, 20),
            hp: monster.hp,
            statBlock: monster,
        })

        this.updateEncounter(encounterClone)
    }

    public removeCombatant(curr: Encounter, combatantId: string) {
        const encounterClone = structuredClone(curr) as Encounter
        
        encounterClone.combatants = encounterClone.combatants.filter(combatant => combatant.id !== combatantId)

        this.updateEncounter(encounterClone)
    }

    public nextCombatant(curr: Encounter) {
        const encounterClone = structuredClone(curr) as Encounter
        const isLastCombatant = encounterClone.currentCombatantIndex === encounterClone.combatants.length - 1
        const isFirstTurn = encounterClone.turns === 0
        const newIndex = isFirstTurn ? 0 : isLastCombatant ? 0 : (encounterClone.currentCombatantIndex ?? 0) + 1
        
        encounterClone.turns++
        encounterClone.currentCombatantIndex = newIndex
        encounterClone.focusedCombatantIndex = newIndex
        
        if (encounterClone.combatants[newIndex].hp === 0) {
            this.nextCombatant(encounterClone)
            return
        }

        this.updateEncounter(encounterClone)
    }

    public prevCombatant(curr: Encounter,) {
        if (curr.turns <= 1) return

        const encounterClone = structuredClone(curr) as Encounter
        const isFirstCombatant = encounterClone.currentCombatantIndex === 0
        const newIndex = isFirstCombatant ? encounterClone.combatants.length - 1 : (encounterClone.currentCombatantIndex ?? 0) - 1
        
        encounterClone.turns--
        encounterClone.currentCombatantIndex = newIndex
        encounterClone.focusedCombatantIndex = newIndex

        if (encounterClone.combatants[newIndex].hp === 0) {
            this.prevCombatant(encounterClone)
            return
        }

        this.updateEncounter(encounterClone)
    }

    public changeFocus(curr: Encounter, combatantId: string) {
        const encounterClone = structuredClone(curr) as Encounter
        const combatantIndex = encounterClone.combatants.findIndex(combatant => combatant.id === combatantId)

        if (combatantIndex !== -1) {
            encounterClone.focusedCombatantIndex = combatantIndex
        }

        this.updateEncounter(encounterClone)
    }

    public updateInitiative(curr: Encounter, combatantId: string, initiative: string) {
        const parsedInitiative = parseInt(initiative)
        if (isNaN(parsedInitiative)) return

        const encounterClone = structuredClone(curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.initiative = parsedInitiative
        }

        this.updateEncounterDeferred(curr, encounterClone)
    }

    public updateHp(curr: Encounter, combatantId: string, hp: string) {
        const parsedHp = parseInt(hp)
        if (isNaN(parsedHp)) return

        const encounterClone = structuredClone(curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.hp = parsedHp
        }

        this.updateEncounterDeferred(curr, encounterClone)
    }

    public updateNotes(curr: Encounter, combatantId: string, notes: string) {
        const encounterClone = structuredClone(curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.notes = notes
        }

        this.updateEncounterDeferred(curr, encounterClone)
    }

    public toggleCondition(curr: Encounter, combatantId: string, condition: Condition) {
        const encounterClone = structuredClone(curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)
        if (!combatant) return

        if (!combatant.conditions) {
            combatant.conditions = []
        }

        if (combatant.conditions?.includes(condition)) {
            combatant.conditions = combatant.conditions.filter(c => c !== condition)
        } else {
            combatant.conditions.push(condition)
        }

        this.updateEncounter(encounterClone)
    }

    public clearEncounter() {
        this.updateEncounter(DEFAULT_STORE.lastEncounter)
    }
}
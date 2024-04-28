import { Condition, Encounter, Player, StatBlock } from "@/types";
import { getCurrentCombatant, getFocusedCombatant, randomRange } from "@/utils";
import { v4 } from 'uuid'
import encounterStore from "./encounterStore";
import { DEFAULT_STORE } from "@/constants";

export type WriteEncounterToDiscFn = (encounter: Encounter) => Promise<void>

export default class EncounterStateHandler {
    curr: Encounter
    onWriteEncounterToDisc: WriteEncounterToDiscFn
    updateDebounceTimeoutId?: number

    constructor(onWriteEncounterToDisc: WriteEncounterToDiscFn) {
        encounterStore.subscribe((e) => this.curr = e.encounter)
        this.onWriteEncounterToDisc = onWriteEncounterToDisc;
    }

    async updateEncounter(encounter: Encounter) {
        encounter.combatants.sort((a, b) => b.initiative - a.initiative)
        encounterStore.update((e) => e = {
            ...e,
            encounter,
            currentCombatant: getCurrentCombatant(encounter),
            focusedCombatant: getFocusedCombatant(encounter)
        })
        
        await this.onWriteEncounterToDisc(encounter)
    }

    updateEncounterDeferred(encounter: Encounter) {
        const prevEncounter = structuredClone(this.curr)
        clearTimeout(this.updateDebounceTimeoutId);

        this.updateDebounceTimeoutId = setTimeout(async () => {
            try {
                this.updateEncounter(encounter)
            } catch (e) {
                this.updateEncounter(prevEncounter)
            }
        }, 1000) as unknown as number
    }

    public addPlayer(player: Player) {
        const encounterClone = structuredClone(this.curr) as Encounter
        
        encounterClone.combatants.push({
            id: v4(),
            initiative: 20,
            player,
        })

        this.updateEncounter(encounterClone)
    }

    public addMonster(monster: StatBlock) {
        const encounterClone = structuredClone(this.curr) as Encounter
        
        encounterClone.combatants.push({
            id: v4(),
            initiative: randomRange(1, 20),
            hp: monster.hp,
            statBlock: monster,
        })

        this.updateEncounter(encounterClone)
    }

    public removeCombatant(combatantId: string) {
        const encounterClone = structuredClone(this.curr) as Encounter
        
        encounterClone.combatants = encounterClone.combatants.filter(combatant => combatant.id !== combatantId)

        this.updateEncounter(encounterClone)
    }

    public nextCombatant(encounter?: Encounter) {
        const encounterClone = encounter ?? structuredClone(this.curr) as Encounter
        const isLastCombatant = encounterClone.currentCombatantIndex === encounterClone.combatants.length - 1
        const isFirstTurn = encounterClone.turns === 0
        const newIndex = isFirstTurn ? 0 : isLastCombatant ? 0 : (encounterClone.currentCombatantIndex ?? 0) + 1
        
        encounterClone.turns++
        encounterClone.currentCombatantIndex = newIndex
        encounterClone.focusedCombatantIndex = newIndex
        
        if (encounterClone.combatants[newIndex].hp === 0) {
            console.log('Got here', encounterClone.combatants[newIndex])
            this.nextCombatant(encounterClone)
            return
        }

        this.updateEncounter(encounterClone)
    }

    public prevCombatant(encounter?: Encounter) {
        if (this.curr.turns <= 1) return

        const encounterClone = encounter ?? structuredClone(this.curr) as Encounter
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

    public changeFocus(combatantId: string) {
        const encounterClone = structuredClone(this.curr) as Encounter
        const combatantIndex = encounterClone.combatants.findIndex(combatant => combatant.id === combatantId)

        if (combatantIndex !== -1) {
            encounterClone.focusedCombatantIndex = combatantIndex
        }

        this.updateEncounter(encounterClone)
    }

    public updateInitiative(combatantId: string, initiative: string) {
        const parsedInitiative = parseInt(initiative)
        if (isNaN(parsedInitiative)) return

        const encounterClone = structuredClone(this.curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.initiative = parsedInitiative
        }

        this.updateEncounterDeferred(encounterClone)
    }

    public updateHp(combatantId: string, hp: string) {
        const parsedHp = parseInt(hp)
        if (isNaN(parsedHp)) return

        const encounterClone = structuredClone(this.curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.hp = parsedHp
        }

        this.updateEncounterDeferred(encounterClone)
    }

    public updateNotes(combatantId: string, notes: string) {
        const encounterClone = structuredClone(this.curr) as Encounter
        const combatant = encounterClone.combatants.find(combatant => combatant.id === combatantId)

        if (combatant) {
            combatant.notes = notes
        }

        this.updateEncounterDeferred(encounterClone)
    }

    public toggleCondition(combatantId: string, condition: Condition) {
        const encounterClone = structuredClone(this.curr) as Encounter
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
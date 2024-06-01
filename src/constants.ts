import { CampaignStore, StatBlock } from "./types"
import { v4 } from 'uuid'

export const STORE_FILENAME = 'campaignstore.json'
export const BLOCK_PREVIEW_LANG = 'rp-block'
export const APP_NAME = 'RP Toolbox'
export const ENCOUNTER_VIEW = 'encounter-view'
export const NPCS_VIEW = 'npcs-view'

export const SIZES = [
    'Tiny',
    'Small',
    'Medium',
    'Large',
    'Huge',
    'Gargantuan'
] as const

export const MONSTER_TYPES = [
    "Other",
    "Aberration",
    "Beast",
    "Celestial",
    "Construct",
    "Dragon",
    "Elemental",
    "Fey",
    "Fiend",
    "Giant",
    "Humanoid",
    "Monstrosity",
    "Ooze",
    "Plant",
    "Undead"
] as const

export const LANGUAGES = [
    "Abyssal",
    "All",
    "Aquan",
    "Auran",
    "Celestial",
    "Common",
    "Deep Speech",
    "Draconic",
    "Dwarvish",
    "Elvish",
    "Giant",
    "Gnomish",
    "Goblin",
    "Halfling",
    "Ignan",
    "Infernal",
    "Orc",
    "Primordial",
    "Sylvan",
    "Terran",
    "Undercommon",
    "Other",
] as const

export const CONDITIONS = [
    "Blinded",
    "Charmed",
    "Deafened",
    "Exhaustion",
    "Frightened",
    "Grappled",
    "Incapacitated",
    "Invisible",
    "Paralyzed",
    "Petrified",
    "Poisoned",
    "Prone",
    "Restrained",
    "Stunned",
    "Unconscious"
] as const

export const EMOJI_DUMP = [
    "😊", "🚀", "🌈", "🎉", "🔥", "🌟", "❤️", "🍀", "🤖", "🎈",
    "🌺", "🍔", "🚗", "🎸", "🍕", "🏆", "🚢", "🌮", "🎨", "🚲",
    "🍦", "🎮", "🎤", "🍭", "🏖️", "🍻", "🍩", "🎭", "🏀", "🍉",
    "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄",
    "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️",
    "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭", "🏀",
    "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️",
    "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁",
    "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭",
    "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲",
    "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈",
    "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩",
    "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂",
    "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻",
    "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻",
    "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓",
    "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯",
    "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁",
    "🍻", "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃",
    "🎓", "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂",
    "🎯", "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟",
    "🚁", "🍻", "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳",
    "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢",
    "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹",
    "🍟", "🚁", "🍻", "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁",
    "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇",
    "🎢", "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒",
    "🏹", "🍟", "🚁", "🍻", "🍩", "🎭", "🏀", "🍉", "🍓", "🏹",
    "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰",
    "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️",
    "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭", "🏀", "🍉", "🍓",
    "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄", "🚤",
    "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️", "🌌",
    "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭", "🏀", "🍉",
    "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️", "🌄",
    "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁", "🏕️",
    "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭", "🏀",
    "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲", "🏄‍♂️",
    "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈", "🍁",
    "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩", "🎭",
    "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂", "🎲",
    "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻", "🏈",
    "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻", "🍩",
    "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓", "🚂",
    "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯", "🎻",
    "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁", "🍻",
    "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃", "🎓",
    "🚂", "🎲", "🏄‍♂️", "🌄", "🚤", "🏰", "🍇", "🎢", "🍂", "🎯",
    "🎻", "🏈", "🍁", "🏕️", "🌌", "🏎️", "🍒", "🏹", "🍟", "🚁",
    "🍻", "🍩", "🎭", "🏀", "🍉", "🍓", "🏹", "🚁", "🎳", "🎃",
]

export const EXAMPLE_EASY_NPC: StatBlock = {
    id: v4(),
    name: 'Zombie',
    ac: 10,
    hp: 22,
    speeds: {
        ground: 10,
    },
    alignment: 'Unaligned',
    type: 'Undead',
    size: 'Medium',
    languages: [
        'Other'
    ],
    senses: {
        blindsight: 10,
        darkvision: 10,
        truesight: 0,
        tremorsense: 0,
    },
    abilityScores: {
        str: 10,
        dex: 10,
        int: 0,
        wis: 0,
        cha: 0,
        con: 10
    },
    actions: [
        {
            name: 'Punch',
            description: 'The zombie punches its target, dealing 1d6 damage on a successful hit.'
        }
    ],
    bonusActions: [
        {
            name: 'Gurgle',
            description: 'As a bonus action, the zombie can gurgle loudly.'
        }
    ],
    abilites: [
        {
            name: 'Undead Fortitude',
            description: 'If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.'
        }
    ],
}

export const EXAMPLE_MEDIUM_NPC: StatBlock = {
    id: v4(),
    name: 'Orc',
    ac: 13,
    hp: 45,
    speeds: {
        ground: 30,
    },
    alignment: 'Chaotic Evil',
    type: 'Humanoid',
    size: 'Medium',
    languages: [
        'Common',
        'Orc'
    ],
    senses: {
        blindsight: 0,
        darkvision: 60,
        truesight: 0,
        tremorsense: 0,
    },
    abilityScores: {
        str: 16,
        dex: 12,
        int: 7,
        wis: 11,
        cha: 10,
        con: 16
    },
    actions: [
        {
            name: 'Greataxe',
            description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.'
        },
        {
            name: 'Javelin',
            description: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.'
        }
    ],
    bonusActions: [],
    abilites: [
        {
            name: 'Roar',
            description: 'As a bonus action, the orc lets out a powerful roar, inspiring nearby orcs. All friendly orcs within 30 feet of the orc gain advantage on their next attack roll.'
        }
    ],
}

export const EXAMPLE_LEGENDARY_NPC: StatBlock = {
    id: v4(),
    name: 'Ancient Red Dragon',
    ac: 22,
    hp: 546,
    speeds: {
        ground: 40,
        fly: 80
    },
    alignment: 'Chaotic Evil',
    type: 'Dragon',
    size: 'Gargantuan',
    languages: [
        'Common',
        'Draconic'
    ],
    senses: {
        blindsight: 60,
        darkvision: 120,
        truesight: 60,
        tremorsense: 60,
    },
    abilityScores: {
        str: 30,
        dex: 10,
        int: 16,
        wis: 13,
        cha: 21,
        con: 29
    },
    actions: [
        {
            name: 'Multiattack',
            description: 'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.'
        },
        {
            name: 'Bite',
            description: 'Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) fire damage.'
        },
        {
            name: 'Claw',
            description: 'Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage.'
        },
        {
            name: 'Tail',
            description: 'Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage.'
        },
        {
            name: 'Frightful Presence',
            description: 'Each creature of the dragon\'s choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.'
        },
        {
            name: 'Fire Breath (Recharge 5-6)',
            description: 'The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one.'
        }
    ],
    bonusActions: [],
    abilites: [
        {
            name: 'Legendary Actions',
            description: 'The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature\'s turn. The dragon regains spent legendary actions at the start of its turn.\n\n- Detect: The dragon makes a Wisdom (Perception) check.\n- Tail Attack: The dragon makes a tail attack.\n- Wing Attack (Costs 2 Actions): The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.'
        }
    ],
    legendary: {
        actions: [
            {
                name: 'Detect',
                description: 'The dragon makes a Wisdom (Perception) check.'
            },
            {
                name: 'Tail Attack',
                description: 'The dragon makes a tail attack.'
            },
            {
                name: 'Wing Attack (Costs 2 Actions)',
                description: 'The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.'
            
            }
        ]
    }
}

export const EXAMPLE_FOR_AI_PROMPT = `
{
    "id": "1", // Unique identifier for the stat block
    "name": "Dragon", // Name of the creature
    "ac": 18, // Armor Class
    "hp": 200, // Hit Points
    "speeds": { // Speeds in feet per round. Omit the any of the properties if the creature can't move that way
        "ground": 30,
        "fly": 60,
        "swim": 20,
        "climb": 20
    },
    "abilityScores": { // DnD 5e ability scores
        "str": 20,
        "dex": 10,
        "int": 14,
        "wis": 12,
        "cha": 16,
        "con": 18
    },
    "alignment": "Chaotic Evil", // Alignment of the creature
    "type": "Dragon", // Options: "Other", "Aberration", "Beast", "Celestial", "Construct", "Dragon", "Elemental", "Fey", "Fiend", "Giant", "Humanoid", "Monstrosity", "Ooze", "Plant", "Undead"
    "size": "Large", // Options: "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"
    "languages": ["Common", "Draconic"], // Options: "Abyssal", "All", "Aquan", "Auran", "Celestial", "Common", "Deep Speech", "Draconic", "Dwarvish", "Elvish", "Giant", "Gnomish", "Goblin", "Halfling", "Ignan", "Infernal", "Orc", "Primordial", "Sylvan", "Terran", "Undercommon", "Other"
    "senses": { // Omit the any of the properties if the creature doesn't have that sense
        "blindsight": 60,
        "darkvision": 120,
        "tremorsense": 20,
        "truesight": 30
    },
    "actions": [ // Omitted if the creature has no actions
        {
            "name": "Bite",
            "description": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage."
        },
        {
            "name": "Tail",
            "description": "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage."
        }
    ],
    "bonusActions": [ // Omitted if the creature has no bonus actions
        {
            "name": "Claw Swipe",
            "description": "The dragon makes a claw swipe attack as a bonus action."
        }
    ],
    "abilities": [ // Special abilities, reactions, and lair actions the creature can take, can be omitted if the creature has no abilities
        {
            "name": "Frightful Presence",
            "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
        }
    ],
    "legendary": { // Omitted if the creature is not legendary
        "hasResistance": true, // Whether the creature has legendary resistance
        "actions": [ // Legendary actions the creature can take
            {
                "name": "Tail Attack",
                "description": "The dragon makes a tail attack."
            }
        ]
    }
}
`

export const DEFAULT_STORE: CampaignStore = {
    npcs: [
        EXAMPLE_EASY_NPC,
        EXAMPLE_MEDIUM_NPC,
        EXAMPLE_LEGENDARY_NPC,
    ],
    players: [],
    lastEncounter: {
        combatants: [],
        turns: 0,
        currentCombatantIndex: null,
        focusedCombatantIndex: null,
    }
}
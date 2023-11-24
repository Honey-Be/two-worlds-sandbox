import { PaymentType } from "./utils";

export type CellType = "infrastructure" | "land" | "lotto" | "charity" | "chance" | "transportation" | "hospital" | "park" | "concert" | "university" | "jail" | "start";

export const INFRASTRUCTURE_NAMES={
    "water": "수자원",
    "electricity": "전력",
    "cng": "도시가스"
}



export type TransactionType = {get?: number; pay?: number}

export interface ICellData {
    get type(): CellType;
    get name(): string;
    get isBuildable(): boolean;
    get paymentInfo(): PaymentType[]
    readonly group_id?: number
}

export class Infrastructure implements ICellData {
    public get type(): CellType { return "infrastructure" }
    private readonly kind: keyof (typeof INFRASTRUCTURE_NAMES);
    private constructor(kind: keyof (typeof INFRASTRUCTURE_NAMES)) {
        this.kind = kind;
    }
    public get isBuildable() { return false }
    public get name() { return INFRASTRUCTURE_NAMES[this.kind] }
    public get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2L",
            cost: {default: 300000}
        }]
    }
    public static readonly Infrastructures = (key: keyof typeof INFRASTRUCTURE_NAMES) => {
        return new Infrastructure(key)
    }
}

export class Land implements ICellData {
    get type(): CellType { return "land" }
    get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2P",
            cost: {default: this._price, additional: 300000}
        }]
    }
    private readonly _name: string;
    private readonly _price: number;
    public readonly group_id: number
    public constructor(_name: string, _group_id: number) {
        this._name = _name;
        this._price = GROUP_PRICES[_group_id];
        this.group_id = _group_id;
    }
    public get isBuildable() { return true }
    public get name() { return this._name }
}

export class Lotto implements ICellData {
    public get type(): CellType { return "lotto" }
    public get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2L",
            cost: {default: 200000}
        }]
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "로또" }
    public static readonly LottoCell = new Lotto()
}

export class Charity implements ICellData {
    public get type(): CellType { return "charity" }
    public get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2C",
            cost: {default: 600000}
        }]
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "구제기금" }

    public static readonly CharityCell = new Charity()
}

export class Chance implements ICellData {
    public get type(): CellType { return "chance" }
    public get paymentInfo(): PaymentType[] {
        return []
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "변화카드" }
    public static readonly ChanceCell = new Chance()
}

export class Transportation implements ICellData {
    public get type(): CellType { return "transportation" }
    public get paymentInfo(): PaymentType[] {
        return []
    }
    private constructor(dest: number) {
        this.dest = dest
    }
    public get isBuildable() { return false }
    public get name() { return "대중교통" }
    public readonly dest: number
    public static readonly Transportations: {
        [dest: number]: Transportation
    } = {
        25: new Transportation(25),
        9: new Transportation(9),
    }
}

export class Hospital implements ICellData {
    public get type(): CellType { return "hospital" }
    public get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2L",
            cost: {default: 200000}
        }]
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "병원" }

    public static readonly HospitalCell = new Hospital()    
}

export class Park implements ICellData {
    public get type(): CellType {
        return "park"
    }
    public get paymentInfo(): PaymentType[] {
        return []
    }
    private constructor() {

    }
    public get isBuildable() {return false}
    public get name() {return "공원"}

    public static readonly ParkCell = new Park()
}

export class University implements ICellData {
    public get type(): CellType { return "university" }
    public get paymentInfo(): PaymentType[] {
        return []
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "대학" }

    public static readonly UniversityCell = new University()
}

export class Jail implements ICellData {
    public get type(): CellType { return "jail" }
    public get paymentInfo(): PaymentType[] {
        return []
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "감옥" }
    
    public static readonly JailCell = new Jail()
}

export class Start implements ICellData {
    public get type(): CellType { return "start" }
    public get paymentInfo(): PaymentType[] {
        return [{
            kind: "P2L",
            cost: {default: 700000}
        },
        {
            kind: "L2AP"
        },
        {
            kind: "salary"
        }]
    }
    private constructor() {
    }
    public get isBuildable() { return false }
    public get name() { return "감옥" }

    public static readonly StartCell = new Start()
}

const GROUP_PRICES = [1, 2, 3, 4, 5, 6, 7, 8].reduce((accumulator: {[key: number]: number}, target: number) => ({...accumulator, [target]: (target * 100000)}),{} as {[key: number]: number})
export const GROUP_PRICES_DISPLAY = [1, 2, 3, 4, 5, 6, 7, 8].reduce((accumulator: {[key: number]: string}, target: number) => ({...accumulator, [target]: `${target}0만`}),{} as {[key: number]: string})

import PredefinedCells from "./predefined_cells.json"

type PredefinedJsonType = {
    type: "water" | "electricity" | "lotto" | "charity" | "chance" | "hospital" | "university" | "jail" | "start"
} | {
    type: "land",
    name: string,
    groupId: number
} | {
    type: "transportation",
    dest: number
}

const parsePredefined = {
    "land": (name: string, groupId: number) => new Land(name, groupId),
    "transportation": (dest: number) => Transportation.Transportations[dest],
    "water": Infrastructure.Infrastructures("water"),
    "electricity": Infrastructure.Infrastructures("electricity"),
    "lotto": Lotto.LottoCell,
    "charity": Charity.CharityCell,
    "chance": Chance.ChanceCell,
    "hospital": Hospital.HospitalCell,
    "university": University.UniversityCell,
    "jail": Jail.JailCell,
    "start": Start.StartCell
}


function gatherPredefined(): ICellData[] {
    const output: Array<ICellData> = []
    for(const c of PredefinedCells) {
        switch(c.type) {
            case "land":
                const {name, groupId
                } = c as {
                    type: string,
                    name: string,
                    groupId: number
                };
                output.push(parsePredefined.land(name, groupId))
                break;
            case "transportation":
                const {
                    dest
                } = c as {
                    type: string,
                    dest: number
                };
                output.push(parsePredefined.transportation(dest))
                break;
            case "lotto": 
				output.push(Lotto.LottoCell);
				break;
            case "charity": 
				output.push(Charity.CharityCell);
				break;
            case "chance": 
				output.push(Chance.ChanceCell);
				break;
            case "hospital": 
				output.push(Hospital.HospitalCell);
				break;
            case "university": 
				output.push(University.UniversityCell);
				break;
            case "jail": 
				output.push(Jail.JailCell);
				break;
            case "start": 
                output.push(Start.StartCell);
                break;
        }
    }
    return output;
}


export const PREDEFINED_CELLS: ICellData[] = gatherPredefined()


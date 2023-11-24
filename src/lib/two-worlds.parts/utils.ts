export type PaymentType = {kind: "P2P" | "P2L" | "P2C" | "L2P" | "C2P" | "L2AP", cost: {
    default: number,
    additional?: number
}} | {kind: "L2AP" | "salary"};

export const PLAYER_COLORS=[
    "red",
    "green",
    "blue",
    "yellow"
]
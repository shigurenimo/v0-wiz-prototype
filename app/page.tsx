"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TypewriterText } from "@/components/typewriter-text"
import { useReducer } from "react"

type EventType = "SCENERY" | "DAMAGE" | "ITEM"

type PartyMember = {
  name: string
  hp: number
  maxHp: number
  mp: number
  maxMp: number
}

type WizState = {
  currentMessage: string
  inputValue: string
  depth: number
  party: [PartyMember, PartyMember, PartyMember]
  items: string[]
}

type WizAction = {
  type: string
  payload?: string
  damage?: number
}

const sceneryMessages = [
  "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
  "風が冷たく吹き、木々の葉がささやく。",
  "地下の湖に反射する光景が美しい。",
]

const damageEvents = [
  { message: "スライムの攻撃!", damage: 10 },
  { message: "ゴブリンの矢!", damage: 5 },
  { message: "ドラゴンの息!", damage: 20 },
]

const itemEvents = ["魔法の薬を手に入れた。", "盾を発見した。", "宝箱から金貨が取れた。"]

function generateRandomEvent(): {
  type: EventType
  message: string
  damage?: number
  item?: string
} {
  const eventTypes: EventType[] = ["SCENERY", "DAMAGE", "ITEM"]
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

  switch (randomType) {
    case "SCENERY": {
      const randomIndex = Math.floor(Math.random() * sceneryMessages.length)
      return { type: "SCENERY", message: sceneryMessages[randomIndex] }
    }
    case "DAMAGE": {
      const randomIndex = Math.floor(Math.random() * damageEvents.length)
      const event = damageEvents[randomIndex]
      return {
        type: "DAMAGE",
        message: `${event.message} ${event.damage}のダメージを受けた！`,
        damage: event.damage,
      }
    }
    case "ITEM": {
      const randomIndex = Math.floor(Math.random() * itemEvents.length)
      const item = itemEvents[randomIndex]
      return { type: "ITEM", message: item, item }
    }
  }
}

function wizReducer(state: WizState, action: WizAction): WizState {
  switch (action.type) {
    case "NEXT_MESSAGE": {
      const event = generateRandomEvent()
      const newDepth = state.depth + 1

      const newParty = [...state.party] as [PartyMember, PartyMember, PartyMember]
      let newItems = state.items

      if (event.type === "DAMAGE" && event.damage) {
        newParty[0] = {
          ...newParty[0],
          hp: Math.max(0, newParty[0].hp - event.damage),
        }
      } else if (event.type === "ITEM" && event.item) {
        newItems = [...state.items, event.item]
      }

      return {
        ...state,
        currentMessage: event.message,
        depth: newDepth,
        party: newParty,
        items: newItems,
      }
    }
    case "SET_INPUT":
      return { ...state, inputValue: action.payload }
    case "SUBMIT_INPUT":
      console.log(`発言: ${state.inputValue}`)
      return { ...state, inputValue: "" }
    case "STOP":
      console.log("選択: たちどまる")
      return state
    case "UNKNOWN":
      console.log("選択: ???")
      return state
    default:
      return state
  }
}

const initialState: WizState = {
  currentMessage: "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
  inputValue: "",
  depth: 0,
  party: [
    { name: "あなた", hp: 50, maxHp: 50, mp: 30, maxMp: 30 },
    { name: "戦士", hp: 60, maxHp: 60, mp: 10, maxMp: 10 },
    { name: "魔法使い", hp: 30, maxHp: 30, mp: 50, maxMp: 50 },
  ],
  items: [],
}

export default function Home() {
  const [state, dispatch] = useReducer(wizReducer, initialState)

  const handleSpeak = () => {
    dispatch({ type: "SUBMIT_INPUT" })
  }

  const player = state.party[0]

  return (
    <main className="flex min-h-screen flex-col items-center justify-end p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <TypewriterText key={state.depth} text={state.currentMessage} speed={50} />
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 font-mono text-sm text-primary">
            <div>深度: {state.depth}</div>
            <div>
              生命: {player.hp}/{player.maxHp}
            </div>
            <div>MP: {player.mp}</div>
          </div>

          <div className="flex gap-2">
            <Input
              value={state.inputValue}
              onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSpeak()}
              placeholder="何か言ってみる.."
              className="flex-1 border-border bg-secondary font-mono text-base text-primary placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSpeak}
              variant="outline"
              className="border-border bg-secondary font-mono text-base text-primary hover:bg-accent hover:text-primary"
            >
              発言
            </Button>
          </div>

          <div className="flex gap-2 justify-start">
            <Button
              onClick={() => dispatch({ type: "NEXT_MESSAGE" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              すすむ
            </Button>
            <Button
              onClick={() => dispatch({ type: "STOP" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              たちどまる
            </Button>
            <Button
              onClick={() => dispatch({ type: "UNKNOWN" })}
              variant="outline"
              size="sm"
              className="border-border bg-secondary font-mono text-primary hover:bg-accent hover:text-primary"
            >
              ???
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

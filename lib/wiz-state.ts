import type { WizStateSceneDungeon } from "@/engine/models"

export const initialState: WizStateSceneDungeon = {
  type: "dungeon",
  inputValue: "",
  depth: 0,
  unreadChatMessages: [
    {
      characterId: "system",
      text: "暗く湿った石の階段を降りていく。松明の光が揺れ、影が壁を這う。",
    },
  ],
  vault: {
    player: {
      id: "player-1",
      name: "あなた",
    },
    party: [
      {
        id: "party-1",
        name: "あなた",
        hp: 50,
        maxHp: 50,
        mp: 30,
        maxMp: 30,
      },
      {
        id: "party-2",
        name: "戦士",
        hp: 60,
        maxHp: 60,
        mp: 10,
        maxMp: 10,
      },
      {
        id: "party-3",
        name: "魔法使い",
        hp: 30,
        maxHp: 30,
        mp: 50,
        maxMp: 50,
      },
    ],
    inventory: [],
  },
}

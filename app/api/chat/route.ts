import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import { zWizStateSceneDungeon } from "@/engine/models/wiz-state-scene-dungeon"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import { WizItemRepository } from "@/engine/repositories/wiz-item-repository"
import { streamDungeonChat } from "@/lib/ai/stream-dungeon-chat"
import { streamDungeonEvent } from "@/lib/ai/stream-dungeon-event"

const requestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("chat"),
    secretKey: z.string(),
    playerInput: z.string(),
    state: zWizStateSceneDungeon,
  }),
  z.object({
    type: z.literal("event"),
    secretKey: z.string(),
    state: zWizStateSceneDungeon,
  }),
])

/**
 * - do NOT use try-catch here
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  const json = await request.json()

  const parseResult = requestSchema.safeParse(json)

  if (!parseResult.success) {
    return new Response("Invalid request body", { status: 400 })
  }

  const body = parseResult.data

  const validSecretKey = process.env.SECRET_KEY

  if (!validSecretKey) {
    return new Response("Server configuration error", { status: 500 })
  }

  if (body.secretKey !== validSecretKey) {
    return new Response("Unauthorized", { status: 401 })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return new Response("API key not configured", { status: 500 })
  }

  const characterRepository = new WizCharacterRepository()
  const itemRepository = new WizItemRepository()

  const characters = await characterRepository.findMany()
  const items = await itemRepository.findMany()

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  })

  const partyInfo = body.state.vault.members
    .map((memberState) => {
      const character = characters.find((c) => c.id === memberState.id)
      const entity = new WizStateCharacterEntity(memberState)
      return `- ${character?.name} (ID: ${character?.id}): HP ${entity.hp}/${entity.maxHp}, STR ${entity.strength}, DEX ${entity.dexterity}, INT ${entity.intelligence}`
    })
    .join("\n")

  if (body.type === "event") {
    const availableItemIds = items.map((item) => item.id)

    const result = streamDungeonEvent({
      google: google,
      partyInfo: partyInfo,
      currentDepth: body.state.depth,
      availableItemIds: availableItemIds,
    })

    return result.toTextStreamResponse()
  }

  const result = streamDungeonChat({
    google: google,
    partyInfo: partyInfo,
    currentDepth: body.state.depth,
    chatMessages: body.state.chatMessages,
    playerInput: body.playerInput,
    characters: characters,
  })

  return result.toTextStreamResponse()
}

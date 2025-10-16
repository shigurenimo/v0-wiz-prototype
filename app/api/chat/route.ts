import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { WizStateCharacterEntity } from "@/engine/entities/wiz-state-character.entity"
import { WizCharacterRepository } from "@/engine/repositories/wiz-character-repository"
import { WizItemRepository } from "@/engine/repositories/wiz-item-repository"
import { requestSchema } from "@/lib/ai/models"
import { streamBattleActionMessage } from "@/lib/ai/stream-battle-action-message"
import { streamBattleTurnStart } from "@/lib/ai/stream-battle-turn-start"
import { streamDungeonChat } from "@/lib/ai/stream-dungeon-chat"
import { streamEventBattle } from "@/lib/ai/stream-event-battle"
import { streamEventDamage } from "@/lib/ai/stream-event-damage"
import { streamEventItem } from "@/lib/ai/stream-event-item"
import { streamEventScene } from "@/lib/ai/stream-event-scene"

/**
 * - do NOT use try-catch here
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  const json = await request.json()

  const body = requestSchema.parse(json)

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

  if (body.type === "battleTurnStart") {
    const result = streamBattleTurnStart({
      google: google,
      turn: body.turn,
      allies: body.allies,
      enemies: body.enemies,
    })
    return result.toTextStreamResponse()
  }

  if (body.type === "battleActionMessage") {
    const result = streamBattleActionMessage({
      google: google,
      actionType: body.actionType,
      actorName: body.actorName,
      targetName: body.targetName,
    })
    return result.toTextStreamResponse()
  }

  const partyInfo = body.state.vault.members
    .map((memberState) => {
      const character = characters.find((c) => c.id === memberState.id)
      const entity = new WizStateCharacterEntity(memberState)
      return `- ${character?.name} (ID: ${character?.id}): HP ${entity.hp}/${entity.maxHp}, STR ${entity.strength}, DEX ${entity.dexterity}, INT ${entity.intelligence}`
    })
    .join("\n")

  if (body.type === "event") {
    const availableItemIds = items.map((item) => item.id)

    const WizEventGenerator = (
      await import("@/engine/modules/wiz-event-generator")
    ).WizEventGenerator
    const eventGenerator = new WizEventGenerator({
      availableItemIds: availableItemIds,
    })
    const event = eventGenerator.generate()

    if (event.type === "EVENT_SCENE") {
      const result = streamEventScene({
        google: google,
        partyInfo: partyInfo,
        currentDepth: body.state.depth,
      })
      return result.toTextStreamResponse()
    }

    if (event.type === "EVENT_DAMAGE") {
      const result = streamEventDamage({
        google: google,
        partyInfo: partyInfo,
        currentDepth: body.state.depth,
        damage: event.damage,
      })
      return result.toTextStreamResponse()
    }

    if (event.type === "EVENT_ITEM") {
      const result = streamEventItem({
        google: google,
        partyInfo: partyInfo,
        currentDepth: body.state.depth,
        itemIds: event.itemIds,
      })
      return result.toTextStreamResponse()
    }

    if (event.type === "EVENT_BATTLE") {
      const result = streamEventBattle({
        google: google,
        partyInfo: partyInfo,
        currentDepth: body.state.depth,
        enemies: event.enemies,
      })
      return result.toTextStreamResponse()
    }

    return new Response("Unknown event type", { status: 500 })
  }

  const result = streamDungeonChat({
    google: google,
    partyInfo: partyInfo,
    currentDepth: body.state.depth,
    chatMessages: body.state.vault.logs,
    playerInput: body.playerInput,
    characters: [body.state.vault.player, ...body.state.vault.members],
  })

  return result.toTextStreamResponse()
}

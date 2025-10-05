import { z } from "zod"
import json from "@/assets/dungeon-events.json"
import { zWizDungeonEvent } from "@/engine/models/wiz-dungeon-event"

const zJson = z.object({ items: zWizDungeonEvent.array() })

export type WizDungeonEvent = z.infer<typeof zWizDungeonEvent>

/**
 * Dungeon Event Repository
 */
export class WizDungeonEventRepository {
  constructor() {
    Object.freeze(this)
  }

  private get records() {
    return zJson.parse(json).items
  }

  /**
   * Find many dungeon events
   */
  findMany(): readonly WizDungeonEvent[] {
    return this.records
  }

  /**
   * Find one dungeon event by ID
   */
  findOne(id: string): WizDungeonEvent | undefined {
    return this.records.find((record) => record.id === id)
  }
}

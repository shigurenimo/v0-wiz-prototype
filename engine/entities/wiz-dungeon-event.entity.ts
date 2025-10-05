import type { z } from "zod"
import { zWizDungeonEvent } from "@/engine/models/wiz-dungeon-event"

export class WizDungeonEventEntity {
  constructor(readonly props: z.infer<typeof zWizDungeonEvent>) {
    zWizDungeonEvent.parse(props)
  }
}

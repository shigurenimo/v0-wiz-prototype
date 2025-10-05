import { writeFile } from "node:fs/promises"
import { z } from "zod"
import { zWizCharacter } from "@/engine/models/wiz-character"
import { zWizDungeonEvent } from "@/engine/models/wiz-dungeon-event"
import { zWizStateInventoryItem } from "@/engine/models/wiz-state-inventory-item"

const items = [
  ["dungeon-events.schema.json", zWizDungeonEvent],
  ["inventory-items.schema.json", zWizStateInventoryItem],
  ["characters.schema.json", zWizCharacter],
] as const

async function main() {
  for (const [filename, schema] of items) {
    const itemsSchema = z.object({
      $schema: z.string(),
      items: schema.array(),
    })
    const text = JSON.stringify(z.toJSONSchema(itemsSchema), null, 2)
    await writeFile(`assets/${filename}`, text)
  }
}

export default main()

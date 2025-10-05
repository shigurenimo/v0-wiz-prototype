import { readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { z } from "zod"

const zRecord = z.object({
  id: z.string().nullable(),
})

const zJsonFile = z.object({
  items: z.array(zRecord),
})

/**
 * Generate unique ID
 */
function generateId(): string {
  return crypto.randomUUID()
}

export async function main() {
  const assetsDir = join(process.cwd(), "assets")
  const files = await readdir(assetsDir)

  for (const file of files) {
    if (!file.endsWith(".json") || file.endsWith(".schema.json")) {
      continue
    }

    const filePath = join(assetsDir, file)
    const content = await readFile(filePath, "utf-8")

    let data: unknown
    try {
      data = JSON.parse(content)
    } catch {
      console.log(`Skipped (invalid JSON): ${file}`)
      continue
    }

    const parsed = zJsonFile.safeParse(data)
    if (!parsed.success) {
      console.log(`Skipped (no items array): ${file}`)
      continue
    }

    let hasChanges = false
    const typedData = data as { items: Array<{ id: string | null }> }
    for (const item of typedData.items) {
      if (item.id === null) {
        item.id = generateId()
        hasChanges = true
      }
    }

    if (hasChanges) {
      await writeFile(
        filePath,
        `${JSON.stringify(typedData, null, 2)}\n`,
        "utf-8",
      )
      console.log(`Updated: ${file}`)
    }
  }
}

export default main()

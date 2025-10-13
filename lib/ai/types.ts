import type { z } from "zod"
import type { zStreamResult } from "@/lib/ai/models"

export type ResponseSchema = z.infer<typeof zStreamResult>

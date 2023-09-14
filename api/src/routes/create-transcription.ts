import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createReadStream } from "node:fs";
import { prisma } from "../lib/prisma";

export async function createTranscription(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (req) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);

    const video = await prisma.video.findFirstOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;

    return {
      videoId,
      prompt,
      videoPath,
    };
  });
}

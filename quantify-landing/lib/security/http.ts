import { NextResponse } from 'next/server'

type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; response: NextResponse }

export async function readJsonBody(request: Request, maxBytes = 16_384): Promise<JsonBodyResult> {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase()
  if (contentType !== 'application/json') {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Le format JSON est requis.' }, { status: 415 }),
    }
  }

  const declaredLength = request.headers.get('content-length')
  if (declaredLength !== null) {
    const length = Number(declaredLength)
    if (!Number.isSafeInteger(length) || length < 0) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Taille de requête invalide.' }, { status: 400 }),
      }
    }
    if (length > maxBytes) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 }),
      }
    }
  }

  if (!request.body) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Corps de requête manquant.' }, { status: 400 }),
    }
  }

  const reader = request.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let body = ''
  let bytesRead = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      bytesRead += value.byteLength
      if (bytesRead > maxBytes) {
        await reader.cancel().catch(() => undefined)
        return {
          ok: false,
          response: NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 }),
        }
      }
      body += decoder.decode(value, { stream: true })
    }
    body += decoder.decode()

    return { ok: true, data: JSON.parse(body) as unknown }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 }),
    }
  } finally {
    reader.releaseLock()
  }
}

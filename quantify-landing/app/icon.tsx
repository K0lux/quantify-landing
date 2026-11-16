import { ImageResponse } from 'next/og'
import { QMarkGlyph } from '@/components/brand/QMark'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '24%',
        background: '#FF6B35',
      }}
    >
      <QMarkGlyph size={44} strokeColor="#FFFFFF" />
    </div>,
    size
  )
}

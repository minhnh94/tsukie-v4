'use client'
import { Unity, useUnityContext } from "react-unity-webgl"
import { useEffect } from "react"

export default function UnityPlayer() {
  const R2_BASE = 'https://assets.tsukie.com/endless-defense/Build';
  const { unityProvider } = useUnityContext({
    loaderUrl: `${R2_BASE}/endless-defense.loader.js`,
    dataUrl: `${R2_BASE}/endless-defense.data.unityweb`,
    frameworkUrl: `${R2_BASE}/endless-defense.framework.js.unityweb`,
    codeUrl: `${R2_BASE}/endless-defense.wasm.unityweb`,
  })
  useEffect(() => {
    const canvas = document.querySelector('canvas')
    canvas.width = 1400
    canvas.height = 700
  }, [])

  return <Unity id="game" unityProvider={unityProvider} className="w-full" matchWebGLToCanvasSize={false} />
}

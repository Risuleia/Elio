import { Suspense, useEffect } from 'react'
import './App.css'
import { AnimatePresence } from 'motion/react'
import ActionBar from './components/layout/ActionBar'
import RightPanel from './components/layout/RightPanel'
import Workspace from './components/layout/Workspace'
import LeftToolbar from './components/layout/LeftToolbar'
import { AppProviders } from './providers'

export default function App() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (e.ctrlKey) e.preventDefault()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && (e.key == "+" || e.key == "-" || e.key == "0")) e.preventDefault()
    }

    const controller = new AbortController()
    window.addEventListener("wheel", onWheel, { passive: false, signal: controller.signal })
    window.addEventListener("keydown", onKeyDown, { signal: controller.signal })

    return () => controller.abort()
  }, [])

  return (
    <Suspense>
      <AnimatePresence mode='wait'>
        <AppProviders>
          <main id="main">
            <ActionBar />
            <LeftToolbar />
            <Workspace />
            <RightPanel />
          </main>
        </AppProviders>
      </AnimatePresence>
    </Suspense>
  )
}
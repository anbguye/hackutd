"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Spinner } from "@/components/ui/spinner"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      const authed = !!data.session
      setIsAuthed(authed)
      setChecking(false)
      if (!authed) {
        const next = encodeURIComponent(pathname || "/")
        router.replace(`/login?next=${next}`)
      }
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }
  if (!isAuthed) return null
  return <>{children}</>
}



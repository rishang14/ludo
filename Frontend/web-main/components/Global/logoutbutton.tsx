"use client"
import { Button } from '../ui/button'
import { logOut } from '@/lib/action/logout.action'

export const Logoutbutton = () => {
  return (
   <Button size={"default"} variant={"secondary"} className='z-100' onClick={logOut}>Logout</Button>
  )
}

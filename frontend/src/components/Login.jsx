import React from 'react'
import LoginForm from './LoginForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function Login() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
      <Card className="w-[400px] rounded-2xl shadow-lg border border-border">
        <CardHeader>
          <h1 className='text-xl text-center text-primary font-primary mt-6 font-bold'>Login</h1>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
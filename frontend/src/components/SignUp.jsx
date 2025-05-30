import React, { useState } from 'react'
import StudentSignUpForm from './StudentSignUpForm'
import ParentSignUpForm from './ParentSignUpForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'


function SignUp() {
  const [role, setRole] = useState(null);

  return (
    <div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden flex items-center justify-center">
        <Card className="w-[400px] rounded-2xl shadow-lg border border-border">
          <CardHeader>
            <div className="relative flex items-center justify-between mt-6 w-full min-h-[40px]">
              {role && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-primary transition"
                  onClick={() => setRole(null)}
                  title="Back"
                  type="button"
                >
                  <ArrowLeft size={24} />
                </Button>
              )}
              {/* Centered title using absolute positioning */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max pointer-events-none">
                <h1 className='text-xl text-center text-primary font-primary font-bold'>
                  {!role && 'Sign up'}
                  {role === 'student' && 'Sign up as Student'}
                  {role === 'parent' && 'Sign up as Parent'}
                </h1>
              </div>
              {/* Placeholder for spacing when arrow is not present */}
              {!role && <div style={{ width: 40 }}></div>}
            </div>
          </CardHeader>
          <CardContent>
            {!role && (
              <div className="flex flex-col items-center my-10 gap-6">
                <Button
                  className="flex items-center gap-2 w-full text-lg font-semibold"
                  variant="default"
                  size="lg"
                  onClick={() => setRole('student')}
                >
                  <span role="img" aria-label="Student" className="text-xl">🎓</span>
                  I'm a Student
                </Button>
                <Button
                  className="flex items-center gap-2 w-full text-lg font-semibold"
                  variant="secondary"
                  size="lg"
                  onClick={() => setRole('parent')}
                >
                  <span role="img" aria-label="Parent" className="text-xl">👨‍👩‍👧‍👦</span>
                  I'm a Parent
                </Button>
              </div>
            )}
            {role && (
              <div className="relative">
                <div>
                  {role === 'student' && <StudentSignUpForm />}
                  {role === 'parent' && <ParentSignUpForm/>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignUp
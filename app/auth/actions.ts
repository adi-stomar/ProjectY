'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth?mode=login&message=Could not authenticate: ' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = (formData.get('full_name') as string) || ''
  const phoneNumber = (formData.get('phone_number') as string) || ''
  const targetClass = (formData.get('target_class') as string) || 'Class 12'
  const targetExam = (formData.get('target_exam') as string) || 'JEE Main & Advanced'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
        target_class: targetClass,
        target_exam: targetExam,
      },
    },
  })

  if (error) {
    redirect('/auth?mode=signup&message=Could not create account: ' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/auth?mode=login&message=Account created successfully! Please sign in.')
}

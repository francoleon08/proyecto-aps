import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VBNB',
  description: 'Proyecto APS - Sistema de polizas y seguros',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  revalidatePath('/plans', 'layout')
  return (
    <html lang="es">
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Toaster />
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}

/*
 * @Author: your name
 * @Date: 2026-01-07 23:13:00
 * @LastEditTime: 2026-01-07 23:55:00
 * @LastEditors: your name
 * @Description:
 * @FilePath: \DOCOP\docop\src\app\layout.tsx
 * 可以输入预定的版权声明、个性签名、空行等
 */
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SocketProvider } from '@/context/SocketContext'
import { AuthProvider } from '@/context/AuthContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Docop - 实时协作文档',
  description: '基于Next.js和Socket.io的实时协作文档平台',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

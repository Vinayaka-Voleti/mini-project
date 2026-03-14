'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  hostelName: string
  predictions: Array<{
    date: string
    waste: number
    cost: number
  }>
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, hostelName: string) => Promise<void>
  logout: () => void
  addPrediction: (waste: number, cost: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@hostel.com',
  hostelName: 'Central Hostel',
  predictions: [
    { date: '2024-01-15', waste: 45, cost: 1125 },
    { date: '2024-01-14', waste: 38, cost: 950 },
    { date: '2024-01-13', waste: 52, cost: 1300 },
  ],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('foodwaste_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    if (email === 'demo@hostel.com' && password === 'demo123') {
      setUser(DEMO_USER)
      localStorage.setItem('foodwaste_user', JSON.stringify(DEMO_USER))
    } else {
      throw new Error('Invalid email or password')
    }
  }

  const signup = async (name: string, email: string, password: string, hostelName: string) => {
    if (!name || !email || !password || !hostelName) {
      throw new Error('All fields are required')
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      hostelName,
      predictions: [],
    }

    setUser(newUser)
    localStorage.setItem('foodwaste_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('foodwaste_user')
  }

  const addPrediction = (waste: number, cost: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        predictions: [
          { date: new Date().toISOString().split('T')[0], waste, cost },
          ...user.predictions,
        ],
      }
      setUser(updatedUser)
      localStorage.setItem('foodwaste_user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, addPrediction }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

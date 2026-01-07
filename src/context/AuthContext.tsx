"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, AuthUser, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 从localStorage获取初始状态
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });

  const isAuthenticated = !!user && !!token;

  // 登录功能
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟用户数据
    const mockUser: AuthUser = {
      id: 'user-123',
      email: credentials.email,
      username: 'testuser',
    };
    
    const mockToken = 'mock-jwt-token-123';
    
    // 保存到localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);
    
    // 更新状态
    setUser(mockUser);
    setToken(mockToken);
    
    return {
      token: mockToken,
      user: mockUser,
    };
  };

  // 注册功能
  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟用户数据
    const mockUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      username: credentials.username,
    };
    
    const mockToken = `mock-jwt-token-${Date.now()}`;
    
    // 保存到localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);
    
    // 更新状态
    setUser(mockUser);
    setToken(mockToken);
    
    return {
      token: mockToken,
      user: mockUser,
    };
  };

  // 登出功能
  const logout = () => {
    // 清除localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 更新状态
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
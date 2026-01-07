"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDocument: (documentId: string) => void;
  leaveDocument: (documentId: string) => void;
  sendDocumentChange: (documentId: string, changes: any, userId: string) => void;
  sendCursorChange: (documentId: string, cursor: any, userId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 创建WebSocket连接
    const newSocket = io({
      path: '/api/ws',
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinDocument = (documentId: string) => {
    if (socket && isConnected) {
      socket.emit('join-document', documentId);
    }
  };

  const leaveDocument = (documentId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-document', documentId);
    }
  };

  const sendDocumentChange = (documentId: string, changes: any, userId: string) => {
    if (socket && isConnected) {
      socket.emit('document-change', {
        documentId,
        changes,
        userId,
      });
    }
  };

  const sendCursorChange = (documentId: string, cursor: any, userId: string) => {
    if (socket && isConnected) {
      socket.emit('cursor-change', {
        documentId,
        cursor,
        userId,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinDocument,
        leaveDocument,
        sendDocumentChange,
        sendCursorChange,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
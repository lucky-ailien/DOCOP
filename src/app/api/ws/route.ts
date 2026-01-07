import { Server } from 'socket.io';
import { NextApiResponse } from 'next';

let io: Server;

export async function GET(request: Request, { res }: { res: NextApiResponse }) {
  if (!io) {
    const server = res.socket.server;
    
    io = new Server(server, {
      path: '/api/ws',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // 加入文档房间
      socket.on('join-document', (documentId) => {
        socket.join(documentId);
        console.log(`User ${socket.id} joined document ${documentId}`);
      });

      // 离开文档房间
      socket.on('leave-document', (documentId) => {
        socket.leave(documentId);
        console.log(`User ${socket.id} left document ${documentId}`);
      });

      // 处理文档变更
      socket.on('document-change', (data) => {
        const { documentId, changes, userId } = data;
        // 广播变更给房间内其他用户
        socket.to(documentId).emit('document-change', {
          changes,
          userId,
          timestamp: new Date().toISOString(),
        });
      });

      // 处理用户光标位置变化
      socket.on('cursor-change', (data) => {
        const { documentId, cursor, userId } = data;
        socket.to(documentId).emit('cursor-change', {
          cursor,
          userId,
          timestamp: new Date().toISOString(),
        });
      });

      // 断开连接
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  return new Response('WebSocket server is running', { status: 200 });
}
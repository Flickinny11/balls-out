import { Server as SocketIOServer } from 'socket.io';

export function setupWebSocket(io: SocketIOServer) {
  console.log('Setting up WebSocket handlers...');

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a project room for collaboration
    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      socket.to(`project:${projectId}`).emit('user-joined', {
        userId: socket.id,
        timestamp: new Date()
      });
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    // Leave a project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      socket.to(`project:${projectId}`).emit('user-left', {
        userId: socket.id,
        timestamp: new Date()
      });
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    // Handle real-time project updates
    socket.on('project-update', (data) => {
      const { projectId, type, payload } = data;
      
      // Broadcast to all users in the project room
      socket.to(`project:${projectId}`).emit('project-update', {
        type,
        payload,
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle audio track changes
    socket.on('track-update', (data) => {
      const { projectId, trackId, changes } = data;
      
      socket.to(`project:${projectId}`).emit('track-update', {
        trackId,
        changes,
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle real-time cursor/selection updates
    socket.on('cursor-update', (data) => {
      const { projectId, position, selection } = data;
      
      socket.to(`project:${projectId}`).emit('cursor-update', {
        userId: socket.id,
        position,
        selection,
        timestamp: new Date()
      });
    });

    // Handle audio playback synchronization
    socket.on('playback-sync', (data) => {
      const { projectId, action, position } = data;
      
      socket.to(`project:${projectId}`).emit('playback-sync', {
        action, // 'play', 'pause', 'stop', 'seek'
        position,
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle live audio streaming for collaboration
    socket.on('audio-stream', (data) => {
      const { projectId, audioData, trackId } = data;
      
      // In production, this would handle real-time audio data
      socket.to(`project:${projectId}`).emit('audio-stream', {
        audioData,
        trackId,
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
      const { projectId, message } = data;
      
      socket.to(`project:${projectId}`).emit('chat-message', {
        message,
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Notify all rooms that this user left
      socket.rooms.forEach((room) => {
        if (room.startsWith('project:')) {
          socket.to(room).emit('user-left', {
            userId: socket.id,
            timestamp: new Date()
          });
        }
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  console.log('WebSocket handlers setup completed');
}
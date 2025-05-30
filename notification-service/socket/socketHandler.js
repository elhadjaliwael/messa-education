export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // Get user ID from socket handshake
    const userId = socket.handshake.auth.userId;
    const userRole = socket.handshake.auth.role;
    console.log(`User connected: ${userId} (${userRole})`);
    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their personal room`);
    }
    socket.on('disconnect', (reason) => {
      console.warn(`Disconnected: ${reason}`);
      console.log(`User disconnected: ${userId}`);
    });
    socket.on('error', (error) => {
      console.error(`Socket error: ${error}`);
    });
  });
}
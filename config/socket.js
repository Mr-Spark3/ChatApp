let io;

module.exports = {
    init: (httpServer) => {
        io = require("socket.io")(httpServer, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST'],
            }
        });
        return io;
    },
    getIo: () =>  {
        if(!io) {
            throw new Error('socket.io is not initiallized')
        }
        return io;
    },
};
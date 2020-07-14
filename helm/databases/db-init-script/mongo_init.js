db.createUser(
        {
            user: "cyclotron",
            pwd: "cyclotron",
            roles: [
                {
                    role: "readWrite",
                    db: "cyclotron"
                }
            ]
        }
);

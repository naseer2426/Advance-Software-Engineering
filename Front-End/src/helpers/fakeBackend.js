import { Role } from "./role";

export function configureFakeBackend() {
    let users = [
        {
            id: 1,
            username: "admin",
            password:
                "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            firstName: "Admin",
            lastName: "User",
            role: Role.Administrator,
            profileUrl: "https://picsum.photos/id/1005/200",
            courses: [
                "IntelligentAgents",
                "ArtificialIntelligence",
                "CyberSecurity",
                "ComputerVision"
            ]
        },
        {
            id: 2,
            username: "user",
            password:
                "04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb",
            firstName: "Mary",
            lastName: "Jhonson",
            role: Role.Professor,
            profileUrl: "https://picsum.photos/id/1027/200",
            courses: ["CyberSecurity", "ComputerVision"]
        }
    ];
    let realFetch = window.fetch;
    window.fetch = function(url, opts) {
        const authHeader = opts.headers["Authorization"];
        const isLoggedIn =
            authHeader && authHeader.startsWith("Bearer fake-jwt-token");
        const roleString = isLoggedIn && authHeader.split(".")[1];
        const role = roleString ? Role[roleString] : null;

        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                // authenticate - public
                if (
                    url.endsWith("/users/authenticate") &&
                    opts.method === "POST"
                ) {
                    const params = JSON.parse(opts.body);
                    // console.log(params.password);
                    const user = users.find(
                        x =>
                            x.username === params.username &&
                            x.password === params.password
                    );
                    if (!user)
                        return error("Username or password is incorrect");
                    return ok({
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        profileUrl: user.profileUrl,
                        courses: user.courses,
                        token: `fake-jwt-token.${user.role}`
                    });
                }

                // get user by id - admin or user (user can only access their own record)
                if (url.match(/\/users\/\d+$/) && opts.method === "GET") {
                    if (!isLoggedIn) return unauthorised();

                    // get id from request url
                    let urlParts = url.split("/");
                    let id = parseInt(urlParts[urlParts.length - 1]);

                    // only allow normal users access to their own record
                    const currentUser = users.find(x => x.role === role);
                    if (id !== currentUser.id && role !== Role.Administrator)
                        return unauthorised();

                    const user = users.find(x => x.id === id);
                    return ok(user);
                }

                // get all users - admin only
                if (url.endsWith("/users") && opts.method === "GET") {
                    if (role !== Role.Administrator) return unauthorised();
                    return ok(users);
                }

                // get course information from user id and course name
                if (
                    url.match(/user=/) &&
                    url.match(/course=/) != null &&
                    opts.method === "GET"
                ) {
                    //Gets course and id from the url
                    let urlQueryString = url.split("/")[3];
                    var urlParams = new URLSearchParams(urlQueryString);
                    var course = urlParams.get("course");
                    var id = urlParams.get("user");
                    //finds the current user based on id
                    var currentUser = users.find(x => x.id.toString() === id);
                    // check if the user is verified to access courses
                    if (currentUser.courses.includes(course)) {
                        return ok(require(`./coursesData/${course}.json`));
                    }
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

                // private helper functions
                function ok(body) {
                    resolve({
                        ok: true,
                        text: () => Promise.resolve(JSON.stringify(body))
                    });
                }

                function unauthorised() {
                    resolve({
                        status: 401,
                        text: () =>
                            Promise.resolve(
                                JSON.stringify({ message: "Unauthorised" })
                            )
                    });
                }

                function error(message) {
                    resolve({
                        status: 400,
                        text: () => Promise.resolve(JSON.stringify({ message }))
                    });
                }
            }, 500);
        });
    };

    window.fetch = realFetch;
}

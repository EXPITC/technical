let {routes ,roles} = require('../../models')

// list route
exports.listRoute = async (req, res) => {
    try {
        let route = await routes.findAll({
            attributes: {
                exclude:['id','createdAt','updatedAt' ,'access']
            }
        })
        let post = route.map(x => {
            if(x.method === 'post') return {
                ...x.dataValues,
                route: 'http://localhost:5000/v1' + x.route,
            }
        })
        post =  post.filter((a) => a);
        let get = route.map(x => {
            if(x.method === 'get') return {
                ...x.dataValues,
                route: 'http://localhost:5000/v1' + x.route,
            }
        })
        get =  get.filter((a) => a);
        let patch = route.map(x => {
            if(x.method === 'patch') return {
                ...x.dataValues,
                route: 'http://localhost:5000/v1' + x.route,
            }
        })
        patch = patch.filter((a) => a);
        let deletes = route.map(x => {
            if (x.method === 'delete') {
                console.log(x)
                return {
                    ...x.dataValues,
                    route: 'http://localhost:5000/v1' + x.route
                }
            }
        })
        deletes = deletes.filter((a) => a);
        res.status(200).send({
            route: {
                post,
                get,
                patch,
                deletes
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.RBAC = async (req, res) => {
    try {
        let data = await routes.findAll({
            // include: {
            //     model: roles,
            //     as: 'accessUser',
            //     attributes: {
            //         exclude: ['password','createdAt','updatedAt']
            //     }
            // },
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt']
            }
        })
        data = data.map(x => {
            return {
                ...x.dataValues,
                route: 'http://localhost:5000/v1' + x.route,
                access: x.access === 1 ? 'admin' : 'user'
            }
        })
        let routeAdmin = data.map(x => {
            if (x.access === 'admin') {
                
                return { ...x }
                
            }
        })
        routeAdmin = routeAdmin.filter((a) => a);
        console.log(routeAdmin)
        let methodAdmin = data.map(x => {
            if (x.access === 'admin') {
                return x.method
            }
        })
        methodAdmin = methodAdmin.filter((value, index) => {
            return methodAdmin.indexOf(value) == index;
        });
        methodAdmin = methodAdmin.filter((a) => a);

        let routeUser = data.map(x => {
            if (x.access === 'user') {
                
                return { ...x }
                
            }
        })
        routeUser = routeUser.filter((a) => a);
        console.log(routeUser)
        let methodUser = data.map(x => {
            if (x.access === 'user') {
                return x.method
            }
        })
        methodUser = methodUser.filter((value, index) => {
            return methodUser.indexOf(value) == index;
        });
        methodUser = methodUser.filter((a) => a);
        res.status(200).send({
            admin: {
                route: routeAdmin,
                allowMethod: methodAdmin
            },
            user: {
                route: routeUser,
                allowMethod: methodUser
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
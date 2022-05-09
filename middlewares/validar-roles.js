const { response } = require("express")

const esAdminRole = (req, res = response, next) => {

    // SI NO HEMOS EJECUTADO EL ANTERIOR MIDDLEWARA MANDARA ESTE ERROR
    if(!req.usuario) { // si esto regresara undefined - significa que no hemos validado la peticion
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        }) // un error 500 significa que es un problema mío
    }

    const { rol, nombre } = req.usuario;

    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({ //401 significa que no esta autorizado
            msg: `${nombre} no es administrador - no puede hacer esto`
        });
    }

    // SI es administrador llamo el next y lo dejamos seguir
    next();
}   

    // en este caso espero recibir todos mis roles
    // * ... resto - quiero el resto de los argumentos que tiene ahí - lo transforma en un arreglo
    const tieneRole = (...roles) => {
        // recibo los argumentos y regreso una funcion que se va a ejecutar en user.rotes
        return (req, res = response, next) => {

            if(!req.usuario) { 
                return res.status(500).json({
                    msg: 'Se quiere verificar el rol sin validar el token primero'
                }) // un error 500 significa que es un problema mío
            }

            if(!roles.includes(req.usuario.rol)) { // si no esta incluido uno de los roles especificados manda esto
                return res.status(401).json({
                    msg: `El servicio requiere uno de estos roles ${roles}`
                });
            }

            console.log(roles, req.usuario.rol); // que rol tiene el usuario

            next();
        }
    }


module.exports = {
    esAdminRole,
    tieneRole
}

// este middleware se ejecutara despues del otro middleware que verifica el JWT
/**
 * dremio claim mapping aac4
**/
function claimMapping(claims) {
    var valid = ['ROLE_USER'];
    var owner = ['ROLE_OWNER', 'ROLE_PROVIDER'];
    var prefix = "components/dremio/";

    //fetch username where we find it
    var username = claims["username"];
    if(!username) {
        username = claims ["preferred_username"];
    }
    if(!username) {
        username = claims ["email"];
    }

    if ("roles" in claims && "space" in claims) {
        var space = claims["space"];
        //can't support no space selection performed
        if (Array.isArray(space)) {
            space = null;
        }
        //lookup for policy for selected space
        var tenant = null;
        if(space) {
            for (var role of claims["roles"]) {
                if (role.startsWith(prefix + space + ":")) {
                    var p = role.split(":")[1]
                    
                    //replace owner with USER
                    if (owner.indexOf(p) !== -1) {
                        p = "ROLE_USER"
                    }

                    if (valid.indexOf(p) !== -1) {
                        tenant = space
                        break;
                    }
                }
            }
        }

        if (tenant) {
            tenant = tenant.replace(/\./g,'_');
            claims["dremio/tenant"] = tenant;
            claims["dremio/username"] = username+'@'+tenant;
            claims["dremio/role"] = "admin";
        } 
    }

    return claims;
}

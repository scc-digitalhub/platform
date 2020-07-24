/* Sample Configuration */
module.exports = {
    /* MongoDB connection string:
     *      mongodb://<hostname[:port]>/<databaseName>
     * Cluster:
     *      mongodb://<host1[:port]>,<host2[:port]>,...<hostN[:port]>/<databaseName>
     * Authentication:
     *      mongodb://<username>:<password>@<host1[:port]>,<host2[:port]>,...<hostN[:port]>/<databaseName>
     */
    mongodb: 'mongodb://{{ .Values.svc.mongo.user }}:{{ .Values.svc.mongo.password }}@{{ .Values.svc.mongo.url }}/{{ .Values.svc.mongo.dbName }}',

    /* Port to run the Cyclotron Service on */
    port: 8077,

    /* URL for website using this service
     * Used for exporting Dashboards as PDFs via CasperJS
     *
    webServer: 'http://localhost:777',
    */
    webServer: '{{ .Values.svc.url }}',


    /* URL of cyclotron-svc
     * Used for exporting widget data
     */
    svcServer: '{{ .Values.svc.url }}',


    /* Key for encrypting/decrypting strings on the /crypto endpoint */
    encryptionKey: '',

    /* If enabled, loads example Dashboards from /examples folder into the database */
    loadExampleDashboards: true,

    /* Configuration for Analytics */
    analytics: {
        /* Enable or disable analytic data collection */
        enable: false,

        /* Possible values: 'mongo', 'elasticsearch' */
        analyticsEngine: 'mongo',

        /* Configuration for Elasticsearch (if enabled) */
        elasticsearch: {
            /* String or String[]
             * Can provide basic HTTP authentication like:
             *     host: [
             *         'user:password@my-elasticsearch-server1:9200',
             *         'user:password@my-elasticsearch-server2:9200'
             *     ]
             */
            host: 'my-elasticsearch-cluster:9200',
            indexPrefix: 'cyclotron',

            /* Configure how frequently to rotate to new indicies */
            pageviewsIndexStrategy: 'monthly',
            datasourcesIndexStrategy: 'monthly',
            eventsIndexStrategy: 'yearly'
        }
    },

    /* Enable or disable authentication */
    enableAuth: {{ .Values.auth.enabled }},

    /* Authentication provider. Possible values: 'ldap', 'aac'. */
    authProvider: '{{ .Values.auth.provider }}',

    /* LDAP configuration, if authentication is enabled
     * Compatible with Active Directory as well.
     */
    ldap: {
        url: 'ldap://ldap:389',
        searchBase: 'ou=users, o=example',
        searchFilter: '(cn=)',

        /* Credentials of a valid LDAP user
         * Does not need elevated permissions in LDAP
         * Used for searching LDAP for auto-complete
         */

        /* 'adminDN' is the LDAP distinguished name of the user, not the username */
        adminDn: '',
        adminPassword: '',

        /* List of LDAP paths to search for auto-complete */
        searchCategories: [
            /* name: '', dn: '' */
        ]
    },

    /* AAC provider configuration, if authentication is enabled.
     * Scopes must be comma-separated.
     */
    oauth: {
        userProfileEndpoint: '{{ .Values.auth.userProfileEndpoint }}',
        userRolesEndpoint: '{{ .Values.auth.userRolesEndpoint }}',
        scopes: '{{ .Values.auth.scopes }}',
        tokenValidityEndpoint: '{{ .Values.auth.tokenValidityEndpoint }}',
        tokenInfoEndpoint: '{{ .Values.auth.tokenInfoEndpoint }}',
        tokenRolesEndpoint: '{{ .Values.auth.tokenRolesEndpoint }}',
        apikeyCheckEndpoint: '{{ .Values.auth.apikeyCheckEndpoint }}',
        parentSpace: '{{ .Values.auth.parentSpace }}'
    },

    /* List of LDAP distinguished names for Admin users
     * These user(s) can override normal permission settings
     * Only used if enableAuth is true
     */
    admins: [],

    /* Limits the maximum size request that can be processed.
     * May need to be increased to save very large Dashboards.
     */
    requestLimit: '5mb',

    /* Provides additional CAs to trust when making HTTPS proxy requests */
    trustedCa: [
        // 'config/internalRoot.crt'
    ]
};

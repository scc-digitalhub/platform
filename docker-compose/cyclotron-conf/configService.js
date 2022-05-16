cyclotronServices.factory('configService', ['commonConfigService', function(commonConfigService) {
  var cyclotronEnvironments, exports, merged, proxyOptions;
  cyclotronEnvironments = [
    {
      name: 'Dev',
      serviceUrl: 'https://cyclotron.platform.local/api',
      requiresAuth: true,
      canPush: true
    }, {
      name: 'Localhost',
      serviceUrl: 'https://cyclotron.platform.local/api',
      requiresAuth: false,
      canPush: false
    }
  ];
  proxyOptions = _.reduce(cyclotronEnvironments, function(options, environment) {
    options[environment.name] = {
      value: environment.serviceUrl
    };
    return options;
  }, {});
  exports = {
    restServiceUrl: 'https://cyclotron.platform.local/api',
    authentication: {
      enable: true,
      authProvider: 'aac',
      loginMessage: 'Please login using your LDAP username and password.',
      authorizationURL: 'https://aac.platform.local/oauth/authorize',
      clientID: 'CYCLOTRON_CLIENT_ID',
      callbackDomain: 'https://cyclotron.platform.local',
      scopes: 'openid profile user.roles.me',
      userProfileEndpoint: 'https://aac.platform.local/basicprofile/me',
      tokenValidityEndpoint: 'https://aac.platform.local/resources/access'
    },
    analytics: {
      enable: false
    },
    logging: {
      enableDebug: false
    },
    newUser: {
      enableMessage: true
    },
    cyclotronEnvironments: cyclotronEnvironments,
    dashboard: {
      properties: {
        dataSources: {
          options: {
            cyclotronData: {
              properties: {
                url: {
                   options: proxyOptions
                 }
               }
             },
             graphite: {
               properties: {
                 url: {
                   "default": 'http://sampleGraphiteHost:80'
                 },
                 proxy: {
                   options: proxyOptions
                 }
               }
             },
             json: {
               properties: {
                 proxy: {
                   options: proxyOptions
                 }
               }
             },
             splunk: {
               properties: {
                 host: {
                   "default": 'splunk'
                 },
                 proxy: {
                   options: proxyOptions
                 }
               }
             }
           }
         }
       }
     },
     dashboardSidebar: {
       footer: {
         logos: [
           {
             title: 'Cyclotron',
             src: '/img/favicon32.png',
             href: '/'
           }
         ]
       }
     }
   };
   merged = _.merge(commonConfigService, exports, _["default"]);
   merged.help[0].messages = [
     {
       type: 'info',
       html: 'Welcome to Cyclotron!',
       icon: 'fa-info-circle'
     }
   ];
   return merged;
 }]);

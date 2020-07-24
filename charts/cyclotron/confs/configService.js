cyclotronServices.factory('configService', ['commonConfigService', function(commonConfigService) {
  var cyclotronEnvironments, exports, merged, proxyOptions;
  cyclotronEnvironments = [
    {
      name: 'Dev',
      serviceUrl: '{{ .Values.svc.url }}/api',
      requiresAuth: true,
      canPush: true
    }, {
      name: 'Localhost',
      serviceUrl: '{{ .Values.svc.url }}/api',
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
    restServiceUrl: '{{ .Values.svc.url }}/api',
    authentication: {
      enable: '{{ .Values.auth.enabled }}',
      authProvider: '{{ .Values.auth.provider }}',
      loginMessage: 'Please login using your {{ .Values.auth.provider }} username and password.',
      authorizationURL: '{{ .Values.auth.authorizationUrl }}',
      clientID: '{{ .Values.auth.clientId }}',
      callbackDomain: '{{ .Values.svc.url }}',
      scopes: '{{ .Values.auth.scopes }}',
      userProfileEndpoint: '{{ .Values.auth.userProfileEndpoint }}',
      tokenValidityEndpoint: '{{ .Values.auth.tokenValidityEndpoint }}'
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

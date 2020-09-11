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
      enable: {{ .Values.auth.enabled }},
      authProvider: '{{ .Values.auth.provider }}',
      authorizationURL: '{{ .Values.auth.authorizationURL }}',
      clientID: '{{ .Values.auth.clientId }}',
      callbackDomain: '{{ .Values.auth.callbackDomain }}',
      scopes: '{{ .Values.auth.scopes }}'
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

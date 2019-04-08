export const host = "localhost:";
export const root = "/";

// control server
export const nginxPort = 80;
export const tomcatPort = 8080;
export const uMasterPort = 3310;
export const mySQLPort = 3306;

// app server
export const appPort = 9080;
export const uAgentPort = 3320;

export const wsConnections = {
  connections: {
    tomcat: {
      url: host + tomcatPort
    },
    appServer: {
      url: host + appPort,
      connections: {
        nginx: {
          url: host + nginxPort
        }
      }
    }
  }
};

export const httpConnections = {
  connections: {
    tomcat: {
      url: host + tomcatPort,
      connections: {
        mySQL: {
          url: host + mySQLPort
        }
      }
    },
    uMaster: {
      url: host + uMasterPort,
      connections: {
        uAgent: {
          url: host + uAgentPort,
          connections: {
            uMaster: {
              url: host + uMasterPort
            }
          }
        }
      }
    }
  }
};

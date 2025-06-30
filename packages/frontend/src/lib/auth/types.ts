export interface CognitoUser {
  username: string;
  pool: {
    userPoolId: string;
    clientId: string;
    client: {
      endpoint: string;
      fetchOptions: Record<string, unknown>;
    };
    advancedSecurityDataCollectionFlag: boolean;
    storage: Record<string, string>;
  };
  Session: null;
  client: {
    endpoint: string;
    fetchOptions: Record<string, unknown>;
  };
  signInUserSession: {
    idToken: {
      jwtToken: string;
      payload: {
        sub: string;
        email_verified: boolean;
        iss: string;
        phone_number_verified: boolean;
        'cognito:username': string;
        preferred_username: string;
        'custom:partnerId': string;
        origin_jti: string;
        aud: string;
        event_id: string;
        token_use: string;
        auth_time: number;
        name: string;
        phone_number: string;
        exp: number;
        iat: number;
        jti: string;
        email: string;
      };
    };
    refreshToken: {
      token: string;
    };
    accessToken: {
      jwtToken: string;
      payload: {
        sub: string;
        iss: string;
        client_id: string;
        origin_jti: string;
        event_id: string;
        token_use: string;
        scope: string;
        auth_time: number;
        exp: number;
        iat: number;
        jti: string;
        username: string;
      };
    };
    clockDrift: number;
  };
  authenticationFlowType: string;
  storage: Record<string, string>;
  keyPrefix: string;
  userDataKey: string;
  attributes: {
    sub: string;
    email_verified: boolean;
    name: string;
    phone_number_verified: boolean;
    phone_number: string;
    preferred_username: string;
    email: string;
    'custom:partnerId': string;
    'custom:role': string;
  };
  preferredMFA: string;
}

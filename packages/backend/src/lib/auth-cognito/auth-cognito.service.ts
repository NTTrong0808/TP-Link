import {
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpResponse,
  SignUpCommand,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'

import { config } from 'dotenv'

config({})

export interface RegisterUser {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  phoneNumber?: string
}

@Injectable()
export class AuthCognitoService {
  private readonly providerClient: CognitoIdentityProviderClient

  private userPoolId: string
  private userClientId: string
  private region: string

  constructor() {
    this.userPoolId = process.env.COGNITO_USER_POOL_ID!
    this.userClientId = process.env.COGNITO_USER_CLIENT_ID!

    this.region = process.env.COGNITO_REGION!

    this.providerClient = new CognitoIdentityProviderClient({
      region: this.region,
    })
  }

  /**
   * Registers a new user in Cognito User Pool
   * @param user - User registration details
   * @param user.username - Unique username for the user
   * @param user.email - User's email address
   * @param user.password - User's password
   * @param user.firstName - User's first name
   * @param user.lastName - User's last name
   * @param user.role - User's role in the system
   * @param user.provider - Authentication provider
   * @param user.phoneNumber - Optional phone number (will be formatted with +84 prefix)
   * @returns Promise resolving to ISignUpResult containing the confirmation status and user sub
   */
  registerUser(user: RegisterUser): Promise<SignUpCommandOutput> {
    const command = new SignUpCommand({
      ClientId: this.userClientId,
      Username: user.username,
      Password: user.password,
      UserAttributes: [
        // This attributes generated base on your setting up on Cognito User Pool
        // You can change the attributes on Cognito User Pool and add new attributes
        // For example:
        // { Name: 'custom:role', Value: user.role },
        // { Name: 'custom:provider', Value: user.provider },
        // { Name: 'custom:status', Value: user.status },
        { Name: 'name', Value: `${user.firstName} ${user.lastName}` },
        { Name: 'email', Value: user.email },
        { Name: 'phone_number', Value: user.phoneNumber?.replace(/^0/, '+84') ?? '' },
        { Name: 'custom:role', Value: user.role },
      ],
    })

    return this.providerClient.send(command)
  }

  /**
   * Confirms a user's account in Cognito User Pool using admin privileges
   * @param cognitoId - Cognito ID of the user to confirm
   * @returns Promise resolving to AdminConfirmSignUpCommandOutput containing the confirmation status
   */
  confirmAccountByAdmin(cognitoId: string) {
    const command = new AdminConfirmSignUpCommand({
      Username: cognitoId,
      UserPoolId: this.userPoolId,
    })

    return this.providerClient.send(command)
  }

  /**
   * Verifies a user's account in Cognito User Pool
   * @param cognitoId - Cognito ID of the user to verify
   * @param confirmationCode - Verification code sent to the user's email
   * @returns Promise resolving to ConfirmSignUpResponse containing the verification status
   */
  confirmAccountByCode(cognitoId: string, confirmationCode: string): Promise<ConfirmSignUpResponse> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.userClientId,
      Username: cognitoId,
      ConfirmationCode: confirmationCode,
    })

    return this.providerClient.send(command)
  }

  /**
   * Disables a user's account in Cognito User Pool
   * @param cognitoId - Cognito ID of the user to disable
   * @returns Promise resolving to AdminDisableUserCommandOutput
   */
  disableUser(cognitoId: string) {
    const command = new AdminDisableUserCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
    })

    return this.providerClient.send(command)
  }

  /**
   * Enables a previously disabled user's account in Cognito User Pool
   * @param cognitoId - Cognito ID of the user to enable
   * @returns Promise resolving to AdminEnableUserCommandOutput
   */
  enableUser(cognitoId: string) {
    const command = new AdminEnableUserCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
    })

    return this.providerClient.send(command)
  }

  /**
   * Resets a user's password in Cognito User Pool
   * @param cognitoId - Cognito ID of the user
   * @param newPassword - New password to set
   * @returns Promise resolving to AdminSetUserPasswordCommandOutput
   */
  resetUserPassword(cognitoId: string, newPassword: string) {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
      Password: newPassword,
      Permanent: true,
    })

    return this.providerClient.send(command)
  }

  /**
   * Gets user information from Cognito User Pool
   * @param cognitoId - Cognito ID of the user
   * @returns Promise resolving to AdminGetUserCommandOutput
   */
  getUserInfo(cognitoId: string) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
    })

    return this.providerClient.send(command)
  }

  /**
   * Updates user attributes in Cognito User Pool
   * @param cognitoId - Cognito ID of the user
   * @param attributes - Array of attributes to update
   * @returns Promise resolving to AdminUpdateUserAttributesCommandOutput
   */
  updateUserAttributes(cognitoId: string, attributes: { Name: string; Value: string }[]) {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
      UserAttributes: attributes,
    })

    return this.providerClient.send(command)
  }

  /**
   * Verifies user's password in Cognito User Pool
   * @param cognitoId - Cognito ID of the user to verify
   * @param password - Password to verify
   * @returns Promise resolving to AdminInitiateAuthCommandOutput if verification succeeds
   */
  verifyUserPassword(cognitoId: string, password: string) {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.userClientId,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: cognitoId,
        PASSWORD: password,
      },
    })

    return this.providerClient.send(command)
  }

  /**
   * Deletes a user from Cognito User Pool
   * @param cognitoId - Cognito ID of the user to delete
   * @returns Promise resolving to AdminDeleteUserCommandOutput
   */
  deleteUser(cognitoId: string) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: cognitoId,
    })

    return this.providerClient.send(command)
  }
}

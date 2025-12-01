import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw error when no token is provided
  handleRequest(err: any, user: any, info: any) {
    // Return user if valid, otherwise return undefined (don't throw)
    return user || undefined;
  }

  // Override canActivate to allow requests without tokens
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to activate the guard (will succeed if token is valid)
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      // If there's no token or token is invalid, allow the request to proceed
      // The user will just be undefined
      return true;
    }
  }
}


import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtConstants: JwtModuleAsyncOptions = {
  useFactory: ()=>{
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }
  }
};
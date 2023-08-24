import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import {PersonModule} from './docs/pes/pes.module'
import {SalesinvoiceModule} from './docs/si/si.module'

@Module({
    //define environment variables: MONGODB_URL='mongodb://<user>:<pass>@<host>:<port>/<db>?authMechanism=DEFAULT'
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot(process.env.MONGODB_URL),PersonModule,SalesinvoiceModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}

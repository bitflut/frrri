import { Module } from '@nestjs/common';
import { AdminApiModule } from './admin-api/admin-api.module';
import { PublicApiModule } from './public-api/public-api.module';

@Module({
    imports: [PublicApiModule, AdminApiModule],
    controllers: [],
    providers: [],
})
export class ApiModule { }

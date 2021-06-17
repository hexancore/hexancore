import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function injectSwagger(app: INestApplication, appName: string, appVersion?: string): void {
  const options = new DocumentBuilder()
    .setTitle(appName+' API')
    .setVersion(appVersion ?? "1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);
}
